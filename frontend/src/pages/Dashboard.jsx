import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useDesign } from '../context/DesignContext'
import { Sparkles, Heart, ShoppingBag, Package, TrendingUp, Palette } from 'lucide-react'

const featuredDesigns = [
  { id: 1, name: 'Floral Dream', style: 'Anarkali', fabric: 'Silk', color: '#f472b6', embroidery: 'Floral', price: 1299, image: '🌸' },
  { id: 2, name: 'Royal Paisley', style: 'Straight Kurta', fabric: 'Chanderi', color: '#800000', embroidery: 'Paisley', price: 1499, image: '🌿' },
  { id: 3, name: 'Minimalist Chic', style: 'Western Kurti', fabric: 'Cotton', color: '#fafafa', embroidery: 'Minimal', price: 899, image: '✨' },
  { id: 4, name: 'Bridal Bloom', style: 'Long Kurta', fabric: 'Silk', color: '#fbbf24', embroidery: 'Bridal', price: 2199, image: '💎' },
]

const popularKurtas = [
  { id: 5, name: 'Cotton Comfort', style: 'Straight Kurta', fabric: 'Cotton', color: '#059669', price: 799, image: '🌿' },
  { id: 6, name: 'Silk Elegance', style: 'A-Line', fabric: 'Silk', color: '#9333ea', price: 1299, image: '✨' },
  { id: 7, name: 'Linen Breeze', style: 'Short Kurti', fabric: 'Linen', color: '#f59e0b', price: 899, image: '🌊' },
  { id: 8, name: 'Chanderi Grace', style: 'Long Kurta', fabric: 'Chanderi', color: '#ec4899', price: 1199, image: '👑' },
]

const newDesigns = [
  { id: 9, name: 'Peacock Majesty', style: 'Anarkali', fabric: 'Silk', color: '#0d9488', embroidery: 'Peacock', price: 1699, image: '🦚' },
  { id: 10, name: 'Butterfly Garden', style: 'Western Kurti', fabric: 'Rayon', color: '#f472b6', embroidery: 'Butterfly', price: 1099, image: '🦋' },
  { id: 11, name: 'Mandala Magic', style: 'Straight Kurta', fabric: 'Cotton', color: '#800000', embroidery: 'Mandala', price: 1149, image: '🕉️' },
  { id: 12, name: 'Zari Splendor', style: 'A-Line', fabric: 'Chanderi', color: '#fbbf24', embroidery: 'Zari', price: 1599, image: '✨' },
]

export function Dashboard() {
  const { user } = useAuth()
  const { getCartCount, getCartTotal } = useCart()
  const { savedDesigns } = useDesign()
  
  const cartCount = getCartCount()
  const cartTotal = getCartTotal()
  const userName = user?.name?.split(' ')[0] || 'Beautiful'

  const stats = [
    { label: 'Designs Created', value: savedDesigns.length, icon: '✨', color: 'from-pink-400 to-rose-400' },
    { label: 'Saved Favorites', value: savedDesigns.filter(d => d.saved).length, icon: '❤️', color: 'from-rose-400 to-pink-500' },
    { label: 'Cart Items', value: cartCount, icon: '🛒', color: 'from-pink-500 to-pink-600' },
    { label: 'Total Value', value: `₹${cartTotal}`, icon: '💰', color: 'from-amber-400 to-orange-500' },
  ]

  const quickActions = [
    { label: 'Design Studio', path: '/design-studio', icon: Sparkles, emoji: '✨', color: 'from-pink-400 to-rose-500', desc: 'Create your dream kurta' },
    { label: 'Explore Designs', path: '/shop', icon: Palette, emoji: '🎨', color: 'from-purple-400 to-pink-500', desc: 'Browse ready-made designs' },
    { label: 'My Collection', path: '/my-collection', icon: Heart, emoji: '❤️', color: 'from-rose-400 to-red-500', desc: 'View saved designs' },
    { label: 'Track Orders', path: '/orders', icon: Package, emoji: '📦', color: 'from-blue-400 to-purple-500', desc: 'Check order status' },
  ]

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-playfair text-3xl md:text-4xl font-bold bg-gradient-pink-dark bg-clip-text text-transparent"
          >
            Welcome back, {userName}! 👋
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="font-poppins text-pink-500 mt-1"
          >
            Ready to create something beautiful today? ✨
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-3"
        >
          <Link to="/design-studio" className="btn-primary">
            <Sparkles className="w-5 h-5 mr-2" />
            Design Your Kurta
          </Link>
          <Link to="/shop" className="btn-secondary">
            Explore Collection
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
        role="list"
        aria-label="Statistics"
      >
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
            className="card-elevated p-6 text-center"
            role="listitem"
          >
            <span className="text-3xl block mb-2" role="img" aria-hidden="true">{stat.icon}</span>
            <p className="font-playfair text-2xl font-bold bg-gradient-to-r {stat.color} bg-clip-text text-transparent">
              {stat.value}
            </p>
            <p className="font-poppins text-sm text-pink-500 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="space-y-6"
        aria-labelledby="quick-actions-heading"
      >
        <div className="flex items-center justify-between">
          <h2 id="quick-actions-heading" className="section-title">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, i) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
              className="card-elevated p-6 text-center group"
            >
              <Link to={action.path} className="block">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-2xl" role="img" aria-hidden="true">{action.emoji}</span>
                </div>
                <h3 className="font-playfair font-bold text-pink-800 mb-1">{action.label}</h3>
                <p className="font-poppins text-sm text-pink-500">{action.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="space-y-6"
        aria-labelledby="featured-heading"
      >
        <div className="flex items-center justify-between">
          <h2 id="featured-heading" className="section-title">✨ Featured Embroidery Designs</h2>
          <Link to="/shop" className="btn-ghost text-sm">View All →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredDesigns.map((design, i) => (
            <motion.article
              key={design.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1, duration: 0.4 }}
              className="design-card group"
            >
              <div className="aspect-[3/4] bg-gradient-to-br from-pink-50 to-pink-100 relative overflow-hidden flex items-center justify-center">
                <span className="text-6xl" role="img" aria-hidden="true">{design.image}</span>
                <div className="absolute inset-0 bg-gradient-pink-dark opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
              </div>
              <div className="p-4">
                <h3 className="font-playfair font-bold text-pink-800">{design.name}</h3>
                <p className="font-poppins text-sm text-pink-500">{design.style} • {design.fabric}</p>
                <p className="font-poppins text-xs text-pink-400">{design.embroidery} Embroidery</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="price-display text-lg">₹{design.price}</span>
                  <button className="p-2 rounded-xl bg-pink-100 text-pink-600 hover:bg-pink-200 transition-colors" aria-label="Add to cart">
                    🛒
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="space-y-6"
        aria-labelledby="popular-heading"
      >
        <div className="flex items-center justify-between">
          <h2 id="popular-heading" className="section-title">🌸 Popular Kurtas</h2>
          <Link to="/shop" className="btn-ghost text-sm">View All →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularKurtas.map((kurta, i) => (
            <motion.article
              key={kurta.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
              className="card-elevated overflow-hidden"
            >
              <div className="aspect-[3/4] bg-gradient-to-br from-pink-50 to-pink-100 relative flex items-center justify-center">
                <span className="text-6xl" role="img" aria-hidden="true">{kurta.image}</span>
              </div>
              <div className="p-4">
                <h3 className="font-playfair font-bold text-pink-800">{kurta.name}</h3>
                <p className="font-poppins text-sm text-pink-500">{kurta.style} • {kurta.fabric}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="price-display text-lg">₹{kurta.price}</span>
                  <button className="btn-primary text-sm px-4 py-2">Add to Cart</button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="space-y-6"
        aria-labelledby="new-heading"
      >
        <div className="flex items-center justify-between">
          <h2 id="new-heading" className="section-title">🆕 New Designs</h2>
          <Link to="/shop" className="btn-ghost text-sm">View All →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {newDesigns.map((design, i) => (
            <motion.article
              key={design.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1, duration: 0.4 }}
              className="design-card group"
            >
              <div className="aspect-[3/4] bg-gradient-to-br from-pink-50 to-pink-100 relative overflow-hidden flex items-center justify-center">
                <span className="text-6xl" role="img" aria-hidden="true">{design.image}</span>
                <div className="absolute top-3 right-3 bg-gradient-pink-dark text-white text-xs font-poppins px-2 py-1 rounded-full">NEW</div>
              </div>
              <div className="p-4">
                <h3 className="font-playfair font-bold text-pink-800">{design.name}</h3>
                <p className="font-poppins text-sm text-pink-500">{design.style} • {design.fabric}</p>
                <p className="font-poppins text-xs text-pink-400">{design.embroidery} Embroidery</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="price-display text-lg">₹{design.price}</span>
                  <button className="p-2 rounded-xl bg-pink-100 text-pink-600 hover:bg-pink-200 transition-colors" aria-label="Add to cart">
                    🛒
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="space-y-6"
        aria-labelledby="recent-heading"
      >
        <div className="flex items-center justify-between">
          <h2 id="recent-heading" className="section-title">❤️ Recently Saved Designs</h2>
          <Link to="/my-collection" className="btn-ghost text-sm">View All →</Link>
        </div>
        {savedDesigns.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {savedDesigns.slice(-4).reverse().map((design, i) => (
              <motion.article
                key={design.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.1, duration: 0.4 }}
                className="card-elevated p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center text-3xl flex-shrink-0">
                    {design.embroidery === 'Floral' ? '🌸' : design.embroidery === 'Paisley' ? '🌿' : '✨'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-playfair font-bold text-pink-800 truncate">{design.name || 'Untitled Design'}</h3>
                    <p className="font-poppins text-sm text-pink-500">{design.kurtaStyle} • {design.fabric}</p>
                    <p className="font-poppins text-xs text-pink-400">{design.color} • {design.embroidery}</p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="card p-12 text-center">
            <span className="text-4xl block mb-3" role="img" aria-hidden="true">💖</span>
            <h3 className="font-playfair text-xl font-bold text-pink-700 mb-2">No saved designs yet</h3>
            <p className="font-poppins text-pink-500 mb-4">Start creating and save your favorite designs!</p>
            <Link to="/design-studio" className="btn-primary inline-block">Start Designing ✨</Link>
          </div>
        )}
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="space-y-6"
        aria-labelledby="orders-heading"
      >
        <div className="flex items-center justify-between">
          <h2 id="orders-heading" className="section-title">📦 Recent Orders</h2>
          <Link to="/orders" className="btn-ghost text-sm">View All →</Link>
        </div>
        <div className="card p-8 text-center">
          <span className="text-4xl block mb-3" role="img" aria-hidden="true">📦</span>
          <h3 className="font-playfair text-xl font-bold text-pink-700 mb-2">No recent orders</h3>
          <p className="font-poppins text-pink-500 mb-4">Your orders will appear here once you shop!</p>
          <Link to="/shop" className="btn-primary inline-block">Start Shopping 🛍️</Link>
        </div>
      </motion.section>
    </div>
  )
}