import type { NutritionalValue } from "@/lib/db/schema";
import { UI_TRANSLATIONS, type Locale } from "@/lib/constants";

interface NegligibleAmountsProps {
  nutrition: NutritionalValue;
  locale: Locale;
}

const THRESHOLD = 0.5;

/** Prueft ob Fett, gesaettigte Fettsaeuren, Eiweiss und Salz alle vernachlaessigbar sind */
export function hasNegligibleAmounts(nutrition: NutritionalValue): boolean {
  return (
    Number(nutrition.fat) < THRESHOLD &&
    Number(nutrition.saturatedFat) < THRESHOLD &&
    Number(nutrition.protein) < THRESHOLD &&
    Number(nutrition.salt) < THRESHOLD
  );
}

export function NegligibleAmounts({
  nutrition,
  locale,
}: NegligibleAmountsProps) {
  if (!hasNegligibleAmounts(nutrition)) return null;

  return (
    <p
      className="text-xs mt-2 leading-relaxed"
      style={{ color: "var(--color-text-muted)" }}
    >
      {UI_TRANSLATIONS.negligible_amounts[locale]}
    </p>
  );
}
