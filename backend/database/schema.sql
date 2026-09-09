DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
-- Thread & Bloom Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL, 
  phone TEXT,
  avatar_url TEXT,
  bio TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'vip', 'admin')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'new', 'banned')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products table (Kurta catalog)
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  style TEXT NOT NULL CHECK (style IN ('Straight Kurta', 'Anarkali', 'A-Line', 'Short Kurti', 'Long Kurta', 'Western Kurti')),
  fabric TEXT NOT NULL CHECK (fabric IN ('Cotton', 'Silk', 'Linen', 'Chanderi', 'Rayon')),
  base_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  embroidery_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  customization_price DECIMAL(10,2) DEFAULT 0,
  colors TEXT[] DEFAULT '{}',
  sizes TEXT[] DEFAULT '{"XS","S","M","L","XL","XXL","3XL"}',
  images TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived')),
  is_featured BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Embroidery designs table
CREATE TABLE embroidery_designs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('Nature', 'Traditional', 'Modern', 'Heritage', 'Contemporary', 'Premium', 'Spiritual')),
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  positions TEXT[] NOT NULL DEFAULT '{}' CHECK (positions <@ ARRAY['neck','chest','sleeves','front','back','bottom']),
  tags TEXT[] DEFAULT '{}',
  image_url TEXT,
  preview_url TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived')),
  usage_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User custom designs table
CREATE TABLE user_designs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  kurta_style TEXT NOT NULL CHECK (kurta_style IN ('Straight Kurta', 'Anarkali', 'A-Line', 'Short Kurti', 'Long Kurta', 'Western Kurti')),
  fabric TEXT NOT NULL CHECK (fabric IN ('Cotton', 'Silk', 'Linen', 'Chanderi', 'Rayon')),
  color TEXT NOT NULL,
  embroidery_design TEXT NOT NULL,
  embroidery_position TEXT NOT NULL CHECK (embroidery_position IN ('neck', 'chest', 'sleeves', 'front', 'back', 'bottom')),
  embroidery_color TEXT DEFAULT '#ec4899',
  customizations JSONB DEFAULT '{"scale":1,"rotation":0,"x":0,"y":0}',
  size TEXT DEFAULT 'M' CHECK (size IN ('XS','S','M','L','XL','XXL','3XL')),
  base_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  embroidery_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  customization_price DECIMAL(10,2) DEFAULT 100,
  total_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  preview_image_url TEXT,
  is_saved BOOLEAN DEFAULT FALSE,
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE SEQUENCE IF NOT EXISTS order_seq START 1;
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  order_number TEXT UNIQUE NOT NULL DEFAULT 'ORD-' || to_char(NOW(), 'YYYY') || '-' || lpad(nextval('order_seq')::TEXT, 4, '0'),
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  shipping DECIMAL(10,2) NOT NULL DEFAULT 0,
  discount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'placed' CHECK (status IN ('placed', 'confirmed', 'designing', 'embroidery', 'quality', 'shipped', 'delivered', 'cancelled')),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cod', 'upi', 'card', 'wallet')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  shipping_address JSONB NOT NULL,
  billing_address JSONB,
  promo_code TEXT,
  tracking_number TEXT,
  notes TEXT,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create sequence for order numbers
CREATE SEQUENCE IF NOT EXISTS order_seq;

-- Order items table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  design_id UUID REFERENCES user_designs(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  size TEXT NOT NULL CHECK (size IN ('XS','S','M','L','XL','XXL','3XL')),
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  customizations JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cart items table
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  design_id UUID REFERENCES user_designs(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  size TEXT NOT NULL CHECK (size IN ('XS','S','M','L','XL','XXL','3XL')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT cart_item_product_or_design CHECK (
    (product_id IS NOT NULL AND design_id IS NULL) OR
    (product_id IS NULL AND design_id IS NOT NULL)
  )
);

-- Addresses table
CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  country TEXT DEFAULT 'India',
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Promo codes table
CREATE TABLE promo_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10,2) NOT NULL,
  min_order_amount DECIMAL(10,2) DEFAULT 0,
  max_discount DECIMAL(10,2),
  usage_limit INTEGER,
  usage_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  starts_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Settings table
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, key)
);

-- Row Level Security Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE embroidery_designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update all profiles" ON profiles FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Products policies
CREATE POLICY "Anyone can view active products" ON products FOR SELECT USING (status = 'active');
CREATE POLICY "Admins can manage products" ON products FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Embroidery designs policies
CREATE POLICY "Anyone can view active designs" ON embroidery_designs FOR SELECT USING (status = 'active');
CREATE POLICY "Admins can manage designs" ON embroidery_designs FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- User designs policies
CREATE POLICY "Users can view own designs" ON user_designs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create designs" ON user_designs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own designs" ON user_designs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own designs" ON user_designs FOR DELETE USING (auth.uid() = user_id);

-- Orders policies
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users can create orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Admins can view all orders" ON orders FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update orders" ON orders FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Order items policies
CREATE POLICY "Users can view own order items" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE id = order_id AND (user_id = auth.uid() OR user_id IS NULL))
);
CREATE POLICY "Admins can view all order items" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Cart items policies
CREATE POLICY "Users can manage own cart" ON cart_items FOR ALL USING (auth.uid() = user_id);

-- Addresses policies
CREATE POLICY "Users can manage own addresses" ON addresses FOR ALL USING (auth.uid() = user_id);

-- Settings policies
CREATE POLICY "Users can manage own settings" ON settings FOR ALL USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_style ON products(style);
CREATE INDEX idx_products_fabric ON products(fabric);
CREATE INDEX idx_embroidery_status ON embroidery_designs(status);
CREATE INDEX idx_embroidery_category ON embroidery_designs(category);
CREATE INDEX idx_user_designs_user_id ON user_designs(user_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX idx_addresses_user_id ON addresses(user_id);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_embroidery_updated_at BEFORE UPDATE ON embroidery_designs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_designs_updated_at BEFORE UPDATE ON user_designs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_addresses_updated_at BEFORE UPDATE ON addresses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default data
INSERT INTO embroidery_designs (name, category, price, positions, tags, status) VALUES
('Floral Garden', 'Nature', 250, ARRAY['neck','chest','sleeves','front','back','bottom'], ARRAY['floral','nature','popular'], 'active'),
('Royal Paisley', 'Traditional', 300, ARRAY['neck','chest','front','back'], ARRAY['traditional','paisley','royal'], 'active'),
('Modern Geometry', 'Modern', 200, ARRAY['chest','sleeves','front','bottom'], ARRAY['geometric','modern','minimal'], 'active'),
('Heritage Traditional', 'Heritage', 350, ARRAY['neck','chest','front','back','sleeves'], ARRAY['heritage','traditional','premium'], 'active'),
('Minimal Line Art', 'Contemporary', 150, ARRAY['neck','chest','sleeves','bottom'], ARRAY['minimal','line','contemporary'], 'active'),
('Bridal Splendor', 'Premium', 500, ARRAY['neck','chest','front','back','sleeves','bottom'], ARRAY['bridal','premium','luxury'], 'active'),
('Peacock Majesty', 'Nature', 400, ARRAY['back','front','chest'], ARRAY['peacock','nature','premium'], 'draft'),
('Butterfly Dreams', 'Nature', 300, ARRAY['sleeves','chest','bottom'], ARRAY['butterfly','nature','playful'], 'draft'),
('Mandala Magic', 'Spiritual', 350, ARRAY['back','front','chest'], ARRAY['mandala','spiritual','intricate'], 'archived'),
('Zari Gold Work', 'Premium', 450, ARRAY['neck','chest','sleeves','front','back'], ARRAY['zari','gold','traditional'], 'active');

INSERT INTO products (name, style, fabric, base_price, embroidery_price, colors, status, is_featured) VALUES
('Floral Dream Anarkali', 'Anarkali', 'Silk', 1049, 250, ARRAY['Pink', 'Maroon', 'Teal'], 'active', true),
('Royal Paisley Straight', 'Straight Kurta', 'Chanderi', 1199, 300, ARRAY['Maroon', 'Black', 'Gold'], 'active', true),
('Minimalist Chic Western', 'Western Kurti', 'Cotton', 749, 150, ARRAY['White', 'Black', 'Peach'], 'active', true),
('Bridal Bloom Long Kurta', 'Long Kurta', 'Silk', 1699, 500, ARRAY['Gold', 'Maroon', 'Pink'], 'active', true),
('Cotton Comfort Straight', 'Straight Kurta', 'Cotton', 549, 250, ARRAY['Green', 'Blue', 'Yellow'], 'active', false),
('Silk Elegance A-Line', 'A-Line', 'Silk', 1099, 200, ARRAY['Purple', 'Teal', 'Pink'], 'active', true),
('Linen Breeze Short', 'Short Kurti', 'Linen', 749, 150, ARRAY['Yellow', 'Orange', 'White'], 'active', false),
('Chanderi Grace Long', 'Long Kurta', 'Chanderi', 849, 350, ARRAY['Pink', 'Maroon', 'Gold'], 'active', true);