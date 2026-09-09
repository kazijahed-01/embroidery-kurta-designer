import express from 'express'
import { query, body, validationResult } from 'express-validator'
import { supabase } from '../lib/supabase.js'
import { authMiddleware, adminMiddleware, optionalAuth } from '../middleware/auth.js'
import { catchAsync, AppError } from '../middleware/errorHandler.js'

const router = express.Router()

const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  next()
}

const orderStatuses = ['placed', 'confirmed', 'designing', 'embroidery', 'quality', 'shipped', 'delivered', 'cancelled']

router.get('/', authMiddleware, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(orderStatuses),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
], catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 20
  const offset = (page - 1) * limit

  const isAdmin = req.user.role === 'admin'
  const userId = isAdmin ? undefined : req.user.id

  let query = supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        products (name, image, style, fabric),
        embroidery_designs (name, image)
      )
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (userId) {
    query = query.eq('user_id', userId)
  }
  if (req.query.status) {
    query = query.eq('status', req.query.status)
  }
  if (req.query.startDate) {
    query = query.gte('created_at', req.query.startDate)
  }
  if (req.query.endDate) {
    query = query.lte('created_at', req.query.endDate)
  }

  const { data, error, count } = await query

  if (error) throw new AppError(error.message, 400)

  res.json({
    orders: data,
    pagination: {
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit)
    }
  })
}))

router.get('/:id', authMiddleware, catchAsync(async (req, res) => {
  const isAdmin = req.user.role === 'admin'

  let query = supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        products (name, image, style, fabric, base_price),
        embroidery_designs (name, image, price)
      ),
      profiles!orders_user_id_fkey (name, email, phone)
    `)
    .eq('id', req.params.id)

  if (!isAdmin) {
    query = query.eq('user_id', req.user.id)
  }

  const { data, error } = await query.single()

  if (error) throw new AppError('Order not found', 404)

  res.json({ order: data })
}))

router.post('/', authMiddleware, optionalAuth, [
  body('items').isArray({ min: 1 }),
  body('items.*.product_id').optional().isUUID(),
  body('items.*.design_id').optional().isUUID(),
  body('items.*.quantity').isInt({ min: 1 }),
  body('items.*.size').isString(),
  body('shipping_address').isObject(),
  body('payment_method').isIn(['cod', 'upi', 'card', 'wallet']),
  validate
], catchAsync(async (req, res) => {
  const { items, shipping_address, payment_method, promo_code } = req.body
  const userId = req.user?.id

  let subtotal = 0
  const orderItems = []

  for (const item of items) {
    if (item.product_id) {
      const { data: product } = await supabase
        .from('products')
        .select('*')
        .eq('id', item.product_id)
        .single()
      
      if (product) {
        const itemTotal = (product.base_price + product.embroidery_price) * item.quantity
        subtotal += itemTotal
        orderItems.push({
          product_id: product.id,
          quantity: item.quantity,
          size: item.size,
          unit_price: product.base_price + product.embroidery_price
        })
      }
    } else if (item.design_id) {
      const { data: design } = await supabase
        .from('user_designs')
        .select('*')
        .eq('id', item.design_id)
        .single()
      
      if (design) {
        const itemTotal = design.total_price * item.quantity
        subtotal += itemTotal
        orderItems.push({
          design_id: design.id,
          quantity: item.quantity,
          size: item.size,
          unit_price: design.total_price
        })
      }
    }
  }

  const shipping = subtotal > 2000 ? 0 : 99
  let discount = 0

  if (promo_code) {
    const { data: promo } = await supabase
      .from('promo_codes')
      .select('*')
      .eq('code', promo_code.toUpperCase())
      .eq('is_active', true)
      .single()
    
    if (promo && new Date(promo.expires_at) > new Date()) {
      discount = promo.discount_type === 'percentage' 
        ? Math.round(subtotal * promo.discount_value / 100)
        : promo.discount_value
    }
  }

  const total = subtotal + shipping - discount

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: userId,
      subtotal,
      shipping,
      discount,
      total,
      status: 'placed',
      payment_method,
      shipping_address,
      promo_code
    })
    .select()
    .single()

  if (orderError) throw new AppError(orderError.message, 400)

  const itemsToInsert = orderItems.map(item => ({
    order_id: order.id,
    ...item
  }))

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(itemsToInsert)

  if (itemsError) throw new AppError(itemsError.message, 400)

  if (userId) {
    await supabase.from('cart_items').delete().eq('user_id', userId)
  }

  res.status(201).json({ order })
}))

router.put('/:id/status', authMiddleware, adminMiddleware, [
  body('status').isIn(orderStatuses),
  body('tracking_number').optional().isString(),
  validate
], catchAsync(async (req, res) => {
  const { status, tracking_number } = req.body

  const updates = { status }
  if (tracking_number) updates.tracking_number = tracking_number
  if (status === 'shipped') updates.shipped_at = new Date().toISOString()
  if (status === 'delivered') updates.delivered_at = new Date().toISOString()

  const { data, error } = await supabase
    .from('orders')
    .update(updates)
    .eq('id', req.params.id)
    .select()
    .single()

  if (error) throw new AppError(error.message, 400)

  res.json({ order: data })
}))

router.delete('/:id', authMiddleware, adminMiddleware, catchAsync(async (req, res) => {
  const { error } = await supabase
    .from('orders')
    .update({ status: 'cancelled' })
    .eq('id', req.params.id)

  if (error) throw new AppError(error.message, 400)

  res.json({ message: 'Order cancelled successfully' })
}))

export default router