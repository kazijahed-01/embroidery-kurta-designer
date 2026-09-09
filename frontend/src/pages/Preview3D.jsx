import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useDesign } from '../context/DesignContext'
import { ChevronLeft, ChevronRight, RotateCcw, Maximize2, Minimize2, Download } from 'lucide-react'

const kurtaSilhouettes = {
  straight: 'polygon(25% 0%, 75% 0%, 85% 100%, 15% 100%)',
  anarkali: 'polygon(30% 0%, 70% 0%, 95% 100%, 5% 100%)',
  'a-line': 'polygon(35% 0%, 65% 0%, 90% 100%, 10% 100%)',
  short: 'polygon(25% 0%, 75% 0%, 80% 60%, 20% 60%)',
  long: 'polygon(20% 0%, 80% 0%, 90% 100%, 10% 100%)',
  western: 'polygon(30% 0%, 70% 0%, 75% 70%, 25% 70%)'
}

const views = [
  { id: 'front', label: 'Front', icon: '👗' },
  { id: 'back', label: 'Back', icon: '💃' },
  { id: 'left', label: 'Left Side', icon: '👈' },
  { id: 'right', label: 'Right Side', icon: '👉' },
]

export function Preview3D() {
  const { currentDesign, kurtaStyles, fabrics, colors, embroideryDesigns, positions } = useDesign()
  
  const [currentView, setCurrentView] = useState('front')
  const [rotation, setRotation] = useState(0)
  const [autoRotate, setAutoRotate] = useState(false)
  const [showAnnotations, setShowAnnotations] = useState(true)
  const containerRef = useRef(null)

  const selectedStyle = kurtaStyles.find(s => s.id === currentDesign.kurtaStyle)
  const selectedFabric = fabrics.find(f => f.id === currentDesign.fabric)
  const selectedColor = colors.find(c => c.id === currentDesign.color)
  const selectedEmbroidery = embroideryDesigns.find(e => e.id === currentDesign.embroidery)
  const selectedPosition = positions.find(p => p.id === currentDesign.position)

  useEffect(() => {
    let animationId
    if (autoRotate) {
      const animate = () => {
        setRotation(prev => (prev + 0.5) % 360)
        animationId = requestAnimationFrame(animate)
      }
      animationId = requestAnimationFrame(animate)
    }
    return () => cancelAnimationFrame(animationId)
  }, [autoRotate])

  const getEmbroideryPosition = (view) => {
    if (!selectedPosition || !selectedEmbroidery) return { x: 50, y: 50 }
    
    const baseX = selectedPosition.coords.x
    const baseY = selectedPosition.coords.y
    
    switch (view) {
      case 'front': return { x: baseX, y: baseY }
      case 'back': return { x: 100 - baseX, y: baseY }
      case 'left': return { x: 20, y: baseY }
      case 'right': return { x: 80, y: baseY }
      default: return { x: baseX, y: baseY }
    }
  }

  const pos = getEmbroideryPosition(currentView)

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="font-playfair text-3xl md:text-4xl font-bold bg-gradient-pink-dark bg-clip-text text-transparent">
          360° Preview Studio 👁️
        </h1>
        <p className="font-poppins text-pink-500 mt-1">View your design from every angle ✨</p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-2 space-y-6"
        >
          <div className="card-elevated p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-playfair text-xl font-bold text-pink-800">Interactive 3D View</h2>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 font-poppins text-sm text-pink-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoRotate}
                    onChange={(e) => setAutoRotate(e.target.checked)}
                    className="w-4 h-4 text-pink-500 border-pink-300 rounded focus:ring-pink-500"
                  />
                  Auto Rotate 🔄
                </label>
                <label className="flex items-center gap-2 font-poppins text-sm text-pink-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showAnnotations}
                    onChange={(e) => setShowAnnotations(e.target.checked)}
                    className="w-4 h-4 text-pink-500 border-pink-300 rounded focus:ring-pink-500"
                  />
                  Annotations 📍
                </label>
              </div>
            </div>

            <div className="relative aspect-square max-w-xl mx-auto">
              <div 
                ref={containerRef}
                className="kurta-3d-container w-full h-full"
                style={{ perspective: '1000px' }}
              >
                <motion.div
                  className="kurta-3d-model w-full h-full"
                  style={{ 
                    transform: `rotateY(${rotation}deg)`,
                    transformStyle: 'preserve-3d',
                    transition: autoRotate ? 'none' : 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)'
                  }}
                >
                  {views.map((view) => (
                    <motion.div
                      key={view.id}
                      className="kurta-side absolute inset-0"
                      style={{
                        transform: `rotateY(${
                          view.id === 'front' ? 0 :
                          view.id === 'back' ? 180 :
                          view.id === 'left' ? -90 : 90
                        }deg) translateZ(200px)`,
                        backfaceVisibility: 'hidden'
                      }}
                    >
                      <div className="relative w-full h-full flex items-center justify-center">
                        <div className="relative w-3/4 h-3/4 max-w-md max-h-[500px]">
                          <div className="absolute inset-0" style={{ clipPath: selectedStyle ? kurtaSilhouettes[selectedStyle.id] : kurtaSilhouettes.straight }}>
                            <div className={`absolute inset-0 ${selectedFabric?.texture || 'fabric-cotton'} opacity-30`} />
                            <div className="absolute inset-0" style={{ backgroundColor: selectedColor?.hex }}>
                              <div className="absolute inset-0 bg-white/10" />
                            </div>
                          </div>

                          {selectedPosition && selectedEmbroidery && showAnnotations && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute"
                              style={{ 
                                left: `${pos.x}%`, 
                                top: `${pos.y}%`, 
                                transform: `translate(-50%, -50%) scale(${currentDesign.customizations.scale}) rotate(${currentDesign.customizations.rotation}deg)`,
                                color: currentDesign.customizations.embroideryColor
                              }}
                            >
                              <span className="text-5xl drop-shadow-lg" role="img" aria-hidden="true">{selectedEmbroidery.icon}</span>
                            </motion.div>
                          )}

                          {showAnnotations && (
                            <div className="absolute inset-0 pointer-events-none">
                              {views.map(v => {
                                const vp = getEmbroideryPosition(v.id)
                                return (
                                  <motion.div
                                    key={v.id}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="absolute"
                                    style={{ left: `${vp.x}%`, top: `${vp.y}%`, transform: 'translate(-50%, -50%)' }}
                                  >
                                    <span className="text-xs bg-pink-500 text-white px-2 py-1 rounded-full shadow-lg">{v.label}</span>
                                  </motion.div>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                <button
                  onClick={() => setRotation(0)}
                  className="p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg text-pink-600 hover:bg-pink-50"
                  title="Reset View"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                onClick={() => setRotation(prev => prev - 45)}
                className="p-3 rounded-xl bg-white border border-pink-200 text-pink-600 hover:bg-pink-50 transition-colors"
                aria-label="Rotate left"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <div className="flex gap-2" role="tablist" aria-label="Select view">
                {views.map((view) => (
                  <button
                    key={view.id}
                    onClick={() => setCurrentView(view.id)}
                    role="tab"
                    aria-selected={currentView === view.id}
                    className={`px-4 py-2 rounded-xl font-poppins font-medium text-sm transition-all duration-300 ${
                      currentView === view.id
                        ? 'bg-gradient-pink-dark text-white shadow-md shadow-pink-300/50'
                        : 'bg-pink-50 text-pink-600 hover:bg-pink-100'
                    }`}
                  >
                    {view.icon} {view.label}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setRotation(prev => prev + 45)}
                className="p-3 rounded-xl bg-white border border-pink-200 text-pink-600 hover:bg-pink-50 transition-colors"
                aria-label="Rotate right"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="grid md:grid-cols-2 gap-4"
          >
            <div className="card-elevated p-6">
              <h3 className="font-playfair text-xl font-bold text-pink-800 mb-4 flex items-center gap-2">
                <span className="text-xl" role="img" aria-hidden="true">📋</span>
                Design Specifications
              </h3>
              <div className="space-y-3 text-sm font-poppins">
                <div className="flex justify-between">
                  <span className="text-pink-500">Kurta Style</span>
                  <span className="font-medium text-pink-800">{selectedStyle?.name || 'Not selected'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-pink-500">Fabric</span>
                  <span className="font-medium text-pink-800">{selectedFabric?.name || 'Not selected'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-pink-500">Color</span>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full border" style={{ backgroundColor: selectedColor?.hex }} />
                    <span className="font-medium text-pink-800 capitalize">{selectedColor?.name || 'Not selected'}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-pink-500">Embroidery</span>
                  <span className="font-medium text-pink-800">{selectedEmbroidery?.name || 'Not selected'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-pink-500">Position</span>
                  <span className="font-medium text-pink-800">{selectedPosition?.name || 'Not selected'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-pink-500">Size</span>
                  <span className="font-medium text-pink-800">{currentDesign.size}</span>
                </div>
              </div>
            </div>

            <div className="card-elevated p-6">
              <h3 className="font-playfair text-xl font-bold text-pink-800 mb-4 flex items-center gap-2">
                <span className="text-xl" role="img" aria-hidden="true">🎨</span>
                Customization Settings
              </h3>
              <div className="space-y-3 text-sm font-poppins">
                <div className="flex justify-between">
                  <span className="text-pink-500">Scale</span>
                  <span className="font-medium text-pink-800">{currentDesign.customizations.scale.toFixed(1)}x</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-pink-500">Rotation</span>
                  <span className="font-medium text-pink-800">{currentDesign.customizations.rotation}°</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-pink-500">X Offset</span>
                  <span className="font-medium text-pink-800">{currentDesign.customizations.x}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-pink-500">Y Offset</span>
                  <span className="font-medium text-pink-800">{currentDesign.customizations.y}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-pink-500">Embroidery Color</span>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full border" style={{ backgroundColor: currentDesign.customizations.embroideryColor }} />
                    <span className="font-medium text-pink-800">{currentDesign.customizations.embroideryColor}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="space-y-6"
        >
          <div className="card-elevated p-6 sticky top-24">
            <h3 className="font-playfair text-xl font-bold text-pink-800 mb-4 flex items-center gap-2">
              <span className="text-xl" role="img" aria-hidden="true">💰</span>
              Price Breakdown
            </h3>
            <div className="space-y-3 text-sm font-poppins">
              <div className="flex justify-between text-gray-600">
                <span>Kurta Base</span>
                <span className="font-medium text-pink-700">₹{selectedStyle?.price || 0}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Fabric ({selectedFabric?.name || 'Select'})</span>
                <span className="font-medium text-pink-700">+₹{selectedFabric?.price || 0}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Embroidery ({selectedEmbroidery?.name || 'Select'})</span>
                <span className="font-medium text-pink-700">+₹{selectedEmbroidery?.price || 0}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Customization</span>
                <span className="font-medium text-pink-700">+₹100</span>
              </div>
              <div className="border-t border-pink-100 pt-3 flex justify-between">
                <span className="font-playfair font-bold text-pink-800">Total</span>
                <span className="font-playfair text-2xl font-bold bg-gradient-pink-dark bg-clip-text text-transparent">
                  ₹{(selectedStyle?.price || 0) + (selectedFabric?.price || 0) + (selectedEmbroidery?.price || 0) + 100}
                </span>
              </div>
            </div>
          </div>

          <div className="card-elevated p-6">
            <h3 className="font-playfair text-xl font-bold text-pink-800 mb-4 flex items-center gap-2">
              <span className="text-xl" role="img" aria-hidden="true">📱</span>
              Mobile Controls
            </h3>
            <ul className="space-y-3 text-sm font-poppins text-pink-600">
              <li className="flex items-center gap-2">👆 <strong>Swipe</strong> left/right to rotate</li>
              <li className="flex items-center gap-2">🤏 <strong>Pinch</strong> to zoom</li>
              <li className="flex items-center gap-2">👆👆 <strong>Double tap</strong> to reset view</li>
              <li className="flex items-center gap-2">🔄 <strong>Auto-rotate</strong> for hands-free viewing</li>
            </ul>
          </div>

          <div className="card-elevated p-6 bg-gradient-pink-dark">
            <h3 className="font-playfair text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-xl" role="img" aria-hidden="true">✨</span>
              Ready to Order?
            </h3>
            <p className="font-poppins text-pink-100 mb-4">Your design looks perfect! Add it to cart or save for later.</p>
            <div className="flex gap-3">
              <button className="btn-secondary flex-1">
                <Download className="w-4 h-4 mr-2" />
                Save Image
              </button>
              <button className="btn-primary flex-1 bg-white text-pink-600 hover:bg-pink-50">
                Add to Cart 🛒
              </button>
            </div>
          </div>
        </motion.aside>
      </div>
    </div>
  )
}