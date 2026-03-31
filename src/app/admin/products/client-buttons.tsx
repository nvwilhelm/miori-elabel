"use client";

import { togglePublish, deleteProduct } from "./actions";

export function TogglePublishButton({
  productId,
  isPublished,
}: {
  productId: string;
  isPublished: boolean;
}) {
  return (
    <button
      onClick={() => togglePublish(productId)}
      className={`text-xs px-2 py-1 rounded transition-colors ${
        isPublished
          ? "text-amber-700 hover:bg-amber-50"
          : "text-green-700 hover:bg-green-50"
      }`}
    >
      {isPublished ? "Deaktivieren" : "Aktivieren"}
    </button>
  );
}

export function DeleteButton({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  return (
    <button
      onClick={() => {
        if (
          confirm(`"${productName}" wirklich loeschen? Dies kann nicht rueckgaengig gemacht werden.`)
        ) {
          deleteProduct(productId);
        }
      }}
      className="text-xs text-red-600 hover:bg-red-50 px-2 py-1 rounded transition-colors"
    >
      Loeschen
    </button>
  );
}
