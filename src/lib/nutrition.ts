// Umrechnungsfaktor: 1 kcal = 4.184 kJ
const KCAL_TO_KJ = 4.184;

// kcal zu kJ umrechnen
export function kcalToKj(kcal: number): number {
  return Math.round(kcal * KCAL_TO_KJ * 10) / 10;
}

// kJ zu kcal umrechnen
export function kjToKcal(kj: number): number {
  return Math.round((kj / KCAL_TO_KJ) * 10) / 10;
}

// Energie aus Alkoholgehalt schaetzen (fuer Wein typisch)
// Alkohol: 7 kcal/g, Dichte: 0.789 g/ml
export function estimateEnergyFromAlcohol(
  alcoholPercent: number,
  sugarsG: number = 0
): { kcal: number; kj: number } {
  const alcoholGPer100ml = alcoholPercent * 0.789;
  const alcoholKcal = alcoholGPer100ml * 7;
  const sugarKcal = sugarsG * 4;
  const totalKcal = Math.round(alcoholKcal + sugarKcal);
  return {
    kcal: totalKcal,
    kj: kcalToKj(totalKcal),
  };
}
