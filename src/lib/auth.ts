import { cookies } from "next/headers";
import crypto from "crypto";

const SESSION_COOKIE = "elabel_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 Tage

// Session-Token erstellen und als Cookie setzen
export async function createSession(): Promise<void> {
  const token = crypto.randomBytes(32).toString("hex");
  const secret = process.env.ADMIN_SESSION_SECRET!;

  // HMAC-signiertes Token
  const signature = crypto
    .createHmac("sha256", secret)
    .update(token)
    .digest("hex");
  const sessionValue = `${token}.${signature}`;

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, sessionValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

// Session validieren
export async function validateSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);

  if (!session?.value) return false;

  const [token, signature] = session.value.split(".");
  if (!token || !signature) return false;

  const secret = process.env.ADMIN_SESSION_SECRET!;
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(token)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(signature, "hex"),
    Buffer.from(expectedSignature, "hex")
  );
}

// Session loeschen (Logout)
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

// Passwort pruefen (einfacher Vergleich mit Hash aus Env)
export async function verifyPassword(password: string): Promise<boolean> {
  const storedHash = process.env.ADMIN_PASSWORD_HASH!;
  // Einfacher SHA-256 Hash-Vergleich (kein bcrypt noetig fuer einzelnen Admin-User)
  const inputHash = crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");
  return crypto.timingSafeEqual(
    Buffer.from(inputHash),
    Buffer.from(storedHash)
  );
}
