import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Wallet, AlertTriangle, CheckCircle2, Loader2,
  ExternalLink, Save, Info,
} from "lucide-react";
import { SeoHead } from "../components/SeoHead";
import { useSession } from "../context/SessionContext";

const BLOCKCHAINS = [
  { value: "BASE", label: "Base", desc: "Low fees, fast. USDC recommended." },
  { value: "ETH", label: "Ethereum", desc: "Widest support, higher gas fees." },
  { value: "TRX", label: "Tron", desc: "Very low fees, USDT popular." },
  { value: "BTC", label: "Bitcoin", desc: "Only for large payouts." },
];

const CURRENCIES = [
  { value: "USDC", label: "USDC" },
  { value: "USDT", label: "USDT" },
];

export function MarketplacePayoutSetup() {
  const { authenticated } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [payramStatus, setPayramStatus] = useState<{ payramConfigured: boolean; platformFeePercent: number } | null>(null);
  const [account, setAccount] = useState<{
    email: string;
    blockchainCode: string;
    currencyCode: string;
    walletAddress: string;
    isActive: boolean;
  } | null>(null);
  const [email, setEmail] = useState("");
  const [blockchainCode, setBlockchainCode] = useState("BASE");
  const [currencyCode, setCurrencyCode] = useState("USDC");
  const [walletAddress, setWalletAddress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!authenticated) return;
    Promise.all([
      fetch("/api/marketplace/payments/status", { credentials: "include" }).then((r) => r.json()),
      fetch("/api/marketplace/payments/payout-account", { credentials: "include" }).then((r) => r.json()),
    ])
      .then(([status, acct]) => {
        setPayramStatus(status);
        if (acct.account) {
          setAccount(acct.account);
          setEmail(acct.account.email);
          setBlockchainCode(acct.account.blockchainCode);
          setCurrencyCode(acct.account.currencyCode);
          setWalletAddress(acct.account.walletAddress);
        }
      })
      .catch(() => null)
      .finally(() => setLoading(false));
  }, [authenticated]);

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch("/api/marketplace/payments/payout-account", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, blockchainCode, currencyCode, walletAddress }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to save.");
        return;
      }
      setAccount(data.account);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("Network error.");
    }
    setSaving(false);
  }

  if (!authenticated) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-20 text-center">
        <Wallet className="mx-auto mb-4 h-8 w-8 text-zinc-600" />
        <h1 className="mb-2 font-serif text-xl font-bold text-white">Payout Setup</h1>
        <p className="text-sm text-zinc-500">Sign in as a service provider to set up payouts.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
      </div>
    );
  }

  if (payramStatus && !payramStatus.payramConfigured) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-20 text-center">
        <AlertTriangle className="mx-auto mb-4 h-8 w-8 text-amber-400" />
        <h1 className="mb-2 font-serif text-xl font-bold text-white">Payments Not Configured</h1>
        <p className="text-sm text-zinc-500">Payouts will be available once PayRAM is configured by the platform.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SeoHead title="Payout Setup — Magic Shop" description="Set up your payout account to receive payments." path="/marketplace/payments/payout" />

      <section className="relative border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-indigo-900/5 to-transparent" />
        <div className="relative mx-auto max-w-2xl px-5 py-8 md:px-8">
          <Link to="/marketplace" className="mb-4 inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300">
            <ArrowLeft className="h-3 w-3" />
            Back to Marketplace
          </Link>
          <h1 className="font-serif text-2xl font-bold text-white">Payout Setup</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Receive payments from your services. Platform takes {payramStatus?.platformFeePercent ?? 5}% fee.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-2xl px-5 py-8 md:px-8">
        {success && (
          <div className="mb-6 flex items-center gap-2 rounded-lg bg-emerald-500/10 p-4 text-sm text-emerald-300">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            Payout account saved successfully.
          </div>
        )}
        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-lg bg-red-500/10 p-4 text-sm text-red-400">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* Email */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-300">
              Email <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="payout@example.com"
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-purple-500/40"
            />
            <p className="mt-1 text-[10px] text-zinc-600">Used for payout notifications.</p>
          </div>

          {/* Blockchain */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-300">
              Blockchain <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {BLOCKCHAINS.map((bc) => (
                <button
                  key={bc.value}
                  onClick={() => setBlockchainCode(bc.value)}
                  className={`rounded-xl border p-3 text-left transition ${
                    blockchainCode === bc.value
                      ? "border-purple-500/40 bg-purple-500/10"
                      : "border-white/10 bg-white/[0.02] hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${blockchainCode === bc.value ? "bg-purple-400" : "bg-zinc-600"}`} />
                    <span className="text-sm font-medium text-white">{bc.label}</span>
                  </div>
                  <p className="mt-1 text-[10px] text-zinc-500">{bc.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Currency */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-300">
              Currency <span className="text-red-400">*</span>
            </label>
            <div className="flex gap-3">
              {CURRENCIES.map((cur) => (
                <button
                  key={cur.value}
                  onClick={() => setCurrencyCode(cur.value)}
                  className={`flex-1 rounded-xl border p-3 text-center transition ${
                    currencyCode === cur.value
                      ? "border-purple-500/40 bg-purple-500/10"
                      : "border-white/10 bg-white/[0.02] hover:border-white/20"
                  }`}
                >
                  <span className="text-sm font-medium text-white">{cur.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Wallet Address */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-300">
              Wallet Address <span className="text-red-400">*</span>
            </label>
            <input
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="0x... or T... or bc1..."
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-mono text-white outline-none transition placeholder:text-zinc-600 focus:border-purple-500/40"
            />
            <p className="mt-1 flex items-center gap-1 text-[10px] text-zinc-600">
              <Info className="h-3 w-3" />
              Send a small test amount first to verify the address.
            </p>
          </div>

          {/* Summary */}
          {account && (
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <div className="flex items-center gap-2 text-sm text-emerald-300">
                <CheckCircle2 className="h-4 w-4" />
                Current payout account
              </div>
              <div className="mt-2 text-xs text-zinc-400 space-y-1">
                <p>Email: {account.email}</p>
                <p>Network: {account.blockchainCode} · {account.currencyCode}</p>
                <p className="font-mono">Wallet: {account.walletAddress.slice(0, 12)}...{account.walletAddress.slice(-6)}</p>
              </div>
            </div>
          )}

          {/* Fee disclosure */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <h3 className="flex items-center gap-2 text-sm font-medium text-white">
              <Info className="h-4 w-4 text-purple-400" />
              Platform Fees
            </h3>
            <p className="mt-1 text-xs text-zinc-500">
              MagusMe charges {payramStatus?.platformFeePercent ?? 5}% per transaction.
              You receive the remaining {100 - (payramStatus?.platformFeePercent ?? 5)}%.
              Payouts are sent automatically to your wallet when an order is completed and paid.
            </p>
          </div>

          {/* Save */}
          <button
            onClick={handleSave}
            disabled={saving || !email || !walletAddress}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-purple-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-purple-500 disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saving ? "Saving..." : account ? "Update Payout Account" : "Save Payout Account"}
          </button>
        </div>
      </div>
    </div>
  );
}
