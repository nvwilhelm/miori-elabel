import {
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  decimal,
  timestamp,
  unique,
  index,
} from "drizzle-orm/pg-core";

// Wein/Spirituosen-Stammdaten
export const products = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").unique().notNull(),
    name: text("name").notNull(),
    productType: text("product_type").notNull(), // 'wine' | 'aromatised_wine' | 'liqueur_wine' | 'spirit'
    wineType: text("wine_type"), // 'red' | 'white' | 'rose' | 'sparkling' | 'dessert'
    grapeVarieties: text("grape_varieties").array(),
    originCountry: text("origin_country").notNull(), // ISO 3166-1 alpha-2
    originRegion: text("origin_region"),
    appellation: text("appellation"), // IGT, DOC, DOCG, GG, VDP, etc.
    vintage: integer("vintage"),
    alcoholPercentage: decimal("alcohol_percentage", {
      precision: 4,
      scale: 1,
    }),
    volumeMl: integer("volume_ml").default(750),
    tasteProfile: text("taste_profile"), // 'dry' | 'semi-dry' | 'semi-sweet' | 'sweet'
    sugarClassification: text("sugar_classification"), // 'brut_nature' | 'extra_brut' | 'brut' | 'extra_dry' | 'dry' | 'demi_sec' | 'doux'
    producerName: text("producer_name"),
    lotNumber: text("lot_number"),
    ean: text("ean"),
    imageUrl: text("image_url"),
    isPublished: boolean("is_published").default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index("idx_products_slug").on(table.slug),
    index("idx_products_published").on(table.isPublished),
  ]
);

// Naehrwerte pro 100ml (1:1 mit products)
export const nutritionalValues = pgTable("nutritional_values", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id")
    .unique()
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  // Oenologische Rohdaten (fuer automatische Berechnung)
  residualSugar: decimal("residual_sugar", { precision: 6, scale: 1 }), // g/l
  totalAcidity: decimal("total_acidity", { precision: 5, scale: 1 }), // g/l (Weinsaeure C4H6O6)
  glycerin: decimal("glycerin", { precision: 5, scale: 1 }), // g/l (Standardwert oder manuell)
  // Berechnete/eingegebene Naehrwerte pro 100ml
  energyKj: decimal("energy_kj", { precision: 7, scale: 1 }).notNull(),
  energyKcal: decimal("energy_kcal", { precision: 6, scale: 1 }).notNull(),
  fat: decimal("fat", { precision: 5, scale: 2 }).default("0"),
  saturatedFat: decimal("saturated_fat", { precision: 5, scale: 2 }).default(
    "0"
  ),
  carbohydrates: decimal("carbohydrates", {
    precision: 5,
    scale: 2,
  }).notNull(),
  sugars: decimal("sugars", { precision: 5, scale: 2 }).notNull(),
  protein: decimal("protein", { precision: 5, scale: 2 }).default("0"),
  salt: decimal("salt", { precision: 5, scale: 3 }).default("0"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Zutatenliste (1:N mit products)
export const ingredients = pgTable(
  "ingredients",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    nameKey: text("name_key").notNull(), // Uebersetzungs-Key, z.B. 'grapes', 'sulphur_dioxide'
    functionalCategory: text("functional_category"), // 'preservative', 'stabiliser', etc.
    isAllergen: boolean("is_allergen").default(false),
    isBio: boolean("is_bio").default(false),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => [
    unique("uq_ingredient").on(table.productId, table.nameKey),
    index("idx_ingredients_product").on(table.productId, table.sortOrder),
  ]
);

// Uebersetzungen fuer UI-Strings und Zutaten
export const translations = pgTable(
  "translations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    key: text("key").notNull(),
    locale: text("locale").notNull(), // 'de', 'en', 'fr', 'it', 'es'
    value: text("value").notNull(),
  },
  (table) => [unique("uq_translation").on(table.key, table.locale)]
);

// Recycling-Informationen (1:N mit products)
export const recyclingMaterials = pgTable("recycling_materials", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  component: text("component").notNull(), // 'bottle' | 'cap' | 'label' | 'cork' | 'capsule' | 'box' | 'other'
  material: text("material").notNull(), // 'glass' | 'aluminium' | 'plastic_pet' | 'plastic_pp' | 'paper' | 'cork' | 'tinplate' | 'cardboard'
  sortOrder: integer("sort_order").notNull().default(0),
});

// QR-Code Metadaten (1:1 mit products)
export const qrCodes = pgTable("qr_codes", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id")
    .unique()
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  targetUrl: text("target_url").notNull(),
  svgData: text("svg_data"),
  generatedAt: timestamp("generated_at", { withTimezone: true }).defaultNow(),
});

// TypeScript-Typen aus dem Schema ableiten
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type NutritionalValue = typeof nutritionalValues.$inferSelect;
export type NewNutritionalValue = typeof nutritionalValues.$inferInsert;
export type Ingredient = typeof ingredients.$inferSelect;
export type NewIngredient = typeof ingredients.$inferInsert;
export type Translation = typeof translations.$inferSelect;
export type RecyclingMaterial = typeof recyclingMaterials.$inferSelect;
export type NewRecyclingMaterial = typeof recyclingMaterials.$inferInsert;
export type QrCode = typeof qrCodes.$inferSelect;
