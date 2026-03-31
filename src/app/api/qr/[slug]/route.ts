import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { generateQrSvg, generateQrPng } from "@/lib/qr";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  // Pruefen ob Produkt existiert
  const product = await db.query.products.findFirst({
    where: eq(products.slug, slug),
  });

  if (!product) {
    return Response.json({ error: "Produkt nicht gefunden" }, { status: 404 });
  }

  const format =
    request.nextUrl.searchParams.get("format") || "svg";

  if (format === "png") {
    const pngBuffer = await generateQrPng(slug);
    return new Response(new Uint8Array(pngBuffer), {
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": `attachment; filename="elabel-${slug}.png"`,
        "Cache-Control": "public, max-age=3600",
      },
    });
  }

  // Default: SVG
  const svg = await generateQrSvg(slug);
  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Content-Disposition": `attachment; filename="elabel-${slug}.svg"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
