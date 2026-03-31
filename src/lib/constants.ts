// Unterstuetzte Sprachen
export const LOCALES = ["de", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "de";

// Weintypen
export const WINE_TYPES = {
  red: { de: "Rotwein", en: "Red Wine" },
  white: { de: "Weißwein", en: "White Wine" },
  rose: { de: "Roséwein", en: "Rosé Wine" },
  sparkling: { de: "Schaumwein", en: "Sparkling Wine" },
  dessert: { de: "Dessertwein", en: "Dessert Wine" },
} as const;

// Produkttypen (wie bei e-label.eu)
export const PRODUCT_TYPES = {
  wine: { de: "Wein", en: "Wine", hint: "z.B. Weißwein, Rotwein oder Schaumwein" },
  aromatised_wine: { de: "Aromatisierter Wein", en: "Aromatised Wine", hint: "z.B. Glühwein oder Glogg" },
  liqueur_wine: { de: "Likörwein", en: "Liqueur Wine", hint: "z.B. Portwein oder Sherry" },
  spirit: { de: "Spirituose", en: "Spirit", hint: "Wodka, Whiskey, ..." },
} as const;

// Geschmacksprofile
export const TASTE_PROFILES = {
  dry: { de: "trocken", en: "dry" },
  "semi-dry": { de: "halbtrocken", en: "semi-dry" },
  "semi-sweet": { de: "lieblich", en: "semi-sweet" },
  sweet: { de: "süß", en: "sweet" },
} as const;

// Klassifizierung nach Zuckergehalt (fuer Schaumwein etc.)
export const SUGAR_CLASSIFICATIONS = {
  brut_nature: { de: "Brut Nature", en: "Brut Nature" },
  extra_brut: { de: "Extra Brut", en: "Extra Brut" },
  brut: { de: "Brut", en: "Brut" },
  extra_dry: { de: "Extra Trocken", en: "Extra Dry" },
  dry: { de: "Trocken", en: "Dry" },
  demi_sec: { de: "Halbtrocken", en: "Demi-Sec" },
  doux: { de: "Mild/Süß", en: "Doux/Sweet" },
} as const;

// Recycling-Komponenten und Materialien
export const RECYCLING_COMPONENTS = {
  bottle: { de: "Flasche", en: "Bottle" },
  cap: { de: "Verschluss", en: "Cap" },
  cork: { de: "Korken", en: "Cork" },
  capsule: { de: "Kapsel", en: "Capsule" },
  label: { de: "Etikett", en: "Label" },
  box: { de: "Karton/Verpackung", en: "Box/Packaging" },
  other: { de: "Sonstiges", en: "Other" },
} as const;

export const RECYCLING_MATERIALS = {
  glass: { de: "Glas", en: "Glass", icon: "GL" },
  aluminium: { de: "Aluminium", en: "Aluminium", icon: "ALU" },
  plastic_pet: { de: "Kunststoff (PET)", en: "Plastic (PET)", icon: "PET 1" },
  plastic_pp: { de: "Kunststoff (PP)", en: "Plastic (PP)", icon: "PP 5" },
  tinplate: { de: "Weißblech", en: "Tinplate", icon: "FE" },
  paper: { de: "Papier", en: "Paper", icon: "PAP" },
  cardboard: { de: "Karton", en: "Cardboard", icon: "PAP" },
  cork_natural: { de: "Naturkork", en: "Natural Cork", icon: "FOR" },
  cork_synthetic: { de: "Kunststoffkork", en: "Synthetic Cork", icon: "PP 5" },
  wood: { de: "Holz", en: "Wood", icon: "FOR" },
} as const;

// Haeufige Zutaten fuer Wein (mit Uebersetzungs-Keys)
export const COMMON_INGREDIENTS = [
  { key: "grapes", category: null, isAllergen: false },
  { key: "sugar", category: null, isAllergen: false },
  { key: "sulphur_dioxide", category: "preservative", isAllergen: true },
  { key: "sulphites", category: "preservative", isAllergen: true },
  { key: "potassium_sorbate", category: "preservative", isAllergen: false },
  { key: "tartaric_acid", category: "acid_regulator", isAllergen: false },
  { key: "citric_acid", category: "acid_regulator", isAllergen: false },
  { key: "ascorbic_acid", category: "antioxidant", isAllergen: false },
  { key: "calcium_carbonate", category: "acid_regulator", isAllergen: false },
  { key: "bentonite", category: "clarifying_agent", isAllergen: false },
  { key: "egg_protein", category: "clarifying_agent", isAllergen: true },
  { key: "milk_protein", category: "clarifying_agent", isAllergen: true },
  { key: "casein", category: "clarifying_agent", isAllergen: true },
  { key: "oak_chips", category: null, isAllergen: false },
  { key: "yeast", category: null, isAllergen: false },
  { key: "carbon_dioxide", category: "gas", isAllergen: false },
  {
    key: "concentrated_grape_must",
    category: null,
    isAllergen: false,
  },
  {
    key: "rectified_concentrated_grape_must",
    category: null,
    isAllergen: false,
  },
] as const;

// Uebersetzungen fuer Zutaten-Keys
export const INGREDIENT_TRANSLATIONS: Record<
  string,
  Record<string, string>
> = {
  grapes: { de: "Trauben", en: "Grapes" },
  sugar: { de: "Zucker", en: "Sugar" },
  sulphur_dioxide: { de: "Schwefeldioxid", en: "Sulphur dioxide" },
  sulphites: { de: "Sulfite", en: "Sulphites" },
  potassium_sorbate: { de: "Kaliumsorbat", en: "Potassium sorbate" },
  tartaric_acid: { de: "Weinsäure", en: "Tartaric acid" },
  citric_acid: { de: "Citronensäure", en: "Citric acid" },
  ascorbic_acid: { de: "Ascorbinsäure", en: "Ascorbic acid" },
  calcium_carbonate: { de: "Calciumcarbonat", en: "Calcium carbonate" },
  bentonite: { de: "Bentonit", en: "Bentonite" },
  egg_protein: { de: "Eiweiß (Ei)", en: "Egg protein" },
  milk_protein: { de: "Milcheiweiß", en: "Milk protein" },
  casein: { de: "Kasein (Milch)", en: "Casein (milk)" },
  oak_chips: { de: "Eichenholzchips", en: "Oak chips" },
  yeast: { de: "Hefe", en: "Yeast" },
  carbon_dioxide: { de: "Kohlendioxid", en: "Carbon dioxide" },
  concentrated_grape_must: {
    de: "Konzentriertes Traubenmost",
    en: "Concentrated grape must",
  },
  rectified_concentrated_grape_must: {
    de: "Rektifiziertes konzentriertes Traubenmost",
    en: "Rectified concentrated grape must",
  },
};

// Laender (haeufige Weinlaender)
export const COUNTRIES: Record<string, { de: string; en: string }> = {
  DE: { de: "Deutschland", en: "Germany" },
  IT: { de: "Italien", en: "Italy" },
  FR: { de: "Frankreich", en: "France" },
  ES: { de: "Spanien", en: "Spain" },
  PT: { de: "Portugal", en: "Portugal" },
  AT: { de: "Österreich", en: "Austria" },
  GR: { de: "Griechenland", en: "Greece" },
  CL: { de: "Chile", en: "Chile" },
  AR: { de: "Argentinien", en: "Argentina" },
  ZA: { de: "Südafrika", en: "South Africa" },
  AU: { de: "Australien", en: "Australia" },
  NZ: { de: "Neuseeland", en: "New Zealand" },
  US: { de: "USA", en: "USA" },
};

// UI-Uebersetzungen
export const UI_TRANSLATIONS: Record<
  string,
  Record<string, string>
> = {
  nutritional_info: {
    de: "Nährwertinformation",
    en: "Nutritional Information",
  },
  per_100ml: { de: "pro 100 ml", en: "per 100 ml" },
  energy: { de: "Energie", en: "Energy" },
  fat: { de: "Fett", en: "Fat" },
  saturated_fat: {
    de: "davon gesättigte Fettsäuren",
    en: "of which saturated fatty acids",
  },
  carbohydrates: { de: "Kohlenhydrate", en: "Carbohydrates" },
  sugars: { de: "davon Zucker", en: "of which sugars" },
  protein: { de: "Eiweiß", en: "Protein" },
  salt: { de: "Salz", en: "Salt" },
  ingredients: { de: "Zutaten", en: "Ingredients" },
  allergens: { de: "Allergene", en: "Allergens" },
  allergen_notice: {
    de: "Enthält Sulfite",
    en: "Contains sulphites",
  },
  origin: { de: "Herkunft", en: "Origin" },
  alcohol_content: { de: "Alkoholgehalt", en: "Alcohol content" },
  volume: { de: "Inhalt", en: "Volume" },
  vintage: { de: "Jahrgang", en: "Vintage" },
  grape_variety: { de: "Rebsorte", en: "Grape variety" },
  taste: { de: "Geschmack", en: "Taste" },
  producer: { de: "Erzeuger", en: "Producer" },
  recycling: { de: "Recycling", en: "Recycling" },
  packaging_materials: {
    de: "Verpackungsmaterialien",
    en: "Packaging Materials",
  },
  bio_ingredient: { de: "Bio", en: "Organic" },
  negligible_amounts: {
    de: "Enthält geringfügige Mengen an Fett, gesättigten Fettsäuren, Eiweiß und Salz.",
    en: "Contains negligible amounts of fat, saturated fatty acids, protein and salt.",
  },
  sugar_classification: {
    de: "Klassifizierung",
    en: "Classification",
  },
  privacy_notice: {
    de: "Diese Seite erhebt keine personenbezogenen Daten. Es werden keine Cookies verwendet.",
    en: "This page does not collect personal data. No cookies are used.",
  },
  legal_basis: {
    de: "Bereitgestellt gemäß EU-Verordnung 2021/2117",
    en: "Provided in accordance with EU Regulation 2021/2117",
  },
};
