export const dynamic = "force-dynamic";

import Link from "next/link";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { eq, count } from "drizzle-orm";

export default async function AdminDashboard() {
  const [totalResult, publishedResult] = await Promise.all([
    db.select({ count: count() }).from(products),
    db
      .select({ count: count() })
      .from(products)
      .where(eq(products.isPublished, true)),
  ]);

  const totalCount = totalResult[0]?.count ?? 0;
  const publishedCount = publishedResult[0]?.count ?? 0;
  const draftCount = totalCount - publishedCount;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg border border-[var(--color-border)] p-5">
          <p className="text-sm text-[var(--color-text-muted)]">
            Gesamt
          </p>
          <p className="text-3xl font-semibold mt-1">{totalCount}</p>
        </div>
        <div className="bg-white rounded-lg border border-[var(--color-border)] p-5">
          <p className="text-sm text-green-600">Veroeffentlicht</p>
          <p className="text-3xl font-semibold mt-1 text-green-600">
            {publishedCount}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-[var(--color-border)] p-5">
          <p className="text-sm text-amber-600">Entwurf</p>
          <p className="text-3xl font-semibold mt-1 text-amber-600">
            {draftCount}
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        <Link
          href="/admin/products"
          className="px-4 py-2 bg-white border border-[var(--color-border)] rounded hover:bg-[var(--color-bg-subtle)] transition-colors text-sm"
        >
          Alle Produkte anzeigen
        </Link>
        <Link
          href="/admin/products/new"
          className="px-4 py-2 bg-[var(--color-brand-red)] text-white rounded hover:opacity-90 transition-opacity text-sm"
        >
          Neues Produkt anlegen
        </Link>
      </div>
    </div>
  );
}
