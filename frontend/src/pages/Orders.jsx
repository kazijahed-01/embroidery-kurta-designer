import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import {
  Package,
  Truck,
  Eye,
  RotateCcw,
  MessageSquare
} from 'lucide-react'

const orderStatuses = [
  { id: 'placed', label: 'Order Placed', icon: '📦' },
  { id: 'confirmed', label: 'Confirmed', icon: '✅' },
  { id: 'designing', label: 'Designing', icon: '✏️' },
  { id: 'embroidery', label: 'Embroidery', icon: '🧵' },
  { id: 'quality', label: 'Quality Check', icon: '🔍' },
  { id: 'shipped', label: 'Shipped', icon: '🚚' },
  { id: 'delivered', label: 'Delivered', icon: '🎉' }
]

const statusColors = {
  placed: 'bg-pink-100 text-pink-700',
  confirmed: 'bg-blue-100 text-blue-700',
  designing: 'bg-purple-100 text-purple-700',
  embroidery: 'bg-amber-100 text-amber-700',
  quality: 'bg-indigo-100 text-indigo-700',
  shipped: 'bg-green-100 text-green-700',
  delivered: 'bg-rose-100 text-rose-700',
  cancelled: 'bg-red-100 text-red-700'
}

function getStatusLabel(status) {
  return orderStatuses.find((item) => item.id === status)?.label || status
}

function getPaymentLabel(paymentMethod) {
  const labels = {
    cod: 'Cash on Delivery',
    upi: 'UPI / Net Banking',
    card: 'Credit / Debit Card',
    wallet: 'Wallet / Pay Later'
  }

  return labels[paymentMethod] || paymentMethod
}

function getOrderItemInfo(item) {
  const productOrDesign = item.user_designs || item.products

  return {
    name: productOrDesign?.name || 'Custom Kurta',
    style:
      productOrDesign?.kurta_style ||
      productOrDesign?.style ||
      'Custom Design',
    fabric: productOrDesign?.fabric || 'Handcrafted',
    color:
      productOrDesign?.color ||
      productOrDesign?.colors?.[0] ||
      'Custom Color',
    embroidery: productOrDesign?.embroidery_design || 'Handcrafted',
    quantity: item.quantity,
    price: Number(item.unit_price || 0)
  }
}

export function Orders() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)

  const loadOrders = async () => {
    if (!user) {
      setOrders([])
      setLoading(false)
      return
    }

    setLoading(true)

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          product_id,
          design_id,
          quantity,
          size,
          unit_price,
          total_price,
          products (
            id,
            name,
            style,
            fabric,
            colors
          ),
          user_designs (
            id,
            name,
            kurta_style,
            fabric,
            color,
            embroidery_design
          )
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Could not load orders:', error)
    } else {
      setOrders(data || [])
    }

    setLoading(false)
  }

  useEffect(() => {
    loadOrders()
  }, [user])

  const tabs = [
    { id: 'all', label: 'All Orders', count: orders.length },
    {
      id: 'active',
      label: 'Active',
      count: orders.filter(
        (order) =>
          order.status !== 'delivered' && order.status !== 'cancelled'
      ).length
    },
    {
      id: 'delivered',
      label: 'Delivered',
      count: orders.filter((order) => order.status === 'delivered').length
    },
    {
      id: 'cancelled',
      label: 'Cancelled',
      count: orders.filter((order) => order.status === 'cancelled').length
    }
  ]

  const filteredOrders = orders.filter((order) => {
    if (activeTab === 'all') return true
    if (activeTab === 'active') {
      return order.status !== 'delivered' && order.status !== 'cancelled'
    }

    return order.status === activeTab
  })

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="card p-12 text-center">
          <div className="loading-thread mx-auto mb-4" />
          <p className="font-poppins text-pink-500">Loading your orders... 📦</p>
        </div>
      </div>
    )
  }

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
        <p className="font-poppins text-pink-500 mt-1">
          Track your embroidery journey ✨
        </p>
      </motion.div>

      <div className="mb-6 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-full font-poppins font-medium text-sm ${
              activeTab === tab.id
                ? 'bg-gradient-pink-dark text-white'
                : 'bg-pink-50 text-pink-600 hover:bg-pink-100'
            }`}
          >
            {tab.label}
            <span className="ml-2 px-2 py-0.5 bg-white/50 rounded-full text-xs">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="card p-16 text-center">
          <span className="text-6xl block mb-4">📦</span>
          <h2 className="font-playfair text-2xl font-bold text-pink-700 mb-2">
            No orders found
          </h2>
          <p className="font-poppins text-pink-500 mb-6">
            Your placed orders will appear here.
          </p>
          <a href="/shop" className="btn-primary inline-block">
            Start Shopping 🛍️
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const itemCount = (order.order_items || []).reduce(
              (count, item) => count + item.quantity,
              0
            )

            return (
              <motion.article
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-elevated overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-pink-dark flex items-center justify-center text-white">
                        <Package className="w-6 h-6" />
                      </div>

                      <div>
                        <p className="font-playfair font-bold text-pink-800">
                          {order.order_number}
                        </p>
                        <p className="font-poppins text-sm text-pink-500">
                          {new Date(order.created_at).toLocaleDateString(
                            'en-IN',
                            {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            }
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-poppins font-medium ${
                          statusColors[order.status] ||
                          'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {order.status === 'delivered' ? '✅' : '⏳'}{' '}
                        {getStatusLabel(order.status)}
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
                      <p className="font-medium text-pink-800">
                        {itemCount} item{itemCount !== 1 ? 's' : ''}
                      </p>
                    </div>

                    <div className="p-3 bg-pink-50 rounded-xl">
                      <p className="text-pink-500">Payment</p>
                      <p className="font-medium text-pink-800">
                        {getPaymentLabel(order.payment_method)}
                      </p>
                    </div>

                    <div className="p-3 bg-pink-50 rounded-xl">
                      <p className="text-pink-500">Total</p>
                      <p className="font-playfair font-bold text-pink-700">
                        ₹{order.total}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.article>
            )
          })}
        </div>
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
              onClick={(event) => event.stopPropagation()}
            >
              <div className="p-6 border-b border-pink-100 flex items-center justify-between">
                <h2 className="font-playfair text-2xl font-bold text-pink-800">
                  Order Details
                </h2>
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
                    <p className="font-playfair font-bold text-pink-800">
                      {selectedOrder.order_number}
                    </p>
                    <p className="font-poppins text-sm text-pink-500">
                      {new Date(selectedOrder.created_at).toLocaleDateString(
                        'en-IN',
                        {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        }
                      )}
                    </p>
                  </div>

                  <span
                    className={`px-4 py-2 rounded-full text-sm font-poppins font-medium ${
                      statusColors[selectedOrder.status]
                    }`}
                  >
                    {getStatusLabel(selectedOrder.status)}
                  </span>
                </div>

                <div className="border-t border-pink-100 pt-6">
                  <h3 className="font-playfair text-lg font-bold text-pink-800 mb-4">
                    Order Timeline
                  </h3>

                  <div className="space-y-4">
                    {orderStatuses.map((status) => {
                      const currentIndex = orderStatuses.findIndex(
                        (item) => item.id === selectedOrder.status
                      )

                      const statusIndex = orderStatuses.findIndex(
                        (item) => item.id === status.id
                      )

                      const completed = statusIndex <= currentIndex
                      const current =
                        statusIndex === currentIndex &&
                        selectedOrder.status !== 'delivered'

                      return (
                        <div
                          key={status.id}
                          className={`p-3 rounded-xl ${
                            completed ? 'bg-pink-50' : 'bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{status.icon}</span>
                            <div>
                              <p className="font-playfair font-medium text-pink-800">
                                {status.label}
                              </p>
                              {current && (
                                <span className="text-xs text-pink-600">
                                  In Progress
                                </span>
                              )}
                              {!completed && (
                                <span className="text-xs text-gray-400">
                                  Pending
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="border-t border-pink-100 pt-6">
                  <h3 className="font-playfair text-lg font-bold text-pink-800 mb-4">
                    Items
                  </h3>

                  <div className="space-y-3">
                    {(selectedOrder.order_items || []).map((item) => {
                      const info = getOrderItemInfo(item)

                      return (
                        <div
                          key={item.id}
                          className="flex items-center gap-4 p-3 bg-pink-50 rounded-xl"
                        >
                          <div className="w-16 h-16 rounded-xl bg-pink-100 flex items-center justify-center text-3xl">
                            {info.embroidery === 'Floral'
                              ? '🌸'
                              : info.embroidery === 'Paisley'
                                ? '🌿'
                                : info.embroidery === 'Peacock'
                                  ? '🦚'
                                  : '✨'}
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="font-playfair font-bold text-pink-800">
                              {info.name}
                            </p>
                            <p className="font-poppins text-sm text-pink-500">
                              {info.style} • {info.fabric} • {info.color}
                            </p>
                            <p className="font-poppins text-xs text-pink-400">
                              Size: {item.size} • Qty: {info.quantity}
                            </p>
                          </div>

                          <p className="font-playfair font-bold text-pink-700">
                            ₹{item.total_price}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 p-4 bg-pink-50 rounded-xl">
                  <div>
                    <p className="font-poppins text-sm text-pink-500">
                      Subtotal
                    </p>
                    <p className="font-playfair font-bold text-pink-700">
                      ₹{selectedOrder.subtotal}
                    </p>
                  </div>

                  <div>
                    <p className="font-poppins text-sm text-pink-500">
                      Shipping
                    </p>
                    <p className="font-playfair font-bold text-pink-700">
                      {selectedOrder.shipping === 0
                        ? 'FREE'
                        : `₹${selectedOrder.shipping}`}
                    </p>
                  </div>

                  <div>
                    <p className="font-poppins text-sm text-pink-500">Total</p>
                    <p className="font-playfair text-xl font-bold text-pink-700">
                      ₹{selectedOrder.total}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-pink-50 rounded-xl">
                    <h4 className="font-playfair font-bold text-pink-800 mb-2">
                      Delivery Address
                    </h4>
                    <p className="font-poppins text-sm text-pink-600">
                      {selectedOrder.shipping_address?.name}
                    </p>
                    <p className="font-poppins text-sm text-pink-600">
                      {selectedOrder.shipping_address?.address_line1}
                      {selectedOrder.shipping_address?.address_line2 &&
                        `, ${selectedOrder.shipping_address.address_line2}`}
                    </p>
                    <p className="font-poppins text-sm text-pink-600">
                      {selectedOrder.shipping_address?.city},{' '}
                      {selectedOrder.shipping_address?.state} -{' '}
                      {selectedOrder.shipping_address?.pincode}
                    </p>
                  </div>

                  <div className="p-4 bg-pink-50 rounded-xl">
                    <h4 className="font-playfair font-bold text-pink-800 mb-2">
                      Payment Method
                    </h4>
                    <p className="font-poppins text-sm text-pink-600">
                      {getPaymentLabel(selectedOrder.payment_method)}
                    </p>
                    <p className="font-poppins text-xs text-pink-400 mt-1">
                      Payment status: {selectedOrder.payment_status}
                    </p>
                  </div>
                </div>

                {selectedOrder.tracking_number && (
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <h4 className="font-playfair font-bold text-blue-800 flex items-center gap-2">
                      <Truck className="w-5 h-5" />
                      Tracking Information
                    </h4>
                    <p className="font-poppins text-sm text-blue-700 mt-2">
                      Tracking Number: {selectedOrder.tracking_number}
                    </p>
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