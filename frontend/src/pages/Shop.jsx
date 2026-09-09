import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { Filter, ShoppingBag, Heart, Grid, List, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'

const allProducts = [
  { id: 1, name: 'Floral Dream Anarkali', style: 'Anarkali', fabric: 'Silk', color: '#f472b6', embroidery: 'Floral', category: 'Nature', price: 1299, originalPrice: 1599, image: '🌸', rating: 4.9, reviews: 124, isNew: true, isPopular: true },
  { id: 2, name: 'Royal Paisley Straight', style: 'Straight Kurta', fabric: 'Chanderi', color: '#800000', embroidery: 'Paisley', category: 'Traditional', price: 1499, originalPrice: 1799, image: '🌿', rating: 4.8, reviews: 89, isNew: false, isPopular: true },
  { id: 3, name: 'Minimalist Chic Western', style: 'Western Kurti', fabric: 'Cotton', color: '#fafafa', embroidery: 'Minimal', category: 'Contemporary', price: 899, originalPrice: 1099, image: '✨', rating: 4.7, reviews: 156, isNew: true, isPopular: false },
  { id: 4, name: 'Bridal Bloom Long Kurta', style: 'Long Kurta', fabric: 'Silk', color: '#fbbf24', embroidery: 'Bridal', category: 'Premium', price: 2199, originalPrice: 2599, image: '💎', rating: 5.0, reviews: 67, isNew: false, isPopular: true },
  { id: 5, name: 'Cotton Comfort Straight', style: 'Straight Kurta', fabric: 'Cotton', color: '#059669', embroidery: 'Floral', category: 'Nature', price: 799, originalPrice: 999, image: '🌿', rating: 4.6, reviews: 234, isNew: false, isPopular: true },
  { id: 6, name: 'Silk Elegance A-Line', style: 'A-Line', fabric: 'Silk', color: '#9333ea', embroidery: 'Geometric', category: 'Modern', price: 1299, originalPrice: 1599, image: '✨', rating: 4.8, reviews: 98, isNew: true, isPopular: false },
  { id: 7, name: 'Linen Breeze Short', style: 'Short Kurti', fabric: 'Linen', color: '#f59e0b', embroidery: 'Minimal', category: 'Contemporary', price: 899, originalPrice: 1099, image: '🌊', rating: 4.5, reviews: 112, isNew: true, isPopular: false },
  { id: 8, name: 'Chanderi Grace Long', style: 'Long Kurta', fabric: 'Chanderi', color: '#ec4899', embroidery: 'Traditional', category: 'Heritage', price: 1199, originalPrice: 1499, image: '👑', rating: 4.7, reviews: 76, isNew: false, isPopular: true },
  { id: 9, name: 'Peacock Majesty Anarkali', style: 'Anarkali', fabric: 'Silk', color: '#0d9488', embroidery: 'Peacock', category: 'Nature', price: 1699, originalPrice: 1999, image: '🦚', rating: 4.9, reviews: 45, isNew: true, isPopular: false },
  { id: 10, name: 'Butterfly Garden Western', style: 'Western Kurti', fabric: 'Rayon', color: '#f472b6', embroidery: 'Butterfly', category: 'Nature', price: 1099, originalPrice: 1299, image: '🦋', rating: 4.6, reviews: 87, isNew: true, isPopular: false },
  { id: 11, name: 'Mandala Magic Straight', style: 'Straight Kurta', fabric: 'Cotton', color: '#800000', embroidery: 'Mandala', category: 'Spiritual', price: 1149, originalPrice: 1399, image: '🕉️', rating: 4.7, reviews: 54, isNew: false, isPopular: false },
  { id: 12, name: 'Zari Splendor A-Line', style: 'A-Line', fabric: 'Chanderi', color: '#fbbf24', embroidery: 'Zari', category: 'Premium', price: 1599, originalPrice: 1899, image: '✨', rating: 4.8, reviews: 38, isNew: true, isPopular: false },
  { id: 13, name: 'Floral Whisper Cotton', style: 'Straight Kurta', fabric: 'Cotton', color: '#fb923c', embroidery: 'Floral', category: 'Nature', price: 799, originalPrice: 999, image: '🌸', rating: 4.5, reviews: 167, isNew: false, isPopular: true },
  { id: 14, name: 'Regal Velvet Anarkali', style: 'Anarkali', fabric: 'Silk', color: '#7c2d12', embroidery: 'Traditional', category: 'Heritage', price: 1899, originalPrice: 2199, image: '🏛️', rating: 4.9, reviews: 52, isNew: true, isPopular: false },
  { id: 15, name: 'Ocean Breeze Linen', style: 'A-Line', fabric: 'Linen', color: '#0ea5e9', embroidery: 'Geometric', category: 'Modern', price: 999, originalPrice: 1199, image: '🌊', rating: 4.6, reviews: 91, isNew: false, isPopular: false },
  { id: 16, name: 'Sunset Glow Chanderi', style: 'Long Kurta', fabric: 'Chanderi', color: '#f97316', embroidery: 'Paisley', category: 'Traditional', price: 1399, originalPrice: 1699, image: '🌅', rating: 4.7, reviews: 73, isNew: true, isPopular: true },
]

const categories = ['All', 'Nature', 'Traditional', 'Modern', 'Contemporary', 'Premium', 'Heritage', 'Spiritual']
const styles = ['All', 'Straight Kurta', 'Anarkali', 'A-Line', 'Short Kurti', 'Long Kurta', 'Western Kurti']
const fabrics = ['All', 'Cotton', 'Silk', 'Linen', 'Chanderi', 'Rayon']
const priceRanges = ['All', 'Under ₹1000', '₹1000 - ₹1500', '₹1500 - ₹2000', 'Above ₹2000']

export function Shop() {
  const { addToCart } = useCart()
  const { user } = useAuth()
  const [viewMode, setViewMode] = useState('grid')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedStyle, setSelectedStyle] = useState('All')
  const [selectedFabric, setSelectedFabric] = useState('All')
  const [priceRange, setPriceRange] = useState('All')
  const [sortBy, setSortBy] = useState('popular')
  const [showFilters, setShowFilters] = useState(false)
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('wishlist')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist))
  }, [wishlist])

  const filteredProducts = useMemo(() => {
    let products = [...allProducts]

    if (selectedCategory !== 'All') {
      products = products.filter(p => p.category === selectedCategory)
    }
    if (selectedStyle !== 'All') {
      products = products.filter(p => p.style === selectedStyle)
    }
    if (selectedFabric !== 'All') {
      products = products.filter(p => p.fabric === selectedFabric)
    }
    if (priceRange !== 'All') {
      products = products.filter(p => {
        switch (priceRange) {
          case 'Under ₹1000': return p.price < 1000
          case '₹1000 - ₹1500': return p.price >= 1000 && p.price <= 1500
          case '₹1500 - ₹2000': return p.price >= 1500 && p.price <= 2000
          case 'Above ₹2000': return p.price > 2000
          default: return true
        }
      })
    }

    switch (sortBy) {
      case 'price-low': return products.sort((a, b) => a.price - b.price)
      case 'price-high': return products.sort((a, b) => b.price - a.price)
      case 'newest': return products.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
      case 'rating': return products.sort((a, b) => b.rating - a.rating)
      case 'popular':
      default: return products.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0))
    }
  }, [selectedCategory, selectedStyle, selectedFabric, priceRange, sortBy])

  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      if (prev.includes(productId)) {
        toast.success('Removed from wishlist 💔', { emoji: true })
        return prev.filter(id => id !== productId)
      } else {
        toast.success('Added to wishlist! ❤️', { emoji: true })
        return [...prev, productId]
      }
    })
  }

  const handleAddToCart = (product) => {
    if (!user) {
      toast.error('Please login to add to cart 🔒', { emoji: true })
      return
    }
    addToCart(product.id)
    toast.success(`${product.name} added to cart! 🛒`, { emoji: true })
  }

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="font-playfair text-3xl md:text-4xl font-bold bg-gradient-pink-dark bg-clip-text text-transparent">
            Explore Collection 🛍️
          </h1>
          <p className="font-poppins text-pink-500 mt-1">Discover handcrafted embroidered kurtas ✨</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <div className="flex gap-1 bg-pink-50 rounded-xl p-1" role="group" aria-label="View mode">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white text-pink-600 shadow-sm' : 'text-pink-400 hover:text-pink-600'}`}
              aria-label="Grid view"
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white text-pink-600 shadow-sm' : 'text-pink-400 hover:text-pink-600'}`}
              aria-label="List view"
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="card-elevated p-6 mb-6 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-playfair text-xl font-bold text-pink-800">Filters</h2>
              <button
                onClick={() => {
                  setSelectedCategory('All')
                  setSelectedStyle('All')
                  setSelectedFabric('All')
                  setPriceRange('All')
                }}
                className="text-sm font-poppins text-pink-500 hover:text-pink-700"
              >
                Clear All
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="input-label">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="input-field"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="input-label">Style</label>
                <select
                  value={selectedStyle}
                  onChange={(e) => setSelectedStyle(e.target.value)}
                  className="input-field"
                >
                  {styles.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="input-label">Fabric</label>
                <select
                  value={selectedFabric}
                  onChange={(e) => setSelectedFabric(e.target.value)}
                  className="input-field"
                >
                  {fabrics.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div>
                <label className="input-label">Price Range</label>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="input-field"
                >
                  {priceRanges.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className="input-label">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field max-w-xs"
              >
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest First</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="mb-4 flex items-center justify-between text-sm font-poppins text-pink-500"
      >
        <span>{filteredProducts.length} designs found</span>
      </motion.div>

      <AnimatePresence mode="popLayout">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' : 'space-y-4'}
        >
          {filteredProducts.map((product, i) => (
            <motion.article
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03, duration: 0.4 }}
              className={viewMode === 'grid' ? 'design-card group' : 'design-card group flex flex-col md:flex-row'}
            >
              <div className={viewMode === 'grid' ? 'relative aspect-[3/4]' : 'relative w-48 h-64 md:w-64 md:h-80 flex-shrink-0'}>
                <div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-pink-100 flex items-center justify-center">
                  <span className="text-6xl" role="img" aria-hidden="true">{product.image}</span>
                </div>
                <div className="absolute top-3 left-3 flex flex-col gap-1">
                  {product.isNew && <span className="badge badge-rose">NEW</span>}
                  {product.isPopular && <span className="badge badge-pink">POPULAR</span>}
                </div>
                <div className="absolute top-3 right-3 flex flex-col gap-1">
                  <motion.button
                    onClick={() => toggleWishlist(product.id)}
                    whileHover={{ scale: 1.2 }}
                    className={`p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg ${
                      wishlist.includes(product.id) ? 'text-rose-500' : 'text-pink-400 hover:text-rose-500'
                    }`}
                    aria-label={wishlist.includes(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <Heart className={`w-5 h-5 ${wishlist.includes(product.id) ? 'fill-current' : ''}`} />
                  </motion.button>
                </div>
              </div>

              <div className={viewMode === 'grid' ? 'p-4' : 'flex-1 p-4 flex flex-col justify-between'}>
                <div>
                  <h3 className="font-playfair font-bold text-pink-800 line-clamp-1">{product.name}</h3>
                  <div className="flex flex-wrap gap-1 mt-2">
                    <span className="badge badge-pink">{product.style}</span>
                    <span className="badge badge-pink">{product.fabric}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    <span className="badge badge-rose">{product.embroidery}</span>
                    <span className="badge badge-rose">{product.category}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <div className="flex items-center gap-1 text-yellow-500">
                    <span className="text-lg">★</span>
                    <span className="font-poppins font-medium">{product.rating}</span>
                    <span className="font-poppins text-sm text-pink-400">({product.reviews})</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div>
                    <span className="price-display text-xl">₹{product.price}</span>
                    {product.originalPrice > product.price && (
                      <span className="price-original ml-2">₹{product.originalPrice}</span>
                    )}
                  </div>
                  <motion.button
                    onClick={() => handleAddToCart(product)}
                    className="btn-primary text-sm px-4 py-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ShoppingBag className="w-4 h-4 mr-1" />
                    Add to Cart
                  </motion.button>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </AnimatePresence>

      {filteredProducts.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-16 text-center"
        >
          <span className="text-4xl block mb-3" role="img" aria-hidden="true">🔍</span>
          <h3 className="font-playfair text-xl font-bold text-pink-700 mb-2">No designs found</h3>
          <p className="font-poppins text-pink-500 mb-4">Try adjusting your filters or search terms</p>
          <button
            onClick={() => {
              setSelectedCategory('All')
              setSelectedStyle('All')
              setSelectedFabric('All')
              setPriceRange('All')
            }}
            className="btn-primary"
          >
            Clear Filters
          </button>
        </motion.div>
      )}
    </div>
  )
}