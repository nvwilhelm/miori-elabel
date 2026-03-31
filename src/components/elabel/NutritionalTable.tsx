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

  const rows: { label: string; value: string; indent: boolean }[] = [
    {
      label: t.energy[locale],
      value: `${nutrition.energyKj} kJ / ${nutrition.energyKcal} kcal`,
      indent: false,
    },
  ];

  if (!negligible) {
    rows.push(
      { label: t.fat[locale], value: `${nutrition.fat} g`, indent: false },
      {
        label: t.saturated_fat[locale],
        value: `${nutrition.saturatedFat} g`,
        indent: true,
      }
    );
  }

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

  if (!negligible) {
    rows.push(
      { label: t.protein[locale], value: `${nutrition.protein} g`, indent: false },
      { label: t.salt[locale], value: `${nutrition.salt} g`, indent: false }
    );
  }

  return (
    <section className="mb-3">
      <h2 className="text-sm font-semibold mb-1">
        {t.nutritional_info[locale]}
      </h2>
      <p className="text-[10px] text-[var(--color-text-muted)] mb-1">
        {t.per_100ml[locale]}
      </p>
      <table className="w-full text-xs border-collapse">
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.label}
              className="border-b border-[var(--color-border)]"
            >
              <td
                className={`py-1 ${row.indent ? "pl-3 text-[var(--color-text-muted)]" : "font-medium"}`}
              >
                {row.label}
              </td>
              <td className="py-1 text-right tabular-nums">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {negligible && (
        <p className="text-[10px] mt-1 leading-relaxed text-[var(--color-text-muted)]">
          {t.negligible_amounts[locale]}
        </p>
      )}
    </section>
  );
}
