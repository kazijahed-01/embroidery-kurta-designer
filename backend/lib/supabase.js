import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key'

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

export const TABLES = {
  PROFILES: 'profiles',
  PRODUCTS: 'products',
  EMBROIDERY_DESIGNS: 'embroidery_designs',
  USER_DESIGNS: 'user_designs',
  ORDERS: 'orders',
  ORDER_ITEMS: 'order_items',
  CART_ITEMS: 'cart_items',
  ADDRESSES: 'addresses',
  PROMO_CODES: 'promo_codes',
  SETTINGS: 'settings'
}