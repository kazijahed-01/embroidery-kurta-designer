import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Package, Users, ShoppingBag, DollarSign, TrendingUp, Activity, Box, Scissors, Clock, CheckCircle, AlertCircle, XCircle,Truck } from 'lucide-react'

const stats = [
  { label: 'Total Users', value: '2,847', change: '+12%', icon: Users, color: 'from-pink-400 to-rose-500', bg: 'bg-pink-50' },
  { label: 'Total Orders', value: '1,234', change: '+8%', icon: Package, color: 'from-purple-400 to-pink-500', bg: 'bg-purple-50' },
  { label: 'Total Revenue', value: '₹18.7L', change: '+15%', icon: DollarSign, color: 'from-amber-400 to-orange-500', bg: 'bg-amber-50' },
  { label: 'Conversion Rate', value: '3.24%', change: '+0.5%', icon: TrendingUp, color: 'from-green-400 to-teal-500', bg: 'bg-green-50' },
]

const recentOrders = [
  { id: 'ORD-001', customer: 'Priya Sharma', items: 2, total: 2198, status: 'delivered', date: '2024-01-23' },
  { id: 'ORD-002', customer: 'Anjali Patel', items: 1, total: 1598, status: 'embroidery', date: '2024-01-23' },
  { id: 'ORD-003', customer: 'Kavya Reddy', items: 3, total: 3897, status: 'confirmed', date: '2024-01-22' },
  { id: 'ORD-004', customer: 'Meera Singh', items: 1, total: 1299, status: 'shipped', date: '2024-01-22' },
  { id: 'ORD-005', customer: 'Riya Gupta', items: 2, total: 2498, status: 'placed', date: '2024-01-21' },
]

const topProducts = [
  { name: 'Floral Dream Anarkali', sales: 156, revenue: 202644, category: 'Anarkali' },
  { name: 'Royal Paisley Straight', sales: 98, revenue: 146902, category: 'Straight Kurta' },
  { name: 'Bridal Bloom Long Kurta', sales: 67, revenue: 147333, category: 'Long Kurta' },
  { name: 'Cotton Comfort Straight', sales: 234, revenue: 186966, category: 'Straight Kurta' },
  { name: 'Silk Elegance A-Line', sales: 89, revenue: 115611, category: 'A-Line' },
]

const recentUsers = [
  { name: 'Sneha Kumar', email: 'sneha@email.com', orders: 3, spent: 4500, joined: '2024-01-20', status: 'active' },
  { name: 'Pooja Sharma', email: 'pooja@email.com', orders: 1, spent: 899, joined: '2024-01-19', status: 'active' },
  { name: 'Divya Patel', email: 'divya@email.com', orders: 0, spent: 0, joined: '2024-01-18', status: 'new' },
  { name: 'Aisha Khan', email: 'aisha@email.com', orders: 2, spent: 3200, joined: '2024-01-17', status: 'active' },
  { name: 'Ritika Joshi', email: 'ritika@email.com', orders: 1, spent: 1299, joined: '2024-01-16', status: 'active' },
]

const statusConfig = {
  placed: { label: 'Placed', color: 'bg-pink-100 text-pink-700', icon: Clock },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-700', icon: CheckCircle },
  designing: { label: 'Designing', color: 'bg-purple-100 text-purple-700', icon: Activity },
  embroidery: { label: 'Embroidery', color: 'bg-amber-100 text-amber-700', icon: Scissors },
  shipped: { label: 'Shipped', color: 'bg-green-100 text-green-700', icon: Truck },
  delivered: { label: 'Delivered', color: 'bg-rose-100 text-rose-700', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700', icon: XCircle },
}

export function AdminDashboard() {
  const [timeRange, setTimeRange] = useState('7d')

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="font-playfair text-3xl md:text-4xl font-bold bg-gradient-pink-dark bg-clip-text text-transparent">
            Admin Dashboard 👑
          </h1>
          <p className="font-poppins text-pink-500 mt-1">Overview of your embroidery business ✨</p>
        </div>
        <div className="flex gap-2">
          {['7d', '30d', '90d', '1y'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-xl font-poppins font-medium text-sm transition-all duration-300 ${
                timeRange === range
                  ? 'bg-gradient-pink-dark text-white shadow-md shadow-pink-300/50'
                  : 'bg-pink-50 text-pink-600 hover:bg-pink-100'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
            className={`card-elevated p-6 ${stat.bg}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-poppins text-sm text-pink-500">{stat.label}</p>
                <p className="font-playfair text-3xl font-bold bg-gradient-to-r {stat.color} bg-clip-text text-transparent mt-1">
                  {stat.value}
                </p>
                <p className="font-poppins text-sm text-green-600 mt-1">{stat.change} vs last period</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r {stat.color} flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="lg:col-span-2 space-y-6"
        >
          <div className="card-elevated p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-playfair text-xl font-bold text-pink-800">Recent Orders</h2>
              <a href="/admin/orders" className="btn-ghost text-sm">View All →</a>
            </div>
            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="font-mono font-medium text-pink-700">{order.id}</td>
                      <td className="font-poppins text-pink-800">{order.customer}</td>
                      <td className="font-poppins text-gray-600">{order.items} item{order.items !== 1 ? 's' : ''}</td>
                      <td className="font-playfair font-bold text-pink-700">₹{order.total}</td>
                      <td>
                        <span className={`px-3 py-1 rounded-full text-xs font-poppins font-medium ${statusConfig[order.status].color}`}>
                          {(() => { const Icon = statusConfig[order.status].icon; return <Icon className="w-3 h-3 inline mr-1" /> })()}
                          {statusConfig[order.status].label}
                        </span>
                      </td>
                      <td className="font-poppins text-sm text-pink-500">{order.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card-elevated p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-playfair text-xl font-bold text-pink-800">Top Selling Products</h2>
              <a href="/admin/products" className="btn-ghost text-sm">View All →</a>
            </div>
            <div className="space-y-4">
              {topProducts.map((product, i) => (
                <motion.div
                  key={product.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  className="flex items-center gap-4 p-4 bg-pink-50 rounded-xl hover:bg-pink-100 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-pink-dark flex items-center justify-center text-white font-bold">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-playfair font-bold text-pink-800 truncate">{product.name}</p>
                    <p className="font-poppins text-sm text-pink-500">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-playfair font-bold text-pink-700">{product.sales} sold</p>
                    <p className="font-poppins text-sm text-pink-500">₹{product.revenue.toLocaleString()}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="space-y-6"
        >
          <div className="card-elevated p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-playfair text-xl font-bold text-pink-800">Quick Actions</h2>
            </div>
            <div className="space-y-3">
              <a href="/admin/products" className="block p-4 rounded-xl bg-pink-50 hover:bg-pink-100 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-pink-400 to-rose-400 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    <Box className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-playfair font-medium text-pink-800">Add New Product</p>
                    <p className="font-poppins text-sm text-pink-500">Create kurta designs</p>
                  </div>
                </div>
              </a>
              <a href="/admin/embroidery" className="block p-4 rounded-xl bg-pink-50 hover:bg-pink-100 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    <Scissors className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-playfair font-medium text-pink-800">Manage Embroidery</p>
                    <p className="font-poppins text-sm text-pink-500">Add embroidery designs</p>
                  </div>
                </div>
              </a>
              <a href="/admin/orders" className="block p-4 rounded-xl bg-pink-50 hover:bg-pink-100 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-playfair font-medium text-pink-800">Process Orders</p>
                    <p className="font-poppins text-sm text-pink-500">Update order status</p>
                  </div>
                </div>
              </a>
              <a href="/admin/users" className="block p-4 rounded-xl bg-pink-50 hover:bg-pink-100 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-green-400 to-teal-500 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-playfair font-medium text-pink-800">Manage Users</p>
                    <p className="font-poppins text-sm text-pink-500">View customer details</p>
                  </div>
                </div>
              </a>
            </div>
          </div>

          <div className="card-elevated p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-playfair text-xl font-bold text-pink-800">New Users</h2>
              <a href="/admin/users" className="btn-ghost text-sm">View All →</a>
            </div>
            <div className="space-y-3">
              {recentUsers.map((user, i) => (
                <motion.div
                  key={user.email}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  className="flex items-center gap-3 p-3 bg-pink-50 rounded-xl hover:bg-pink-100 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-pink flex items-center justify-center text-white font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-playfair font-medium text-pink-800 truncate">{user.name}</p>
                    <p className="font-poppins text-sm text-pink-500 truncate">{user.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-poppins text-sm text-pink-600">{user.orders} orders</p>
                    <p className="font-poppins text-xs text-pink-500">₹{user.spent}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-poppins ${user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {user.status}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.aside>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="grid md:grid-cols-3 gap-4"
      >
        <div className="card-elevated p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-pink-400 to-rose-400 flex items-center justify-center">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <h3 className="font-playfair text-xl font-bold text-pink-800">Live Activity</h3>
          <p className="font-poppins text-pink-500 mt-2">3 users designing</p>
          <p className="font-poppins text-pink-500">2 orders processing</p>
          <p className="font-poppins text-pink-500">1 new signup</p>
        </div>
        <div className="card-elevated p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h3 className="font-playfair text-xl font-bold text-pink-800">Popular Categories</h3>
          <div className="flex flex-wrap justify-center gap-2 mt-3">
            <span className="badge badge-pink">Floral</span>
            <span className="badge badge-pink">Traditional</span>
            <span className="badge badge-rose">Bridal</span>
            <span className="badge badge-rose">Minimal</span>
          </div>
        </div>
        <div className="card-elevated p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center">
            <DollarSign className="w-8 h-8 text-white" />
          </div>
          <h3 className="font-playfair text-xl font-bold text-pink-800">Revenue Target</h3>
          <p className="font-playfair text-2xl font-bold bg-gradient-pink-dark bg-clip-text text-transparent mt-2">₹18.7L / ₹25L</p>
          <div className="w-full bg-pink-100 rounded-full h-2 mt-3 overflow-hidden">
            <div className="bg-gradient-pink-dark h-full rounded-full" style={{ width: '75%' }} />
          </div>
        </div>
      </motion.div>
    </div>
  )
}