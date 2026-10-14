import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect
} from 'react'

import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

const DesignContext = createContext(null)

// ============================================================
// KURTA STYLES
// ============================================================

const kurtaStyles = [
  {
    id: 'straight',
    name: 'Straight Kurta',
    icon: '👗',
    description: 'Classic straight cut',
    price: 799
  },
  {
    id: 'anarkali',
    name: 'Anarkali',
    icon: '💃',
    description: 'Flared frock style',
    price: 999
  },
  {
    id: 'a-line',
    name: 'A-Line',
    icon: '📐',
    description: 'Flattering A-shape',
    price: 899
  },
  {
    id: 'short',
    name: 'Short Kurti',
    icon: '👚',
    description: 'Trendy short length',
    price: 699
  },
  {
    id: 'long',
    name: 'Long Kurta',
    icon: '👘',
    description: 'Elegant long length',
    price: 899
  },
  {
    id: 'western',
    name: 'Western Kurti',
    icon: '🌟',
    description: 'Modern fusion style',
    price: 799
  }
]

// ============================================================
// FABRICS
// ============================================================

const fabrics = [
  {
    id: 'cotton',
    name: 'Cotton',
    icon: '☁️',
    description: 'Breathable & comfortable',
    price: 0,
    texture: 'fabric-cotton'
  },
  {
    id: 'linen',
    name: 'Linen',
    icon: '🌿',
    description: 'Natural & cool',
    price: 200,
    texture: 'fabric-linen'
  },
  {
    id: 'silk',
    name: 'Silk',
    icon: '✨',
    description: 'Luxurious & shiny',
    price: 500,
    texture: 'fabric-silk'
  },
  {
    id: 'rayon',
    name: 'Rayon',
    icon: '🌊',
    description: 'Soft & drapey',
    price: 150,
    texture: 'fabric-cotton'
  },
  {
    id: 'chanderi',
    name: 'Chanderi',
    icon: '👑',
    description: 'Royal & sheer',
    price: 400,
    texture: 'fabric-linen'
  }
]

// ============================================================
// COLORS
// ============================================================

const colors = [
  {
    id: 'pink',
    name: 'Pink',
    hex: '#f472b6',
    emoji: '🌸'
  },
  {
    id: 'black',
    name: 'Black',
    hex: '#1f2937',
    emoji: '🖤'
  },
  {
    id: 'white',
    name: 'White',
    hex: '#fafafa',
    emoji: '🤍'
  },
  {
    id: 'maroon',
    name: 'Maroon',
    hex: '#800000',
    emoji: '🍷'
  },
  {
    id: 'green',
    name: 'Green',
    hex: '#059669',
    emoji: '💚'
  },
  {
    id: 'blue',
    name: 'Blue',
    hex: '#2563eb',
    emoji: '💙'
  },
  {
    id: 'yellow',
    name: 'Yellow',
    hex: '#fbbf24',
    emoji: '💛'
  },
  {
    id: 'purple',
    name: 'Purple',
    hex: '#9333ea',
    emoji: '💜'
  },
  {
    id: 'orange',
    name: 'Orange',
    hex: '#ea580c',
    emoji: '🧡'
  },
  {
    id: 'peach',
    name: 'Peach',
    hex: '#fb923c',
    emoji: '🍑'
  },
  {
    id: 'teal',
    name: 'Teal',
    hex: '#0d9488',
    emoji: '🦚'
  },
  {
    id: 'gold',
    name: 'Gold',
    hex: '#f59e0b',
    emoji: '✨'
  }
]

// ============================================================
// EMBROIDERY DESIGNS
// ============================================================

const embroideryDesigns = [
  {
    id: 'floral',
    name: 'Floral',
    category: 'Nature',
    icon: '🌸',
    price: 250,
    positions: ['neck', 'chest', 'sleeves', 'front', 'back', 'bottom']
  },
  {
    id: 'paisley',
    name: 'Paisley',
    category: 'Traditional',
    icon: '🌿',
    price: 300,
    positions: ['neck', 'chest', 'front', 'back']
  },
  {
    id: 'geometric',
    name: 'Geometric',
    category: 'Modern',
    icon: '🔷',
    price: 200,
    positions: ['chest', 'sleeves', 'front', 'bottom']
  },
  {
    id: 'traditional',
    name: 'Traditional',
    category: 'Heritage',
    icon: '🏛️',
    price: 350,
    positions: ['neck', 'chest', 'front', 'back', 'sleeves']
  },
  {
    id: 'minimal',
    name: 'Minimal',
    category: 'Contemporary',
    icon: '✨',
    price: 150,
    positions: ['neck', 'chest', 'sleeves', 'bottom']
  },
  {
    id: 'bridal',
    name: 'Bridal/Festive',
    category: 'Premium',
    icon: '💎',
    price: 500,
    positions: [
      'neck',
      'chest',
      'front',
      'back',
      'sleeves',
      'bottom'
    ]
  },
  {
    id: 'peacock',
    name: 'Peacock',
    category: 'Nature',
    icon: '🦚',
    price: 400,
    positions: ['back', 'front', 'chest']
  },
  {
    id: 'butterfly',
    name: 'Butterfly',
    category: 'Nature',
    icon: '🦋',
    price: 300,
    positions: ['sleeves', 'chest', 'bottom']
  },
  {
    id: 'mandala',
    name: 'Mandala',
    category: 'Spiritual',
    icon: '🕉️',
    price: 350,
    positions: ['back', 'front', 'chest']
  },
  {
    id: 'zari',
    name: 'Zari Work',
    category: 'Premium',
    icon: '✨',
    price: 450,
    positions: ['neck', 'chest', 'sleeves', 'front', 'back']
  }
]

// ============================================================
// POSITIONS
// ============================================================

const positions = [
  {
    id: 'neck',
    name: 'Neck',
    icon: '👗',
    coords: { x: 50, y: 15 }
  },
  {
    id: 'chest',
    name: 'Chest',
    icon: '💎',
    coords: { x: 50, y: 35 }
  },
  {
    id: 'sleeves',
    name: 'Sleeves',
    icon: '👚',
    coords: { x: 15, y: 40 }
  },
  {
    id: 'front',
    name: 'Front Center',
    icon: '🌟',
    coords: { x: 50, y: 55 }
  },
  {
    id: 'back',
    name: 'Back Center',
    icon: '💫',
    coords: { x: 50, y: 55 }
  },
  {
    id: 'bottom',
    name: 'Bottom Hem',
    icon: '✨',
    coords: { x: 50, y: 85 }
  }
]

// ============================================================
// SIZES
// ============================================================

const sizes = [
  'XS',
  'S',
  'M',
  'L',
  'XL',
  'XXL',
  '3XL'
]

// ============================================================
// EMPTY DESIGN
// ============================================================

const createEmptyDesign = () => ({
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

// ============================================================
// HELPER FUNCTIONS
// ============================================================

const getKurtaStyleId = (value) => {
  if (!value) return null

  const found = kurtaStyles.find(
    (style) =>
      style.id === value ||
      style.name === value
  )

  return found?.id || value
}

const getFabricId = (value) => {
  if (!value) return null

  const found = fabrics.find(
    (fabric) =>
      fabric.id === value ||
      fabric.name === value
  )

  return found?.id || value
}

const getEmbroideryId = (value) => {
  if (!value) return null

  const found = embroideryDesigns.find(
    (embroidery) =>
      embroidery.id === value ||
      embroidery.name === value
  )

  return found?.id || value
}

const getColorId = (value) => {
  if (!value) return null

  const found = colors.find(
    (color) =>
      color.id === value ||
      color.name === value
  )

  return found?.id || value
}

// Convert database design to frontend design
const normalizeDesign = (design) => {
  if (!design) return design

  return {
    ...design,

    // Database values -> frontend IDs
    kurtaStyle: getKurtaStyleId(design.kurta_style),
    fabric: getFabricId(design.fabric),
    color: getColorId(design.color),
    embroidery: getEmbroideryId(design.embroidery_design),

    position: design.embroidery_position,

    customizations: design.customizations || {
      scale: 1,
      rotation: 0,
      x: 0,
      y: 0,
      embroideryColor:
        design.embroidery_color || '#ec4899'
    },

    size: design.size || 'M',

    previewImage:
      design.preview_image_url || null,

    saved: design.is_saved === true
  }
}

// ============================================================
// DESIGN PROVIDER
// ============================================================

export function DesignProvider({ children }) {
  const { user } = useAuth()

  const [currentDesign, setCurrentDesign] =
    useState(createEmptyDesign())

  const [savedDesigns, setSavedDesigns] =
    useState([])

  const [loadingSavedDesigns, setLoadingSavedDesigns] =
    useState(false)

  // ==========================================================
  // LOAD SAVED DESIGNS
  // ==========================================================

  const loadSavedDesigns = useCallback(async () => {
    if (!user?.id) {
      setSavedDesigns([])
      return
    }

    try {
      setLoadingSavedDesigns(true)

      const { data, error } = await supabase
        .from('user_designs')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_saved', true)
        .order('created_at', {
          ascending: false
        })

      if (error) {
        console.error(
          'Error loading saved designs:',
          error
        )

        setSavedDesigns([])
        return
      }

      const normalizedDesigns =
        (data || []).map(normalizeDesign)

      setSavedDesigns(normalizedDesigns)
    } catch (error) {
      console.error(
        'Unexpected error loading saved designs:',
        error
      )

      setSavedDesigns([])
    } finally {
      setLoadingSavedDesigns(false)
    }
  }, [user])

  // ==========================================================
  // LOAD WHEN USER CHANGES
  // ==========================================================

  useEffect(() => {
    loadSavedDesigns()
  }, [loadSavedDesigns])

  // ==========================================================
  // UPDATE STEP
  // ==========================================================

  const updateStep = useCallback((step) => {
    setCurrentDesign((prev) => ({
      ...prev,
      step
    }))
  }, [])

  // ==========================================================
  // UPDATE FIELD
  // ==========================================================

  const updateField = useCallback(
    (field, value) => {
      setCurrentDesign((prev) => ({
        ...prev,
        [field]: value
      }))
    },
    []
  )

  // ==========================================================
  // UPDATE CUSTOMIZATION
  // ==========================================================

  const updateCustomization = useCallback(
    (field, value) => {
      setCurrentDesign((prev) => ({
        ...prev,
        customizations: {
          ...prev.customizations,
          [field]: value
        }
      }))
    },
    []
  )

  // ==========================================================
  // RESET DESIGN
  // ==========================================================

  const resetDesign = useCallback(() => {
    setCurrentDesign(createEmptyDesign())
  }, [])

  // ==========================================================
  // CALCULATE PRICE
  // ==========================================================

  const calculatePrice = useCallback(() => {
    const style = kurtaStyles.find(
      (s) => s.id === currentDesign.kurtaStyle
    )

    const fabric = fabrics.find(
      (f) => f.id === currentDesign.fabric
    )

    const embroidery = embroideryDesigns.find(
      (e) => e.id === currentDesign.embroidery
    )

    const basePrice = style?.price || 0
    const fabricPrice = fabric?.price || 0
    const embroideryPrice = embroidery?.price || 0

    const customizationPrice =
      currentDesign.embroidery ? 100 : 0

    return {
      basePrice,
      fabricPrice,
      embroideryPrice,
      customizationPrice,
      total:
        basePrice +
        fabricPrice +
        embroideryPrice +
        customizationPrice
    }
  }, [currentDesign])

  // ==========================================================
  // SAVE DESIGN
  // ==========================================================

  const saveDesign = useCallback(
    async (name) => {
      if (!user?.id) {
        throw new Error('Please login first')
      }

      const style = kurtaStyles.find(
        (s) => s.id === currentDesign.kurtaStyle
      )

      const fabric = fabrics.find(
        (f) => f.id === currentDesign.fabric
      )

      const embroidery = embroideryDesigns.find(
        (e) => e.id === currentDesign.embroidery
      )

      if (!style) {
        throw new Error(
          'Please select a kurta style'
        )
      }

      if (!fabric) {
        throw new Error(
          'Please select a fabric'
        )
      }

      if (!embroidery) {
        throw new Error(
          'Please select an embroidery design'
        )
      }

      if (!currentDesign.position) {
        throw new Error(
          'Please select embroidery position'
        )
      }

      const price = calculatePrice()

      const designToSave = {
        user_id: user.id,

        name:
          name?.trim() ||
          'My Custom Design',

        kurta_style: style.name,

        fabric: fabric.name,

        color: currentDesign.color,

        embroidery_design: embroidery.name,

        embroidery_position:
          currentDesign.position,

        embroidery_color:
          currentDesign.customizations
            ?.embroideryColor || '#ec4899',

        customizations:
          currentDesign.customizations,

        size:
          currentDesign.size || 'M',

        base_price:
          style.price || 0,

        embroidery_price:
          embroidery.price || 0,

        customization_price:
          price.customizationPrice || 0,

        total_price:
          price.total || 0,

        preview_image_url:
          currentDesign.previewImage || null,

        is_saved: true,

        is_favorite: false
      }

      console.log(
        'Saving design:',
        designToSave
      )

      const { data, error } = await supabase
        .from('user_designs')
        .insert(designToSave)
        .select('*')
        .single()

      if (error) {
        console.error(
          'SUPABASE SAVE ERROR:',
          error
        )

        throw new Error(
          error.message ||
            'Unable to save design'
        )
      }

      const normalizedDesign =
        normalizeDesign(data)

      setSavedDesigns((prev) => [
        normalizedDesign,
        ...prev
      ])

      console.log(
        'Design saved successfully:',
        data
      )

      return normalizedDesign
    },
    [
      user,
      currentDesign,
      calculatePrice
    ]
  )

  // ==========================================================
  // DELETE DESIGN
  // ==========================================================

  const deleteDesign = useCallback(
    async (id) => {
      if (!user?.id) {
        throw new Error(
          'Please login first'
        )
      }

      const { error } = await supabase
        .from('user_designs')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) {
        console.error(
          'Error deleting design:',
          error
        )

        throw error
      }

      setSavedDesigns((prev) =>
        prev.filter(
          (design) => design.id !== id
        )
      )

      return true
    },
    [user]
  )

  // ==========================================================
  // DUPLICATE DESIGN
  // ==========================================================

  const duplicateDesign = useCallback(
    async (design) => {
      if (!user?.id) {
        throw new Error(
          'Please login first'
        )
      }

      if (!design?.id) {
        throw new Error(
          'Invalid design'
        )
      }

      const duplicate = {
        user_id: user.id,

        name:
          `${design.name || 'My Custom Design'} (Copy)`,

        kurta_style:
          kurtaStyles.find(
            (s) =>
              s.id === design.kurtaStyle
          )?.name ||
          design.kurta_style ||
          design.kurtaStyle,

        fabric:
          fabrics.find(
            (f) =>
              f.id === design.fabric
          )?.name ||
          design.fabric ||
          null,

        color:
          colors.find(
            (c) =>
              c.id === design.color
          )?.id ||
          design.color ||
          null,

        embroidery_design:
          embroideryDesigns.find(
            (e) =>
              e.id === design.embroidery
          )?.name ||
          design.embroidery_design ||
          design.embroidery,

        embroidery_position:
          design.position ||
          design.embroidery_position ||
          null,

        embroidery_color:
          design.customizations
            ?.embroideryColor ||
          design.embroidery_color ||
          '#ec4899',

        customizations:
          design.customizations || {
            scale: 1,
            rotation: 0,
            x: 0,
            y: 0,
            embroideryColor:
              design.embroidery_color ||
              '#ec4899'
          },

        size:
          design.size || 'M',

        base_price:
          design.base_price || 0,

        embroidery_price:
          design.embroidery_price || 0,

        customization_price:
          design.customization_price || 0,

        total_price:
          design.total_price || 0,

        preview_image_url:
          design.preview_image_url ||
          design.previewImage ||
          null,

        is_saved: true,

        is_favorite:
          design.is_favorite || false
      }

      console.log(
        'Duplicating design:',
        duplicate
      )

      const { data, error } = await supabase
        .from('user_designs')
        .insert(duplicate)
        .select('*')
        .single()

      if (error) {
        console.error(
          'Error duplicating design:',
          error
        )

        throw error
      }

      const normalizedDesign =
        normalizeDesign(data)

      setSavedDesigns((prev) => [
        normalizedDesign,
        ...prev
      ])

      return normalizedDesign
    },
    [user]
  )

  // ==========================================================
  // RENAME DESIGN
  // ==========================================================

  const renameDesign = useCallback(
    async (id, newName) => {
      if (!user?.id) {
        throw new Error(
          'Please login first'
        )
      }

      const cleanName =
        newName?.trim()

      if (!cleanName) {
        throw new Error(
          'Please enter a design name'
        )
      }

      const { data, error } =
        await supabase
          .from('user_designs')
          .update({
            name: cleanName
          })
          .eq('id', id)
          .eq('user_id', user.id)
          .select('*')
          .single()

      if (error) {
        console.error(
          'Error renaming design:',
          error
        )

        throw error
      }

      const normalizedDesign =
        normalizeDesign(data)

      setSavedDesigns((prev) =>
        prev.map((design) =>
          design.id === id
            ? normalizedDesign
            : design
        )
      )

      return normalizedDesign
    },
    [user]
  )

  // ==========================================================
  // TOGGLE FAVORITE
  // ==========================================================

  const toggleFavorite = useCallback(
    async (design) => {
      if (!user?.id) {
        throw new Error(
          'Please login first'
        )
      }

      const newFavorite =
        !design.is_favorite

      const { data, error } =
        await supabase
          .from('user_designs')
          .update({
            is_favorite: newFavorite
          })
          .eq('id', design.id)
          .eq('user_id', user.id)
          .select('*')
          .single()

      if (error) {
        console.error(
          'Error updating favorite:',
          error
        )

        throw error
      }

      const normalizedDesign =
        normalizeDesign(data)

      setSavedDesigns((prev) =>
        prev.map((item) =>
          item.id === design.id
            ? normalizedDesign
            : item
        )
      )

      return normalizedDesign
    },
    [user]
  )

  // ==========================================================
  // PROVIDER
  // ==========================================================

  return (
    <DesignContext.Provider
      value={{
        currentDesign,

        savedDesigns,

        loadingSavedDesigns,

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

        saveDesign,

        loadSavedDesigns,

        deleteDesign,

        duplicateDesign,

        renameDesign,

        toggleFavorite
      }}
    >
      {children}
    </DesignContext.Provider>
  )
}

// ============================================================
// USE DESIGN
// ============================================================

export function useDesign() {
  const context = useContext(
    DesignContext
  )

  if (!context) {
    throw new Error(
      'useDesign must be used within DesignProvider'
    )
  }

  return context
}