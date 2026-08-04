import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  FileDown,
  Truck,
  MessageSquare,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { formatPrice, orderStatuses } from "../data/adminData";
import { AdminCard, StatusBadge, PrimaryButton, OutlineButton, fieldClass, labelClass } from "../components/AdminUI";
import { exportInvoicePdf } from "../../utils/pdfExport";
import { api, assetUrl } from "../../api/client";
import notify from "../../utils/toast";
import useSettingsStore from "../../store/useSettingsStore";

function imgSrc(src) {
  if (!src) return "";
  if (/^https?:\/\//i.test(src) || src.startsWith("data:")) return src;
  return assetUrl(src);
}

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("Pending");
  const [payment, setPayment] = useState("Pending");
  const [awb, setAwb] = useState("");
  const [courier, setCourier] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [markingPaid, setMarkingPaid] = useState(false);
  const [shipping, setShipping] = useState(false);
  const [msg, setMsg] = useState("");
  const [invoice, setInvoice] = useState(null);
  const business = useSettingsStore((s) => s.business);
  const commerce = useSettingsStore((s) => s.commerce);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const row = await api(`/orders/${id}`, { portal: "admin" });
      setOrder(row);
      setStatus(row.status || "Pending");
      setPayment(row.payment || "Pending");
      setAwb(row.awb || "");
      setCourier(row.courier || "");
      setTrackingUrl(row.trackingUrl || "");
      try {
        const invs = await api("/invoices", { portal: "admin" });
        const match = (Array.isArray(invs) ? invs : []).find(
          (i) => i.orderId === (row.orderNumber || row.id)
        );
        setInvoice(match || null);
      } catch {
        setInvoice(null);
      }
    } catch (err) {
      setError(err.message || "Order not found");
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoice = () => {
    exportInvoicePdf(order, { business, commerce, invoice });
    notify.success("Invoice PDF downloaded");
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const save = async () => {
    if (!order) return;
    setSaving(true);
    setMsg("");
    setError("");
    try {
      const row = await api(`/orders/${id}`, {
        method: "PUT",
        portal: "admin",
        body: {
          status,
          payment,
          awb,
          courier,
          trackingUrl:
            trackingUrl ||
            (awb ? `https://shiprocket.co/tracking/${awb}` : ""),
        },
      });
      setOrder(row);
      setStatus(row.status || status);
      setPayment(row.payment || payment);
      setMsg("Order updated · inventory & shipment synced");
      notify.success("Order updated · inventory & shipment synced");
    } catch (err) {
      setError(err.message || "Update failed");
      notify.error(err.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  /** After boutique receives remaining advance balance */
  const markBalanceReceived = async () => {
    if (!order) return;
    const bal = Number(order.balanceDue) || 0;
    const ok = window.confirm(
      bal > 0
        ? `Confirm balance of ${formatPrice(bal)} received? Order will be marked Paid and balance cleared.`
        : "Mark this order as fully Paid?"
    );
    if (!ok) return;
    setMarkingPaid(true);
    setMsg("");
    setError("");
    try {
      const row = await api(`/orders/${id}`, {
        method: "PUT",
        portal: "admin",
        body: {
          markBalancePaid: true,
          payment: "Paid",
          status,
          awb,
          courier,
          trackingUrl,
        },
      });
      setOrder(row);
      setPayment(row.payment || "Paid");
      setMsg("Balance received · order marked Paid");
      notify.success("Payment marked as Paid");
    } catch (err) {
      setError(err.message || "Could not update payment");
      notify.error(err.message || "Could not update payment");
    } finally {
      setMarkingPaid(false);
    }
  };

  const pushShiprocket = async () => {
    setShipping(true);
    setMsg("");
    setError("");
    try {
      const res = await api(`/shipping/shiprocket/orders/${id}`, {
        method: "POST",
        portal: "admin",
        body: {},
      });
      await load();
      const m = res.order?.awb
        ? `Shiprocket created · AWB ${res.order.awb}`
        : "Pushed to Shiprocket";
      setMsg(m);
      notify.success(m);
    } catch (err) {
      const m = err.message || "Shiprocket push failed — check Settings → Shipping";
      setError(m);
      notify.error(m);
    } finally {
      setShipping(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-noir/50 flex items-center justify-center gap-2">
        <Loader2 className="animate-spin" size={18} /> Loading order…
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <p className="font-display text-2xl text-noir mb-4">Order not found</p>
        <p className="text-sm text-noir/50 mb-4">{error}</p>
        <Link to="/admin/orders" className="text-champagne-dark text-sm underline">
          Back to orders
        </Link>
      </div>
    );
  }

  const subtotal =
    order.subtotal ||
    (order.items || []).reduce((s, i) => s + (i.price || 0) * (i.qty || 1), 0);
  const shippingAmt = Number(order.shipping) || 0;
  const total = Number(order.total) || subtotal + shippingAmt;

  return (
    <div className="animate-fade-up max-w-5xl space-y-6">
      <button
        type="button"
        onClick={() => navigate("/admin/orders")}
        className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest2 text-noir/50 hover:text-champagne-dark"
      >
        <ArrowLeft size={14} />
        Back to orders
      </button>

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-1">{order.orderNumber || order.id}</p>
          <h2 className="font-display text-3xl text-noir">{order.customer}</h2>
          <p className="text-sm text-noir/50 mt-1">
            Placed on {order.date || "—"}
            {order.createdAt
              ? ` · ${new Date(order.createdAt).toLocaleString("en-IN")}`
              : ""}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={order.status} />
          <StatusBadge status={order.payment} />
          <Link
            to="/admin/order-support"
            className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest2 text-champagne-dark hover:underline"
          >
            <MessageSquare size={14} /> Support chat
          </Link>
        </div>
      </div>

      {error && <p className="text-sm text-rose-600">{error}</p>}
      {msg && <p className="text-sm text-emerald-700">{msg}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AdminCard title="Order Items" className="lg:col-span-2">
          <ul className="divide-y divide-champagne/10">
            {(order.items || []).map((item, i) => (
              <li key={i} className="px-5 py-4 flex items-center gap-4">
                {item.image ? (
                  <img
                    src={imgSrc(item.image)}
                    alt=""
                    className="w-14 h-14 rounded-lg object-cover bg-stone-100 shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-lg bg-stone-100 shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-noir">{item.name}</p>
                  <p className="text-xs text-noir/40 mt-0.5">
                    Qty {item.qty}
                    {item.variantSku ? ` · ${item.variantSku}` : ""}
                    {item.paymentType === "partial" ? " · Split payment" : ""}
                  </p>
                </div>
                <p className="text-sm font-medium whitespace-nowrap">
                  {formatPrice((item.price || 0) * (item.qty || 1))}
                </p>
              </li>
            ))}
          </ul>
          <div className="px-5 py-4 border-t border-champagne/15 space-y-2 text-sm">
            <div className="flex justify-between text-noir/60">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-noir/60">
                <span>Discount{order.couponCode ? ` (${order.couponCode})` : ""}</span>
                <span>-{formatPrice(order.discount)}</span>
              </div>
            )}
            {order.tax > 0 && (
              <div className="flex justify-between text-noir/60">
                <span>Tax{order.taxLabel ? ` · ${order.taxLabel}` : ""}</span>
                <span>{formatPrice(order.tax)}</span>
              </div>
            )}
            <div className="flex justify-between text-noir/60">
              <span>Shipping</span>
              <span>{shippingAmt === 0 ? "Complimentary" : formatPrice(shippingAmt)}</span>
            </div>
            {order.advancePaid > 0 && (
              <div className="flex justify-between text-noir/60">
                <span>Paid now</span>
                <span>{formatPrice(order.advancePaid)}</span>
              </div>
            )}
            {order.balanceDue > 0 && (
              <div className="flex justify-between text-noir/60">
                <span>Balance due</span>
                <span>{formatPrice(order.balanceDue)}</span>
              </div>
            )}
            <div className="flex justify-between font-medium text-noir pt-2 border-t border-champagne/10">
              <span>Total</span>
              <span className="font-display text-xl text-champagne-dark">{formatPrice(total)}</span>
            </div>
          </div>
        </AdminCard>

        <div className="space-y-6">
          <AdminCard title="Update status">
            <div className="p-5 space-y-4">
              <div>
                <label className={labelClass}>Order status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className={fieldClass}
                >
                  {orderStatuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Payment status</label>
                <select
                  value={payment}
                  onChange={(e) => setPayment(e.target.value)}
                  className={fieldClass}
                >
                  {["Pending", "Paid", "Partial", "Refunded"].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {(order.payment === "Partial" ||
                Number(order.balanceDue) > 0 ||
                order.paymentType === "partial") &&
                order.payment !== "Paid" && (
                  <div className="rounded-sm border border-champagne/30 bg-champagne/5 p-3 space-y-2">
                    <p className="text-xs text-noir/70 leading-relaxed">
                      Advance collected
                      {order.advancePaid > 0 ? ` (${formatPrice(order.advancePaid)})` : ""}.
                      {Number(order.balanceDue) > 0
                        ? ` Balance due: ${formatPrice(order.balanceDue)}.`
                        : ""}{" "}
                      After you receive the remaining payment, mark it paid:
                    </p>
                    <PrimaryButton
                      type="button"
                      className="w-full"
                      onClick={markBalanceReceived}
                      disabled={markingPaid || saving}
                    >
                      {markingPaid ? "Updating…" : "Balance received → Mark Paid"}
                    </PrimaryButton>
                  </div>
                )}

              <PrimaryButton className="w-full" onClick={save} disabled={saving || markingPaid}>
                {saving ? "Saving…" : "Save changes"}
              </PrimaryButton>
              <p className="text-[11px] text-noir/40 leading-relaxed">
                Shipped / Delivered commits inventory. Cancelled releases stock. Customer email
                sends when SMTP is configured under Mail Settings. You can also set Payment
                status to Paid and Save after receiving balance.
              </p>
            </div>
          </AdminCard>

          <AdminCard title="Payment details">
            <div className="p-5 space-y-3 text-sm">
              <div>
                <p className="text-[10px] uppercase tracking-widest2 text-noir/40 mb-1">Method</p>
                <p className="text-noir">{order.paymentLabel || order.paymentMethod || "—"}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest2 text-noir/40 mb-1">Status</p>
                <p className="text-noir/70">{order.payment}</p>
              </div>
              {order.paymentId ? (
                <div>
                  <p className="text-[10px] uppercase tracking-widest2 text-noir/40 mb-1">
                    Payment ID
                  </p>
                  <p className="text-noir/70 font-mono text-xs break-all">{order.paymentId}</p>
                </div>
              ) : null}
              {order.razorpayOrderId ? (
                <div>
                  <p className="text-[10px] uppercase tracking-widest2 text-noir/40 mb-1">
                    Razorpay order
                  </p>
                  <p className="text-noir/70 font-mono text-xs break-all">
                    {order.razorpayOrderId}
                  </p>
                </div>
              ) : null}
              <Link
                to="/admin/transactions"
                className="text-xs text-champagne-dark underline"
              >
                View transactions
              </Link>
              {" · "}
              <Link to="/admin/invoices" className="text-xs text-champagne-dark underline">
                View invoices
              </Link>
            </div>
          </AdminCard>

          <AdminCard title="Shipment & tracking">
            <div className="p-5 space-y-3">
              <div>
                <label className={labelClass}>Courier</label>
                <input
                  className={fieldClass}
                  value={courier}
                  onChange={(e) => setCourier(e.target.value)}
                  placeholder="Bluedart / Delhivery…"
                />
              </div>
              <div>
                <label className={labelClass}>AWB / tracking no.</label>
                <input
                  className={fieldClass}
                  value={awb}
                  onChange={(e) => setAwb(e.target.value)}
                  placeholder="Enter AWB"
                />
              </div>
              <div>
                <label className={labelClass}>Tracking URL</label>
                <input
                  className={fieldClass}
                  value={trackingUrl}
                  onChange={(e) => setTrackingUrl(e.target.value)}
                  placeholder="https://…"
                />
              </div>
              <PrimaryButton className="w-full" onClick={save} disabled={saving}>
                <Truck size={14} /> Save tracking
              </PrimaryButton>
              <OutlineButton
                className="w-full"
                onClick={pushShiprocket}
                disabled={shipping}
              >
                {shipping ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> Pushing…
                  </>
                ) : (
                  <>
                    <Truck size={14} /> Create Shiprocket shipment
                  </>
                )}
              </OutlineButton>
              {order.trackingUrl ? (
                <a
                  href={order.trackingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-champagne-dark underline"
                >
                  Open tracking <ExternalLink size={12} />
                </a>
              ) : null}
              <p className="text-[11px] text-noir/40">
                Customer can track via Account → Track order or /track-order with order number +
                email. Saving AWB also creates a Shipments row.
              </p>
            </div>
          </AdminCard>

          <AdminCard title="Customer">
            <div className="p-5 space-y-3 text-sm">
              <div>
                <p className="text-[10px] uppercase tracking-widest2 text-noir/40 mb-1">Name</p>
                <p className="text-noir">{order.customer}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest2 text-noir/40 mb-1">Email</p>
                <p className="text-noir/70 break-all">{order.email}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest2 text-noir/40 mb-1">Phone</p>
                <p className="text-noir/70">{order.phone || "—"}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest2 text-noir/40 mb-1">Ship to</p>
                <p className="text-noir/70 leading-relaxed">{order.address || "—"}</p>
              </div>
            </div>
          </AdminCard>

          <OutlineButton className="w-full" onClick={downloadInvoice}>
            <FileDown size={14} /> Download PDF invoice
            {invoice?.invoiceNumber ? ` · ${invoice.invoiceNumber}` : ""}
          </OutlineButton>
        </div>
      </div>
    </div>
  );
}
