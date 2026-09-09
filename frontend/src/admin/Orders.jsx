import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Eye, Truck, CheckCircle, XCircle, Clock, Package, Download, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'

const mockOrders = [
  { id: 'ORD-2024-001', customer: 'Priya Sharma', email: 'priya@email.com', phone: '+91 98765 43210', items: 2, subtotal: 2198, shipping: 0, discount: 0, total: 2198, status: 'delivered', payment: 'UPI', address: '123 Flower Street, Garden City - 123456', date: '2024-01-15', tracking: 'TRK123456789', timeline: ['placed', 'confirmed', 'designing', 'embroidery', 'quality', 'shipped', 'delivered'] },
  { id: 'ORD-2024-002', customer: 'Anjali Patel', email: 'anjali@email.com', phone: '+91 87654 32109', items: 1, subtotal: 1499, shipping: 99, discount: 0, total: 1598, status: 'embroidery', payment: 'COD', address: '456 Design Avenue, Creative Hub - 789012', date: '2024-01-20', tracking: null, timeline: ['placed', 'confirmed', 'designing', 'embroidery'] },
  { id: 'ORD-2024-003', customer: 'Kavya Reddy', email: 'kavya@email.com', phone: '+91 76543 21098', items: 3, subtotal: 3897, shipping: 0, discount: 200, total: 3697, status: 'confirmed', payment: 'Card', address: '789 Silk Road, Embroidery Town - 345678', date: '2024-01-22', tracking: null, timeline: ['placed', 'confirmed'] },
  { id: 'ORD-2024-004', customer: 'Meera Singh', email: 'meera@email.com', phone: '+91 65432 10987', items: 1, subtotal: 1299, shipping: 99, discount: 0, total: 1398, status: 'shipped', payment: 'UPI', address: '321 Cotton Lane, Fabric City - 567890', date: '2024-01-18', tracking: 'TRK987654321', timeline: ['placed', 'confirmed', 'designing', 'embroidery', 'quality', 'shipped'] },
  { id: 'ORD-2024-005', customer: 'Riya Gupta', email: 'riya@email.com', phone: '+91 54321 09876', items: 2, subtotal: 2498, shipping: 0, discount: 100, total: 2398, status: 'placed', payment: 'Wallet', address: '555 Thread Street, Stitch Nagar - 111222', date: '2024-01-23', tracking: null, timeline: ['placed'] },
  { id: 'ORD-2024-006', customer: 'Sneha Kumar', email: 'sneha@email.com', phone: '+91 43210 98765', items: 1, subtotal: 899, shipping: 99, discount: 0, total: 998, status: 'designing', payment: 'COD', address: '777 Pattern Path, Design District - 333444', date: '2024-01-23', tracking: null, timeline: ['placed', 'confirmed', 'designing'] },
]

const statuses = ['all', 'placed', 'confirmed', 'designing', 'embroidery', 'quality', 'shipped', 'delivered', 'cancelled']
const statusLabels = {
  placed: 'Order Placed',
  confirmed: 'Confirmed',
  designing: 'Designing',
  embroidery: 'Embroidery',
  quality: 'Quality Check',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}
const statusColors = {
  placed: 'bg-pink-100 text-pink-700',
  confirmed: 'bg-blue-100 text-blue-700',
  designing: 'bg-purple-100 text-purple-700',
  embroidery: 'bg-amber-100 text-amber-700',
  quality: 'bg-indigo-100 text-indigo-700',
  shipped: 'bg-green-100 text-green-700',
  delivered: 'bg-rose-100 text-rose-700',
  cancelled: 'bg-red-100 text-red-700',
}
const statusIcons = {
  placed: Clock,
  confirmed: CheckCircle,
  designing: Package,
  embroidery: Truck,
  quality: CheckCircle,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: XCircle,
}

export function AdminOrders() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateRange, setDateRange] = useState('7d')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [updatingOrder, setUpdatingOrder] = useState(null)

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleStatusChange = (orderId, newStatus) => {
    setUpdatingOrder(orderId)
    setTimeout(() => {
      toast.success(`Order status updated to ${statusLabels[newStatus]}! ✨`, { emoji: true })
      setUpdatingOrder(null)
    }, 500)
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
            Orders Management 📦
          </h1>
          <p className="font-poppins text-pink-500 mt-1">Track and manage customer orders ✨</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="card-elevated p-4"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search orders, customers..."
              className="input-field pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field max-w-[180px]">
              {statuses.map(s => <option key={s} value={s}>{s === 'all' ? 'All Status' : statusLabels[s]}</option>)}
            </select>
            <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="input-field max-w-[150px]">
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="card-elevated overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, i) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.3 }}
                >
                  <td className="font-mono font-medium text-pink-700">{order.id}</td>
                  <td>
                    <div>
                      <p className="font-poppins font-medium text-pink-800">{order.customer}</p>
                      <p className="font-poppins text-sm text-pink-500">{order.email}</p>
                    </div>
                  </td>
                  <td className="font-poppins text-gray-600">{order.items} item{order.items !== 1 ? 's' : ''}</td>
                  <td className="font-playfair font-bold text-pink-700">₹{order.total}</td>
                  <td>
                    <span className="px-2 py-1 bg-pink-50 text-pink-700 rounded-full text-xs font-poppins">{order.payment}</span>
                  </td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      disabled={updatingOrder === order.id}
                      className={`px-3 py-1 rounded-full text-xs font-poppins font-medium ${statusColors[order.status]} cursor-pointer`}
                    >
                      {Object.entries(statusLabels).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="font-poppins text-sm text-pink-500">{order.date}</td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button onClick={() => setSelectedOrder(order)} className="p-2 rounded-lg text-pink-500 hover:bg-pink-100" aria-label="View details">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="p-12 text-center">
            <Search className="w-12 h-12 text-pink-300 mx-auto mb-3" />
            <p className="font-poppins text-pink-500">No orders found</p>
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-pink-100 flex items-center justify-between">
                <h2 className="font-playfair text-2xl font-bold text-pink-800">Order Details - {selectedOrder.id}</h2>
                <button onClick={() => setSelectedOrder(null)} className="p-2 rounded-xl text-pink-500 hover:bg-pink-100">✕</button>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-pink-50 rounded-xl">
                    <p className="font-poppins text-sm text-pink-500">Order Status</p>
                    <select
                      value={selectedOrder.status}
                      onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                      className={`px-3 py-2 rounded-lg font-poppins font-medium w-full mt-1 ${statusColors[selectedOrder.status]}`}
                    >
                      {Object.entries(statusLabels).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="p-4 bg-pink-50 rounded-xl">
                    <p className="font-poppins text-sm text-pink-500">Payment Method</p>
                    <p className="font-playfair font-bold text-pink-800 mt-1">{selectedOrder.payment}</p>
                  </div>
                  <div className="p-4 bg-pink-50 rounded-xl">
                    <p className="font-poppins text-sm text-pink-500">Order Date</p>
                    <p className="font-playfair font-bold text-pink-800 mt-1">{selectedOrder.date}</p>
                  </div>
                </div>

                <div className="border-t border-pink-100 pt-6">
                  <h3 className="font-playfair text-lg font-bold text-pink-800 mb-4">Customer Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-pink-50 rounded-xl">
                      <p className="font-poppins text-sm text-pink-500">Name</p>
                      <p className="font-playfair font-medium text-pink-800 mt-1">{selectedOrder.customer}</p>
                    </div>
                    <div className="p-4 bg-pink-50 rounded-xl">
                      <p className="font-poppins text-sm text-pink-500">Email</p>
                      <p className="font-playfair font-medium text-pink-800 mt-1">{selectedOrder.email}</p>
                    </div>
                    <div className="p-4 bg-pink-50 rounded-xl">
                      <p className="font-poppins text-sm text-pink-500">Phone</p>
                      <p className="font-playfair font-medium text-pink-800 mt-1">{selectedOrder.phone}</p>
                    </div>
                    <div className="p-4 bg-pink-50 rounded-xl md:col-span-2">
                      <p className="font-poppins text-sm text-pink-500">Delivery Address</p>
                      <p className="font-playfair font-medium text-pink-800 mt-1">{selectedOrder.address}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-pink-100 pt-6">
                  <h3 className="font-playfair text-lg font-bold text-pink-800 mb-4">Order Timeline</h3>
                  <div className="order-timeline space-y-4">
                    {selectedOrder.timeline.map((step, idx) => (
                      <motion.div
                        key={step}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1, duration: 0.3 }}
                        className={`order-timeline-item ${idx < selectedOrder.timeline.indexOf(selectedOrder.status) ? 'completed' : idx === selectedOrder.timeline.indexOf(selectedOrder.status) ? 'current' : 'pending'}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex flex-col items-center">
                            {(() => { const Icon = statusIcons[step]; return <Icon className="w-5 h-5 text-pink-500" /> })()}
                          </div>
                          <div className="flex-1">
                            <p className="font-playfair font-medium text-pink-800">{statusLabels[step]}</p>
                            {idx < selectedOrder.timeline.indexOf(selectedOrder.status) && (
                              <p className="font-poppins text-sm text-pink-500">Completed</p>
                            )}
                            {idx === selectedOrder.timeline.indexOf(selectedOrder.status) && (
                              <span className="inline-block mt-1 px-2 py-0.5 bg-pink-100 text-pink-700 text-xs font-poppins rounded-full animate-pulse">In Progress</span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-pink-100 pt-6">
                  <h3 className="font-playfair text-lg font-bold text-pink-800 mb-4">Items</h3>
                  <div className="space-y-3">
                    {Array.from({ length: selectedOrder.items }, (_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-4 p-3 bg-pink-50 rounded-xl"
                      >
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center text-3xl flex-shrink-0">
                          👗
                        </div>
                        <div className="flex-1">
                          <p className="font-playfair font-bold text-pink-800">Kurta Item {i + 1}</p>
                          <p className="font-poppins text-sm text-pink-500">Custom embroidery design</p>
                        </div>
                        <p className="font-playfair font-bold text-pink-700">₹{Math.floor(selectedOrder.subtotal / selectedOrder.items)}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 p-4 bg-pink-50 rounded-xl">
                  <div>
                    <p className="font-poppins text-sm text-pink-500">Subtotal</p>
                    <p className="font-playfair font-bold text-pink-700">₹{selectedOrder.subtotal}</p>
                  </div>
                  <div>
                    <p className="font-poppins text-sm text-pink-500">Shipping</p>
                    <p className="font-playfair font-bold text-pink-700">{selectedOrder.shipping === 0 ? 'FREE' : `₹${selectedOrder.shipping}`}</p>
                  </div>
                  <div>
                    <p className="font-poppins text-sm text-pink-500">Discount</p>
                    <p className="font-playfair font-bold text-green-600">-₹{selectedOrder.discount}</p>
                  </div>
                </div>

                <div className="border-t border-pink-100 pt-4 flex justify-between items-center">
                  <div>
                    <p className="font-poppins text-sm text-pink-500">Grand Total</p>
                    <p className="font-playfair text-2xl font-bold bg-gradient-pink-dark bg-clip-text text-transparent">₹{selectedOrder.total}</p>
                  </div>
                  {selectedOrder.tracking && (
                    <button className="btn-secondary">
                      <Truck className="w-4 h-4 mr-1" />
                      Track: {selectedOrder.tracking}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}