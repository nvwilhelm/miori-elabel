"use client";

import { useState, useRef } from "react";

interface ImageUploadProps {
  currentUrl?: string | null;
  name: string;
}

export function ImageUpload({ currentUrl, name }: ImageUploadProps) {
  const [imageUrl, setImageUrl] = useState(currentUrl || "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(file: File) {
    setError("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Upload fehlgeschlagen");
        return;
      }

      const { url } = await res.json();
      setImageUrl(url);
    } catch {
      setError("Upload fehlgeschlagen");
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  }

  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        Foto vom Wein
      </label>
      <p className="text-xs text-[var(--color-text-muted)] mb-2">
        Optional. Keine Marketinginhalte erlaubt. Max. 5 MB (JPEG, PNG,
        WebP).
      </p>

      <input type="hidden" name={name} value={imageUrl} />

      <div className="flex gap-4 items-start">
        {/* Upload-Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="flex-1 border-2 border-dashed border-[var(--color-border)] rounded-lg p-4 text-center cursor-pointer hover:border-[var(--color-brand-brown)] transition-colors"
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />
          {uploading ? (
            <p className="text-sm text-[var(--color-text-muted)]">
              Wird hochgeladen...
            </p>
          ) : (
            <div>
              <p className="text-sm text-[var(--color-text-muted)]">
                Bild hierher ziehen oder klicken
              </p>
            </div>
          )}
        </div>

        {/* Vorschau */}
        {imageUrl && (
          <div className="shrink-0 relative">
            <img
              src={imageUrl}
              alt="Vorschau"
              className="w-20 h-28 object-contain border border-[var(--color-border)] rounded"
            />
            <button
              type="button"
              onClick={() => setImageUrl("")}
              className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
            >
              x
            </button>
          </div>
        )}
      </div>

      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}
