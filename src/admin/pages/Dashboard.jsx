import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  IndianRupee,
  ShoppingBag,
  Package,
  Users,
  Clock,
  ArrowUpRight,
  MapPin,
  Type,
  CreditCard,
  FileText,
  Building2,
  KeyRound,
  Mail,
  Loader2,
  MessageSquare,
  Gem,
} from "lucide-react";
import { api } from "../../api/client";
import { formatPrice } from "../data/adminData";
import { AdminCard, StatCard, StatusBadge } from "../components/AdminUI";

const quickLinks = [
  { to: "/admin/business", label: "Business Settings", desc: "Logos, WhatsApp, Instagram & brand", icon: Building2 },
  { to: "/admin/page-content", label: "Edit Page Headings", desc: "CMS — control every storefront text", icon: Type },
  { to: "/admin/market-rates", label: "Market Rates", desc: "Gold & silver rates — updates all product prices", icon: Gem },
  { to: "/admin/settings", label: "Payment Gateways", desc: "Razorpay, COD, split payment", icon: CreditCard },
  { to: "/admin/mail", label: "Mail Settings", desc: "SMTP & email triggers", icon: Mail },
  { to: "/admin/credentials", label: "Admin Credentials", desc: "Update login & password", icon: KeyRound },
  { to: "/admin/reports", label: "Sales Reports", desc: "Live revenue, status & top products", icon: FileText },
];

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [unreadChats, setUnreadChats] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const [o, c, p, s, n] = await Promise.all([
          api("/orders", { portal: "admin" }),
          api("/customers", { portal: "admin" }).catch(() => []),
          api("/products?all=1", { portal: "admin" }).catch(() => []),
          api("/stores", { portal: "admin" }).catch(() => []),
          api("/notifications", { portal: "admin" }).catch(() => ({})),
        ]);
        if (cancelled) return;
        setOrders(Array.isArray(o) ? o : []);
        setCustomers(Array.isArray(c) ? c : []);
        setProducts(Array.isArray(p) ? p : []);
        setStores(Array.isArray(s) ? s : []);
        setUnreadChats(n.unreadChats || 0);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const stats = useMemo(() => {
    const active = orders.filter((o) => o.status !== "Cancelled" && o.payment !== "Refunded");
    const revenue = active.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    const pendingOrders = orders.filter(
      (o) => o.status === "Pending" || o.status === "Processing"
    ).length;
    const recent = [...orders]
      .sort(
        (a, b) =>
          new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0)
      )
      .slice(0, 5);
    const topProducts = [...products]
      .sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0))
      .slice(0, 4);
    return {
      revenue,
      orders: orders.length,
      pendingOrders,
      products: products.length,
      customers: customers.length,
      stores: stores.length,
      recent,
      topProducts,
    };
  }, [orders, customers, products, stores]);

  if (loading) {
    return (
      <div className="py-24 flex items-center justify-center gap-2 text-noir/50">
        <Loader2 className="animate-spin" size={18} /> Loading dashboard…
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <p className="eyebrow mb-1">Overview</p>
        <p className="text-sm text-noir/55">
          Live store metrics from MongoDB — revenue, orders, catalogue and support.
        </p>
      </div>

      <div className="bg-noir text-ivory p-5 md:p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gold-gradient" />
        <p className="text-[10px] uppercase tracking-widest2 text-champagne mb-2">Quick access</p>
        <h2 className="font-display text-2xl md:text-3xl text-ivory mb-1">Manage content & payments</h2>
        <p className="text-sm text-ivory/50 mb-5 max-w-xl">
          Edit CMS, configure gateways, and open live sales reports.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {quickLinks.map(({ to, label, desc, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="flex items-start gap-3 p-4 border border-champagne/20 bg-ivory/5 hover:bg-champagne/10 hover:border-champagne/40 transition-colors"
            >
              <div className="w-9 h-9 flex items-center justify-center border border-champagne/30 text-champagne shrink-0">
                <Icon size={16} />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-ivory font-medium">{label}</p>
                <p className="text-xs text-ivory/40 mt-0.5">{desc}</p>
              </div>
              <ArrowUpRight size={14} className="text-champagne ml-auto shrink-0 mt-1" />
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Total Revenue"
          value={formatPrice(stats.revenue)}
          hint="Excluding cancelled / refunded"
          icon={IndianRupee}
        />
        <StatCard
          label="Orders"
          value={stats.orders}
          hint={`${stats.pendingOrders} need attention`}
          icon={ShoppingBag}
        />
        <StatCard
          label="Products"
          value={stats.products}
          hint="Live in catalogue"
          icon={Package}
        />
        <StatCard
          label="Customers"
          value={stats.customers}
          hint={`${stats.stores} store locations`}
          icon={Users}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <AdminCard
          className="xl:col-span-2"
          title="Recent Orders"
          action={
            <Link
              to="/admin/orders"
              className="text-[11px] uppercase tracking-widest2 text-champagne-dark hover:text-noir flex items-center gap-1"
            >
              View all <ArrowUpRight size={12} />
            </Link>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-champagne/10 text-left">
                  <th className="px-5 py-3 text-[10px] uppercase tracking-widest2 text-noir/40 font-medium">Order</th>
                  <th className="px-5 py-3 text-[10px] uppercase tracking-widest2 text-noir/40 font-medium">Customer</th>
                  <th className="px-5 py-3 text-[10px] uppercase tracking-widest2 text-noir/40 font-medium hidden md:table-cell">Date</th>
                  <th className="px-5 py-3 text-[10px] uppercase tracking-widest2 text-noir/40 font-medium">Status</th>
                  <th className="px-5 py-3 text-[10px] uppercase tracking-widest2 text-noir/40 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-noir/45">
                      No orders yet — place a storefront order to see it here.
                    </td>
                  </tr>
                ) : (
                  stats.recent.map((order) => {
                    const id = order.orderNumber || order.id;
                    return (
                      <tr key={id} className="border-b border-champagne/5 hover:bg-stone-50/80 transition-colors">
                        <td className="px-5 py-3.5">
                          <Link to={`/admin/orders/${id}`} className="font-medium text-noir hover:text-champagne-dark">
                            {id}
                          </Link>
                        </td>
                        <td className="px-5 py-3.5 text-noir/70">{order.customer}</td>
                        <td className="px-5 py-3.5 text-noir/50 hidden md:table-cell">
                          {order.date ||
                            (order.createdAt
                              ? new Date(order.createdAt).toISOString().slice(0, 10)
                              : "—")}
                        </td>
                        <td className="px-5 py-3.5">
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="px-5 py-3.5 text-right font-medium">
                          {formatPrice(Number(order.total) || 0)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </AdminCard>

        <div className="space-y-6">
          <AdminCard title="Needs Attention">
            <ul className="divide-y divide-champagne/10">
              <li className="px-5 py-4 flex items-start gap-3">
                <div className="w-8 h-8 flex items-center justify-center bg-amber-50 text-amber-700 border border-amber-100 shrink-0">
                  <Clock size={14} />
                </div>
                <div>
                  <p className="text-sm font-medium text-noir">{stats.pendingOrders} orders pending</p>
                  <p className="text-xs text-noir/45 mt-0.5">Awaiting processing or shipment</p>
                  <Link to="/admin/orders" className="text-xs text-champagne-dark hover:underline mt-1 inline-block">
                    Open orders
                  </Link>
                </div>
              </li>
              <li className="px-5 py-4 flex items-start gap-3">
                <div className="w-8 h-8 flex items-center justify-center bg-champagne/10 text-champagne-dark border border-champagne/20 shrink-0">
                  <MessageSquare size={14} />
                </div>
                <div>
                  <p className="text-sm font-medium text-noir">{unreadChats} unread chats</p>
                  <Link
                    to="/admin/order-support"
                    className="text-xs text-champagne-dark hover:underline mt-1 inline-block"
                  >
                    Order chat & returns
                  </Link>
                </div>
              </li>
              <li className="px-5 py-4 flex items-start gap-3">
                <div className="w-8 h-8 flex items-center justify-center bg-stone-100 text-noir/60 border border-stone-200 shrink-0">
                  <MapPin size={14} />
                </div>
                <div>
                  <p className="text-sm font-medium text-noir">{stats.stores} boutiques live</p>
                  <Link to="/admin/stores" className="text-xs text-champagne-dark mt-0.5 inline-block hover:underline">
                    Manage stores
                  </Link>
                </div>
              </li>
            </ul>
          </AdminCard>

          <AdminCard
            title="Catalogue highlight"
            action={
              <Link to="/admin/products" className="text-[11px] uppercase tracking-widest2 text-champagne-dark">
                All
              </Link>
            }
          >
            <ul className="divide-y divide-champagne/10">
              {stats.topProducts.length === 0 ? (
                <li className="px-5 py-6 text-sm text-noir/45">No products yet</li>
              ) : (
                stats.topProducts.map((p) => (
                  <li key={p.id || p._id || p.sku} className="px-5 py-3 flex justify-between gap-2 text-sm">
                    <span className="truncate text-noir font-medium">{p.name}</span>
                    <span className="shrink-0 text-champagne-dark">{formatPrice(Number(p.price) || 0)}</span>
                  </li>
                ))
              )}
            </ul>
          </AdminCard>
        </div>
      </div>
    </div>
  );
}
