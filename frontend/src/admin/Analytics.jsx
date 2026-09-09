import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Users, ShoppingBag, DollarSign, Clock, Target, Award, Download, Smartphone, Mail } from 'lucide-react'

const revenueData = [
  { month: 'Jan', revenue: 120000, orders: 45, users: 120 },
  { month: 'Feb', revenue: 135000, orders: 52, users: 135 },
  { month: 'Mar', revenue: 148000, orders: 48, users: 142 },
  { month: 'Apr', revenue: 165000, orders: 61, users: 158 },
  { month: 'May', revenue: 180000, orders: 55, users: 167 },
  { month: 'Jun', revenue: 172000, orders: 58, users: 159 },
  { month: 'Jul', revenue: 190000, orders: 67, users: 178 },
  { month: 'Aug', revenue: 205000, orders: 72, users: 189 },
  { month: 'Sep', revenue: 198000, orders: 69, users: 182 },
  { month: 'Oct', revenue: 220000, orders: 78, users: 195 },
  { month: 'Nov', revenue: 235000, orders: 82, users: 210 },
  { month: 'Dec', revenue: 250000, orders: 95, users: 234 },
]

const categoryData = [
  { category: 'Anarkali', revenue: 450000, orders: 234, color: '#ec4899' },
  { category: 'Straight Kurta', revenue: 380000, orders: 312, color: '#f472b6' },
  { category: 'A-Line', revenue: 220000, orders: 156, color: '#f9a8d4' },
  { category: 'Western Kurti', revenue: 180000, orders: 189, color: '#fbcfe8' },
  { category: 'Long Kurta', revenue: 165000, orders: 123, color: '#fce7f3' },
  { category: 'Short Kurti', revenue: 95000, orders: 87, color: '#fdf2f8' },
]

const fabricData = [
  { fabric: 'Silk', revenue: 520000, percentage: 35 },
  { fabric: 'Cotton', revenue: 480000, percentage: 32 },
  { fabric: 'Chanderi', revenue: 280000, percentage: 19 },
  { fabric: 'Linen', revenue: 150000, percentage: 10 },
  { fabric: 'Rayon', revenue: 60000, percentage: 4 },
]

const topCustomers = [
  { name: 'Kavya Reddy', orders: 8, spent: 15600, avatar: '👩', lastOrder: '2024-01-23' },
  { name: 'Priya Sharma', orders: 5, spent: 8500, avatar: '👩', lastOrder: '2024-01-23' },
  { name: 'Riya Gupta', orders: 2, spent: 3400, avatar: '👩‍🦳', lastOrder: '2024-01-22' },
  { name: 'Anjali Patel', orders: 3, spent: 4200, avatar: '👩‍🦱', lastOrder: '2024-01-22' },
  { name: 'Meera Singh', orders: 1, spent: 1299, avatar: '👩‍🦰', lastOrder: '2024-01-20' },
]

const monthlyGrowth = [
  { metric: 'Revenue', current: 250000, previous: 235000, unit: '₹' },
  { metric: 'Orders', current: 95, previous: 82, unit: '' },
  { metric: 'New Users', current: 234, previous: 210, unit: '' },
  { metric: 'Avg Order Value', current: 2631, previous: 2865, unit: '₹' },
  { metric: 'Conversion Rate', current: 3.8, previous: 3.4, unit: '%' },
  { metric: 'Return Rate', current: 2.1, previous: 2.8, unit: '%' },
]

export function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState('12m')
  const [chartType, setChartType] = useState('revenue')

  const calculateGrowth = (current, previous) => {
    if (previous === 0) return 0
    return ((current - previous) / previous * 100).toFixed(1)
  }

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
            Analytics 📊
          </h1>
          <p className="font-poppins text-pink-500 mt-1">Business insights and performance metrics ✨</p>
        </div>
        <div className="flex gap-2">
          <div className="flex gap-1 bg-pink-50 rounded-xl p-1" role="group" aria-label="Time range">
            {['7d', '30d', '90d', '12m'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg font-poppins font-medium text-sm transition-all duration-300 ${
                  timeRange === range
                    ? 'bg-white text-pink-600 shadow-sm'
                    : 'text-pink-400 hover:text-pink-600'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          <button className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {monthlyGrowth.map((metric, i) => {
          const growth = calculateGrowth(metric.current, metric.previous)
          const isPositive = parseFloat(growth) >= 0
          return (
            <motion.div
              key={metric.metric}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              className="card-elevated p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-poppins text-sm text-pink-500">{metric.metric}</p>
                  <p className="font-playfair text-2xl font-bold text-pink-800 mt-1">
                    {metric.unit}{typeof metric.current === 'number' ? metric.current.toLocaleString() : metric.current}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isPositive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  {isPositive ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
                </div>
              </div>
              <p className={`font-poppins text-sm mt-2 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {isPositive ? '+' : ''}{growth}% vs last period
              </p>
            </motion.div>
          )
        })}
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
              <h2 className="font-playfair text-xl font-bold text-pink-800">Revenue & Orders Trend</h2>
              <div className="flex gap-2" role="group" aria-label="Chart type">
                {['revenue', 'orders', 'users'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setChartType(type)}
                    className={`px-3 py-1 rounded-lg text-sm font-poppins transition-colors ${
                      chartType === type
                        ? 'bg-gradient-pink-dark text-white'
                        : 'text-pink-500 hover:bg-pink-50'
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-80 relative">
              <div className="h-full flex items-end justify-between px-2">
                {revenueData.map((data, i) => {
                  const maxValue = Math.max(...revenueData.map(d => d[chartType]))
                  const height = (data[chartType] / maxValue) * 280
                  return (
                    <motion.div
                      key={data.month}
                      initial={{ height: 0 }}
                      animate={{ height: `${height}px` }}
                      transition={{ delay: i * 0.05, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                      className="flex-1 flex flex-col items-center justify-end px-1"
                    >
                      <div
                        className="w-full rounded-t transition-colors"
                        style={{
                          height: `${height}px`,
                          background: chartType === 'revenue' 
                            ? 'linear-gradient(to top, #ec4899, #f472b6)'
                            : chartType === 'orders'
                            ? 'linear-gradient(to top, #f43f5e, #fb7185)'
                            : 'linear-gradient(to top, #9333ea, #a855f7)'
                        }}
                      />
                      <span className="font-poppins text-xs text-pink-400 mt-2">{data.month}</span>
                    </motion.div>
                  )
                })}
              </div>
              <div className="flex justify-between mt-4 text-sm font-poppins text-pink-400">
                <span>Jan</span>
                <span>Mar</span>
                <span>May</span>
                <span>Jul</span>
                <span>Sep</span>
                <span>Nov</span>
              </div>
            </div>
          </div>

          <div className="card-elevated p-6">
            <h2 className="font-playfair text-xl font-bold text-pink-800 mb-6">Category Performance</h2>
            <div className="space-y-4">
              {categoryData.map((cat, i) => {
                const maxRevenue = Math.max(...categoryData.map(c => c.revenue))
                const width = (cat.revenue / maxRevenue) * 100
                return (
                  <motion.div
                    key={cat.category}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                    className="space-y-2"
                  >
                    <div className="flex justify-between text-sm font-poppins">
                      <span className="text-pink-700">{cat.category}</span>
                      <span className="font-medium text-pink-800">₹{cat.revenue.toLocaleString()}</span>
                    </div>
                    <div className="h-3 bg-pink-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${width}%` }}
                        transition={{ delay: i * 0.1 + 0.3, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                    </div>
                    <div className="flex justify-between text-xs font-poppins text-pink-400">
                      <span>{cat.orders} orders</span>
                      <span>{((cat.revenue / maxRevenue) * 100).toFixed(1)}%</span>
                    </div>
                  </motion.div>
                )
              })}
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
            <h2 className="font-playfair text-xl font-bold text-pink-800 mb-6">Fabric Distribution</h2>
            <div className="space-y-4">
              {fabricData.map((fabric, i) => (
                <motion.div
                  key={fabric.fabric}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1, duration: 0.3 }}
                  className="space-y-2"
                >
                  <div className="flex justify-between text-sm font-poppins">
                    <span className="text-pink-700">{fabric.fabric}</span>
                    <span className="font-medium text-pink-800">{fabric.percentage}%</span>
                  </div>
                  <div className="h-2 bg-pink-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${fabric.percentage}%` }}
                      transition={{ delay: i * 0.1 + 0.3, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                      className="h-full rounded-full bg-gradient-to-r from-pink-400 to-rose-400"
                    />
                  </div>
                  <p className="text-xs text-pink-400 text-right">₹{fabric.revenue.toLocaleString()}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="card-elevated p-6">
            <h2 className="font-playfair text-xl font-bold text-pink-800 mb-6">Top Customers</h2>
            <div className="space-y-3">
              {topCustomers.map((customer, i) => (
                <motion.div
                  key={customer.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  className="flex items-center gap-3 p-3 bg-pink-50 rounded-xl hover:bg-pink-100 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-pink flex items-center justify-center text-white font-bold">
                    {customer.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-playfair font-bold text-pink-800">{customer.name}</p>
                      {i === 0 && <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-poppins rounded-full">#1</span>}
                    </div>
                    <p className="font-poppins text-xs text-pink-500">{customer.orders} orders • Last: {customer.lastOrder}</p>
                  </div>
                  <p className="font-playfair font-bold text-pink-700">₹{customer.spent.toLocaleString()}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="card-elevated p-6">
            <h2 className="font-playfair text-xl font-bold text-pink-800 mb-6">Key Metrics</h2>
            <div className="space-y-4">
              {[
                { label: 'Customer Lifetime Value', value: '₹4,250', trend: '+12%', icon: DollarSign, color: 'from-amber-400 to-orange-500' },
                { label: 'Repeat Purchase Rate', value: '34%', trend: '+5%', icon: Users, color: 'from-pink-400 to-rose-500' },
                { label: 'Avg Time to Order', value: '2.3 days', trend: '-0.5 days', icon: Clock, color: 'from-blue-400 to-purple-500' },
                { label: 'Cart Abandonment', value: '67%', trend: '-3%', icon: ShoppingBag, color: 'from-red-400 to-rose-500' },
                { label: 'Email Open Rate', value: '28.5%', trend: '+2.1%', icon: Mail, color: 'from-green-400 to-teal-500' },
                { label: 'Mobile Traffic', value: '78%', trend: '+4%', icon: Smartphone, color: 'from-purple-400 to-pink-500' },
              ].map((metric, i) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  className="flex items-center justify-between p-4 bg-pink-50 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r {metric.color} flex items-center justify-center">
                      <metric.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-poppins font-medium text-pink-800">{metric.label}</p>
                      <p className="font-poppins text-sm text-pink-500">{metric.value}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-poppins font-medium ${metric.trend.startsWith('+') || (metric.trend.startsWith('-') && metric.label.includes('Abandonment')) ? 'bg-green-100 text-green-700' : metric.trend.startsWith('-') ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                    {metric.trend}
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
        className="grid md:grid-cols-4 gap-4"
      >
        <div className="card-elevated p-6 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-pink-400 to-rose-400 flex items-center justify-center">
            <Target className="w-7 h-7 text-white" />
          </div>
          <h3 className="font-playfair text-xl font-bold text-pink-800">Monthly Target</h3>
          <p className="font-playfair text-2xl font-bold bg-gradient-pink-dark bg-clip-text text-transparent mt-2">85% Achieved</p>
          <div className="w-full bg-pink-100 rounded-full h-2 mt-3 overflow-hidden">
            <div className="bg-gradient-pink-dark h-full rounded-full" style={{ width: '85%' }} />
          </div>
        </div>
        <div className="card-elevated p-6 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center">
            <Award className="w-7 h-7 text-white" />
          </div>
          <h3 className="font-playfair text-xl font-bold text-pink-800">Best Category</h3>
          <p className="font-playfair text-2xl font-bold text-pink-700 mt-2">Anarkali</p>
          <p className="font-poppins text-sm text-pink-500 mt-1">₹4.5L revenue</p>
        </div>
        <div className="card-elevated p-6 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-green-400 to-teal-500 flex items-center justify-center">
            <TrendingUp className="w-7 h-7 text-white" />
          </div>
          <h3 className="font-playfair text-xl font-bold text-pink-800">Fastest Growing</h3>
          <p className="font-playfair text-2xl font-bold text-pink-700 mt-2">Western Kurti</p>
          <p className="font-poppins text-sm text-pink-500 mt-1">+23% YoY</p>
        </div>
        <div className="card-elevated p-6 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center">
            <DollarSign className="w-7 h-7 text-white" />
          </div>
          <h3 className="font-playfair text-xl font-bold text-pink-800">Projected Revenue</h3>
          <p className="font-playfair text-2xl font-bold text-pink-700 mt-2">₹2.8Cr</p>
          <p className="font-poppins text-sm text-pink-500 mt-1">Next 12 months</p>
        </div>
      </motion.div>
    </div>
  )
}