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

router.get('/overview', authMiddleware, adminMiddleware, catchAsync(async (req, res) => {
  const { data: users } = await supabase
    .from('profiles')
    .select('id', { count: 'exact' })
    .eq('role', 'user')

  const { data: orders } = await supabase
    .from('orders')
    .select('total, status', { count: 'exact' })

  const totalRevenue = orders?.reduce((sum, o) => sum + o.total, 0) || 0
  const totalOrders = orders?.length || 0
  const deliveredOrders = orders?.filter(o => o.status === 'delivered').length || 0
  const conversionRate = totalOrders > 0 ? ((deliveredOrders / totalOrders) * 100).toFixed(2) : 0

  res.json({
    totalUsers: users?.count || 0,
    totalOrders,
    totalRevenue,
    conversionRate: parseFloat(conversionRate),
    avgOrderValue: totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0
  })
}))

router.get('/revenue', authMiddleware, adminMiddleware, [
  query('period').optional().isIn(['7d', '30d', '90d', '12m', 'all']),
], catchAsync(async (req, res) => {
  const period = req.query.period || '12m'
  const days = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 365
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()

  const { data: orders, error } = await supabase
    .from('orders')
    .select('total, created_at')
    .gte('created_at', startDate)
    .order('created_at')

  if (error) throw new AppError(error.message, 400)

  const dailyRevenue = {}
  orders?.forEach(order => {
    const date = order.created_at.split('T')[0]
    dailyRevenue[date] = (dailyRevenue[date] || 0) + order.total
  })

  const revenueData = Object.entries(dailyRevenue).map(([date, revenue]) => ({
    date,
    revenue
  }))

  res.json({ revenueData })
}))

router.get('/categories', authMiddleware, adminMiddleware, catchAsync(async (req, res) => {
  const { data: orders } = await supabase
    .from('orders')
    .select(`
      total,
      order_items (
        products (style, fabric),
        embroidery_designs (category)
      )
    `)

  const categoryStats = {}
  const fabricStats = {}
  const styleStats = {}

  orders?.forEach(order => {
    order.order_items?.forEach(item => {
      if (item.products) {
        const style = item.products.style
        const fabric = item.products.fabric
        styleStats[style] = (styleStats[style] || 0) + order.total / order.order_items.length
        fabricStats[fabric] = (fabricStats[fabric] || 0) + order.total / order.order_items.length
      }
      if (item.embroidery_designs) {
        const category = item.embroidery_designs.category
        categoryStats[category] = (categoryStats[category] || 0) + order.total / order.order_items.length
      }
    })
  })

  res.json({
    categoryStats: Object.entries(categoryStats).map(([category, revenue]) => ({ category, revenue })),
    fabricStats: Object.entries(fabricStats).map(([fabric, revenue]) => ({ fabric, revenue })),
    styleStats: Object.entries(styleStats).map(([style, revenue]) => ({ style, revenue }))
  })
}))

router.get('/top-products', authMiddleware, adminMiddleware, [
  query('limit').optional().isInt({ min: 1, max: 50 }),
], catchAsync(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10

  const { data: orders } = await supabase
    .from('orders')
    .select(`
      order_items (
        quantity,
        products (id, name, style, fabric, image)
      )
    `)
    .eq('status', 'delivered')

  const productStats = {}
  orders?.forEach(order => {
    order.order_items?.forEach(item => {
      if (item.products) {
        const key = item.products.id
        if (!productStats[key]) {
          productStats[key] = {
            ...item.products,
            sales: 0,
            revenue: 0
          }
        }
        productStats[key].sales += item.quantity
        productStats[key].revenue += item.quantity * 1000
      }
    })
  })

  const topProducts = Object.values(productStats)
    .sort((a, b) => b.sales - a.sales)
    .slice(0, limit)

  res.json({ topProducts })
}))

router.get('/top-customers', authMiddleware, adminMiddleware, [
  query('limit').optional().isInt({ min: 1, max: 50 }),
], catchAsync(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10

  const { data: orders } = await supabase
    .from('orders')
    .select(`
      total,
      profiles!orders_user_id_fkey (id, name, email, avatar_url)
    `)
    .eq('status', 'delivered')

  const customerStats = {}
  orders?.forEach(order => {
    if (order.profiles) {
      const key = order.profiles.id
      if (!customerStats[key]) {
        customerStats[key] = {
          ...order.profiles,
          orders: 0,
          spent: 0
        }
      }
      customerStats[key].orders++
      customerStats[key].spent += order.total
    }
  })

  const topCustomers = Object.values(customerStats)
    .sort((a, b) => b.spent - a.spent)
    .slice(0, limit)

  res.json({ topCustomers })
}))

router.get('/growth', authMiddleware, adminMiddleware, [
  query('period').optional().isIn(['7d', '30d', '90d', '12m']),
], catchAsync(async (req, res) => {
  const period = req.query.period || '30d'
  const days = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 365
  const currentStart = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
  const previousStart = new Date(Date.now() - 2 * days * 24 * 60 * 60 * 1000).toISOString()
  const previousEnd = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()

  const [currentOrders, previousOrders, currentUsers, previousUsers] = await Promise.all([
    supabase.from('orders').select('total').gte('created_at', currentStart),
    supabase.from('orders').select('total').gte('created_at', previousStart).lte('created_at', previousEnd),
    supabase.from('profiles').select('id', { count: 'exact' }).gte('created_at', currentStart).eq('role', 'user'),
    supabase.from('profiles').select('id', { count: 'exact' }).gte('created_at', previousStart).lte('created_at', previousEnd).eq('role', 'user')
  ])

  const currentRevenue = currentOrders.data?.reduce((sum, o) => sum + o.total, 0) || 0
  const previousRevenue = previousOrders.data?.reduce((sum, o) => sum + o.total, 0) || 0
  const currentOrderCount = currentOrders.data?.length || 0
  const previousOrderCount = previousOrders.data?.length || 0

  const calculateGrowth = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0
    return ((current - previous) / previous * 100).toFixed(1)
  }

  res.json({
    revenue: {
      current: currentRevenue,
      previous: previousRevenue,
      growth: calculateGrowth(currentRevenue, previousRevenue)
    },
    orders: {
      current: currentOrderCount,
      previous: previousOrderCount,
      growth: calculateGrowth(currentOrderCount, previousOrderCount)
    },
    newUsers: {
      current: currentUsers.count || 0,
      previous: previousUsers.count || 0,
      growth: calculateGrowth(currentUsers.count || 0, previousUsers.count || 0)
    }
  })
}))

export default router