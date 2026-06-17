import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, DollarSign, ShoppingCart, Star, TrendingUp,
  Loader2, AlertTriangle, Package, Clock, CheckCircle2,
} from "lucide-react";
import { SeoHead } from "../components/SeoHead";
import { useSession } from "../context/SessionContext";

interface Analytics {
  totalOrders: number;
  completedOrders: number;
  totalRevenueCents: number;
  platformFeesCents: number;
  netRevenueCents: number;
  avgRating: number;
  reviewCount: number;
  ordersByStatus: Record<string, number>;
  recentOrders: { id: string; title: string; amountCents: number; status: string; createdAt: string }[];
}

export function MarketplaceAnalytics() {
  const { authenticated } = useSession();
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authenticated) return;
    fetch("/api/marketplace/analytics", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => setError("Failed to load analytics."))
      .finally(() => setLoading(false));
  }, [authenticated]);

  if (!authenticated) {
    return (
      <div className="mx-auto max-w-4xl px-5 py-20 text-center">
        <h1 className="font-serif text-xl font-bold text-white">Seller Analytics</h1>
        <p className="mt-2 text-sm text-zinc-500">Sign in as a provider to view analytics.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SeoHead title="Analytics — Magic Shop" description="Seller performance analytics." path="/marketplace/analytics" />
      <section className="relative border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-indigo-900/5 to-transparent" />
        <div className="relative mx-auto max-w-5xl px-5 py-8 md:px-8">
          <Link to="/marketplace" className="mb-4 inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300">
            <ArrowLeft className="h-3 w-3" />
            Marketplace
          </Link>
          <h1 className="font-serif text-2xl font-bold text-white">Analytics</h1>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-5 py-8 md:px-8">
        {loading ? (
          <div className="flex min-h-[30vh] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
          </div>
        ) : error ? (
          <div className="flex items-center gap-2 rounded-lg bg-red-500/10 p-4 text-sm text-red-400">
            <AlertTriangle className="h-4 w-4" /> {error}
          </div>
        ) : data ? (
          <>
            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard icon={ShoppingCart} label="Total Orders" value={data.totalOrders.toString()} />
              <StatCard icon={CheckCircle2} label="Completed" value={data.completedOrders.toString()} />
              <StatCard icon={DollarSign} label="Revenue" value={`$${(data.totalRevenueCents / 100).toFixed(0)}`} />
              <StatCard icon={TrendingUp} label="Net (after 5%)" value={`$${(data.netRevenueCents / 100).toFixed(0)}`} />
            </div>
            <div className="mb-8 grid gap-4 sm:grid-cols-3">
              <StatCard icon={Star} label="Avg Rating" value={data.avgRating.toFixed(1)} />
              <StatCard icon={Package} label="Active Listings" value={(data.ordersByStatus["in_progress"] ?? 0).toString()} />
              <StatCard icon={Clock} label="Pending" value={(data.ordersByStatus["pending"] ?? 0).toString()} />
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
              <h3 className="mb-4 text-sm font-medium text-white">Recent Orders</h3>
              {data.recentOrders.length === 0 ? (
                <p className="text-xs text-zinc-600">No orders yet.</p>
              ) : (
                <div className="space-y-2">
                  {data.recentOrders.map((o) => (
                    <Link key={o.id} to={`/marketplace/orders/${o.id}`}
                      className="flex items-center justify-between rounded-lg border border-white/5 p-3 text-xs transition hover:border-white/20">
                      <span className="text-zinc-300">{o.title}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-emerald-400">${(o.amountCents / 100).toFixed(0)}</span>
                        <span className="text-zinc-500">{o.status}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
      <div className="flex items-center gap-2 text-xs text-zinc-500">
        <Icon className="h-3.5 w-3.5 text-purple-400" />
        {label}
      </div>
      <p className="mt-2 text-xl font-bold text-white">{value}</p>
    </div>
  );
}
