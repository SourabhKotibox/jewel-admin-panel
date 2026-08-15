import { useState, useEffect } from "react";
import { NavLink, Outlet, Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Tags,
  Users,
  MapPin,
  MessageSquareQuote,
  Settings,
  Menu,
  X,
  Search,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  FileText,
  Layers,
  Truck,
  Receipt,
  RotateCcw,
  CreditCard,
  Boxes,
  Ticket,
  Megaphone,
  Star,
  Mail,
  UserCog,
  Type,
  Building2,
  KeyRound,
  Image as ImageIcon,
  Palette,
  BarChart3,
  HelpCircle,
  BookOpen,
  Percent,
  Shield,
  LogOut,
  Gem,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import useSettingsStore, { resolveLogo } from "../store/useSettingsStore";
import { logout } from "../store/redux/slices/authSlice";
import AdminNotificationBell from "./components/AdminNotificationBell";
import { canSeePath } from "./data/adminAccess";
import { assetUrl } from "../api/client";

const navGroups = [
  {
    items: [{ to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true }],
  },
  {
    label: "Catalog",
    items: [
      { to: "/admin/products", label: "Products", icon: Package },
      { to: "/admin/market-rates", label: "Market Rates", icon: Gem },
      { to: "/admin/categories", label: "Categories", icon: Tags },
      { to: "/admin/jewelry-types", label: "Jewellery Types", icon: Type },
      { to: "/admin/attributes", label: "Attributes", icon: Layers },
      { to: "/admin/inventory", label: "Inventory", icon: Boxes },
    ],
  },
  {
    label: "Sales",
    items: [
      { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
      { to: "/admin/order-support", label: "Order Chat & Returns", icon: MessageSquareQuote },
      { to: "/admin/invoices", label: "Invoices", icon: Receipt },
      { to: "/admin/shipments", label: "Shipments", icon: Truck },
      { to: "/admin/refunds", label: "Refunds", icon: RotateCcw },
      { to: "/admin/transactions", label: "Transactions", icon: CreditCard },
      { to: "/admin/reports", label: "Reports", icon: BarChart3 },
    ],
  },
  {
    label: "Customers",
    items: [
      { to: "/admin/customers", label: "Customers", icon: Users },
      { to: "/admin/reviews", label: "Reviews", icon: Star },
      { to: "/admin/newsletter", label: "Newsletter", icon: Mail },
    ],
  },
  {
    label: "Marketing",
    items: [
      { to: "/admin/coupons", label: "Coupons", icon: Ticket },
      { to: "/admin/campaigns", label: "Campaigns", icon: Megaphone },
    ],
  },
  {
    label: "CMS",
    items: [
      { to: "/admin/page-content", label: "Page Content", icon: Type },
      { to: "/admin/dynamic-pages", label: "Dynamic Pages", icon: FileText },
      { to: "/admin/cms-pages", label: "Static Pages", icon: FileText },
      { to: "/admin/blog", label: "Blog", icon: BookOpen },
      { to: "/admin/faqs", label: "FAQs", icon: HelpCircle },
      { to: "/admin/media", label: "Media Library", icon: ImageIcon },
      { to: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
      { to: "/admin/themes", label: "Themes", icon: Palette },
    ],
  },
  {
    label: "Configure",
    items: [
      { to: "/admin/business", label: "Business Settings", icon: Building2 },
      { to: "/admin/settings", label: "Payments & Shipping", icon: Settings },
      { to: "/admin/mail", label: "Mail Settings", icon: Mail },
      { to: "/admin/credentials", label: "Admin Credentials", icon: KeyRound },
      { to: "/admin/taxes", label: "Taxes", icon: Percent },
      { to: "/admin/roles", label: "Roles", icon: Shield },
      { to: "/admin/users", label: "Admin Users", icon: UserCog },
      { to: "/admin/stores", label: "Stores", icon: MapPin },
    ],
  },
];

const pageTitles = {
  "/admin": "Dashboard",
  "/admin/products": "Products",
  "/admin/products/new": "Add Product",
  "/admin/market-rates": "Market Rates",
  "/admin/orders": "Orders",
  "/admin/order-support": "Order Chat & Returns",
  "/admin/returns": "Order Chat & Returns",
  "/admin/categories": "Categories",
  "/admin/jewelry-types": "Jewellery Types",
  "/admin/customers": "Customers",
  "/admin/stores": "Stores",
  "/admin/testimonials": "Testimonials",
  "/admin/settings": "Payments & Shipping",
  "/admin/business": "Business Settings",
  "/admin/credentials": "Admin Credentials",
  "/admin/mail": "Mail Settings",
  "/admin/page-content": "Page Content",
  "/admin/dynamic-pages": "Dynamic Pages",
  "/admin/cms-pages": "Static Pages",
  "/admin/invoices": "Invoices",
  "/admin/shipments": "Shipments",
  "/admin/refunds": "Refunds",
  "/admin/transactions": "Transactions",
  "/admin/attributes": "Attributes",
  "/admin/inventory": "Inventory",
  "/admin/coupons": "Coupons",
  "/admin/campaigns": "Campaigns",
  "/admin/reviews": "Reviews",
  "/admin/newsletter": "Newsletter",
  "/admin/users": "Admin Users",
  "/admin/media": "Media Library",
  "/admin/themes": "Themes",
  "/admin/reports": "Reports",
  "/admin/faqs": "FAQs",
  "/admin/blog": "Blog",
  "/admin/taxes": "Taxes",
  "/admin/roles": "Roles",
};

function SidebarNav({ onNavigate, role }) {
  const location = useLocation();
  const path = location.pathname.replace(/^\/jewel/, "") || "/";
  const [openGroups, setOpenGroups] = useState(() =>
    navGroups.reduce((acc, g) => {
      if (g.label) acc[g.label] = true;
      return acc;
    }, {})
  );

  const toggle = (label) =>
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));

  const groups = navGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => canSeePath(role, item.to)),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <nav className="flex-1 px-3 py-4 space-y-3 overflow-y-auto">
      {groups.map((group, gi) => (
        <div key={gi}>
          {group.label && (
            <button
              type="button"
              onClick={() => toggle(group.label)}
              className="w-full flex items-center justify-between px-4 py-2 text-[10px] uppercase tracking-widest2 text-champagne/55 hover:text-champagne rounded-lg"
            >
              {group.label}
              <ChevronDown
                size={12}
                className={`transition-transform ${openGroups[group.label] ? "" : "-rotate-90"}`}
              />
            </button>
          )}
          {(!group.label || openGroups[group.label]) && (
            <div className="space-y-0.5">
              {group.items.map(({ to, label, icon: Icon, end }) => {
                const active = end
                  ? path === to
                  : path === to || path.startsWith(to + "/");
                return (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    onClick={onNavigate}
                    className={`flex items-center gap-3 px-4 py-2.5 text-sm tracking-wide rounded-xl transition-all duration-300 ${
                      active
                        ? "bg-champagne/15 text-champagne"
                        : "text-ivory/55 hover:text-champagne-light hover:bg-ivory/5"
                    }`}
                  >
                    <Icon size={16} strokeWidth={1.5} />
                    <span className="uppercase text-[10px] tracking-widest2">{label}</span>
                  </NavLink>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const authUser = useSelector((s) => s.auth.user);
  const business = useSettingsStore((s) => s.business) || {};
  const credentials = useSettingsStore((s) => s.credentials) || {};
  const adminLogo = resolveLogo(business.adminLogo);
  const adminLogoH = business.adminLogoHeight || 48;

  const title = (() => {
    const rawPath = location.pathname.replace(/^\/jewel/, "") || "/";
    if (pageTitles[rawPath]) return pageTitles[rawPath];
    if (rawPath.startsWith("/admin/products/")) return "Edit Product";
    if (rawPath.match(/^\/admin\/orders\/[^/]+\/edit$/)) return "Edit Order";
    if (rawPath === "/admin/orders/new") return "New Order";
    if (rawPath.startsWith("/admin/orders/")) return "Order Detail";
    const editMatch = rawPath.match(/^\/admin\/([^/]+)\/(new|[^/]+)$/);
    if (editMatch) {
      const key = editMatch[1];
      const label = pageTitles[`/admin/${key}`] || key;
      return editMatch[2] === "new" ? `New ${label}` : `Edit ${label}`;
    }
    return "Admin";
  })();

  const displayName = authUser?.name || credentials.name || "Madhu Admin";
  const displayRole = authUser?.role || credentials.role || "Admin";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const brand = business.businessName || "Madhu Jewellery";
  const favicon =
    business.favicon &&
    (/^https?:\/\//i.test(business.favicon) || business.favicon.startsWith("data:")
      ? business.favicon
      : assetUrl(business.favicon));

  return (
    <div className="min-h-screen bg-[#F7F4EE] flex">
      <Helmet>
        <title>{`${title} | ${brand} Admin`}</title>
        {favicon ? (
          <>
            <link rel="icon" href={favicon} />
            <link rel="shortcut icon" href={favicon} />
          </>
        ) : null}
      </Helmet>
      <aside className="hidden lg:flex w-[272px] flex-col bg-noir fixed inset-y-0 left-0 z-40 rounded-r-3xl overflow-hidden shadow-2xl">
        <div className="px-5 py-5 border-b border-champagne/10">
          <Link to="/admin" className="flex items-center gap-3 min-h-[56px]">
            <div className="bg-ivory rounded-2xl px-3 py-2 shadow-sm border border-champagne/20 flex items-center justify-center w-full max-w-[200px]">
              <img
                src={adminLogo}
                alt={business.businessName || "Admin"}
                style={{ height: `${Math.max(adminLogoH, 36)}px` }}
                className="w-auto max-w-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = new URL("../assets/images/logo.png", import.meta.url).href;
                }}
              />
            </div>
          </Link>
          <p className="mt-3 text-[10px] uppercase tracking-widest2 text-champagne/70">
            {business.businessName || "Madhu"} · Admin
          </p>
        </div>
        <SidebarNav role={authUser?.role || "editor"} />
        <div className="p-4 border-t border-champagne/10">
          <Link
            to="/"
            className="flex items-center gap-2 text-[11px] uppercase tracking-widest2 text-ivory/50 hover:text-champagne transition-colors rounded-xl px-2 py-2 hover:bg-ivory/5"
          >
            <ExternalLink size={14} />
            View Storefront
          </Link>
        </div>
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-noir/60 z-50 lg:hidden backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.28 }}
              className="fixed inset-y-0 left-0 w-72 bg-noir z-50 flex flex-col lg:hidden rounded-r-3xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 py-5 border-b border-champagne/10">
                <div className="bg-ivory rounded-2xl px-3 py-2 border border-champagne/20">
                  <img
                    src={adminLogo}
                    alt={business.businessName || "Admin"}
                    style={{ height: `${Math.min(Math.max(adminLogoH, 32), 40)}px` }}
                    className="w-auto object-contain"
                  />
                </div>
                <button onClick={() => setMobileOpen(false)} className="text-ivory/70 p-2 rounded-xl hover:bg-ivory/5" aria-label="Close">
                  <X size={22} />
                </button>
              </div>
               <SidebarNav role={authUser?.role || "editor"} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 lg:ml-[272px] min-h-screen flex flex-col min-w-0 w-full overflow-x-hidden">
        <header className="sticky top-0 z-30 mx-3 mt-3 lg:mx-6 lg:mt-4">
          <div className="flex items-center justify-between gap-3 sm:gap-4 px-3 sm:px-6 h-16 bg-white/90 backdrop-blur-md border border-champagne/20 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <button className="lg:hidden text-noir p-2 rounded-xl hover:bg-stone-100" onClick={() => setMobileOpen(true)} aria-label="Open menu">
                <Menu size={22} />
              </button>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest2 text-noir/40 mb-0.5">
                  <span>Admin</span>
                  <ChevronRight size={10} />
                  <span className="text-champagne-dark truncate">{title}</span>
                </div>
                <h1 className="font-display text-xl md:text-2xl text-noir truncate leading-tight">{title}</h1>
              </div>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
              <div className="hidden md:flex items-center gap-2 border border-champagne/25 rounded-xl px-3 py-2 w-40 lg:w-56 bg-stone-50">
                <Search size={16} className="text-noir/40 shrink-0" />
                <input
                  type="search"
                  placeholder="Search..."
                  className="bg-transparent outline-none text-sm w-full placeholder:text-noir/35"
                />
              </div>
              <AdminNotificationBell />
              <Link to="/admin/credentials" className="flex items-center gap-2 pl-2 border-l border-champagne/20">
                <div className="w-9 h-9 rounded-full bg-noir text-champagne flex items-center justify-center text-xs font-semibold shrink-0">
                  {initials}
                </div>
                <div className="hidden sm:block min-w-0">
                  <p className="text-xs font-medium text-noir leading-none truncate max-w-[120px]">{displayName}</p>
                  <p className="text-[10px] text-noir/40 mt-0.5 capitalize">{displayRole}</p>
                </div>
              </Link>
              <button
                type="button"
                onClick={() => dispatch(logout())}
                className="p-2 sm:p-2.5 rounded-xl text-noir/50 hover:text-rose-600 hover:bg-rose-50"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </header>
        <main className="flex-1 p-3 sm:p-6 lg:p-8 min-w-0 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
