import { UI_TRANSLATIONS, type Locale } from "@/lib/constants";

interface LegalFooterProps {
  locale: Locale;
}

export function LegalFooter({ locale }: LegalFooterProps) {
  return (
    <footer className="mt-8 pt-4 border-t border-[var(--color-border)] text-center text-xs text-[var(--color-text-muted)] space-y-1">
      <p>{UI_TRANSLATIONS.privacy_notice[locale]}</p>
      <p>{UI_TRANSLATIONS.legal_basis[locale]}</p>
      <p className="mt-2 opacity-60">miori GmbH — Saarbruecken</p>
    </footer>
  );
}
