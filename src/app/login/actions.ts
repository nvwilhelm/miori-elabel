"use server";

import { redirect } from "next/navigation";
import { createSession, verifyPassword } from "@/lib/auth";

export async function loginAction(
  _prevState: string | null,
  formData: FormData
): Promise<string | null> {
  const password = formData.get("password") as string;
  const redirectPath = (formData.get("redirect") as string) || "/admin";

  if (!password) {
    return "Bitte Passwort eingeben.";
  }

  const valid = await verifyPassword(password);
  if (!valid) {
    return "Falsches Passwort.";
  }

  await createSession();
  redirect(redirectPath);
}
