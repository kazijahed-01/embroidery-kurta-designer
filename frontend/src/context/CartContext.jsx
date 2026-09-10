import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)

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

      if (error) throw error

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

  const addItemToCart = async (column, itemId, quantity = 1, size = 'M') => {
    if (!user) {
      return { error: { message: 'Please login first' } }
    }

    try {
      const { data: existing, error: existingError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
        .eq(column, itemId)
        .eq('size', size)
        .maybeSingle()

      if (existingError) return { error: existingError }

      let result

      if (existing) {
        result = await supabase
          .from('cart_items')
          .update({ quantity: existing.quantity + quantity })
          .eq('id', existing.id)
          .select()
          .single()
      } else {
        result = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            [column]: itemId,
            quantity,
            size
          })
          .select()
          .single()
      }

      if (result.data) await fetchCart()

      return result
    } catch (error) {
      return { error }
    }
  }

  // Used for custom designs from Design Studio
  const addToCart = (designId, quantity = 1, size = 'M') => {
    return addItemToCart('design_id', designId, quantity, size)
  }

  // Used for ready-made products from Explore / Shop
  const addProductToCart = (productId, quantity = 1, size = 'M') => {
    return addItemToCart('product_id', productId, quantity, size)
  }

  const updateQuantity = async (cartItemId, quantity) => {
    if (quantity <= 0) return removeFromCart(cartItemId)

    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', cartItemId)
      .select()
      .single()

    if (data) await fetchCart()

    return { data, error }
  }

  const updateSize = async (cartItemId, size) => {
    const { data, error } = await supabase
      .from('cart_items')
      .update({ size })
      .eq('id', cartItemId)
      .select()
      .single()

    if (data) await fetchCart()

    return { data, error }
  }

  const removeFromCart = async (cartItemId) => {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', cartItemId)

    if (!error) await fetchCart()

    return { error }
  }

  const clearCart = async () => {
    if (!user) return

    await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id)

    await fetchCart()
  }

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const productOrDesign = item.user_designs || item.products

      if (!productOrDesign) return total

      const unitPrice =
        Number(productOrDesign.base_price || 0) +
        Number(productOrDesign.embroidery_price || 0) +
        Number(productOrDesign.customization_price || 0)

      return total + unitPrice * item.quantity
    }, 0)
  }

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0)
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