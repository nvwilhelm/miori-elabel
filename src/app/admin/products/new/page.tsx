import { ProductForm } from "@/components/admin/ProductForm";
import { createProduct } from "../actions";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Neues Produkt anlegen</h1>
      <div className="bg-white rounded-lg border border-[var(--color-border)] p-6">
        <ProductForm action={createProduct} />
      </div>
    </div>
  );
}
