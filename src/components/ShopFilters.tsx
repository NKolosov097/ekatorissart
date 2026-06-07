import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export type KindFilter = "all" | "originals" | "prints";
export type StatusFilter = "all" | "available" | "sold";

interface Props {
  kind: KindFilter;
  status: StatusFilter;
}

function buildHref(kind: KindFilter, status: StatusFilter): string {
  const params = new URLSearchParams();
  if (kind !== "all") params.set("kind", kind);
  if (status !== "all") params.set("status", status);
  const qs = params.toString();
  return qs.length === 0 ? "/shop" : `/shop?${qs}`;
}

export function ShopFilters({ kind, status }: Props) {
  const t = useTranslations("shop");

  const kindTabs: ReadonlyArray<{ value: KindFilter; label: string }> = [
    { value: "all", label: t("filter_all") },
    { value: "originals", label: t("filter_originals") },
    { value: "prints", label: t("filter_prints") },
  ];

  const statusTabs: ReadonlyArray<{ value: StatusFilter; label: string }> = [
    { value: "all", label: t("filter_all") },
    { value: "available", label: t("filter_available") },
    { value: "sold", label: t("filter_sold") },
  ];

  return (
    <div className="mb-10 flex flex-wrap items-center gap-x-8 gap-y-4">
      <FilterRow
        label={t("filter_type_label")}
        tabs={kindTabs}
        active={kind}
        hrefFor={(value) => buildHref(value, status)}
      />
      <FilterRow
        label={t("filter_status_label")}
        tabs={statusTabs}
        active={status}
        hrefFor={(value) => buildHref(kind, value)}
      />
    </div>
  );
}

interface FilterRowProps<T extends string> {
  label: string;
  tabs: ReadonlyArray<{ value: T; label: string }>;
  active: T;
  hrefFor: (value: T) => string;
}

function FilterRow<T extends string>({ label, tabs, active, hrefFor }: FilterRowProps<T>) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] uppercase tracking-widest text-muted">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const isActive = tab.value === active;
          return (
            <Link
              key={tab.value}
              href={hrefFor(tab.value)}
              aria-current={isActive ? "page" : undefined}
              className={
                isActive
                  ? "border border-ink bg-ink text-bone px-3 py-1.5 text-xs uppercase tracking-widest"
                  : "border border-line bg-bone text-ink hover:border-ink px-3 py-1.5 text-xs uppercase tracking-widest transition"
              }
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
