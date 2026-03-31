import type { Ingredient } from "@/lib/db/schema";
import {
  INGREDIENT_TRANSLATIONS,
  UI_TRANSLATIONS,
  type Locale,
} from "@/lib/constants";

interface IngredientListProps {
  ingredients: Ingredient[];
  locale: Locale;
}

function BioBadge({ locale }: { locale: Locale }) {
  return (
    <span
      className="inline-flex items-center ml-1 px-1.5 py-0.5 text-[10px] font-semibold leading-none rounded-sm"
      style={{
        backgroundColor: "#e6f4ea",
        color: "#1e7e34",
        verticalAlign: "super",
      }}
    >
      {UI_TRANSLATIONS.bio_ingredient[locale]}
    </span>
  );
}

export function IngredientList({
  ingredients,
  locale,
}: IngredientListProps) {
  if (ingredients.length === 0) return null;

  return (
    <section className="mb-3">
      <h2 className="text-sm font-semibold mb-1">
        {UI_TRANSLATIONS.ingredients[locale]}
      </h2>
      <p className="text-xs leading-relaxed">
        {ingredients
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((ingredient, index) => {
            const name =
              INGREDIENT_TRANSLATIONS[ingredient.nameKey]?.[locale] ??
              ingredient.nameKey;
            const isLast = index === ingredients.length - 1;
            const separator = isLast ? "" : ", ";

            if (ingredient.isAllergen) {
              return (
                <span key={ingredient.id}>
                  <strong className="font-bold underline">{name}</strong>
                  {ingredient.isBio && <BioBadge locale={locale} />}
                  {separator}
                </span>
              );
            }

            return (
              <span key={ingredient.id}>
                {name}
                {ingredient.isBio && <BioBadge locale={locale} />}
                {separator}
              </span>
            );
          })}
      </p>
    </section>
  );
}
