import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { Package, Truck, CheckCircle, Clock, XCircle, Eye, RotateCcw, Download, MessageSquare } from 'lucide-react'

const orderStatuses = [
  { id: 'placed', label: 'Order Placed', icon: '📦', color: 'text-pink-500' },
  { id: 'confirmed', label: 'Confirmed', icon: '✅', color: 'text-blue-500' },
  { id: 'designing', label: 'Designing', icon: '✏️', color: 'text-purple-500' },
  { id: 'embroidery', label: 'Embroidery', icon: '🧵', color: 'text-amber-500' },
  { id: 'quality', label: 'Quality Check', icon: '🔍', color: 'text-indigo-500' },
  { id: 'shipped', label: 'Shipped', icon: '🚚', color: 'text-green-500' },
  { id: 'delivered', label: 'Delivered', icon: '🎉', color: 'text-rose-500' },
]

const mockOrders = [
  {
    id: 'ORD-2024-001',
    date: '2024-01-15',
    status: 'delivered',
    items: [
      { name: 'Floral Dream Anarkali', style: 'Anarkali', fabric: 'Silk', color: 'Pink', embroidery: 'Floral', quantity: 1, price: 1299 },
      { name: 'Minimalist Chic Western', style: 'Western Kurti', fabric: 'Cotton', color: 'White', embroidery: 'Minimal', quantity: 1, price: 899 },
    ],
    subtotal: 2198,
    shipping: 0,
    total: 2198,
    address: '123 Flower Street, Garden City - 123456',
    payment: 'UPI',
    tracking: 'TRK123456789',
    timeline: [
      { status: 'placed', date: '2024-01-15', time: '10:30 AM', completed: true },
      { status: 'confirmed', date: '2024-01-15', time: '11:00 AM', completed: true },
      { status: 'designing', date: '2024-01-16', time: '09:00 AM', completed: true },
      { status: 'embroidery', date: '2024-01-18', time: '02:00 PM', completed: true },
      { status: 'quality', date: '2024-01-20', time: '10:00 AM', completed: true },
      { status: 'shipped', date: '2024-01-21', time: '08:00 AM', completed: true },
      { status: 'delivered', date: '2024-01-23', time: '11:30 AM', completed: true },
    ]
  },
  {
    id: 'ORD-2024-002',
    date: '2024-01-20',
    status: 'embroidery',
    items: [
      { name: 'Royal Paisley Straight', style: 'Straight Kurta', fabric: 'Chanderi', color: 'Maroon', embroidery: 'Paisley', quantity: 1, price: 1499 },
    ],
    subtotal: 1499,
    shipping: 99,
    total: 1598,
    address: '123 Flower Street, Garden City - 123456',
    payment: 'Cash on Delivery',
    tracking: null,
    timeline: [
      { status: 'placed', date: '2024-01-20', time: '02:15 PM', completed: true },
      { status: 'confirmed', date: '2024-01-20', time: '03:00 PM', completed: true },
      { status: 'designing', date: '2024-01-21', time: '10:00 AM', completed: true },
      { status: 'embroidery', date: '2024-01-23', time: '09:00 AM', completed: true, current: true },
      { status: 'quality', date: null, time: null, completed: false },
      { status: 'shipped', date: null, time: null, completed: false },
      { status: 'delivered', date: null, time: null, completed: false },
    ]
  },
  {
    id: 'ORD-2024-003',
    date: '2024-01-25',
    status: 'confirmed',
    items: [
      { name: 'Peacock Majesty Anarkali', style: 'Anarkali', fabric: 'Silk', color: 'Teal', embroidery: 'Peacock', quantity: 1, price: 1699 },
      { name: 'Butterfly Garden Western', style: 'Western Kurti', fabric: 'Rayon', color: 'Pink', embroidery: 'Butterfly', quantity: 2, price: 1099 },
    ],
    subtotal: 3897,
    shipping: 0,
    total: 3897,
    address: '456 Design Avenue, Creative Hub - 789012',
    payment: 'Credit Card',
    tracking: null,
    timeline: [
      { status: 'placed', date: '2024-01-25', time: '11:00 AM', completed: true },
      { status: 'confirmed', date: '2024-01-25', time: '11:30 AM', completed: true, current: true },
      { status: 'designing', date: null, time: null, completed: false },
      { status: 'embroidery', date: null, time: null, completed: false },
      { status: 'quality', date: null, time: null, completed: false },
      { status: 'shipped', date: null, time: null, completed: false },
      { status: 'delivered', date: null, time: null, completed: false },
    ]
  },
]

const statusLabels = {
  placed: 'Order Placed',
  confirmed: 'Confirmed',
  designing: 'Designing',
  embroidery: 'Embroidery',
  quality: 'Quality Check',
  shipped: 'Shipped',
  delivered: 'Delivered',
}

const statusColors = {
  placed: 'bg-pink-100 text-pink-700',
  confirmed: 'bg-blue-100 text-blue-700',
  designing: 'bg-purple-100 text-purple-700',
  embroidery: 'bg-amber-100 text-amber-700',
  quality: 'bg-indigo-100 text-indigo-700',
  shipped: 'bg-green-100 text-green-700',
  delivered: 'bg-rose-100 text-rose-700',
}

export function Orders() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)

  const tabs = [
    { id: 'all', label: 'All Orders', count: mockOrders.length },
    { id: 'active', label: 'Active', count: mockOrders.filter(o => o.status !== 'delivered').length },
    { id: 'delivered', label: 'Delivered', count: mockOrders.filter(o => o.status === 'delivered').length },
    { id: 'cancelled', label: 'Cancelled', count: 0 },
  ]

  const filteredOrders = mockOrders.filter(order => {
    if (activeTab === 'all') return true
    if (activeTab === 'active') return order.status !== 'delivered'
    if (activeTab === 'delivered') return order.status === 'delivered'
    if (activeTab === 'cancelled') return order.status === 'cancelled'
    return true
  })

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="font-playfair text-3xl md:text-4xl font-bold bg-gradient-pink-dark bg-clip-text text-transparent">
          My Orders 📦
        </h1>
        <p className="font-poppins text-pink-500 mt-1">Track your embroidery journey ✨</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="mb-6 flex flex-wrap gap-2"
        role="tablist"
        aria-label="Order status filters"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`px-4 py-2 rounded-full font-poppins font-medium text-sm transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-gradient-pink-dark text-white shadow-md shadow-pink-300/50'
                : 'bg-pink-50 text-pink-600 hover:bg-pink-100'
            }`}
          >
            {tab.label} <span className="ml-2 px-2 py-0.5 bg-white/50 rounded-full text-xs">{tab.count}</span>
          </button>
        ))}
      </motion.div>

      {filteredOrders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-16 text-center"
        >
          <span className="text-6xl block mb-4" role="img" aria-hidden="true">📦</span>
          <h2 className="font-playfair text-2xl font-bold text-pink-700 mb-2">No orders found</h2>
          <p className="font-poppins text-pink-500 mb-6">Your orders will appear here once you shop!</p>
          <a href="/shop" className="btn-primary inline-block">Start Shopping 🛍️</a>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="space-y-4"
        >
          {filteredOrders.map((order, i) => (
            <motion.article
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              className="card-elevated overflow-hidden"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-pink-dark flex items-center justify-center text-white text-xl">
                      <Package className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-playfair font-bold text-pink-800">{order.id}</p>
                      <p className="font-poppins text-sm text-pink-500">{new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-poppins font-medium ${statusColors[order.status]}`}>
                      {order.status === 'delivered' ? '✅' : order.status === 'cancelled' ? '❌' : '⏳'} {statusLabels[order.status]}
                    </span>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="btn-secondary text-sm"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 text-sm font-poppins">
                  <div className="p-3 bg-pink-50 rounded-xl">
                    <p className="text-pink-500">Items</p>
                    <p className="font-medium text-pink-800">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                  </div>
                  <div className="p-3 bg-pink-50 rounded-xl">
                    <p className="text-pink-500">Payment</p>
                    <p className="font-medium text-pink-800">{order.payment}</p>
                  </div>
                  <div className="p-3 bg-pink-50 rounded-xl">
                    <p className="text-pink-500">Total</p>
                    <p className="font-playfair font-bold text-pink-700">₹{order.total}</p>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      )}

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
                <h2 className="font-playfair text-2xl font-bold text-pink-800">Order Details</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 rounded-xl text-pink-500 hover:bg-pink-100"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-playfair font-bold text-pink-800">{selectedOrder.id}</p>
                    <p className="font-poppins text-sm text-pink-500">{new Date(selectedOrder.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-poppins font-medium ${statusColors[selectedOrder.status]}`}>
                    {statusLabels[selectedOrder.status]}
                  </span>
                </div>

                <div className="border-t border-pink-100 pt-6">
                  <h3 className="font-playfair text-lg font-bold text-pink-800 mb-4">Order Timeline</h3>
                  <div className="order-timeline space-y-4">
                    {selectedOrder.timeline.map((step, idx) => (
                      <motion.div
                        key={step.status}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1, duration: 0.3 }}
                        className={`order-timeline-item ${step.completed ? 'completed' : ''} ${step.current ? 'current' : ''} ${!step.completed && !step.current ? 'pending' : ''}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex flex-col items-center">
                            <span className="text-xl" role="img" aria-hidden="true">{orderStatuses.find(s => s.id === step.status)?.icon}</span>
                          </div>
                          <div className="flex-1">
                            <p className="font-playfair font-medium text-pink-800">{statusLabels[step.status]}</p>
                            {step.completed && step.date && (
                              <p className="font-poppins text-sm text-pink-500">
                                {new Date(step.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} at {step.time}
                              </p>
                            )}
                            {!step.completed && !step.current && (
                              <p className="font-poppins text-sm text-pink-300">Pending...</p>
                            )}
                            {step.current && <span className="inline-block mt-1 px-2 py-0.5 bg-pink-100 text-pink-700 text-xs font-poppins rounded-full animate-pulse">In Progress</span>}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-pink-100 pt-6">
                  <h3 className="font-playfair text-lg font-bold text-pink-800 mb-4">Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1, duration: 0.3 }}
                        className="flex items-center gap-4 p-3 bg-pink-50 rounded-xl"
                      >
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center text-3xl flex-shrink-0">
                          {item.embroidery === 'Floral' ? '🌸' : item.embroidery === 'Paisley' ? '🌿' : item.embroidery === 'Peacock' ? '🦚' : item.embroidery === 'Butterfly' ? '🦋' : '✨'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-playfair font-bold text-pink-800 truncate">{item.name}</p>
                          <p className="font-poppins text-sm text-pink-500">{item.style} • {item.fabric} • {item.color}</p>
                          <p className="font-poppins text-xs text-pink-400">{item.embroidery} Embroidery</p>
                        </div>
                        <div className="text-right">
                          <p className="font-playfair font-bold text-pink-700">₹{item.price}</p>
                          <p className="font-poppins text-xs text-pink-400">Qty: {item.quantity}</p>
                        </div>
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
                    <p className="font-poppins text-sm text-pink-500">Total</p>
                    <p className="font-playfair text-xl font-bold bg-gradient-pink-dark bg-clip-text text-transparent">₹{selectedOrder.total}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-pink-50 rounded-xl">
                    <h4 className="font-playfair font-bold text-pink-800 mb-2">Delivery Address</h4>
                    <p className="font-poppins text-sm text-pink-600">{selectedOrder.address}</p>
                  </div>
                  <div className="p-4 bg-pink-50 rounded-xl">
                    <h4 className="font-playfair font-bold text-pink-800 mb-2">Payment Method</h4>
                    <p className="font-poppins text-sm text-pink-600">{selectedOrder.payment}</p>
                  </div>
                </div>

                {selectedOrder.tracking && (
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <h4 className="font-playfair font-bold text-blue-800 mb-2 flex items-center gap-2">
                      <Truck className="w-5 h-5" />
                      Tracking Information
                    </h4>
                    <p className="font-poppins text-sm text-blue-700">Tracking Number: <span className="font-mono font-bold">{selectedOrder.tracking}</span></p>
                    <div className="flex gap-2 mt-3">
                      <button className="btn-secondary text-sm flex-1">
                        <Eye className="w-4 h-4 mr-1" />
                        Track Shipment
                      </button>
                      <button className="btn-secondary text-sm flex-1">
                        <Download className="w-4 h-4 mr-1" />
                        Download Invoice
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t border-pink-100">
                  <button className="btn-secondary flex-1">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Contact Support
                  </button>
                  <button className="btn-primary flex-1">
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Reorder
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}