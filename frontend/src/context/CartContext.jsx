import { createContext, useContext, useState, useEffect, useCallback } from 'react'
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
          )
        `)
        .eq('user_id', user.id)

      if (data) setCartItems(data)
    } catch (error) {
      console.error('Error fetching cart:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  const addToCart = async (designId, quantity = 1, size = 'M') => {
    if (!user) return { error: { message: 'Please login first' } }

    try {
      const { data: existing } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('design_id', designId)
        .eq('size', size)
        .single()

      if (existing) {
        const { data, error } = await supabase
          .from('cart_items')
          .update({ quantity: existing.quantity + quantity })
          .eq('id', existing.id)
          .select()
          .single()
        if (data) fetchCart()
        return { data, error }
      } else {
        const { data, error } = await supabase
          .from('cart_items')
          .insert({ user_id: user.id, design_id: designId, quantity, size })
          .select()
          .single()
        if (data) fetchCart()
        return { data, error }
      }
    } catch (error) {
      return { error }
    }
  }

  const updateQuantity = async (cartItemId, quantity) => {
    if (quantity <= 0) return removeFromCart(cartItemId)
    
    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', cartItemId)
      .select()
      .single()
    
    if (data) fetchCart()
    return { data, error }
  }

  const updateSize = async (cartItemId, size) => {
    const { data, error } = await supabase
      .from('cart_items')
      .update({ size })
      .eq('id', cartItemId)
      .select()
      .single()

    if (data) fetchCart()
    return { data, error }
  }

  const removeFromCart = async (cartItemId) => {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', cartItemId)
    
    if (!error) fetchCart()
    return { error }
  }

  const clearCart = async () => {
    if (!user) return
    await supabase.from('cart_items').delete().eq('user_id', user.id)
    fetchCart()
  }

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const design = item.user_designs
      if (!design) return total
      const itemTotal = (design.base_price + design.embroidery_price + design.customization_price) * item.quantity
      return total + itemTotal
    }, 0)
  }

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0)
  }

  return (
    <CartContext.Provider value={{
      cartItems,
      loading,
      addToCart,
      updateQuantity,
      updateSize,
      removeFromCart,
      clearCart,
      getCartTotal,
      getCartCount,
      refreshCart: fetchCart
    }}>
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