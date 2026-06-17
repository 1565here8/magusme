import React, { useEffect, useState } from "react";
import { Loader2, Search, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { bootstrapSession } from "../../api/apiClient";
import { ALLMAGUS_NAME, ALLMAGUS_TAGLINE } from "../../allmagusBrand";
import {
  createSearchBtcpayCheckout,
  createPaymentCheckout,
  fetchPaymentHealth,
  fetchSearchQuota,
  streamMagubrainSearch,
  type PaymentHealth,
  type SearchQuotaStatus,
} from "../../api/arcanaClient";

export function MagubrainSearchEngine() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [quota, setQuota] = useState<SearchQuotaStatus | null>(null);
  const [sessionReady, setSessionReady] = useState(false);
  const [paidSinglePending, setPaidSinglePending] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState<PaymentHealth | null>(null);

  useEffect(() => {
    bootstrapSession()
      .then(() => setSessionReady(true))
      .catch(() => setSessionReady(false));
    fetchSearchQuota().then(setQuota).catch(() => null);
    fetchPaymentHealth().then(setPaymentInfo).catch(() => null);

    const params = new URLSearchParams(window.location.search);
    if (params.get("searchPaid") === "1") {
      fetchSearchQuota().then(setQuota).catch(() => null);
      params.delete("searchPaid");
      const next = `${window.location.pathname}${params.toString() ? `?${params}` : ""}`;
      window.history.replaceState({}, "", next);
    }
  }, []);

  async function runSearch(paidSingle = false) {
    if (!query.trim() || loading || !sessionReady) return;
    setLoading(true);
    setError(null);
    setAnswer("");
    try {
      const next = await streamMagubrainSearch(
        query.trim(),
        (chunk) => setAnswer((prev) => prev + chunk),
        { paidSingle: paidSingle || paidSinglePending },
      );
      setQuota(next);
      setPaidSinglePending(false);
    } catch (err) {
      const e = err as Error & { paymentRequired?: boolean; quota?: SearchQuotaStatus };
      if (e.paymentRequired) {
        setQuota(e.quota ?? quota);
        setError(e.message);
      } else {
        setError(e.message ?? "Search failed.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function buy(kind: "single" | "monthly") {
    setError(null);
    try {
      if (paymentInfo?.payramConfigured) {
        const res = await createPaymentCheckout(kind);
        if (res.checkoutUrl) {
          window.location.href = res.checkoutUrl;
          return;
        }
      }
      const res = await createSearchBtcpayCheckout(kind);
      if (res.checkoutUrl) {
        window.location.href = res.checkoutUrl;
        return;
      }
      if (res.quota) setQuota(res.quota);
      if (kind === "single" && res.paidSingleReady) {
        setPaidSinglePending(true);
        await runSearch(true);
      } else if (kind === "monthly") {
        await fetchSearchQuota().then(setQuota);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed.");
    }
  }

  return (
    <section className="magubrain-search glass-panel glass-panel-lg space-y-6">
      <div className="text-center">
        <p className="label-premium">{ALLMAGUS_NAME}</p>
        <h1 className="arcana-title mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
          Magubrain at your service
        </h1>
        <p className="body-muted mx-auto mt-4 max-w-2xl text-sm md:text-base">{ALLMAGUS_TAGLINE}</p>
      </div>

      <form
        className="mx-auto max-w-3xl"
        onSubmit={(e) => {
          e.preventDefault();
          void runSearch();
        }}
      >
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[color:var(--text-tertiary)]" />
          <input
            type="search"
            className="input-field w-full py-4 pl-12 pr-32 text-base"
            placeholder="Ask anything. white magic, psychology, manifestation, dark arts, folklore…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            className="btn-premium absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 text-sm"
            disabled={loading || !query.trim() || !sessionReady}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
          </button>
        </div>
      </form>

      {quota ? (
        <p className="text-center text-xs text-[color:var(--text-tertiary)]">
          {quota.freeRemaining > 0
            ? `${quota.freeRemaining} free search${quota.freeRemaining === 1 ? "" : "es"} left today`
            : quota.monthlyActive
              ? `${quota.monthlyRemaining} / ${quota.monthlyLimit} monthly searches left`
              : quota.singleCreditsRemaining > 0
                ? `${quota.singleCreditsRemaining} prepaid search${quota.singleCreditsRemaining === 1 ? "" : "es"} ready`
                : "Free tier used. pay with Crypto or go monthly"}
          {quota.monthlyActive && quota.monthlyExpiresAt
            ? ` · monthly until ${new Date(quota.monthlyExpiresAt).toLocaleDateString()}`
            : null}
        </p>
      ) : null}

      {error && quota?.requiresPayment ? (
        <div className="mx-auto max-w-xl rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-inset)] p-5 text-center">
          <p className="text-sm text-[color:var(--text-secondary)]">{error}</p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <button type="button" className="btn-premium text-sm" onClick={() => void buy("single")}>
              {paymentInfo?.payramConfigured ? "Pay with Crypto" : quota.btcpayConfigured !== false ? "Pay with Bitcoin" : "Pay"} {quota.payPerSearchLabel}. one search
            </button>
            <button type="button" className="btn-secondary text-sm" onClick={() => void buy("monthly")}>
              {paymentInfo?.payramConfigured ? "Pay with Crypto. " : quota.btcpayConfigured !== false ? "Pay with Bitcoin. " : ""}
              {quota.monthlyPriceLabel}/mo · {quota.monthlyLimit} searches
            </button>
          </div>
        </div>
      ) : error ? (
        <p className="text-center text-sm text-red-400/90">{error}</p>
      ) : null}

      {(loading || answer) && (
        <div className="prose-luxury mx-auto max-w-3xl rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-inset)] p-6">
          <h2 className="!mt-0 flex items-center gap-2 text-lg font-semibold">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Magubrain answer
          </h2>
          <div className="mt-4 text-sm leading-relaxed">
            {answer ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{answer}</ReactMarkdown>
            ) : (
              <span className="text-[color:var(--text-tertiary)]">Searching the living encyclopedia…</span>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
