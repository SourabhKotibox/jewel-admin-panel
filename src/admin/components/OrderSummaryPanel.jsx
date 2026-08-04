import { Link } from "react-router-dom";
import { ExternalLink, Package } from "lucide-react";
import { formatPrice } from "../data/adminData";
import { assetUrl } from "../../api/client";
import { StatusBadge } from "./AdminUI";

function imgSrc(src) {
  if (!src) return "";
  if (/^https?:\/\//i.test(src) || src.startsWith("data:")) return src;
  return assetUrl(src);
}

/** Full associated order details beside chat / support */
export default function OrderSummaryPanel({ order, loading }) {
  if (loading) {
    return (
      <div className="border border-champagne/20 rounded-2xl p-5 text-sm text-noir/45">
        Loading order details…
      </div>
    );
  }
  if (!order) {
    return (
      <div className="border border-dashed border-champagne/30 rounded-2xl p-5 text-sm text-noir/45">
        Order details unavailable
      </div>
    );
  }

  const id = order.orderNumber || order.id;

  return (
    <div className="border border-champagne/20 rounded-2xl bg-white overflow-hidden">
      <div className="px-4 py-3 border-b border-champagne/10 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-widest2 text-noir/40">Associated order</p>
          <p className="font-medium text-noir truncate">{id}</p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <StatusBadge status={order.status} />
          <StatusBadge status={order.payment} />
        </div>
      </div>

      <div className="p-4 space-y-4 text-sm">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-widest2 text-noir/40 mb-1">Customer</p>
            <p className="font-medium text-noir">{order.customer || "—"}</p>
            <p className="text-xs text-noir/50 break-all">{order.email}</p>
            {order.phone ? <p className="text-xs text-noir/50">{order.phone}</p> : null}
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest2 text-noir/40 mb-1">Payment</p>
            <p className="text-noir">
              {order.paymentLabel || order.paymentMethod || "—"} · {order.payment}
            </p>
            <p className="text-xs text-champagne-dark font-medium mt-1">
              {formatPrice(Number(order.total) || 0)}
            </p>
            {order.paymentId ? (
              <p className="text-[10px] font-mono text-noir/40 mt-1 break-all">{order.paymentId}</p>
            ) : null}
          </div>
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-widest2 text-noir/40 mb-1">Ship to</p>
          <p className="text-noir/70 text-xs leading-relaxed">{order.address || "—"}</p>
        </div>

        {(order.awb || order.trackingUrl) && (
          <div>
            <p className="text-[10px] uppercase tracking-widest2 text-noir/40 mb-1">Tracking</p>
            <p className="text-xs text-noir/70">
              {order.courier || "Courier"}
              {order.awb ? ` · AWB ${order.awb}` : ""}
            </p>
            {order.trackingUrl ? (
              <a
                href={order.trackingUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs text-champagne-dark underline mt-1"
              >
                Open tracking <ExternalLink size={11} />
              </a>
            ) : null}
          </div>
        )}

        <div>
          <p className="text-[10px] uppercase tracking-widest2 text-noir/40 mb-2 flex items-center gap-1.5">
            <Package size={12} /> Items ({(order.items || []).length})
          </p>
          <ul className="space-y-2 max-h-48 overflow-y-auto">
            {(order.items || []).map((item, i) => (
              <li key={i} className="flex items-center gap-2">
                {item.image ? (
                  <img
                    src={imgSrc(item.image)}
                    alt=""
                    className="w-10 h-10 rounded-lg object-cover bg-stone-100 shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-stone-100 shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-noir truncate">{item.name}</p>
                  <p className="text-[10px] text-noir/40">Qty {item.qty || 1}</p>
                </div>
                <p className="text-xs shrink-0">
                  {formatPrice((item.price || 0) * (item.qty || 1))}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap gap-3 pt-1 border-t border-champagne/10">
          <Link
            to={`/admin/orders/${id}`}
            className="text-[11px] uppercase tracking-widest2 text-champagne-dark hover:underline"
          >
            Full order detail
          </Link>
          <Link
            to="/admin/invoices"
            className="text-[11px] uppercase tracking-widest2 text-noir/45 hover:text-champagne-dark"
          >
            Invoices
          </Link>
          <Link
            to="/admin/shipments"
            className="text-[11px] uppercase tracking-widest2 text-noir/45 hover:text-champagne-dark"
          >
            Shipments
          </Link>
        </div>
      </div>
    </div>
  );
}
