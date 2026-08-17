import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CreditCard, Banknote, ShieldCheck, Tag } from "lucide-react";
import { useSelector } from "react-redux";
import useCartStore from "../store/useCartStore";
import useAddressStore from "../store/useAddressStore";
import { formatPrice, whatsappNumber } from "../data";
import useCmsPage from "../hooks/useCmsPage";
import CmsCustomBlock from "../components/CmsCustomBlock";
import { api, assetUrl } from "../api/client";
import useSettingsStore from "../store/useSettingsStore";
import SeoHead from "../components/SeoHead";

const GATEWAY_META = [
  {
    id: "razorpay",
    label: "Razorpay",
    desc: "UPI, Cards, Netbanking & Wallets via Razorpay",
    icon: CreditCard,
    badge: "Recommended",
    settingsKey: "razorpay",
  },
  {
    id: "cod",
    label: "Cash on Delivery / Boutique",
    desc: "Pay on delivery or at store visit",
    icon: Banknote,
    settingsKey: "cashOnDelivery",
  },
];

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

function parseTaxRate(row) {
  if (row.rateValue != null && row.rateValue !== "") return Number(row.rateValue) || 0;
  const m = String(row.rate || "").match(/([\d.]+)/);
  return m ? Number(m[1]) : 0;
}

export default function Checkout() {
  const { items, clearCart } = useCartStore();
  const navigate = useNavigate();
  const customer = useSelector((s) => s.auth.customer);
  const customerToken = useSelector((s) => s.auth.customerToken);
  const { fields: c, isHidden, customSections } = useCmsPage("checkout");
  const addresses = useAddressStore((s) => s.addresses);
  const defaultAddr = useAddressStore((s) => s.getDefault());
  const commerce = useSettingsStore((s) => s.commerce);
  const storePayments = useSettingsStore((s) => s.payments);
  const [selectedPayment, setSelectedPayment] = useState("razorpay");
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [taxRate, setTaxRate] = useState(null);
  const [livePayments, setLivePayments] = useState(null);
  const [form, setForm] = useState(() => ({
    email: customer?.email || "",
    firstName: (customer?.name || "").split(" ")[0] || "",
    lastName: (customer?.name || "").split(" ").slice(1).join(" ") || "",
    address: defaultAddr?.line1 || "",
    apartment: defaultAddr?.line2 || "",
    city: defaultAddr?.city || customer?.city || "",
    state: defaultAddr?.state || "Rajasthan",
    pinCode: defaultAddr?.pinCode || "",
    phone: defaultAddr?.phone || customer?.phone || "",
  }));

  useEffect(() => {
    api("/settings")
      .then((s) => {
        if (s?.payments) setLivePayments(s.payments);
        if (s?.commerce) {
          useSettingsStore.setState((st) => ({
            commerce: { ...st.commerce, ...s.commerce },
          }));
        }
      })
      .catch(() => {});
  }, []);

  const payCfg = livePayments || storePayments || {};
  const enabledGateways = GATEWAY_META.filter((g) => {
    const cfg = payCfg[g.settingsKey];
    return !cfg || cfg.enabled !== false;
  });

  useEffect(() => {
    if (!enabledGateways.find((g) => g.id === selectedPayment) && enabledGateways[0]) {
      setSelectedPayment(enabledGateways[0].id);
    }
  }, [enabledGateways, selectedPayment]);

  useEffect(() => {
    api("/taxes", { portal: "user" })
      .then((rows) => {
        const list = (Array.isArray(rows) ? rows : []).filter((t) => t.status === "Active");
        if (!list.length) {
          setTaxRate(null);
          return;
        }
        const country = "India";
        const state = form.state || "";
        const scored = list
          .map((t) => {
            let score = Number(t.priority) || 0;
            if (t.country && new RegExp(t.country, "i").test(country)) score += 100;
            if (t.state && state && new RegExp(t.state, "i").test(state)) score += 50;
            if (t.type === "Zero") score -= 5;
            return { t, score };
          })
          .sort((a, b) => b.score - a.score);
        setTaxRate(scored[0]?.t || null);
      })
      .catch(() => setTaxRate(null));
    // re-pick when shipping state changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.state]);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const hasSplitItems = items.some((i) => i.paymentType === "partial" && i.allowSplit !== false);
  const advancePayable = useMemo(() => {
    if (!hasSplitItems) return subtotal;
    return items.reduce((sum, item) => {
      if (item.paymentType === "partial") {
        const adv =
          item.advanceAmount != null && item.advanceAmount !== ""
            ? Number(item.advanceAmount)
            : Math.round(item.price * 0.5);
        return sum + Math.max(0, adv) * item.quantity;
      }
      return sum + item.price * item.quantity;
    }, 0);
  }, [items, hasSplitItems, subtotal]);

  const discount = coupon?.discount || 0;
  const merchandiseNet = Math.max(0, subtotal - discount);
  const payNowMerch = hasSplitItems
    ? Math.min(advancePayable, merchandiseNet)
    : merchandiseNet;
  const balanceDue = hasSplitItems ? Math.max(0, merchandiseNet - payNowMerch) : 0;

  const freeThreshold = Number(commerce?.freeShippingThreshold) || 200000;
  const flatShip = Number(commerce?.flatShippingRate) ?? 250;
  const shippingBase =
    subtotal >= freeThreshold || coupon?.freeShipping ? 0 : flatShip;
  const shipping = coupon?.freeShipping ? 0 : shippingBase;

  const taxPct = taxRate ? parseTaxRate(taxRate) : 0;
  const taxInclusive = taxRate?.inclusive !== false && taxRate?.inclusive !== "false";
  const taxAmount = taxPct > 0 && !taxInclusive ? Math.round((payNowMerch * taxPct) / 100) : 0;
  const amountDueNow = payNowMerch + shipping + taxAmount;

  const applyAddress = (addr) => {
    if (!addr) return;
    setForm((f) => ({
      ...f,
      address: addr.line1 || "",
      apartment: addr.line2 || "",
      city: addr.city || "",
      state: addr.state || f.state,
      pinCode: addr.pinCode || "",
      phone: addr.phone || f.phone,
      firstName: (addr.name || f.firstName).split(" ")[0] || f.firstName,
      lastName: (addr.name || "").split(" ").slice(1).join(" ") || f.lastName,
    }));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const applyCoupon = async () => {
    setCouponError("");
    setCoupon(null);
    try {
      const data = await api("/coupons/validate", {
        method: "POST",
        body: { code: couponInput.trim(), subtotal, shipping: shippingBase },
        portal: "user",
      });
      setCoupon(data);
    } catch (err) {
      setCouponError(err.message || "Invalid coupon");
    }
  };

  const openRazorpay = async ({ orderNumber, customerName, email, phone }) => {
    // Amount comes from the server-priced pending order — never trust client totals
    const rzOrder = await api("/payments/razorpay/order", {
      method: "POST",
      body: { orderNumber, receipt: orderNumber, notes: { orderNumber } },
      portal: "user",
    });

    if (rzOrder.demo) {
      await new Promise((r) => setTimeout(r, 600));
      const verified = await api("/payments/razorpay/verify", {
        method: "POST",
        body: {
          razorpay_order_id: rzOrder.orderId,
          razorpay_payment_id: `pay_demo_${Date.now()}`,
          razorpay_signature: "demo",
        },
        portal: "user",
      });
      return {
        ...verified,
        razorpayOrderId: rzOrder.orderId,
        razorpay_signature: "demo",
      };
    }

    const ok = await loadRazorpayScript();
    if (!ok || !window.Razorpay) throw new Error("Could not load Razorpay checkout");

    return new Promise((resolve, reject) => {
      const rzp = new window.Razorpay({
        key: rzOrder.keyId,
        amount: rzOrder.amount,
        currency: rzOrder.currency || "INR",
        name: "Madhu Kadel",
        description: `Order ${orderNumber}`,
        order_id: rzOrder.orderId,
        prefill: { name: customerName, email, contact: phone },
        theme: { color: "#1a1a1a" },
        handler: async (response) => {
          try {
            const verified = await api("/payments/razorpay/verify", {
              method: "POST",
              body: response,
              portal: "user",
            });
            resolve({
              ...verified,
              razorpayOrderId: rzOrder.orderId,
              razorpay_signature: response.razorpay_signature,
            });
          } catch (err) {
            reject(err);
          }
        },
        modal: {
          ondismiss: () => reject(Object.assign(new Error("Payment cancelled"), { code: "PAYMENT_CANCELLED" })),
        },
      });
      rzp.on("payment.failed", () =>
        reject(Object.assign(new Error("Payment failed"), { code: "PAYMENT_FAILED" }))
      );
      rzp.open();
    });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError("");
    setPaying(true);

    const fullAddress = `${form.address}${form.apartment ? `, ${form.apartment}` : ""}, ${form.city}, ${form.state} - ${form.pinCode}`;
    let orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    const customerName = `${form.firstName} ${form.lastName}`.trim();

    const orderPayload = {
      customer: customerName,
      email: form.email,
      phone: form.phone,
      address: fullAddress,
      state: form.state,
      items: items.map((i) => ({
        productId: i.id,
        variantSku: i.variantSku || (String(i.id).includes("::") ? String(i.id).split("::")[1] : ""),
        name: i.variantLabel ? `${i.name} (${i.variantLabel})` : i.name,
        image: Array.isArray(i.images) ? i.images[0] || "" : i.image || "",
        qty: i.quantity,
        paymentType: i.paymentType || "full",
      })),
      couponCode: coupon?.code || "",
      paymentMethod: selectedPayment,
    };

    let pendingCreated = false;
    let paymentCaptured = false;
    try {
      // 1) Create order + reserve stock BEFORE charging (avoids pay-then-fail)
      const saved = await api("/orders", {
        method: "POST",
        body: { ...orderPayload, orderNumber },
        portal: "user",
      });
      orderNumber = saved.orderNumber || saved.id || orderNumber;
      pendingCreated = !!saved.awaitingPayment;

      if (selectedPayment === "razorpay") {
        try {
          const pay = await openRazorpay({
            orderNumber,
            customerName,
            email: form.email,
            phone: form.phone,
          });
          paymentCaptured = true;
          await api(`/orders/${encodeURIComponent(orderNumber)}/confirm-payment`, {
            method: "POST",
            body: {
              email: form.email,
              paymentId: pay.paymentId,
              razorpayOrderId: pay.razorpayOrderId || pay.orderId,
              razorpay_signature: pay.razorpay_signature || "demo",
            },
            portal: "user",
          });
        } catch (payErr) {
          // Never cancel after money was captured — leave pending for support / retry confirm
          if (!paymentCaptured) {
            await api(`/orders/${encodeURIComponent(orderNumber)}/cancel-pending`, {
              method: "POST",
              body: { email: form.email },
              portal: "user",
            }).catch(() => {});
          }
          throw payErr;
        }
      }

      if (selectedPayment === "cod") {
        const msg = `Hello Madhu Jewellery! COD order ${orderNumber}\n${customerName}\n${form.phone}\n${fullAddress}`;
        window.open(
          `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(msg)}`,
          "_blank"
        );
      }

      clearCart();
      navigate(
        `/thank-you?order=${encodeURIComponent(orderNumber)}&email=${encodeURIComponent(form.email)}`
      );
    } catch (err) {
      setError(
        paymentCaptured
          ? `Payment succeeded but confirmation failed. Contact support with order ${orderNumber}.`
          : err.message ||
              (pendingCreated
                ? "Payment was cancelled. Your bag was not charged."
                : "Could not place order. Please try again.")
      );
    } finally {
      setPaying(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-ivory min-h-screen">
        <SeoHead title="Checkout" />
        {!isHidden("empty") && (
          <div className="container-luxe py-24 text-center min-h-[50vh] flex flex-col justify-center items-center">
            <h1 className="heading-display text-3xl text-noir mb-4">{c.emptyTitle || "Your bag is empty"}</h1>
            <Link to="/shop" className="btn-gold">
              {c.emptyCta || "Continue shopping"}
            </Link>
          </div>
        )}
        {customSections.map((s) => (
          <CmsCustomBlock key={s.id} data={s} />
        ))}
      </div>
    );
  }

  return (
    <div className="bg-ivory min-h-screen py-10 md:py-16">
      <SeoHead title="Checkout" />
      <div className="container-luxe grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        {!isHidden("form") && (
          <div className="lg:col-span-7 order-2 lg:order-1">
            <form onSubmit={handlePlaceOrder} className="space-y-10">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="heading-display text-lg text-noir">{c.contactTitle || "Contact"}</h2>
                  <Link to="/account" className="text-xs link-underline text-champagne-dark">
                    {customerToken ? "My account" : "Sign in"}
                  </Link>
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full border border-champagne/25 bg-white px-4 py-3 text-sm rounded-sm outline-none focus:border-champagne"
                />
              </div>

              <div>
                <h2 className="heading-display text-lg text-noir mb-4">
                  {c.deliveryTitle || "Delivery"}
                </h2>
                {addresses.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {addresses.map((a) => (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => applyAddress(a)}
                        className="text-left text-xs border border-champagne/25 px-3 py-2 hover:border-champagne bg-white"
                      >
                        <span className="font-medium text-noir block">{a.label}</span>
                        <span className="text-noir/50">{a.line1}, {a.city}</span>
                      </button>
                    ))}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ["firstName", "First name"],
                    ["lastName", "Last name"],
                    ["address", "Address", "col-span-2"],
                    ["apartment", "Apartment (optional)", "col-span-2"],
                    ["city", "City"],
                    ["state", "State"],
                    ["pinCode", "PIN code"],
                    ["phone", "Phone"],
                  ].map(([name, ph, span]) => (
                    <input
                      key={name}
                      type={name === "phone" ? "tel" : "text"}
                      name={name}
                      required={name !== "apartment"}
                      value={form[name]}
                      onChange={handleChange}
                      placeholder={ph}
                      className={`${span || ""} border border-champagne/25 bg-white px-4 py-3 text-sm rounded-sm outline-none focus:border-champagne`}
                    />
                  ))}
                </div>
              </div>

              {hasSplitItems && (
                <div className="border border-champagne/20 bg-champagne/5 p-5 rounded-sm text-sm">
                  <p className="font-medium text-noir mb-1">Split payment on this order</p>
                  <p className="text-xs text-noir/55 leading-relaxed">
                    Advance due now uses each product&apos;s admin-set % or amount. Balance{" "}
                    {formatPrice(balanceDue)} is due before shipping.
                  </p>
                </div>
              )}

              <div>
                <h2 className="heading-display text-lg text-noir mb-1 flex items-center gap-2">
                  <Tag size={18} /> Coupon
                </h2>
                <div className="flex gap-2 mt-3">
                  <input
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Enter code"
                    className="flex-1 border border-champagne/25 bg-white px-4 py-3 text-sm outline-none focus:border-champagne"
                  />
                  <button type="button" onClick={applyCoupon} className="btn-outline !py-3 !px-5">
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-xs text-rose-600 mt-2">{couponError}</p>}
                {coupon && (
                  <p className="text-xs text-champagne-dark mt-2">
                    {coupon.name || coupon.code} applied · −{formatPrice(coupon.discount)}
                    <button
                      type="button"
                      className="ml-3 underline text-noir/40"
                      onClick={() => {
                        setCoupon(null);
                        setCouponInput("");
                      }}
                    >
                      Remove
                    </button>
                  </p>
                )}
              </div>

              <div>
                <h2 className="heading-display text-lg text-noir mb-1">
                  {c.paymentTitle || "Payment"}
                </h2>
                <p className="text-xs text-noir/50 mb-4">
                  Razorpay (online) or Cash on Delivery. Configure keys in Admin → Settings.
                </p>
                <div className="space-y-3">
                  {enabledGateways.map((method) => {
                    const Icon = method.icon;
                    const active = selectedPayment === method.id;
                    return (
                      <label
                        key={method.id}
                        className={`flex items-center gap-3 border rounded-sm px-4 py-3.5 cursor-pointer transition-colors ${
                          active
                            ? "border-champagne bg-champagne/5"
                            : "border-champagne/20 hover:border-champagne/40"
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={method.id}
                          checked={active}
                          onChange={() => setSelectedPayment(method.id)}
                          className="accent-champagne"
                        />
                        <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center shrink-0">
                          <Icon size={18} className="text-champagne-dark" />
                        </div>
                        <span className="flex-1 min-w-0">
                          <span className="flex items-center gap-2">
                            <span className="text-sm text-noir font-medium">{method.label}</span>
                            {method.badge && (
                              <span className="text-[9px] uppercase tracking-widest2 text-champagne-dark border border-champagne/30 px-1.5 py-0.5">
                                {method.badge}
                              </span>
                            )}
                          </span>
                          <span className="block text-[11px] text-noir/45 mt-0.5">{method.desc}</span>
                        </span>
                      </label>
                    );
                  })}
                </div>
                <div className="flex items-start gap-2 mt-4 text-[11px] text-noir/45">
                  <ShieldCheck size={14} className="shrink-0 mt-0.5 text-champagne-dark" />
                  <p>Payments secured by Razorpay. Without live keys, checkout runs in demo verify mode.</p>
                </div>
              </div>

              {error && <p className="text-sm text-rose-600">{error}</p>}

              <button type="submit" className="btn-gold w-full !py-4" disabled={paying}>
                {paying
                  ? "Processing…"
                  : selectedPayment === "cod"
                  ? "Place order"
                  : `Pay ${formatPrice(amountDueNow)}`}
              </button>
            </form>
          </div>
        )}

        {!isHidden("summary") && (
          <div className="lg:col-span-5 order-1 lg:order-2 bg-stone-50 border border-champagne/15 rounded-sm p-6 md:p-8 lg:sticky lg:top-28">
            <h2 className="heading-display text-lg text-noir mb-4">
              {c.orderSummary || "Order Summary"}
            </h2>
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <div className="w-full h-full bg-stone-100 rounded-sm overflow-hidden">
                      <img
                        src={assetUrl(item.images?.[0])}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="absolute -top-2 -right-2 bg-noir text-ivory text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-noir line-clamp-1">{item.name}</p>
                    {item.paymentType === "partial" && (
                      <span className="text-[10px] uppercase tracking-wide text-champagne-dark font-semibold">
                        Advance {formatPrice((item.advanceAmount || 0) * item.quantity)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-noir font-medium">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-3 text-sm border-t border-champagne/15 pt-4">
              <div className="flex justify-between text-noir/60">
                <span>Subtotal</span>
                <span className="text-noir">{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-noir/60">
                  <span>Discount</span>
                  <span className="text-champagne-dark">−{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-noir/60">
                <span>Shipping</span>
                <span className="text-noir">{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
              </div>
              {taxRate && (
                <div className="flex justify-between text-noir/60">
                  <span>{taxRate.name || "Tax"} {taxInclusive ? "(incl.)" : ""}</span>
                  <span className="text-noir">
                    {taxInclusive ? taxRate.rate || `${taxPct}%` : formatPrice(taxAmount)}
                  </span>
                </div>
              )}
              {hasSplitItems && (
                <>
                  <div className="flex justify-between text-noir/60 border-t border-champagne/15 pt-3">
                    <span>Pay now</span>
                    <span className="text-champagne-dark font-semibold">
                      {formatPrice(amountDueNow)}
                    </span>
                  </div>
                  <div className="flex justify-between text-noir/60">
                    <span>Balance later</span>
                    <span>{formatPrice(balanceDue)}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between text-base font-semibold text-noir border-t border-champagne/15 pt-3">
                <span>{hasSplitItems ? "Due today" : "Total"}</span>
                <span>{formatPrice(amountDueNow)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
      {customSections.map((s) => (
        <CmsCustomBlock key={s.id} data={s} />
      ))}
    </div>
  );
}
