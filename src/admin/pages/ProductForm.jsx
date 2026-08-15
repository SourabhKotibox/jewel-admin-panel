import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Plus, Trash2, ChevronDown } from "lucide-react";
import { AdminCard, PrimaryButton, OutlineButton } from "../components/AdminUI";
import { MultiImageFieldInput } from "../components/ImageFieldInput";
import { api } from "../../api/client";
import { computeMarketPrice, DEFAULT_METAL_RATES } from "../../utils/metalPricing";
import useSettingsStore from "../../store/useSettingsStore";
import { formatPrice } from "../../data";

const emptyForm = {
  sku: "",
  name: "",
  slug: "",
  celeb: "",
  price: "",
  pricingMode: "market",
  netWeightGrams: "",
  makingChargeType: "percent",
  makingCharge: "",
  stoneCharge: "0",
  wastagePercent: "0",
  tag: "Made to Order",
  category: "",
  categoryId: "",
  jewelryType: "",
  description: "",
  imagesText: "",
  stock: "1",
  status: "Active",
  isPolki: false,
  isDiamond: false,
  isBridal: false,
  allowSplit: false,
  splitType: "percent",
  splitValue: "50",
  manageStock: true,
  hasVariants: false,
  variantAttribute: "",
};

const fieldClass =
  "w-full bg-ivory border border-champagne/25 px-4 py-2.5 text-sm outline-none focus:border-champagne transition-colors placeholder:text-noir/35";
const labelClass = "block text-[10px] uppercase tracking-widest2 text-noir/45 mb-1.5";

function parseImages(text) {
  return String(text || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Strip http(s)://host prefix so only /uploads/... is stored */
function toRelative(url) {
  if (!url) return "";
  try {
    const u = new URL(url);
    return u.pathname;
  } catch {
    return url; // already relative
  }
}

function attrsToObject(attrs) {
  if (!attrs) return {};
  if (attrs instanceof Map) return Object.fromEntries(attrs);
  return { ...attrs };
}

function AttrField({ attr, value, onChange, forceRequired }) {
  const required = forceRequired || !!attr.required;
  return (
    <div>
      <label className={labelClass}>
        {attr.name}
        {required ? " *" : ""}
      </label>
      {attr.type === "Select" ? (
        <select
          className={fieldClass}
          value={value || ""}
          required={required}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">Select…</option>
          {(attr.options || []).map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : attr.type === "Boolean" ? (
        <label className="flex items-center gap-2 text-sm mt-2">
          <input
            type="checkbox"
            checked={value === "true"}
            onChange={(e) => onChange(e.target.checked ? "true" : "false")}
            className="accent-champagne w-4 h-4"
          />
          Yes
        </label>
      ) : (
        <input
          type={attr.type === "Number" || attr.type === "Price" ? "number" : "text"}
          step={attr.type === "Number" ? "0.01" : undefined}
          className={fieldClass}
          value={value || ""}
          required={required}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id || id === "new";

  const [form, setForm] = useState({
    ...emptyForm,
    sku: `sku${Date.now().toString().slice(-5)}`,
  });
  const [attrValues, setAttrValues] = useState({});
  const [variants, setVariants] = useState([]);
  const [meta, setMeta] = useState({ categories: [], attributes: [], groups: [] });
  const [showMoreAttrs, setShowMoreAttrs] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);
  const metalRates = useSettingsStore((s) => s.metalRates) || DEFAULT_METAL_RATES;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await api("/catalog/meta", { portal: "admin" });
        if (!cancelled) setMeta(data);
      } catch {
        if (!cancelled) setMeta({ categories: [], attributes: [], groups: [] });
      }
      try {
        const settings = await api("/settings/admin", { portal: "admin" });
        if (!cancelled && settings?.metalRates) {
          useSettingsStore.getState().updateMetalRates(settings.metalRates);
        }
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (isNew) {
      setLoading(false);
      return undefined;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const p = await api(`/products/${id}`, { portal: "admin" });
        if (cancelled) return;
        setForm({
          sku: p.sku || p.id || "",
          name: p.name || "",
          slug: p.slug || "",
          celeb: p.celeb || "",
          price: String(p.basePrice ?? p.price ?? ""),
          pricingMode: p.pricingMode === "market" ? "market" : "fixed",
          netWeightGrams: p.netWeightGrams != null ? String(p.netWeightGrams) : "",
          makingChargeType: p.makingChargeType === "flat" ? "flat" : "percent",
          makingCharge: p.makingCharge != null ? String(p.makingCharge) : "",
          stoneCharge: String(p.stoneCharge ?? 0),
          wastagePercent: String(p.wastagePercent ?? 0),
          tag: p.tag || "Made to Order",
          category: p.category || "",
          categoryId: p.categoryId ? String(p.categoryId) : "",
          jewelryType: p.jewelryType || "",
          description: p.description || "",
          imagesText: (p.images || []).map(toRelative).filter(Boolean).join("\n"),
          stock: String(p.stock ?? 1),
          status: p.status || "Active",
          isPolki: !!p.isPolki,
          isDiamond: !!p.isDiamond,
          isBridal: !!p.isBridal,
          allowSplit: !!p.allowSplit,
          splitType: p.splitType === "amount" ? "amount" : "percent",
          splitValue: String(p.splitValue ?? 50),
          manageStock: p.manageStock !== false,
          hasVariants: !!p.hasVariants,
          variantAttribute: p.variantAttribute || "",
        });
        setAttrValues(attrsToObject(p.attributes || p.specifications));
        setVariants(
          (p.variants || []).map((v) => ({
            sku: v.sku,
            label: v.label || "",
            options: v.options || {},
            price: v.price ?? "",
            stock: String(v.stock ?? 0),
            status: v.status || "Active",
          }))
        );
        if (p.allowSplit || p.celeb) setShowAdvanced(true);
      } catch {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, isNew]);

  const selectedCategory = useMemo(() => {
    if (!meta.categories?.length) return null;
    return (
      meta.categories.find((c) => String(c.id) === String(form.categoryId)) ||
      meta.categories.find((c) => c.name === form.category) ||
      null
    );
  }, [meta.categories, form.categoryId, form.category]);

  const marketPreview = useMemo(() => {
    if (form.pricingMode !== "market") return null;
    return computeMarketPrice(
      {
        pricingMode: "market",
        netWeightGrams: form.netWeightGrams,
        makingChargeType: form.makingChargeType,
        makingCharge: form.makingCharge,
        stoneCharge: form.stoneCharge,
        wastagePercent: form.wastagePercent,
        price: form.price,
        attributes: attrValues,
      },
      metalRates
    );
  }, [form, attrValues, metalRates]);

  const variantAttrDef = selectedCategory?.variantAttr || null;
  const variantOptions = variantAttrDef?.options || [];
  const primaryAttrs = useMemo(() => {
    const list =
      selectedCategory?.primaryAttributes ||
      (selectedCategory?.primaryAttributeCodes || []).map((code) =>
        selectedCategory.attributes?.find((a) => a.code === code)
      ).filter(Boolean) ||
      [];
    return list.filter((a) => a.code !== selectedCategory?.variantAttribute);
  }, [selectedCategory]);

  const moreAttrs = useMemo(() => {
    if (!selectedCategory?.attributes) return [];
    const primaryCodes = new Set(primaryAttrs.map((a) => a.code));
    return selectedCategory.attributes.filter(
      (a) =>
        !primaryCodes.has(a.code) && a.code !== selectedCategory.variantAttribute
    );
  }, [selectedCategory, primaryAttrs]);

  const update = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleName = (e) => {
    const name = e.target.value;
    setForm((f) => ({
      ...f,
      name,
      slug: isNew
        ? name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "")
        : f.slug,
    }));
  };

  const onCategoryChange = (e) => {
    const catId = e.target.value;
    const cat = meta.categories.find((c) => String(c.id) === catId);
    setForm((f) => ({
      ...f,
      categoryId: catId,
      category: cat?.name || "",
      jewelryType: cat?.jewelryType || "",
      variantAttribute: cat?.variantAttribute || "",
      hasVariants: !!cat?.variantAttribute,
    }));
    setAttrValues({});
    setVariants([]);
    setShowMoreAttrs(false);
  };

  const addVariantRow = (optionValue) => {
    const label = String(optionValue);
    if (variants.some((v) => v.label === label)) return;
    const suffix = label.replace(/\s+/g, "").toLowerCase();
    setVariants((rows) => [
      ...rows,
      {
        sku: `${form.sku}-${suffix}`,
        label,
        options: { [selectedCategory.variantAttribute]: label },
        price: "",
        stock: "1",
        status: "Active",
      },
    ]);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.categoryId) {
      setError("Select a jewellery category first");
      return;
    }
    setSaving(true);
    setError("");
    const payload = {
      sku: form.sku,
      name: form.name,
      slug: form.slug,
      celeb: form.celeb,
      pricingMode: form.pricingMode === "market" ? "market" : "fixed",
      netWeightGrams:
        form.netWeightGrams === "" ? null : Number(form.netWeightGrams),
      makingChargeType: form.makingChargeType === "flat" ? "flat" : "percent",
      makingCharge: form.makingCharge === "" ? null : Number(form.makingCharge),
      stoneCharge: Number(form.stoneCharge) || 0,
      wastagePercent: Number(form.wastagePercent) || 0,
      price:
        form.pricingMode === "market" && marketPreview?.ok
          ? marketPreview.price
          : Number(form.price) || 0,
      tag: form.tag,
      category: form.category,
      categoryId: form.categoryId || undefined,
      jewelryType: form.jewelryType,
      description: form.description,
      images: parseImages(form.imagesText),
      stock: Number(form.stock) || 0,
      status: form.status,
      isPolki:
        !!form.isPolki ||
        /polki/i.test(attrValues.gemstone_type || "") ||
        /polki/i.test(form.category || ""),
      isDiamond:
        !!form.isDiamond ||
        /diamond/i.test(attrValues.gemstone_type || "") ||
        /diamond/i.test(form.category || ""),
      isBridal:
        !!form.isBridal ||
        /bridal|engagement/i.test(attrValues.occasion || "") ||
        /bridal|engagement/i.test(form.category || ""),
      allowSplit: !!form.allowSplit,
      splitType: form.splitType === "amount" ? "amount" : "percent",
      splitValue: Number(form.splitValue) || 0,
      manageStock: !!form.manageStock,
      hasVariants: variants.length > 0,
      variantAttribute: selectedCategory?.variantAttribute || "",
      attributes: attrValues,
      variants: variants.map((v) => ({
        sku: v.sku,
        label: v.label,
        options: v.options,
        price: v.price === "" ? null : Number(v.price),
        stock: Number(v.stock) || 0,
        status: Number(v.stock) > 0 ? "Active" : "Out of Stock",
      })),
    };
    try {
      if (isNew) {
        await api("/products", { method: "POST", body: payload, portal: "admin" });
      } else {
        await api(`/products/${id}`, { method: "PUT", body: payload, portal: "admin" });
      }
      setSaved(true);
      setTimeout(() => navigate("/admin/products"), 600);
    } catch (err) {
      setError(err.message || "Could not save product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-noir/45 py-16 text-center">Loading product…</p>;
  }
  if (notFound) {
    return (
      <div className="text-center py-20">
        <p className="font-display text-2xl text-noir mb-4">Product not found</p>
        <Link to="/admin/products" className="text-champagne-dark text-sm underline">
          Back to products
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-up max-w-3xl min-w-0">
      <button
        type="button"
        onClick={() => navigate("/admin/products")}
        className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest2 text-noir/50 hover:text-champagne-dark mb-6"
      >
        <ArrowLeft size={14} />
        Back to products
      </button>

      <form onSubmit={submit} className="space-y-5">
        <AdminCard title={isNew ? "New Product" : "Edit Product"}>
          <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={labelClass}>Product name *</label>
              <input
                name="name"
                value={form.name}
                onChange={handleName}
                required
                className={fieldClass}
                placeholder="e.g. Classic Polki Cocktail Ring"
              />
            </div>

            <div className="sm:col-span-2">
              <label className={labelClass}>Jewellery type / category *</label>
              <select
                name="categoryId"
                value={form.categoryId}
                onChange={onCategoryChange}
                required
                className={fieldClass}
              >
                <option value="">Select type first — form adapts…</option>
                {meta.categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label || c.name}
                  </option>
                ))}
              </select>
              {selectedCategory && (
                <p className="text-[11px] text-champagne-dark mt-1.5">
                  Showing fields for {selectedCategory.label || selectedCategory.name}
                  {selectedCategory.variantAttribute
                    ? ` · size stock via ${selectedCategory.variantAttr?.name || selectedCategory.variantAttribute}`
                    : ""}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className={labelClass}>Price source</label>
              <div className="flex flex-wrap gap-4 mt-1">
                {[
                  ["market", "Follow Market Rates (gold / silver)"],
                  ["fixed", "Fixed manual price"],
                ].map(([val, lab]) => (
                  <label key={val} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="pricingMode"
                      checked={form.pricingMode === val}
                      onChange={() => setForm((f) => ({ ...f, pricingMode: val }))}
                      className="accent-champagne"
                    />
                    {lab}
                  </label>
                ))}
              </div>
              <p className="text-[11px] text-noir/45 mt-1.5">
                Market prices update from{" "}
                <Link to="/admin/market-rates" className="text-champagne-dark underline">
                  Catalog → Market Rates
                </Link>{" "}
                when gold/silver rates change.
              </p>
            </div>

            {form.pricingMode === "market" ? (
              <>
                <div>
                  <label className={labelClass}>Net metal weight (g) *</label>
                  <input
                    name="netWeightGrams"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.netWeightGrams}
                    onChange={update}
                    required
                    className={fieldClass}
                    placeholder="e.g. 4.25"
                  />
                </div>
                <div>
                  <label className={labelClass}>Wastage %</label>
                  <input
                    name="wastagePercent"
                    type="number"
                    min="0"
                    step="0.1"
                    value={form.wastagePercent}
                    onChange={update}
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Making charge type</label>
                  <select
                    name="makingChargeType"
                    value={form.makingChargeType}
                    onChange={update}
                    className={fieldClass}
                  >
                    <option value="percent">% of metal cost</option>
                    <option value="flat">Flat INR</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>
                    Making {form.makingChargeType === "flat" ? "(₹)" : "(%)"}
                  </label>
                  <input
                    name="makingCharge"
                    type="number"
                    min="0"
                    step="0.1"
                    value={form.makingCharge}
                    onChange={update}
                    className={fieldClass}
                    placeholder={
                      form.makingChargeType === "flat"
                        ? "Flat amount"
                        : `Default ${metalRates.defaultMakingPercent ?? 12}%`
                    }
                  />
                </div>
                <div>
                  <label className={labelClass}>Stone / diamond charge (₹)</label>
                  <input
                    name="stoneCharge"
                    type="number"
                    min="0"
                    value={form.stoneCharge}
                    onChange={update}
                    className={fieldClass}
                  />
                </div>
                <div className="sm:col-span-2 rounded-sm border border-champagne/25 bg-champagne/5 px-4 py-3 text-sm">
                  {marketPreview?.ok ? (
                    <>
                      <p className="font-medium text-noir">
                        Live price: {formatPrice(marketPreview.price)}
                      </p>
                      <p className="text-[11px] text-noir/55 mt-1">
                        {marketPreview.breakdown.netWeight}g × ₹
                        {marketPreview.breakdown.ratePerGram}/g ({marketPreview.breakdown.metalPurity})
                        + making ₹{marketPreview.breakdown.making}
                        {marketPreview.breakdown.stoneCharge
                          ? ` + stone ₹${marketPreview.breakdown.stoneCharge}`
                          : ""}
                        . Rates from{" "}
                        <Link to="/admin/market-rates" className="underline text-champagne-dark">
                          Market Rates
                        </Link>
                        .
                      </p>
                    </>
                  ) : (
                    <p className="text-noir/55">
                      {marketPreview?.reason ||
                        "Set metal type, purity (attributes) and net weight to preview price."}
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div>
                <label className={labelClass}>Price (INR) *</label>
                <input
                  name="price"
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={update}
                  required
                  className={fieldClass}
                />
              </div>
            )}
            <div>
              <label className={labelClass}>
                {variants.length ? "Base stock (variants override)" : "Stock *"}
              </label>
              <input
                name="stock"
                type="number"
                min="0"
                value={form.stock}
                onChange={update}
                className={fieldClass}
                disabled={variants.length > 0}
              />
            </div>
            <div>
              <label className={labelClass}>SKU</label>
              <input
                name="sku"
                value={form.sku}
                onChange={update}
                required
                className={fieldClass}
                disabled={!isNew}
              />
            </div>
            <div>
              <label className={labelClass}>Availability</label>
              <select name="tag" value={form.tag} onChange={update} className={fieldClass}>
                <option>Ready to Ship</option>
                <option>Made to Order</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Short description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={update}
                rows={2}
                className={fieldClass}
                placeholder="One or two lines for the product page"
              />
            </div>
            <div className="sm:col-span-2">
              <MultiImageFieldInput
                label="Images"
                fieldKey="images"
                value={form.imagesText}
                onChange={(v) => setForm((f) => ({ ...f, imagesText: v }))}
                used="product"
                entityKey="products"
                previewAspect="aspect-[3/4]"
              />
            </div>
          </div>
        </AdminCard>

        {!selectedCategory && (
          <p className="text-sm text-noir/50 border border-dashed border-champagne/30 px-4 py-6 text-center">
            Select a category above to load metal, gemstone, and size fields for that jewellery type.
          </p>
        )}

        {selectedCategory && primaryAttrs.length > 0 && (
          <AdminCard title={`Essentials · ${selectedCategory.name}`}>
            <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {primaryAttrs.map((attr) => (
                <AttrField
                  key={attr.code}
                  attr={attr}
                  value={attrValues[attr.code]}
                  forceRequired={["metal_type", "metal_purity"].includes(attr.code)}
                  onChange={(v) => setAttrValues((prev) => ({ ...prev, [attr.code]: v }))}
                />
              ))}
            </div>
            {moreAttrs.length > 0 && (
              <div className="border-t border-champagne/10 px-4 sm:px-5 py-3">
                <button
                  type="button"
                  onClick={() => setShowMoreAttrs((v) => !v)}
                  className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest2 text-champagne-dark"
                >
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${showMoreAttrs ? "rotate-180" : ""}`}
                  />
                  {showMoreAttrs ? "Hide" : "Show"} more details ({moreAttrs.length})
                </button>
                {showMoreAttrs && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pb-2">
                    {moreAttrs.map((attr) => (
                      <AttrField
                        key={attr.code}
                        attr={attr}
                        value={attrValues[attr.code]}
                        onChange={(v) => setAttrValues((prev) => ({ ...prev, [attr.code]: v }))}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </AdminCard>
        )}

        {selectedCategory?.variantAttribute && (
          <AdminCard title={`${variantAttrDef?.name || "Sizes"} & stock`}>
            <div className="p-4 sm:p-5 space-y-3">
              <p className="text-xs text-noir/55">
                Add only the sizes you sell. Inventory syncs on save.
              </p>
              <div className="flex flex-wrap gap-2">
                <OutlineButton type="button" onClick={() => variantOptions.forEach(addVariantRow)}>
                  <Plus size={14} /> Add common sizes
                </OutlineButton>
                <select
                  className={`${fieldClass} !w-auto min-w-[140px]`}
                  defaultValue=""
                  onChange={(e) => {
                    if (e.target.value) {
                      addVariantRow(e.target.value);
                      e.target.value = "";
                    }
                  }}
                >
                  <option value="">Add size…</option>
                  {variantOptions.map((opt) => (
                    <option key={opt} value={opt} disabled={variants.some((v) => v.label === opt)}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              {variants.length > 0 && (
                <div className="overflow-x-auto border border-champagne/15 rounded-sm">
                  <table className="w-full text-sm min-w-[420px]">
                    <thead>
                      <tr className="bg-stone-50 text-[10px] uppercase tracking-widest2 text-noir/40 text-left">
                        <th className="px-3 py-2">Size</th>
                        <th className="px-3 py-2">SKU</th>
                        <th className="px-3 py-2 w-24">Stock</th>
                        <th className="px-3 py-2" />
                      </tr>
                    </thead>
                    <tbody>
                      {variants.map((v, idx) => (
                        <tr key={v.sku + idx} className="border-t border-champagne/10">
                          <td className="px-3 py-2 font-medium">{v.label}</td>
                          <td className="px-3 py-2">
                            <input
                              className={fieldClass}
                              value={v.sku}
                              onChange={(e) =>
                                setVariants((rows) =>
                                  rows.map((r, i) =>
                                    i === idx ? { ...r, sku: e.target.value } : r
                                  )
                                )
                              }
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="number"
                              min="0"
                              className={fieldClass}
                              value={v.stock}
                              onChange={(e) =>
                                setVariants((rows) =>
                                  rows.map((r, i) =>
                                    i === idx ? { ...r, stock: e.target.value } : r
                                  )
                                )
                              }
                            />
                          </td>
                          <td className="px-3 py-2">
                            <button
                              type="button"
                              onClick={() => setVariants((rows) => rows.filter((_, i) => i !== idx))}
                              className="text-rose-600 p-1"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </AdminCard>
        )}

        <div className="border border-champagne/15 bg-white rounded-2xl overflow-hidden">
          <button
            type="button"
            onClick={() => setShowAdvanced((v) => !v)}
            className="w-full px-5 py-3.5 flex items-center justify-between text-[11px] uppercase tracking-widest2 text-noir/60 hover:text-noir"
          >
            Advanced (split payment, celeb, status)
            <ChevronDown
              size={14}
              className={`transition-transform ${showAdvanced ? "rotate-180" : ""}`}
            />
          </button>
          {showAdvanced && (
            <div className="px-5 pb-5 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-champagne/10 pt-4">
              <div>
                <label className={labelClass}>Celebrity</label>
                <input name="celeb" value={form.celeb} onChange={update} className={fieldClass} />
              </div>
              <div>
                <label className={labelClass}>Status</label>
                <select name="status" value={form.status} onChange={update} className={fieldClass}>
                  <option>Active</option>
                  <option>Draft</option>
                  <option>Out of Stock</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Slug</label>
                <input name="slug" value={form.slug} onChange={update} className={fieldClass} />
              </div>
              <label className="flex items-center gap-2 text-sm self-end pb-2">
                <input
                  type="checkbox"
                  name="allowSplit"
                  checked={form.allowSplit}
                  onChange={update}
                  className="accent-champagne w-4 h-4"
                />
                Allow split / advance payment
              </label>
              <label className="flex items-center gap-2 text-sm self-end pb-2">
                <input
                  type="checkbox"
                  name="manageStock"
                  checked={form.manageStock}
                  onChange={update}
                  className="accent-champagne w-4 h-4"
                />
                Track stock (off = made-to-order, never blocks checkout)
              </label>
              {form.allowSplit && (
                <>
                  <div>
                    <label className={labelClass}>Advance type</label>
                    <select name="splitType" value={form.splitType} onChange={update} className={fieldClass}>
                      <option value="percent">Percent</option>
                      <option value="amount">Fixed ₹</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Value</label>
                    <input
                      name="splitValue"
                      type="number"
                      value={form.splitValue}
                      onChange={update}
                      className={fieldClass}
                    />
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {error && <p className="text-sm text-rose-600">{error}</p>}

        <div className="flex flex-col-reverse sm:flex-row gap-3">
          <PrimaryButton type="submit" disabled={saving} className="w-full sm:w-auto !justify-center">
            <Save size={14} />
            {saved ? "Saved" : saving ? "Saving…" : isNew ? "Create Product" : "Save Changes"}
          </PrimaryButton>
          <OutlineButton
            type="button"
            onClick={() => navigate("/admin/products")}
            className="w-full sm:w-auto !justify-center"
          >
            Cancel
          </OutlineButton>
        </div>
      </form>
    </div>
  );
}
