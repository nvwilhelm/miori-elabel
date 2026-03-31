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
    <main className="min-h-screen flex items-center justify-center bg-[var(--admin-bg)] p-4">
      <div
        className="w-full max-w-sm bg-[var(--admin-card)] rounded-xl p-8"
        style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}
      >
        {/* Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-[var(--admin-accent)]">
              miori
            </span>
            <span className="text-[10px] font-medium text-[var(--color-text-muted)] uppercase tracking-widest">
              E-Label
            </span>
          </div>
          <p className="text-sm text-[var(--color-text-muted)] mt-2">
            Im Admin-Bereich anmelden
          </p>
        </div>

        <form action={formAction} className="space-y-5">
          <input type="hidden" name="redirect" value={redirect} />

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[var(--color-text)] mb-1.5"
            >
              Passwort
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoFocus
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--admin-accent)] focus:border-transparent transition-shadow placeholder:text-gray-400"
              placeholder="Admin-Passwort eingeben"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-100 rounded-lg">
              <svg className="w-4 h-4 text-[var(--admin-danger)] shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-2.5 bg-[var(--admin-accent)] text-white rounded-lg font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
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
