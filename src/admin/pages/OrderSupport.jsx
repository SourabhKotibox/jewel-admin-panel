import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { api } from "../../api/client";
import { AdminCard } from "../components/AdminUI";
import OrderChat from "../../components/OrderChat";
import OrderSummaryPanel from "../components/OrderSummaryPanel";
import { formatPrice } from "../data/adminData";
import notify from "../../utils/toast";

export default function OrderSupport() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [active, setActive] = useState(searchParams.get("order") || "");
  const [returns, setReturns] = useState([]);
  const [order, setOrder] = useState(null);
  const [orderLoading, setOrderLoading] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const [chats, rets] = await Promise.all([
        api("/chat/conversations", { portal: "admin" }),
        api("/returns", { portal: "admin" }),
      ]);
      setConversations(Array.isArray(chats) ? chats : []);
      setReturns(Array.isArray(rets) ? rets : []);
      setError("");
    } catch (err) {
      setError(err.message);
      notify.error(err.message || "Could not load support inbox");
    }
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 15000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const q = searchParams.get("order");
    if (q) setActive(q);
  }, [searchParams]);

  useEffect(() => {
    if (!active) {
      setOrder(null);
      return;
    }
    let cancelled = false;
    setOrderLoading(true);
    api(`/orders/${encodeURIComponent(active)}`, { portal: "admin" })
      .then((row) => {
        if (!cancelled) setOrder(row);
      })
      .catch(() => {
        if (!cancelled) setOrder(null);
      })
      .finally(() => {
        if (!cancelled) setOrderLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [active]);

  const selectChat = (orderNumber) => {
    setActive(orderNumber);
    setSearchParams({ order: orderNumber });
  };

  const updateReturn = async (id, status) => {
    const toastId = notify.loading(`Updating return to ${status}…`);
    try {
      await api(`/returns/${id}`, {
        method: "PUT",
        body: { status },
        portal: "admin",
      });
      notify.dismiss(toastId);
      notify.success(
        status === "Refunded"
          ? "Return refunded · inventory restocked"
          : `Return marked ${status}`
      );
      load();
    } catch (err) {
      notify.dismiss(toastId);
      notify.error(err.message || "Update failed");
    }
  };

  return (
    <div className="animate-fade-up space-y-6 min-w-0">
      <div>
        <p className="eyebrow mb-1">Support</p>
        <h2 className="font-display text-2xl sm:text-3xl text-noir">Order chat & returns</h2>
        <p className="text-sm text-noir/50 mt-1">
          Live inquiries with full order context. Approvals restock inventory automatically.
        </p>
      </div>

      {error && <p className="text-sm text-rose-600">{error}</p>}

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        <AdminCard title="Conversations" className="lg:col-span-3 min-w-0">
          <div className="divide-y divide-champagne/10 max-h-[620px] overflow-y-auto">
            {conversations.length === 0 ? (
              <p className="p-5 text-sm text-noir/45">No chats yet.</p>
            ) : (
              conversations.map((c) => (
                <button
                  key={c.orderNumber}
                  type="button"
                  onClick={() => selectChat(c.orderNumber)}
                  className={`w-full text-left px-4 py-3 hover:bg-stone-50 ${
                    active === c.orderNumber ? "bg-champagne/10" : ""
                  }`}
                >
                  <div className="flex justify-between gap-2">
                    <span className="font-medium text-sm text-noir">{c.orderNumber}</span>
                    {c.unread > 0 && (
                      <span className="text-[10px] bg-noir text-champagne px-1.5 py-0.5 rounded-full">
                        {c.unread}
                      </span>
                    )}
                  </div>
                  {c.customer ? (
                    <p className="text-[11px] text-noir/55 mt-0.5 truncate">{c.customer}</p>
                  ) : null}
                  <p className="text-xs text-noir/45 mt-1 line-clamp-2">{c.lastMessage}</p>
                  <p className="text-[10px] text-noir/35 mt-1">
                    {[c.status, c.payment, c.total != null ? formatPrice(Number(c.total)) : ""]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </button>
              ))
            )}
          </div>
        </AdminCard>

        <div className="lg:col-span-5 min-w-0 space-y-3">
          {active ? (
            <OrderChat
              orderNumber={active}
              portal="admin"
              title={`Reply · ${active}`}
              onSent={() => notify.success("Message sent to customer")}
            />
          ) : (
            <div className="border border-dashed border-champagne/30 p-12 text-center text-sm text-noir/45 rounded-2xl">
              <MessageCircle className="mx-auto mb-3 text-champagne-dark" size={28} />
              Select a conversation to reply
            </div>
          )}
        </div>

        <div className="lg:col-span-4 min-w-0">
          {active ? (
            <OrderSummaryPanel order={order} loading={orderLoading} />
          ) : (
            <div className="border border-dashed border-champagne/30 rounded-2xl p-8 text-sm text-noir/45 text-center">
              Order details appear here when you open a chat
            </div>
          )}
        </div>
      </div>

      <AdminCard title="Return / refund requests">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-widest2 text-noir/40 border-b border-champagne/10">
                <th className="px-4 py-3">Return</th>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Reason</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {returns.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-noir/45">
                    No return requests
                  </td>
                </tr>
              ) : (
                returns.map((r) => (
                  <tr key={r.id || r._id} className="border-b border-champagne/5">
                    <td className="px-4 py-3 font-medium">{r.returnNumber}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        className="text-champagne-dark hover:underline"
                        onClick={() => selectChat(r.orderNumber)}
                      >
                        {r.orderNumber}
                      </button>
                    </td>
                    <td className="px-4 py-3 max-w-[200px] truncate" title={r.reason}>
                      {r.reason}
                    </td>
                    <td className="px-4 py-3 text-champagne-dark">{r.status}</td>
                    <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                      {r.status === "Requested" && (
                        <>
                          <button
                            type="button"
                            className="text-[10px] uppercase tracking-widest2 text-champagne-dark"
                            onClick={() => updateReturn(r.returnNumber || r.id, "Approved")}
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            className="text-[10px] uppercase tracking-widest2 text-rose-600"
                            onClick={() => updateReturn(r.returnNumber || r.id, "Rejected")}
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {r.status === "Approved" && (
                        <button
                          type="button"
                          className="text-[10px] uppercase tracking-widest2 text-champagne-dark"
                          onClick={() => updateReturn(r.returnNumber || r.id, "Refunded")}
                        >
                          Mark refunded + restock
                        </button>
                      )}
                      <Link
                        to={`/admin/orders/${r.orderNumber}`}
                        className="text-[10px] uppercase tracking-widest2 text-noir/40 hover:text-champagne-dark"
                      >
                        Order
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </AdminCard>
    </div>
  );
}
