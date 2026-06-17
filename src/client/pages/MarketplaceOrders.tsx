import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingBag, Package, Clock, CheckCircle2,   XCircle,
  AlertTriangle, Loader2, MessageSquare, ChevronRight, Wallet,
} from "lucide-react";
import { SeoHead } from "../components/SeoHead";
import { useSession } from "../context/SessionContext";
import {
  fetchMyOrders,
  fetchIncomingOrders,
  type ServiceOrderSummary,
} from "../api/marketplaceClient";

const STATUS_STYLES: Record<string, string> = {
  pending: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  confirmed: "border-blue-500/30 bg-blue-500/10 text-blue-300",
  in_progress: "border-purple-500/30 bg-purple-500/10 text-purple-300",
  completed: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  cancelled: "border-zinc-500/30 bg-zinc-500/10 text-zinc-400",
  disputed: "border-red-500/30 bg-red-500/10 text-red-300",
  refunded: "border-zinc-500/30 bg-zinc-500/10 text-zinc-400",
};

const TABS = [
  { id: "buying", label: "Buying", icon: ShoppingBag },
  { id: "selling", label: "Selling", icon: Package },
];

const STATUS_FILTERS = [
  { value: "", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "disputed", label: "Disputed" },
];

function OrderCard({ order }: { order: ServiceOrderSummary }) {
  const statusColor = STATUS_STYLES[order.status] ?? STATUS_STYLES.pending;
  return (
    <Link
      to={`/marketplace/orders/${order.id}`}
      className="group block rounded-xl border border-white/10 bg-white/[0.02] p-4 transition hover:border-purple-500/30 hover:bg-white/[0.04]"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`rounded px-2 py-0.5 text-[10px] font-medium ${statusColor}`}>
              {order.status.replace(/_/g, " ")}
            </span>
            {order.packageName && (
              <span className="rounded bg-white/[0.03] px-2 py-0.5 text-[10px] text-zinc-500">
                {order.packageName}
              </span>
            )}
          </div>
          <h3 className="font-serif text-base font-bold text-white group-hover:text-purple-300 transition-colors truncate">
            {order.listingTitle}
          </h3>
          <p className="mt-0.5 text-xs text-zinc-500">
            {order.buyerHandle
              ? `with @${order.buyerHandle}`
              : `by @${order.sellerHandle}`}
            {order.amountCents > 0 && (
              <span className="ml-2 text-emerald-400 font-medium">
                ${(order.amountCents / 100).toFixed(0)}
              </span>
            )}
          </p>
        </div>
        <ChevronRight className="mt-2 h-4 w-4 shrink-0 text-zinc-600 group-hover:text-zinc-400 transition" />
      </div>
      {order.lastMessage && (
        <div className="mt-3 flex items-start gap-1.5 rounded-lg bg-white/[0.02] p-2.5">
          <MessageSquare className="mt-0.5 h-3 w-3 shrink-0 text-zinc-600" />
          <p className="text-xs text-zinc-500 line-clamp-1">{order.lastMessage}</p>
        </div>
      )}
      <p className="mt-2 text-[10px] text-zinc-600">
        <Clock className="mr-1 inline h-3 w-3" />
        {new Date(order.createdAt).toLocaleDateString()}
      </p>
    </Link>
  );
}

export function MarketplaceOrders() {
  const { authenticated, loading: authLoading } = useSession();
  const [tab, setTab] = useState<"buying" | "selling">("buying");
  const [statusFilter, setStatusFilter] = useState("");
  const [orders, setOrders] = useState<ServiceOrderSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !authenticated) return;
    let cancelled = false;
    setLoading(true);
    const fetch = tab === "buying" ? fetchMyOrders : fetchIncomingOrders;
    fetch(statusFilter || undefined)
      .then((res) => { if (!cancelled) setOrders(res.orders); })
      .catch(() => null)
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [tab, statusFilter, authenticated, authLoading]);

  if (authLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="mx-auto max-w-4xl px-5 py-20 text-center">
        <ShoppingBag className="mx-auto mb-4 h-8 w-8 text-zinc-600" />
        <h1 className="mb-2 font-serif text-xl font-bold text-white">Orders</h1>
        <p className="text-sm text-zinc-500">Sign in to view your orders.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SeoHead title="Orders — Magic Shop" description="Manage your marketplace orders." path="/marketplace/orders" />

      <section className="relative border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-indigo-900/5 to-transparent" />
        <div className="relative mx-auto max-w-4xl px-5 py-8 md:px-8">
          <h1 className="font-serif text-2xl font-bold text-white">Orders</h1>
          <Link to="/marketplace/payments/payout" className="mt-1 inline-flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300">
            <Wallet className="h-3 w-3" />
            Payout Setup
          </Link>
          <div className="mt-4 flex items-center gap-2">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => { setTab(t.id as "buying" | "selling"); setStatusFilter(""); }}
                className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium transition ${
                  tab === t.id
                    ? "bg-purple-600 text-white"
                    : "text-zinc-400 hover:bg-white/5"
                }`}
              >
                <t.icon className="h-3.5 w-3.5" />
                {t.label}
              </button>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                className={`rounded-lg border px-2.5 py-1 text-[10px] transition ${
                  statusFilter === f.value
                    ? "border-purple-500/40 bg-purple-500/10 text-purple-300"
                    : "border-white/10 text-zinc-600 hover:border-white/20"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-8 md:px-8">
        {loading ? (
          <div className="flex min-h-[30vh] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
          </div>
        ) : orders.length === 0 ? (
          <div className="flex min-h-[30vh] flex-col items-center justify-center gap-3 text-center">
            <Package className="h-8 w-8 text-zinc-600" />
            <p className="text-sm text-zinc-500">
              {tab === "buying" ? "No orders placed yet." : "No incoming orders."}
            </p>
            <Link to="/marketplace" className="rounded-full bg-purple-600 px-4 py-2 text-xs text-white hover:bg-purple-500">
              Browse Services
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
