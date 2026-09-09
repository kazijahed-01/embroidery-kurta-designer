import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useDesign } from '../context/DesignContext'
import { useCart } from '../context/CartContext'
import { Camera, Edit, MapPin, CreditCard, Heart, Package, Settings, Bell, LogOut, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'

export function Profile() {
  const { user, updateProfile, signOut } = useAuth()
  const { savedDesigns } = useDesign()
  const { getCartCount, getCartTotal } = useCart()
  const [activeTab, setActiveTab] = useState('overview')
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: ''
  })
  const [avatarPreview, setAvatarPreview] = useState(null)

  const handleSave = async () => {
    const { error } = await updateProfile(formData)
    if (error) {
      toast.error('Failed to update profile 😢', { emoji: true })
    } else {
      toast.success('Profile updated! ✨', { emoji: true })
      setEditing(false)
    }
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result)
        // In real app, upload to storage
      }
      reader.readAsDataURL(file)
    }
  }

  const stats = [
    { label: 'Designs Created', value: savedDesigns.length, icon: '✨', color: 'from-pink-400 to-rose-400' },
    { label: 'Saved Favorites', value: savedDesigns.filter(d => d.saved).length, icon: '❤️', color: 'from-rose-400 to-pink-500' },
    { label: 'Cart Items', value: getCartCount(), icon: '🛒', color: 'from-pink-500 to-pink-600' },
    { label: 'Total Cart Value', value: `₹${getCartTotal()}`, icon: '💰', color: 'from-amber-400 to-orange-500' },
  ]

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '👤' },
    { id: 'designs', label: 'My Designs', icon: '✨' },
    { id: 'orders', label: 'Orders', icon: '📦' },
    { id: 'addresses', label: 'Addresses', icon: '📍' },
    { id: 'payments', label: 'Payments', icon: '💳' },
    { id: 'wishlist', label: 'Wishlist', icon: '❤️' },
  ]

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="font-playfair text-3xl md:text-4xl font-bold bg-gradient-pink-dark bg-clip-text text-transparent">
          My Profile 👤
        </h1>
        <p className="font-poppins text-pink-500 mt-1">Manage your account and preferences ✨</p>
      </motion.div>

      <div className="grid lg:grid-cols-4 gap-6">
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-1 space-y-6"
        >
          <div className="card-elevated p-6 text-center">
            <div className="relative inline-block mb-4">
              <div className="avatar-lg">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
                ) : user?.avatar_url ? (
                  <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-bold text-white">{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
                )}
              </div>
              {editing && (
                <label className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg cursor-pointer hover:shadow-xl transition-shadow">
                  <Camera className="w-5 h-5 text-pink-600" />
                  <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                </label>
              )}
            </div>
            <h2 className="font-playfair text-xl font-bold text-pink-800">{user?.name || 'Guest User'}</h2>
            <p className="font-poppins text-sm text-pink-500 mt-1">{user?.email}</p>
            <p className="font-poppins text-xs text-pink-400 mt-1">Member since {new Date(user?.created_at || Date.now()).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</p>
            
            {editing ? (
              <div className="mt-4 flex gap-2">
                <button onClick={handleSave} className="btn-primary flex-1 text-sm">Save</button>
                <button onClick={() => { setEditing(false); setFormData({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '', bio: '' }) }} className="btn-secondary flex-1 text-sm">Cancel</button>
              </div>
            ) : (
              <button onClick={() => setEditing(true)} className="btn-secondary mt-4 w-full text-sm">
                <Edit className="w-4 h-4 mr-1" />
                Edit Profile
              </button>
            )}
          </div>

          <div className="card-elevated p-6">
            <h3 className="font-playfair font-bold text-pink-800 mb-4">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-3">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1, duration: 0.3 }}
                  className="p-3 bg-pink-50 rounded-xl text-center"
                >
                  <span className="text-2xl block mb-1" role="img" aria-hidden="true">{stat.icon}</span>
                  <p className="font-playfair font-bold bg-gradient-to-r {stat.color} bg-clip-text text-transparent">{stat.value}</p>
                  <p className="font-poppins text-xs text-pink-500">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="card-elevated p-6">
            <h3 className="font-playfair font-bold text-pink-800 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 p-3 rounded-xl text-pink-600 hover:bg-pink-50 transition-colors text-left">
                <Package className="w-5 h-5" />
                <span className="font-poppins font-medium">My Orders</span>
                <ChevronRight className="w-4 h-4 ml-auto text-pink-300" />
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-xl text-pink-600 hover:bg-pink-50 transition-colors text-left">
                <Heart className="w-5 h-5" />
                <span className="font-poppins font-medium">Wishlist</span>
                <ChevronRight className="w-4 h-4 ml-auto text-pink-300" />
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-xl text-pink-600 hover:bg-pink-50 transition-colors text-left">
                <MapPin className="w-5 h-5" />
                <span className="font-poppins font-medium">Addresses</span>
                <ChevronRight className="w-4 h-4 ml-auto text-pink-300" />
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-xl text-pink-600 hover:bg-pink-50 transition-colors text-left">
                <CreditCard className="w-5 h-5" />
                <span className="font-poppins font-medium">Payment Methods</span>
                <ChevronRight className="w-4 h-4 ml-auto text-pink-300" />
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-xl text-pink-600 hover:bg-pink-50 transition-colors text-left">
                <Settings className="w-5 h-5" />
                <span className="font-poppins font-medium">Settings</span>
                <ChevronRight className="w-4 h-4 ml-auto text-pink-300" />
              </button>
              <button onClick={signOut} className="w-full flex items-center gap-3 p-3 rounded-xl text-rose-500 hover:bg-rose-50 transition-colors text-left">
                <LogOut className="w-5 h-5" />
                <span className="font-poppins font-medium">Logout</span>
              </button>
            </div>
          </div>
        </motion.aside>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="lg:col-span-3 space-y-6"
        >
          <div className="flex flex-wrap gap-2 mb-6" role="tablist" aria-label="Profile sections">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                role="tab"
                aria-selected={activeTab === tab.id}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-poppins font-medium text-sm transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-pink-dark text-white shadow-md shadow-pink-300/50'
                    : 'bg-pink-50 text-pink-600 hover:bg-pink-100'
                }`}
              >
                <span className="text-lg" role="img" aria-hidden="true">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="card-elevated p-6">
                    <h3 className="font-playfair text-xl font-bold text-pink-800 mb-4 flex items-center gap-2">
                      <Edit className="w-5 h-5" />
                      Personal Information
                    </h3>
                    {editing ? (
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="input-label">Full Name</label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="input-field"
                          />
                        </div>
                        <div>
                          <label className="input-label">Email</label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            className="input-field"
                          />
                        </div>
                        <div>
                          <label className="input-label">Phone</label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                            className="input-field"
                          />
                        </div>
                        <div>
                          <label className="input-label">Bio</label>
                          <textarea
                            value={formData.bio}
                            onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                            className="input-field min-h-[100px] resize-y"
                            placeholder="Tell us about yourself..."
                          />
                        </div>
                      </div>
                    ) : (
                      <dl className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <dt className="font-poppins text-sm text-pink-500">Full Name</dt>
                            <dd className="font-playfair font-medium text-pink-800 mt-1">{user?.name || 'Not set'}</dd>
                          </div>
                          <div>
                            <dt className="font-poppins text-sm text-pink-500">Email</dt>
                            <dd className="font-playfair font-medium text-pink-800 mt-1">{user?.email || 'Not set'}</dd>
                          </div>
                          <div>
                            <dt className="font-poppins text-sm text-pink-500">Phone</dt>
                            <dd className="font-playfair font-medium text-pink-800 mt-1">{user?.phone || 'Not set'}</dd>
                          </div>
                          <div>
                            <dt className="font-poppins text-sm text-pink-500">Role</dt>
                            <dd className="font-playfair font-medium text-pink-800 mt-1 capitalize">{user?.role || 'user'}</dd>
                          </div>
                        </div>
                      </dl>
                    )}
                  </div>

                  <div className="card-elevated p-6">
                    <h3 className="font-playfair text-xl font-bold text-pink-800 mb-4 flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      Recent Orders
                    </h3>
                    <div className="text-center py-8">
                      <Package className="w-12 h-12 text-pink-300 mx-auto mb-3" />
                      <p className="font-poppins text-pink-500">No recent orders</p>
                      <a href="/shop" className="btn-primary inline-block mt-4">Shop Now 🛍️</a>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'designs' && (
                <div className="card-elevated p-6">
                  <h3 className="font-playfair text-xl font-bold text-pink-800 mb-4">My Designs</h3>
                  {savedDesigns.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {savedDesigns.map((design, i) => (
                        <motion.div
                          key={design.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.05, duration: 0.3 }}
                          className="card p-4"
                        >
                          <h4 className="font-playfair font-bold text-pink-800">{design.name}</h4>
                          <p className="font-poppins text-sm text-pink-500">{design.kurtaStyle} • {design.fabric}</p>
                          <div className="flex gap-2 mt-3">
                            <button className="btn-primary text-sm flex-1">Edit ✏️</button>
                            <button className="btn-secondary text-sm flex-1">View 👁️</button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <span className="text-4xl block mb-3" role="img" aria-hidden="true">✨</span>
                      <p className="font-poppins text-pink-500">No saved designs yet</p>
                      <a href="/design-studio" className="btn-primary inline-block mt-4">Create Your First Design ✨</a>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="card-elevated p-6">
                  <h3 className="font-playfair text-xl font-bold text-pink-800 mb-4">Order History</h3>
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-pink-300 mx-auto mb-3" />
                    <p className="font-poppins text-pink-500">View all your orders in the Orders page</p>
                    <a href="/orders" className="btn-primary inline-block mt-4">View Orders 📦</a>
                  </div>
                </div>
              )}

              {activeTab === 'addresses' && (
                <div className="card-elevated p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-playfair text-xl font-bold text-pink-800 flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Saved Addresses
                    </h3>
                    <button className="btn-primary text-sm">+ Add Address</button>
                  </div>
                  <div className="space-y-4">
                    {[
                      { label: 'Home', address: '123 Flower Street, Garden City - 123456', default: true },
                      { label: 'Work', address: '456 Design Avenue, Creative Hub - 789012', default: false },
                    ].map((addr, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-4 bg-pink-50 rounded-xl border border-pink-100"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <MapPin className="w-6 h-6 text-pink-500" />
                            <div>
                              <p className="font-playfair font-bold text-pink-800">{addr.label} {addr.default && <span className="badge badge-pink ml-2">Default</span>}</p>
                              <p className="font-poppins text-sm text-pink-600">{addr.address}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button className="btn-secondary text-sm">Edit</button>
                            {!addr.default && <button className="btn-secondary text-sm">Set Default</button>}
                            <button className="btn-secondary text-sm text-rose-500 border-rose-200 hover:bg-rose-50">Delete</button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'payments' && (
                <div className="card-elevated p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-playfair text-xl font-bold text-pink-800 flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Payment Methods
                    </h3>
                    <button className="btn-primary text-sm">+ Add Card</button>
                  </div>
                  <div className="space-y-4">
                    {[
                      { type: 'Visa', last4: '4242', expiry: '12/26', default: true },
                      { type: 'Mastercard', last4: '5555', expiry: '08/25', default: false },
                    ].map((card, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center justify-between p-4 bg-pink-50 rounded-xl border border-pink-100"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-10 rounded-lg bg-gradient-to-r from-gray-800 to-gray-900 flex items-center justify-center text-white font-bold text-sm">
                            {card.type}
                          </div>
                          <div>
                            <p className="font-playfair font-bold text-pink-800">•••• •••• •••• {card.last4}</p>
                            <p className="font-poppins text-sm text-pink-500">Expires {card.expiry} {card.default && <span className="badge badge-pink ml-2">Default</span>}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {!card.default && <button className="btn-secondary text-sm">Set Default</button>}
                          <button className="btn-secondary text-sm text-rose-500 border-rose-200 hover:bg-rose-50">Remove</button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'wishlist' && (
                <div className="card-elevated p-6">
                  <h3 className="font-playfair text-xl font-bold text-pink-800 mb-4 flex items-center gap-2">
                    <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
                    Wishlist
                  </h3>
                  <div className="text-center py-8">
                    <Heart className="w-12 h-12 text-pink-300 mx-auto mb-3 fill-current" />
                    <p className="font-poppins text-pink-500">Your wishlist is empty</p>
                    <a href="/shop" className="btn-primary inline-block mt-4">Explore Designs 🛍️</a>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}