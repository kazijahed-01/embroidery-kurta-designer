import express from 'express'
import { body, query, validationResult } from 'express-validator'
import { supabase } from '../lib/supabase.js'
import { authMiddleware } from '../middleware/auth.js'
import { catchAsync, AppError } from '../middleware/errorHandler.js'

const router = express.Router()

const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  next()
}

router.get('/', authMiddleware, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
], catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 20
  const offset = (page - 1) * limit

  let query = supabase
    .from('user_designs')
    .select('*', { count: 'exact' })
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

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

router.post('/', authMiddleware, [
  body('name').trim().notEmpty(),
  body('kurta_style').isIn(['Straight Kurta', 'Anarkali', 'A-Line', 'Short Kurti', 'Long Kurta', 'Western Kurti']),
  body('fabric').isIn(['Cotton', 'Silk', 'Linen', 'Chanderi', 'Rayon']),
  body('color').isString(),
  body('embroidery_design').isString(),
  body('embroidery_position').isIn(['neck', 'chest', 'sleeves', 'front', 'back', 'bottom']),
  body('size').isIn(['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL']),
  body('customizations').isObject(),
  body('base_price').isFloat({ min: 0 }),
  body('embroidery_price').isFloat({ min: 0 }),
  body('customization_price').isFloat({ min: 0 }),
  body('total_price').isFloat({ min: 0 }),
  validate
], catchAsync(async (req, res) => {
  const designData = {
    ...req.body,
    user_id: req.user.id
  }

  const { data, error } = await supabase
    .from('user_designs')
    .insert(designData)
    .select()
    .single()

  if (error) throw new AppError(error.message, 400)

  res.status(201).json({ design: data })
}))

router.put('/:id', authMiddleware, catchAsync(async (req, res) => {
  const { data, error } = await supabase
    .from('user_designs')
    .update(req.body)
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .select()
    .single()

  if (error) throw new AppError(error.message, 400)

  res.json({ design: data })
}))

router.delete('/:id', authMiddleware, catchAsync(async (req, res) => {
  const { error } = await supabase
    .from('user_designs')
    .delete()
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)

  if (error) throw new AppError(error.message, 400)

  res.json({ message: 'Design deleted successfully' })
}))

router.post('/:id/duplicate', authMiddleware, catchAsync(async (req, res) => {
  const { data: original, error: fetchError } = await supabase
    .from('user_designs')
    .select('*')
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .single()

  if (fetchError) throw new AppError('Design not found', 404)

  const { name, ...designData } = original
  designData.name = `${name} (Copy)`
  designData.user_id = req.user.id
  designData.id = undefined
  designData.created_at = undefined
  designData.updated_at = undefined

  const { data, error } = await supabase
    .from('user_designs')
    .insert(designData)
    .select()
    .single()

  if (error) throw new AppError(error.message, 400)

  res.status(201).json({ design: data })
}))

export default router