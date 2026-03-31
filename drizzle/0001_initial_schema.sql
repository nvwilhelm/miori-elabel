-- miori E-Label: Initiales Datenbankschema
-- EU-Verordnung 2021/2117 konforme E-Labels fuer Wein und Spirituosen

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  product_type TEXT NOT NULL,
  wine_type TEXT,
  grape_varieties TEXT[],
  origin_country TEXT NOT NULL,
  origin_region TEXT,
  appellation TEXT,
  vintage INTEGER,
  alcohol_percentage DECIMAL(4,1),
  volume_ml INTEGER DEFAULT 750,
  taste_profile TEXT,
  producer_name TEXT,
  lot_number TEXT,
  ean TEXT,
  image_url TEXT,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_published ON products(is_published) WHERE is_published = true;

CREATE TABLE IF NOT EXISTS nutritional_values (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID UNIQUE NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  energy_kj DECIMAL(7,1) NOT NULL,
  energy_kcal DECIMAL(6,1) NOT NULL,
  fat DECIMAL(5,2) DEFAULT 0,
  saturated_fat DECIMAL(5,2) DEFAULT 0,
  carbohydrates DECIMAL(5,2) NOT NULL,
  sugars DECIMAL(5,2) NOT NULL,
  protein DECIMAL(5,2) DEFAULT 0,
  salt DECIMAL(5,3) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name_key TEXT NOT NULL,
  functional_category TEXT,
  is_allergen BOOLEAN DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  UNIQUE(product_id, name_key)
);

CREATE INDEX IF NOT EXISTS idx_ingredients_product ON ingredients(product_id, sort_order);

CREATE TABLE IF NOT EXISTS translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL,
  locale TEXT NOT NULL,
  value TEXT NOT NULL,
  UNIQUE(key, locale)
);

CREATE TABLE IF NOT EXISTS qr_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID UNIQUE NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  target_url TEXT NOT NULL,
  svg_data TEXT,
  generated_at TIMESTAMPTZ DEFAULT now()
);
