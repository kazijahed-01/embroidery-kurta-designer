import express from 'express'
import { body, validationResult } from 'express-validator'
import { supabase } from '../lib/supabase.js'
import { authMiddleware, optionalAuth } from '../middleware/auth.js'
import { catchAsync, AppError } from '../middleware/errorHandler.js'

const router = express.Router()

const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  next()
}

router.get('/', authMiddleware, catchAsync(async (req, res) => {
  const { data, error } = await supabase
    .from('cart_items')
    .select(`
      *,
      products (
        id,
        name,
        style,
        fabric,
        color,
        embroidery_design,
        embroidery_position,
        embroidery_color,
        preview_image,
        base_price,
        embroidery_price,
        customization_price
      ),
      user_designs (
        id,
        name,
        kurta_style,
        fabric,
        color,
        embroidery_design,
        embroidery_position,
        embroidery_color,
        preview_image,
        base_price,
        embroidery_price,
        customization_price
      )
    `)
    .eq('user_id', req.user.id)

  if (error) throw new AppError(error.message, 400)

  const total = data?.reduce((sum, item) => {
    const product = item.products || item.user_designs
    if (!product) return sum
    return sum + (product.base_price + product.embroidery_price + product.customization_price) * item.quantity
  }, 0) || 0

  const count = data?.reduce((sum, item) => sum + item.quantity, 0) || 0

  res.json({ items: data, total, count })
}))

router.post('/', authMiddleware, [
  body('product_id').optional().isUUID(),
  body('design_id').optional().isUUID(),
  body('quantity').isInt({ min: 1, max: 99 }),
  body('size').isIn(['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL']),
  validate
], catchAsync(async (req, res) => {
  const { product_id, design_id, quantity, size } = req.body

  if (!product_id && !design_id) {
    throw new AppError('Either product_id or design_id is required', 400)
  }

  const { data: existing } = await supabase
    .from('cart_items')
    .select('*')
    .eq('user_id', req.user.id)
    .eq(product_id ? 'product_id' : 'design_id', product_id || design_id)
    .eq('size', size)
    .single()

  if (existing) {
    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity: existing.quantity + quantity })
      .eq('id', existing.id)
      .select()
      .single()

    if (error) throw new AppError(error.message, 400)
    return res.json({ item: data })
  }

  const { data, error } = await supabase
    .from('cart_items')
    .insert({
      user_id: req.user.id,
      product_id,
      design_id,
      quantity,
      size
    })
    .select()
    .single()

  if (error) throw new AppError(error.message, 400)

  res.status(201).json({ item: data })
}))

router.put('/:id', authMiddleware, [
  body('quantity').isInt({ min: 1, max: 99 }),
  validate
], catchAsync(async (req, res) => {
  const { quantity } = req.body

  const { data, error } = await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .select()
    .single()

  if (error) throw new AppError(error.message, 400)

  res.json({ item: data })
}))

router.delete('/:id', authMiddleware, catchAsync(async (req, res) => {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)

  if (error) throw new AppError(error.message, 400)

  res.json({ message: 'Item removed from cart' })
}))

router.delete('/', authMiddleware, catchAsync(async (req, res) => {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', req.user.id)

  if (error) throw new AppError(error.message, 400)

  res.json({ message: 'Cart cleared' })
}))

export default router