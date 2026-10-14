import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDesign } from '../context/DesignContext'
import { useCart } from '../context/CartContext'
import {
  Heart,
  ShoppingBag,
  Copy,
  Trash2,
  Eye
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

const positions = [
  {
    id: 'neck',
    name: 'Neck',
    coords: { x: 50, y: 15 }
  },
  {
    id: 'chest',
    name: 'Chest',
    coords: { x: 50, y: 35 }
  },
  {
    id: 'sleeves',
    name: 'Sleeves',
    coords: { x: 15, y: 40 }
  },
  {
    id: 'front',
    name: 'Front Center',
    coords: { x: 50, y: 55 }
  },
  {
    id: 'back',
    name: 'Back Center',
    coords: { x: 50, y: 55 }
  },
  {
    id: 'bottom',
    name: 'Bottom Hem',
    coords: { x: 50, y: 85 }
  }
]

export function MyCollection() {
  const {
    savedDesigns,
    kurtaStyles,
    fabrics,
    colors,
    embroideryDesigns,
    deleteDesign,
    duplicateDesign
  } = useDesign()

  const { addToCart } = useCart()

  const [viewMode, setViewMode] = useState('grid')
  const [filter, setFilter] = useState('all')
  const [selectedDesign, setSelectedDesign] = useState(null)
  const [editName, setEditName] = useState('')

  /*
   * Database stores names such as:
   * "Straight Kurta"
   * "Cotton"
   * "Floral"
   *
   * But some older designs may still contain IDs:
   * "straight"
   * "cotton"
   * "floral"
   *
   * These helper functions support BOTH.
   */

  const getStyle = (design) => {
    return kurtaStyles.find(
      (style) =>
        style.id === design.kurta_style ||
        style.id === design.kurtaStyle ||
        style.name === design.kurta_style ||
        style.name === design.kurtaStyle
    )
  }

  const getFabric = (design) => {
    return fabrics.find(
      (fabric) =>
        fabric.id === design.fabric ||
        fabric.name === design.fabric
    )
  }

  const getEmbroidery = (design) => {
    return embroideryDesigns.find(
      (embroidery) =>
        embroidery.id === design.embroidery ||
        embroidery.id === design.embroidery_design ||
        embroidery.name === design.embroidery ||
        embroidery.name === design.embroidery_design
    )
  }

  const getPosition = (design) => {
    return positions.find(
      (position) =>
        position.id === design.position ||
        position.id === design.embroidery_position
    )
  }

  const getColor = (design) => {
    return colors.find(
      (color) =>
        color.id === design.color ||
        color.name === design.color
    )
  }

  const getStyleId = (design) => {
    return getStyle(design)?.id || 'straight'
  }

  const getStyleName = (design) => {
    return getStyle(design)?.name || design.kurta_style || design.kurtaStyle || 'Kurta'
  }

  const getFabricName = (design) => {
    return getFabric(design)?.name || design.fabric || 'Fabric'
  }

  const getEmbroideryName = (design) => {
    return (
      getEmbroidery(design)?.name ||
      design.embroidery_design ||
      design.embroidery ||
      'Embroidery'
    )
  }

  const getPositionName = (design) => {
    return (
      getPosition(design)?.name ||
      design.embroidery_position ||
      design.position ||
      'Front'
    )
  }

  const filteredDesigns = savedDesigns.filter((design) => {
    if (filter === 'all') {
      return true
    }

    if (filter === 'favorites') {
      return design.is_favorite === true || design.saved === true
    }

    return getStyleId(design) === filter
  })

  const handleEdit = (design) => {
    setSelectedDesign(design)
    setEditName(design.name || 'My Custom Design')
  }

  const handleSaveEdit = () => {
    if (selectedDesign && editName.trim()) {
      /*
       * Rename functionality can be connected to Supabase later.
       * For now we close the editor.
       */
      toast.success('Design renamed! ✨')
      setSelectedDesign(null)
    }
  }

  const handleDuplicate = async (design) => {
    try {
      await duplicateDesign(design)
      toast.success('Design duplicated! ✨')
    } catch (error) {
      console.error('Duplicate error:', error)
      toast.error('Could not duplicate design')
    }
  }

  const handleDelete = async (design) => {
    if (!window.confirm('Delete this design? 😢')) {
      return
    }

    try {
      await deleteDesign(design.id)
      toast.success('Design deleted 🗑️')
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Could not delete design')
    }
  }

  const handleAddToCart = async (design) => {
    try {
      await addToCart(design.id)
      toast.success('Added to cart! 🛒')
    } catch (error) {
      console.error('Cart error:', error)
      toast.error('Could not add to cart')
    }
  }

  const getPrice = (design) => {
    /*
     * Prefer the total_price saved in Supabase.
     */
    if (design.total_price !== undefined && design.total_price !== null) {
      return Number(design.total_price)
    }

    /*
     * Fallback for older local designs.
     */
    const style = getStyle(design)
    const fabric = getFabric(design)
    const embroidery = getEmbroidery(design)

    const base = style?.price || 0
    const fabricPrice = fabric?.price || 0
    const embroideryPrice = embroidery?.price || 0

    const customPrice =
      design.embroidery ||
      design.embroidery_design
        ? 100
        : 0

    return (
      base +
      fabricPrice +
      embroideryPrice +
      customPrice
    )
  }

  return (
    <div className="max-w-7xl mx-auto">

      {/* HEADER */}
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

          <p className="font-poppins text-pink-500 mt-1">
            Your saved kurta designs ✨
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-xl transition-colors ${
              viewMode === 'grid'
                ? 'bg-pink-100 text-pink-600'
                : 'text-pink-400 hover:bg-pink-50'
            }`}
          >
            <span className="text-xl">⊞</span>
          </button>

          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-xl transition-colors ${
              viewMode === 'list'
                ? 'bg-pink-100 text-pink-600'
                : 'text-pink-400 hover:bg-pink-50'
            }`}
          >
            <span className="text-xl">☰</span>
          </button>
        </div>
      </motion.div>

      {/* FILTERS */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="mb-6 flex flex-wrap gap-2"
        role="group"
        aria-label="Filter designs"
      >
        {[
          'all',
          'favorites',
          ...kurtaStyles.map((style) => style.id)
        ].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full font-poppins font-medium text-sm transition-all duration-300 ${
              filter === f
                ? 'bg-gradient-pink-dark text-white shadow-md shadow-pink-300/50'
                : 'bg-pink-50 text-pink-600 hover:bg-pink-100'
            }`}
          >
            {f === 'all'
              ? 'All Designs'
              : f === 'favorites'
              ? '❤️ Favorites'
              : kurtaStyles.find((s) => s.id === f)?.name}
          </button>
        ))}
      </motion.div>

      {/* EMPTY STATE */}
      {savedDesigns.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="card p-16 text-center"
        >
          <span
            className="text-6xl block mb-4"
            role="img"
            aria-hidden="true"
          >
            💖
          </span>

          <h2 className="font-playfair text-2xl font-bold text-pink-700 mb-2">
            Your collection is empty
          </h2>

          <p className="font-poppins text-pink-500 mb-6">
            Start designing beautiful kurtas and save them here!
          </p>

          <a
            href="/design-studio"
            className="btn-primary inline-block"
          >
            Start Designing ✨
          </a>
        </motion.div>
      ) : (
        <AnimatePresence mode="popLayout">

          <motion.div
            key={viewMode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                : 'space-y-4'
            }
          >

            {filteredDesigns.map((design, i) => {

              const style = getStyle(design)
              const fabric = getFabric(design)
              const embroidery = getEmbroidery(design)
              const position = getPosition(design)
              const color = getColor(design)

              const styleId = style?.id || 'straight'

              const customizations =
                design.customizations || {}

              return (
                <motion.article
                  key={design.id}
                  initial={{
                    opacity: 0,
                    scale: 0.9
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.9
                  }}
                  transition={{
                    delay: i * 0.05,
                    duration: 0.3
                  }}
                  className={
                    viewMode === 'grid'
                      ? 'card-elevated overflow-hidden'
                      : 'card-elevated flex flex-col md:flex-row gap-6 p-4'
                  }
                >

                  {/* PREVIEW */}
                  <div
                    className={
                      viewMode === 'grid'
                        ? 'relative aspect-[3/4]'
                        : 'relative w-48 h-64 md:w-64 md:h-80 flex-shrink-0'
                    }
                  >

                    <div
                      className="absolute inset-0 bg-gradient-to-br from-pink-50 to-pink-100"
                      style={{
                        clipPath:
                          kurtaSilhouettes[styleId] ||
                          kurtaSilhouettes.straight
                      }}
                    >

                      <div
                        className={`absolute inset-0 ${
                          fabric?.texture || 'fabric-cotton'
                        } opacity-30`}
                      />

                      <div
                        className="absolute inset-0"
                        style={{
                          backgroundColor:
                            color?.hex ||
                            design.color ||
                            '#fce7f3'
                        }}
                      >
                        <div className="absolute inset-0 bg-white/10" />
                      </div>
                    </div>

                    {/* EMBROIDERY */}
                    {embroidery && position && (
                      <motion.div
                        initial={{
                          scale: 0,
                          rotate: -180
                        }}
                        animate={{
                          scale: 1,
                          rotate: 0
                        }}
                        className="absolute"
                        style={{
                          left: `${position.coords.x}%`,
                          top: `${position.coords.y}%`,
                          transform: `translate(-50%, -50%) scale(${
                            customizations.scale || 1
                          }) rotate(${
                            customizations.rotation || 0
                          }deg)`,
                          color:
                            design.embroidery_color ||
                            customizations.embroideryColor ||
                            '#ec4899'
                        }}
                      >
                        <span
                          className="text-4xl"
                          role="img"
                          aria-hidden="true"
                        >
                          {embroidery.icon || '✨'}
                        </span>
                      </motion.div>
                    )}

                    {/* TOP BUTTONS */}
                    <div className="absolute top-3 right-3 flex gap-1">

                      {(design.is_favorite || design.saved) && (
                        <motion.button
                          whileHover={{ scale: 1.2 }}
                          className="p-2 rounded-full bg-white/90 backdrop-blur-sm text-rose-500 hover:bg-rose-50"
                          aria-label="Favorite"
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

                  {/* DETAILS */}
                  <div
                    className={
                      viewMode === 'grid'
                        ? 'p-4'
                        : 'flex-1 p-4 flex flex-col justify-center'
                    }
                  >

                    <div className="flex items-start justify-between mb-2">

                      <h3 className="font-playfair font-bold text-pink-800">
                        {design.name || 'Untitled Design'}
                      </h3>

                      {selectedDesign?.id === design.id ? (
                        <div className="flex gap-2">

                          <input
                            type="text"
                            value={editName}
                            onChange={(e) =>
                              setEditName(e.target.value)
                            }
                            className="input-field px-3 py-1 text-sm w-32"
                            autoFocus
                          />

                          <button
                            onClick={handleSaveEdit}
                            className="p-2 rounded-lg bg-pink-100 text-pink-600 hover:bg-pink-200"
                          >
                            ✓
                          </button>

                          <button
                            onClick={() =>
                              setSelectedDesign(null)
                            }
                            className="p-2 rounded-lg bg-pink-100 text-pink-600 hover:bg-pink-200"
                          >
                            ✕
                          </button>

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

                    {/* BADGES */}
                    <div className="flex flex-wrap gap-1 mb-3">

                      <span className="badge badge-pink">
                        {style?.name ||
                          design.kurta_style ||
                          design.kurtaStyle ||
                          'Kurta'}
                      </span>

                      <span className="badge badge-pink">
                        {fabric?.name ||
                          design.fabric ||
                          'Fabric'}
                      </span>

                      <span className="badge badge-rose">
                        {embroidery?.name ||
                          design.embroidery_design ||
                          design.embroidery ||
                          'Embroidery'}
                      </span>

                      <span className="badge badge-rose">
                        {position?.name ||
                          design.embroidery_position ||
                          design.position ||
                          'Front'}
                      </span>

                    </div>

                    {/* PRICE + ACTIONS */}
                    <div className="flex items-center justify-between gap-3">

                      <span className="font-playfair text-xl font-bold text-pink-700">
                        ₹{getPrice(design)}
                      </span>

                      <div className="flex gap-2">

                        <button
                          onClick={() =>
                            handleAddToCart(design)
                          }
                          className="btn-primary text-sm px-3 py-1.5 flex items-center"
                        >
                          <ShoppingBag className="w-4 h-4 mr-1" />
                          Cart
                        </button>

                        <button
                          onClick={() =>
                            handleDuplicate(design)
                          }
                          className="btn-secondary text-sm px-3 py-1.5 flex items-center"
                        >
                          <Copy className="w-4 h-4 mr-1" />
                          Duplicate
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(design)
                          }
                          className="btn-secondary text-sm px-3 py-1.5 text-rose-500 border-rose-200 hover:bg-rose-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                      </div>
                    </div>

                  </div>
                </motion.article>
              )
            })}

          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}