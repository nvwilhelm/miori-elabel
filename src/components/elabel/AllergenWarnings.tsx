import type { Ingredient } from "@/lib/db/schema";
import {
  INGREDIENT_TRANSLATIONS,
  UI_TRANSLATIONS,
  type Locale,
} from "@/lib/constants";

interface AllergenWarningsProps {
  ingredients: Ingredient[];
  locale: Locale;
}

export function AllergenWarnings({
  ingredients,
  locale,
}: AllergenWarningsProps) {
  const allergens = ingredients.filter((i) => i.isAllergen);
  if (allergens.length === 0) return null;

  return (
    <section className="mb-3 px-3 py-2 bg-amber-50 border border-amber-200 rounded text-xs">
      <div className="flex items-center gap-1.5 font-semibold text-amber-800 mb-0.5">
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          />
        </svg>
        {UI_TRANSLATIONS.allergens[locale]}
      </div>
      <p>
        {allergens
          .map(
            (a) =>
              INGREDIENT_TRANSLATIONS[a.nameKey]?.[locale] ?? a.nameKey
          )
          .join(", ")}
      </p>
    </section>
  );
}
