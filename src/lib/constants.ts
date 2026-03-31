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

// Vollstaendige Weinzutaten gemaess EU-Verordnung 2019/934
export const COMMON_INGREDIENTS = [
  // Allgemein
  { key: "grapes", category: null, isAllergen: false },
  { key: "grape_must", category: null, isAllergen: false },
  { key: "concentrated_grape_must", category: null, isAllergen: false },
  { key: "rectified_concentrated_grape_must", category: null, isAllergen: false },
  { key: "sugar", category: null, isAllergen: false },
  { key: "alcohol", category: null, isAllergen: false },
  { key: "water", category: null, isAllergen: false },
  { key: "yeast", category: null, isAllergen: false },
  { key: "oak_chips", category: null, isAllergen: false },
  // Konservierungsstoffe & Antioxidationsmittel
  { key: "sulphur_dioxide", category: "preservative", isAllergen: true },
  { key: "sulphites", category: "preservative", isAllergen: true },
  { key: "potassium_metabisulphite", category: "preservative", isAllergen: true },
  { key: "potassium_sorbate", category: "preservative", isAllergen: false },
  { key: "sorbic_acid", category: "preservative", isAllergen: false },
  { key: "ascorbic_acid", category: "preservative", isAllergen: false },
  { key: "dimethyl_dicarbonate", category: "preservative", isAllergen: false },
  { key: "lysozyme", category: "preservative", isAllergen: true },
  // Saeureregulatoren
  { key: "tartaric_acid", category: "acid_regulator", isAllergen: false },
  { key: "citric_acid", category: "acid_regulator", isAllergen: false },
  { key: "malic_acid", category: "acid_regulator", isAllergen: false },
  { key: "lactic_acid", category: "acid_regulator", isAllergen: false },
  { key: "calcium_carbonate", category: "acid_regulator", isAllergen: false },
  { key: "potassium_bicarbonate", category: "acid_regulator", isAllergen: false },
  { key: "potassium_hydrogen_tartrate", category: "acid_regulator", isAllergen: false },
  { key: "calcium_tartrate", category: "acid_regulator", isAllergen: false },
  { key: "calcium_sulphate", category: "acid_regulator", isAllergen: false },
  // Stabilisatoren
  { key: "metatartaric_acid", category: "stabiliser", isAllergen: false },
  { key: "gum_arabic", category: "stabiliser", isAllergen: false },
  { key: "potassium_polyaspartate", category: "stabiliser", isAllergen: false },
  { key: "mannoproteins", category: "stabiliser", isAllergen: false },
  { key: "carboxymethylcellulose", category: "stabiliser", isAllergen: false },
  // Schoenungsmittel
  { key: "bentonite", category: "clarifying_agent", isAllergen: false },
  { key: "egg_protein", category: "clarifying_agent", isAllergen: true },
  { key: "milk_protein", category: "clarifying_agent", isAllergen: true },
  { key: "casein", category: "clarifying_agent", isAllergen: true },
  { key: "isinglass", category: "clarifying_agent", isAllergen: true },
  { key: "gelatine", category: "clarifying_agent", isAllergen: false },
  { key: "silica_sol", category: "clarifying_agent", isAllergen: false },
  { key: "pvpp", category: "clarifying_agent", isAllergen: false },
  { key: "activated_carbon", category: "clarifying_agent", isAllergen: false },
  { key: "chitosan", category: "clarifying_agent", isAllergen: false },
  { key: "pea_protein", category: "clarifying_agent", isAllergen: false },
  { key: "potato_protein", category: "clarifying_agent", isAllergen: false },
  { key: "yeast_protein", category: "clarifying_agent", isAllergen: false },
  // Gase
  { key: "carbon_dioxide", category: "gas", isAllergen: false },
  { key: "nitrogen", category: "gas", isAllergen: false },
  { key: "argon", category: "gas", isAllergen: false },
  // Enzyme
  { key: "pectinase", category: "enzyme", isAllergen: false },
] as const;

// Uebersetzungen fuer Zutaten-Keys (EU-Verordnung 2019/934)
export const INGREDIENT_TRANSLATIONS: Record<
  string,
  Record<string, string>
> = {
  // Allgemein
  grapes: { de: "Trauben", en: "Grapes" },
  grape_must: { de: "Traubenmost", en: "Grape must" },
  concentrated_grape_must: { de: "Konzentriertes Traubenmost", en: "Concentrated grape must" },
  rectified_concentrated_grape_must: { de: "Rektifiziertes konzentriertes Traubenmost", en: "Rectified concentrated grape must" },
  sugar: { de: "Saccharose (Zucker)", en: "Sucrose (sugar)" },
  alcohol: { de: "Alkohol", en: "Alcohol" },
  water: { de: "Wasser", en: "Water" },
  yeast: { de: "Hefe", en: "Yeast" },
  oak_chips: { de: "Eichenholzchips", en: "Oak chips" },
  // Konservierungsstoffe & Antioxidationsmittel
  sulphur_dioxide: { de: "Schwefeldioxid (E220)", en: "Sulphur dioxide (E220)" },
  sulphites: { de: "Sulfite", en: "Sulphites" },
  potassium_metabisulphite: { de: "Kaliummetabisulfit (E224)", en: "Potassium metabisulphite (E224)" },
  potassium_sorbate: { de: "Kaliumsorbat (E202)", en: "Potassium sorbate (E202)" },
  sorbic_acid: { de: "Sorbinsäure (E200)", en: "Sorbic acid (E200)" },
  ascorbic_acid: { de: "Ascorbinsäure (E300)", en: "Ascorbic acid (E300)" },
  dimethyl_dicarbonate: { de: "Dimethyldicarbonat (E242)", en: "Dimethyl dicarbonate (E242)" },
  lysozyme: { de: "Lysozym (aus Ei) (E1105)", en: "Lysozyme (from egg) (E1105)" },
  // Saeureregulatoren
  tartaric_acid: { de: "L(+)-Weinsäure (E334)", en: "L(+)-Tartaric acid (E334)" },
  citric_acid: { de: "Citronensäure (E330)", en: "Citric acid (E330)" },
  malic_acid: { de: "DL-Äpfelsäure (E296)", en: "DL-Malic acid (E296)" },
  lactic_acid: { de: "Milchsäure (E270)", en: "Lactic acid (E270)" },
  calcium_carbonate: { de: "Calciumcarbonat (E170)", en: "Calcium carbonate (E170)" },
  potassium_bicarbonate: { de: "Kaliumhydrogencarbonat (E501)", en: "Potassium bicarbonate (E501)" },
  potassium_hydrogen_tartrate: { de: "Kaliumhydrogentartrat (E336)", en: "Potassium hydrogen tartrate (E336)" },
  calcium_tartrate: { de: "Calciumtartrat (E354)", en: "Calcium tartrate (E354)" },
  calcium_sulphate: { de: "Calciumsulfat (E516)", en: "Calcium sulphate (E516)" },
  // Stabilisatoren
  metatartaric_acid: { de: "Metaweinsäure (E353)", en: "Metatartaric acid (E353)" },
  gum_arabic: { de: "Gummi Arabicum (E414)", en: "Gum arabic (E414)" },
  potassium_polyaspartate: { de: "Kaliumpolyaspartat (E456)", en: "Potassium polyaspartate (E456)" },
  mannoproteins: { de: "Mannoproteine (aus Hefe)", en: "Mannoproteins (from yeast)" },
  carboxymethylcellulose: { de: "Carboxymethylcellulose (E466)", en: "Carboxymethylcellulose (E466)" },
  // Schoenungsmittel
  bentonite: { de: "Bentonit", en: "Bentonite" },
  egg_protein: { de: "Eiweiß (Ei)", en: "Egg protein" },
  milk_protein: { de: "Milcheiweiß (Milch)", en: "Milk protein" },
  casein: { de: "Kasein (Milch)", en: "Casein (milk)" },
  isinglass: { de: "Hausenblase (Fisch)", en: "Isinglass (fish)" },
  gelatine: { de: "Gelatine", en: "Gelatine" },
  silica_sol: { de: "Kieselsol", en: "Silica sol" },
  pvpp: { de: "PVPP (Polyvinylpolypyrrolidon)", en: "PVPP (Polyvinylpolypyrrolidone)" },
  activated_carbon: { de: "Aktivkohle", en: "Activated carbon" },
  chitosan: { de: "Chitosan (aus Pilzen)", en: "Chitosan (from fungi)" },
  pea_protein: { de: "Erbsenprotein", en: "Pea protein" },
  potato_protein: { de: "Kartoffelprotein", en: "Potato protein" },
  yeast_protein: { de: "Hefeprotein", en: "Yeast protein" },
  // Gase
  carbon_dioxide: { de: "Kohlendioxid (E290)", en: "Carbon dioxide (E290)" },
  nitrogen: { de: "Stickstoff (E941)", en: "Nitrogen (E941)" },
  argon: { de: "Argon (E938)", en: "Argon (E938)" },
  // Enzyme
  pectinase: { de: "Pektinase", en: "Pectinase" },
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
