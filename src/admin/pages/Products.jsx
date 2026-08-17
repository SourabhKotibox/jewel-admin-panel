import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, Eye, FileDown } from "lucide-react";
import { formatPrice } from "../data/adminData";
import {
  AdminCard,
  PageToolbar,
  SearchInput,
  PrimaryButton,
  OutlineButton,
  StatusBadge,
  EmptyState,
} from "../components/AdminUI";
import { exportTablePdf, rowsFromObjects } from "../../utils/pdfExport";
import { api, assetUrl } from "../../api/client";

function resolveImg(src) {
  if (!src) return "";
  if (/^https?:\/\//i.test(src) || src.startsWith("data:")) return src;
  return assetUrl(src);
}

export default function Products() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const rows = await api("/products?all=1", { portal: "admin" });
      setItems(
        (Array.isArray(rows) ? rows : []).map((p) => ({
          ...p,
          id: p.sku || p.id || String(p._id),
        }))
      );
    } catch (err) {
      setError(err.message || "Could not load products");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const categories = useMemo(
    () => ["All", ...new Set(items.map((p) => p.category).filter(Boolean))],
    [items]
  );

  const filtered = items.filter((p) => {
    const q = query.toLowerCase();
    const matchesQuery =
      !q ||
      String(p.name || "")
        .toLowerCase()
        .includes(q) ||
      String(p.id || "")
        .toLowerCase()
        .includes(q) ||
      String(p.celeb || "")
        .toLowerCase()
        .includes(q);
    const matchesCat = category === "All" || p.category === category;
    return matchesQuery && matchesCat;
  });

  const remove = async (id) => {
    if (!window.confirm("Remove this product from the catalogue?")) return;
    try {
      await api(`/products/${id}`, { method: "DELETE", portal: "admin" });
      setItems((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err.message || "Delete failed");
    }
  };

  return (
    <div className="animate-fade-up">
      <PageToolbar>
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <SearchInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, SKU, celeb..."
          />
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-3 py-2 text-[10px] uppercase tracking-widest2 border transition-colors ${
                  category === cat
                    ? "bg-noir text-champagne border-champagne"
                    : "bg-white text-noir/60 border-champagne/20 hover:border-champagne"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <OutlineButton
            type="button"
            onClick={() =>
              exportTablePdf({
                title: "Madhu · Products",
                headers: ["SKU", "Name", "Category", "Tag", "Price"],
                rows: rowsFromObjects(filtered, ["id", "name", "category", "tag", "price"]),
                filename: "madhu-products.pdf",
              })
            }
          >
            <FileDown size={14} /> Export PDF
          </OutlineButton>
          <Link to="/admin/products/new">
            <PrimaryButton type="button">
              <Plus size={14} /> Add Product
            </PrimaryButton>
          </Link>
        </div>
      </PageToolbar>

      {error && <p className="text-sm text-rose-600 mb-4">{error}</p>}
      {loading ? (
        <p className="text-sm text-noir/45 py-16 text-center">Loading products…</p>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No products"
          description="Click Add Product to create the first one. Upload 1200×1600 (3:4) images for clean cards."
        />
      ) : (
        <AdminCard>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-champagne/15 text-left text-[10px] uppercase tracking-widest2 text-noir/40">
                  <th className="px-4 py-3">Image</th>
                  <th className="px-4 py-3">SKU</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Tag</th>
                  <th className="px-4 py-3 text-right">Price</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-b border-champagne/5 hover:bg-stone-50/80">
                     <td className="px-4 py-3">
                       <div className="flex items-center gap-1.5">
                         {p.images?.[0] ? (
                           <div className="relative w-12 aspect-[3/4] rounded-sm overflow-hidden bg-stone-100 flex-shrink-0">
                             <img
                               src={resolveImg(p.images[0])}
                               alt=""
                               className="w-full h-full object-cover"
                             />
                             <span className="absolute bottom-0.5 left-0.5 text-[7px] uppercase tracking-wider bg-noir/75 text-champagne px-1 rounded-sm">
                               Cover
                             </span>
                           </div>
                         ) : (
                           <div className="w-12 aspect-[3/4] rounded-sm bg-stone-100 flex-shrink-0" />
                         )}
                         {p.images?.length > 1 && (
                           <div className="flex flex-col gap-1">
                             {p.images.slice(1, 3).map((src, i) => (
                               <div
                                 key={`${src}-${i}`}
                                 className="w-8 aspect-[3/4] rounded-sm overflow-hidden bg-stone-100"
                               >
                                 <img
                                   src={resolveImg(src)}
                                   alt=""
                                   className="w-full h-full object-cover"
                                 />
                               </div>
                             ))}
                             {p.images.length > 3 && (
                               <div className="w-8 aspect-[3/4] rounded-sm bg-noir/60 text-champagne text-[9px] flex items-center justify-center font-mono">
                                 +{p.images.length - 3}
                               </div>
                             )}
                           </div>
                         )}
                       </div>
                     </td>
                    <td className="px-4 py-3 font-mono text-xs">{p.id}</td>
                    <td className="px-4 py-3 font-medium text-noir">{p.name}</td>
                    <td className="px-4 py-3 text-noir/60">{p.category}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={p.tag || p.status || "Active"} />
                    </td>
                    <td className="px-4 py-3 text-right">{formatPrice(p.price)}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/products/${p.slug || p.id}`}
                          target="_blank"
                          className="p-2 text-noir/40 hover:text-noir"
                          title="View"
                        >
                          <Eye size={16} />
                        </Link>
                        <Link
                          to={`/admin/products/${p.id}`}
                          className="p-2 text-noir/40 hover:text-champagne-dark"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => remove(p.id)}
                          className="p-2 text-noir/40 hover:text-rose-600"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AdminCard>
      )}
    </div>
  );
}
