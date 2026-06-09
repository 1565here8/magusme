import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { AlertTriangle, Loader2, ShieldAlert } from "lucide-react";

import { bootstrapSession } from "../../api/apiClient";
import {
 consultKabbalahVaultStream,
 fetchKabbalahVaultStatus,
 type KabbalahVaultStatus,
} from "../../api/kabbalahClient";
import { SpectrumBadge } from "./SpectrumBadge";
import { getSpectrumMeta, spectrumTierClass } from "../../../shared/merlianSpectrum";
import { cx } from "../../utils/classnames";

const KABBALAH_SPECTRUM = getSpectrumMeta("kabbalah");

export function KabbalahVault() {
 const [status, setStatus] = useState<KabbalahVaultStatus | null>(null);
 const [acknowledged, setAcknowledged] = useState(false);
 const [sessionReady, setSessionReady] = useState(false);
 const [query, setQuery] = useState("");
 const [consulting, setConsulting] = useState(false);
 const [streamingText, setStreamingText] = useState("");
 const [resultText, setResultText] = useState("");
 const [error, setError] = useState<string | null>(null);

 useEffect(() => {
 bootstrapSession()
 .then(() => setSessionReady(true))
 .catch(() => setSessionReady(false));
 fetchKabbalahVaultStatus().then(setStatus).catch(() => null);
 }, []);

 async function onVaultConsult(e: React.FormEvent) {
 e.preventDefault();
 if (!acknowledged || !query.trim() || consulting || !sessionReady) return;
 setConsulting(true);
 setError(null);
 setResultText("");
 setStreamingText("");
 try {
 const res = await consultKabbalahVaultStream(query.trim(), (chunk) => {
 setStreamingText((prev) => prev + chunk);
 });
 setResultText(res.analysis.replace(/RECOMMENDED_IDS:[^\n]*/i, "").trim());
 setStreamingText("");
 } catch (err) {
 setError(err instanceof Error ? err.message : "Vault consultation failed.");
 } finally {
 setConsulting(false);
 }
 }

 return (
 <section id="kabbalah-vault" className={cx("kabbalah-vault glass-panel glass-panel-lg space-y-8", spectrumTierClass("kabbalah"))}>
 <div className={cx("kabbalah-vault-banner spectrum-panel-header rounded-xl p-6", spectrumTierClass("kabbalah"))}>
 <div className="flex items-start gap-4">
 <ShieldAlert className="mt-0.5 h-8 w-8 shrink-0" style={{ color: "var(--spectrum-item-text)" }} strokeWidth={1.5} />
 <div>
 <SpectrumBadge meta={KABBALAH_SPECTRUM} className="mb-3" />
 <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--spectrum-item-text)" }}>
 Isolated vault — spectrum tier {KABBALAH_SPECTRUM.index}
 </p>
 <h2 className="mt-2 text-2xl font-semibold tracking-tight text-primary">
 Practical Kabbalah · Deep Oracle
 </h2>
 <p className="mt-3 text-sm leading-relaxed text-secondary">
 Practical Kabbalah sits in the main readings menu with every other tradition.{" "}
 Magubrain classifies it as <strong className="text-primary">more dangerous than most other practices</strong> — including many dark arts — due to documented psychological and spiritual risks.{" "}
 <strong className="text-primary">At your own risk.</strong>
 </p>
 </div>
 </div>
 </div>

 {status ? (
 <div className="prose-luxury rounded-xl border border-red-900/25 bg-black/40 p-5 text-sm text-red-100/70">
 <ReactMarkdown remarkPlugins={[remarkGfm]}>{status.dangerBanner}</ReactMarkdown>
 </div>
 ) : null}

 <div className="rounded-xl border border-red-900/30 bg-red-950/15 p-5">
 <label className="flex cursor-pointer items-start gap-3">
 <input
 type="checkbox"
 className="mt-1 accent-red-500"
 checked={acknowledged}
 onChange={(e) => setAcknowledged(e.target.checked)}
 />
 <span className="text-sm text-red-100/80">
 {status?.vaultAcknowledgment ??
 "I understand Kabbalistic magic is the MOST DANGEROUS type of magic on AllMagus — separate from all other traditions. I accept full risk."}
 </span>
 </label>
 </div>

 {!acknowledged ? (
 <p className="flex items-center gap-2 text-sm text-red-300/80">
 <AlertTriangle className="h-4 w-4" />
 You must acknowledge the danger warning before using the deep Kabbalah oracle.
 </p>
 ) : (
 <>
 <form onSubmit={onVaultConsult} className="space-y-4">
 <h3 className="text-lg font-semibold text-red-200">Deep Kabbalah Oracle</h3>
 <p className="text-sm text-tertiary">
 Full corpus consultation — {status?.totalEntries ?? 0} Kabbalistic entries indexed.
 Gematria, Tree of Life, and letter work are also in the <strong className="text-red-200/90">Practical Kabbalah</strong> category above.
 </p>
 <textarea
 className="arcana-input w-full rounded-xl border border-red-900/30 bg-[#0a0505] p-4 text-sm text-red-50/90 placeholder:text-red-900/50 focus:border-red-500/40 focus:outline-none"
 rows={3}
 placeholder='e.g. "What does tradition say about pathworking Tiphareth without a teacher?"'
 value={query}
 onChange={(e) => setQuery(e.target.value)}
 />
 <button
 type="submit"
 className="inline-flex items-center gap-2 rounded-xl border border-red-800/50 bg-red-950/50 px-5 py-2.5 text-sm text-red-200 transition hover:bg-red-900/40 disabled:opacity-40"
 disabled={consulting || !query.trim() || !sessionReady}
 >
 {consulting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldAlert className="h-4 w-4" />}
 Consult Kabbalah Vault
 </button>
 </form>

 {status?.entries.length ? (
 <div>
 <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-red-400/70">
 Vault corpus (preview)
 </h3>
 <ul className="space-y-2 text-sm text-secondary">
 {status.entries.map((e) => (
 <li key={e.id} className="rounded-lg border border-red-900/15 bg-black/30 px-4 py-3">
 <span className="text-red-200/90">{e.title}</span>
 <span className="text-tertiary"> · {e.tradition}</span>
 <p className="mt-1 text-xs text-tertiary">{e.summary}</p>
 </li>
 ))}
 </ul>
 </div>
 ) : null}
 </>
 )}

 {error ? <p className="text-sm text-red-400">{error}</p> : null}

 {(consulting && streamingText) || resultText ? (
 <div className="prose-luxury rounded-xl border border-red-900/25 bg-black/50 p-6">
 <h3 className="!mt-0 text-lg text-red-200">Vault response</h3>
 <div className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-red-100/75">
 {(streamingText || resultText).replace(/RECOMMENDED_IDS:[^\n]*/i, "").trim()}
 </div>
 </div>
 ) : null}
 </section>
 );
}
