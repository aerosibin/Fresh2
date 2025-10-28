-- Create products table with tags
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  category TEXT NOT NULL,
  image TEXT NOT NULL,
  unit TEXT NOT NULL,
  in_stock BOOLEAN NOT NULL DEFAULT true,
  food_type TEXT NOT NULL CHECK (food_type IN ('veg', 'non-veg', 'dairy')),
  tags TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create purchase history table
CREATE TABLE public.purchase_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  purchase_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_history ENABLE ROW LEVEL SECURITY;

-- Products are viewable by everyone
CREATE POLICY "Products are viewable by everyone"
ON public.products
FOR SELECT
USING (true);

-- Purchase history policies
CREATE POLICY "Users can view their own purchase history"
ON public.purchase_history
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own purchase history"
ON public.purchase_history
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_products_tags ON public.products USING GIN(tags);
CREATE INDEX idx_purchase_history_user_product ON public.purchase_history(user_id, product_id);
CREATE INDEX idx_purchase_history_date ON public.purchase_history(purchase_date DESC);

-- Insert sample products with mood-based tags
INSERT INTO public.products (name, price, category, image, unit, in_stock, food_type, tags) VALUES
  ('Organic Bananas', 50, 'Fruits', '🍌', 'per bunch', true, 'veg', ARRAY['healthy', 'fresh-produce', 'quick-prep']),
  ('Fresh Milk', 65, 'Dairy', '🥛', '1L', true, 'dairy', ARRAY['dairy', 'healthy']),
  ('Whole Wheat Bread', 45, 'Bakery', '🍞', 'loaf', true, 'veg', ARRAY['quick-prep', 'pantry']),
  ('Free Range Eggs', 130, 'Dairy', '🥚', 'dozen', true, 'non-veg', ARRAY['healthy', 'fresh-produce']),
  ('Roma Tomatoes', 40, 'Vegetables', '🍅', 'per kg', true, 'veg', ARRAY['healthy', 'fresh-produce', 'organic']),
  ('Avocados', 250, 'Fruits', '🥑', '4 pack', true, 'veg', ARRAY['healthy', 'fresh-produce', 'organic']),
  ('Greek Yogurt', 120, 'Dairy', '🥤', '500g', true, 'dairy', ARRAY['healthy', 'dairy', 'quick-prep']),
  ('Fresh Spinach', 25, 'Vegetables', '🥬', 'bunch', true, 'veg', ARRAY['healthy', 'fresh-produce', 'organic', 'vegan']),
  ('Frozen Pizza', 180, 'Frozen', '🍕', 'pack', true, 'veg', ARRAY['lazy-meal', 'frozen', 'microwaveable', 'quick-prep']),
  ('Instant Noodles', 35, 'Pantry', '🍜', 'pack', true, 'veg', ARRAY['lazy-meal', 'quick-prep', 'pantry']),
  ('Potato Chips', 60, 'Snacks', '🥔', 'bag', true, 'veg', ARRAY['snack', 'quick-prep', 'party-size']),
  ('Energy Drink', 80, 'Beverages', '⚡', 'can', true, 'veg', ARRAY['energy-drink', 'quick-prep', 'coffee']),
  ('Coffee Beans', 350, 'Beverages', '☕', '500g', true, 'veg', ARRAY['coffee', 'pantry']),
  ('Party Cake', 450, 'Bakery', '🎂', 'whole', true, 'veg', ARRAY['festive-food', 'party-size', 'sweets', 'bakery']),
  ('Ice Cream', 220, 'Frozen', '🍦', 'tub', true, 'dairy', ARRAY['sweets', 'frozen', 'snack']),
  ('Soda Pack', 120, 'Beverages', '🥤', '6 pack', true, 'veg', ARRAY['drinks', 'party-size', 'festive-food']),
  ('Chocolate Box', 280, 'Snacks', '🍫', 'box', true, 'veg', ARRAY['sweets', 'snack', 'festive-food']),
  ('Ready-to-Eat Meal', 150, 'Frozen', '🍱', 'pack', true, 'veg', ARRAY['lazy-meal', 'frozen', 'microwaveable']),
  ('Granola Bars', 95, 'Snacks', '🍪', 'pack of 6', true, 'veg', ARRAY['snack', 'healthy', 'quick-prep']),
  ('Organic Salad Mix', 85, 'Vegetables', '🥗', '250g', true, 'veg', ARRAY['healthy', 'fresh-produce', 'organic', 'vegan', 'quick-prep']);