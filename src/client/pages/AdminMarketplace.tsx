import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield, AlertTriangle, CheckCircle2, Loader2, Search,
  UserCheck, UserX, Clock, XCircle, ArrowLeft, RefreshCw,
  MessageSquare, ChevronRight,
} from "lucide-react";
import { SeoHead } from "../components/SeoHead";
import {
  fetchAdminProviders,
  fetchAdminDisputes,
  resolveDispute,
  updateKycStatus,
  type ServiceProviderProfile,
  type ServiceOrderSummary,
} from "../api/marketplaceClient";

type Tab = "disputes" | "providers";

export function AdminMarketplace() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("disputes");
  const [disputes, setDisputes] = useState<ServiceOrderSummary[]>([]);
  const [providers, setProviders] = useState<ServiceProviderProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [providerSearch, setProviderSearch] = useState("");

  useEffect(() => {
    loadData();
  }, [tab]);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      if (tab === "disputes") {
        const res = await fetchAdminDisputes();
        setDisputes(res.disputes.filter((d) => d.status === "disputed"));
      } else {
        const res = await fetchAdminProviders();
        setProviders(res.providers);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load.");
    }
    setLoading(false);
  }

  async function handleResolve(id: string, resolution: "completed" | "refunded") {
    setActionLoading(`${id}-${resolution}`);
    try {
      await resolveDispute(id, resolution);
      setDisputes(disputes.filter((d) => d.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resolve.");
    }
    setActionLoading(null);
  }

  async function handleKyc(userId: string, status: "verified" | "rejected") {
    setActionLoading(`kyc-${userId}`);
    try {
      await updateKycStatus(userId, status);
      setProviders(providers.map((p) =>
        p.userId === userId ? { ...p, kycStatus: status } : p,
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update KYC.");
    }
    setActionLoading(null);
  }

  const filteredProviders = providerSearch
    ? providers.filter((p) =>
        p.handle.toLowerCase().includes(providerSearch.toLowerCase()) ||
        p.displayName.toLowerCase().includes(providerSearch.toLowerCase()),
      )
    : providers;

  return (
    <div className="min-h-screen">
      <SeoHead title="Admin — Magic Shop" description="Marketplace administration." path="/marketplace/admin" />

      <section className="relative border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-indigo-900/5 to-transparent" />
        <div className="relative mx-auto max-w-5xl px-5 py-8 md:px-8">
          <div className="mb-4 flex items-center justify-between">
            <button onClick={() => navigate("/admin")} className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300">
              <ArrowLeft className="h-3 w-3" />
              Admin Dashboard
            </button>
            <button onClick={loadData} className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300">
              <RefreshCw className="h-3 w-3" />
              Refresh
            </button>
          </div>
          <h1 className="font-serif text-2xl font-bold text-white">Marketplace Admin</h1>
          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={() => setTab("disputes")}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium transition ${
                tab === "disputes" ? "bg-red-600 text-white" : "text-zinc-400 hover:bg-white/5"
              }`}
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              Disputes {disputes.length > 0 && `(${disputes.length})`}
            </button>
            <button
              onClick={() => setTab("providers")}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium transition ${
                tab === "providers" ? "bg-purple-600 text-white" : "text-zinc-400 hover:bg-white/5"
              }`}
            >
              <Shield className="h-3.5 w-3.5" />
              Providers
            </button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-5 py-8 md:px-8">
        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-lg bg-red-500/10 p-4 text-sm text-red-400">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex min-h-[30vh] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
          </div>
        ) : tab === "disputes" ? (
          /* ── Disputes Tab ── */
          disputes.length === 0 ? (
            <div className="flex min-h-[30vh] flex-col items-center justify-center gap-3 text-center">
              <CheckCircle2 className="h-8 w-8 text-emerald-500" />
              <p className="text-sm text-zinc-500">No open disputes.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {disputes.map((d) => (
                <div key={d.id} className="rounded-xl border border-red-500/20 bg-red-500/[0.02] p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-medium text-white">{d.listingTitle}</h3>
                        <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] text-red-300">Disputed</span>
                      </div>
                      <p className="mt-1 text-xs text-zinc-500">
                        Order #{d.id.slice(-8)} · ${(d.amountCents / 100).toFixed(0)} · {new Date(d.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-zinc-500">
                        Buyer: @{d.buyerHandle ?? "unknown"} · Seller: @{d.sellerHandle ?? "unknown"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => handleResolve(d.id, "refunded")}
                      disabled={actionLoading === `${d.id}-refunded`}
                      className="flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-red-500 disabled:opacity-50"
                    >
                      {actionLoading === `${d.id}-refunded` ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <XCircle className="h-3 w-3" />
                      )}
                      Refund Buyer
                    </button>
                    <button
                      onClick={() => handleResolve(d.id, "completed")}
                      disabled={actionLoading === `${d.id}-completed`}
                      className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-emerald-500 disabled:opacity-50"
                    >
                      {actionLoading === `${d.id}-completed` ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <CheckCircle2 className="h-3 w-3" />
                      )}
                      Complete & Release
                    </button>
                    <button
                      onClick={() => navigate(`/marketplace/orders/${d.id}`)}
                      className="flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-zinc-400 transition hover:border-white/20"
                    >
                      <MessageSquare className="h-3 w-3" />
                      View Order
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          /* ── Providers Tab ── */
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
              <input
                value={providerSearch}
                onChange={(e) => setProviderSearch(e.target.value)}
                placeholder="Search providers by handle or name..."
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-purple-500/40"
              />
            </div>

            {filteredProviders.length === 0 ? (
              <p className="text-center text-sm text-zinc-500">No providers found.</p>
            ) : (
              <div className="grid gap-3">
                {filteredProviders.map((p) => (
                  <div key={p.userId} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-white">{p.displayName}</span>
                          <span className="text-xs text-zinc-500">@{p.handle}</span>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                            p.kycStatus === "verified" ? "bg-emerald-500/10 text-emerald-300" :
                            p.kycStatus === "pending" ? "bg-amber-500/10 text-amber-300" :
                            p.kycStatus === "rejected" ? "bg-red-500/10 text-red-300" :
                            "bg-zinc-500/10 text-zinc-400"
                          }`}>
                            {p.kycStatus}
                          </span>
                        </div>
                        {p.bio && <p className="mt-1 text-xs text-zinc-500 line-clamp-1">{p.bio}</p>}
                        {p.traditions.length > 0 && (
                          <p className="mt-1 text-[10px] text-zinc-600">{p.traditions.join(", ")}</p>
                        )}
                      </div>
                    </div>
                    {p.kycStatus === "pending" && (
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => handleKyc(p.userId, "verified")}
                          disabled={actionLoading === `kyc-${p.userId}`}
                          className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-emerald-500 disabled:opacity-50"
                        >
                          {actionLoading === `kyc-${p.userId}` ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <UserCheck className="h-3 w-3" />
                          )}
                          Approve
                        </button>
                        <button
                          onClick={() => handleKyc(p.userId, "rejected")}
                          disabled={actionLoading === `kyc-${p.userId}`}
                          className="flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-red-500 disabled:opacity-50"
                        >
                          {actionLoading === `kyc-${p.userId}` ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <UserX className="h-3 w-3" />
                          )}
                          Reject
                        </button>
                      </div>
                    )}
                    {p.kycStatus === "verified" && (
                      <button
                        onClick={() => handleKyc(p.userId, "rejected")}
                        disabled={actionLoading === `kyc-${p.userId}`}
                        className="mt-3 flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-zinc-500 transition hover:border-white/20 disabled:opacity-50"
                      >
                        {actionLoading === `kyc-${p.userId}` ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <UserX className="h-3 w-3" />
                        )}
                        Revoke KYC
                      </button>
                    )}
                    {p.kycStatus === "rejected" && (
                      <button
                        onClick={() => handleKyc(p.userId, "verified")}
                        disabled={actionLoading === `kyc-${p.userId}`}
                        className="mt-3 flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-zinc-500 transition hover:border-white/20 disabled:opacity-50"
                      >
                        {actionLoading === `kyc-${p.userId}` ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <UserCheck className="h-3 w-3" />
                        )}
                        Override to Verified
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
