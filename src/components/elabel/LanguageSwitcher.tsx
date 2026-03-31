"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { LOCALES, type Locale } from "@/lib/constants";

interface LanguageSwitcherProps {
  current: Locale;
}

const LOCALE_LABELS: Record<string, string> = {
  de: "DE",
  en: "EN",
};

export function LanguageSwitcher({ current }: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function switchLocale(locale: Locale) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("lang", locale);
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex justify-center gap-2 mb-6">
      {LOCALES.map((locale) => (
        <button
          key={locale}
          onClick={() => switchLocale(locale)}
          className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
            current === locale
              ? "bg-[var(--color-brand-brown)] text-white"
              : "bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)] hover:bg-[var(--color-border)]"
          }`}
        >
          {LOCALE_LABELS[locale] ?? locale.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
