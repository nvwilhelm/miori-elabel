import type { NutritionalValue } from "@/lib/db/schema";
import { UI_TRANSLATIONS, type Locale } from "@/lib/constants";
import { hasNegligibleAmounts } from "./NegligibleAmounts";

interface NutritionalTableProps {
  nutrition: NutritionalValue;
  locale: Locale;
}

export function NutritionalTable({
  nutrition,
  locale,
}: NutritionalTableProps) {
  const t = UI_TRANSLATIONS;
  const negligible = hasNegligibleAmounts(nutrition);

  // Immer angezeigte Zeilen: Energie, Kohlenhydrate, Zucker
  const rows: { label: string; value: string; indent: boolean }[] = [
    {
      label: t.energy[locale],
      value: `${nutrition.energyKj} kJ / ${nutrition.energyKcal} kcal`,
      indent: false,
    },
  ];

  // Fett + gesaettigte Fettsaeuren nur anzeigen wenn nicht vernachlaessigbar
  if (!negligible) {
    rows.push(
      {
        label: t.fat[locale],
        value: `${nutrition.fat} g`,
        indent: false,
      },
      {
        label: t.saturated_fat[locale],
        value: `${nutrition.saturatedFat} g`,
        indent: true,
      }
    );
  }

  // Kohlenhydrate und Zucker immer anzeigen
  rows.push(
    {
      label: t.carbohydrates[locale],
      value: `${nutrition.carbohydrates} g`,
      indent: false,
    },
    {
      label: t.sugars[locale],
      value: `${nutrition.sugars} g`,
      indent: true,
    }
  );

  // Eiweiss und Salz nur anzeigen wenn nicht vernachlaessigbar
  if (!negligible) {
    rows.push(
      {
        label: t.protein[locale],
        value: `${nutrition.protein} g`,
        indent: false,
      },
      {
        label: t.salt[locale],
        value: `${nutrition.salt} g`,
        indent: false,
      }
    );
  }

  return (
    <section className="mb-6">
      <h2 className="text-lg font-semibold mb-3">
        {t.nutritional_info[locale]}
      </h2>
      <p className="text-xs text-[var(--color-text-muted)] mb-2">
        {t.per_100ml[locale]}
      </p>
      <table className="w-full text-sm border-collapse">
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.label}
              className="border-b border-[var(--color-border)]"
            >
              <td
                className={`py-2 ${row.indent ? "pl-4 text-[var(--color-text-muted)]" : "font-medium"}`}
              >
                {row.label}
              </td>
              <td className="py-2 text-right tabular-nums">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {negligible && (
        <p
          className="text-xs mt-2 leading-relaxed"
          style={{ color: "var(--color-text-muted)" }}
        >
          {t.negligible_amounts[locale]}
        </p>
      )}
    </section>
  );
}
