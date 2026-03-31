export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { products, qrCodes } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function QRCodePage({ params }: PageProps) {
  const { id } = await params;

  const product = await db.query.products.findFirst({
    where: eq(products.id, id),
  });
  if (!product) notFound();

  const qrCode = await db.query.qrCodes.findFirst({
    where: eq(qrCodes.productId, id),
  });

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://elabel.miori.de";
  const labelUrl = `${baseUrl}/p/${product.slug}`;

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/products"
          className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
        >
          Zurueck
        </Link>
        <h1 className="text-2xl font-semibold">{product.name}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* QR-Code Vorschau */}
        <div className="bg-white rounded-lg border border-[var(--color-border)] p-6 text-center">
          <h2 className="text-lg font-semibold mb-4">QR-Code Vorschau</h2>

          {qrCode?.svgData ? (
            <div
              className="inline-block p-4 bg-white border border-[var(--color-border)] rounded"
              dangerouslySetInnerHTML={{ __html: qrCode.svgData }}
            />
          ) : (
            <p className="text-[var(--color-text-muted)]">
              Kein QR-Code generiert. Speichere das Produkt erneut.
            </p>
          )}

          <p className="mt-4 text-xs text-[var(--color-text-muted)] break-all">
            {labelUrl}
          </p>
        </div>

        {/* Download-Optionen */}
        <div className="bg-white rounded-lg border border-[var(--color-border)] p-6">
          <h2 className="text-lg font-semibold mb-4">Download</h2>
          <div className="space-y-3">
            <a
              href={`/api/qr/${product.slug}?format=svg`}
              download={`elabel-${product.slug}.svg`}
              className="flex items-center justify-between w-full px-4 py-3 border border-[var(--color-border)] rounded hover:bg-[var(--color-bg-subtle)] transition-colors"
            >
              <div>
                <p className="font-medium text-sm">SVG (Vektorgrafik)</p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  Fuer Druck — skalierbar ohne Qualitaetsverlust
                </p>
              </div>
              <span className="text-xs text-[var(--color-brand-brown)]">
                Download
              </span>
            </a>
            <a
              href={`/api/qr/${product.slug}?format=png`}
              download={`elabel-${product.slug}.png`}
              className="flex items-center justify-between w-full px-4 py-3 border border-[var(--color-border)] rounded hover:bg-[var(--color-bg-subtle)] transition-colors"
            >
              <div>
                <p className="font-medium text-sm">PNG (600px)</p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  Fuer digitale Nutzung
                </p>
              </div>
              <span className="text-xs text-[var(--color-brand-brown)]">
                Download
              </span>
            </a>
          </div>

          <div className="mt-6 pt-4 border-t border-[var(--color-border)]">
            <h3 className="text-sm font-medium mb-2">Hinweise zum Druck</h3>
            <ul className="text-xs text-[var(--color-text-muted)] space-y-1">
              <li>
                Mindestgroesse: 1,5 x 1,5 cm auf dem Etikett
              </li>
              <li>SVG-Format fuer maximale Druckqualitaet verwenden</li>
              <li>
                Ausreichend Kontrast zum Hintergrund sicherstellen
              </li>
            </ul>
          </div>

          {product.isPublished ? (
            <div className="mt-4 p-3 bg-green-50 rounded text-sm text-green-700">
              E-Label ist live und erreichbar unter:{" "}
              <a
                href={labelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                {labelUrl}
              </a>
            </div>
          ) : (
            <div className="mt-4 p-3 bg-amber-50 rounded text-sm text-amber-700">
              E-Label ist noch nicht veroeffentlicht. Aktiviere das
              Produkt, damit der QR-Code funktioniert.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
