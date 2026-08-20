import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Plus, Pencil, Trash2, FileDown } from "lucide-react";
import {
  AdminCard,
  PageToolbar,
  SearchInput,
  StatusBadge,
  EmptyState,
  PrimaryButton,
  OutlineButton,
} from "./AdminUI";
import { exportTablePdf, rowsFromObjects } from "../../utils/pdfExport";
import useCrudStore from "../store/useCrudStore";
import { entityConfigs } from "../data/entityConfigs.jsx";
import notify from "../../utils/toast";
import { canWriteEntity } from "../data/adminAccess";

/**
 * List-only CRUD page — Add / Edit go to separate routes.
 * Loads rows from API when available. Responsive: cards on mobile, table on md+.
 */
export default function CrudPage({ entityKey, ...override }) {
  const cfg = { ...(entityConfigs[entityKey] || {}), ...override };
  const {
    title,
    description,
    columns = [],
    searchKeys = [],
    filters,
    filterKey = "status",
    basePath,
    editPath,
    pdfKeys,
    pdfHeaders,
    extraActions,
  } = cfg;

  const toEdit = (id) =>
    typeof editPath === "function" ? editPath(id) : `${basePath}/${id}`;
  const toNew = () => `${basePath}/new`;

  const navigate = useNavigate();
  const role = useSelector((s) => s.auth.user?.role);
  const canWrite = canWriteEntity(role, entityKey);
  const rows = useCrudStore((s) => s.getRows(entityKey));
  const removeRow = useCrudStore((s) => s.remove);
  const fetchEntity = useCrudStore((s) => s.fetchEntity);
  const loading = useCrudStore((s) => s.loading[entityKey]);
  const apiError = useCrudStore((s) => s.error);
  const hydrated = useCrudStore((s) => s.hydrated[entityKey]);

  useEffect(() => {
    if (entityKey) fetchEntity(entityKey);
  }, [entityKey, fetchEntity]);

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState(filters?.[0] || "All");

  const filtered = rows.filter((row) => {
    const q = query.toLowerCase();
    const matchesQuery =
      !q ||
      searchKeys.some((k) => String(row[k] ?? "").toLowerCase().includes(q));
    const matchesFilter =
      !filters || filter === "All" || row[filterKey] === filter;
    return matchesQuery && matchesFilter;
  });

  const remove = async (id) => {
    if (!window.confirm(`Delete this ${cfg.singular?.toLowerCase() || "item"}?`)) return;
    try {
      await removeRow(entityKey, id);
      notify.success(`${cfg.singular || "Item"} deleted`);
    } catch (err) {
      notify.error(err.message || "Delete failed");
    }
  };

  const exportPdf = () => {
    const keys = pdfKeys || columns.map((c) => c.key).filter(Boolean);
    const headers = pdfHeaders || columns.filter((c) => keys.includes(c.key)).map((c) => c.label);
    exportTablePdf({
      title: `Madhu · ${title}`,
      subtitle: `${filtered.length} records`,
      headers,
      rows: rowsFromObjects(filtered, keys),
      filename: `madhu-${title.toLowerCase().replace(/\s+/g, "-")}.pdf`,
    });
  };

  const hideClass = {
    sm: "hidden sm:table-cell",
    md: "hidden md:table-cell",
    lg: "hidden lg:table-cell",
  };

  const renderCell = (col, row) => {
    if (col.render) return col.render(row);
    if (col.badge) return <StatusBadge status={row[col.key]} />;
    const val = row[col.key];
    if (val == null || val === "") return "—";
    if (typeof val === "boolean") return val ? "Yes" : "No";
    return String(val);
  };

  const primaryCols = columns.filter((c) => !c.hide).slice(0, 2);
  const secondaryCols = columns.filter((c) => c.hide);

  return (
    <div className="animate-fade-up space-y-4 sm:space-y-6 min-w-0 w-full max-w-full">
      <PageToolbar>
        <div className="flex flex-col gap-3 flex-1 min-w-0 w-full">
          <SearchInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${title?.toLowerCase() || ""}...`}
            className="w-full sm:max-w-sm"
          />
          {filters && (
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {filters.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={`px-2.5 sm:px-3 py-1.5 sm:py-2 text-[10px] uppercase tracking-widest2 border rounded-full transition-colors whitespace-nowrap ${
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
        <div className="flex flex-col xs:flex-row sm:flex-row gap-2 w-full sm:w-auto shrink-0">
          <OutlineButton type="button" onClick={exportPdf} className="w-full sm:w-auto !justify-center">
            <FileDown size={14} />
            <span className="sm:inline">Export PDF</span>
          </OutlineButton>
          {canWrite ? (
            <PrimaryButton type="button" onClick={() => navigate(toNew())} className="w-full sm:w-auto !justify-center">
              <Plus size={14} /> Add {cfg.singular || "Item"}
            </PrimaryButton>
          ) : (
            <p className="text-[10px] uppercase tracking-widest2 text-noir/40 self-center px-2">
              View only
            </p>
          )}
        </div>
      </PageToolbar>

      {description && (
        <p className="text-sm text-noir/50 -mt-1 sm:-mt-3 leading-relaxed break-words">
          {description}
        </p>
      )}
      {apiError && !hydrated && (
        <p className="text-sm text-rose-600 -mt-2 break-words">
          Could not load from API ({apiError}). Start the backend and login as admin, then refresh.
        </p>
      )}

      <AdminCard className="min-w-0">
        {loading && filtered.length === 0 ? (
          <EmptyState title="Loading…" description="Fetching from API" />
        ) : filtered.length === 0 ? (
          <EmptyState
            title={`No ${title?.toLowerCase() || "items"} found`}
            description="Click Add to create the first one."
          />
        ) : (
          <>
            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-champagne/10">
              {filtered.map((row) => (
                <div key={row.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      {primaryCols.map((col) => (
                        <div key={col.key} className="min-w-0">
                          {col.key === primaryCols[0]?.key ? (
                            <div className="font-medium text-noir break-words">
                              {renderCell(col, row)}
                            </div>
                          ) : (
                            <div className="text-xs text-noir/50 mt-1 break-all font-mono">
                              {renderCell(col, row)}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                     {canWrite ? (
                       <div className="flex items-center gap-0.5 shrink-0">
                         {extraActions?.(row, entityKey)}
                         <Link
                           to={toEdit(row.id)}
                           className="p-2 rounded-xl text-noir/40 hover:text-champagne-dark hover:bg-champagne/10"
                           title="Edit"
                         >
                           <Pencil size={15} />
                         </Link>
                         <button
                           type="button"
                           onClick={() => remove(row.id)}
                           className="p-2 rounded-xl text-noir/40 hover:text-rose-600 hover:bg-rose-50"
                           title="Delete"
                         >
                           <Trash2 size={15} />
                         </button>
                       </div>
                     ) : null}
                  </div>
                  <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                    {secondaryCols.map((col) => (
                      <div key={col.key} className="min-w-0 col-span-2 sm:col-span-1">
                        <dt className="text-[10px] uppercase tracking-widest2 text-noir/35 mb-0.5">
                          {col.label}
                        </dt>
                        <dd className="text-noir/70 break-words line-clamp-3">
                          {col.badge ? (
                            <StatusBadge status={row[col.key]} />
                          ) : (
                            renderCell(col, row)
                          )}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto max-w-full">
              <table className="w-full text-sm min-w-[640px]">
                <thead>
                  <tr className="border-b border-champagne/10 text-left">
                    {columns.map((col) => (
                      <th
                        key={col.key}
                        className={`px-4 lg:px-5 py-3 text-[10px] uppercase tracking-widest2 text-noir/40 font-medium whitespace-nowrap ${
                          col.align === "right" ? "text-right" : ""
                        } ${col.hide ? hideClass[col.hide] : ""}`}
                      >
                        {col.label}
                      </th>
                    ))}
                    <th className="px-4 lg:px-5 py-3 text-[10px] uppercase tracking-widest2 text-noir/40 font-medium text-right whitespace-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-champagne/5 hover:bg-stone-50/80 transition-colors"
                    >
                      {columns.map((col) => (
                        <td
                          key={col.key}
                          className={`px-4 lg:px-5 py-3.5 max-w-[220px] ${
                            col.align === "right" ? "text-right" : ""
                          } ${col.hide ? hideClass[col.hide] : ""}`}
                        >
                          <div className="truncate" title={String(row[col.key] ?? "")}>
                            {renderCell(col, row)}
                          </div>
                        </td>
                      ))}
                      <td className="px-4 lg:px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          {canWrite ? (
                            <>
                              {extraActions?.(row, entityKey, { toggleHidden })}
                              <Link
                                to={toEdit(row.id)}
                                className="p-2 rounded-xl text-noir/40 hover:text-champagne-dark hover:bg-champagne/10"
                                title="Edit"
                              >
                                <Pencil size={15} />
                              </Link>
                              <button
                                type="button"
                                onClick={() => remove(row.id)}
                                className="p-2 rounded-xl text-noir/40 hover:text-rose-600 hover:bg-rose-50"
                                title="Delete"
                              >
                                <Trash2 size={15} />
                              </button>
                            </>
                          ) : (
                            <span className="text-[10px] text-noir/35 uppercase tracking-widest2">View</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        <div className="px-4 sm:px-5 py-3 border-t border-champagne/10 text-xs text-noir/40 flex flex-wrap justify-between gap-2">
          <span>
            Showing {filtered.length} of {rows.length}
          </span>
          <button
            type="button"
            onClick={exportPdf}
            className="text-champagne-dark hover:underline inline-flex items-center gap-1"
          >
            <FileDown size={12} /> PDF
          </button>
        </div>
      </AdminCard>
    </div>
  );
}

export { PrimaryButton };
