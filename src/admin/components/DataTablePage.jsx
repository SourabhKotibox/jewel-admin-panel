import { useMemo, useState } from "react";
import {
  AdminCard,
  PageToolbar,
  SearchInput,
  StatusBadge,
  EmptyState,
  PrimaryButton,
} from "../components/AdminUI";

/**
 * Generic Bagisto-style list page
 * columns: [{ key, label, render?, className?, hide?: 'sm'|'md'|'lg' }]
 */
export default function DataTablePage({
  title,
  description,
  columns,
  rows,
  searchKeys = [],
  filters,
  filterKey,
  actions,
  onRowClick,
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState(filters?.[0] || "All");

  const filtered = useMemo(() => {
    return rows.filter((row) => {
      const q = query.toLowerCase();
      const matchesQuery =
        !q ||
        searchKeys.some((k) => String(row[k] ?? "").toLowerCase().includes(q));
      const matchesFilter =
        !filters || filter === "All" || row[filterKey] === filter;
      return matchesQuery && matchesFilter;
    });
  }, [rows, query, filter, filters, filterKey, searchKeys]);

  const hideClass = { sm: "hidden sm:table-cell", md: "hidden md:table-cell", lg: "hidden lg:table-cell" };

  return (
    <div className="animate-fade-up">
      <PageToolbar>
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <SearchInput value={query} onChange={(e) => setQuery(e.target.value)} placeholder={`Search ${title.toLowerCase()}...`} />
          {filters && (
            <div className="flex flex-wrap gap-2">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-2 text-[10px] uppercase tracking-widest2 border rounded-full transition-colors ${
                    filter === f
                      ? "bg-noir text-champagne border-champagne"
                      : "bg-white text-noir/60 border-champagne/20 hover:border-champagne"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          )}
        </div>
        {actions}
      </PageToolbar>

      {description && <p className="text-sm text-noir/50 -mt-3 mb-5">{description}</p>}

      <AdminCard>
        {filtered.length === 0 ? (
          <EmptyState title={`No ${title.toLowerCase()} found`} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-champagne/10 text-left">
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className={`px-5 py-3 text-[10px] uppercase tracking-widest2 text-noir/40 font-medium ${col.align === "right" ? "text-right" : ""} ${col.hide ? hideClass[col.hide] : ""}`}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, i) => (
                  <tr
                    key={row.id || i}
                    onClick={() => onRowClick?.(row)}
                    className={`border-b border-champagne/5 hover:bg-stone-50/80 transition-colors ${onRowClick ? "cursor-pointer" : ""}`}
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={`px-5 py-3.5 ${col.align === "right" ? "text-right" : ""} ${col.hide ? hideClass[col.hide] : ""}`}
                      >
                        {col.render
                          ? col.render(row)
                          : col.badge
                            ? <StatusBadge status={row[col.key]} />
                            : row[col.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="px-5 py-3 border-t border-champagne/10 text-xs text-noir/40">
          Showing {filtered.length} of {rows.length}
        </div>
      </AdminCard>
    </div>
  );
}

export { PrimaryButton };
