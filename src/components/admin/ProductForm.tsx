"use client";

import { useActionState, useState, useCallback } from "react";
import {
  WINE_TYPES,
  PRODUCT_TYPES,
  TASTE_PROFILES,
  COUNTRIES,
  COMMON_INGREDIENTS,
  INGREDIENT_TRANSLATIONS,
  SUGAR_CLASSIFICATIONS,
  RECYCLING_COMPONENTS,
  RECYCLING_MATERIALS,
} from "@/lib/constants";
import { calculateNutrition, defaultGlycerin } from "@/lib/nutrition";
import type {
  Product,
  NutritionalValue,
  Ingredient,
  RecyclingMaterial,
} from "@/lib/db/schema";
import type { ProductFormState } from "@/app/admin/products/actions";
import { ImageUpload } from "./ImageUpload";

// --- Hilfskonstanten ---

const INGREDIENT_CATEGORY_LABELS: Record<string, string> = {
  "": "Allgemein",
  preservative: "Konservierungsstoffe & Antioxidationsmittel",
  acid_regulator: "Saeureregulatoren",
  stabiliser: "Stabilisatoren",
  clarifying_agent: "Schoenungsmittel",
  gas: "Gase",
  enzyme: "Enzyme",
};

// --- Wizard Steps ---

const STEPS = [
  { key: "general", label: "Allgemein", required: true },
  { key: "optional", label: "Zusatzinfos", required: false },
  { key: "nutrition", label: "Naehrwerte", required: true },
  { key: "ingredients", label: "Inhaltsstoffe", required: true },
  { key: "recycling", label: "Recycling", required: false },
];

// --- Props ---

interface ProductFormProps {
  action: (
    prevState: ProductFormState,
    formData: FormData
  ) => Promise<ProductFormState>;
  product?: Product;
  nutrition?: NutritionalValue | null;
  ingredients?: Ingredient[];
  recyclingMaterials?: RecyclingMaterial[];
}

// --- Ingredient state type ---

interface IngredientEntry {
  key: string;
  isAllergen: boolean;
  isBio: boolean;
  category: string | null;
}

// --- Recycling state type ---

interface RecyclingEntry {
  component: string;
  material: string;
}

// --- Styling helper ---

const inputClass =
  "w-full px-3 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--admin-accent,var(--color-brand-brown))]";
const labelClass = "block text-sm font-medium mb-1";
const sectionHeadingClass = "text-lg font-semibold mb-4";

// --- Checkmark SVG for completed steps ---

function CheckIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={3}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}

// --- Component ---

export function ProductForm({
  action,
  product,
  nutrition,
  ingredients: existingIngredients,
  recyclingMaterials: existingRecycling,
}: ProductFormProps) {
  const [state, formAction, isPending] = useActionState(action, {});

  // --- Wizard state ---
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(
    new Set()
  );
  const [stepErrors, setStepErrors] = useState<string>("");

  // --- Section 1: Produktdaten ---
  const [productType, setProductType] = useState(
    product?.productType || "wine"
  );
  const [productName, setProductName] = useState(product?.name || "");

  // --- Section 3: Oenologische Daten & berechnete Naehrwerte ---
  const [alcoholPercent, setAlcoholPercent] = useState<string>(
    product?.alcoholPercentage?.toString() || ""
  );
  const [residualSugar, setResidualSugar] = useState<string>(
    nutrition?.residualSugar?.toString() || ""
  );
  const [totalAcidity, setTotalAcidity] = useState<string>(
    nutrition?.totalAcidity?.toString() || ""
  );
  const [glycerin, setGlycerin] = useState<string>(
    nutrition?.glycerin?.toString() || ""
  );

  // Berechnete Werte
  const [calcEnergyKcal, setCalcEnergyKcal] = useState<string>(
    nutrition?.energyKcal?.toString() || ""
  );
  const [calcEnergyKj, setCalcEnergyKj] = useState<string>(
    nutrition?.energyKj?.toString() || ""
  );
  const [calcCarbohydrates, setCalcCarbohydrates] = useState<string>(
    nutrition?.carbohydrates?.toString() || ""
  );
  const [calcSugars, setCalcSugars] = useState<string>(
    nutrition?.sugars?.toString() || ""
  );
  const [calcFat, setCalcFat] = useState<string>(
    nutrition?.fat?.toString() || "0"
  );
  const [calcSaturatedFat, setCalcSaturatedFat] = useState<string>(
    nutrition?.saturatedFat?.toString() || "0"
  );
  const [calcProtein, setCalcProtein] = useState<string>(
    nutrition?.protein?.toString() || "0"
  );
  const [calcSalt, setCalcSalt] = useState<string>(
    nutrition?.salt?.toString() || "0"
  );

  // Auto-Berechnung bei Aenderung der oenologischen Daten
  const runCalculation = useCallback(
    (alc: string, sugar: string, acid: string, glyc: string) => {
      const alcNum = parseFloat(alc);
      const sugarNum = parseFloat(sugar);
      const acidNum = parseFloat(acid);
      if (!isNaN(alcNum) && !isNaN(sugarNum) && !isNaN(acidNum)) {
        const glycNum = glyc ? parseFloat(glyc) : undefined;
        const result = calculateNutrition({
          alcoholPercent: alcNum,
          residualSugarGL: sugarNum,
          totalAcidityGL: acidNum,
          glycerinGL: !isNaN(glycNum!) ? glycNum : undefined,
        });
        setCalcEnergyKcal(String(result.energyKcal));
        setCalcEnergyKj(String(result.energyKj));
        setCalcCarbohydrates(String(result.carbohydrates));
        setCalcSugars(String(result.sugars));
        setCalcFat(String(result.fat));
        setCalcSaturatedFat(String(result.saturatedFat));
        setCalcProtein(String(result.protein));
        setCalcSalt(String(result.salt));
      }
    },
    []
  );

  function handleAlcoholChange(value: string) {
    setAlcoholPercent(value);
    runCalculation(value, residualSugar, totalAcidity, glycerin);
  }

  function handleResidualSugarChange(value: string) {
    setResidualSugar(value);
    runCalculation(alcoholPercent, value, totalAcidity, glycerin);
  }

  function handleTotalAcidityChange(value: string) {
    setTotalAcidity(value);
    runCalculation(alcoholPercent, residualSugar, value, glycerin);
  }

  function handleGlycerinChange(value: string) {
    setGlycerin(value);
    runCalculation(alcoholPercent, residualSugar, totalAcidity, value);
  }

  function fillDefaultGlycerin() {
    const alc = parseFloat(alcoholPercent);
    if (!isNaN(alc) && alc > 0) {
      const def = String(defaultGlycerin(alc));
      setGlycerin(def);
      runCalculation(alcoholPercent, residualSugar, totalAcidity, def);
    }
  }

  // --- Section 4: Inhaltsstoffe ---
  const [selectedIngredients, setSelectedIngredients] = useState<
    IngredientEntry[]
  >(
    existingIngredients?.map((i) => ({
      key: i.nameKey,
      isAllergen: i.isAllergen ?? false,
      isBio: i.isBio ?? false,
      category: i.functionalCategory,
    })) || []
  );

  function addIngredient(key: string) {
    if (selectedIngredients.some((i) => i.key === key)) return;
    const common = COMMON_INGREDIENTS.find((c) => c.key === key);
    setSelectedIngredients([
      ...selectedIngredients,
      {
        key,
        isAllergen: common?.isAllergen ?? false,
        isBio: false,
        category: common?.category ?? null,
      },
    ]);
  }

  function removeIngredient(key: string) {
    setSelectedIngredients(
      selectedIngredients.filter((i) => i.key !== key)
    );
  }

  function toggleBio(key: string) {
    setSelectedIngredients(
      selectedIngredients.map((i) =>
        i.key === key ? { ...i, isBio: !i.isBio } : i
      )
    );
  }

  // Gruppiere Zutaten nach Kategorie
  function groupedIngredients() {
    const groups: Record<string, IngredientEntry[]> = {};
    for (const ing of selectedIngredients) {
      const cat = ing.category || "";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(ing);
    }
    return groups;
  }

  // --- Section 5: Recycling ---
  const [recyclingEntries, setRecyclingEntries] = useState<RecyclingEntry[]>(
    existingRecycling?.map((r) => ({
      component: r.component,
      material: r.material,
    })) || []
  );

  function addRecyclingEntry() {
    setRecyclingEntries([
      ...recyclingEntries,
      { component: "bottle", material: "glass" },
    ]);
  }

  function removeRecyclingEntry(index: number) {
    setRecyclingEntries(recyclingEntries.filter((_, i) => i !== index));
  }

  function updateRecyclingEntry(
    index: number,
    field: "component" | "material",
    value: string
  ) {
    setRecyclingEntries(
      recyclingEntries.map((entry, i) =>
        i === index ? { ...entry, [field]: value } : entry
      )
    );
  }

  // Produkt-Typ Hint anzeigen
  const currentTypeHint =
    PRODUCT_TYPES[productType as keyof typeof PRODUCT_TYPES]?.hint || "";

  // --- Wizard validation ---
  function validateStep(step: number): boolean {
    setStepErrors("");

    switch (step) {
      case 0: {
        // Step 1: Allgemein — name and productType required
        if (!productName.trim()) {
          setStepErrors("Bitte geben Sie einen Produktnamen ein.");
          return false;
        }
        if (!productType) {
          setStepErrors("Bitte waehlen Sie einen Produkttyp.");
          return false;
        }
        return true;
      }
      case 1: {
        // Step 2: Optionale Zusatzinfos — no required fields
        return true;
      }
      case 2: {
        // Step 3: Naehrwerte — alcoholPercentage required (0 is valid)
        if (alcoholPercent === "" || alcoholPercent === undefined) {
          setStepErrors("Bitte geben Sie den Alkoholgehalt ein (0 ist gueltig).");
          return false;
        }
        const alcNum = parseFloat(alcoholPercent);
        if (isNaN(alcNum)) {
          setStepErrors("Bitte geben Sie einen gueltigen Alkoholgehalt ein.");
          return false;
        }
        return true;
      }
      case 3: {
        // Step 4: Inhaltsstoffe — can advance freely
        return true;
      }
      case 4: {
        // Step 5: Recycling — can advance freely
        return true;
      }
      default:
        return true;
    }
  }

  function goToNext() {
    if (validateStep(currentStep)) {
      setCompletedSteps((prev) => new Set([...prev, currentStep]));
      if (currentStep < STEPS.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }
  }

  function goToPrev() {
    setStepErrors("");
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }

  function skipStep() {
    setStepErrors("");
    setCompletedSteps((prev) => new Set([...prev, currentStep]));
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  }

  function goToStep(step: number) {
    // Allow clicking on completed steps or the step right after last completed
    if (step < currentStep || completedSteps.has(step) || step === currentStep) {
      setStepErrors("");
      setCurrentStep(step);
    }
  }

  const isLastStep = currentStep === STEPS.length - 1;
  const isOptionalStep = !STEPS[currentStep].required;

  return (
    <form action={formAction} className="space-y-0">
      {product && (
        <input type="hidden" name="productId" value={product.id} />
      )}

      {/* ============================================================
          Error / Success messages (above stepper)
          ============================================================ */}
      {state.error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {state.error}
        </div>
      )}

      {state.success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
          Erfolgreich gespeichert.
        </div>
      )}

      {/* ============================================================
          Step indicator (horizontal stepper bar)
          ============================================================ */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => {
            const isCompleted = completedSteps.has(index);
            const isActive = index === currentStep;
            const isUpcoming = !isCompleted && !isActive;

            return (
              <div key={step.key} className="flex items-center flex-1 last:flex-none">
                {/* Step circle + label */}
                <div className="flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => goToStep(index)}
                    className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                      transition-all duration-200 cursor-pointer
                      ${
                        isCompleted
                          ? "bg-green-500 text-white"
                          : isActive
                            ? "bg-[var(--admin-accent,var(--color-brand-brown))] text-white"
                            : "border-2 border-gray-300 text-gray-400"
                      }
                    `}
                    aria-label={`Schritt ${index + 1}: ${step.label}`}
                  >
                    {isCompleted ? <CheckIcon /> : index + 1}
                  </button>
                  <span
                    className={`
                      mt-1.5 text-xs font-medium whitespace-nowrap
                      ${
                        isCompleted
                          ? "text-green-600"
                          : isActive
                            ? "text-[var(--admin-accent,var(--color-brand-brown))]"
                            : "text-gray-400"
                      }
                    `}
                  >
                    {step.label}
                  </span>
                </div>

                {/* Connecting line */}
                {index < STEPS.length - 1 && (
                  <div
                    className={`
                      flex-1 h-0.5 mx-2 mt-[-1.25rem]
                      ${
                        isCompleted
                          ? "bg-green-500"
                          : "bg-gray-200"
                      }
                    `}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================================
          Step validation error
          ============================================================ */}
      {stepErrors && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
          {stepErrors}
        </div>
      )}

      {/* ============================================================
          Step content area (white card)
          ============================================================ */}
      <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] overflow-hidden">
        <div className="p-6 max-h-[calc(100vh-320px)] overflow-y-auto">

          {/* ============================================================
              STEP 1: Allgemein (Produktdaten)
              ============================================================ */}
          <div style={{ display: currentStep === 0 ? "block" : "none" }}>
            <h2 className={sectionHeadingClass}>Allgemein</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Produktname */}
              <div className="md:col-span-2">
                <label className={labelClass}>Produktname *</label>
                <input
                  name="name"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className={inputClass}
                  placeholder="z.B. Primitivo Puglia IGT"
                />
              </div>

              {/* Slug */}
              <div>
                <label className={labelClass}>Slug</label>
                <input
                  name="slug"
                  defaultValue={product?.slug}
                  className={inputClass}
                  placeholder="Wird automatisch generiert"
                />
              </div>

              {/* Produkttyp */}
              <div>
                <label className={labelClass}>Produkttyp *</label>
                <select
                  name="productType"
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  className={inputClass}
                >
                  {Object.entries(PRODUCT_TYPES).map(([key, labels]) => (
                    <option key={key} value={key}>
                      {labels.de}
                    </option>
                  ))}
                </select>
                {currentTypeHint && (
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">
                    {currentTypeHint}
                  </p>
                )}
              </div>

              {/* Weintyp (nur bei wine) */}
              {productType === "wine" && (
                <div>
                  <label className={labelClass}>Weintyp</label>
                  <select
                    name="wineType"
                    defaultValue={product?.wineType || ""}
                    className={inputClass}
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

              {/* Foto Upload */}
              <div className="md:col-span-2">
                <ImageUpload
                  currentUrl={product?.imageUrl}
                  name="imageUrl"
                />
              </div>
            </div>
          </div>

          {/* ============================================================
              STEP 2: Optionale Zusatzinfos
              ============================================================ */}
          <div style={{ display: currentStep === 1 ? "block" : "none" }}>
            <h2 className={sectionHeadingClass}>Optionale Zusatzinfos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Rebsorten */}
              <div>
                <label className={labelClass}>Rebsorten</label>
                <input
                  name="grapeVarieties"
                  defaultValue={product?.grapeVarieties?.join(", ") || ""}
                  className={inputClass}
                  placeholder="Kommagetrennt: Primitivo, Negroamaro"
                />
              </div>

              {/* Jahrgang */}
              <div>
                <label className={labelClass}>Jahrgang</label>
                <input
                  name="vintage"
                  type="number"
                  min="1900"
                  max="2099"
                  defaultValue={product?.vintage || ""}
                  className={inputClass}
                  placeholder="z.B. 2023"
                />
              </div>

              {/* Menge (ml) */}
              <div>
                <label className={labelClass}>Menge (ml)</label>
                <input
                  name="volumeMl"
                  type="number"
                  defaultValue={product?.volumeMl || 750}
                  className={inputClass}
                />
              </div>

              {/* Herkunftsland */}
              <div>
                <label className={labelClass}>Herkunftsland *</label>
                <select
                  name="originCountry"
                  defaultValue={product?.originCountry || ""}
                  className={inputClass}
                >
                  <option value="">Bitte waehlen</option>
                  {Object.entries(COUNTRIES).map(([code, labels]) => (
                    <option key={code} value={code}>
                      {labels.de}
                    </option>
                  ))}
                </select>
              </div>

              {/* Region */}
              <div>
                <label className={labelClass}>Region</label>
                <input
                  name="originRegion"
                  defaultValue={product?.originRegion || ""}
                  className={inputClass}
                  placeholder="z.B. Puglia, Rheingau"
                />
              </div>

              {/* Bezeichnung (appellation) */}
              <div>
                <label className={labelClass}>Bezeichnung (Appellation)</label>
                <input
                  name="appellation"
                  defaultValue={product?.appellation || ""}
                  className={inputClass}
                  placeholder="z.B. IGT, DOC, DOCG, GG"
                />
              </div>

              {/* Geschmack (tasteProfile) */}
              <div>
                <label className={labelClass}>Geschmack</label>
                <select
                  name="tasteProfile"
                  defaultValue={product?.tasteProfile || ""}
                  className={inputClass}
                >
                  <option value="">Bitte waehlen</option>
                  {Object.entries(TASTE_PROFILES).map(([key, labels]) => (
                    <option key={key} value={key}>
                      {labels.de}
                    </option>
                  ))}
                </select>
              </div>

              {/* Klassifizierung / Zuckergehalt (sugarClassification) */}
              <div>
                <label className={labelClass}>
                  Klassifizierung / Zuckergehalt
                </label>
                <select
                  name="sugarClassification"
                  defaultValue={product?.sugarClassification || ""}
                  className={inputClass}
                >
                  <option value="">Bitte waehlen</option>
                  {Object.entries(SUGAR_CLASSIFICATIONS).map(([key, labels]) => (
                    <option key={key} value={key}>
                      {labels.de}
                    </option>
                  ))}
                </select>
              </div>

              {/* Erzeuger */}
              <div>
                <label className={labelClass}>Erzeuger</label>
                <input
                  name="producerName"
                  defaultValue={product?.producerName || ""}
                  className={inputClass}
                />
              </div>

              {/* Losnummer */}
              <div>
                <label className={labelClass}>Losnummer</label>
                <input
                  name="lotNumber"
                  defaultValue={product?.lotNumber || ""}
                  className={inputClass}
                />
              </div>

              {/* EAN */}
              <div>
                <label className={labelClass}>EAN</label>
                <input
                  name="ean"
                  defaultValue={product?.ean || ""}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* ============================================================
              STEP 3: Naehrwertangaben
              ============================================================ */}
          <div style={{ display: currentStep === 2 ? "block" : "none" }}>
            <h2 className={sectionHeadingClass}>Naehrwertangaben</h2>

            {/* --- Oenologische Informationen --- */}
            <div className="mb-6">
              <h3 className="text-base font-semibold mb-3">
                Oenologische Informationen
              </h3>
              <p className="text-xs text-[var(--color-text-muted)] mb-3">
                Geben Sie die Analysedaten Ihres Weins ein. Die Naehrwerte werden
                automatisch berechnet.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Alkoholgehalt */}
                <div>
                  <label className={labelClass}>Alkoholgehalt (% vol.) *</label>
                  <input
                    name="alcoholPercentage"
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={alcoholPercent}
                    onChange={(e) => handleAlcoholChange(e.target.value)}
                    className={inputClass}
                    placeholder="z.B. 13.5"
                  />
                </div>

                {/* Restzucker (g/l) */}
                <div>
                  <label className={labelClass}>Restzucker (g/l)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={residualSugar}
                    onChange={(e) => handleResidualSugarChange(e.target.value)}
                    className={inputClass}
                    placeholder="z.B. 4.0"
                  />
                  <input type="hidden" name="residualSugar" value={residualSugar} />
                </div>

                {/* Gesamtsaeure (g/l) als Weinsaeure */}
                <div>
                  <label className={labelClass}>
                    Gesamtsaeure (g/l als Weinsaeure)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={totalAcidity}
                    onChange={(e) => handleTotalAcidityChange(e.target.value)}
                    className={inputClass}
                    placeholder="z.B. 5.5"
                  />
                  <input type="hidden" name="totalAcidity" value={totalAcidity} />
                </div>

                {/* Glycerin (g/l) */}
                <div>
                  <label className={labelClass}>Glycerin (g/l)</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={glycerin}
                      onChange={(e) => handleGlycerinChange(e.target.value)}
                      className={inputClass}
                      placeholder="z.B. 8.0"
                    />
                    <button
                      type="button"
                      onClick={fillDefaultGlycerin}
                      className="shrink-0 px-3 py-2 text-xs border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-bg-subtle)] transition-colors"
                      title="Standardwert basierend auf Alkoholgehalt berechnen"
                    >
                      Standardwert verwenden
                    </button>
                  </div>
                  <input type="hidden" name="glycerin" value={glycerin} />
                </div>
              </div>
            </div>

            {/* --- Berechnete Werte (read-only) --- */}
            <div className="mb-6">
              <h3 className="text-base font-semibold mb-3">
                Berechnete Werte (pro 100 ml)
              </h3>
              {!(alcoholPercent && residualSugar && totalAcidity) && (
                <p className="text-xs text-[var(--color-text-muted)] mb-3">
                  Befuellen Sie Alkoholgehalt, Restzucker und Gesamtsaeure, um die
                  Naehrwerte automatisch zu berechnen.
                </p>
              )}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Energie (kcal) */}
                <div>
                  <label className={labelClass}>Energie (kcal)</label>
                  <div className="px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-subtle)] text-sm">
                    {calcEnergyKcal || "-"}
                  </div>
                </div>

                {/* Energie (kJ) */}
                <div>
                  <label className={labelClass}>Energie (kJ)</label>
                  <div className="px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-subtle)] text-sm">
                    {calcEnergyKj || "-"}
                  </div>
                </div>

                {/* Kohlenhydrate (g) */}
                <div>
                  <label className={labelClass}>Kohlenhydrate (g)</label>
                  <div className="px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-subtle)] text-sm">
                    {calcCarbohydrates || "-"}
                  </div>
                </div>

                {/* Zucker (g) */}
                <div>
                  <label className={labelClass}>Zucker (g)</label>
                  <div className="px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-subtle)] text-sm">
                    {calcSugars || "-"}
                  </div>
                </div>
              </div>

              {/* Hidden fields for calculated values */}
              <input type="hidden" name="energyKj" value={calcEnergyKj} />
              <input type="hidden" name="energyKcal" value={calcEnergyKcal} />
              <input type="hidden" name="carbohydrates" value={calcCarbohydrates} />
              <input type="hidden" name="sugars" value={calcSugars} />
            </div>

            {/* --- Geringfuegige Mengen --- */}
            <div>
              <h3 className="text-base font-semibold mb-3">
                Geringfuegige Mengen
              </h3>
              <p className="text-xs text-[var(--color-text-muted)] mb-3">
                Typischerweise sind alle Werte = 0
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Fett */}
                <div>
                  <label className={labelClass}>Fett (g)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={calcFat}
                    onChange={(e) => setCalcFat(e.target.value)}
                    className={inputClass}
                  />
                </div>

                {/* ges. Fettsaeuren */}
                <div>
                  <label className={labelClass}>ges. Fettsaeuren (g)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={calcSaturatedFat}
                    onChange={(e) => setCalcSaturatedFat(e.target.value)}
                    className={inputClass}
                  />
                </div>

                {/* Eiweiss */}
                <div>
                  <label className={labelClass}>Eiweiss (g)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={calcProtein}
                    onChange={(e) => setCalcProtein(e.target.value)}
                    className={inputClass}
                  />
                </div>

                {/* Salz */}
                <div>
                  <label className={labelClass}>Salz (g)</label>
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    value={calcSalt}
                    onChange={(e) => setCalcSalt(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Hidden fields for negligible values */}
              <input type="hidden" name="fat" value={calcFat} />
              <input type="hidden" name="saturatedFat" value={calcSaturatedFat} />
              <input type="hidden" name="protein" value={calcProtein} />
              <input type="hidden" name="salt" value={calcSalt} />
            </div>
          </div>

          {/* ============================================================
              STEP 4: Inhaltsstoffe (Layout wie e-label.eu)
              ============================================================ */}
          <div style={{ display: currentStep === 3 ? "block" : "none" }}>
            <h2 className={sectionHeadingClass}>Inhaltsstoffe</h2>
            <p className="text-xs text-[var(--color-text-muted)] mb-6">
              Waehlen Sie die Zutaten aus der Liste der Weinzutaten. Alle
              Zutaten werden automatisch uebersetzt.
            </p>

            {/* --- 1. Produktart auswaehlen --- */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-[var(--color-text)] mb-1">
                1. Produktart auswaehlen
              </h3>
              <p className="text-xs text-[var(--color-text-muted)] mb-3">
                Waehlen Sie die Produktart, fuer die Sie die Zutatenliste
                erstellen moechten.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {Object.entries(PRODUCT_TYPES).map(([key, val]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() =>
                      setProductType(key)
                    }
                    className={`p-3 rounded-lg border text-left transition-all ${
                      productType === key
                        ? "border-[var(--admin-accent,var(--color-brand-brown))] bg-[var(--admin-accent-light,#f5efe9)] ring-1 ring-[var(--admin-accent,var(--color-brand-brown))]"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <span className="text-sm font-medium block">
                      {val.de}
                    </span>
                    <span className="text-[10px] text-[var(--color-text-muted)] mt-0.5 block leading-tight">
                      {val.hint}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* --- 2. Inhaltsstoffe auswaehlen --- */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-[var(--color-text)] mb-1">
                2. Inhaltsstoffe auswaehlen*
              </h3>
              <p className="text-xs text-[var(--color-text-muted)] mb-3">
                Waehlen Sie aus der Liste alle Zutaten aus. Nicht
                aufgefuehrte Zutaten muessen nicht angegeben werden.
              </p>
              <div className="flex gap-2">
                {/* Weinzutat aus Liste */}
                <div className="flex-1">
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        addIngredient(e.target.value);
                        e.target.value = "";
                      }
                    }}
                    className={inputClass}
                  >
                    <option value="">
                      + Weinzutat aus Liste auswaehlen
                    </option>
                    {Object.entries(INGREDIENT_CATEGORY_LABELS).map(
                      ([catKey, catLabel]) => {
                        const items = COMMON_INGREDIENTS.filter(
                          (c) =>
                            (c.category || "") === catKey &&
                            !selectedIngredients.some(
                              (s) => s.key === c.key
                            )
                        );
                        if (items.length === 0) return null;
                        return (
                          <optgroup key={catKey} label={catLabel}>
                            {items.map((c) => (
                              <option key={c.key} value={c.key}>
                                {INGREDIENT_TRANSLATIONS[c.key]?.de ??
                                  c.key}
                                {c.isAllergen ? " (Allergen)" : ""}
                              </option>
                            ))}
                          </optgroup>
                        );
                      }
                    )}
                  </select>
                </div>
              </div>
            </div>

            {/* --- 3. Zutaten sortieren --- */}
            {selectedIngredients.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-[var(--color-text)] mb-1">
                  3. Zutaten sortieren
                </h3>
                <p className="text-xs text-[var(--color-text-muted)] mb-3">
                  Die Liste ist von der groessten zur kleinsten Menge zu
                  sortieren.
                </p>

                <div className="space-y-4">
                  {Object.entries(groupedIngredients()).map(
                    ([catKey, items]) => (
                      <div key={catKey}>
                        {/* Kategorieheader */}
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-px flex-1 bg-gray-200" />
                          <span className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-widest">
                            {INGREDIENT_CATEGORY_LABELS[catKey] ||
                              INGREDIENT_CATEGORY_LABELS[""] ||
                              catKey}
                          </span>
                          <div className="h-px flex-1 bg-gray-200" />
                        </div>

                        {/* Zutaten-Karten */}
                        <div className="space-y-1.5">
                          {items.map((ingredient) => {
                            const globalIndex =
                              selectedIngredients.findIndex(
                                (i) => i.key === ingredient.key
                              );
                            return (
                              <div
                                key={ingredient.key}
                                className="flex items-center gap-2 px-3 py-2.5 bg-white border border-gray-100 rounded-lg hover:border-gray-200 transition-colors group"
                              >
                                {/* Drag handle (visuell) */}
                                <span className="text-gray-300 group-hover:text-gray-400 cursor-grab shrink-0">
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                  </svg>
                                </span>

                                {/* Name + Allergen-Badge */}
                                <div className="flex-1 min-w-0">
                                  <span
                                    className={`text-sm ${ingredient.isAllergen ? "font-bold" : ""}`}
                                  >
                                    {INGREDIENT_TRANSLATIONS[
                                      ingredient.key
                                    ]?.de ?? ingredient.key}
                                  </span>
                                  {ingredient.isAllergen && (
                                    <span className="ml-1.5 inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium bg-amber-50 text-amber-700 rounded">
                                      Allergen
                                    </span>
                                  )}
                                </div>

                                {/* Bio-Zutat Toggle */}
                                <label className="flex items-center gap-1.5 px-2 py-1 rounded-md cursor-pointer hover:bg-green-50 transition-colors shrink-0">
                                  <input
                                    type="checkbox"
                                    checked={ingredient.isBio}
                                    onChange={() =>
                                      toggleBio(ingredient.key)
                                    }
                                    className="w-3.5 h-3.5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                                  />
                                  <span className="text-xs text-[var(--color-text-muted)]">
                                    Bio-Zutat
                                  </span>
                                </label>

                                {/* Loeschen */}
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeIngredient(ingredient.key)
                                  }
                                  className="p-1 rounded-md text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
                                  title="Zutat entfernen"
                                >
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                  </svg>
                                </button>

                                {/* Hidden fields */}
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
                                <input
                                  type="hidden"
                                  name="ingredientBio"
                                  value={String(ingredient.isBio)}
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ============================================================
              STEP 5: Recycling
              ============================================================ */}
          <div style={{ display: currentStep === 4 ? "block" : "none" }}>
            <h2 className={sectionHeadingClass}>Recycling</h2>
            <p className="text-xs text-[var(--color-text-muted)] mb-4">
              Geben Sie die Verpackungsmaterialien Ihres Produkts an.
            </p>

            {recyclingEntries.length > 0 && (
              <div className="space-y-3 mb-4">
                {recyclingEntries.map((entry, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-[var(--color-bg-subtle)] rounded-lg"
                  >
                    {/* Komponente */}
                    <div className="flex-1">
                      <label className="block text-xs font-medium mb-1">
                        Komponente
                      </label>
                      <select
                        value={entry.component}
                        onChange={(e) =>
                          updateRecyclingEntry(index, "component", e.target.value)
                        }
                        className={inputClass}
                      >
                        {Object.entries(RECYCLING_COMPONENTS).map(
                          ([key, labels]) => (
                            <option key={key} value={key}>
                              {labels.de}
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    {/* Material */}
                    <div className="flex-1">
                      <label className="block text-xs font-medium mb-1">
                        Material
                      </label>
                      <select
                        value={entry.material}
                        onChange={(e) =>
                          updateRecyclingEntry(index, "material", e.target.value)
                        }
                        className={inputClass}
                      >
                        {Object.entries(RECYCLING_MATERIALS).map(
                          ([key, labels]) => (
                            <option key={key} value={key}>
                              {labels.de} ({labels.icon})
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    {/* Hidden fields */}
                    <input
                      type="hidden"
                      name="recyclingComponent[]"
                      value={entry.component}
                    />
                    <input
                      type="hidden"
                      name="recyclingMaterial[]"
                      value={entry.material}
                    />

                    {/* Entfernen */}
                    <button
                      type="button"
                      onClick={() => removeRecyclingEntry(index)}
                      className="shrink-0 mt-5 text-xs text-red-500 hover:text-red-700"
                    >
                      Entfernen
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={addRecyclingEntry}
              className="px-4 py-2 text-sm border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-bg-subtle)] transition-colors"
            >
              + Material hinzufuegen
            </button>

            {/* Veroeffentlichung checkbox — on last step */}
            <div className="mt-8 flex items-center gap-3 p-4 bg-[var(--color-bg-subtle)] rounded-lg">
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
            </div>
          </div>

        </div>

        {/* ============================================================
            Navigation buttons (fixed at bottom of card)
            ============================================================ */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
          {/* Left: Zurueck button */}
          <div>
            {currentStep > 0 ? (
              <button
                type="button"
                onClick={goToPrev}
                className="px-4 py-2 text-sm font-medium text-[var(--color-text-muted)] border border-[var(--color-border)] rounded-lg hover:bg-white transition-colors"
              >
                Zurueck
              </button>
            ) : (
              <div />
            )}
          </div>

          {/* Center: Ueberspringen (only for optional steps) */}
          <div>
            {isOptionalStep && !isLastStep && (
              <button
                type="button"
                onClick={skipStep}
                className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] underline underline-offset-2 transition-colors"
              >
                Ueberspringen
              </button>
            )}
          </div>

          {/* Right: Weiter / Submit button */}
          <div className="flex items-center gap-3">
            <a
              href="/admin/products"
              className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            >
              Abbrechen
            </a>

            {isLastStep ? (
              <button
                type="submit"
                disabled={isPending}
                className="px-6 py-2.5 bg-[var(--color-brand-red)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isPending
                  ? "Speichern..."
                  : product
                    ? "Aenderungen speichern"
                    : "Produkt anlegen"}
              </button>
            ) : (
              <button
                type="button"
                onClick={goToNext}
                className="px-6 py-2.5 bg-[var(--admin-accent,var(--color-brand-brown))] text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Weiter
              </button>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
