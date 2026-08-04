import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Save, Gem, RefreshCw } from "lucide-react";
import useSettingsStore from "../../store/useSettingsStore";
import { AdminCard, PrimaryButton } from "../components/AdminUI";
import { api } from "../../api/client";
import notify from "../../utils/toast";
import { formatPrice } from "../../data";
import { DEFAULT_METAL_RATES, ratePerGram } from "../../utils/metalPricing";

const field =
  "w-full bg-ivory border border-champagne/25 px-4 py-2.5 text-sm outline-none focus:border-champagne transition-colors";
const label = "block text-[10px] uppercase tracking-widest2 text-noir/45 mb-1.5";

export default function MarketRates() {
  const metalRates = useSettingsStore((s) => s.metalRates) || DEFAULT_METAL_RATES;
  const updateMetalRates = useSettingsStore((s) => s.updateMetalRates);
  const [form, setForm] = useState({ ...DEFAULT_METAL_RATES, ...metalRates });
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const settings = await api("/settings/admin", { portal: "admin" });
        if (cancelled) return;
        const rates = { ...DEFAULT_METAL_RATES, ...(settings?.metalRates || {}) };
        updateMetalRates(rates);
        setForm(rates);
      } catch {
        setForm({ ...DEFAULT_METAL_RATES, ...metalRates });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setNum = (key, value) => {
    setForm((f) => ({ ...f, [key]: Number(value) || 0 }));
  };

  const derived = useMemo(
    () => ({
      gold22: ratePerGram("Yellow Gold", "22K", form),
      gold18: ratePerGram("Yellow Gold", "18K", form),
      gold14: ratePerGram("Yellow Gold", "14K", form),
      silver: ratePerGram("Silver", "925 Silver", form),
      platinum: ratePerGram("Platinum", "PT950", form),
    }),
    [form]
  );

  const save = async (e) => {
    e?.preventDefault?.();
    setSaving(true);
    setResult(null);
    try {
      const payload = {
        ...form,
        updatedAt: new Date().toISOString().slice(0, 10),
      };
      const res = await api("/settings/metal-rates", {
        method: "PUT",
        body: payload,
        portal: "admin",
      });
      const rates = res?.rates || payload;
      updateMetalRates(rates);
      setForm(rates);
      setResult({
        updated: res?.updated ?? 0,
        skipped: res?.skipped ?? 0,
        total: res?.total ?? 0,
      });
      notify.success(
        `Rates saved — ${res?.updated ?? 0} product price${(res?.updated ?? 0) === 1 ? "" : "s"} updated`
      );
    } catch (err) {
      notify.error(err.message || "Could not save market rates");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-noir/45 py-16 text-center">Loading market rates…</p>;
  }

  return (
    <div className="animate-fade-up max-w-4xl">
      <div className="mb-6">
        <p className="eyebrow mb-1">Catalog</p>
        <h1 className="font-display text-2xl md:text-3xl text-noir mb-2">Market rates</h1>
        <p className="text-sm text-noir/55 max-w-2xl">
          Update today’s gold, silver and platinum rates here. Saving recalculates every product that
          has a metal weight — storefront prices follow these rates automatically.
        </p>
      </div>

      <form onSubmit={save} className="space-y-6">
        <AdminCard title="Today’s metal rates (₹ per gram)">
          <div className="p-5 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                ["gold24kPerGram", "Gold 24K"],
                ["silver925PerGram", "Silver 925"],
                ["platinum950PerGram", "Platinum 950"],
              ].map(([key, lab]) => (
                <div key={key}>
                  <label className={label}>{lab}</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-noir/35 text-sm">
                      ₹
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className={`${field} pl-7`}
                      value={form[key] ?? ""}
                      onChange={(e) => setNum(key, e.target.value)}
                      required
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-sm border border-champagne/20 bg-champagne/5 px-4 py-3">
              <p className="text-[10px] uppercase tracking-widest2 text-noir/40 mb-2 flex items-center gap-2">
                <Gem size={12} /> Derived from 24K (auto)
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm text-noir/70">
                <div>
                  <span className="text-noir/40 text-[11px]">22K gold</span>
                  <p className="font-medium text-noir">{formatPrice(derived.gold22)}/g</p>
                </div>
                <div>
                  <span className="text-noir/40 text-[11px]">18K gold</span>
                  <p className="font-medium text-noir">{formatPrice(derived.gold18)}/g</p>
                </div>
                <div>
                  <span className="text-noir/40 text-[11px]">14K gold</span>
                  <p className="font-medium text-noir">{formatPrice(derived.gold14)}/g</p>
                </div>
                <div>
                  <span className="text-noir/40 text-[11px]">Silver 925</span>
                  <p className="font-medium text-noir">{formatPrice(derived.silver)}/g</p>
                </div>
                <div>
                  <span className="text-noir/40 text-[11px]">Platinum 950</span>
                  <p className="font-medium text-noir">{formatPrice(derived.platinum)}/g</p>
                </div>
              </div>
            </div>
          </div>
        </AdminCard>

        <AdminCard title="Making defaults (used when product doesn’t set its own)">
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={label}>Default making charge %</label>
              <input
                type="number"
                min="0"
                step="0.1"
                className={field}
                value={form.defaultMakingPercent ?? 12}
                onChange={(e) => setNum("defaultMakingPercent", e.target.value)}
              />
            </div>
            <div>
              <label className={label}>Default wastage %</label>
              <input
                type="number"
                min="0"
                step="0.1"
                className={field}
                value={form.defaultWastagePercent ?? 0}
                onChange={(e) => setNum("defaultWastagePercent", e.target.value)}
              />
            </div>
          </div>
        </AdminCard>

        {result && (
          <div className="rounded-sm border border-champagne/30 bg-white px-4 py-3 text-sm text-noir/70 flex items-start gap-3">
            <RefreshCw size={16} className="text-champagne-dark mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-noir">
                {result.updated} product{result.updated === 1 ? "" : "s"} repriced from these rates
              </p>
              <p className="text-[12px] text-noir/50 mt-0.5">
                {result.skipped} skipped (no metal weight yet) · {result.total} total in catalog.
                Add net weight on{" "}
                <Link to="/admin/products" className="text-champagne-dark underline">
                  products
                </Link>{" "}
                so they follow market rates.
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <PrimaryButton type="submit" disabled={saving}>
            <Save size={16} />
            {saving ? "Updating prices…" : "Save rates & update all products"}
          </PrimaryButton>
          {form.updatedAt && (
            <span className="text-xs text-noir/40">Last updated {form.updatedAt}</span>
          )}
        </div>
      </form>
    </div>
  );
}
