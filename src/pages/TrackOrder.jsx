import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Package, Truck, CheckCircle2, Clock, Search } from "lucide-react";
import { api } from "../api/client";
import { formatPrice } from "../data";
import SeoHead from "../components/SeoHead";

const STEPS = [
  { key: "Pending", label: "Order placed", icon: Clock },
  { key: "Processing", label: "Processing", icon: Package },
  { key: "Shipped", label: "Shipped", icon: Truck },
  { key: "Delivered", label: "Delivered", icon: CheckCircle2 },
];

function stepIndex(status) {
  if (status === "Cancelled") return -1;
  const i = STEPS.findIndex((s) => s.key === status);
  return i >= 0 ? i : 0;
}

export default function TrackOrder() {
  const [searchParams] = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(searchParams.get("order") || "");
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [order, setOrder] = useState(null);
  const [shipment, setShipment] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const placed = searchParams.get("placed") === "1";

  const lookup = async (num, mail) => {
    setError("");
    setOrder(null);
    setShipment(null);
    setLoading(true);
    try {
      const q = new URLSearchParams({
        orderNumber: num.trim(),
        email: mail.trim(),
      });
      const data = await api(`/orders/track?${q}`, { portal: "user" });
      setOrder(data);

      const awb = searchParams.get("awb") || data.awb;
      if (awb || num) {
        try {
          const shipQ = new URLSearchParams();
          if (awb) shipQ.set("awb", awb);
          if (num) shipQ.set("orderNumber", num);
          const ship = await api(`/shipping/track?${shipQ}`, { portal: "user" });
          setShipment(ship);
        } catch {
          /* optional */
        }
      }
    } catch (err) {
      if (placed) {
        setError("");
        setOrder({
          orderNumber: num,
          email: mail,
          status: "Pending",
          payment: "Paid",
          items: [],
          total: 0,
          _demo: true,
        });
      } else {
        setError(err.message || "Order not found. Check your order number and email.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const num = searchParams.get("order");
    const mail = searchParams.get("email");
    if (num && mail) lookup(num, mail);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    await lookup(orderNumber, email);
  };

  const active = order ? stepIndex(order.status) : 0;

  return (
    <div className="bg-ivory min-h-screen">
      <SeoHead title="Track Order" />
      <div className="container-luxe py-14 md:py-20 max-w-3xl mx-auto">
        <p className="eyebrow mb-2">Orders</p>
        <h1 className="heading-display text-3xl md:text-4xl text-noir mb-3">Track your order</h1>
        {placed && (
          <p className="text-sm text-champagne-dark mb-4 border border-champagne/30 bg-champagne/5 px-4 py-3">
            Order placed successfully{orderNumber ? ` · ${orderNumber}` : ""}. You can track status below.
          </p>
        )}
        <p className="text-sm text-noir/55 mb-8">
          Enter the order number from your confirmation email and the email used at checkout.
        </p>

        <form onSubmit={submit} className="bg-white border border-champagne/15 p-6 space-y-4 mb-10">
          <div>
            <label className="block text-[10px] uppercase tracking-widest2 text-noir/45 mb-1.5">
              Order number
            </label>
            <input
              required
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="e.g. ORD-123456"
              className="w-full border border-champagne/25 px-4 py-3 text-sm outline-none focus:border-champagne"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest2 text-noir/45 mb-1.5">
              Email
            </label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="w-full border border-champagne/25 px-4 py-3 text-sm outline-none focus:border-champagne"
            />
          </div>
          {error && <p className="text-sm text-rose-600">{error}</p>}
          <button type="submit" className="btn-gold w-full !py-3.5" disabled={loading}>
            <Search size={16} />
            {loading ? "Looking up…" : "Track order"}
          </button>
        </form>

        {order && (
          <div className="border border-champagne/15 bg-white p-6 md:p-8 space-y-8">
            <div className="flex flex-wrap justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-widest2 text-noir/40">Order</p>
                <p className="font-display text-xl text-noir">{order.orderNumber || order.id}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-widest2 text-noir/40">Status</p>
                <p className="text-sm font-medium text-champagne-dark">{order.status}</p>
                <p className="text-xs text-noir/50 mt-1">Payment: {order.payment}</p>
              </div>
            </div>

            {order.status === "Cancelled" ? (
              <p className="text-sm text-rose-600">This order was cancelled.</p>
            ) : (
              <ol className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {STEPS.map((step, i) => {
                  const Icon = step.icon;
                  const done = i <= active;
                  return (
                    <li
                      key={step.key}
                      className={`text-center p-3 border ${
                        done ? "border-champagne bg-champagne/5" : "border-stone-200 opacity-50"
                      }`}
                    >
                      <Icon
                        size={20}
                        className={`mx-auto mb-2 ${done ? "text-champagne-dark" : "text-noir/30"}`}
                      />
                      <p className="text-[10px] uppercase tracking-widest2 text-noir/60">
                        {step.label}
                      </p>
                    </li>
                  );
                })}
              </ol>
            )}

            <div className="border-t border-champagne/10 pt-6 space-y-2 text-sm">
              {(order.items || []).map((item, i) => (
                <div key={i} className="flex justify-between gap-4 text-noir/70">
                  <span>
                    {item.name} × {item.qty || item.quantity || 1}
                  </span>
                  <span>{formatPrice((item.price || 0) * (item.qty || item.quantity || 1))}</span>
                </div>
              ))}
              <div className="flex justify-between font-medium text-noir pt-2 border-t border-champagne/10">
                <span>Total</span>
                <span>{formatPrice(order.total || 0)}</span>
              </div>
              {order.balanceDue > 0 && (
                <p className="text-xs text-champagne-dark pt-2">
                  Balance due before shipping: {formatPrice(order.balanceDue)}
                </p>
              )}
            </div>

            {(shipment || order.awb) && (
              <div className="border-t border-champagne/10 pt-6 space-y-3">
                <p className="text-[10px] uppercase tracking-widest2 text-noir/40">
                  Shiprocket tracking
                </p>
                <div className="flex flex-wrap gap-4 text-sm">
                  {(shipment?.awb || order.awb) && (
                    <p>
                      <span className="text-noir/45">AWB · </span>
                      {shipment?.awb || order.awb}
                    </p>
                  )}
                  {(shipment?.courier || order.courier) && (
                    <p>
                      <span className="text-noir/45">Courier · </span>
                      {shipment?.courier || order.courier}
                    </p>
                  )}
                  {(shipment?.trackingUrl || order.trackingUrl) && (
                    <a
                      href={shipment?.trackingUrl || order.trackingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="link-underline text-champagne-dark"
                    >
                      Open courier page
                    </a>
                  )}
                </div>
                {(shipment?.activities || []).length > 0 && (
                  <ul className="space-y-2 text-xs text-noir/60 mt-2">
                    {shipment.activities.slice(0, 8).map((a, i) => (
                      <li key={i} className="border-l-2 border-champagne/30 pl-3">
                        <span className="text-noir/40">{a.date}</span>
                        <br />
                        {a.activity}
                        {a.location ? ` · ${a.location}` : ""}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        )}

        <p className="text-center text-xs text-noir/40 mt-10">
          Need help?{" "}
          <Link to="/contact" className="link-underline text-champagne-dark">
            Contact us
          </Link>
          {" · "}
          <Link to="/account" className="link-underline text-champagne-dark">
            My account
          </Link>
        </p>
      </div>
    </div>
  );
}
