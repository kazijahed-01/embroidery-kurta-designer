import { createContext, useContext, useState, useCallback } from 'react'

const DesignContext = createContext(null)

const kurtaStyles = [
  { id: 'straight', name: 'Straight Kurta', icon: '👗', description: 'Classic straight cut', price: 799 },
  { id: 'anarkali', name: 'Anarkali', icon: '💃', description: 'Flared frock style', price: 999 },
  { id: 'a-line', name: 'A-Line', icon: '📐', description: 'Flattering A-shape', price: 899 },
  { id: 'short', name: 'Short Kurti', icon: '👚', description: 'Trendy short length', price: 699 },
  { id: 'long', name: 'Long Kurta', icon: '👘', description: 'Elegant long length', price: 899 },
  { id: 'western', name: 'Western Kurti', icon: '🌟', description: 'Modern fusion style', price: 799 },
]

const fabrics = [
  { id: 'cotton', name: 'Cotton', icon: '☁️', description: 'Breathable & comfortable', price: 0, texture: 'fabric-cotton' },
  { id: 'linen', name: 'Linen', icon: '🌿', description: 'Natural & cool', price: 200, texture: 'fabric-linen' },
  { id: 'silk', name: 'Silk', icon: '✨', description: 'Luxurious & shiny', price: 500, texture: 'fabric-silk' },
  { id: 'rayon', name: 'Rayon', icon: '🌊', description: 'Soft & drapey', price: 150, texture: 'fabric-cotton' },
  { id: 'chanderi', name: 'Chanderi', icon: '👑', description: 'Royal & sheer', price: 400, texture: 'fabric-linen' },
]

const colors = [
  { id: 'pink', name: 'Pink', hex: '#f472b6', emoji: '🌸' },
  { id: 'black', name: 'Black', hex: '#1f2937', emoji: '🖤' },
  { id: 'white', name: 'White', hex: '#fafafa', emoji: '🤍' },
  { id: 'maroon', name: 'Maroon', hex: '#800000', emoji: '🍷' },
  { id: 'green', name: 'Green', hex: '#059669', emoji: '💚' },
  { id: 'blue', name: 'Blue', hex: '#2563eb', emoji: '💙' },
  { id: 'yellow', name: 'Yellow', hex: '#fbbf24', emoji: '💛' },
  { id: 'purple', name: 'Purple', hex: '#9333ea', emoji: '💜' },
  { id: 'orange', name: 'Orange', hex: '#ea580c', emoji: '🧡' },
  { id: 'peach', name: 'Peach', hex: '#fb923c', emoji: '🍑' },
  { id: 'teal', name: 'Teal', hex: '#0d9488', emoji: '🦚' },
  { id: 'gold', name: 'Gold', hex: '#f59e0b', emoji: '✨' },
]

const embroideryDesigns = [
  { id: 'floral', name: 'Floral', category: 'Nature', icon: '🌸', price: 250, positions: ['neck', 'chest', 'sleeves', 'front', 'back', 'bottom'] },
  { id: 'paisley', name: 'Paisley', category: 'Traditional', icon: '🌿', price: 300, positions: ['neck', 'chest', 'front', 'back'] },
  { id: 'geometric', name: 'Geometric', category: 'Modern', icon: '🔷', price: 200, positions: ['chest', 'sleeves', 'front', 'bottom'] },
  { id: 'traditional', name: 'Traditional', category: 'Heritage', icon: '🏛️', price: 350, positions: ['neck', 'chest', 'front', 'back', 'sleeves'] },
  { id: 'minimal', name: 'Minimal', category: 'Contemporary', icon: '✨', price: 150, positions: ['neck', 'chest', 'sleeves', 'bottom'] },
  { id: 'bridal', name: 'Bridal/Festive', category: 'Premium', icon: '💎', price: 500, positions: ['neck', 'chest', 'front', 'back', 'sleeves', 'bottom'] },
  { id: 'peacock', name: 'Peacock', category: 'Nature', icon: '🦚', price: 400, positions: ['back', 'front', 'chest'] },
  { id: 'butterfly', name: 'Butterfly', category: 'Nature', icon: '🦋', price: 300, positions: ['sleeves', 'chest', 'bottom'] },
  { id: 'mandala', name: 'Mandala', category: 'Spiritual', icon: '🕉️', price: 350, positions: ['back', 'front', 'chest'] },
  { id: 'zari', name: 'Zari Work', category: 'Premium', icon: '✨', price: 450, positions: ['neck', 'chest', 'sleeves', 'front', 'back'] },
]

const positions = [
  { id: 'neck', name: 'Neck', icon: '👗', coords: { x: 50, y: 15 } },
  { id: 'chest', name: 'Chest', icon: '💎', coords: { x: 50, y: 35 } },
  { id: 'sleeves', name: 'Sleeves', icon: '👚', coords: { x: 15, y: 40 } },
  { id: 'front', name: 'Front Center', icon: '🌟', coords: { x: 50, y: 55 } },
  { id: 'back', name: 'Back Center', icon: '💫', coords: { x: 50, y: 55 } },
  { id: 'bottom', name: 'Bottom Hem', icon: '✨', coords: { x: 50, y: 85 } },
]

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL']

export function DesignProvider({ children }) {
  const [currentDesign, setCurrentDesign] = useState({
    step: 1,
    kurtaStyle: null,
    fabric: null,
    color: null,
    embroidery: null,
    position: null,
    customizations: {
      scale: 1,
      rotation: 0,
      x: 0,
      y: 0,
      embroideryColor: '#ec4899'
    },
    size: 'M',
    previewImage: null
  })

  const [savedDesigns, setSavedDesigns] = useState([])

  const updateStep = useCallback((step) => {
    setCurrentDesign(prev => ({ ...prev, step }))
  }, [])

  const updateField = useCallback((field, value) => {
    setCurrentDesign(prev => ({ ...prev, [field]: value }))
  }, [])

  const updateCustomization = useCallback((field, value) => {
    setCurrentDesign(prev => ({
      ...prev,
      customizations: { ...prev.customizations, [field]: value }
    }))
  }, [])

  const resetDesign = useCallback(() => {
    setCurrentDesign({
      step: 1,
      kurtaStyle: null,
      fabric: null,
      color: null,
      embroidery: null,
      position: null,
      customizations: { scale: 1, rotation: 0, x: 0, y: 0, embroideryColor: '#ec4899' },
      size: 'M',
      previewImage: null
    })
  }, [])

  const saveDesign = useCallback((name) => {
    const design = { ...currentDesign, name, id: Date.now(), createdAt: new Date().toISOString() }
    setSavedDesigns(prev => [...prev, design])
    return design
  }, [currentDesign])

  const deleteDesign = useCallback((id) => {
    setSavedDesigns(prev => prev.filter(d => d.id !== id))
  }, [])

  const duplicateDesign = useCallback((design) => {
    const newDesign = { ...design, id: Date.now(), name: `${design.name} (Copy)`, createdAt: new Date().toISOString() }
    setSavedDesigns(prev => [...prev, newDesign])
    return newDesign
  }, [])

  const calculatePrice = useCallback(() => {
    const style = kurtaStyles.find(s => s.id === currentDesign.kurtaStyle)
    const fabric = fabrics.find(f => f.id === currentDesign.fabric)
    const embroidery = embroideryDesigns.find(e => e.id === currentDesign.embroidery)
    
    const basePrice = style?.price || 0
    const fabricPrice = fabric?.price || 0
    const embroideryPrice = embroidery?.price || 0
    const customizationPrice = currentDesign.embroidery ? 100 : 0
    
    return {
      basePrice,
      fabricPrice,
      embroideryPrice,
      customizationPrice,
      total: basePrice + fabricPrice + embroideryPrice + customizationPrice
    }
  }, [currentDesign])

  return (
    <DesignContext.Provider value={{
      currentDesign,
      savedDesigns,
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
      saveDesign,
      deleteDesign,
      duplicateDesign,
      calculatePrice
    }}>
      {children}
    </DesignContext.Provider>
  )
}

export function useDesign() {
  const context = useContext(DesignContext)
  if (!context) {
    throw new Error('useDesign must be used within DesignProvider')
  }
  return context
}