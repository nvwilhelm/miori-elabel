import type { RecyclingMaterial } from "@/lib/db/schema";
import {
  RECYCLING_COMPONENTS,
  RECYCLING_MATERIALS,
  UI_TRANSLATIONS,
  type Locale,
} from "@/lib/constants";

interface RecyclingInfoProps {
  materials: RecyclingMaterial[];
  locale: Locale;
}

export function RecyclingInfo({ materials, locale }: RecyclingInfoProps) {
  if (materials.length === 0) return null;

  return (
    <section className="mb-3">
      <h2 className="text-sm font-semibold mb-1">
        {UI_TRANSLATIONS.recycling[locale]}
      </h2>
      <table className="w-full text-xs border-collapse">
        <tbody>
          {materials
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((item) => {
              const componentName =
                RECYCLING_COMPONENTS[
                  item.component as keyof typeof RECYCLING_COMPONENTS
                ]?.[locale] ?? item.component;
              const materialEntry =
                RECYCLING_MATERIALS[
                  item.material as keyof typeof RECYCLING_MATERIALS
                ];
              const materialName = materialEntry?.[locale] ?? item.material;
              const materialIcon = materialEntry?.icon ?? "";

              return (
                <tr
                  key={item.id}
                  className="border-b border-[var(--color-border)]"
                >
                  <td className="py-1 font-medium">{componentName}</td>
                  <td className="py-1 text-[var(--color-text-muted)]">
                    {materialName}
                  </td>
                  <td className="py-1 text-right">
                    <span
                      className="inline-flex items-center px-2 py-0.5 text-xs font-mono rounded"
                      style={{
                        backgroundColor: "var(--color-bg-subtle)",
                        color: "var(--color-text-muted)",
                      }}
                    >
                      {materialIcon}
                    </span>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </section>
  );
}
