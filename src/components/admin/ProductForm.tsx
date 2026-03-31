"use client";

import { useActionState } from "react";
import {
  WINE_TYPES,
  PRODUCT_TYPES,
  TASTE_PROFILES,
  COUNTRIES,
  COMMON_INGREDIENTS,
  INGREDIENT_TRANSLATIONS,
} from "@/lib/constants";
import { kcalToKj, kjToKcal, estimateEnergyFromAlcohol } from "@/lib/nutrition";
import type {
  Product,
  NutritionalValue,
  Ingredient,
} from "@/lib/db/schema";
import type { ProductFormState } from "@/app/admin/products/actions";
import { useState } from "react";

interface ProductFormProps {
  action: (
    prevState: ProductFormState,
    formData: FormData
  ) => Promise<ProductFormState>;
  product?: Product;
  nutrition?: NutritionalValue | null;
  ingredients?: Ingredient[];
}

export function ProductForm({
  action,
  product,
  nutrition,
  ingredients: existingIngredients,
}: ProductFormProps) {
  const [state, formAction, isPending] = useActionState(action, {});
  const [productType, setProductType] = useState(
    product?.productType || "wine"
  );
  const [selectedIngredients, setSelectedIngredients] = useState<
    { key: string; isAllergen: boolean; category: string | null }[]
  >(
    existingIngredients?.map((i) => ({
      key: i.nameKey,
      isAllergen: i.isAllergen ?? false,
      category: i.functionalCategory,
    })) || []
  );

  // Energie Auto-Berechnung
  const [energyKcal, setEnergyKcal] = useState(
    nutrition?.energyKcal || ""
  );
  const [energyKj, setEnergyKj] = useState(nutrition?.energyKj || "");

  function handleKcalChange(value: string) {
    setEnergyKcal(value);
    if (value) {
      setEnergyKj(String(kcalToKj(parseFloat(value))));
    }
  }

  function handleKjChange(value: string) {
    setEnergyKj(value);
    if (value) {
      setEnergyKcal(String(kjToKcal(parseFloat(value))));
    }
  }

  function estimateFromAlcohol() {
    const alcoholInput = document.querySelector<HTMLInputElement>(
      'input[name="alcoholPercentage"]'
    );
    const sugarsInput = document.querySelector<HTMLInputElement>(
      'input[name="sugars"]'
    );
    const alcohol = parseFloat(alcoholInput?.value || "0");
    const sugars = parseFloat(sugarsInput?.value || "0");
    if (alcohol > 0) {
      const { kcal, kj } = estimateEnergyFromAlcohol(alcohol, sugars);
      setEnergyKcal(String(kcal));
      setEnergyKj(String(kj));
    }
  }

  function addIngredient(key: string) {
    if (selectedIngredients.some((i) => i.key === key)) return;
    const common = COMMON_INGREDIENTS.find((c) => c.key === key);
    setSelectedIngredients([
      ...selectedIngredients,
      {
        key,
        isAllergen: common?.isAllergen ?? false,
        category: common?.category ?? null,
      },
    ]);
  }

  function removeIngredient(key: string) {
    setSelectedIngredients(
      selectedIngredients.filter((i) => i.key !== key)
    );
  }

  return (
    <form action={formAction} className="space-y-8">
      {product && (
        <input type="hidden" name="productId" value={product.id} />
      )}

      {state.error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          {state.error}
        </div>
      )}

      {state.success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded text-sm text-green-700">
          Erfolgreich gespeichert.
        </div>
      )}

      {/* Produktdaten */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Produktdaten</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">
              Produktname *
            </label>
            <input
              name="name"
              required
              defaultValue={product?.name}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-brown)]"
              placeholder="z.B. Primitivo Puglia IGT"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Slug</label>
            <input
              name="slug"
              defaultValue={product?.slug}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-brown)]"
              placeholder="Wird automatisch generiert"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Produkttyp *
            </label>
            <select
              name="productType"
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-brown)]"
            >
              {Object.entries(PRODUCT_TYPES).map(([key, labels]) => (
                <option key={key} value={key}>
                  {labels.de}
                </option>
              ))}
            </select>
          </div>

          {productType === "wine" && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Weintyp
              </label>
              <select
                name="wineType"
                defaultValue={product?.wineType || ""}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-brown)]"
              >
                <option value="">Bitte waehlen</option>
                {Object.entries(WINE_TYPES).map(([key, labels]) => (
                  <option key={key} value={key}>
                    {labels.de}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">
              Rebsorten
            </label>
            <input
              name="grapeVarieties"
              defaultValue={product?.grapeVarieties?.join(", ") || ""}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-brown)]"
              placeholder="Kommagetrennt: Primitivo, Negroamaro"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Herkunftsland *
            </label>
            <select
              name="originCountry"
              defaultValue={product?.originCountry || ""}
              required
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-brown)]"
            >
              <option value="">Bitte waehlen</option>
              {Object.entries(COUNTRIES).map(([code, labels]) => (
                <option key={code} value={code}>
                  {labels.de}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Region
            </label>
            <input
              name="originRegion"
              defaultValue={product?.originRegion || ""}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-brown)]"
              placeholder="z.B. Puglia, Rheingau"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Qualitaetsbezeichnung
            </label>
            <input
              name="appellation"
              defaultValue={product?.appellation || ""}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-brown)]"
              placeholder="z.B. IGT, DOC, DOCG, GG"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Jahrgang
            </label>
            <input
              name="vintage"
              type="number"
              min="1900"
              max="2099"
              defaultValue={product?.vintage || ""}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-brown)]"
              placeholder="z.B. 2023"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Alkoholgehalt (% vol.)
            </label>
            <input
              name="alcoholPercentage"
              type="number"
              step="0.1"
              min="0"
              max="100"
              defaultValue={product?.alcoholPercentage || ""}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-brown)]"
              placeholder="z.B. 13.5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Inhalt (ml)
            </label>
            <input
              name="volumeMl"
              type="number"
              defaultValue={product?.volumeMl || 750}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-brown)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Geschmack
            </label>
            <select
              name="tasteProfile"
              defaultValue={product?.tasteProfile || ""}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-brown)]"
            >
              <option value="">Bitte waehlen</option>
              {Object.entries(TASTE_PROFILES).map(([key, labels]) => (
                <option key={key} value={key}>
                  {labels.de}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Erzeuger
            </label>
            <input
              name="producerName"
              defaultValue={product?.producerName || ""}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-brown)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Losnummer
            </label>
            <input
              name="lotNumber"
              defaultValue={product?.lotNumber || ""}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-brown)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">EAN</label>
            <input
              name="ean"
              defaultValue={product?.ean || ""}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-brown)]"
            />
          </div>
        </div>
      </section>

      {/* Naehrwerte */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Naehrwerte pro 100 ml</h2>
          <button
            type="button"
            onClick={estimateFromAlcohol}
            className="text-xs text-[var(--color-brand-brown)] hover:underline"
          >
            Aus Alkoholgehalt schaetzen
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Energie (kJ)
            </label>
            <input
              name="energyKj"
              type="number"
              step="0.1"
              value={energyKj}
              onChange={(e) => handleKjChange(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-brown)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Energie (kcal)
            </label>
            <input
              name="energyKcal"
              type="number"
              step="0.1"
              value={energyKcal}
              onChange={(e) => handleKcalChange(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-brown)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Fett (g)
            </label>
            <input
              name="fat"
              type="number"
              step="0.01"
              defaultValue={nutrition?.fat || "0"}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-brown)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              ges. Fettsaeuren (g)
            </label>
            <input
              name="saturatedFat"
              type="number"
              step="0.01"
              defaultValue={nutrition?.saturatedFat || "0"}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-brown)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Kohlenhydrate (g)
            </label>
            <input
              name="carbohydrates"
              type="number"
              step="0.01"
              defaultValue={nutrition?.carbohydrates || "0"}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-brown)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Zucker (g)
            </label>
            <input
              name="sugars"
              type="number"
              step="0.01"
              defaultValue={nutrition?.sugars || "0"}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-brown)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Eiweiss (g)
            </label>
            <input
              name="protein"
              type="number"
              step="0.01"
              defaultValue={nutrition?.protein || "0"}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-brown)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Salz (g)
            </label>
            <input
              name="salt"
              type="number"
              step="0.001"
              defaultValue={nutrition?.salt || "0"}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-brown)]"
            />
          </div>
        </div>
      </section>

      {/* Zutaten */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Zutaten</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Zutat hinzufuegen
          </label>
          <select
            onChange={(e) => {
              if (e.target.value) {
                addIngredient(e.target.value);
                e.target.value = "";
              }
            }}
            className="w-full px-3 py-2 border border-[var(--color-border)] rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-brown)]"
          >
            <option value="">Zutat auswaehlen...</option>
            {COMMON_INGREDIENTS.filter(
              (c) => !selectedIngredients.some((s) => s.key === c.key)
            ).map((c) => (
              <option key={c.key} value={c.key}>
                {INGREDIENT_TRANSLATIONS[c.key]?.de ?? c.key}
                {c.isAllergen ? " (Allergen)" : ""}
              </option>
            ))}
          </select>
        </div>

        {selectedIngredients.length > 0 && (
          <div className="space-y-2">
            {selectedIngredients.map((ingredient, index) => (
              <div
                key={ingredient.key}
                className="flex items-center gap-3 p-2 bg-[var(--color-bg-subtle)] rounded"
              >
                <span className="text-sm text-[var(--color-text-muted)] w-6">
                  {index + 1}.
                </span>
                <span
                  className={`text-sm flex-1 ${ingredient.isAllergen ? "font-bold" : ""}`}
                >
                  {INGREDIENT_TRANSLATIONS[ingredient.key]?.de ??
                    ingredient.key}
                  {ingredient.isAllergen && (
                    <span className="ml-2 text-xs text-amber-600">
                      Allergen
                    </span>
                  )}
                </span>
                <input
                  type="hidden"
                  name="ingredientKey"
                  value={ingredient.key}
                />
                <input
                  type="hidden"
                  name="ingredientAllergen"
                  value={String(ingredient.isAllergen)}
                />
                <input
                  type="hidden"
                  name="ingredientCategory"
                  value={ingredient.category || ""}
                />
                <button
                  type="button"
                  onClick={() => removeIngredient(ingredient.key)}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  Entfernen
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Veroeffentlichung */}
      <section className="flex items-center gap-3 p-4 bg-[var(--color-bg-subtle)] rounded-lg">
        <input
          type="checkbox"
          name="isPublished"
          id="isPublished"
          defaultChecked={product?.isPublished ?? false}
          className="w-4 h-4 rounded border-[var(--color-border)] text-[var(--color-brand-brown)] focus:ring-[var(--color-brand-brown)]"
        />
        <label htmlFor="isPublished" className="text-sm font-medium">
          Veroeffentlichen (E-Label ist oeffentlich sichtbar)
        </label>
      </section>

      {/* Submit */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2.5 bg-[var(--color-brand-red)] text-white rounded font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isPending
            ? "Speichern..."
            : product
              ? "Aenderungen speichern"
              : "Produkt anlegen"}
        </button>
        <a
          href="/admin/products"
          className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
        >
          Abbrechen
        </a>
      </div>
    </form>
  );
}
