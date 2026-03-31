import { notFound } from "next/navigation";
import { Suspense } from "react";
import { db } from "@/lib/db";
import {
  products,
  nutritionalValues,
  ingredients,
  recyclingMaterials,
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { ProductHeader } from "@/components/elabel/ProductHeader";
import { NutritionalTable } from "@/components/elabel/NutritionalTable";
import { IngredientList } from "@/components/elabel/IngredientList";
import { AllergenWarnings } from "@/components/elabel/AllergenWarnings";
import { RecyclingInfo } from "@/components/elabel/RecyclingInfo";
import { LanguageSwitcher } from "@/components/elabel/LanguageSwitcher";
import { LegalFooter } from "@/components/elabel/LegalFooter";
import {
  DEFAULT_LOCALE,
  LOCALES,
  SUGAR_CLASSIFICATIONS,
  UI_TRANSLATIONS,
  type Locale,
} from "@/lib/constants";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
}

// Dynamisch rendern (keine DB-Verbindung beim Build noetig)
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await db.query.products.findFirst({
    where: eq(products.slug, slug),
  });

  return {
    title: product ? `${product.name} — miori E-Label` : "miori E-Label",
    robots: "noindex, nofollow",
  };
}

async function getProductData(slug: string) {
  const product = await db.query.products.findFirst({
    where: eq(products.slug, slug),
  });

  if (!product || !product.isPublished) return null;

  const [nutrition, productIngredients, productRecyclingMaterials] =
    await Promise.all([
      db.query.nutritionalValues.findFirst({
        where: eq(nutritionalValues.productId, product.id),
      }),
      db
        .select()
        .from(ingredients)
        .where(eq(ingredients.productId, product.id))
        .orderBy(ingredients.sortOrder),
      db
        .select()
        .from(recyclingMaterials)
        .where(eq(recyclingMaterials.productId, product.id))
        .orderBy(recyclingMaterials.sortOrder),
    ]);

  return {
    product,
    nutrition,
    ingredients: productIngredients,
    recyclingMaterials: productRecyclingMaterials,
  };
}

export default async function ELabelPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params;
  const { lang } = await searchParams;

  const locale: Locale =
    lang && LOCALES.includes(lang as Locale)
      ? (lang as Locale)
      : DEFAULT_LOCALE;

  const data = await getProductData(slug);
  if (!data) notFound();

  const {
    product,
    nutrition,
    ingredients: productIngredients,
    recyclingMaterials: productRecyclingMaterials,
  } = data;

  // Zuckerklassifizierung (z.B. Brut, Extra Dry) ermitteln
  const sugarClassKey = product.sugarClassification as
    | keyof typeof SUGAR_CLASSIFICATIONS
    | null;
  const sugarClassLabel =
    sugarClassKey && SUGAR_CLASSIFICATIONS[sugarClassKey]
      ? SUGAR_CLASSIFICATIONS[sugarClassKey][locale]
      : null;

  return (
    <main className="flex-1 flex flex-col items-center py-4 px-3">
      <div className="w-full max-w-md">
        <Suspense>
          <LanguageSwitcher current={locale} />
        </Suspense>

        <div className="bg-white rounded-lg shadow-sm border border-[var(--color-border)] px-4 py-3">
          <ProductHeader product={product} locale={locale} />

          {sugarClassLabel && (
            <p className="text-xs text-[var(--color-text-muted)] -mt-2 mb-2">
              {UI_TRANSLATIONS.sugar_classification[locale]}: {sugarClassLabel}
            </p>
          )}

          <hr className="my-2 border-[var(--color-border)]" />

          <AllergenWarnings
            ingredients={productIngredients}
            locale={locale}
          />

          {nutrition && (
            <NutritionalTable nutrition={nutrition} locale={locale} />
          )}

          <IngredientList
            ingredients={productIngredients}
            locale={locale}
          />

          <RecyclingInfo
            materials={productRecyclingMaterials}
            locale={locale}
          />
        </div>

        <LegalFooter locale={locale} />
      </div>
    </main>
  );
}
