import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Package, ShoppingBag } from "lucide-react";
import { api } from "../api/client";
import { formatPrice } from "../data";
import SeoHead from "../components/SeoHead";

export default function ThankYou() {
  const [params] = useSearchParams();
  const orderNumber = params.get("order") || "";
  const email = params.get("email") || "";
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!orderNumber || !email) return;
    api(
      `/orders/track?orderNumber=${encodeURIComponent(orderNumber)}&email=${encodeURIComponent(email)}`,
      { portal: "user" }
    )
      .then(setOrder)
      .catch(() =>
        setOrder({
          orderNumber,
          email,
          status: "Pending",
          payment: "Paid",
          items: [],
          total: 0,
        })
      );
  }, [orderNumber, email]);

  return (
    <div className="bg-ivory min-h-screen">
      <SeoHead title="Thank You" />
      <div className="container-luxe py-16 md:py-24 max-w-2xl mx-auto text-center">
        <CheckCircle2 size={56} className="mx-auto text-champagne-dark mb-6" strokeWidth={1.25} />
        <p className="eyebrow mb-2">Order confirmed</p>
        <h1 className="heading-display text-3xl md:text-4xl text-noir mb-3">Thank you</h1>
        <p className="text-sm text-noir/55 mb-8 leading-relaxed">
          Your order{orderNumber ? ` ${orderNumber}` : ""} is placed
          {email ? ` · confirmation sent to ${email}` : ""}.
        </p>

        {order && (
          <div className="text-left border border-champagne/15 bg-white p-6 mb-8 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-noir/50">Status</span>
              <span className="text-noir font-medium">{order.status}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-noir/50">Payment</span>
              <span className="text-noir font-medium">
                {order.payment}
                {order.paymentMethod ? ` · ${order.paymentMethod}` : ""}
              </span>
            </div>
            {(order.items || []).slice(0, 4).map((item, i) => (
              <div key={i} className="flex justify-between text-sm text-noir/70 border-t border-champagne/10 pt-2">
                <span>
                  {item.name} × {item.qty || 1}
                </span>
                <span>{formatPrice((item.price || 0) * (item.qty || 1))}</span>
              </div>
            ))}
            <div className="flex justify-between text-sm font-medium text-noir border-t border-champagne/10 pt-3">
              <span>Total</span>
              <span>{formatPrice(order.total || 0)}</span>
            </div>
            {order.balanceDue > 0 && (
              <p className="text-xs text-champagne-dark">
                Balance before shipping: {formatPrice(order.balanceDue)}
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to={`/track-order?order=${encodeURIComponent(orderNumber)}&email=${encodeURIComponent(email)}`}
            className="btn-gold inline-flex items-center justify-center gap-2 !py-3.5"
          >
            <Package size={16} />
            Track order
          </Link>
          <Link
            to="/shop"
            className="btn-outline inline-flex items-center justify-center gap-2 !py-3.5"
          >
            <ShoppingBag size={16} />
            Continue shopping
          </Link>
        </div>

        <p className="mt-10 text-xs text-noir/40">
          <Link to="/account?tab=orders" className="link-underline text-champagne-dark">
            View all orders
          </Link>
          {" · "}
          <Link to="/contact" className="link-underline text-champagne-dark">
            Need help?
          </Link>
        </p>
      </div>
    </div>
  );
}
