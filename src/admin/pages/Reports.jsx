import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart3,
  IndianRupee,
  ShoppingBag,
  TrendingUp,
  Users,
  CreditCard,
  Package,
  Loader2,
} from "lucide-react";
import { api } from "../../api/client";
import { formatPrice } from "../data/adminData";
import { AdminCard, StatusBadge, StatCard } from "../components/AdminUI";
import notify from "../../utils/toast";

function dayKey(d) {
  const x = new Date(d);
  if (Number.isNaN(x.getTime())) return "";
  return x.toISOString().slice(0, 10);
}

function lastNDays(n) {
  const out = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    d.setDate(d.getDate() - i);
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

function isActiveSale(o) {
  return o.status !== "Cancelled" && o.payment !== "Refunded";
}

export default function Reports() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const [o, c, p, t, inv] = await Promise.all([
          api("/orders", { portal: "admin" }),
          api("/customers", { portal: "admin" }).catch(() => []),
          api("/products?all=1", { portal: "admin" }).catch(() => []),
          api("/transactions", { portal: "admin" }).catch(() => []),
          api("/invoices", { portal: "admin" }).catch(() => []),
        ]);
        if (cancelled) return;
        setOrders(Array.isArray(o) ? o : []);
        setCustomers(Array.isArray(c) ? c : []);
        setProducts(Array.isArray(p) ? p : []);
        setTransactions(Array.isArray(t) ? t : []);
        setInvoices(Array.isArray(inv) ? inv : []);
      } catch (err) {
        if (!cancelled) notify.error(err.message || "Could not load reports");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const stats = useMemo(() => {
    const active = orders.filter(isActiveSale);
    const revenue = active.reduce((s, o) => s + (Number(o.total) || 0), 0);
    const avg = active.length ? revenue / active.length : 0;
    const paid = orders.filter((o) => o.payment === "Paid" || o.payment === "Partial").length;
    const pending = orders.filter(
      (o) => o.status === "Pending" || o.status === "Processing"
    ).length;

    const byStatus = {};
    const byPayment = {};
    const byGateway = {};
    for (const o of orders) {
      byStatus[o.status || "Unknown"] = (byStatus[o.status || "Unknown"] || 0) + 1;
      byPayment[o.payment || "Unknown"] = (byPayment[o.payment || "Unknown"] || 0) + 1;
      const gw = o.paymentLabel || o.paymentMethod || "—";
      byGateway[gw] = (byGateway[gw] || 0) + 1;
    }

    const days = lastNDays(30);
    const dailyMap = Object.fromEntries(days.map((d) => [d, { count: 0, revenue: 0 }]));
    for (const o of active) {
      const k = dayKey(o.createdAt || o.date);
      if (dailyMap[k]) {
        dailyMap[k].count += 1;
        dailyMap[k].revenue += Number(o.total) || 0;
      }
    }
    const daily = days.map((d) => ({ date: d, ...dailyMap[d] }));
    const maxRev = Math.max(1, ...daily.map((d) => d.revenue));

    const productMap = {};
    for (const o of active) {
      for (const item of o.items || []) {
        const key = item.name || item.productId || "Item";
        if (!productMap[key]) {
          productMap[key] = { name: key, qty: 0, revenue: 0, image: item.image || "" };
        }
        productMap[key].qty += Number(item.qty) || 1;
        productMap[key].revenue += (Number(item.price) || 0) * (Number(item.qty) || 1);
      }
    }
    const topProducts = Object.values(productMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 8);

    const recent = [...orders]
      .sort(
        (a, b) =>
          new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0)
      )
      .slice(0, 10);

    const txnSuccess = transactions.filter((t) => t.status === "Success").length;
    const invoicePaid = invoices.filter((i) => i.status === "Paid" || i.status === "Partial").length;

    return {
      revenue,
      orderCount: orders.length,
      activeCount: active.length,
      avg,
      paid,
      pending,
      customers: customers.length,
      products: products.length,
      byStatus,
      byPayment,
      byGateway,
      daily,
      maxRev,
      topProducts,
      recent,
      txnSuccess,
      txnTotal: transactions.length,
      invoicePaid,
      invoiceTotal: invoices.length,
    };
  }, [orders, customers, products, transactions, invoices]);

  if (loading) {
    return (
      <div className="py-24 flex items-center justify-center gap-2 text-noir/50">
        <Loader2 className="animate-spin" size={18} /> Loading live reports…
      </div>
    );
  }

  return (
    <div className="animate-fade-up space-y-6 min-w-0">
      <div>
        <p className="eyebrow mb-1">Analytics</p>
        <h2 className="font-display text-2xl sm:text-3xl text-noir">Sales reports</h2>
        <p className="text-sm text-noir/50 mt-1">
          Live data from orders, invoices and transactions — not demo numbers.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Revenue (active)"
          value={formatPrice(stats.revenue)}
          hint="Excludes cancelled / refunded"
          icon={IndianRupee}
        />
        <StatCard
          label="Orders"
          value={stats.orderCount}
          hint={`${stats.pending} pending · ${stats.paid} paid`}
          icon={ShoppingBag}
        />
        <StatCard
          label="Avg. order value"
          value={formatPrice(stats.avg)}
          hint={`${stats.activeCount} counted sales`}
          icon={TrendingUp}
        />
        <StatCard
          label="Customers"
          value={stats.customers}
          hint={`${stats.products} catalogue products`}
          icon={Users}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <AdminCard>
          <div className="p-5 flex items-center gap-3">
            <CreditCard className="text-champagne-dark shrink-0" size={20} />
            <div>
              <p className="text-[10px] uppercase tracking-widest2 text-noir/40">Transactions</p>
              <p className="font-display text-2xl text-noir">
                {stats.txnSuccess}
                <span className="text-base text-noir/40"> / {stats.txnTotal}</span>
              </p>
              <p className="text-xs text-noir/45">Successful / total</p>
            </div>
          </div>
        </AdminCard>
        <AdminCard>
          <div className="p-5 flex items-center gap-3">
            <Package className="text-champagne-dark shrink-0" size={20} />
            <div>
              <p className="text-[10px] uppercase tracking-widest2 text-noir/40">Invoices</p>
              <p className="font-display text-2xl text-noir">
                {stats.invoicePaid}
                <span className="text-base text-noir/40"> / {stats.invoiceTotal}</span>
              </p>
              <p className="text-xs text-noir/45">Paid or partial / total</p>
            </div>
          </div>
        </AdminCard>
        <AdminCard>
          <div className="p-5 flex items-center gap-3">
            <BarChart3 className="text-champagne-dark shrink-0" size={20} />
            <div>
              <p className="text-[10px] uppercase tracking-widest2 text-noir/40">Conversion snapshot</p>
              <p className="font-display text-2xl text-noir">
                {stats.customers
                  ? `${Math.round((stats.orderCount / stats.customers) * 10) / 10}×`
                  : "—"}
              </p>
              <p className="text-xs text-noir/45">Orders per customer (avg)</p>
            </div>
          </div>
        </AdminCard>
      </div>

      <AdminCard title="Sales last 30 days" subtitle="Revenue by day from live orders">
        <div className="p-5">
          {stats.daily.every((d) => d.revenue === 0) ? (
            <p className="text-sm text-noir/45 text-center py-10">
              No sales in the last 30 days yet.
            </p>
          ) : (
            <div className="flex items-end gap-1 h-44">
              {stats.daily.map((d) => (
                <div key={d.date} className="flex-1 min-w-0 flex flex-col items-center gap-1 h-full justify-end group">
                  <div
                    className="w-full max-w-[14px] rounded-t bg-champagne/80 hover:bg-champagne transition-colors"
                    style={{ height: `${Math.max(2, (d.revenue / stats.maxRev) * 100)}%` }}
                    title={`${d.date}: ${formatPrice(d.revenue)} · ${d.count} orders`}
                  />
                  <span className="text-[8px] text-noir/30 rotate-[-60deg] origin-center hidden sm:block opacity-0 group-hover:opacity-100">
                    {d.date.slice(8)}
                  </span>
                </div>
              ))}
            </div>
          )}
          <p className="text-[11px] text-noir/40 mt-3 text-center">
            Hover a bar for date · revenue · order count
          </p>
        </div>
      </AdminCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AdminCard title="Orders by status">
          <ul className="divide-y divide-champagne/10">
            {Object.keys(stats.byStatus).length === 0 ? (
              <li className="px-5 py-6 text-sm text-noir/45">No orders</li>
            ) : (
              Object.entries(stats.byStatus).map(([k, v]) => (
                <li key={k} className="px-5 py-3 flex items-center justify-between gap-3 text-sm">
                  <StatusBadge status={k} />
                  <span className="font-medium text-noir">{v}</span>
                </li>
              ))
            )}
          </ul>
        </AdminCard>

        <AdminCard title="Payment status">
          <ul className="divide-y divide-champagne/10">
            {Object.keys(stats.byPayment).length === 0 ? (
              <li className="px-5 py-6 text-sm text-noir/45">No data</li>
            ) : (
              Object.entries(stats.byPayment).map(([k, v]) => (
                <li key={k} className="px-5 py-3 flex items-center justify-between gap-3 text-sm">
                  <StatusBadge status={k} />
                  <span className="font-medium text-noir">{v}</span>
                </li>
              ))
            )}
          </ul>
        </AdminCard>

        <AdminCard title="Gateway mix">
          <ul className="divide-y divide-champagne/10">
            {Object.keys(stats.byGateway).length === 0 ? (
              <li className="px-5 py-6 text-sm text-noir/45">No data</li>
            ) : (
              Object.entries(stats.byGateway).map(([k, v]) => (
                <li key={k} className="px-5 py-3 flex items-center justify-between gap-3 text-sm">
                  <span className="text-noir/70 capitalize">{k}</span>
                  <span className="font-medium text-noir">{v}</span>
                </li>
              ))
            )}
          </ul>
        </AdminCard>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <AdminCard
          title="Top products (from orders)"
          action={
            <Link to="/admin/products" className="text-[11px] uppercase tracking-widest2 text-champagne-dark">
              Catalogue
            </Link>
          }
        >
          <ul className="divide-y divide-champagne/10">
            {stats.topProducts.length === 0 ? (
              <li className="px-5 py-8 text-sm text-noir/45 text-center">No sold items yet</li>
            ) : (
              stats.topProducts.map((p) => (
                <li key={p.name} className="px-5 py-3 flex items-center justify-between gap-3 text-sm">
                  <div className="min-w-0">
                    <p className="font-medium text-noir truncate">{p.name}</p>
                    <p className="text-xs text-noir/40">Qty sold {p.qty}</p>
                  </div>
                  <p className="font-medium shrink-0">{formatPrice(p.revenue)}</p>
                </li>
              ))
            )}
          </ul>
        </AdminCard>

        <AdminCard
          title="Recent orders"
          action={
            <Link to="/admin/orders" className="text-[11px] uppercase tracking-widest2 text-champagne-dark">
              View all
            </Link>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-widest2 text-noir/40 border-b border-champagne/10">
                  <th className="px-5 py-3">Order</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3 hidden sm:table-cell">Date</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-noir/45">
                      No orders yet
                    </td>
                  </tr>
                ) : (
                  stats.recent.map((o) => (
                    <tr key={o.id || o.orderNumber} className="border-b border-champagne/5">
                      <td className="px-5 py-3">
                        <Link
                          to={`/admin/orders/${o.orderNumber || o.id}`}
                          className="font-medium text-champagne-dark hover:underline"
                        >
                          {o.orderNumber || o.id}
                        </Link>
                      </td>
                      <td className="px-5 py-3 text-noir/70 truncate max-w-[120px]">{o.customer}</td>
                      <td className="px-5 py-3 text-noir/45 hidden sm:table-cell">
                        {o.date ||
                          (o.createdAt ? new Date(o.createdAt).toISOString().slice(0, 10) : "—")}
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge status={o.status} />
                      </td>
                      <td className="px-5 py-3 text-right font-medium">
                        {formatPrice(Number(o.total) || 0)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
