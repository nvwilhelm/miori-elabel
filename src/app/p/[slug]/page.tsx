import { notFound } from "next/navigation";
import { Suspense } from "react";
import { db } from "@/lib/db";
import { products, nutritionalValues, ingredients } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { ProductHeader } from "@/components/elabel/ProductHeader";
import { NutritionalTable } from "@/components/elabel/NutritionalTable";
import { IngredientList } from "@/components/elabel/IngredientList";
import { AllergenWarnings } from "@/components/elabel/AllergenWarnings";
import { LanguageSwitcher } from "@/components/elabel/LanguageSwitcher";
import { LegalFooter } from "@/components/elabel/LegalFooter";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/lib/constants";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
}

// Statische Parameter fuer alle veroeffentlichten Produkte generieren
export async function generateStaticParams() {
  const publishedProducts = await db
    .select({ slug: products.slug })
    .from(products)
    .where(eq(products.isPublished, true));

  return publishedProducts.map((p) => ({ slug: p.slug }));
}

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

  const [nutrition, productIngredients] = await Promise.all([
    db.query.nutritionalValues.findFirst({
      where: eq(nutritionalValues.productId, product.id),
    }),
    db
      .select()
      .from(ingredients)
      .where(eq(ingredients.productId, product.id))
      .orderBy(ingredients.sortOrder),
  ]);

  return { product, nutrition, ingredients: productIngredients };
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

  const { product, nutrition, ingredients: productIngredients } = data;

  return (
    <main className="flex-1 flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-lg">
        <Suspense>
          <LanguageSwitcher current={locale} />
        </Suspense>

        <div className="bg-white rounded-lg shadow-sm border border-[var(--color-border)] p-6">
          <ProductHeader product={product} locale={locale} />

          <hr className="my-4 border-[var(--color-border)]" />

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
        </div>

        <LegalFooter locale={locale} />
      </div>
    </main>
  );
}
