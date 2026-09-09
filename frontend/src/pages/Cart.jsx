import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { Trash2, Plus, Minus, Heart, ArrowLeft, CreditCard, Gift, Truck, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const kurtaSilhouettes = {
  straight: 'polygon(25% 0%, 75% 0%, 85% 100%, 15% 100%)',
  anarkali: 'polygon(30% 0%, 70% 0%, 95% 100%, 5% 100%)',
  'a-line': 'polygon(35% 0%, 65% 0%, 90% 100%, 10% 100%)',
  short: 'polygon(25% 0%, 75% 0%, 80% 60%, 20% 60%)',
  long: 'polygon(20% 0%, 80% 0%, 90% 100%, 10% 100%)',
  western: 'polygon(30% 0%, 70% 0%, 75% 70%, 25% 70%)'
}

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL']

export function Cart() {
  const { cartItems, updateQuantity, updateSize, removeFromCart, clearCart, getCartTotal, loading } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [promoCode, setPromoCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [showCheckout, setShowCheckout] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState(null)

  const subtotal = getCartTotal()
  const shipping = subtotal > 2000 ? 0 : 99
  const total = subtotal + shipping - discount

  const applyPromo = () => {
    const codes = { 'WELCOME10': 10, 'THREAD20': 20, 'BLOOM15': 15, 'FIRST50': 50 }
    const upperCode = promoCode.toUpperCase()
    if (codes[upperCode]) {
      setDiscount(codes[upperCode])
      toast.success(`Promo applied! ${codes[upperCode]}% off ✨`, { emoji: true })
    } else {
      toast.error('Invalid promo code 😢', { emoji: true })
    }
  }

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Please login to checkout 🔒', { emoji: true })
      return
    }
    if (cartItems.length === 0) {
      toast.error('Your cart is empty 🛒', { emoji: true })
      return
    }
    setShowCheckout(true)
  }

  const completeOrder = async () => {
    // In real app, create order in database
    toast.success('Order placed successfully! 🎉', { emoji: true })
    clearCart()
    setShowCheckout(false)
    navigate('/orders')
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="card p-12 text-center">
          <div className="loading-thread mx-auto mb-4" />
          <p className="font-poppins text-pink-500">Loading your cart... 🛒</p>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-16 text-center"
        >
          <span className="text-6xl block mb-4" role="img" aria-hidden="true">🛒</span>
          <h1 className="font-playfair text-3xl font-bold text-pink-700 mb-2">Your cart is empty</h1>
          <p className="font-poppins text-pink-500 mb-6">Looks like you haven't added any designs yet</p>
          <Link to="/shop" className="btn-primary inline-block">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Link>
        </motion.div>
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
          Shopping Cart 🛒
        </h1>
        <p className="font-poppins text-pink-500 mt-1">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart</p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-2 space-y-4"
        >
          <AnimatePresence>
            {cartItems.map((item, i) => {
              const design = item.user_designs
              if (!design) return null

              return (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  className="card-elevated flex flex-col md:flex-row gap-4 p-4"
                >
                  <div className="relative w-32 h-40 md:w-40 md:h-48 flex-shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-pink-100" style={{ clipPath: kurtaSilhouettes[design.kurta_style] || kurtaSilhouettes.straight }}>
                      <div className={`absolute inset-0 ${design.fabric === 'cotton' ? 'fabric-cotton' : design.fabric === 'silk' ? 'fabric-silk' : 'fabric-linen'} opacity-30`} />
                      <div className="absolute inset-0" style={{ backgroundColor: design.color }}>
                        <div className="absolute inset-0 bg-white/10" />
                      </div>
                    </div>

                    {design.embroidery_design && design.embroidery_position && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute"
                        style={{ 
                          left: '50%', 
                          top: '50%', 
                          transform: 'translate(-50%, -50%)',
                          color: design.embroidery_color
                        }}
                      >
                        <span className="text-2xl" role="img" aria-hidden="true">{design.embroidery_design === 'Floral' ? '🌸' : design.embroidery_design === 'Paisley' ? '🌿' : '✨'}</span>
                      </motion.div>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <h3 className="font-playfair font-bold text-pink-800 truncate">{design.name}</h3>
                      <div className="flex flex-wrap gap-1 mt-2">
                        <span className="badge badge-pink">{design.kurta_style}</span>
                        <span className="badge badge-pink">{design.fabric}</span>
                        <span className="badge badge-rose">{design.embroidery_design}</span>
                        <span className="badge badge-rose">{design.embroidery_position}</span>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-4 pt-4 border-t border-pink-100">
                      <div className="flex items-center gap-2">
                        <label className="font-poppins text-sm text-pink-600">Size:</label>
                        <select
                          value={item.size}
                          onChange={(e) => updateSize(item.id, e.target.value)}
                          className="px-3 py-1.5 rounded-lg border border-pink-200 bg-white text-pink-700 font-poppins text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                        >
                          {sizes.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="font-poppins text-sm text-pink-600">Qty:</label>
                        <div className="flex items-center border border-pink-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="px-3 py-1.5 text-pink-600 hover:bg-pink-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-4 font-poppins font-bold text-pink-700">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-3 py-1.5 text-pink-600 hover:bg-pink-50"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <motion.button
                          onClick={() => removeFromCart(item.id)}
                          whileHover={{ scale: 1.1 }}
                          className="p-2 rounded-lg text-rose-400 hover:bg-rose-50 hover:text-rose-500"
                          aria-label="Remove from cart"
                        >
                          <Trash2 className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          className="p-2 rounded-lg text-pink-400 hover:bg-pink-50 hover:text-pink-500"
                          aria-label="Move to wishlist"
                        >
                          <Heart className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  <div className="md:w-32 text-right md:text-left">
                    <p className="font-playfair text-xl font-bold text-pink-700">
                      ₹{(design.base_price + design.embroidery_price + design.customization_price) * item.quantity}
                    </p>
                    <p className="font-poppins text-sm text-pink-400">× {item.quantity}</p>
                  </div>
                </motion.article>
              )
            })}
          </AnimatePresence>

          {cartItems.length > 1 && (
            <motion.button
              onClick={clearCart}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="btn-secondary w-full md:w-auto"
              whileHover={{ scale: 1.02 }}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Cart
            </motion.button>
          )}
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="space-y-6"
        >
          <div className="card-elevated p-6 sticky top-24">
            <h2 className="font-playfair text-xl font-bold text-pink-800 mb-4 flex items-center gap-2">
              <span className="text-xl" role="img" aria-hidden="true">💰</span>
              Order Summary
            </h2>

            <div className="space-y-3 text-sm font-poppins">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({cartItems.length} items)</span>
                <span className="font-medium text-pink-700">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="font-medium text-pink-700">
                  {shipping === 0 ? (
                    <span className="text-green-600 font-semibold">FREE 🚚</span>
                  ) : (
                    `₹${shipping}`
                  )}
                </span>
              </div>
              {shipping > 0 && (
                <p className="font-poppins text-xs text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                  Add ₹{2000 - subtotal} more for FREE shipping! 🚚
                </p>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Discount</span>
                <span className="font-medium text-green-600">-₹{discount}</span>
              </div>
              <div className="border-t border-pink-100 pt-3 flex justify-between">
                <span className="font-playfair font-bold text-pink-800">Total</span>
                <span className="font-playfair text-2xl font-bold bg-gradient-pink-dark bg-clip-text text-transparent">
                  ₹{total}
                </span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-pink-50 rounded-xl">
              <label className="input-label mb-2">Promo Code 🎁</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Enter promo code"
                  className="input-field flex-1"
                />
                <button
                  onClick={applyPromo}
                  className="btn-secondary whitespace-nowrap"
                >
                  Apply
                </button>
              </div>
              <p className="font-poppins text-xs text-pink-400 mt-2">Try: WELCOME10, THREAD20, BLOOM15, FIRST50</p>
            </div>

            <button
              onClick={handleCheckout}
              disabled={cartItems.length === 0}
              className="btn-primary w-full py-4 mt-4 text-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <CreditCard className="w-5 h-5 mr-2" />
              Proceed to Checkout
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 text-sm font-poppins text-pink-500">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Secure checkout</span>
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Easy returns</span>
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>COD available</span>
            </div>
          </div>

          <div className="card-elevated p-6">
            <h3 className="font-playfair text-lg font-bold text-pink-800 mb-4 flex items-center gap-2">
              <span className="text-lg" role="img" aria-hidden="true">🚚</span>
              Delivery Info
            </h3>
            <div className="space-y-3 text-sm font-poppins text-pink-600">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-pink-500" />
                <span>Free delivery on orders above ₹2000</span>
              </div>
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-pink-500" />
                <span>Gift wrapping available at checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-pink-500" />
                <span>Multiple payment options</span>
              </div>
            </div>
          </div>
        </motion.aside>
      </div>

      <AnimatePresence>
        {showCheckout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowCheckout(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-pink-100 flex items-center justify-between">
                <h2 className="font-playfair text-2xl font-bold text-pink-800">Checkout 💳</h2>
                <button
                  onClick={() => setShowCheckout(false)}
                  className="p-2 rounded-xl text-pink-500 hover:bg-pink-100"
                >
                  ✕
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="font-playfair text-lg font-bold text-pink-800 mb-3">Delivery Address</h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 rounded-xl border border-pink-200 cursor-pointer hover:bg-pink-50">
                      <input type="radio" name="address" className="w-4 h-4 text-pink-500" />
                      <div>
                        <p className="font-poppins font-medium text-pink-800">Home Address</p>
                        <p className="font-poppins text-sm text-pink-500">123 Flower Street, Garden City - 123456</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-3 rounded-xl border border-pink-200 cursor-pointer hover:bg-pink-50">
                      <input type="radio" name="address" className="w-4 h-4 text-pink-500" />
                      <div>
                        <p className="font-poppins font-medium text-pink-800">Work Address</p>
                        <p className="font-poppins text-sm text-pink-500">456 Design Avenue, Creative Hub - 789012</p>
                      </div>
                    </label>
                    <button className="btn-secondary w-full">
                      + Add New Address
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="font-playfair text-lg font-bold text-pink-800 mb-3">Payment Method</h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 rounded-xl border border-pink-200 cursor-pointer hover:bg-pink-50">
                      <input type="radio" name="payment" className="w-4 h-4 text-pink-500" />
                      <span className="font-poppins text-pink-700">Cash on Delivery 💵</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 rounded-xl border border-pink-200 cursor-pointer hover:bg-pink-50">
                      <input type="radio" name="payment" className="w-4 h-4 text-pink-500" />
                      <span className="font-poppins text-pink-700">UPI / Net Banking 📱</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 rounded-xl border border-pink-200 cursor-pointer hover:bg-pink-50">
                      <input type="radio" name="payment" className="w-4 h-4 text-pink-500" />
                      <span className="font-poppins text-pink-700">Credit / Debit Card 💳</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 rounded-xl border border-pink-200 cursor-pointer hover:bg-pink-50">
                      <input type="radio" name="payment" className="w-4 h-4 text-pink-500" />
                      <span className="font-poppins text-pink-700">Wallet / Pay Later 👛</span>
                    </label>
                  </div>
                </div>

                <div className="border-t border-pink-100 pt-4">
                  <div className="flex justify-between text-sm font-poppins mb-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-pink-700">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm font-poppins mb-2">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-pink-700">{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                  </div>
                  <div className="flex justify-between text-sm font-poppins mb-2 text-green-600">
                    <span>Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                  <div className="border-t border-pink-100 pt-3 flex justify-between">
                    <span className="font-playfair font-bold text-pink-800 text-lg">Total</span>
                    <span className="font-playfair text-2xl font-bold bg-gradient-pink-dark bg-clip-text text-transparent">₹{total}</span>
                  </div>
                </div>

                <button
                  onClick={completeOrder}
                  className="btn-primary w-full py-4 text-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Place Order 🎉
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}