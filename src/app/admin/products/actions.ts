"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import {
  products,
  nutritionalValues,
  ingredients,
  qrCodes,
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { generateQrSvg } from "@/lib/qr";

// Slug aus Produktname generieren
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[äÄ]/g, "ae")
    .replace(/[öÖ]/g, "oe")
    .replace(/[üÜ]/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export interface ProductFormState {
  error?: string;
  success?: boolean;
}

export async function createProduct(
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  try {
    const name = formData.get("name") as string;
    if (!name) return { error: "Produktname ist erforderlich." };

    const slug =
      (formData.get("slug") as string) || slugify(name);
    const productType = formData.get("productType") as string;
    const wineType = (formData.get("wineType") as string) || null;
    const originCountry = formData.get("originCountry") as string;
    const originRegion =
      (formData.get("originRegion") as string) || null;
    const appellation =
      (formData.get("appellation") as string) || null;
    const vintageStr = formData.get("vintage") as string;
    const vintage = vintageStr ? parseInt(vintageStr, 10) : null;
    const alcoholStr = formData.get("alcoholPercentage") as string;
    const alcoholPercentage = alcoholStr || null;
    const volumeStr = formData.get("volumeMl") as string;
    const volumeMl = volumeStr ? parseInt(volumeStr, 10) : 750;
    const tasteProfile =
      (formData.get("tasteProfile") as string) || null;
    const producerName =
      (formData.get("producerName") as string) || null;
    const lotNumber = (formData.get("lotNumber") as string) || null;
    const ean = (formData.get("ean") as string) || null;
    const grapeVarietiesStr = formData.get("grapeVarieties") as string;
    const grapeVarieties = grapeVarietiesStr
      ? grapeVarietiesStr.split(",").map((s) => s.trim()).filter(Boolean)
      : null;
    const isPublished = formData.get("isPublished") === "on";

    // Produkt anlegen
    const [product] = await db
      .insert(products)
      .values({
        slug,
        name,
        productType,
        wineType,
        grapeVarieties,
        originCountry,
        originRegion,
        appellation,
        vintage,
        alcoholPercentage,
        volumeMl,
        tasteProfile,
        producerName,
        lotNumber,
        ean,
        isPublished,
      })
      .returning();

    // Naehrwerte anlegen
    const energyKj = formData.get("energyKj") as string;
    const energyKcal = formData.get("energyKcal") as string;
    if (energyKj && energyKcal) {
      await db.insert(nutritionalValues).values({
        productId: product.id,
        energyKj,
        energyKcal,
        fat: (formData.get("fat") as string) || "0",
        saturatedFat: (formData.get("saturatedFat") as string) || "0",
        carbohydrates: (formData.get("carbohydrates") as string) || "0",
        sugars: (formData.get("sugars") as string) || "0",
        protein: (formData.get("protein") as string) || "0",
        salt: (formData.get("salt") as string) || "0",
      });
    }

    // Zutaten anlegen
    const ingredientKeys = formData.getAll("ingredientKey") as string[];
    const ingredientAllergens = formData.getAll(
      "ingredientAllergen"
    ) as string[];
    const ingredientCategories = formData.getAll(
      "ingredientCategory"
    ) as string[];

    if (ingredientKeys.length > 0) {
      await db.insert(ingredients).values(
        ingredientKeys.map((key, index) => ({
          productId: product.id,
          nameKey: key,
          isAllergen: ingredientAllergens[index] === "true",
          functionalCategory: ingredientCategories[index] || null,
          sortOrder: index,
        }))
      );
    }

    // QR-Code generieren
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "https://elabel.miori.de";
    const svgData = await generateQrSvg(product.slug);
    await db.insert(qrCodes).values({
      productId: product.id,
      targetUrl: `${baseUrl}/p/${product.slug}`,
      svgData,
    });

    revalidatePath("/admin/products");
    revalidatePath(`/p/${product.slug}`);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unbekannter Fehler";
    if (message.includes("unique")) {
      return { error: "Ein Produkt mit diesem Slug existiert bereits." };
    }
    return { error: `Fehler beim Anlegen: ${message}` };
  }

  redirect("/admin/products");
}

export async function updateProduct(
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  try {
    const productId = formData.get("productId") as string;
    if (!productId) return { error: "Produkt-ID fehlt." };

    const name = formData.get("name") as string;
    if (!name) return { error: "Produktname ist erforderlich." };

    const slug = (formData.get("slug") as string) || slugify(name);
    const productType = formData.get("productType") as string;
    const wineType = (formData.get("wineType") as string) || null;
    const originCountry = formData.get("originCountry") as string;
    const originRegion =
      (formData.get("originRegion") as string) || null;
    const appellation =
      (formData.get("appellation") as string) || null;
    const vintageStr = formData.get("vintage") as string;
    const vintage = vintageStr ? parseInt(vintageStr, 10) : null;
    const alcoholStr = formData.get("alcoholPercentage") as string;
    const alcoholPercentage = alcoholStr || null;
    const volumeStr = formData.get("volumeMl") as string;
    const volumeMl = volumeStr ? parseInt(volumeStr, 10) : 750;
    const tasteProfile =
      (formData.get("tasteProfile") as string) || null;
    const producerName =
      (formData.get("producerName") as string) || null;
    const lotNumber = (formData.get("lotNumber") as string) || null;
    const ean = (formData.get("ean") as string) || null;
    const grapeVarietiesStr = formData.get("grapeVarieties") as string;
    const grapeVarieties = grapeVarietiesStr
      ? grapeVarietiesStr.split(",").map((s) => s.trim()).filter(Boolean)
      : null;
    const isPublished = formData.get("isPublished") === "on";

    // Produkt aktualisieren
    await db
      .update(products)
      .set({
        slug,
        name,
        productType,
        wineType,
        grapeVarieties,
        originCountry,
        originRegion,
        appellation,
        vintage,
        alcoholPercentage,
        volumeMl,
        tasteProfile,
        producerName,
        lotNumber,
        ean,
        isPublished,
        updatedAt: new Date(),
      })
      .where(eq(products.id, productId));

    // Naehrwerte aktualisieren (upsert)
    const energyKj = formData.get("energyKj") as string;
    const energyKcal = formData.get("energyKcal") as string;
    if (energyKj && energyKcal) {
      const existing = await db.query.nutritionalValues.findFirst({
        where: eq(nutritionalValues.productId, productId),
      });

      const nutritionData = {
        productId,
        energyKj,
        energyKcal,
        fat: (formData.get("fat") as string) || "0",
        saturatedFat: (formData.get("saturatedFat") as string) || "0",
        carbohydrates: (formData.get("carbohydrates") as string) || "0",
        sugars: (formData.get("sugars") as string) || "0",
        protein: (formData.get("protein") as string) || "0",
        salt: (formData.get("salt") as string) || "0",
        updatedAt: new Date(),
      };

      if (existing) {
        await db
          .update(nutritionalValues)
          .set(nutritionData)
          .where(eq(nutritionalValues.productId, productId));
      } else {
        await db.insert(nutritionalValues).values(nutritionData);
      }
    }

    // Zutaten: Loesche alte, fuege neue ein
    await db
      .delete(ingredients)
      .where(eq(ingredients.productId, productId));

    const ingredientKeys = formData.getAll("ingredientKey") as string[];
    const ingredientAllergens = formData.getAll(
      "ingredientAllergen"
    ) as string[];
    const ingredientCategories = formData.getAll(
      "ingredientCategory"
    ) as string[];

    if (ingredientKeys.length > 0) {
      await db.insert(ingredients).values(
        ingredientKeys.map((key, index) => ({
          productId,
          nameKey: key,
          isAllergen: ingredientAllergens[index] === "true",
          functionalCategory: ingredientCategories[index] || null,
          sortOrder: index,
        }))
      );
    }

    // QR-Code aktualisieren
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "https://elabel.miori.de";
    const svgData = await generateQrSvg(slug);
    const existingQr = await db.query.qrCodes.findFirst({
      where: eq(qrCodes.productId, productId),
    });

    if (existingQr) {
      await db
        .update(qrCodes)
        .set({
          targetUrl: `${baseUrl}/p/${slug}`,
          svgData,
          generatedAt: new Date(),
        })
        .where(eq(qrCodes.productId, productId));
    } else {
      await db.insert(qrCodes).values({
        productId,
        targetUrl: `${baseUrl}/p/${slug}`,
        svgData,
      });
    }

    revalidatePath("/admin/products");
    revalidatePath(`/p/${slug}`);

    return { success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unbekannter Fehler";
    return { error: `Fehler beim Speichern: ${message}` };
  }
}

export async function togglePublish(productId: string) {
  const product = await db.query.products.findFirst({
    where: eq(products.id, productId),
  });
  if (!product) return;

  await db
    .update(products)
    .set({
      isPublished: !product.isPublished,
      updatedAt: new Date(),
    })
    .where(eq(products.id, productId));

  revalidatePath("/admin/products");
  revalidatePath("/admin");
  revalidatePath(`/p/${product.slug}`);
}

export async function deleteProduct(productId: string) {
  const product = await db.query.products.findFirst({
    where: eq(products.id, productId),
  });

  await db.delete(products).where(eq(products.id, productId));

  revalidatePath("/admin/products");
  revalidatePath("/admin");
  if (product) {
    revalidatePath(`/p/${product.slug}`);
  }
}
