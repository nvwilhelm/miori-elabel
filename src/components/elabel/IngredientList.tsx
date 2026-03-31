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

export function IngredientList({
  ingredients,
  locale,
}: IngredientListProps) {
  if (ingredients.length === 0) return null;

  return (
    <section className="mb-6">
      <h2 className="text-lg font-semibold mb-3">
        {UI_TRANSLATIONS.ingredients[locale]}
      </h2>
      <p className="text-sm leading-relaxed">
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
                  {separator}
                </span>
              );
            }

            return (
              <span key={ingredient.id}>
                {name}
                {separator}
              </span>
            );
          })}
      </p>
    </section>
  );
}
