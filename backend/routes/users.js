import express from 'express'
import { query, validationResult } from 'express-validator'
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

router.get('/', authMiddleware, adminMiddleware, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('search').optional().isString(),
  query('status').optional().isIn(['active', 'inactive', 'new', 'banned']),
  query('role').optional().isIn(['user', 'vip', 'admin']),
], catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 20
  const offset = (page - 1) * limit

  let query = supabase
    .from('profiles')
    .select(`
      *,
      orders:orders(count)
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (req.query.search) {
    query = query.or(`name.ilike.%${req.query.search}%,email.ilike.%${req.query.search}%`)
  }
  if (req.query.status) {
    query = query.eq('status', req.query.status)
  }
  if (req.query.role) {
    query = query.eq('role', req.query.role)
  }

  const { data, error, count } = await query

  if (error) throw new AppError(error.message, 400)

  const usersWithStats = await Promise.all(data.map(async (user) => {
    const { data: orders } = await supabase
      .from('orders')
      .select('total')
      .eq('user_id', user.id)
      .eq('status', 'delivered')

    const totalSpent = orders?.reduce((sum, o) => sum + o.total, 0) || 0

    return {
      ...user,
      order_count: orders?.length || 0,
      total_spent: totalSpent
    }
  }))

  res.json({
    users: usersWithStats,
    pagination: {
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit)
    }
  })
}))

router.get('/:id', authMiddleware, adminMiddleware, catchAsync(async (req, res) => {
  const { data: user, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', req.params.id)
    .single()

  if (error) throw new AppError('User not found', 404)

  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10)

  const { data: designs } = await supabase
    .from('user_designs')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10)

  const { data: addresses } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', user.id)

  res.json({ user: { ...user, orders, designs, addresses } })
}))

router.put('/:id', authMiddleware, adminMiddleware, catchAsync(async (req, res) => {
  const { status, role, ...updates } = req.body

  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, status, role })
    .eq('id', req.params.id)
    .select()
    .single()

  if (error) throw new AppError(error.message, 400)

  res.json({ user: data })
}))

router.delete('/:id', authMiddleware, adminMiddleware, catchAsync(async (req, res) => {
  if (req.params.id === req.user.id) {
    throw new AppError('Cannot delete your own account', 400)
  }

  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', req.params.id)

  if (error) throw new AppError(error.message, 400)

  res.json({ message: 'User deleted successfully' })
}))

export default router