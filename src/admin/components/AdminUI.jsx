import clsx from "clsx";

export function StatusBadge({ status, className }) {
  const styles = {
    Pending: "bg-amber-50 text-amber-800 border-amber-200",
    Processing: "bg-blue-50 text-blue-800 border-blue-200",
    Shipped: "bg-indigo-50 text-indigo-800 border-indigo-200",
    Delivered: "bg-emerald-50 text-emerald-800 border-emerald-200",
    Cancelled: "bg-rose-50 text-rose-800 border-rose-200",
    Paid: "bg-emerald-50 text-emerald-800 border-emerald-200",
    Partial: "bg-amber-50 text-amber-800 border-amber-200",
    Refunded: "bg-stone-100 text-noir/60 border-stone-200",
    Active: "bg-emerald-50 text-emerald-800 border-emerald-200",
    Draft: "bg-stone-100 text-noir/60 border-stone-200",
    "Ready to Ship": "bg-emerald-50 text-emerald-800 border-emerald-200",
    "Made to Order": "bg-champagne/10 text-champagne-dark border-champagne/30",
    "In Transit": "bg-indigo-50 text-indigo-800 border-indigo-200",
    Success: "bg-emerald-50 text-emerald-800 border-emerald-200",
    Failed: "bg-rose-50 text-rose-800 border-rose-200",
    Expired: "bg-stone-100 text-noir/60 border-stone-200",
    Published: "bg-emerald-50 text-emerald-800 border-emerald-200",
    Approved: "bg-emerald-50 text-emerald-800 border-emerald-200",
    Subscribed: "bg-emerald-50 text-emerald-800 border-emerald-200",
    Unsubscribed: "bg-stone-100 text-noir/60 border-stone-200",
    Scheduled: "bg-blue-50 text-blue-800 border-blue-200",
    Sent: "bg-emerald-50 text-emerald-800 border-emerald-200",
    "In Stock": "bg-emerald-50 text-emerald-800 border-emerald-200",
    "Low Stock": "bg-amber-50 text-amber-800 border-amber-200",
    "Out of Stock": "bg-rose-50 text-rose-800 border-rose-200",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center px-3 py-1 text-[10px] uppercase tracking-widest2 border rounded-full",
        styles[status] || "bg-stone-100 text-noir/60 border-stone-200",
        className
      )}
    >
      {status}
    </span>
  );
}

export function StatCard({ label, value, hint, icon: Icon, accent }) {
  return (
    <div className="bg-white border border-champagne/20 rounded-2xl p-5 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="absolute top-0 left-0 w-full h-1 bg-gold-gradient opacity-70 rounded-t-2xl" />
      <div className="flex items-start justify-between gap-3 pt-1">
        <div>
          <p className="text-[10px] uppercase tracking-widest2 text-noir/45 mb-2">{label}</p>
          <p className="font-display text-3xl text-noir leading-none">{value}</p>
          {hint && <p className="text-xs text-noir/45 mt-2">{hint}</p>}
        </div>
        {Icon && (
          <div
            className={clsx(
              "w-11 h-11 rounded-xl flex items-center justify-center border",
              accent || "border-champagne/30 text-champagne-dark bg-champagne/10"
            )}
          >
            <Icon size={18} strokeWidth={1.5} />
          </div>
        )}
      </div>
    </div>
  );
}

export function AdminCard({ children, className, title, action, subtitle }) {
  return (
    <div className={clsx("bg-white border border-champagne/20 rounded-2xl shadow-sm overflow-hidden", className)}>
      {(title || action) && (
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-champagne/10 bg-gradient-to-r from-stone-50/80 to-white">
          <div>
            {title && <h3 className="font-display text-lg text-noir">{title}</h3>}
            {subtitle && <p className="text-xs text-noir/45 mt-0.5">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

export function PageToolbar({ children, className }) {
  return (
    <div className={clsx("flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6", className)}>
      {children}
    </div>
  );
}

export function SearchInput({ value, onChange, placeholder = "Search...", className }) {
  return (
    <input
      type="search"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={clsx(
        "w-full sm:w-64 bg-white border border-champagne/25 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-champagne focus:ring-2 focus:ring-champagne/20 transition-all placeholder:text-noir/35 min-w-0",
        className
      )}
    />
  );
}

export function PrimaryButton({ children, className, ...props }) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 bg-noir text-champagne border border-champagne rounded-xl px-5 py-2.5 text-[11px] uppercase tracking-widest2 transition-all duration-300 hover:bg-champagne hover:text-noir disabled:opacity-50 shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function OutlineButton({ children, className, ...props }) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 border border-noir/15 text-noir rounded-xl px-5 py-2.5 text-[11px] uppercase tracking-widest2 transition-all duration-300 hover:border-champagne hover:text-champagne-dark disabled:opacity-50 bg-white",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function EmptyState({ title, description }) {
  return (
    <div className="py-16 text-center px-4">
      <p className="font-display text-2xl text-noir mb-2">{title}</p>
      {description && <p className="text-sm text-noir/50">{description}</p>}
    </div>
  );
}

export const fieldClass =
  "w-full bg-stone-50 border border-champagne/25 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-champagne focus:ring-2 focus:ring-champagne/15 focus:bg-white transition-all placeholder:text-noir/35";

export const labelClass =
  "block text-[10px] uppercase tracking-widest2 text-noir/45 mb-1.5 font-medium";
