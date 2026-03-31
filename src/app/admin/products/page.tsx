export const dynamic = "force-dynamic";

import Link from "next/link";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { TogglePublishButton, DeleteButton } from "./client-buttons";

export default async function ProductListPage() {
  const allProducts = await db
    .select()
    .from(products)
    .orderBy(desc(products.updatedAt));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Produkte</h1>
        <Link
          href="/admin/products/new"
          className="px-4 py-2 bg-[var(--color-brand-red)] text-white rounded text-sm hover:opacity-90 transition-opacity"
        >
          Neues Produkt
        </Link>
      </div>

      {allProducts.length === 0 ? (
        <div className="bg-white rounded-lg border border-[var(--color-border)] p-8 text-center">
          <p className="text-[var(--color-text-muted)]">
            Noch keine Produkte angelegt.
          </p>
          <Link
            href="/admin/products/new"
            className="inline-block mt-4 text-sm text-[var(--color-brand-red)] hover:underline"
          >
            Erstes Produkt anlegen
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-[var(--color-border)] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
                <th className="text-left px-4 py-3 font-medium">Name</th>
                <th className="text-left px-4 py-3 font-medium">Typ</th>
                <th className="text-left px-4 py-3 font-medium">
                  Jahrgang
                </th>
                <th className="text-left px-4 py-3 font-medium">
                  Status
                </th>
                <th className="text-right px-4 py-3 font-medium">
                  Aktionen
                </th>
              </tr>
            </thead>
            <tbody>
              {allProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-bg-subtle)] transition-colors"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="font-medium hover:text-[var(--color-brand-brown)] transition-colors"
                    >
                      {product.name}
                    </Link>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      /{product.slug}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text-muted)]">
                    {product.wineType || product.productType}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text-muted)]">
                    {product.vintage || "—"}
                  </td>
                  <td className="px-4 py-3">
                    {product.isPublished ? (
                      <span className="inline-block px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                        Live
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 rounded-full">
                        Entwurf
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/products/${product.id}/qr`}
                        className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
                      >
                        QR-Code
                      </Link>
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="text-xs text-[var(--color-brand-brown)] hover:underline"
                      >
                        Bearbeiten
                      </Link>
                      <TogglePublishButton
                        productId={product.id}
                        isPublished={product.isPublished ?? false}
                      />
                      <DeleteButton
                        productId={product.id}
                        productName={product.name}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
