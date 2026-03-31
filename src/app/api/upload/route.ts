import { NextRequest } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

const UPLOAD_DIR = process.env.UPLOAD_DIR || "/app/uploads";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function POST(request: NextRequest) {
  // Einfache Auth-Pruefung via Cookie
  const session = request.cookies.get("elabel_session");
  if (!session?.value) {
    return Response.json({ error: "Nicht autorisiert" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return Response.json(
      { error: "Keine Datei hochgeladen" },
      { status: 400 }
    );
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return Response.json(
      { error: "Nur JPEG, PNG und WebP erlaubt" },
      { status: 400 }
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    return Response.json(
      { error: "Datei zu gross (max. 5 MB)" },
      { status: 400 }
    );
  }

  // Eindeutigen Dateinamen generieren
  const ext = file.name.split(".").pop() || "jpg";
  const filename = `${crypto.randomBytes(12).toString("hex")}.${ext}`;

  // Upload-Verzeichnis erstellen falls noetig
  await mkdir(UPLOAD_DIR, { recursive: true });

  // Datei speichern
  const buffer = Buffer.from(await file.arrayBuffer());
  const filepath = path.join(UPLOAD_DIR, filename);
  await writeFile(filepath, buffer);

  // URL zurueckgeben
  const url = `/api/uploads/${filename}`;
  return Response.json({ url, filename });
}
