import { useEffect, useState } from "react";
import {
  Save,
  CreditCard,
  Building2,
  Truck,
  Bell,
  Store,
  Shield,
  ToggleLeft,
  ToggleRight,
  Wallet,
} from "lucide-react";
import useSettingsStore from "../../store/useSettingsStore";
import { AdminCard, PrimaryButton, StatusBadge } from "../components/AdminUI";
import { api } from "../../api/client";
import notify from "../../utils/toast";
import clsx from "clsx";

/** Storefront only uses these for now */
const ACTIVE_GATEWAYS = ["razorpay", "cashOnDelivery", "partialPayment"];

const field =
  "w-full bg-ivory border border-champagne/25 px-4 py-2.5 text-sm outline-none focus:border-champagne transition-colors";
const label = "block text-[10px] uppercase tracking-widest2 text-noir/45 mb-1.5";

const tabs = [
  { id: "general", label: "General", icon: Store },
  { id: "payments", label: "Payment Gateways", icon: CreditCard },
  { id: "shipping", label: "Shipping", icon: Truck },
  { id: "commerce", label: "Taxes & Commerce", icon: Building2 },
  { id: "notifications", label: "Notifications", icon: Bell },
];

const gatewayMeta = {
  razorpay: { color: "border-[#072654]/30", badge: "India" },
  stripe: { color: "border-[#635BFF]/30", badge: "Global" },
  payu: { color: "border-[#4A90D9]/30", badge: "India" },
  paypal: { color: "border-[#003087]/30", badge: "Global" },
  cashOnDelivery: { color: "border-champagne/30", badge: "Offline" },
  bankTransfer: { color: "border-champagne/30", badge: "Offline" },
  partialPayment: { color: "border-maroon/20", badge: "Advance" },
};

function Toggle({ on, onClick }) {
  return (
    <button type="button" onClick={onClick} className="text-champagne-dark" aria-label="Toggle">
      {on ? <ToggleRight size={28} /> : <ToggleLeft size={28} className="text-noir/25" />}
    </button>
  );
}

export default function Settings() {
  const [tab, setTab] = useState("payments");
  const [saved, setSaved] = useState(false);
  const [openGateway, setOpenGateway] = useState("razorpay");

  const general = useSettingsStore((s) => s.general);
  const commerce = useSettingsStore((s) => s.commerce);
  const payments = useSettingsStore((s) => s.payments);
  const mail = useSettingsStore((s) => s.mail);
  const notifications = useSettingsStore((s) => s.notifications);
  const shipping = useSettingsStore((s) => s.shipping);
  const business = useSettingsStore((s) => s.business);
  const updateGeneral = useSettingsStore((s) => s.updateGeneral);
  const updateCommerce = useSettingsStore((s) => s.updateCommerce);
  const updatePayment = useSettingsStore((s) => s.updatePayment);
  const togglePayment = useSettingsStore((s) => s.togglePayment);
  const updateShippingMethod = useSettingsStore((s) => s.updateShippingMethod);
  const updateShiprocket = useSettingsStore((s) => s.updateShiprocket);
  const updateNotifications = useSettingsStore((s) => s.updateNotifications);
  const shiprocket = shipping.shiprocket || {};

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const settings = await api("/settings/admin", { portal: "admin" });
        if (cancelled || !settings) return;
        if (settings.general) updateGeneral(settings.general);
        if (settings.commerce) updateCommerce(settings.commerce);
      } catch {
        /* keep local defaults */
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = async (e) => {
    e?.preventDefault?.();
    try {
      await api("/settings/bulk", {
        method: "PUT",
        body: {
          payments: {
            razorpay: payments.razorpay,
            cashOnDelivery: payments.cashOnDelivery,
            partialPayment: payments.partialPayment,
          },
          shiprocket: {
            enabled: !!shiprocket.enabled,
            email: shiprocket.email || "",
            password: shiprocket.password || "",
            token: shiprocket.token || "",
            pickupLocation: shiprocket.pickupLocation || "Primary",
          },
          commerce,
          general,
          business,
          mail,
          notifications,
        },
        portal: "admin",
      });
      notify.success("Settings saved to server");
    } catch {
      notify.info("Saved locally — server sync failed");
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <div className="animate-fade-up max-w-5xl">
      <div className="mb-6">
        <p className="eyebrow mb-1">Configuration</p>
        <p className="text-sm text-noir/55">
          Store identity, payment gateways, shipping methods and tax rules — Bagisto-style.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 mb-6 border-b border-champagne/15 pb-px">
        {tabs.map(({ id, label: tabLabel, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={clsx(
              "inline-flex items-center gap-2 px-4 py-3 text-[11px] uppercase tracking-widest2 border-b-2 -mb-px transition-colors",
              tab === id
                ? "border-champagne text-noir"
                : "border-transparent text-noir/40 hover:text-noir"
            )}
          >
            <Icon size={14} />
            <span className="hidden sm:inline">{tabLabel}</span>
          </button>
        ))}
      </div>

      <form onSubmit={save} className="space-y-6">
        {tab === "general" && (
          <AdminCard title="Store Identity">
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                ["storeName", "Store Name"],
                ["tagline", "Tagline"],
                ["supportEmail", "Support Email"],
                ["supportPhone", "Support Phone"],
                ["whatsapp", "WhatsApp (country code)"],
                ["timezone", "Timezone"],
                ["currency", "Default Currency"],
                ["defaultLocale", "Default Locale"],
              ].map(([key, lab]) => (
                <div key={key}>
                  <label className={label}>{lab}</label>
                  <input
                    className={field}
                    value={general[key]}
                    onChange={(e) => updateGeneral({ [key]: e.target.value })}
                  />
                </div>
              ))}
            </div>
          </AdminCard>
        )}

        {tab === "payments" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-noir/55 mb-2">
              <Shield size={16} className="text-champagne-dark" />
              Storefront shows Razorpay + COD only. Save syncs keys to the API for live checkout.
            </div>

            {ACTIVE_GATEWAYS.filter((k) => payments[k]).map((key) => {
              const gw = payments[key];
              const meta = gatewayMeta[key] || {};
              const isOpen = openGateway === key;
              return (
                <div
                  key={key}
                  className={clsx(
                    "bg-white border overflow-hidden transition-shadow",
                    gw.enabled ? "border-champagne/40 shadow-sm" : "border-champagne/10 opacity-90"
                  )}
                >
                  <div className="flex items-center gap-4 px-5 py-4">
                    <div className="w-10 h-10 flex items-center justify-center bg-noir text-champagne shrink-0">
                      <Wallet size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-display text-xl text-noir">{gw.title}</h3>
                        <StatusBadge status={gw.enabled ? "Active" : "Draft"} />
                        {meta.badge && (
                          <span className="text-[10px] uppercase tracking-widest2 text-noir/35 border border-noir/10 px-2 py-0.5">
                            {meta.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-noir/45 mt-0.5 truncate">{gw.description}</p>
                    </div>
                    <Toggle on={gw.enabled} onClick={() => togglePayment(key)} />
                    <button
                      type="button"
                      onClick={() => setOpenGateway(isOpen ? null : key)}
                      className="text-[10px] uppercase tracking-widest2 text-champagne-dark px-2"
                    >
                      {isOpen ? "Hide" : "Configure"}
                    </button>
                  </div>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-2 border-t border-champagne/10 grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-50/50">
                      <div>
                        <label className={label}>Display Title</label>
                        <input
                          className={field}
                          value={gw.title}
                          onChange={(e) => updatePayment(key, { title: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className={label}>Description</label>
                        <input
                          className={field}
                          value={gw.description}
                          onChange={(e) => updatePayment(key, { description: e.target.value })}
                        />
                      </div>

                      {key === "razorpay" && (
                        <>
                          <div>
                            <label className={label}>Key ID</label>
                            <input
                              className={field}
                              placeholder="rzp_live_xxxx"
                              value={gw.keyId}
                              onChange={(e) => updatePayment(key, { keyId: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className={label}>Key Secret</label>
                            <input
                              type="password"
                              className={field}
                              placeholder="••••••••"
                              value={gw.keySecret}
                              onChange={(e) => updatePayment(key, { keySecret: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className={label}>Webhook Secret</label>
                            <input
                              type="password"
                              className={field}
                              value={gw.webhookSecret}
                              onChange={(e) => updatePayment(key, { webhookSecret: e.target.value })}
                            />
                          </div>
                          <label className="flex items-center gap-2 text-sm mt-6 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={gw.testMode}
                              onChange={(e) => updatePayment(key, { testMode: e.target.checked })}
                              className="accent-champagne w-4 h-4"
                            />
                            Test / Sandbox mode
                          </label>
                        </>
                      )}

                      {key === "stripe" && (
                        <>
                          <div>
                            <label className={label}>Publishable Key</label>
                            <input
                              className={field}
                              value={gw.publishableKey}
                              onChange={(e) => updatePayment(key, { publishableKey: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className={label}>Secret Key</label>
                            <input
                              type="password"
                              className={field}
                              value={gw.secretKey}
                              onChange={(e) => updatePayment(key, { secretKey: e.target.value })}
                            />
                          </div>
                          <label className="flex items-center gap-2 text-sm mt-6 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={gw.testMode}
                              onChange={(e) => updatePayment(key, { testMode: e.target.checked })}
                              className="accent-champagne w-4 h-4"
                            />
                            Test mode
                          </label>
                        </>
                      )}

                      {key === "payu" && (
                        <>
                          <div>
                            <label className={label}>Merchant Key</label>
                            <input
                              className={field}
                              value={gw.merchantKey}
                              onChange={(e) => updatePayment(key, { merchantKey: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className={label}>Merchant Salt</label>
                            <input
                              type="password"
                              className={field}
                              value={gw.merchantSalt}
                              onChange={(e) => updatePayment(key, { merchantSalt: e.target.value })}
                            />
                          </div>
                        </>
                      )}

                      {key === "paypal" && (
                        <>
                          <div>
                            <label className={label}>Client ID</label>
                            <input
                              className={field}
                              value={gw.clientId}
                              onChange={(e) => updatePayment(key, { clientId: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className={label}>Secret</label>
                            <input
                              type="password"
                              className={field}
                              value={gw.secret}
                              onChange={(e) => updatePayment(key, { secret: e.target.value })}
                            />
                          </div>
                        </>
                      )}

                      {key === "bankTransfer" && (
                        <>
                          <div>
                            <label className={label}>Account Name</label>
                            <input
                              className={field}
                              value={gw.accountName}
                              onChange={(e) => updatePayment(key, { accountName: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className={label}>Account Number</label>
                            <input
                              className={field}
                              value={gw.accountNumber}
                              onChange={(e) => updatePayment(key, { accountNumber: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className={label}>IFSC</label>
                            <input
                              className={field}
                              value={gw.ifsc}
                              onChange={(e) => updatePayment(key, { ifsc: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className={label}>Bank Name</label>
                            <input
                              className={field}
                              value={gw.bankName}
                              onChange={(e) => updatePayment(key, { bankName: e.target.value })}
                            />
                          </div>
                        </>
                      )}

                      {key === "cashOnDelivery" && (
                        <>
                          <div>
                            <label className={label}>Min Order (INR)</label>
                            <input
                              type="number"
                              className={field}
                              value={gw.minOrder}
                              onChange={(e) => updatePayment(key, { minOrder: Number(e.target.value) })}
                            />
                          </div>
                          <div>
                            <label className={label}>Max Order (INR)</label>
                            <input
                              type="number"
                              className={field}
                              value={gw.maxOrder}
                              onChange={(e) => updatePayment(key, { maxOrder: Number(e.target.value) })}
                            />
                          </div>
                        </>
                      )}

                      {key === "partialPayment" && (
                        <div>
                          <label className={label}>Advance Percent (%)</label>
                          <input
                            type="number"
                            min="1"
                            max="99"
                            className={field}
                            value={gw.advancePercent}
                            onChange={(e) =>
                              updatePayment(key, { advancePercent: Number(e.target.value) })
                            }
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {tab === "shipping" && (
          <div className="space-y-4">
            <AdminCard title="Shiprocket">
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-noir">Enable Shiprocket</p>
                    <p className="text-xs text-noir/50 mt-1">
                      Create shipments from admin orders and power AWB tracking on the storefront.
                    </p>
                  </div>
                  <Toggle
                    on={!!shiprocket.enabled}
                    onClick={() => updateShiprocket({ enabled: !shiprocket.enabled })}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={label}>API email</label>
                    <input
                      className={field}
                      value={shiprocket.email || ""}
                      onChange={(e) => updateShiprocket({ email: e.target.value })}
                      placeholder="shiprocket@account.com"
                    />
                  </div>
                  <div>
                    <label className={label}>API password</label>
                    <input
                      type="password"
                      className={field}
                      value={shiprocket.password || ""}
                      onChange={(e) => updateShiprocket({ password: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className={label}>Or paste token (optional)</label>
                    <input
                      className={field}
                      value={shiprocket.token || ""}
                      onChange={(e) => updateShiprocket({ token: e.target.value })}
                      placeholder="Bearer token override"
                    />
                  </div>
                  <div>
                    <label className={label}>Pickup location name</label>
                    <input
                      className={field}
                      value={shiprocket.pickupLocation || "Primary"}
                      onChange={(e) => updateShiprocket({ pickupLocation: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </AdminCard>

            <AdminCard title="Shipping Methods">
              <div className="divide-y divide-champagne/10">
                {shipping.methods.map((m) => (
                  <div key={m.id} className="p-5 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="md:col-span-2">
                      <label className={label}>Method</label>
                      <input
                        className={field}
                        value={m.title}
                        onChange={(e) => updateShippingMethod(m.id, { title: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className={label}>Rate (INR)</label>
                      <input
                        type="number"
                        className={field}
                        value={m.rate}
                        onChange={(e) => updateShippingMethod(m.id, { rate: Number(e.target.value) })}
                      />
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1">
                        <label className={label}>ETA</label>
                        <input
                          className={field}
                          value={m.eta}
                          onChange={(e) => updateShippingMethod(m.id, { eta: e.target.value })}
                        />
                      </div>
                      <Toggle
                        on={m.enabled}
                        onClick={() => updateShippingMethod(m.id, { enabled: !m.enabled })}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </AdminCard>
          </div>
        )}

        {tab === "commerce" && (
          <AdminCard title="Taxes & Inventory Rules">
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={label}>GST / Tax Rate (%)</label>
                <input
                  type="number"
                  className={field}
                  value={commerce.taxRate}
                  onChange={(e) => updateCommerce({ taxRate: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className={label}>GSTIN</label>
                <input
                  className={field}
                  value={commerce.gstin}
                  onChange={(e) => updateCommerce({ gstin: e.target.value })}
                  placeholder="Optional"
                />
              </div>
              <div>
                <label className={label}>Free Shipping Above (INR)</label>
                <input
                  type="number"
                  className={field}
                  value={commerce.freeShippingThreshold}
                  onChange={(e) =>
                    updateCommerce({ freeShippingThreshold: Number(e.target.value) })
                  }
                />
              </div>
              <div>
                <label className={label}>Flat Shipping Rate (INR)</label>
                <input
                  type="number"
                  className={field}
                  value={commerce.flatShippingRate}
                  onChange={(e) => updateCommerce({ flatShippingRate: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className={label}>Low Stock Threshold</label>
                <input
                  type="number"
                  className={field}
                  value={commerce.lowStockThreshold}
                  onChange={(e) => updateCommerce({ lowStockThreshold: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className={label}>Tax Note (checkout)</label>
                <input
                  className={field}
                  value={commerce.taxNote}
                  onChange={(e) => updateCommerce({ taxNote: e.target.value })}
                />
              </div>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={commerce.enableGst}
                  onChange={(e) => updateCommerce({ enableGst: e.target.checked })}
                  className="accent-champagne w-4 h-4"
                />
                Enable GST on invoices
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={commerce.allowBackorders}
                  onChange={(e) => updateCommerce({ allowBackorders: e.target.checked })}
                  className="accent-champagne w-4 h-4"
                />
                Allow backorders
              </label>
            </div>
          </AdminCard>
        )}

        {tab === "notifications" && (
          <AdminCard title="Email & Alerts">
            <div className="p-5 space-y-4">
              <div>
                <label className={label}>Admin Alert Email</label>
                <input
                  className={field}
                  value={notifications.adminEmail}
                  onChange={(e) => updateNotifications({ adminEmail: e.target.value })}
                />
              </div>
              {[
                ["orderPlacedEmail", "Email customer when order is placed"],
                ["orderShippedEmail", "Email customer when order is shipped"],
                ["orderDeliveredEmail", "Email customer when order is delivered"],
                ["lowStockAlert", "Alert admin on low stock"],
                ["smsEnabled", "Enable SMS notifications"],
              ].map(([key, lab]) => (
                <label key={key} className="flex items-center justify-between gap-4 py-2 border-b border-champagne/10 text-sm">
                  <span>{lab}</span>
                  <Toggle
                    on={notifications[key]}
                    onClick={() => updateNotifications({ [key]: !notifications[key] })}
                  />
                </label>
              ))}
            </div>
          </AdminCard>
        )}

        <PrimaryButton type="submit">
          <Save size={14} />
          {saved ? "Settings Saved" : "Save Settings"}
        </PrimaryButton>
      </form>
    </div>
  );
}
