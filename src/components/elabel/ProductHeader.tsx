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

  const details = [
    product.grapeVarieties?.length ? product.grapeVarieties.join(", ") : null,
    product.originRegion
      ? `${product.originRegion}, ${countryLabel}`
      : countryLabel,
    product.appellation,
    tasteLabel,
  ].filter(Boolean);

  return (
    <div className="flex gap-4 mb-4">
      {/* Produktbild (wenn vorhanden) */}
      {product.imageUrl && (
        <div className="shrink-0">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-20 h-28 object-contain rounded"
          />
        </div>
      )}

      {/* Produktinfos */}
      <div className={product.imageUrl ? "" : "w-full text-center"}>
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[var(--color-brand-brown)] bg-[var(--color-bg-subtle)] rounded-full">
            {wineTypeLabel || productTypeLabel}
          </span>
          {product.vintage && (
            <span className="text-xs text-[var(--color-text-muted)]">
              {product.vintage}
            </span>
          )}
        </div>

        <h1 className="text-lg font-semibold text-[var(--color-text)] leading-tight">
          {product.name}
        </h1>

        {details.length > 0 && (
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            {details.join(" · ")}
          </p>
        )}

        <div className="flex gap-4 mt-1.5 text-xs">
          {product.alcoholPercentage && (
            <span>
              <span className="text-[var(--color-text-muted)]">Alk.</span>{" "}
              <strong>{product.alcoholPercentage}%</strong>
            </span>
          )}
          {product.volumeMl && (
            <span>
              <strong>{product.volumeMl} ml</strong>
            </span>
          )}
        </div>

        {product.producerName && (
          <p className="text-[11px] text-[var(--color-text-muted)] mt-1">
            {product.producerName}
          </p>
        )}
      </div>
    </div>
  );
}
