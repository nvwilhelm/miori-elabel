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
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[var(--color-text)]">
          Willkommen zurueck
        </h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          Hier ist eine Uebersicht deiner E-Labels.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {/* Gesamt */}
        <div
          className="bg-[var(--admin-card)] rounded-xl p-6 transition-shadow duration-200 hover:shadow-[var(--admin-card-shadow-hover)]"
          style={{ boxShadow: "var(--admin-card-shadow)" }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-[var(--color-text-muted)]">Gesamt</p>
          <p className="text-3xl font-semibold mt-1 text-[var(--color-text)]">
            {totalCount}
          </p>
        </div>

        {/* Veroeffentlicht */}
        <div
          className="bg-[var(--admin-card)] rounded-xl p-6 transition-shadow duration-200 hover:shadow-[var(--admin-card-shadow-hover)]"
          style={{ boxShadow: "var(--admin-card-shadow)" }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-[var(--admin-success)]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-[var(--color-text-muted)]">Veroeffentlicht</p>
          <p className="text-3xl font-semibold mt-1 text-[var(--admin-success)]">
            {publishedCount}
          </p>
        </div>

        {/* Entwurf */}
        <div
          className="bg-[var(--admin-card)] rounded-xl p-6 transition-shadow duration-200 hover:shadow-[var(--admin-card-shadow-hover)]"
          style={{ boxShadow: "var(--admin-card-shadow)" }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-[var(--admin-warning)]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-[var(--color-text-muted)]">Entwurf</p>
          <p className="text-3xl font-semibold mt-1 text-[var(--admin-warning)]">
            {draftCount}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--admin-accent)] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Neues Produkt
        </Link>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 border border-[var(--color-border)] bg-white text-[var(--color-text)] rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Alle Produkte
        </Link>
      </div>
    </div>
  );
}
