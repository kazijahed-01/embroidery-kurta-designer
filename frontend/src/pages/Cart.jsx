import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import {
  Trash2,
  Plus,
  Minus,
  Heart,
  ArrowLeft,
  CreditCard,
  Gift,
  Truck,
  CheckCircle
} from 'lucide-react'
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

function getKurtaSilhouette(style = '') {
  const normalizedStyle = style.toLowerCase()

  if (normalizedStyle.includes('anarkali')) return kurtaSilhouettes.anarkali
  if (normalizedStyle.includes('a-line')) return kurtaSilhouettes['a-line']
  if (normalizedStyle.includes('short')) return kurtaSilhouettes.short
  if (normalizedStyle.includes('long')) return kurtaSilhouettes.long
  if (normalizedStyle.includes('western')) return kurtaSilhouettes.western

  return kurtaSilhouettes.straight
}

export function Cart() {
  const {
    cartItems,
    updateQuantity,
    updateSize,
    removeFromCart,
    clearCart,
    getCartTotal,
    loading
  } = useCart()

  const { user } = useAuth()
  const navigate = useNavigate()

  const [promoCode, setPromoCode] = useState('')
  const [discountRate, setDiscountRate] = useState(0)
  const [showCheckout, setShowCheckout] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('')
  const [addresses, setAddresses] = useState([])
  const [addressesLoading, setAddressesLoading] = useState(false)
  const [selectedAddressId, setSelectedAddressId] = useState('')
  const [showAddressForm, setShowAddressForm] = useState(false)

  const [addressForm, setAddressForm] = useState({
    label: 'Home',
    name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    pincode: '',
    is_default: false
  })

  const subtotal = getCartTotal()
  const shipping = subtotal > 2000 ? 0 : 99
  const discountAmount = Math.round((subtotal * discountRate) / 100)
  const total = Math.max(0, subtotal + shipping - discountAmount)

  const cartQuantity = cartItems.reduce(
    (count, item) => count + item.quantity,
    0
  )

  const loadAddresses = async () => {
    if (!user) {
      setAddresses([])
      return
    }

    setAddressesLoading(true)

    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Could not load addresses:', error)
      toast.error('Could not load saved addresses 😢', { emoji: true })
    } else {
      const savedAddresses = data || []

      setAddresses(savedAddresses)

      setSelectedAddressId((currentId) => {
        if (
          currentId &&
          savedAddresses.some((address) => address.id === currentId)
        ) {
          return currentId
        }

        return (
          savedAddresses.find((address) => address.is_default)?.id ||
          savedAddresses[0]?.id ||
          ''
        )
      })
    }

    setAddressesLoading(false)
  }

  useEffect(() => {
    loadAddresses()
  }, [user])

  const openAddressForm = () => {
    setAddressForm({
      label: 'Home',
      name: user?.name || '',
      phone: user?.phone || '',
      address_line1: '',
      address_line2: '',
      city: '',
      state: '',
      pincode: '',
      is_default: addresses.length === 0
    })

    setShowAddressForm(true)
  }

  const saveAddress = async (event) => {
    event.preventDefault()

    if (!user) {
      toast.error('Please login first 🔒', { emoji: true })
      return
    }

    const { data, error } = await supabase
      .from('addresses')
      .insert({
        user_id: user.id,
        label: addressForm.label,
        name: addressForm.name,
        phone: addressForm.phone,
        address_line1: addressForm.address_line1,
        address_line2: addressForm.address_line2 || null,
        city: addressForm.city,
        state: addressForm.state,
        pincode: addressForm.pincode,
        is_default: addressForm.is_default
      })
      .select()
      .single()

    if (error) {
      console.error(error)
      toast.error('Could not save address 😢', { emoji: true })
      return
    }

    if (addressForm.is_default) {
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', user.id)
        .neq('id', data.id)
    }

    setSelectedAddressId(data.id)
    setShowAddressForm(false)
    toast.success('Address saved! 📍', { emoji: true })
    await loadAddresses()
  }

  const applyPromo = () => {
    const codes = {
      WELCOME10: 10,
      THREAD20: 20,
      BLOOM15: 15,
      FIRST50: 50
    }

    const upperCode = promoCode.trim().toUpperCase()

    if (codes[upperCode]) {
      setDiscountRate(codes[upperCode])
      toast.success(`Promo applied! ${codes[upperCode]}% off ✨`, {
        emoji: true
      })
    } else {
      toast.error('Invalid promo code 😢', { emoji: true })
    }
  }

  const handleCheckout = () => {
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
    const selectedAddress = addresses.find(
      (address) => address.id === selectedAddressId
    )

    if (!selectedAddress) {
      toast.error('Please select or add a delivery address 📍', {
        emoji: true
      })
      return
    }

    if (!paymentMethod) {
      toast.error('Please select a payment method 💳', { emoji: true })
      return
    }

    const cartDetails = cartItems.map((cartItem) => {
      const productOrDesign = cartItem.user_designs || cartItem.products

      if (!productOrDesign) return null

      const unitPrice =
        Number(productOrDesign.base_price || 0) +
        Number(productOrDesign.embroidery_price || 0) +
        Number(productOrDesign.customization_price || 0)

      return {
        product_id: cartItem.product_id || null,
        design_id: cartItem.design_id || null,
        quantity: cartItem.quantity,
        size: cartItem.size,
        unit_price: unitPrice,
        total_price: unitPrice * cartItem.quantity
      }
    })

    if (cartDetails.some((item) => item === null)) {
      toast.error('One cart item could not be processed 😢', { emoji: true })
      return
    }

    const { data: newOrder, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        subtotal,
        shipping,
        discount: discountAmount,
        total,
        status: 'placed',
        payment_method: paymentMethod,
        payment_status: 'pending',
        shipping_address: {
          label: selectedAddress.label,
          name: selectedAddress.name,
          phone: selectedAddress.phone,
          address_line1: selectedAddress.address_line1,
          address_line2: selectedAddress.address_line2,
          city: selectedAddress.city,
          state: selectedAddress.state,
          pincode: selectedAddress.pincode,
          country: selectedAddress.country || 'India'
        },
        promo_code: promoCode.trim().toUpperCase() || null
      })
      .select()
      .single()

    if (orderError) {
      console.error(orderError)
      toast.error('Could not create your order 😢', { emoji: true })
      return
    }

    const orderItems = cartDetails.map((item) => ({
      ...item,
      order_id: newOrder.id
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      console.error(itemsError)
      toast.error('Order was created, but its items could not be saved 😢', {
        emoji: true
      })
      return
    }

    await clearCart()
    setShowCheckout(false)

    toast.success(`Order ${newOrder.order_number} placed! 🎉`, {
      emoji: true
    })

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
          <span className="text-6xl block mb-4">🛒</span>
          <h1 className="font-playfair text-3xl font-bold text-pink-700 mb-2">
            Your cart is empty
          </h1>
          <p className="font-poppins text-pink-500 mb-6">
            Looks like you haven't added any designs yet
          </p>
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
        <p className="font-poppins text-pink-500 mt-1">
          {cartQuantity} item{cartQuantity !== 1 ? 's' : ''} in your cart
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-2 space-y-4"
        >
          <AnimatePresence>
            {cartItems.map((item, index) => {
              const productOrDesign = item.user_designs || item.products
              if (!productOrDesign) return null

              const design = {
                ...productOrDesign,
                kurta_style:
                  productOrDesign.kurta_style ||
                  productOrDesign.style ||
                  'Straight Kurta',
                color:
                  productOrDesign.color ||
                  productOrDesign.colors?.[0] ||
                  '#ec4899',
                embroidery_design:
                  productOrDesign.embroidery_design || 'Handcrafted',
                embroidery_position:
                  productOrDesign.embroidery_position || 'Ready-to-wear',
                embroidery_color:
                  productOrDesign.embroidery_color || '#ec4899',
                base_price: Number(productOrDesign.base_price || 0),
                embroidery_price: Number(productOrDesign.embroidery_price || 0),
                customization_price: Number(
                  productOrDesign.customization_price || 0
                )
              }

              const unitPrice =
                design.base_price +
                design.embroidery_price +
                design.customization_price

              const fabricClass =
                design.fabric?.toLowerCase() === 'cotton'
                  ? 'fabric-cotton'
                  : design.fabric?.toLowerCase() === 'silk'
                    ? 'fabric-silk'
                    : 'fabric-linen'

              return (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className="card-elevated flex flex-col md:flex-row gap-4 p-4"
                >
                  <div className="relative w-32 h-40 md:w-40 md:h-48 flex-shrink-0">
                    <div
                      className="absolute inset-0 bg-gradient-to-br from-pink-50 to-pink-100"
                      style={{
                        clipPath: getKurtaSilhouette(design.kurta_style)
                      }}
                    >
                      <div className={`absolute inset-0 ${fabricClass} opacity-30`} />
                      <div
                        className="absolute inset-0"
                        style={{ backgroundColor: design.color }}
                      >
                        <div className="absolute inset-0 bg-white/10" />
                      </div>
                    </div>

                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute left-1/2 top-1/2"
                      style={{
                        transform: 'translate(-50%, -50%)',
                        color: design.embroidery_color
                      }}
                    >
                      <span className="text-2xl">
                        {design.embroidery_design === 'Floral'
                          ? '🌸'
                          : design.embroidery_design === 'Paisley'
                            ? '🌿'
                            : design.embroidery_design === 'Peacock'
                              ? '🦚'
                              : design.embroidery_design === 'Butterfly'
                                ? '🦋'
                                : '✨'}
                      </span>
                    </motion.div>
                  </div>

                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <h3 className="font-playfair font-bold text-pink-800 truncate">
                        {design.name}
                      </h3>

                      <div className="flex flex-wrap gap-1 mt-2">
                        <span className="badge badge-pink">{design.kurta_style}</span>
                        <span className="badge badge-pink">{design.fabric}</span>
                        <span className="badge badge-rose">
                          {design.embroidery_design}
                        </span>
                        <span className="badge badge-rose">
                          {design.embroidery_position}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-4 pt-4 border-t border-pink-100">
                      <div className="flex items-center gap-2">
                        <label className="font-poppins text-sm text-pink-600">
                          Size:
                        </label>
                        <select
                          value={item.size}
                          onChange={(event) =>
                            updateSize(item.id, event.target.value)
                          }
                          className="px-3 py-1.5 rounded-lg border border-pink-200 bg-white text-pink-700 font-poppins text-sm"
                        >
                          {sizes.map((size) => (
                            <option key={size} value={size}>
                              {size}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="font-poppins text-sm text-pink-600">
                          Qty:
                        </label>
                        <div className="flex items-center border border-pink-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                            className="px-3 py-1.5 text-pink-600 hover:bg-pink-50 disabled:opacity-50"
                          >
                            <Minus className="w-4 h-4" />
                          </button>

                          <span className="px-4 font-poppins font-bold text-pink-700">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
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
                          className="p-2 rounded-lg text-rose-400 hover:bg-rose-50"
                        >
                          <Trash2 className="w-5 h-5" />
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          className="p-2 rounded-lg text-pink-400 hover:bg-pink-50"
                        >
                          <Heart className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  <div className="md:w-32 text-right md:text-left">
                    <p className="font-playfair text-xl font-bold text-pink-700">
                      ₹{unitPrice * item.quantity}
                    </p>
                    <p className="font-poppins text-sm text-pink-400">
                      × {item.quantity}
                    </p>
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
            <h2 className="font-playfair text-xl font-bold text-pink-800 mb-4">
              💰 Order Summary
            </h2>

            <div className="space-y-3 text-sm font-poppins">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({cartQuantity} items)</span>
                <span className="font-medium text-pink-700">₹{subtotal}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="font-medium text-pink-700">
                  {shipping === 0 ? 'FREE 🚚' : `₹${shipping}`}
                </span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Discount</span>
                <span className="font-medium text-green-600">
                  -₹{discountAmount}
                </span>
              </div>

              <div className="border-t border-pink-100 pt-3 flex justify-between">
                <span className="font-playfair font-bold text-pink-800">
                  Total
                </span>
                <span className="font-playfair text-2xl font-bold text-pink-700">
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
                  onChange={(event) => setPromoCode(event.target.value)}
                  placeholder="Enter promo code"
                  className="input-field flex-1"
                />
                <button onClick={applyPromo} className="btn-secondary">
                  Apply
                </button>
              </div>
              <p className="font-poppins text-xs text-pink-400 mt-2">
                Try: WELCOME10, THREAD20, BLOOM15, FIRST50
              </p>
            </div>

            <motion.button
              onClick={handleCheckout}
              className="btn-primary w-full py-4 mt-4 text-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <CreditCard className="w-5 h-5 mr-2" />
              Proceed to Checkout
            </motion.button>
          </div>

          <div className="card-elevated p-6">
            <h3 className="font-playfair text-lg font-bold text-pink-800 mb-4">
              🚚 Delivery Info
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
                <CheckCircle className="w-5 h-5 text-pink-500" />
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
              onClick={(event) => event.stopPropagation()}
            >
              <div className="p-6 border-b border-pink-100 flex items-center justify-between">
                <h2 className="font-playfair text-2xl font-bold text-pink-800">
                  Checkout 💳
                </h2>
                <button
                  onClick={() => setShowCheckout(false)}
                  className="p-2 rounded-xl text-pink-500 hover:bg-pink-100"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-playfair text-lg font-bold text-pink-800">
                      Delivery Address
                    </h3>
                    <button
                      onClick={openAddressForm}
                      className="btn-secondary text-sm"
                    >
                      + Add New Address
                    </button>
                  </div>

                  {showAddressForm ? (
                    <form
                      onSubmit={saveAddress}
                      className="p-4 bg-pink-50 rounded-xl space-y-3"
                    >
                      <div className="grid md:grid-cols-2 gap-3">
                        <div>
                          <label className="input-label">Address Label</label>
                          <select
                            value={addressForm.label}
                            onChange={(event) =>
                              setAddressForm({
                                ...addressForm,
                                label: event.target.value
                              })
                            }
                            className="input-field"
                          >
                            <option>Home</option>
                            <option>Work</option>
                            <option>Other</option>
                          </select>
                        </div>

                        <div>
                          <label className="input-label">Full Name</label>
                          <input
                            required
                            value={addressForm.name}
                            onChange={(event) =>
                              setAddressForm({
                                ...addressForm,
                                name: event.target.value
                              })
                            }
                            className="input-field"
                          />
                        </div>

                        <div>
                          <label className="input-label">Phone</label>
                          <input
                            required
                            type="tel"
                            value={addressForm.phone}
                            onChange={(event) =>
                              setAddressForm({
                                ...addressForm,
                                phone: event.target.value
                              })
                            }
                            className="input-field"
                          />
                        </div>

                        <div>
                          <label className="input-label">Pincode</label>
                          <input
                            required
                            value={addressForm.pincode}
                            onChange={(event) =>
                              setAddressForm({
                                ...addressForm,
                                pincode: event.target.value
                              })
                            }
                            className="input-field"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="input-label">Address Line 1</label>
                        <input
                          required
                          value={addressForm.address_line1}
                          onChange={(event) =>
                            setAddressForm({
                              ...addressForm,
                              address_line1: event.target.value
                            })
                          }
                          className="input-field"
                        />
                      </div>

                      <div>
                        <label className="input-label">Address Line 2</label>
                        <input
                          value={addressForm.address_line2}
                          onChange={(event) =>
                            setAddressForm({
                              ...addressForm,
                              address_line2: event.target.value
                            })
                          }
                          className="input-field"
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-3">
                        <div>
                          <label className="input-label">City</label>
                          <input
                            required
                            value={addressForm.city}
                            onChange={(event) =>
                              setAddressForm({
                                ...addressForm,
                                city: event.target.value
                              })
                            }
                            className="input-field"
                          />
                        </div>

                        <div>
                          <label className="input-label">State</label>
                          <input
                            required
                            value={addressForm.state}
                            onChange={(event) =>
                              setAddressForm({
                                ...addressForm,
                                state: event.target.value
                              })
                            }
                            className="input-field"
                          />
                        </div>
                      </div>

                      <label className="flex items-center gap-2 font-poppins text-sm text-pink-700">
                        <input
                          type="checkbox"
                          checked={addressForm.is_default}
                          onChange={(event) =>
                            setAddressForm({
                              ...addressForm,
                              is_default: event.target.checked
                            })
                          }
                        />
                        Make this my default address
                      </label>

                      <div className="flex gap-3">
                        <button type="submit" className="btn-primary flex-1">
                          Save Address
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAddressForm(false)}
                          className="btn-secondary flex-1"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-2">
                      {addressesLoading && (
                        <p className="font-poppins text-sm text-pink-500">
                          Loading addresses...
                        </p>
                      )}

                      {!addressesLoading && addresses.length === 0 && (
                        <div className="p-4 rounded-xl border border-dashed border-pink-200 text-center">
                          <p className="font-poppins text-pink-500">
                            No saved address yet. Add one to continue.
                          </p>
                        </div>
                      )}

                      {addresses.map((address) => (
                        <label
                          key={address.id}
                          className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer ${
                            selectedAddressId === address.id
                              ? 'border-pink-500 bg-pink-50'
                              : 'border-pink-200 hover:bg-pink-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="address"
                            checked={selectedAddressId === address.id}
                            onChange={() => setSelectedAddressId(address.id)}
                            className="mt-1 w-4 h-4"
                          />

                          <div className="flex-1">
                            <p className="font-poppins font-medium text-pink-800">
                              {address.label}
                              {address.is_default && (
                                <span className="ml-2 text-xs text-pink-500">
                                  Default
                                </span>
                              )}
                            </p>
                            <p className="font-poppins text-sm text-pink-600">
                              {address.name} · {address.phone}
                            </p>
                            <p className="font-poppins text-sm text-pink-500">
                              {address.address_line1}
                              {address.address_line2 &&
                                `, ${address.address_line2}`}
                              , {address.city}, {address.state} -{' '}
                              {address.pincode}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-playfair text-lg font-bold text-pink-800 mb-3">
                    Payment Method
                  </h3>

                  <div className="space-y-2">
                    {[
                      ['cod', 'Cash on Delivery 💵'],
                      ['upi', 'UPI / Net Banking 📱'],
                      ['card', 'Credit / Debit Card 💳']
                    ].map(([value, label]) => (
                      <label
                        key={value}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer ${
                          paymentMethod === value
                            ? 'border-pink-500 bg-pink-50'
                            : 'border-pink-200 hover:bg-pink-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={value}
                          checked={paymentMethod === value}
                          onChange={(event) =>
                            setPaymentMethod(event.target.value)
                          }
                          className="w-4 h-4"
                        />
                        <span className="font-poppins text-pink-700">
                          {label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="border-t border-pink-100 pt-4">
                  <div className="flex justify-between text-sm font-poppins mb-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-pink-700">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm font-poppins mb-2">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-pink-700">
                      {shipping === 0 ? 'FREE' : `₹${shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-poppins mb-2 text-green-600">
                    <span>Discount</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                  <div className="border-t border-pink-100 pt-3 flex justify-between">
                    <span className="font-playfair font-bold text-pink-800 text-lg">
                      Total
                    </span>
                    <span className="font-playfair text-2xl font-bold text-pink-700">
                      ₹{total}
                    </span>
                  </div>
                </div>

                <motion.button
                  onClick={completeOrder}
                  className="btn-primary w-full py-4 text-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Place Order 🎉
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}