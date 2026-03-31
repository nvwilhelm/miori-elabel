import { UI_TRANSLATIONS, type Locale } from "@/lib/constants";

interface LegalFooterProps {
  locale: Locale;
}

export function LegalFooter({ locale }: LegalFooterProps) {
  return (
    <footer className="mt-4 pt-2 border-t border-[var(--color-border)] text-center text-[10px] text-[var(--color-text-muted)] leading-relaxed">
      <p>{UI_TRANSLATIONS.privacy_notice[locale]}</p>
      <p>
        {UI_TRANSLATIONS.legal_basis[locale]} · miori GmbH, Saarbruecken
      </p>
    </footer>
  );
}
