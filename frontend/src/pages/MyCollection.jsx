import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDesign } from '../context/DesignContext'
import { useCart } from '../context/CartContext'
import { Heart, Edit, Copy, Trash2, ShoppingBag, Eye, RotateCcw } from 'lucide-react'
import toast from 'react-hot-toast'

const kurtaSilhouettes = {
  straight: 'polygon(25% 0%, 75% 0%, 85% 100%, 15% 100%)',
  anarkali: 'polygon(30% 0%, 70% 0%, 95% 100%, 5% 100%)',
  'a-line': 'polygon(35% 0%, 65% 0%, 90% 100%, 10% 100%)',
  short: 'polygon(25% 0%, 75% 0%, 80% 60%, 20% 60%)',
  long: 'polygon(20% 0%, 80% 0%, 90% 100%, 10% 100%)',
  western: 'polygon(30% 0%, 70% 0%, 75% 70%, 25% 70%)'
}

export function MyCollection() {
  const { savedDesigns, kurtaStyles, fabrics, colors, embroideryDesigns, deleteDesign, duplicateDesign } = useDesign()
  const { addToCart } = useCart()
  const [viewMode, setViewMode] = useState('grid')
  const [filter, setFilter] = useState('all')
  const [selectedDesign, setSelectedDesign] = useState(null)
  const [editName, setEditName] = useState('')

  const filteredDesigns = savedDesigns.filter(design => {
    if (filter === 'all') return true
    if (filter === 'favorites') return design.saved
    return design.kurtaStyle === filter
  })

  const handleEdit = (design) => {
    setSelectedDesign(design)
    setEditName(design.name)
  }

  const handleSaveEdit = () => {
    if (selectedDesign && editName.trim()) {
      // In real app, update in database
      toast.success('Design renamed! ✨', { emoji: true })
      setSelectedDesign(null)
    }
  }

  const handleDuplicate = (design) => {
    duplicateDesign(design)
    toast.success('Design duplicated! ✨', { emoji: true })
  }

  const handleDelete = (design) => {
    if (confirm('Delete this design? 😢')) {
      deleteDesign(design.id)
      toast.success('Design deleted 🗑️', { emoji: true })
    }
  }

  const handleAddToCart = (design) => {
    addToCart(design.id)
    toast.success('Added to cart! 🛒', { emoji: true })
  }

  const getPrice = (design) => {
    const style = kurtaStyles.find(s => s.id === design.kurtaStyle)
    const fabric = fabrics.find(f => f.id === design.fabric)
    const emb = embroideryDesigns.find(e => e.id === design.embroidery)
    const base = style?.price || 0
    const fabricPrice = fabric?.price || 0
    const embPrice = emb?.price || 0
    const customPrice = design.embroidery ? 100 : 0
    return base + fabricPrice + embPrice + customPrice
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
            My Collection ❤️
          </h1>
          <p className="font-poppins text-pink-500 mt-1">Your saved kurta designs ✨</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-xl transition-colors ${viewMode === 'grid' ? 'bg-pink-100 text-pink-600' : 'text-pink-400 hover:bg-pink-50'}`}
          >
            <span className="text-xl">⊞</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-xl transition-colors ${viewMode === 'list' ? 'bg-pink-100 text-pink-600' : 'text-pink-400 hover:bg-pink-50'}`}
          >
            <span className="text-xl">☰</span>
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="mb-6 flex flex-wrap gap-2"
        role="group"
        aria-label="Filter designs"
      >
        {['all', 'favorites', ...kurtaStyles.map(s => s.id)].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full font-poppins font-medium text-sm transition-all duration-300 ${
              filter === f
                ? 'bg-gradient-pink-dark text-white shadow-md shadow-pink-300/50'
                : 'bg-pink-50 text-pink-600 hover:bg-pink-100'
            }`}
          >
            {f === 'all' ? 'All Designs' : f === 'favorites' ? '❤️ Favorites' : kurtaStyles.find(s => s.id === f)?.name}
          </button>
        ))}
      </motion.div>

      {savedDesigns.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="card p-16 text-center"
        >
          <span className="text-6xl block mb-4" role="img" aria-hidden="true">💖</span>
          <h2 className="font-playfair text-2xl font-bold text-pink-700 mb-2">Your collection is empty</h2>
          <p className="font-poppins text-pink-500 mb-6">Start designing beautiful kurtas and save them here!</p>
          <a href="/design-studio" className="btn-primary inline-block">Start Designing ✨</a>
        </motion.div>
      ) : (
        <AnimatePresence mode="popLayout">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' : 'space-y-4'}
          >
            {filteredDesigns.map((design, i) => (
              <motion.article
                key={design.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                className={viewMode === 'grid' ? 'card-elevated overflow-hidden' : 'card-elevated flex flex-col md:flex-row gap-6 p-4'}
              >
                <div className={viewMode === 'grid' ? 'relative aspect-[3/4]' : 'relative w-48 h-64 md:w-64 md:h-80 flex-shrink-0'}>
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-pink-100" style={{ clipPath: kurtaSilhouettes[design.kurtaStyle] || kurtaSilhouettes.straight }}>
                    <div className={`absolute inset-0 ${fabrics.find(f => f.id === design.fabric)?.texture || 'fabric-cotton'} opacity-30`} />
                    <div className="absolute inset-0" style={{ backgroundColor: colors.find(c => c.id === design.color)?.hex }}>
                      <div className="absolute inset-0 bg-white/10" />
                    </div>
                  </div>

                  {design.embroidery && design.position && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="absolute"
                      style={{ 
                        left: `${positions.find(p => p.id === design.position)?.coords.x || 50}%`, 
                        top: `${positions.find(p => p.id === design.position)?.coords.y || 50}%`, 
                        transform: `translate(-50%, -50%) scale(${design.customizations?.scale || 1}) rotate(${design.customizations?.rotation || 0}deg)`,
                        color: design.customizations?.embroideryColor || '#ec4899'
                      }}
                    >
                      <span className="text-4xl" role="img" aria-hidden="true">{embroideryDesigns.find(e => e.id === design.embroidery)?.icon || '✨'}</span>
                    </motion.div>
                  )}

                  <div className="absolute top-3 right-3 flex gap-1">
                    {design.saved && (
                      <motion.button
                        whileHover={{ scale: 1.2 }}
                        className="p-2 rounded-full bg-white/90 backdrop-blur-sm text-rose-500 hover:bg-rose-50"
                        aria-label="Remove from favorites"
                      >
                        <Heart className="w-5 h-5 fill-current" />
                      </motion.button>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      className="p-2 rounded-full bg-white/90 backdrop-blur-sm text-pink-500 hover:bg-pink-50"
                      aria-label="Quick view"
                    >
                      <Eye className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>

                <div className={viewMode === 'grid' ? 'p-4' : 'flex-1 p-4 flex flex-col justify-center'}>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-playfair font-bold text-pink-800">{design.name || 'Untitled Design'}</h3>
                    {selectedDesign?.id === design.id ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="input-field px-3 py-1 text-sm w-32"
                          autoFocus
                        />
                        <button onClick={handleSaveEdit} className="p-2 rounded-lg bg-pink-100 text-pink-600 hover:bg-pink-200">✓</button>
                        <button onClick={() => setSelectedDesign(null)} className="p-2 rounded-lg bg-pink-100 text-pink-600 hover:bg-pink-200">✕</button>
                      </div>
                    ) : (
                      <motion.button
                        onClick={() => handleEdit(design)}
                        whileHover={{ scale: 1.1 }}
                        className="p-1 rounded-lg text-pink-400 hover:bg-pink-50 hover:text-pink-600"
                        aria-label="Edit name"
                      >
                        ✏️
                      </motion.button>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    <span className="badge badge-pink">{kurtaStyles.find(s => s.id === design.kurtaStyle)?.name}</span>
                    <span className="badge badge-pink">{fabrics.find(f => f.id === design.fabric)?.name}</span>
                    <span className="badge badge-rose">{embroideryDesigns.find(e => e.id === design.embroidery)?.name}</span>
                    <span className="badge badge-rose">{positions.find(p => p.id === design.position)?.name}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-playfair text-xl font-bold text-pink-700">₹{getPrice(design)}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddToCart(design)}
                        className="btn-primary text-sm px-3 py-1.5"
                      >
                        <ShoppingBag className="w-4 h-4 mr-1" />
                        Cart
                      </button>
                      <button
                        onClick={() => handleDuplicate(design)}
                        className="btn-secondary text-sm px-3 py-1.5"
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        Duplicate
                      </button>
                      <button
                        onClick={() => handleDelete(design)}
                        className="btn-secondary text-sm px-3 py-1.5 text-rose-500 border-rose-200 hover:bg-rose-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}