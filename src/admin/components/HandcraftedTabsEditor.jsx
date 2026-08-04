import { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  GripVertical,
  Save,
  Loader2,
} from "lucide-react";
import { api, assetUrl } from "../../api/client";
import { OutlineButton, PrimaryButton, fieldClass, labelClass } from "../components/AdminUI";
import ImageFieldInput from "./ImageFieldInput";

function resolveImg(src) {
  if (!src) return "";
  if (/^https?:\/\//i.test(src) || src.startsWith("data:")) return src;
  return assetUrl(src);
}

/**
 * Admin editor: define home Handcrafted tabs, URL + Multer image, products.
 * Preview is handled by the parent section (shown only on Preview click).
 */
export default function HandcraftedTabsEditor({ tabs, onChange, onSaveTab }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const rows = await api("/products?all=1", { portal: "admin" });
        if (!cancelled) setProducts(Array.isArray(rows) ? rows : []);
      } catch {
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const list = Array.isArray(tabs) ? tabs : [];
  const safeIdx = Math.min(activeIdx, Math.max(0, list.length - 1));
  const current = list[safeIdx];

  const updateTab = (idx, patch) => {
    onChange(list.map((t, i) => (i === idx ? { ...t, ...patch } : t)));
  };

  const addTab = () => {
    const id = `tab-${Date.now()}`;
    onChange([
      ...list,
      { id, enabled: true, label: `New Tab ${list.length + 1}`, image: "", productSkus: [] },
    ]);
    setActiveIdx(list.length);
  };

  const removeTab = (idx) => {
    if (list.length <= 1) return;
    onChange(list.filter((_, i) => i !== idx));
    setActiveIdx(Math.max(0, idx - 1));
  };

  const moveTab = (idx, dir) => {
    const j = idx + dir;
    if (j < 0 || j >= list.length) return;
    const next = [...list];
    [next[idx], next[j]] = [next[j], next[idx]];
    onChange(next);
    setActiveIdx(j);
  };

  const toggleProduct = (sku) => {
    if (!current) return;
    const skus = current.productSkus || [];
    const has = skus.includes(sku);
    updateTab(safeIdx, {
      productSkus: has ? skus.filter((s) => s !== sku) : [...skus, sku],
    });
  };

  const moveProduct = (sku, dir) => {
    if (!current) return;
    const skus = [...(current.productSkus || [])];
    const i = skus.indexOf(sku);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= skus.length) return;
    [skus[i], skus[j]] = [skus[j], skus[i]];
    updateTab(safeIdx, { productSkus: skus });
  };

  const productBySku = (sku) =>
    products.find((p) => p.sku === sku || p.id === sku || String(p._id) === sku);


  const saveCurrentTab = async () => {
    if (!current || !onSaveTab) return;
    setSaving(true);
    setSaveError("");
    setSaveMsg("");
    try {
      await onSaveTab(list, current);
      setSaveMsg(`“${current.label || "Tab"}” saved to live site`);
      setTimeout(() => setSaveMsg(""), 2200);
    } catch (err) {
      setSaveError(err.message || "Could not save tab");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-5 space-y-5">
      <p className="text-sm text-noir/55">
        Each tab has its own label, image (URL or upload), and products. Use{" "}
        <strong>Preview</strong> on this section to see how it looks live.{" "}
        <strong>Save this tab</strong> pushes the tab set to the home page.
      </p>

      <div className="flex flex-wrap gap-2 items-center">
        {list.map((tab, idx) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveIdx(idx)}
            className={`px-4 py-2 text-[11px] uppercase tracking-widest2 rounded-full border transition-colors ${
              safeIdx === idx
                ? "bg-noir text-champagne border-champagne"
                : tab.enabled === false
                  ? "bg-stone-100 text-noir/35 border-stone-200"
                  : "bg-white text-noir/60 border-champagne/25 hover:border-champagne"
            }`}
          >
            {tab.label || `Tab ${idx + 1}`}
            {tab.enabled === false ? " (off)" : ""}
          </button>
        ))}
        <OutlineButton type="button" onClick={addTab} className="!py-2 !px-3">
          <Plus size={14} /> Add tab
        </OutlineButton>
      </div>

      {current && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 border border-champagne/15 rounded-2xl p-5 bg-stone-50/50">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[10px] uppercase tracking-widest2 text-noir/40 font-medium">
                Tab {safeIdx + 1} settings
              </p>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => moveTab(safeIdx, -1)}
                  className="p-2 rounded-lg hover:bg-white text-noir/40"
                  title="Move tab left"
                >
                  <ChevronUp size={16} className="-rotate-90" />
                </button>
                <button
                  type="button"
                  onClick={() => moveTab(safeIdx, 1)}
                  className="p-2 rounded-lg hover:bg-white text-noir/40"
                  title="Move tab right"
                >
                  <ChevronDown size={16} className="-rotate-90" />
                </button>
                <button
                  type="button"
                  onClick={() => removeTab(safeIdx)}
                  className="p-2 rounded-lg hover:bg-rose-50 text-noir/40 hover:text-rose-600"
                  title="Delete tab"
                  disabled={list.length <= 1}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={current.enabled !== false}
                onChange={(e) => updateTab(safeIdx, { enabled: e.target.checked })}
                className="accent-champagne w-4 h-4"
              />
              Show this tab on the home page
            </label>

            <div>
              <label className={labelClass}>Tab label</label>
              <input
                className={fieldClass}
                value={current.label || ""}
                onChange={(e) => updateTab(safeIdx, { label: e.target.value })}
                placeholder="e.g. Necklaces"
              />
            </div>

            <ImageFieldInput
              label="Tab image"
              fieldKey="image"
              value={current.image || ""}
              onChange={(v) => updateTab(safeIdx, { image: v })}
              used={`home-handcrafted-tab:${current.id || current.label || "tab"}`}
            />

            <div>
              <label className={labelClass}>
                Selected products ({(current.productSkus || []).length})
              </label>
              {(current.productSkus || []).length === 0 ? (
                <p className="text-xs text-noir/40">No products selected yet.</p>
              ) : (
                <ul className="space-y-2 mt-2">
                  {(current.productSkus || []).map((sku) => {
                    const p = productBySku(sku);
                    return (
                      <li
                        key={sku}
                        className="flex items-center gap-2 bg-white border border-champagne/15 rounded-xl px-3 py-2 text-sm"
                      >
                        <GripVertical size={14} className="text-noir/25 shrink-0" />
                        <span className="flex-1 min-w-0 truncate font-medium">
                          {p?.name || sku}
                          <span className="block text-[10px] font-mono text-noir/35">{sku}</span>
                        </span>
                        <button
                          type="button"
                          className="p-1 text-noir/35 hover:text-noir"
                          onClick={() => moveProduct(sku, -1)}
                        >
                          <ChevronUp size={14} />
                        </button>
                        <button
                          type="button"
                          className="p-1 text-noir/35 hover:text-noir"
                          onClick={() => moveProduct(sku, 1)}
                        >
                          <ChevronDown size={14} />
                        </button>
                        <button
                          type="button"
                          className="p-1 text-noir/35 hover:text-rose-600"
                          onClick={() => toggleProduct(sku)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="pt-2 border-t border-champagne/15 space-y-2">
              <PrimaryButton
                type="button"
                disabled={saving || !onSaveTab}
                onClick={saveCurrentTab}
              >
                {saving ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> Saving…
                  </>
                ) : (
                  <>
                    <Save size={14} /> Save this tab
                  </>
                )}
              </PrimaryButton>
              {saveMsg && <p className="text-xs text-emerald-700">{saveMsg}</p>}
              {saveError && <p className="text-xs text-rose-600">{saveError}</p>}
            </div>
          </div>

          <div>
            <label className={labelClass}>Catalogue — tick to show in this tab</label>
            {loading ? (
              <p className="text-sm text-noir/40">Loading products…</p>
            ) : products.length === 0 ? (
              <p className="text-sm text-noir/40">
                No products in API. Add products under Admin → Products first.
              </p>
            ) : (
              <div className="max-h-[480px] overflow-y-auto space-y-1 border border-champagne/15 rounded-xl bg-white p-2">
                {products.map((p) => {
                  const sku = p.sku || p.id || String(p._id);
                  const checked = (current.productSkus || []).includes(sku);
                  return (
                    <label
                      key={sku}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-sm transition-colors ${
                        checked ? "bg-champagne/10" : "hover:bg-stone-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleProduct(sku)}
                        className="accent-champagne w-4 h-4 shrink-0"
                      />
                      {p.images?.[0] ? (
                        <img
                          src={resolveImg(p.images[0])}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-stone-100 shrink-0" />
                      )}
                      <span className="min-w-0 flex-1">
                        <span className="font-medium text-noir block truncate">{p.name}</span>
                        <span className="text-[10px] text-noir/40 font-mono">
                          {sku}
                          {p.category ? ` · ${p.category}` : ""}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
