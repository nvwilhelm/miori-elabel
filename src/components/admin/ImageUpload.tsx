"use client";

import { useState, useRef, useCallback } from "react";

// Seitenverhaeltnisse wie bei e-label.eu
const ASPECT_RATIOS = [
  { label: "Frei", value: "free", ratio: null },
  { label: "1:1 (Quadrat)", value: "1:1", ratio: 1 },
  { label: "3:4 (Hochformat)", value: "3:4", ratio: 3 / 4 },
  { label: "2:3 (Flasche)", value: "2:3", ratio: 2 / 3 },
  { label: "4:3 (Querformat)", value: "4:3", ratio: 4 / 3 },
  { label: "16:9 (Breitbild)", value: "16:9", ratio: 16 / 9 },
] as const;

interface ImageUploadProps {
  currentUrl?: string | null;
  name: string;
}

export function ImageUpload({ currentUrl, name }: ImageUploadProps) {
  const [imageUrl, setImageUrl] = useState(currentUrl || "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [aspectRatio, setAspectRatio] = useState("free");

  // Crop-State
  const [rawImage, setRawImage] = useState<string | null>(null);
  const [rawFile, setRawFile] = useState<File | null>(null);
  const [cropOffset, setCropOffset] = useState({ x: 0.5, y: 0.5 }); // 0-1, Mittelpunkt

  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const selectedRatio = ASPECT_RATIOS.find((r) => r.value === aspectRatio);

  // Bild auf Canvas zuschneiden und als Blob zurueckgeben
  const cropAndUpload = useCallback(
    async (file: File, ratioValue: string, cx: number, cy: number) => {
      const ratio = ASPECT_RATIOS.find((r) => r.value === ratioValue);
      if (!ratio?.ratio) {
        // Frei: direkt hochladen ohne Crop
        return uploadFile(file);
      }

      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      return new Promise<void>((resolve) => {
        img.onload = async () => {
          URL.revokeObjectURL(objectUrl);

          const canvas = canvasRef.current;
          if (!canvas) return;

          const targetRatio = ratio.ratio;
          const imgRatio = img.width / img.height;

          let srcW: number, srcH: number, srcX: number, srcY: number;

          if (imgRatio > targetRatio) {
            // Bild ist breiter als Ziel → horizontal beschneiden
            srcH = img.height;
            srcW = Math.round(srcH * targetRatio);
            srcX = Math.round((img.width - srcW) * cx);
            srcY = 0;
          } else {
            // Bild ist hoeher als Ziel → vertikal beschneiden
            srcW = img.width;
            srcH = Math.round(srcW / targetRatio);
            srcX = 0;
            srcY = Math.round((img.height - srcH) * cy);
          }

          // Max 1200px Breite fuer Ausgabe
          const outW = Math.min(srcW, 1200);
          const outH = Math.round(outW / targetRatio);

          canvas.width = outW;
          canvas.height = outH;

          const ctx = canvas.getContext("2d");
          if (!ctx) return;

          ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, outW, outH);

          canvas.toBlob(
            async (blob) => {
              if (!blob) return;
              const croppedFile = new File(
                [blob],
                file.name.replace(/\.\w+$/, ".webp"),
                { type: "image/webp" }
              );
              await uploadFile(croppedFile);
              resolve();
            },
            "image/webp",
            0.85
          );
        };
        img.src = objectUrl;
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  async function uploadFile(file: File) {
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
      setRawImage(null);
      setRawFile(null);
    } catch {
      setError("Upload fehlgeschlagen");
    } finally {
      setUploading(false);
    }
  }

  function handleFileSelect(file: File) {
    setError("");
    const ratio = ASPECT_RATIOS.find((r) => r.value === aspectRatio);

    if (!ratio?.ratio) {
      // Frei: sofort hochladen
      uploadFile(file);
      return;
    }

    // Mit Seitenverhaeltnis: Vorschau anzeigen, dann croppen
    const reader = new FileReader();
    reader.onload = (e) => {
      setRawImage(e.target?.result as string);
      setRawFile(file);
      setCropOffset({ x: 0.5, y: 0.5 });
    };
    reader.readAsDataURL(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  }

  // Vorschau-Bereich Klick → Crop-Position verschieben
  function handlePreviewClick(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setCropOffset({
      x: Math.max(0, Math.min(1, x)),
      y: Math.max(0, Math.min(1, y)),
    });
  }

  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        Foto vom Wein
      </label>
      <p className="text-xs text-[var(--color-text-muted)] mb-2">
        Optional. Keine Marketinginhalte erlaubt. Max. 5 MB.
      </p>

      <input type="hidden" name={name} value={imageUrl} />
      <canvas ref={canvasRef} className="hidden" />

      {/* Seitenverhaeltnis */}
      <div className="mb-3">
        <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1">
          Seitenverhaeltnis
        </label>
        <div className="flex flex-wrap gap-1.5">
          {ASPECT_RATIOS.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => setAspectRatio(r.value)}
              className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                aspectRatio === r.value
                  ? "bg-[var(--color-brand-brown)] text-white border-[var(--color-brand-brown)]"
                  : "bg-white text-[var(--color-text-muted)] border-[var(--color-border)] hover:border-[var(--color-brand-brown)]"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-4 items-start">
        {/* Upload-Zone */}
        {!rawImage && (
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
              <div className="py-2">
                <svg
                  className="w-8 h-8 mx-auto mb-2 text-[var(--color-border)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z"
                  />
                </svg>
                <p className="text-sm text-[var(--color-text-muted)]">
                  Bild hierher ziehen oder klicken
                </p>
                <p className="text-[10px] text-[var(--color-text-muted)] mt-1">
                  JPEG, PNG, WebP — max. 5 MB
                </p>
              </div>
            )}
          </div>
        )}

        {/* Crop-Vorschau: Bild auswaehlen, Position anpassen, dann hochladen */}
        {rawImage && !imageUrl && (
          <div className="flex-1 space-y-3">
            <div className="relative border border-[var(--color-border)] rounded overflow-hidden">
              <p className="text-[10px] text-[var(--color-text-muted)] px-2 py-1 bg-[var(--color-bg-subtle)]">
                Klicke auf das Bild um den Ausschnitt zu verschieben
              </p>
              <div
                className="relative cursor-crosshair"
                onClick={handlePreviewClick}
                style={{ maxHeight: 240 }}
              >
                <img
                  src={rawImage}
                  alt="Vorschau"
                  className="w-full"
                  style={{
                    maxHeight: 240,
                    objectFit: "cover",
                    objectPosition: `${cropOffset.x * 100}% ${cropOffset.y * 100}%`,
                    aspectRatio: selectedRatio?.ratio
                      ? String(selectedRatio.ratio)
                      : undefined,
                  }}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={uploading}
                onClick={() => {
                  if (rawFile)
                    cropAndUpload(
                      rawFile,
                      aspectRatio,
                      cropOffset.x,
                      cropOffset.y
                    );
                }}
                className="flex-1 py-2 bg-[var(--color-brand-red)] text-white rounded text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {uploading ? "Wird zugeschnitten..." : "Zuschneiden & Hochladen"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setRawImage(null);
                  setRawFile(null);
                }}
                className="px-3 py-2 border border-[var(--color-border)] rounded text-sm text-[var(--color-text-muted)] hover:bg-[var(--color-bg-subtle)]"
              >
                Abbrechen
              </button>
            </div>
          </div>
        )}

        {/* Fertiges Bild */}
        {imageUrl && (
          <div className="shrink-0 relative">
            <img
              src={imageUrl}
              alt="Vorschau"
              className="w-24 h-auto max-h-36 object-contain border border-[var(--color-border)] rounded"
            />
            <button
              type="button"
              onClick={() => {
                setImageUrl("");
                setRawImage(null);
                setRawFile(null);
              }}
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
