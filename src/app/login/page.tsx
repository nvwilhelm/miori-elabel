"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { loginAction } from "./actions";

function LoginForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/admin";
  const [error, formAction, isPending] = useActionState(loginAction, null);

  return (
    <main className="flex-1 flex items-center justify-center p-8">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-center text-[var(--color-brand-brown)] mb-8">
          miori E-Label
        </h1>

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="redirect" value={redirect} />

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Passwort
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoFocus
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-brown)] focus:border-transparent"
              placeholder="Admin-Passwort eingeben"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-2.5 bg-[var(--color-brand-red)] text-white rounded font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isPending ? "Anmelden..." : "Anmelden"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
