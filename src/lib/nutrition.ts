// Umrechnungsfaktor: 1 kcal = 4.184 kJ
const KCAL_TO_KJ = 4.184;

// Kalorische Faktoren (EU-Verordnung 1169/2011)
const ALCOHOL_KCAL_PER_G = 7;
const SUGAR_KCAL_PER_G = 4;
const ORGANIC_ACID_KCAL_PER_G = 3;
const GLYCERIN_KCAL_PER_G = 4.18; // Polyol
const ALCOHOL_DENSITY = 0.789; // g/ml

// Standardwert fuer Glycerin basierend auf Alkoholgehalt
// Typisch: ca. 5-10 g/l, korreliert mit Alkohol
export function defaultGlycerin(alcoholPercent: number): number {
  return Math.round(alcoholPercent * 0.65 * 10) / 10; // ca. 6.5 g/l bei 10% vol
}

// kcal zu kJ umrechnen
export function kcalToKj(kcal: number): number {
  return Math.round(kcal * KCAL_TO_KJ * 10) / 10;
}

// kJ zu kcal umrechnen
export function kjToKcal(kj: number): number {
  return Math.round((kj / KCAL_TO_KJ) * 10) / 10;
}

// Rundung nach EU-Vorgabe (Anhang V der Verordnung 1169/2011)
// Energie: auf ganze kJ/kcal runden
// Naehrstoffe: auf 0.1g runden, unter 0.5g als "< 0.5 g"
function roundNutrient(value: number): number {
  return Math.round(value * 10) / 10;
}

export interface OenologicalInput {
  alcoholPercent: number; // % vol
  residualSugarGL: number; // g/l
  totalAcidityGL: number; // g/l (als Weinsaeure)
  glycerinGL?: number; // g/l (optional, sonst Standardwert)
}

export interface NutritionalResult {
  energyKcal: number;
  energyKj: number;
  carbohydrates: number; // g/100ml
  sugars: number; // g/100ml
  fat: number;
  saturatedFat: number;
  protein: number;
  salt: number;
  // Exakte Werte (vor Rundung)
  exact: {
    energyKcal: number;
    energyKj: number;
    carbohydrates: number;
    sugars: number;
  };
}

/**
 * Berechnet Naehrwerte aus oenologischen Analysedaten.
 * Identisch zur Berechnung bei e-label.eu:
 * - Energie = Alkohol + Zucker + Saeure + Glycerin (in kcal)
 * - Kohlenhydrate = Restzucker + Glycerin (pro 100ml)
 * - Zucker = Restzucker (pro 100ml)
 */
export function calculateNutrition(
  input: OenologicalInput
): NutritionalResult {
  const { alcoholPercent, residualSugarGL, totalAcidityGL } = input;
  const glycerinGL =
    input.glycerinGL ?? defaultGlycerin(alcoholPercent);

  // Umrechnung g/l → g/100ml (durch 10)
  const sugarPer100ml = residualSugarGL / 10;
  const acidPer100ml = totalAcidityGL / 10;
  const glycerinPer100ml = glycerinGL / 10;
  const alcoholGPer100ml = alcoholPercent * ALCOHOL_DENSITY;

  // Energie-Berechnung (kcal pro 100ml)
  const alcoholKcal = alcoholGPer100ml * ALCOHOL_KCAL_PER_G;
  const sugarKcal = sugarPer100ml * SUGAR_KCAL_PER_G;
  const acidKcal = acidPer100ml * ORGANIC_ACID_KCAL_PER_G;
  const glycerinKcal = glycerinPer100ml * GLYCERIN_KCAL_PER_G;

  const totalKcalExact =
    alcoholKcal + sugarKcal + acidKcal + glycerinKcal;
  const totalKjExact = totalKcalExact * KCAL_TO_KJ;

  // Kohlenhydrate = Zucker + Glycerin (Polyol zaehlt zu Kohlenhydraten)
  const carbsExact = sugarPer100ml + glycerinPer100ml;

  return {
    energyKcal: Math.round(totalKcalExact),
    energyKj: Math.round(totalKjExact),
    carbohydrates: roundNutrient(carbsExact),
    sugars: roundNutrient(sugarPer100ml),
    fat: 0,
    saturatedFat: 0,
    protein: 0,
    salt: 0,
    exact: {
      energyKcal: totalKcalExact,
      energyKj: totalKjExact,
      carbohydrates: carbsExact,
      sugars: sugarPer100ml,
    },
  };
}
