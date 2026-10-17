import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDesign } from '../context/DesignContext'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Save,
  Heart,
  RotateCcw,
  Maximize2,
  Minimize2
} from 'lucide-react'
import toast from 'react-hot-toast'

// --------------------------------------------------
// KURTA IMAGES
// Images must be inside frontend/public/kurtas/
// --------------------------------------------------

const kurtaImages = {
  straight: '/kurtas/kurta-collection1.png',
  anarkali: '/kurtas/kurta-collection2.png',
  'a-line': '/kurtas/kurta-collection3.png',
  short: '/kurtas/kurta-collection4.png',
  long: '/kurtas/kurta-collection5.png',
  western: '/kurtas/kurta-collection6.png'
}

// --------------------------------------------------
// RECOLOUR KURTA PNG
// Preserves transparency and original shading.
// --------------------------------------------------

function useRecoloredKurta(imagePath, color) {
  const [recoloredImage, setRecoloredImage] = useState('')
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    let cancelled = false
    let generatedUrl = ''

    setRecoloredImage('')
    setImageError(false)

    if (!imagePath) {
      setImageError(true)
      return
    }

    const image = new Image()

    image.onload = () => {
      if (cancelled) return

      try {
        const canvas = document.createElement('canvas')
        canvas.width = image.naturalWidth
        canvas.height = image.naturalHeight

        const ctx = canvas.getContext('2d', {
          willReadFrequently: true
        })

        if (!ctx) {
          throw new Error('Canvas is unavailable')
        }

        ctx.drawImage(image, 0, 0)

        const imageData = ctx.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        )

        const pixels = imageData.data

        const validHex = /^#([0-9a-f]{6})$/i.test(color || '')
        const hex = validHex ? color : '#ffffff'

        const targetR = parseInt(hex.slice(1, 3), 16)
        const targetG = parseInt(hex.slice(3, 5), 16)
        const targetB = parseInt(hex.slice(5, 7), 16)

        for (let i = 0; i < pixels.length; i += 4) {
          const alpha = pixels[i + 3]

          // Keep the transparent background transparent.
          if (alpha === 0) continue

          const r = pixels[i]
          const g = pixels[i + 1]
          const b = pixels[i + 2]

          // Preserve the shading of a white garment.
          const brightness =
            (r * 0.299 + g * 0.587 + b * 0.114) / 255

          // Maintain enough brightness to show fabric details.
          const shade = 0.35 + brightness * 0.65

          pixels[i] = Math.min(255, Math.round(targetR * shade))
          pixels[i + 1] = Math.min(255, Math.round(targetG * shade))
          pixels[i + 2] = Math.min(255, Math.round(targetB * shade))
        }

        ctx.putImageData(imageData, 0, 0)

        canvas.toBlob(blob => {
          if (!blob || cancelled) return

          generatedUrl = URL.createObjectURL(blob)
          setRecoloredImage(generatedUrl)
        }, 'image/png')
      } catch (error) {
        console.error('Kurta recolouring failed:', error)

        if (!cancelled) {
          setImageError(true)
        }
      }
    }

    image.onerror = () => {
      if (!cancelled) {
        setImageError(true)
      }
    }

    image.src = imagePath

    return () => {
      cancelled = true

      if (generatedUrl) {
        URL.revokeObjectURL(generatedUrl)
      }
    }
  }, [imagePath, color])

  return { recoloredImage, imageError }
}

// --------------------------------------------------
// DESIGN STEPS
// --------------------------------------------------

const steps = [
  { id: 1, label: 'Kurta Style', icon: '👗' },
  { id: 2, label: 'Fabric', icon: '☁️' },
  { id: 3, label: 'Color', icon: '🎨' },
  { id: 4, label: 'Embroidery', icon: '🧵' },
  { id: 5, label: 'Position', icon: '📍' },
  { id: 6, label: 'Customize', icon: '✨' },
  { id: 7, label: 'Preview', icon: '👁️' }
]

// --------------------------------------------------
// EMBROIDERY COLORS
// --------------------------------------------------

const embroideryColors = [
  '#ec4899',
  '#be185d',
  '#9d174d',
  '#f43f5e',
  '#ffffff',
  '#1f2937',
  '#fbbf24',
  '#059669',
  '#2563eb',
  '#9333ea',
  '#ea580c',
  '#0d9488'
]

// --------------------------------------------------
// EMBROIDERY COLOR FILTER
// --------------------------------------------------

const hexToFilter = hex => {
  const filters = {
    '#ec4899': 'hue-rotate(300deg) saturate(1.5)',
    '#be185d': 'hue-rotate(320deg) saturate(2)',
    '#9d174d': 'hue-rotate(320deg) saturate(2.5)',
    '#f43f5e': 'hue-rotate(330deg) saturate(2)',
    '#ffffff': 'grayscale(1) brightness(2)',
    '#1f2937': 'grayscale(1) brightness(0.45)',
    '#fbbf24': 'hue-rotate(15deg) saturate(2)',
    '#059669': 'hue-rotate(100deg) saturate(2)',
    '#2563eb': 'hue-rotate(200deg) saturate(2)',
    '#9333ea': 'hue-rotate(260deg) saturate(2)',
    '#ea580c': 'hue-rotate(340deg) saturate(2)',
    '#0d9488': 'hue-rotate(120deg) saturate(2)'
  }

  return filters[hex?.toLowerCase()] || 'none'
}

function EmbroideryMark({ icon, color, size = 'text-4xl' }) {
  return (
    <span
      className={`${size} inline-block leading-none`}
      role="img"
      aria-label="Embroidery design"
      style={{
        filter: hexToFilter(color),
        WebkitFilter: hexToFilter(color)
      }}
    >
      {icon}
    </span>
  )
}
// --------------------------------------------------
// CREATE A COMBINED CUSTOMIZED KURTA IMAGE
// --------------------------------------------------

async function createCustomizedKurtaImage({
  imagePath,
  color,
  embroideryIcon,
  embroideryColor,
  position,
  customizations,
  styleName
}) {
  const loadImage = src =>
    new Promise((resolve, reject) => {
      const image = new Image()

      image.onload = () => resolve(image)
      image.onerror = () =>
        reject(new Error(`Could not load image: ${src}`))

      image.src = src
    })

  const image = await loadImage(imagePath)

  const canvas = document.createElement('canvas')
  canvas.width = 600
  canvas.height = 800

  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('Could not create preview canvas.')
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Draw kurta while preserving its transparent background.
  const scale = Math.min(
    canvas.width / image.width,
    canvas.height / image.height
  )

  const width = image.width * scale
  const height = image.height * scale
  const left = (canvas.width - width) / 2
  const top = (canvas.height - height) / 2

  ctx.drawImage(image, left, top, width, height)

  // Recolour the garment while preserving shading.
  const imageData = ctx.getImageData(
    0,
    0,
    canvas.width,
    canvas.height
  )

  const pixels = imageData.data
  const hex = /^#[0-9a-f]{6}$/i.test(color || '')
    ? color
    : '#ffffff'

  const targetR = parseInt(hex.slice(1, 3), 16)
  const targetG = parseInt(hex.slice(3, 5), 16)
  const targetB = parseInt(hex.slice(5, 7), 16)

  for (let i = 0; i < pixels.length; i += 4) {
    if (pixels[i + 3] === 0) continue

    const brightness =
      (pixels[i] * 0.299 +
        pixels[i + 1] * 0.587 +
        pixels[i + 2] * 0.114) /
      255

    const shade = 0.35 + brightness * 0.65

    pixels[i] = Math.round(targetR * shade)
    pixels[i + 1] = Math.round(targetG * shade)
    pixels[i + 2] = Math.round(targetB * shade)
  }

  ctx.putImageData(imageData, 0, 0)

  // Add embroidery at the selected position.
  if (embroideryIcon && position?.coords) {
    const x = Number(customizations?.x ?? 0)
    const y = Number(customizations?.y ?? 0)
    const size = 48 * Number(customizations?.scale ?? 1)
    const rotation = Number(customizations?.rotation ?? 0)

    const px = canvas.width * (
      Number(position.coords.x) + x
    ) / 100

    const py = canvas.height * (
      Number(position.coords.y) + y
    ) / 100

    ctx.save()
    ctx.translate(px, py)
    ctx.rotate((rotation * Math.PI) / 180)
    ctx.font = `${size}px sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = embroideryColor || '#ec4899'
    ctx.fillText(embroideryIcon, 0, 0)
    ctx.restore()
  }

  // Add the kurta name at the bottom.
  ctx.fillStyle = 'rgba(255,255,255,0.9)'
  ctx.fillRect(20, 750, 560, 35)

  ctx.fillStyle = '#831843'
  ctx.font = 'bold 20px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(styleName || 'Your Kurta', 300, 774)

  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (!blob) {
        reject(new Error('Could not generate the kurta preview.'))
        return
      }

      resolve(blob)
    }, 'image/png')
  })
}
// --------------------------------------------------
// REUSABLE KURTA PREVIEW
// --------------------------------------------------

function KurtaPreview({
  styleId,
  styleName,
  color,
  selectedEmbroidery,
  selectedPosition,
  embroideryColor,
  customizations,
  large = false
}) {
  const imagePath = kurtaImages[styleId]

  const { recoloredImage, imageError } = useRecoloredKurta(
    imagePath,
    color || '#ffffff'
  )

  const x = Number(customizations?.x ?? 0)
  const y = Number(customizations?.y ?? 0)
  const scale = Number(customizations?.scale ?? 1)
  const rotation = Number(customizations?.rotation ?? 0)

  return (
    <div
      className={`relative w-full ${
        large ? 'max-w-lg' : 'max-w-sm'
      } mx-auto aspect-[3/4] rounded-2xl overflow-hidden border border-pink-100 bg-white`}
    >
      {!imageError ? (
        <img
          src={recoloredImage || imagePath}
          alt={styleName || 'Selected kurta'}
          className="absolute inset-0 w-full h-full object-contain"
          onError={event => {
            if (event.currentTarget.src === imagePath) {
              console.error('Kurta image not found:', imagePath)
            }
          }}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-pink-50">
          <span className="text-5xl mb-3">👗</span>

          <p className="font-semibold text-pink-800">
            Kurta image not found
          </p>

          <p className="text-sm text-pink-600 mt-2">
            Check the image filename inside public/kurtas.
          </p>
        </div>
      )}

      {/* EMBROIDERY PREVIEW */}

      {selectedEmbroidery && selectedPosition && (
        <motion.div
          key={`${selectedEmbroidery.id}-${selectedPosition.id}`}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute z-10"
          style={{
            left: `calc(${selectedPosition.coords.x}% + ${x}%)`,
            top: `calc(${selectedPosition.coords.y}% + ${y}%)`,
            transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`,
            transformOrigin: 'center'
          }}
        >
          <EmbroideryMark
            icon={selectedEmbroidery.icon}
            color={embroideryColor}
            size={large ? 'text-6xl' : 'text-4xl'}
          />
        </motion.div>
      )}

      {/* KURTA NAME */}

      <div className="absolute bottom-3 left-3 right-3 rounded-xl bg-white/90 backdrop-blur-sm p-2 text-center">
        <p className="font-semibold text-pink-800">
          {styleName || 'Your Kurta'}
        </p>
      </div>
    </div>
  )
}

// --------------------------------------------------
// MAIN DESIGN STUDIO
// --------------------------------------------------

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
  const [fabricTexture, setFabricTexture] = useState('')

  const price = calculatePrice()

  const selectedStyle = kurtaStyles.find(
    style => style.id === currentDesign.kurtaStyle
  )

  const selectedFabric = fabrics.find(
    fabric => fabric.id === currentDesign.fabric
  )

  const selectedColor = colors.find(
    color => color.id === currentDesign.color
  )

  const selectedEmbroidery = embroideryDesigns.find(
    embroidery => embroidery.id === currentDesign.embroidery
  )

  const selectedPosition = positions.find(
    position => position.id === currentDesign.position
  )

  const selectedEmbroideryColor =
    currentDesign.customizations?.embroideryColor || '#ec4899'

  useEffect(() => {
    if (selectedFabric) {
      setFabricTexture(selectedFabric.texture || '')
    }
  }, [selectedFabric])

  // ------------------------------------------------
  // VALIDATION
  // ------------------------------------------------

  const canProceed = () => {
    switch (currentDesign.step) {
      case 1:
        return Boolean(currentDesign.kurtaStyle)
      case 2:
        return Boolean(currentDesign.fabric)
      case 3:
        return Boolean(currentDesign.color)
      case 4:
        return Boolean(currentDesign.embroidery)
      case 5:
        return Boolean(currentDesign.position)
      case 6:
      case 7:
        return true
      default:
        return false
    }
  }

  const handleNext = () => {
    if (!canProceed()) {
      toast.error('Please select an option first.')
      return
    }

    if (currentDesign.step < 7) {
      updateStep(currentDesign.step + 1)
    }
  }

  const handlePrev = () => {
    if (currentDesign.step > 1) {
      updateStep(currentDesign.step - 1)
    }
  }

  // ------------------------------------------------
  // SAVE DESIGN
  // ------------------------------------------------

  const handleSaveDesign = async () => {
    if (!saveName.trim()) {
      toast.error('Please enter a name for your design.')
      return
    }

    if (!user) {
      toast.error('Please login to save your design.')
      return
    }

    try {
      await saveDesign(saveName.trim())

      toast.success('Design saved to My Collection!')

      setShowSaveModal(false)
      setSaveName('')
    } catch (error) {
      console.error('Error saving design:', error)

      toast.error(
        error?.message || 'Failed to save your design.'
      )
    }
  }

  // ------------------------------------------------
  // ADD TO CART
  // ------------------------------------------------

 const handleAddToCart = async () => {
  if (!user) {
    toast.error('Please login to add your design to cart.')
    return
  }

  if (!selectedStyle) {
    toast.error('Please select a kurta first.')
    return
  }

  try {
    toast.loading('Preparing your customized kurta...', {
      id: 'custom-kurta-cart'
    })

    // Generate a PNG containing the selected kurta colour
    // and embroidery.
    const previewBlob = await createCustomizedKurtaImage({
      imagePath: kurtaImages[selectedStyle.id],
      color: selectedColor?.hex || '#ffffff',
      embroideryIcon: selectedEmbroidery?.icon,
      embroideryColor: selectedEmbroideryColor,
      position: selectedPosition,
      customizations: currentDesign.customizations,
      styleName: selectedStyle.name
    })

    // Upload the PNG to Supabase Storage.
    const { supabase } = await import('../lib/supabase')

    const fileName =
      `${user.id}/${Date.now()}-custom-kurta.png`

    const { error: uploadError } = await supabase.storage
      .from('design-previews')
      .upload(fileName, previewBlob, {
        contentType: 'image/png',
        upsert: false
      })

    if (uploadError) {
      throw uploadError
    }

    const { data: imageData } = supabase.storage
      .from('design-previews')
      .getPublicUrl(fileName)

    const previewImageUrl = imageData?.publicUrl

    if (!previewImageUrl) {
      throw new Error('Could not create the preview image URL.')
    }

    // Save the preview URL with the design.
    updateField('previewImage', previewImageUrl)

    // Save the design and retrieve its database ID.
    const savedDesign = await saveDesign(
      `${selectedStyle.name} Custom Design`
    )

    if (!savedDesign?.id) {
      throw new Error('Could not save the customized design.')
    }

    // Add the saved design to cart.
    const result = await addToCart(
      savedDesign.id,
      1,
      currentDesign.size || 'M'
    )

    if (result?.error) {
      throw result.error
    }

    toast.success('Customized kurta added to cart!', {
      id: 'custom-kurta-cart'
    })
  } catch (error) {
    console.error('Add to cart error:', error)

    toast.error(
      error?.message || 'Failed to add your customized kurta.',
      { id: 'custom-kurta-cart' }
    )
  }
}

  // ------------------------------------------------
  // COMMON CARD STYLES
  // ------------------------------------------------

  const selectedCard = isSelected =>
    'relative p-4 rounded-2xl border-2 transition-all duration-200 ' +
    (isSelected
      ? 'border-pink-500 bg-pink-50 shadow-md shadow-pink-100'
      : 'border-pink-100 hover:border-pink-300 hover:bg-pink-50')

  return (
    <div className="max-w-7xl mx-auto px-3 md:px-0">

      {/* HEADER */}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="font-playfair text-3xl md:text-4xl font-bold bg-gradient-pink-dark bg-clip-text text-transparent">
              Design Studio ✨
            </h1>

            <p className="font-poppins text-pink-500 mt-1">
              Create your dream kurta step by step 🧵
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset all your design progress?')) {
                resetDesign()
                setShowPreview(false)
                toast.success('Design reset successfully.')
              }
            }}
            className="btn-ghost text-sm"
          >
            <RotateCcw className="w-4 h-4 mr-1 inline" />
            Reset
          </button>
        </div>

        {/* DESKTOP STEPS */}

        <div className="hidden md:flex items-center justify-center gap-2 mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <button
                type="button"
                onClick={() => {
                  if (step.id <= currentDesign.step) {
                    updateStep(step.id)
                  }
                }}
                title={step.label}
                className={`step-indicator ${
                  index + 1 < currentDesign.step
                    ? 'step-completed'
                    : index + 1 === currentDesign.step
                      ? 'step-active'
                      : 'step-pending'
                }`}
              >
                {index + 1 < currentDesign.step ? (
                  <Check className="w-5 h-5" />
                ) : (
                  step.icon
                )}
              </button>

              {index < steps.length - 1 && (
                <div className="step-connector" />
              )}
            </div>
          ))}
        </div>

        {/* MOBILE STEPS */}

        <div className="md:hidden overflow-x-auto pb-3">
          <div className="flex gap-2 min-w-max">
            {steps.map((step, index) => (
              <button
                type="button"
                key={step.id}
                onClick={() => {
                  if (step.id <= currentDesign.step) {
                    updateStep(step.id)
                  }
                }}
                className={`flex items-center gap-1 px-3 py-2 rounded-full ${
                  index + 1 < currentDesign.step
                    ? 'bg-pink-400 text-white'
                    : index + 1 === currentDesign.step
                      ? 'bg-pink-600 text-white'
                      : 'bg-pink-100 text-pink-400'
                }`}
              >
                <span>{step.icon}</span>
                <span className="font-poppins text-sm whitespace-nowrap">
                  {step.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* MAIN LAYOUT */}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">

          <AnimatePresence mode="wait">
            <motion.section
              key={currentDesign.step}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.2 }}
              className="card-elevated p-4 md:p-6"
            >
              <h2 className="font-playfair text-2xl font-bold text-pink-800 mb-6">
                {steps[currentDesign.step - 1]?.icon}{' '}
                Step {currentDesign.step}:{' '}
                {steps[currentDesign.step - 1]?.label}
              </h2>

              {/* STEP 1: KURTA STYLE */}

              {currentDesign.step === 1 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {kurtaStyles.map(style => {
                    const isSelected =
                      currentDesign.kurtaStyle === style.id

                    return (
                      <motion.button
                        type="button"
                        key={style.id}
                        onClick={() => updateField('kurtaStyle', style.id)}
                        whileHover={{ y: -3 }}
                        whileTap={{ scale: 0.98 }}
                        className={selectedCard(isSelected)}
                        aria-pressed={isSelected}
                      >
                        <div className="relative aspect-[3/4] w-full mb-3 rounded-xl overflow-hidden bg-white">
                          <img
                            src={kurtaImages[style.id]}
                            alt={style.name}
                            loading="lazy"
                            className="w-full h-full object-contain"
                            onError={event => {
                              event.currentTarget.style.display = 'none'
                              event.currentTarget.parentElement.classList.add(
                                'bg-pink-50'
                              )
                            }}
                          />

                          {isSelected && (
                            <span className="absolute top-2 right-2 bg-pink-500 text-white rounded-full p-1">
                              <Check className="w-5 h-5" />
                            </span>
                          )}
                        </div>

                        <h3 className="font-playfair font-bold text-pink-800">
                          {style.name}
                        </h3>

                        <p className="font-poppins text-xs md:text-sm text-pink-500 mt-1">
                          {style.description}
                        </p>

                        <p className="font-poppins font-semibold text-pink-600 mt-2">
                          ₹{style.price}
                        </p>
                      </motion.button>
                    )
                  })}
                </div>
              )}

              {/* STEP 2: FABRIC */}

              {currentDesign.step === 2 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {fabrics.map(fabric => {
                    const isSelected =
                      currentDesign.fabric === fabric.id

                    return (
                      <button
                        type="button"
                        key={fabric.id}
                        onClick={() => updateField('fabric', fabric.id)}
                        className={selectedCard(isSelected)}
                        aria-pressed={isSelected}
                      >
                        <div className="aspect-square rounded-xl overflow-hidden mb-3 bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center">
                          <span className="text-6xl">
                            {fabric.icon || '🧵'}
                          </span>
                        </div>

                        <h3 className="font-playfair font-bold text-pink-800">
                          {fabric.name}
                        </h3>

                        <p className="text-sm text-pink-500 mt-1">
                          {fabric.description}
                        </p>

                        <p className="font-semibold text-pink-600 mt-2">
                          {fabric.price > 0
                            ? `+₹${fabric.price}`
                            : 'Included'}
                        </p>
                      </button>
                    )
                  })}
                </div>
              )}

              {/* STEP 3: KURTA COLOR */}

              {currentDesign.step === 3 && (
                <div>
                  <p className="text-pink-600 mb-4">
                    Choose your preferred kurta color.
                  </p>

                  <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
                    {colors.map(color => {
                      const isSelected =
                        currentDesign.color === color.id

                      return (
                        <button
                          type="button"
                          key={color.id}
                          onClick={() => updateField('color', color.id)}
                          className="flex flex-col items-center gap-2"
                          aria-pressed={isSelected}
                          title={color.name}
                        >
                          <span
                            className={`w-12 h-12 md:w-14 md:h-14 rounded-full border-2 flex items-center justify-center ${
                              isSelected
                                ? 'border-pink-500 ring-4 ring-pink-200'
                                : 'border-gray-200'
                            }`}
                            style={{ backgroundColor: color.hex }}
                          >
                            {isSelected && (
                              <Check
                                className={`w-6 h-6 ${
                                  [
                                    '#ffffff',
                                    '#fbbf24',
                                    '#fef3c7'
                                  ].includes(color.hex?.toLowerCase())
                                    ? 'text-pink-700'
                                    : 'text-white'
                                }`}
                              />
                            )}
                          </span>

                          <span className="text-xs md:text-sm text-pink-700">
                            {color.name}
                          </span>
                        </button>
                      )
                    })}
                  </div>

                  <div className="mt-8">
                    <h3 className="font-playfair font-bold text-pink-800 mb-3">
                      Current kurta
                    </h3>

                    <KurtaPreview
                      styleId={selectedStyle?.id}
                      styleName={selectedStyle?.name}
                      color={selectedColor?.hex}
                      customizations={currentDesign.customizations}
                    />

                    <p className="text-xs text-pink-500 text-center mt-2">
                      Preview updates to show the selected kurta colour.
                    </p>
                  </div>
                </div>
              )}

              {/* STEP 4: EMBROIDERY */}

              {currentDesign.step === 4 && (
                <div className="space-y-3">
                  {embroideryDesigns.map(embroidery => {
                    const isSelected =
                      currentDesign.embroidery === embroidery.id

                    return (
                      <button
                        type="button"
                        key={embroidery.id}
                        onClick={() =>
                          updateField('embroidery', embroidery.id)
                        }
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left ${
                          isSelected
                            ? 'border-pink-500 bg-pink-50'
                            : 'border-pink-100 hover:border-pink-300'
                        }`}
                        aria-pressed={isSelected}
                      >
                        <span className="text-4xl">
                          {embroidery.icon}
                        </span>

                        <span className="flex-1">
                          <span className="block font-playfair font-bold text-pink-800">
                            {embroidery.name}
                          </span>

                          <span className="block text-sm text-pink-500">
                            {embroidery.category}
                          </span>

                          <span className="block text-xs text-gray-500 mt-1">
                            Positions:{' '}
                            {embroidery.positions
                              .map(id =>
                                positions.find(position => position.id === id)
                                  ?.name
                              )
                              .filter(Boolean)
                              .join(', ')}
                          </span>
                        </span>

                        <span className="font-semibold text-pink-600">
                          +₹{embroidery.price}
                        </span>

                        {isSelected && (
                          <Check className="w-5 h-5 text-pink-500" />
                        )}
                      </button>
                    )
                  })}
                </div>
              )}

              {/* STEP 5: EMBROIDERY POSITION */}

              {currentDesign.step === 5 && (
                <div>
                  <p className="text-pink-600 mb-5">
                    Select where you want the embroidery.
                  </p>

                  <div className="grid sm:grid-cols-2 gap-3 mb-6">
                    {positions
                      .filter(position =>
                        selectedEmbroidery?.positions.includes(position.id)
                      )
                      .map(position => {
                        const isSelected =
                          currentDesign.position === position.id

                        return (
                          <button
                            type="button"
                            key={position.id}
                            onClick={() =>
                              updateField('position', position.id)
                            }
                            className={`p-4 rounded-xl border-2 text-left ${
                              isSelected
                                ? 'border-pink-500 bg-pink-50'
                                : 'border-pink-100 hover:border-pink-300'
                            }`}
                            aria-pressed={isSelected}
                          >
                            <span className="flex items-center justify-between">
                              <span className="font-semibold text-pink-800">
                                📍 {position.name}
                              </span>

                              {isSelected && (
                                <Check className="w-5 h-5 text-pink-500" />
                              )}
                            </span>
                          </button>
                        )
                      })}
                  </div>

                  <KurtaPreview
                    styleId={selectedStyle?.id}
                    styleName={selectedStyle?.name}
                    color={selectedColor?.hex}
                    selectedEmbroidery={selectedEmbroidery}
                    selectedPosition={selectedPosition}
                    embroideryColor={selectedEmbroideryColor}
                    customizations={currentDesign.customizations}
                    large
                  />

                  <p className="text-xs text-center text-pink-500 mt-3">
                    Embroidery positions are approximate preview locations.
                  </p>
                </div>
              )}

              {/* STEP 6: CUSTOMIZE */}

              {currentDesign.step === 6 && (
                <div className="space-y-8">

                  {/* SIZE */}

                  <div>
                    <h3 className="font-playfair font-bold text-pink-800 mb-4">
                      Size & Fit
                    </h3>

                    <div className="flex flex-wrap gap-2">
                      {sizes.map(size => (
                        <button
                          type="button"
                          key={size}
                          onClick={() => updateField('size', size)}
                          className={`px-4 py-2 rounded-xl font-medium ${
                            currentDesign.size === size
                              ? 'bg-pink-500 text-white'
                              : 'bg-pink-50 text-pink-700 hover:bg-pink-100'
                          }`}
                          aria-pressed={currentDesign.size === size}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* EMBROIDERY COLOR */}

                  <div>
                    <h3 className="font-playfair font-bold text-pink-800 mb-4">
                      Embroidery Color
                    </h3>

                    <div className="grid grid-cols-6 gap-3">
                      {embroideryColors.map(color => (
                        <button
                          type="button"
                          key={color}
                          onClick={() =>
                            updateCustomization('embroideryColor', color)
                          }
                          className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                            selectedEmbroideryColor === color
                              ? 'border-pink-500 ring-2 ring-pink-200'
                              : 'border-gray-200'
                          }`}
                          style={{ backgroundColor: color }}
                          aria-label={`Embroidery color ${color}`}
                          aria-pressed={selectedEmbroideryColor === color}
                        >
                          {selectedEmbroideryColor === color && (
                            <Check
                              className={`w-5 h-5 ${
                                color === '#ffffff' || color === '#fbbf24'
                                  ? 'text-pink-700'
                                  : 'text-white'
                              }`}
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* EMBROIDERY SIZE AND POSITION */}

                  <div>
                    <h3 className="font-playfair font-bold text-pink-800 mb-4">
                      Transform Embroidery
                    </h3>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm text-pink-700 mb-2">
                          Scale:{' '}
                          {Number(
                            currentDesign.customizations?.scale ?? 1
                          ).toFixed(1)}x
                        </label>

                        <input
                          type="range"
                          min="0.5"
                          max="2"
                          step="0.1"
                          value={currentDesign.customizations?.scale ?? 1}
                          onChange={event =>
                            updateCustomization(
                              'scale',
                              Number(event.target.value)
                            )
                          }
                          className="w-full accent-pink-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-pink-700 mb-2">
                          Rotation:{' '}
                          {currentDesign.customizations?.rotation ?? 0}°
                        </label>

                        <input
                          type="range"
                          min="-180"
                          max="180"
                          step="5"
                          value={currentDesign.customizations?.rotation ?? 0}
                          onChange={event =>
                            updateCustomization(
                              'rotation',
                              Number(event.target.value)
                            )
                          }
                          className="w-full accent-pink-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-pink-700 mb-2">
                          Horizontal Position
                        </label>

                        <input
                          type="range"
                          min="-30"
                          max="30"
                          step="1"
                          value={currentDesign.customizations?.x ?? 0}
                          onChange={event =>
                            updateCustomization(
                              'x',
                              Number(event.target.value)
                            )
                          }
                          className="w-full accent-pink-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-pink-700 mb-2">
                          Vertical Position
                        </label>

                        <input
                          type="range"
                          min="-30"
                          max="30"
                          step="1"
                          value={currentDesign.customizations?.y ?? 0}
                          onChange={event =>
                            updateCustomization(
                              'y',
                              Number(event.target.value)
                            )
                          }
                          className="w-full accent-pink-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* LIVE PREVIEW */}

                  <div>
                    <h3 className="font-playfair font-bold text-pink-800 mb-4">
                      Live Preview
                    </h3>

                    <KurtaPreview
                      styleId={selectedStyle?.id}
                      styleName={selectedStyle?.name}
                      color={selectedColor?.hex}
                      selectedEmbroidery={selectedEmbroidery}
                      selectedPosition={selectedPosition}
                      embroideryColor={selectedEmbroideryColor}
                      customizations={currentDesign.customizations}
                      large
                    />
                  </div>
                </div>
              )}

              {/* STEP 7: FINAL PREVIEW */}

              {currentDesign.step === 7 && (
                <div className="space-y-6">
                  <KurtaPreview
                    styleId={selectedStyle?.id}
                    styleName={selectedStyle?.name}
                    color={selectedColor?.hex}
                    selectedEmbroidery={selectedEmbroidery}
                    selectedPosition={selectedPosition}
                    embroideryColor={selectedEmbroideryColor}
                    customizations={currentDesign.customizations}
                    large
                  />

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="rounded-xl bg-pink-50 p-4">
                      <p className="text-sm text-pink-500">Kurta</p>
                      <p className="font-bold text-pink-800">
                        {selectedStyle?.name || 'Not selected'}
                      </p>
                    </div>

                    <div className="rounded-xl bg-pink-50 p-4">
                      <p className="text-sm text-pink-500">Fabric</p>
                      <p className="font-bold text-pink-800">
                        {selectedFabric?.name || 'Not selected'}
                      </p>
                    </div>

                    <div className="rounded-xl bg-pink-50 p-4">
                      <p className="text-sm text-pink-500">Size</p>
                      <p className="font-bold text-pink-800">
                        {currentDesign.size || 'M'}
                      </p>
                    </div>

                    <div className="rounded-xl bg-pink-50 p-4">
                      <p className="text-sm text-pink-500">Embroidery</p>
                      <p className="font-bold text-pink-800">
                        {selectedEmbroidery?.name || 'Not selected'}
                      </p>
                    </div>

                    <div className="rounded-xl bg-pink-50 p-4">
                      <p className="text-sm text-pink-500">Position</p>
                      <p className="font-bold text-pink-800">
                        {selectedPosition?.name || 'Not selected'}
                      </p>
                    </div>

                    <div className="rounded-xl bg-pink-50 p-4">
                      <p className="text-sm text-pink-500">Total Price</p>
                      <p className="font-bold text-pink-700 text-xl">
                        ₹{price.total}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowPreview(true)}
                    className="btn-secondary w-full"
                  >
                    <Maximize2 className="w-4 h-4 inline mr-2" />
                    Open Full Preview
                  </button>
                </div>
              )}
            </motion.section>
          </AnimatePresence>

          {/* NAVIGATION */}

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentDesign.step === 1}
              className="btn-secondary disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4 inline mr-1" />
              Back
            </button>

            <span className="text-sm text-pink-500">
              Step {currentDesign.step} of 7
            </span>

            {currentDesign.step < 7 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={!canProceed()}
                className="btn-primary disabled:opacity-40"
              >
                Next
                <ChevronRight className="w-4 h-4 inline ml-1" />
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowSaveModal(true)}
                  className="btn-secondary"
                >
                  <Save className="w-4 h-4 inline mr-1" />
                  Save
                </button>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="btn-primary"
                >
                  <Heart className="w-4 h-4 inline mr-1" />
                  Cart
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDEBAR */}

        <aside className="space-y-6">
          <div className="card-elevated p-5 lg:sticky lg:top-24">
            <h3 className="font-playfair text-xl font-bold text-pink-800 mb-5">
              💰 Price Summary
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between gap-2">
                <span className="text-gray-600">Kurta Base</span>
                <span className="font-semibold text-pink-700">
                  ₹{price.basePrice}
                </span>
              </div>

              <div className="flex justify-between gap-2">
                <span className="text-gray-600">Fabric</span>
                <span className="font-semibold text-pink-700">
                  +₹{price.fabricPrice}
                </span>
              </div>

              <div className="flex justify-between gap-2">
                <span className="text-gray-600">Embroidery</span>
                <span className="font-semibold text-pink-700">
                  +₹{price.embroideryPrice}
                </span>
              </div>

              <div className="flex justify-between gap-2">
                <span className="text-gray-600">Customization</span>
                <span className="font-semibold text-pink-700">
                  +₹{price.customizationPrice}
                </span>
              </div>

              <div className="border-t border-pink-100 pt-4 flex justify-between gap-2">
                <span className="font-bold text-pink-800">Total</span>
                <span className="font-playfair font-bold text-xl text-pink-700">
                  ₹{price.total}
                </span>
              </div>
            </div>
          </div>

          <div className="card-elevated p-5">
            <h3 className="font-playfair text-xl font-bold text-pink-800 mb-4">
              💡 Design Tips
            </h3>

            <ul className="space-y-3 text-sm text-pink-600">
              <li>✨ Cotton works well for everyday wear.</li>
              <li>🌸 Floral embroidery suits many styles.</li>
              <li>💎 Contrast embroidery adds visual detail.</li>
              <li>📍 Neck and chest are popular positions.</li>
              <li>👗 Choose the style before selecting fabric.</li>
            </ul>
          </div>
        </aside>
      </div>

      {/* FULL PREVIEW MODAL */}

      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3"
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-2xl max-h-[95vh] overflow-y-auto rounded-3xl p-5 md:p-7"
              onClick={event => event.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-playfair text-2xl font-bold text-pink-800">
                  Final Preview 👗
                </h2>

                <button
                  type="button"
                  onClick={() => setShowPreview(false)}
                  className="p-2 rounded-xl hover:bg-pink-50 text-pink-600"
                  aria-label="Close preview"
                >
                  <Minimize2 className="w-5 h-5" />
                </button>
              </div>

              <KurtaPreview
                styleId={selectedStyle?.id}
                styleName={selectedStyle?.name}
                color={selectedColor?.hex}
                selectedEmbroidery={selectedEmbroidery}
                selectedPosition={selectedPosition}
                embroideryColor={selectedEmbroideryColor}
                customizations={currentDesign.customizations}
                large
              />

              <div className="text-center mt-5">
                <p className="font-playfair text-2xl font-bold text-pink-700">
                  ₹{price.total}
                </p>

                <p className="text-sm text-pink-500 mt-1">
                  Size: {currentDesign.size || 'M'}
                </p>
              </div>

              <div className="flex gap-3 mt-5">
                <button
                  type="button"
                  onClick={() => setShowSaveModal(true)}
                  className="btn-secondary flex-1"
                >
                  <Save className="w-4 h-4 inline mr-1" />
                  Save
                </button>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="btn-primary flex-1"
                >
                  <Heart className="w-4 h-4 inline mr-1" />
                  Add to Cart
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SAVE DESIGN MODAL */}

      <AnimatePresence>
        {showSaveModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowSaveModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-md"
              onClick={event => event.stopPropagation()}
            >
              <h2 className="font-playfair text-2xl font-bold text-pink-800 text-center mb-5">
                Save Your Design 💖
              </h2>

              <label className="block text-sm font-medium text-pink-700 mb-2">
                Design name
              </label>

              <input
                type="text"
                value={saveName}
                onChange={event => setSaveName(event.target.value)}
                placeholder="e.g. Pink Floral Kurta"
                className="input-field w-full mb-5"
                autoFocus
              />

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowSaveModal(false)
                    setSaveName('')
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSaveDesign}
                  className="btn-primary flex-1"
                >
                  <Save className="w-4 h-4 inline mr-1" />
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