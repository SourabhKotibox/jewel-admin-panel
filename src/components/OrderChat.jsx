import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { Send, MessageCircle } from "lucide-react";
import { api, getToken } from "../api/client";
import notify from "../utils/toast";

const SOCKET_URL = (import.meta.env.VITE_API_URL || "http://localhost:5001/api").replace(
  /\/api\/?$/,
  ""
);

export default function OrderChat({
  orderNumber,
  portal = "user",
  title = "Order inquiry",
  compact = false,
  onSent,
}) {
  const [open, setOpen] = useState(!compact);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!orderNumber || !open) return undefined;
    let cancelled = false;
    (async () => {
      try {
        const rows = await api(`/chat/${encodeURIComponent(orderNumber)}`, { portal });
        if (!cancelled) setMessages(Array.isArray(rows) ? rows : []);
      } catch (err) {
        if (!cancelled) setError(err.message || "Could not load chat");
      }
    })();

    const token = getToken(portal);
    if (token) {
      const socket = io(SOCKET_URL, {
        auth: { token },
        transports: ["websocket", "polling"],
      });
      socketRef.current = socket;
      socket.emit("join_order", orderNumber);
      socket.on("order_message", (msg) => {
        if (msg?.orderNumber === orderNumber) {
          setMessages((prev) => {
            if (prev.some((m) => m._id === msg._id)) return prev;
            return [...prev, msg];
          });
        }
      });
    }

    return () => {
      cancelled = true;
      if (socketRef.current) {
        socketRef.current.emit("leave_order", orderNumber);
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [orderNumber, open, portal]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const send = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    setError("");
    try {
      const msg = await api(`/chat/${encodeURIComponent(orderNumber)}`, {
        method: "POST",
        body: { message: text.trim() },
        portal,
      });
      setMessages((prev) => (prev.some((m) => m._id === msg._id) ? prev : [...prev, msg]));
      setText("");
      onSent?.(msg);
      if (portal !== "admin") notify.success("Message sent");
    } catch (err) {
      const m = err.message || "Send failed — sign in to chat";
      setError(m);
      notify.error(m);
    } finally {
      setSending(false);
    }
  };

  if (compact && !open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest2 text-champagne-dark border border-champagne/30 px-3 py-2 hover:bg-champagne/5"
      >
        <MessageCircle size={14} />
        Inquire about order
      </button>
    );
  }

  return (
    <div className="border border-champagne/20 bg-white flex flex-col min-h-[280px] max-h-[420px]">
      <div className="px-4 py-3 border-b border-champagne/10 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-widest2 text-noir/40">Live chat</p>
          <p className="text-sm font-medium text-noir truncate">
            {title} · {orderNumber}
          </p>
        </div>
        {compact && (
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-[10px] uppercase tracking-widest2 text-noir/40"
          >
            Close
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-stone-50/50">
        {messages.length === 0 && (
          <p className="text-xs text-noir/45 text-center py-8">
            Ask about delivery, sizing, returns, or anything for this order.
          </p>
        )}
        {messages.map((m) => {
          const mine =
            (portal === "admin" && m.senderRole === "admin") ||
            (portal === "user" && m.senderRole === "customer");
          return (
            <div
              key={m._id}
              className={`flex ${mine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] px-3 py-2 text-sm rounded-sm ${
                  mine
                    ? "bg-noir text-champagne"
                    : "bg-white border border-champagne/15 text-noir"
                }`}
              >
                <p className="text-[10px] opacity-60 mb-0.5">
                  {m.senderName || m.senderRole}
                  {m.createdAt
                    ? ` · ${new Date(m.createdAt).toLocaleString([], {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}`
                    : ""}
                </p>
                <p className="whitespace-pre-wrap break-words">{m.message}</p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {error && <p className="text-xs text-rose-600 px-4 py-1">{error}</p>}

      <form onSubmit={send} className="p-3 border-t border-champagne/10 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your message…"
          className="flex-1 border border-champagne/25 px-3 py-2 text-sm outline-none focus:border-champagne"
        />
        <button
          type="submit"
          disabled={sending || !text.trim()}
          className="btn-gold !px-4 !py-2 shrink-0"
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
}
