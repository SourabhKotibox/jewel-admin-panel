import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Bell, MessageSquare, Package, RotateCcw, RefreshCw } from "lucide-react";
import { api } from "../../api/client";
import notify from "../../utils/toast";

const iconFor = {
  order: Package,
  chat: MessageSquare,
  return: RotateCcw,
};

function timeAgo(at) {
  if (!at) return "";
  const ms = Date.now() - new Date(at).getTime();
  const m = Math.floor(ms / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function AdminNotificationBell() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({ unread: 0, items: [] });
  const seenRef = useRef(new Set());
  const boxRef = useRef(null);

  const load = async ({ toastNew = false } = {}) => {
    try {
      const res = await api("/notifications", { portal: "admin" });
      const items = Array.isArray(res.items) ? res.items : [];
      if (toastNew && seenRef.current.size > 0) {
        for (const item of items.slice(0, 8)) {
          if (!seenRef.current.has(item.id) && item.type === "chat") {
            notify.info(`New chat: ${item.title}`);
          }
          if (!seenRef.current.has(item.id) && item.type === "order") {
            const age = Date.now() - new Date(item.at).getTime();
            if (age < 5 * 60 * 1000) notify.success(item.title);
          }
          if (!seenRef.current.has(item.id) && item.type === "return") {
            notify.info(item.title);
          }
        }
      }
      items.forEach((i) => seenRef.current.add(i.id));
      setData({
        unread: res.unread || 0,
        pendingOrders: res.pendingOrders || 0,
        unreadChats: res.unreadChats || 0,
        openReturns: res.openReturns || 0,
        items,
      });
    } catch {
      /* silent — bell stays empty if offline */
    }
  };

  useEffect(() => {
    load({ toastNew: false });
    const t = setInterval(() => load({ toastNew: true }), 20000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const onDoc = (e) => {
      if (!boxRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div className="relative" ref={boxRef}>
      <button
        type="button"
        className="relative p-2 sm:p-2.5 rounded-xl text-noir/70 hover:text-champagne-dark hover:bg-champagne/10"
        aria-label="Notifications"
        onClick={() => setOpen((v) => !v)}
      >
        <Bell size={18} />
        {data.unread > 0 ? (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-champagne text-noir text-[10px] font-semibold flex items-center justify-center">
            {data.unread > 99 ? "99+" : data.unread}
          </span>
        ) : (
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-champagne/50 rounded-full" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-[min(100vw-2rem,380px)] bg-white border border-champagne/20 rounded-2xl shadow-xl z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-champagne/10 flex items-center justify-between gap-2">
            <div>
              <p className="text-sm font-medium text-noir">Notifications</p>
              <p className="text-[11px] text-noir/45">
                {data.pendingOrders || 0} open orders · {data.unreadChats || 0} unread chats ·{" "}
                {data.openReturns || 0} returns
              </p>
            </div>
            <button
              type="button"
              className="p-2 rounded-lg hover:bg-stone-50 text-noir/50"
              onClick={() => load({ toastNew: false })}
              title="Refresh"
            >
              <RefreshCw size={14} />
            </button>
          </div>
          <div className="max-h-[420px] overflow-y-auto divide-y divide-champagne/10">
            {data.items.length === 0 ? (
              <p className="p-6 text-sm text-noir/45 text-center">No recent activity</p>
            ) : (
              data.items.map((item) => {
                const Icon = iconFor[item.type] || Bell;
                return (
                  <Link
                    key={item.id}
                    to={item.href}
                    onClick={() => setOpen(false)}
                    className="flex gap-3 px-4 py-3 hover:bg-stone-50 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-xl bg-noir/5 text-champagne-dark flex items-center justify-center shrink-0">
                      <Icon size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-noir truncate">{item.title}</p>
                      <p className="text-xs text-noir/50 line-clamp-2 mt-0.5">{item.body}</p>
                      <p className="text-[10px] text-noir/35 mt-1 uppercase tracking-widest2">
                        {item.type} · {timeAgo(item.at)}
                      </p>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
          <div className="px-4 py-2.5 border-t border-champagne/10 flex gap-3 text-[11px]">
            <Link
              to="/admin/orders"
              onClick={() => setOpen(false)}
              className="text-champagne-dark hover:underline"
            >
              All orders
            </Link>
            <Link
              to="/admin/order-support"
              onClick={() => setOpen(false)}
              className="text-champagne-dark hover:underline"
            >
              Chat & returns
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
