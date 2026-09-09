import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDesign } from '../context/DesignContext'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { ChevronLeft, ChevronRight, Check, Save, Heart, RotateCcw, Maximize2, Minimize2 } from 'lucide-react'
import toast from 'react-hot-toast'

const steps = [
  { id: 1, label: 'Kurta Style', icon: '👗' },
  { id: 2, label: 'Fabric', icon: '☁️' },
  { id: 3, label: 'Color', icon: '🎨' },
  { id: 4, label: 'Embroidery', icon: '🧵' },
  { id: 5, label: 'Position', icon: '📍' },
  { id: 6, label: 'Customize', icon: '✨' },
  { id: 7, label: 'Preview', icon: '👁️' },
]

export function DesignStudio() {
  const { 
    currentDesign, 
    kurtaStyles, 
    fabrics, 
    colors, 
    embroideryDesigns, 
    positions, 
    sizes,
    updateStep, 
    updateField, 
    updateCustomization,
    resetDesign,
    calculatePrice,
    saveDesign
  } = useDesign()
  
  const { addToCart } = useCart()
  const { user } = useAuth()
  
  const [showPreview, setShowPreview] = useState(false)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [saveName, setSaveName] = useState('')
  const [canvasRef, setCanvasRef] = useState(null)
  const [fabricTexture, setFabricTexture] = useState('fabric-cotton')

  const price = calculatePrice()
  const canProceed = () => {
    switch (currentDesign.step) {
      case 1: return !!currentDesign.kurtaStyle
      case 2: return !!currentDesign.fabric
      case 3: return !!currentDesign.color
      case 4: return !!currentDesign.embroidery
      case 5: return !!currentDesign.position
      case 6: return true
      case 7: return true
      default: return false
    }
  }

  const handleNext = () => {
    if (currentDesign.step < 7 && canProceed()) {
      updateStep(currentDesign.step + 1)
    } else if (currentDesign.step === 7) {
      setShowPreview(true)
    }
  }

  const handlePrev = () => {
    if (currentDesign.step > 1) {
      updateStep(currentDesign.step - 1)
    }
  }

  const handleSaveDesign = () => {
    if (!saveName.trim()) {
      toast.error('Please enter a name for your design 💖')
      return
    }
    if (!user) {
      toast.error('Please login to save designs 🔒')
      return
    }
    saveDesign(saveName)
    toast.success('Design saved to My Collection! ❤️', { emoji: true })
    setShowSaveModal(false)
    setSaveName('')
  }

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login to add to cart 🔒')
      return
    }
    // In a real app, you'd save the design to DB first, then add to cart
    toast.success('Added to cart! 🛒', { emoji: true })
  }

  const kurtaIcons = {
    straight: '👗',
    anarkali: '💃',
    'a-line': '📐',
    short: '👚',
    long: '👘',
    western: '🌟'
  }

  const kurtaSilhouettes = {
    straight: 'polygon(25% 0%, 75% 0%, 85% 100%, 15% 100%)',
    anarkali: 'polygon(30% 0%, 70% 0%, 95% 100%, 5% 100%)',
    'a-line': 'polygon(35% 0%, 65% 0%, 90% 100%, 10% 100%)',
    short: 'polygon(25% 0%, 75% 0%, 80% 60%, 20% 60%)',
    long: 'polygon(20% 0%, 80% 0%, 90% 100%, 10% 100%)',
    western: 'polygon(30% 0%, 70% 0%, 75% 70%, 25% 70%)'
  }

  const selectedStyle = kurtaStyles.find(s => s.id === currentDesign.kurtaStyle)
  const selectedFabric = fabrics.find(f => f.id === currentDesign.fabric)
  const selectedColor = colors.find(c => c.id === currentDesign.color)
  const selectedEmbroidery = embroideryDesigns.find(e => e.id === currentDesign.embroidery)
  const selectedPosition = positions.find(p => p.id === currentDesign.position)

  useEffect(() => {
    if (selectedFabric) setFabricTexture(selectedFabric.texture)
  }, [selectedFabric])

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-playfair text-3xl md:text-4xl font-bold bg-gradient-pink-dark bg-clip-text text-transparent">
              Design Studio ✨
            </h1>
            <p className="font-poppins text-pink-500 mt-1">Create your dream kurta step by step 🧵</p>
          </div>
          <button
            onClick={() => { if (confirm('Reset all progress? 😢')) resetDesign() }}
            className="btn-ghost text-sm"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset
          </button>
        </div>

        <div className="hidden md:flex items-center justify-center gap-2 mb-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              className="flex items-center"
            >
              <div className={`step-indicator ${
                i + 1 < currentDesign.step ? 'step-completed' : 
                i + 1 === currentDesign.step ? 'step-active' : 'step-pending'
              }`}>
                {i + 1 < currentDesign.step ? <Check className="w-5 h-5" /> : step.icon}
              </div>
              {i < steps.length - 1 && (
                <div className="step-connector" />
              )}
            </motion.div>
          ))}
        </div>

        <div className="md:hidden overflow-x-auto pb-4 -mx-4 px-4">
          <div className="flex gap-2 min-w-max">
            {steps.map((step, i) => (
              <div key={step.id} className={`flex items-center gap-1 px-3 py-2 rounded-full ${
                i + 1 < currentDesign.step ? 'bg-pink-400 text-white' : 
                i + 1 === currentDesign.step ? 'bg-gradient-pink-dark text-white' : 'bg-pink-100 text-pink-300'
              }`}>
                <span className="text-lg">{step.icon}</span>
                <span className="font-poppins font-medium whitespace-nowrap">{step.label}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-2 space-y-6"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentDesign.step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="card-elevated p-6"
            >
              <h2 className="font-playfair text-2xl font-bold text-pink-800 mb-6 flex items-center gap-2">
                <span className="text-2xl" role="img" aria-hidden="true">{steps[currentDesign.step - 1].icon}</span>
                Step {currentDesign.step}: {steps[currentDesign.step - 1].label}
              </h2>

              {currentDesign.step === 1 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4" role="listbox" aria-label="Select kurta style">
                  {kurtaStyles.map((style) => (
                    <motion.button
                      key={style.id}
                      onClick={() => updateField('kurtaStyle', style.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative p-4 rounded-2xl border-2 transition-all duration-300 ${
                        currentDesign.kurtaStyle === style.id
                          ? 'border-pink-500 bg-pink-50 shadow-lg shadow-pink-200/50'
                          : 'border-pink-100 hover:border-pink-300 hover:bg-pink-50'
                      }`}
                      role="option"
                      aria-selected={currentDesign.kurtaStyle === style.id}
                    >
                      <div className="relative w-full aspect-square mb-3">
                        <div 
                          className="absolute inset-0 bg-gradient-to-b from-pink-100 to-pink-200 clip-path"
                          style={{ clipPath: kurtaSilhouettes[style.id] }}
                        />
                        {currentDesign.kurtaStyle === style.id && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Check className="w-8 h-8 text-white bg-pink-500 rounded-full" />
                          </div>
                        )}
                      </div>
                      <h3 className="font-playfair font-bold text-pink-800">{style.name}</h3>
                      <p className="font-poppins text-sm text-pink-500">{style.description}</p>
                      <p className="font-poppins font-semibold text-pink-600 mt-1">₹{style.price}</p>
                    </motion.button>
                  ))}
                </div>
              )}

              {currentDesign.step === 2 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4" role="listbox" aria-label="Select fabric">
                  {fabrics.map((fabric) => (
                    <motion.button
                      key={fabric.id}
                      onClick={() => updateField('fabric', fabric.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative p-4 rounded-2xl border-2 transition-all duration-300 ${
                        currentDesign.fabric === fabric.id
                          ? 'border-pink-500 bg-pink-50 shadow-lg shadow-pink-200/50'
                          : 'border-pink-100 hover:border-pink-300 hover:bg-pink-50'
                      }`}
                      role="option"
                      aria-selected={currentDesign.fabric === fabric.id}
                    >
                      <div className="relative w-full aspect-square mb-3 rounded-xl overflow-hidden">
                        <div className={`absolute inset-0 ${fabric.texture} opacity-30`} />
                        <div className="absolute inset-0 bg-gradient-to-b from-pink-100 to-pink-200 clip-path" style={{ clipPath: selectedStyle ? kurtaSilhouettes[selectedStyle.id] : kurtaSilhouettes.straight }} />
                        {currentDesign.fabric === fabric.id && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Check className="w-8 h-8 text-white bg-pink-500 rounded-full" />
                          </div>
                        )}
                      </div>
                      <h3 className="font-playfair font-bold text-pink-800 flex items-center gap-1">
                        {fabric.icon} {fabric.name}
                      </h3>
                      <p className="font-poppins text-sm text-pink-500">{fabric.description}</p>
                      {fabric.price > 0 && (
                        <p className="font-poppins font-semibold text-pink-600 mt-1">+₹{fabric.price}</p>
                      )}
                    </motion.button>
                  ))}
                </div>
              )}

              {currentDesign.step === 3 && (
                <div className="grid grid-cols-4 md:grid-cols-6 gap-3" role="listbox" aria-label="Select color">
                  {colors.map((color) => (
                    <motion.button
                      key={color.id}
                      onClick={() => updateField('color', color.id)}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.95 }}
                      className={`color-swatch relative ${
                        currentDesign.color === color.id ? 'color-swatch-selected' : ''
                      }`}
                      role="option"
                      aria-selected={currentDesign.color === color.id}
                      aria-label={color.name}
                      style={{ backgroundColor: color.hex }}
                    >
                      {currentDesign.color === color.id && (
                        <Check className="absolute inset-0 flex items-center justify-center text-white text-lg" />
                      )}
                    </motion.button>
                  ))}
                </div>
              )}

              {currentDesign.step === 4 && (
                <div className="space-y-4" role="listbox" aria-label="Select embroidery design">
                  {embroideryDesigns.map((emb) => (
                    <motion.button
                      key={emb.id}
                      onClick={() => updateField('embroidery', emb.id)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className={`relative p-4 rounded-2xl border-2 transition-all duration-300 flex items-center gap-4 ${
                        currentDesign.embroidery === emb.id
                          ? 'border-pink-500 bg-pink-50 shadow-lg shadow-pink-200/50'
                          : 'border-pink-100 hover:border-pink-300 hover:bg-pink-50'
                      }`}
                      role="option"
                      aria-selected={currentDesign.embroidery === emb.id}
                    >
                      <span className="text-3xl" role="img" aria-hidden="true">{emb.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-playfair font-bold text-pink-800">{emb.name}</h3>
                          <span className="badge badge-pink">{emb.category}</span>
                        </div>
                        <p className="font-poppins text-sm text-pink-500">Available on: {emb.positions.map(p => positions.find(pos => pos.id === p)?.name).join(', ')}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-playfair font-bold text-pink-600">+₹{emb.price}</p>
                        {currentDesign.embroidery === emb.id && (
                          <Check className="w-6 h-6 text-pink-500 ml-auto" />
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}

              {currentDesign.step === 5 && (
                <div className="relative" role="listbox" aria-label="Select embroidery position">
                  <div className="relative w-full max-w-md mx-auto aspect-[3/4] bg-gradient-to-b from-pink-50 to-pink-100 rounded-2xl border-2 border-pink-200 overflow-hidden">
                    <div className="absolute inset-0" style={{ clipPath: selectedStyle ? kurtaSilhouettes[selectedStyle.id] : kurtaSilhouettes.straight }}>
                      <div className={`absolute inset-0 ${fabricTexture} opacity-30`} />
                      <div className="absolute inset-0" style={{ backgroundColor: selectedColor?.hex }}>
                        <div className="absolute inset-0 bg-white/10" />
                      </div>
                    </div>

                    {positions.map((pos) => (
                      <motion.button
                        key={pos.id}
                        onClick={() => {
                          if (selectedEmbroidery?.positions.includes(pos.id)) {
                            updateField('position', pos.id)
                          }
                        }}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        disabled={!selectedEmbroidery?.positions.includes(pos.id)}
                        className={`embroidery-position ${currentDesign.position === pos.id ? 'ring-4 ring-pink-300 scale-125' : ''} ${
                          !selectedEmbroidery?.positions.includes(pos.id) ? 'opacity-30 cursor-not-allowed' : ''
                        }`}
                        style={{ left: `${pos.coords.x}%`, top: `${pos.coords.y}%`, transform: 'translate(-50%, -50%)' }}
                        data-label={pos.name}
                        role="option"
                        aria-selected={currentDesign.position === pos.id}
                        aria-disabled={!selectedEmbroidery?.positions.includes(pos.id)}
                      >
                        {currentDesign.position === pos.id && <Check className="w-4 h-4 text-white" />}
                      </motion.button>
                    ))}

                    {selectedPosition && selectedEmbroidery && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="absolute"
                        style={{ left: `${selectedPosition.coords.x}%`, top: `${selectedPosition.coords.y}%`, transform: 'translate(-50%, -50%)' }}
                      >
                        <span className="text-4xl" role="img" aria-hidden="true">{selectedEmbroidery.icon}</span>
                      </motion.div>
                    )}
                  </div>

                  <p className="text-center text-pink-500 font-poppins text-sm mt-4">
                    Tap on the pink dots to select embroidery position ✨
                  </p>
                </div>
              )}

              {currentDesign.step === 6 && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-playfair font-bold text-pink-800">Size & Fit</h4>
                      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Select size">
                        {sizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => updateField('size', size)}
                            className={`px-4 py-2 rounded-xl font-poppins font-medium transition-all duration-200 ${
                              currentDesign.size === size
                                ? 'bg-gradient-pink-dark text-white shadow-md shadow-pink-300/50'
                                : 'bg-pink-50 text-pink-600 hover:bg-pink-100'
                            }`}
                            role="radio"
                            aria-checked={currentDesign.size === size}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-playfair font-bold text-pink-800">Embroidery Color</h4>
                      <div className="grid grid-cols-6 gap-2" role="radiogroup" aria-label="Select embroidery color">
                        {['#ec4899', '#be185d', '#9d174d', '#f43f5e', '#fff', '#1f2937', '#fbbf24', '#059669', '#2563eb', '#9333ea', '#ea580c', '#0d9488'].map((color) => (
                          <button
                            key={color}
                            onClick={() => updateCustomization('embroideryColor', color)}
                            className={`w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                              currentDesign.customizations.embroideryColor === color
                                ? 'border-white ring-2 ring-pink-400 ring-offset-2 shadow-lg'
                                : 'border-transparent hover:scale-110'
                            }`}
                            style={{ backgroundColor: color }}
                            role="radio"
                            aria-checked={currentDesign.customizations.embroideryColor === color}
                            aria-label={`Embroidery color ${color}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-playfair font-bold text-pink-800">Transform Embroidery</h4>
                    <div className="grid md:grid-cols-4 gap-4">
                      <div>
                        <label className="input-label">Scale</label>
                        <input
                          type="range"
                          min="0.5"
                          max="2"
                          step="0.1"
                          value={currentDesign.customizations.scale}
                          onChange={(e) => updateCustomization('scale', parseFloat(e.target.value))}
                          className="w-full h-2 bg-pink-100 rounded-lg appearance-none accent-pink-500"
                        />
                        <p className="font-poppins text-sm text-pink-500 mt-1">{currentDesign.customizations.scale.toFixed(1)}x</p>
                      </div>
                      <div>
                        <label className="input-label">Rotation</label>
                        <input
                          type="range"
                          min="-180"
                          max="180"
                          step="5"
                          value={currentDesign.customizations.rotation}
                          onChange={(e) => updateCustomization('rotation', parseInt(e.target.value))}
                          className="w-full h-2 bg-pink-100 rounded-lg appearance-none accent-pink-500"
                        />
                        <p className="font-poppins text-sm text-pink-500 mt-1">{currentDesign.customizations.rotation}°</p>
                      </div>
                      <div>
                        <label className="input-label">X Position</label>
                        <input
                          type="range"
                          min="-50"
                          max="50"
                          step="1"
                          value={currentDesign.customizations.x}
                          onChange={(e) => updateCustomization('x', parseInt(e.target.value))}
                          className="w-full h-2 bg-pink-100 rounded-lg appearance-none accent-pink-500"
                        />
                        <p className="font-poppins text-sm text-pink-500 mt-1">{currentDesign.customizations.x}%</p>
                      </div>
                      <div>
                        <label className="input-label">Y Position</label>
                        <input
                          type="range"
                          min="-50"
                          max="50"
                          step="1"
                          value={currentDesign.customizations.y}
                          onChange={(e) => updateCustomization('y', parseInt(e.target.value))}
                          className="w-full h-2 bg-pink-100 rounded-lg appearance-none accent-pink-500"
                        />
                        <p className="font-poppins text-sm text-pink-500 mt-1">{currentDesign.customizations.y}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentDesign.step === 7 && (
                <div className="space-y-6">
                  <div className="relative aspect-[3/4] bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl border-2 border-pink-200 overflow-hidden">
                    <div className="absolute inset-0" style={{ clipPath: selectedStyle ? kurtaSilhouettes[selectedStyle.id] : kurtaSilhouettes.straight }}>
                      <div className={`absolute inset-0 ${fabricTexture} opacity-30`} />
                      <div className="absolute inset-0" style={{ backgroundColor: selectedColor?.hex }}>
                        <div className="absolute inset-0 bg-white/10" />
                      </div>
                    </div>

                    {selectedPosition && selectedEmbroidery && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="absolute"
                        style={{ 
                          left: `calc(${selectedPosition.coords.x}% + ${currentDesign.customizations.x}%)`, 
                          top: `calc(${selectedPosition.coords.y}% + ${currentDesign.customizations.y}%)`, 
                          transform: `translate(-50%, -50%) scale(${currentDesign.customizations.scale}) rotate(${currentDesign.customizations.rotation}deg)`,
                          color: currentDesign.customizations.embroideryColor
                        }}
                      >
                        <span className="text-5xl" role="img" aria-hidden="true">{selectedEmbroidery.icon}</span>
                      </motion.div>
                    )}

                    <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                      <button
                        onClick={() => setShowPreview(!showPreview)}
                        className="btn-secondary flex-1"
                      >
                        {showPreview ? <Minimize2 className="w-4 h-4 mr-1" /> : <Maximize2 className="w-4 h-4 mr-1" />}
                        {showPreview ? 'Exit Preview' : 'Full Preview'}
                      </button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="card p-4 text-center">
                      <span className="text-2xl block mb-1" role="img" aria-hidden="true">💰</span>
                      <p className="font-poppins text-sm text-pink-500">Base Price</p>
                      <p className="font-playfair text-xl font-bold text-pink-700">₹{price.basePrice}</p>
                    </div>
                    <div className="card p-4 text-center">
                      <span className="text-2xl block mb-1" role="img" aria-hidden="true">🧵</span>
                      <p className="font-poppins text-sm text-pink-500">Embroidery</p>
                      <p className="font-playfair text-xl font-bold text-pink-700">₹{price.embroideryPrice + price.fabricPrice}</p>
                    </div>
                    <div className="card p-4 text-center bg-gradient-pink-dark">
                      <span className="text-2xl block mb-1" role="img" aria-hidden="true">✨</span>
                      <p className="font-poppins text-sm text-pink-100">Total Price</p>
                      <p className="font-playfair text-2xl font-bold text-white">₹{price.total}</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex items-center justify-between"
          >
            <button
              onClick={handlePrev}
              disabled={currentDesign.step === 1}
              className="btn-secondary"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </button>

            <div className="flex gap-3">
              {currentDesign.step < 7 && (
                <button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="btn-primary"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </button>
              )}
              {currentDesign.step === 7 && (
                <>
                  <button
                    onClick={() => setShowSaveModal(true)}
                    className="btn-secondary"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Design
                  </button>
                  <button
                    onClick={handleAddToCart}
                    className="btn-primary"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="space-y-6"
        >
          <div className="card-elevated p-6 sticky top-24">
            <h3 className="font-playfair text-xl font-bold text-pink-800 mb-4 flex items-center gap-2">
              <span className="text-xl" role="img" aria-hidden="true">💰</span>
              Price Summary
            </h3>
            <div className="space-y-3 text-sm font-poppins">
              <div className="flex justify-between text-gray-600">
                <span>Kurta Base</span>
                <span className="font-medium text-pink-700">₹{price.basePrice}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Fabric ({selectedFabric?.name || 'Select'})</span>
                <span className="font-medium text-pink-700">+₹{price.fabricPrice}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Embroidery ({selectedEmbroidery?.name || 'Select'})</span>
                <span className="font-medium text-pink-700">+₹{price.embroideryPrice}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Customization</span>
                <span className="font-medium text-pink-700">+₹{price.customizationPrice}</span>
              </div>
              <div className="border-t border-pink-100 pt-3 flex justify-between">
                <span className="font-playfair font-bold text-pink-800">Total</span>
                <span className="font-playfair text-xl font-bold bg-gradient-pink-dark bg-clip-text text-transparent">₹{price.total}</span>
              </div>
            </div>
          </div>

          <div className="card-elevated p-6">
            <h3 className="font-playfair text-xl font-bold text-pink-800 mb-4 flex items-center gap-2">
              <span className="text-xl" role="img" aria-hidden="true">💡</span>
              Design Tips
            </h3>
            <ul className="space-y-3 text-sm font-poppins text-pink-600">
              <li className="flex items-start gap-2">✨ Light fabrics (cotton, linen) work best for daily wear</li>
              <li className="flex items-start gap-2">🌸 Floral embroidery suits all kurta styles</li>
              <li className="flex items-start gap-2">💎 Bridal embroidery looks stunning on silk & chanderi</li>
              <li className="flex items-start gap-2">🎨 Contrast embroidery colors pop beautifully</li>
              <li className="flex items-start gap-2">📍 Neck & chest positions are most popular</li>
              <li className="flex items-start gap-2">👗 Anarkali style flatters all body types</li>
            </ul>
          </div>
        </motion.aside>
      </div>

      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-pink-100 flex items-center justify-between">
                <h2 className="font-playfair text-2xl font-bold text-pink-800">Final Preview 👁️</h2>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2 rounded-xl text-pink-500 hover:bg-pink-100"
                >
                  ✕
                </button>
              </div>
              <div className="p-6">
                <div className="relative aspect-[3/4] bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl border-2 border-pink-200 overflow-hidden mb-6">
                  <div className="absolute inset-0" style={{ clipPath: selectedStyle ? kurtaSilhouettes[selectedStyle.id] : kurtaSilhouettes.straight }}>
                    <div className={`absolute inset-0 ${fabricTexture} opacity-30`} />
                    <div className="absolute inset-0" style={{ backgroundColor: selectedColor?.hex }}>
                      <div className="absolute inset-0 bg-white/10" />
                    </div>
                  </div>

                  {selectedPosition && selectedEmbroidery && (
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute"
                      style={{ 
                        left: `calc(${selectedPosition.coords.x}% + ${currentDesign.customizations.x}%)`, 
                        top: `calc(${selectedPosition.coords.y}% + ${currentDesign.customizations.y}%)`, 
                        transform: `translate(-50%, -50%) scale(${currentDesign.customizations.scale}) rotate(${currentDesign.customizations.rotation}deg)`,
                        color: currentDesign.customizations.embroideryColor
                      }}
                    >
                      <span className="text-6xl" role="img" aria-hidden="true">{selectedEmbroidery.icon}</span>
                    </motion.div>
                  )}
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="card p-4">
                    <p className="font-poppins text-sm text-pink-500">Style</p>
                    <p className="font-playfair font-bold text-pink-800">{selectedStyle?.name || 'Not selected'}</p>
                  </div>
                  <div className="card p-4">
                    <p className="font-poppins text-sm text-pink-500">Fabric</p>
                    <p className="font-playfair font-bold text-pink-800">{selectedFabric?.name || 'Not selected'}</p>
                  </div>
                  <div className="card p-4">
                    <p className="font-poppins text-sm text-pink-500">Color</p>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: selectedColor?.hex }} />
                      <span className="font-playfair font-bold text-pink-800 capitalize">{selectedColor?.name || 'Not selected'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowSaveModal(true)}
                    className="btn-secondary flex-1"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Design
                  </button>
                  <button
                    onClick={handleAddToCart}
                    className="btn-primary flex-1"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSaveModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowSaveModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="font-playfair text-2xl font-bold text-pink-800 mb-4 text-center">Save Your Design 💖</h2>
              <input
                type="text"
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                placeholder="Enter design name..."
                className="input-field mb-4"
                autoFocus
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSaveModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveDesign}
                  className="btn-primary flex-1"
                >
                  Save Design
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}