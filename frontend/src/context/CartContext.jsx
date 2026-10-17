import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react'

import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { user } = useAuth()

  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch cart items with their related designs and products.
  const fetchCart = useCallback(async () => {
    if (!user) {
      setCartItems([])
      setLoading(false)
      return
    }

    setLoading(true)

    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          user_designs (
            id,
            name,
            kurta_style,
            fabric,
            color,
            embroidery_design,
            embroidery_position,
            embroidery_color,
            preview_image_url,
            base_price,
            embroidery_price,
            customization_price
          ),
          products (
            id,
            name,
            style,
            fabric,
            base_price,
            embroidery_price,
            customization_price,
            colors,
            images
          )
        `)
        .eq('user_id', user.id)

      if (error) {
        throw error
      }

      setCartItems(data || [])
    } catch (error) {
      console.error('Error fetching cart:', error)
      setCartItems([])
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  // Safely get an image URL from a design or product.
  const getCartItemImage = useCallback((item) => {
    const design = item?.user_designs
    const product = item?.products

    // Prefer the saved customized design preview.
    if (design?.preview_image_url) {
      return design.preview_image_url
    }

    // Fallback for ready-made products.
    const images = product?.images

    if (Array.isArray(images)) {
      return images[0] || null
    }

    if (typeof images === 'string' && images.trim()) {
      try {
        const parsed = JSON.parse(images)

        if (Array.isArray(parsed)) {
          return parsed[0] || null
        }

        if (typeof parsed === 'object' && parsed !== null) {
          return parsed.url || parsed.image_url || null
        }

        return null
      } catch {
        // A plain URL may be stored as a string.
        return images
      }
    }

    if (images && typeof images === 'object') {
      return images.url || images.image_url || null
    }

    return null
  }, [])

  // Add a design or ready-made product to the cart.
  const addItemToCart = async (
    column,
    itemId,
    quantity = 1,
    size = 'M'
  ) => {
    if (!user) {
      return {
        data: null,
        error: { message: 'Please login first' }
      }
    }

    if (!itemId) {
      return {
        data: null,
        error: { message: 'Item ID is missing' }
      }
    }

    if (!['design_id', 'product_id'].includes(column)) {
      return {
        data: null,
        error: { message: 'Invalid cart item type' }
      }
    }

    try {
      const { data: existing, error: existingError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
        .eq(column, itemId)
        .eq('size', size)
        .maybeSingle()

      if (existingError) {
        return { data: null, error: existingError }
      }

      let result

      if (existing) {
        result = await supabase
          .from('cart_items')
          .update({
            quantity:
              Number(existing.quantity || 0) + Number(quantity)
          })
          .eq('id', existing.id)
          .eq('user_id', user.id)
          .select()
          .single()
      } else {
        result = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            [column]: itemId,
            quantity: Number(quantity),
            size
          })
          .select()
          .single()
      }

      if (result.error) {
        return result
      }

      await fetchCart()

      return result
    } catch (error) {
      console.error('Error adding item to cart:', error)

      return {
        data: null,
        error
      }
    }
  }

  // Custom designs from Design Studio.
  const addToCart = (designId, quantity = 1, size = 'M') => {
    return addItemToCart('design_id', designId, quantity, size)
  }

  // Ready-made products from Shop.
  const addProductToCart = (productId, quantity = 1, size = 'M') => {
    return addItemToCart('product_id', productId, quantity, size)
  }

  // Update quantity.
  const updateQuantity = async (cartItemId, quantity) => {
    if (!user) {
      return {
        data: null,
        error: { message: 'Please login first' }
      }
    }

    if (Number(quantity) <= 0) {
      return removeFromCart(cartItemId)
    }

    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity: Number(quantity) })
      .eq('id', cartItemId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (!error) {
      await fetchCart()
    }

    return { data, error }
  }

  // Update size.
  const updateSize = async (cartItemId, size) => {
    if (!user) {
      return {
        data: null,
        error: { message: 'Please login first' }
      }
    }

    const { data, error } = await supabase
      .from('cart_items')
      .update({ size })
      .eq('id', cartItemId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (!error) {
      await fetchCart()
    }

    return { data, error }
  }

  // Remove one item.
  const removeFromCart = async (cartItemId) => {
    if (!user) {
      return {
        error: { message: 'Please login first' }
      }
    }

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', cartItemId)
      .eq('user_id', user.id)

    if (!error) {
      await fetchCart()
    }

    return { error }
  }

  // Clear the current user's cart.
  const clearCart = async () => {
    if (!user) {
      return { error: null }
    }

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id)

    if (!error) {
      await fetchCart()
    }

    return { error }
  }

  // Calculate the total using the stored prices.
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const productOrDesign = item.user_designs || item.products

      if (!productOrDesign) {
        return total
      }

      const unitPrice =
        Number(productOrDesign.base_price || 0) +
        Number(productOrDesign.embroidery_price || 0) +
        Number(productOrDesign.customization_price || 0)

      return total + unitPrice * Number(item.quantity || 0)
    }, 0)
  }

  // Count all pieces.
  const getCartCount = () => {
    return cartItems.reduce(
      (count, item) => count + Number(item.quantity || 0),
      0
    )
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        addToCart,
        addProductToCart,
        updateQuantity,
        updateSize,
        removeFromCart,
        clearCart,
        getCartTotal,
        getCartCount,
        getCartItemImage,
        refreshCart: fetchCart
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }

  return context
}