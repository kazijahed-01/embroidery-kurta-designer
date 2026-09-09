import express from 'express'
import { body, query, validationResult } from 'express-validator'
import { supabase } from '../lib/supabase.js'
import { authMiddleware, adminMiddleware } from '../middleware/auth.js'
import { catchAsync, AppError } from '../middleware/errorHandler.js'

const router = express.Router()

const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  next()
}

router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('search').optional().isString(),
  query('style').optional().isString(),
  query('fabric').optional().isString(),
  query('status').optional().isIn(['active', 'draft', 'archived']),
], catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 20
  const offset = (page - 1) * limit

  let query = supabase
    .from('products')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (req.query.search) {
    query = query.ilike('name', `%${req.query.search}%`)
  }
  if (req.query.style) {
    query = query.eq('style', req.query.style)
  }
  if (req.query.fabric) {
    query = query.eq('fabric', req.query.fabric)
  }
  if (req.query.status) {
    query = query.eq('status', req.query.status)
  }

  const { data, error, count } = await query

  if (error) throw new AppError(error.message, 400)

  res.json({
    products: data,
    pagination: {
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit)
    }
  })
}))

router.get('/:id', catchAsync(async (req, res) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', req.params.id)
    .single()

  if (error) throw new AppError('Product not found', 404)

  res.json({ product: data })
}))

router.post('/', authMiddleware, adminMiddleware, [
  body('name').trim().notEmpty(),
  body('style').isIn(['Straight Kurta', 'Anarkali', 'A-Line', 'Short Kurti', 'Long Kurta', 'Western Kurti']),
  body('fabric').isIn(['Cotton', 'Silk', 'Linen', 'Chanderi', 'Rayon']),
  body('base_price').isFloat({ min: 0 }),
  body('embroidery_price').isFloat({ min: 0 }),
  body('status').optional().isIn(['active', 'draft', 'archived']),
  validate
], catchAsync(async (req, res) => {
  const productData = {
    ...req.body,
    created_by: req.user.id
  }

  const { data, error } = await supabase
    .from('products')
    .insert(productData)
    .select()
    .single()

  if (error) throw new AppError(error.message, 400)

  res.status(201).json({ product: data })
}))

router.put('/:id', authMiddleware, adminMiddleware, catchAsync(async (req, res) => {
  const { data, error } = await supabase
    .from('products')
    .update(req.body)
    .eq('id', req.params.id)
    .select()
    .single()

  if (error) throw new AppError(error.message, 400)

  res.json({ product: data })
}))

router.delete('/:id', authMiddleware, adminMiddleware, catchAsync(async (req, res) => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', req.params.id)

  if (error) throw new AppError(error.message, 400)

  res.json({ message: 'Product deleted successfully' })
}))

export default router