import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Bell, MessageCircle, ShoppingCart, ArrowRight, CheckCheck } from "lucide-react";
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  type MarketplaceNotification,
} from "../api/marketplaceClient";

const TYPE_ICONS: Record<string, typeof MessageCircle> = {
  new_order: ShoppingCart,
  order_status: ShoppingCart,
  order_cancelled: ShoppingCart,
  new_message: MessageCircle,
};

export function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<MarketplaceNotification[]>([]);
  const [unread, setUnread] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    fetchNotifications()
      .then((res) => {
        setNotifications(res.notifications);
        setUnread(res.unread);
      })
      .catch(() => null);
  }, [open]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  async function handleMarkRead(id: string) {
    await markNotificationRead(id);
    setNotifications(notifications.map((n) => n.id === id ? { ...n, isRead: true } : n));
    setUnread(Math.max(0, unread - 1));
  }

  async function handleMarkAllRead() {
    await markAllNotificationsRead();
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    setUnread(0);
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative flex items-center justify-center rounded-full border border-white/10 p-2 text-zinc-400 transition hover:border-white/20 hover:text-zinc-200"
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[14px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-white/10 bg-zinc-900 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <h3 className="text-xs font-medium text-white">Notifications</h3>
            {unread > 0 && (
              <button onClick={handleMarkAllRead} className="flex items-center gap-1 text-[10px] text-purple-400 hover:text-purple-300">
                <CheckCheck className="h-3 w-3" />
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-6 text-center text-xs text-zinc-600">No notifications yet.</p>
            ) : (
              notifications.slice(0, 15).map((n) => {
                const Icon = TYPE_ICONS[n.type] ?? Bell;
                return (
                  <div
                    key={n.id}
                    className={`flex items-start gap-3 border-b border-white/5 px-4 py-3 transition ${
                      n.isRead ? "opacity-60" : "bg-purple-500/[0.02]"
                    }`}
                  >
                    <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                      n.isRead ? "bg-white/[0.03]" : "bg-purple-500/10"
                    }`}>
                      <Icon className={`h-3 w-3 ${n.isRead ? "text-zinc-600" : "text-purple-400"}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs ${n.isRead ? "text-zinc-500" : "text-zinc-200"}`}>{n.title}</p>
                      {n.body && <p className="mt-0.5 truncate text-[10px] text-zinc-600">{n.body}</p>}
                      <div className="mt-1 flex items-center gap-2">
                        {n.link && (
                          <Link
                            to={n.link}
                            onClick={() => { handleMarkRead(n.id); setOpen(false); }}
                            className="flex items-center gap-0.5 text-[10px] text-purple-400 hover:text-purple-300"
                          >
                            View <ArrowRight className="h-2.5 w-2.5" />
                          </Link>
                        )}
                        {!n.isRead && (
                          <button onClick={() => handleMarkRead(n.id)} className="text-[10px] text-zinc-600 hover:text-zinc-400">
                            Mark read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
