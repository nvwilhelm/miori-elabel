import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <h1 className="text-3xl font-semibold text-[var(--color-brand-brown)] mb-4">
          miori E-Label
        </h1>
        <p className="text-[var(--color-text-muted)] mb-8">
          Digitale Etiketten fuer Wein und Spirituosen
          <br />
          gemaess EU-Verordnung 2021/2117
        </p>
        <Link
          href="/admin"
          className="inline-block px-6 py-3 bg-[var(--color-brand-red)] text-white rounded hover:opacity-90 transition-opacity"
        >
          Admin-Dashboard
        </Link>
      </div>
    </main>
  );
}
