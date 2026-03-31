import Link from "next/link";
import { validateSession, destroySession } from "@/lib/auth";
import { redirect } from "next/navigation";

async function logoutAction() {
  "use server";
  await destroySession();
  redirect("/login");
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isValid = await validateSession();
  if (!isValid) {
    redirect("/login?redirect=/admin");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-[var(--color-border)] px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/admin"
              className="text-lg font-semibold text-[var(--color-brand-brown)]"
            >
              miori E-Label
            </Link>
            <nav className="flex gap-4 text-sm">
              <Link
                href="/admin/products"
                className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
              >
                Produkte
              </Link>
            </nav>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
            >
              Abmelden
            </button>
          </form>
        </div>
      </header>
      <main className="flex-1 bg-[var(--color-bg-subtle)]">
        <div className="max-w-6xl mx-auto px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
