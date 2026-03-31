export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import {
  products,
  nutritionalValues,
  ingredients,
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { ProductForm } from "@/components/admin/ProductForm";
import { updateProduct } from "../actions";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;

  const product = await db.query.products.findFirst({
    where: eq(products.id, id),
  });

  if (!product) notFound();

  const [nutrition, productIngredients] = await Promise.all([
    db.query.nutritionalValues.findFirst({
      where: eq(nutritionalValues.productId, id),
    }),
    db
      .select()
      .from(ingredients)
      .where(eq(ingredients.productId, id))
      .orderBy(ingredients.sortOrder),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">
        {product.name} bearbeiten
      </h1>
      <div className="bg-white rounded-lg border border-[var(--color-border)] p-6">
        <ProductForm
          action={updateProduct}
          product={product}
          nutrition={nutrition}
          ingredients={productIngredients}
        />
      </div>
    </div>
  );
}
