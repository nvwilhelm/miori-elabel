-- miori E-Label: Erweiterte Felder (e-label.eu kompatibel)
-- Neue Felder: Oenologische Daten, Bio-Zutaten, Recycling, Produktart-Untertypen

-- Products: Klassifizierung nach Zuckergehalt
ALTER TABLE products ADD COLUMN IF NOT EXISTS sugar_classification TEXT;

-- Naehrwerte: Oenologische Rohdaten fuer automatische Berechnung
ALTER TABLE nutritional_values ADD COLUMN IF NOT EXISTS residual_sugar DECIMAL(6,1);
ALTER TABLE nutritional_values ADD COLUMN IF NOT EXISTS total_acidity DECIMAL(5,1);
ALTER TABLE nutritional_values ADD COLUMN IF NOT EXISTS glycerin DECIMAL(5,1);

-- Zutaten: Bio-Kennzeichnung
ALTER TABLE ingredients ADD COLUMN IF NOT EXISTS is_bio BOOLEAN DEFAULT false;

-- Recycling-Informationen
CREATE TABLE IF NOT EXISTS recycling_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  component TEXT NOT NULL,
  material TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);
