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
  query('category').optional().isString(),
  query('status').optional().isIn(['active', 'draft', 'archived']),
], catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 20
  const offset = (page - 1) * limit

  let query = supabase
    .from('embroidery_designs')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (req.query.search) {
    query = query.ilike('name', `%${req.query.search}%`)
  }
  if (req.query.category) {
    query = query.eq('category', req.query.category)
  }
  if (req.query.status) {
    query = query.eq('status', req.query.status)
  }

  const { data, error, count } = await query

  if (error) throw new AppError(error.message, 400)

  res.json({
    designs: data,
    pagination: {
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit)
    }
  })
}))

router.get('/categories', catchAsync(async (req, res) => {
  const { data, error } = await supabase
    .from('embroidery_designs')
    .select('category')
    .neq('category', null)

  if (error) throw new AppError(error.message, 400)

  const categories = [...new Set(data.map(d => d.category))]
  res.json({ categories })
}))

router.get('/positions', catchAsync(async (req, res) => {
  const positions = [
    { id: 'neck', name: 'Neck', x: 50, y: 15 },
    { id: 'chest', name: 'Chest', x: 50, y: 35 },
    { id: 'sleeves', name: 'Sleeves', x: 15, y: 40 },
    { id: 'front', name: 'Front Center', x: 50, y: 55 },
    { id: 'back', name: 'Back Center', x: 50, y: 55 },
    { id: 'bottom', name: 'Bottom Hem', x: 50, y: 85 }
  ]
  res.json({ positions })
}))

router.post('/', authMiddleware, adminMiddleware, [
  body('name').trim().notEmpty(),
  body('category').isIn(['Nature', 'Traditional', 'Modern', 'Heritage', 'Contemporary', 'Premium', 'Spiritual']),
  body('price').isFloat({ min: 0 }),
  body('positions').isArray({ min: 1 }),
  body('positions.*').isIn(['neck', 'chest', 'sleeves', 'front', 'back', 'bottom']),
  validate
], catchAsync(async (req, res) => {
  const designData = {
    ...req.body,
    created_by: req.user.id
  }

  const { data, error } = await supabase
    .from('embroidery_designs')
    .insert(designData)
    .select()
    .single()

  if (error) throw new AppError(error.message, 400)

  res.status(201).json({ design: data })
}))

router.put('/:id', authMiddleware, adminMiddleware, catchAsync(async (req, res) => {
  const { data, error } = await supabase
    .from('embroidery_designs')
    .update(req.body)
    .eq('id', req.params.id)
    .select()
    .single()

  if (error) throw new AppError(error.message, 400)

  res.json({ design: data })
}))

router.delete('/:id', authMiddleware, adminMiddleware, catchAsync(async (req, res) => {
  const { error } = await supabase
    .from('embroidery_designs')
    .delete()
    .eq('id', req.params.id)

  if (error) throw new AppError(error.message, 400)

  res.json({ message: 'Design deleted successfully' })
}))

export default router