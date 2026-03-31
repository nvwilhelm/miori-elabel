import { NextRequest } from "next/server";
import { readFile, stat } from "fs/promises";
import path from "path";

const UPLOAD_DIR = process.env.UPLOAD_DIR || "/app/uploads";

const MIME_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;

  // Pfad-Traversal verhindern
  const safeName = path.basename(filename);
  const filepath = path.join(UPLOAD_DIR, safeName);

  try {
    await stat(filepath);
  } catch {
    return new Response("Nicht gefunden", { status: 404 });
  }

  const ext = safeName.split(".").pop()?.toLowerCase() || "jpg";
  const contentType = MIME_TYPES[ext] || "application/octet-stream";

  const buffer = await readFile(filepath);
  return new Response(buffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
