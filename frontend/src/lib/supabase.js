import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const TABLES = {
  PROFILES: 'profiles',
  DESIGNS: 'designs',
  CART_ITEMS: 'cart_items',
  ORDERS: 'orders',
  ORDER_ITEMS: 'order_items',
  EMBROIDERY_DESIGNS: 'embroidery_designs',
  KURTA_STYLES: 'kurta_styles',
  FABRICS: 'fabrics',
  ADDRESSES: 'addresses',
  NOTIFICATIONS: 'notifications',
  SETTINGS: 'settings'
}