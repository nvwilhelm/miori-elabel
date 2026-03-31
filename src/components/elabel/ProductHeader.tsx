import type { Product } from "@/lib/db/schema";
import {
  WINE_TYPES,
  PRODUCT_TYPES,
  COUNTRIES,
  TASTE_PROFILES,
  UI_TRANSLATIONS,
  type Locale,
} from "@/lib/constants";

interface ProductHeaderProps {
  product: Product;
  locale: Locale;
}

export function ProductHeader({ product, locale }: ProductHeaderProps) {
  const productTypeLabel =
    PRODUCT_TYPES[product.productType as keyof typeof PRODUCT_TYPES]?.[
      locale
    ] ?? product.productType;

  const wineTypeLabel = product.wineType
    ? WINE_TYPES[product.wineType as keyof typeof WINE_TYPES]?.[locale]
    : null;

  const countryLabel =
    COUNTRIES[product.originCountry]?.[locale] ?? product.originCountry;

  const tasteLabel = product.tasteProfile
    ? TASTE_PROFILES[
        product.tasteProfile as keyof typeof TASTE_PROFILES
      ]?.[locale]
    : null;

  return (
    <div className="text-center mb-6">
      <div className="inline-block px-3 py-1 text-xs font-medium uppercase tracking-wider text-[var(--color-brand-brown)] bg-[var(--color-bg-subtle)] rounded-full mb-3">
        {wineTypeLabel || productTypeLabel}
      </div>

      <h1 className="text-2xl font-semibold text-[var(--color-text)] mb-2">
        {product.name}
      </h1>

      {product.vintage && (
        <p className="text-lg text-[var(--color-text-muted)]">
          {UI_TRANSLATIONS.vintage[locale]} {product.vintage}
        </p>
      )}

      <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-[var(--color-text-muted)]">
        {product.grapeVarieties && product.grapeVarieties.length > 0 && (
          <span>{product.grapeVarieties.join(", ")}</span>
        )}
        <span>
          {product.originRegion
            ? `${product.originRegion}, ${countryLabel}`
            : countryLabel}
        </span>
        {product.appellation && <span>{product.appellation}</span>}
        {tasteLabel && <span>{tasteLabel}</span>}
      </div>

      <div className="mt-3 flex justify-center gap-6 text-sm">
        {product.alcoholPercentage && (
          <span>
            <span className="text-[var(--color-text-muted)]">
              {UI_TRANSLATIONS.alcohol_content[locale]}:
            </span>{" "}
            <strong>{product.alcoholPercentage}% vol.</strong>
          </span>
        )}
        {product.volumeMl && (
          <span>
            <span className="text-[var(--color-text-muted)]">
              {UI_TRANSLATIONS.volume[locale]}:
            </span>{" "}
            <strong>{product.volumeMl} ml</strong>
          </span>
        )}
      </div>

      {product.producerName && (
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          {UI_TRANSLATIONS.producer[locale]}: {product.producerName}
        </p>
      )}
    </div>
  );
}
