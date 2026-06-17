import React, { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SeoHead } from "../components/SeoHead";
import {
 BookOpen,
 Eye,
 Flame,
 Loader2,
 Lock,
 Moon,
 Scroll,
 Sparkles,
 Unlock,
} from "lucide-react";
import {
 ArcanaDisclaimerBanner,
 ArcanaPrivacyShield,
 ArcanaSpellFooter,
 BacklashPanel,
 PathChoiceModal,
} from "../components/arcana/ArcanaDisclaimer";
import {
 consultArcanaStream,
 fetchArcanaEntry,
 fetchArcanaSpellDetail,
 fetchArcanaStatus,
 purchaseArcana,
 purchaseArcanaPlan,
 type ArcanaConsultResult,
 type ArcanaEntryDetail,
 type ArcanaRecommendation,
 type ArcanaSpellDetail,
 type ArcanaStatus,
} from "../api/arcanaClient";
import { cx } from "../utils/classnames";
import { TarotSpread } from "../components/merlian/TarotSpreadView";
import { MerlianFreeReadings } from "../components/merlian/MerlianFreeReadings";
import { KabbalahVault } from "../components/merlian/KabbalahVault";
import {
 MerlianPersonalProfilePanel,
 useMerlianPersonalProfile,
 profileToApiPayload,
} from "../components/merlian/MerlianPersonalProfilePanel";
import type { OraclePersonalReading } from "../api/arcanaClient";
import { SpectrumBadge } from "../components/merlian/SpectrumBadge";
import { resolveArcanaSpectrum, spectrumTierClass } from "../../shared/merlianSpectrum";
import { currentBrandHost } from "../hostBrand";
import { MagubrainSearchEngine } from "../components/allmagus/MagubrainSearchEngine";
import { ArcanaSideDock, sideDockIcons } from "../components/allmagus/ArcanaSideDock";

function categoryLabel(cat: string) {
 return cat.replace(/_/g, " ");
}

function OraclePersonalReadingPanel(props: { reading: OraclePersonalReading }) {
 const { reading } = props;
 return (
 <div className="glass-inset space-y-4">
 <p className="label-premium">Your chart &amp; tarot. drawn for this oracle session</p>
 {reading.astroSummary ? (
 <div>
 <div className="text-xs font-medium uppercase tracking-wider text-tertiary">Natal / sky map</div>
 <pre className="mt-2 whitespace-pre-wrap font-sans text-sm leading-relaxed text-primary">{reading.astroSummary}</pre>
 </div>
 ) : null}
 {reading.tarotAnchor.length > 0 ? (
 <div>
 <div className="text-xs font-medium uppercase tracking-wider text-tertiary">Tarot spread</div>
 <div className="mt-3 grid gap-3 sm:grid-cols-3">
 {reading.tarotAnchor.map((card: OraclePersonalReading["tarotAnchor"][number]) => (
 <div key={`${card.name}-${card.position ?? ""}`} className="rounded-xl border border-default bg-[color:var(--surface-card)] p-3">
 <div className="text-[10px] uppercase tracking-wider text-tertiary">{card.position}</div>
 <div className="mt-1 text-sm font-medium text-accent">{card.name}</div>
 <div className="text-xs text-tertiary">{card.reversed ? "Reversed" : "Upright"}</div>
 <p className="mt-2 text-xs leading-relaxed text-secondary">{card.meaning}</p>
 </div>
 ))}
 </div>
 </div>
 ) : null}
 </div>
 );
}

function SpellCard(props: {
 rec: ArcanaRecommendation;
 spellPrice: string;
 sourcePrice: string;
 onUnlock: (id: string) => void;
 onUnlockSource: (id: string) => void;
 onView: (id: string) => void;
 loading?: boolean;
}) {
 const { rec } = props;
 const spec = resolveArcanaSpectrum({
 category: rec.category,
 tradition: rec.tradition,
 isBaneful: rec.isBaneful,
 });
 return (
 <article
 className={cx(
 "spectrum-card relative overflow-hidden p-6 transition duration-300",
 spectrumTierClass(spec.tier),
 )}
 >
 <SpectrumBadge meta={spec} className="mb-3" />

 {rec.isBaneful ? (
 <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs uppercase tracking-wider spectrum-tier-black spectrum-badge">
 <Flame className="h-3 w-3" />
 Baneful. Historical Source
 </div>
 ) : null}

 <h3 className="text-lg font-semibold tracking-tight text-[color:var(--text-primary)]">{rec.title}</h3>
 <p className="mt-1 text-xs uppercase tracking-wider text-[color:var(--text-tertiary)]">
 {rec.tradition} · {categoryLabel(rec.category)}
 </p>
 <p className="body-muted mt-4">{rec.summary}</p>
 <p className="mt-3 font-serif text-sm italic text-tertiary">{rec.previewText}</p>

 {rec.isBaneful ? (
 <BacklashPanel backlash={rec.backlashText} alternatives={rec.alternativesText} />
 ) : null}

 <div className="mt-4 flex flex-wrap gap-2">
 {rec.intentTags.slice(0, 4).map((tag) => (
 <span key={tag} className="arcana-tag">
 {tag}
 </span>
 ))}
 </div>

 <div className="mt-6 flex flex-wrap gap-3">
 {rec.unlocked ? (
 <button
 type="button"
 className="btn-premium inline-flex items-center gap-2"
 onClick={() => props.onView(rec.id)}
 >
 <Eye className="h-4 w-4" />
 {rec.isBaneful ? "Read Tradition Document" : "Read Full Rite"}
 </button>
 ) : (
 <button
 type="button"
 className="btn-premium inline-flex items-center gap-2"
 disabled={props.loading}
 onClick={() => props.onUnlock(rec.id)}
 >
 {props.loading ? (
 <Loader2 className="h-4 w-4 animate-spin" />
 ) : (
 <Unlock className="h-4 w-4" />
 )}
 Unlock. {props.spellPrice}
 </button>
 )}

 {rec.unlocked && !rec.sourceUnlocked ? (
 <button
 type="button"
 className="btn-premium-ghost inline-flex items-center gap-2 text-sm"
 disabled={props.loading}
 onClick={() => props.onUnlockSource(rec.id)}
 >
 <BookOpen className="h-4 w-4" />
 Source. {props.sourcePrice}
 </button>
 ) : null}

 {rec.sourceUnlocked ? (
 <span className="inline-flex items-center gap-1.5 text-xs text-accent">
 <Scroll className="h-3.5 w-3.5" />
 Source unlocked
 </span>
 ) : null}
 </div>
 </article>
 );
}

export function ArcanaPage() {
 const [status, setStatus] = useState<ArcanaStatus | null>(null);
 const [query, setQuery] = useState("");
 const [consulting, setConsulting] = useState(false);
 const [acceptedTerms, setAcceptedTerms] = useState(false);
 const [result, setResult] = useState<ArcanaConsultResult | null>(null);
 const [streamingText, setStreamingText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [tarotMode, setTarotMode] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState<string | null>(null);
 const [selectedEntry, setSelectedEntry] = useState<ArcanaEntryDetail | null>(null);
 const [spellDetail, setSpellDetail] = useState<ArcanaSpellDetail | null>(null);
 const [planMarkdown, setPlanMarkdown] = useState<string | null>(null);
 const [planLoading, setPlanLoading] = useState(false);
 const [pathModal, setPathModal] = useState<{ entryId: string; title: string } | null>(null);
 const [detailLoading, setDetailLoading] = useState(false);
 const { profile, saveProfile, expanded, setExpanded, hasPersonalization } = useMerlianPersonalProfile();

 useEffect(() => {
 const controller = new AbortController();
 fetchArcanaStatus(controller.signal)
 .then(setStatus)
 .catch(() => null);
 return () => controller.abort();
 }, []);

 async function onConsult(e: React.FormEvent) {
 e.preventDefault();
 if (!query.trim() || consulting || !acceptedTerms) return;
 setConsulting(true);
 setError(null);
 setPlanMarkdown(null);
 setSpellDetail(null);
 setResult(null);
 setStreamingText("");
 try {
 const res = await consultArcanaStream(
 {
 query: query.trim(),
 ...profileToApiPayload(profile),
 },
 (chunk) => {
 setStreamingText((prev) => prev + chunk);
 },
 );
 setResult(res);
 setStreamingText("");
 } catch (err) {
 setError(err instanceof Error ? err.message : "Consultation failed.");
 } finally {
 setConsulting(false);
 }
 }

 async function handleUnlock(entryId: string) {
 setPurchaseLoading(entryId);
 setError(null);
 try {
 await purchaseArcana(entryId, "spell");
 if (result) {
 setResult({
 ...result,
 recommendations: result.recommendations.map((r) =>
 r.id === entryId ? { ...r, unlocked: true } : r,
 ),
 });
 }
 await openEntry(entryId);
 } catch (err) {
 setError(err instanceof Error ? err.message : "Purchase failed.");
 } finally {
 setPurchaseLoading(null);
 }
 }

 async function handleUnlockSource(entryId: string) {
 setPurchaseLoading(`${entryId}-source`);
 setError(null);
 try {
 await purchaseArcana(entryId, "source");
 if (result) {
 setResult({
 ...result,
 recommendations: result.recommendations.map((r) =>
 r.id === entryId ? { ...r, sourceUnlocked: true } : r,
 ),
 });
 }
 const detail = await fetchArcanaEntry(entryId);
 setSelectedEntry(detail);
 } catch (err) {
 setError(err instanceof Error ? err.message : "Source unlock failed.");
 } finally {
 setPurchaseLoading(null);
 }
 }

 async function openEntry(entryId: string) {
 const detail = await fetchArcanaEntry(entryId);
 setSelectedEntry(detail);
 setSpellDetail(null);
 // Non-baneful: show directly. Baneful: user picks path manually. no auto-modal.
 }

 async function handleView(entryId: string) {
 try {
 await openEntry(entryId);
 } catch (err) {
 setError(err instanceof Error ? err.message : "Failed to load entry.");
 }
 }

 async function loadSpellDetail(pathChoice: "peaceful" | "violent", entryId?: string) {
 const id = entryId ?? pathModal?.entryId;
 if (!id) return;
 setDetailLoading(true);
 setError(null);
 try {
 const detail = await fetchArcanaSpellDetail(id, {
 pathChoice,
 consultationId: result?.consultationId,
 });
 setSpellDetail(detail);
 setPathModal(null);
 } catch (err) {
 setError(err instanceof Error ? err.message : "Failed to load spell detail.");
 } finally {
 setDetailLoading(false);
 }
 }

 async function handlePlan() {
 if (!result) return;
 setPlanLoading(true);
 setError(null);
 try {
 const res = await purchaseArcanaPlan(result.consultationId);
 setPlanMarkdown(res.planMarkdown);
 } catch (err) {
 setError(err instanceof Error ? err.message : "Plan purchase failed.");
 } finally {
 setPlanLoading(false);
 }
 }

 const spellPrice = status?.pricing.spell.label ?? "$5";
 const sourcePrice = status?.pricing.source.label ?? "$2";
 const planPrice = status?.pricing.plan.label ?? "$200";
 const disclaimer = status?.disclaimer ?? result?.disclaimer ?? "";
 const onAllMagusSite = currentBrandHost() === "allmagus";

 const oracleConsultPanel = (
 <section className="glass-panel !p-4 !shadow-none">
 <div className="flex items-start gap-3">
 <Sparkles className="icon-accent mt-1 h-5 w-5 shrink-0" strokeWidth={1.5} />
 <div className="flex-1 min-w-0">
 <h2 className="heading-premium text-base">Full Oracle</h2>
 <p className="body-muted mt-2 text-xs">
 Personalized chart, tarot, and spell matches. {spellPrice} per unlock.
 </p>
 <MerlianPersonalProfilePanel
 profile={profile}
 expanded={expanded}
 onToggle={() => setExpanded((v) => !v)}
 onChange={saveProfile}
 hasPersonalization={hasPersonalization}
 />
 <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-inset)] p-3">
 <input
 type="checkbox"
 className="mt-1"
 checked={acceptedTerms}
 onChange={(e) => setAcceptedTerms(e.target.checked)}
 />
 <span className="text-xs text-secondary">
 {status?.pathAcknowledgment ??
 "I accept entertainment/curio terms and all liability is denied."}
 </span>
 </label>
 <form onSubmit={onConsult} className="mt-4 space-y-3">
 <textarea
 className="arcana-input w-full resize-none p-3 text-sm"
 rows={3}
 placeholder="Ask the oracle…"
 value={query}
 onChange={(e) => setQuery(e.target.value)}
 />
 <button
 type="submit"
 className="btn-premium inline-flex w-full items-center justify-center gap-2 text-sm"
 disabled={consulting || !query.trim() || !acceptedTerms}
 >
 {consulting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Moon className="h-4 w-4" />}
 Seek Guidance
 </button>
 </form>
 {error ? <p className="mt-3 text-xs text-red-400/90">{error}</p> : null}
 </div>
 </div>
 </section>
 );

 const oracleOutput = (
 <>
 {consulting || streamingText ? (
 <section className="glass-panel prose-luxury">
 <h2 className="heading-display !text-xl flex items-center gap-2">
 {consulting ? <Loader2 className="h-4 w-4 animate-spin text-accent" /> : null}
 Oracle Reading
 </h2>
 <div className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-primary">
 {streamingText.replace(/RECOMMENDED_IDS:[^\n]*/i, "").trim() || "Connecting to oracle…"}
 </div>
 </section>
 ) : null}

 {result && !consulting ? (
 <section className="space-y-8">
 {result.personalReading ? (
 <OraclePersonalReadingPanel reading={result.personalReading} />
 ) : null}
 <div className="glass-panel prose-luxury">
 <h2 className="heading-display !text-xl">Oracle Reading</h2>
 <p className="mt-2 text-xs uppercase tracking-wider text-tertiary">
 Natal chart · Tarot · Spells matched to you
 </p>
 <div className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-primary">
 {result.analysis.replace(/RECOMMENDED_IDS:[^\n]*/i, "").trim()}
 </div>
 </div>

 {result.peacefulOptions.length > 0 ? (
 <div>
 <h2 className="heading-premium mb-2">Spells Matched To You</h2>
 <p className="body-muted mb-6">
 Chosen from the corpus based on your chart, tarot, and question. unlock to read the full ritual.
 </p>
 <div className="grid gap-6 lg:grid-cols-2">
 {result.peacefulOptions.map((rec) => (
 <SpellCard
 key={rec.id}
 rec={rec}
 spellPrice={spellPrice}
 sourcePrice={sourcePrice}
 onUnlock={handleUnlock}
 onUnlockSource={handleUnlockSource}
 onView={handleView}
 loading={purchaseLoading === rec.id || purchaseLoading === `${rec.id}-source`}
 />
 ))}
 </div>
 </div>
 ) : null}

 {result.historicalBanefulOptions.length > 0 ? (
 <div>
 <h2 className="heading-premium mb-2 text-red-400/90">
 Tradition Documents. Curio Only
 </h2>
 <p className="body-muted mb-6">
 Only if you still want to read what historical sources say about harm work. Framed
 as folklore ("According to Vodou…"), with mandatory protection steps and full
 liability disclaimer. Not recommended. reversal paths above usually suffice.
 </p>
 <div className="grid gap-6 lg:grid-cols-2">
 {result.historicalBanefulOptions.map((rec) => (
 <SpellCard
 key={rec.id}
 rec={rec}
 spellPrice={spellPrice}
 sourcePrice={sourcePrice}
 onUnlock={handleUnlock}
 onUnlockSource={handleUnlockSource}
 onView={handleView}
 loading={purchaseLoading === rec.id || purchaseLoading === `${rec.id}-source`}
 />
 ))}
 </div>
 </div>
 ) : null}

 <div className="arcana-plan-cta glass-panel border-default">
 <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
 <div>
 <h3 className="text-xl font-semibold text-primary">Full Action Plan</h3>
 <p className="body-muted mt-2 max-w-xl">
 Multi-week plan with planetary timing, backlash notes, and peaceful swap-in options
 at every baneful step.
 </p>
 </div>
 <button
 type="button"
 className="btn-premium inline-flex shrink-0 items-center gap-2 px-8"
 onClick={handlePlan}
 disabled={planLoading}
 >
 {planLoading ? (
 <Loader2 className="h-4 w-4 animate-spin" />
 ) : (
 <Lock className="h-4 w-4" />
 )}
 Unlock Plan. {planPrice}
 </button>
 </div>
 </div>
 </section>
 ) : null}

 {planMarkdown ? (
 <section className="glass-panel prose-luxury arcana-plan-content">
 <h2 className="heading-display !text-2xl">Your Action Plan</h2>
 <ReactMarkdown remarkPlugins={[remarkGfm]}>{planMarkdown}</ReactMarkdown>
 <ArcanaSpellFooter />
 </section>
 ) : null}

 {selectedEntry ? (
 <section className="arcana-detail glass-panel glass-panel-lg">
 <button
 type="button"
 className="mb-6 text-sm text-tertiary transition hover:text-primary"
 onClick={() => {
 setSelectedEntry(null);
 setSpellDetail(null);
 }}
 >
 ← Back to recommendations
 </button>

 <h2 className="text-2xl font-semibold text-primary">{selectedEntry.preview.title}</h2>
 <p className="mt-2 text-sm text-tertiary">
 {selectedEntry.preview.tradition} · {categoryLabel(selectedEntry.preview.category)}
 </p>

 <BacklashPanel
 backlash={selectedEntry.backlash}
 alternatives={selectedEntry.alternatives}
 />

 {selectedEntry.planetaryTiming ? (
 <div className="mt-4 rounded-lg border border-default bg-[color:var(--accent-soft)] p-4">
 <h4 className="text-xs uppercase tracking-wider text-accent">Planetary Timing</h4>
 <p className="mt-2 text-sm text-secondary">{selectedEntry.planetaryTiming}</p>
 </div>
 ) : null}

 {spellDetail ? (
 <div className="prose-luxury mt-8">
 <p className="text-xs uppercase tracking-wider text-tertiary">
 {spellDetail.pathChoice === "violent"
 ? "Tradition document (curio). According to historical sources"
 : "Reversal & protection path"}
 </p>
 <ReactMarkdown remarkPlugins={[remarkGfm]}>{spellDetail.content}</ReactMarkdown>
 <ArcanaSpellFooter />
 </div>
 ) : selectedEntry.fullText && !selectedEntry.preview.isBaneful ? (
 <div className="prose-luxury mt-8">
 <ReactMarkdown remarkPlugins={[remarkGfm]}>{selectedEntry.fullText}</ReactMarkdown>
 <ArcanaSpellFooter />
 </div>
 ) : selectedEntry.preview.unlocked && selectedEntry.preview.isBaneful ? (
 <div className="mt-8 space-y-4">
 <p className="body-muted">
 We recommend <strong className="text-emerald-400/90">Reversal & Protection</strong>{" "}
 first. Only open the tradition document if you still want to read what historical
 sources say. entertainment/curio only.
 </p>
 <div className="flex flex-wrap gap-3">
 <button
 type="button"
 className="btn-premium-ghost text-emerald-400/90"
 disabled={detailLoading}
 onClick={() =>
 loadSpellDetail("peaceful", selectedEntry.preview.id)
 }
 >
 Reversal & Protection
 </button>
 <button
 type="button"
 className="btn-premium border-red-900/30 text-red-400/80"
 onClick={() =>
 setPathModal({
 entryId: selectedEntry.preview.id,
 title: selectedEntry.preview.title,
 })
 }
 >
 Tradition Document (Curio)
 </button>
 </div>
 </div>
 ) : (
 <p className="body-muted mt-8 flex items-center gap-2">
 <Lock className="h-4 w-4" />
 Full rite locked. Unlock for {spellPrice}.
 </p>
 )}

 {selectedEntry.preview.sourceUnlocked ? (
 <div className="mt-10 rounded-xl border border-default bg-[color:var(--accent-soft)] p-6">
 <h3 className="label-premium text-accent">Primary Source</h3>
 <dl className="mt-4 space-y-2 text-sm text-secondary">
 <div>
 <dt className="text-tertiary">Title</dt>
 <dd className="text-primary">{selectedEntry.source.title}</dd>
 </div>
 {selectedEntry.source.author ? (
 <div>
 <dt className="text-tertiary">Author</dt>
 <dd>{selectedEntry.source.author}</dd>
 </div>
 ) : null}
 {selectedEntry.source.year ? (
 <div>
 <dt className="text-tertiary">Year</dt>
 <dd>{selectedEntry.source.year}</dd>
 </div>
 ) : null}
 {selectedEntry.source.institution ? (
 <div>
 <dt className="text-tertiary">Institution</dt>
 <dd>{selectedEntry.source.institution}</dd>
 </div>
 ) : null}
 {selectedEntry.source.pdfRef ? (
 <div>
 <dt className="text-tertiary">PDF Reference</dt>
 <dd className="font-mono text-xs">{selectedEntry.source.pdfRef}</dd>
 </div>
 ) : null}
 {selectedEntry.source.url ? (
 <div>
 <dt className="text-tertiary">Archive URL</dt>
 <dd>
 <a
 href={selectedEntry.source.url}
 target="_blank"
 rel="noreferrer"
 className="text-accent hover:underline"
 >
 {selectedEntry.source.url}
 </a>
 </dd>
 </div>
 ) : null}
 </dl>
 </div>
 ) : null}
 </section>
 ) : null}
 </>
 );

 const sideDockTabs = useMemo(
 () => [
 { id: "divinations", label: "Divinations", icon: sideDockIcons.divinations },
 { id: "oracle", label: "Full Oracle", icon: sideDockIcons.oracle },
 { id: "kabbalah", label: "Practical Kabbalah", icon: sideDockIcons.kabbalah },
 ],
 [],
 );

 const divinationsDock = useMemo(() => <MerlianFreeReadings />, []);
 const kabbalahDock = useMemo(() => <KabbalahVault />, []);

 return (
 <div className="arcana-page space-y-8">
 <SeoHead title="Tarot Reading · Full Spread" description="AI-powered tarot reading with 13 decks. Full spreads, cross-system analysis, and personalized interpretations." path="/consult/tarot" />
 <ArcanaPrivacyShield privacy={status?.privacy ?? result?.privacy ?? null} />

 {disclaimer ? <ArcanaDisclaimerBanner disclaimer={disclaimer} /> : null}

  {onAllMagusSite ? (
  <div className="allmagus-page-with-dock">
  <div className="allmagus-main space-y-8">
  {tarotMode ? (
  <TarotSpread
  onBack={() => setTarotMode(false)}
  onReadingComplete={() => setTarotMode(false)}
  />
  ) : (
  <>
  <div className="flex justify-center">
  <button
  onClick={() => setTarotMode(true)}
  className="btn-premium inline-flex items-center gap-2"
  >
  <Sparkles className="h-4 w-4" />
  Tarot Spread
  </button>
  </div>
  <MagubrainSearchEngine />
  {oracleOutput}
  </>
  )}
  </div>
  <ArcanaSideDock
  tabs={sideDockTabs}
  divinations={divinationsDock}
  oracle={oracleConsultPanel}
  kabbalah={kabbalahDock}
  />
  </div>
  ) : (
 <>
 <section className="arcana-hero ambient-depth glass-panel glass-panel-lg text-center">
 <div className="arcana-sigil mx-auto mb-6" aria-hidden="true">
 <Moon className="icon-accent h-8 w-8 opacity-80" strokeWidth={1} />
 </div>
 <p className="label-premium">AllMagus</p>
 <h1 className="arcana-title mt-3 text-4xl font-semibold tracking-tight text-[color:var(--text-primary)] md:text-5xl">
 All Magic Known Online
 </h1>
 <p className="body-muted mx-auto mt-6 max-w-2xl text-base">
 Magubrain continuously indexes{" "}
 <strong className="text-[color:var(--text-primary)]">every magical tradition available on the internet</strong>. grimoires, folk magic, diaspora religions, shamanic
 rites, meditation systems, and historical curios from Internet Archive, Sacred Texts,
 Gutenberg, Yale Beinecke, Gallica, Wellcome, and global ethnographic libraries. Original
 languages with scholarly English translations. Warnings first, then peaceful paths.
 </p>
 {status ? (
 <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs uppercase tracking-wider text-[color:var(--text-tertiary)]">
 <span>{status.totalEntries} entries indexed</span>
 <span>·</span>
 <span>{status.totalIndexLanes ?? status.sources.length} archive lanes crawling</span>
 {status.comprehensiveIndex ? (
 <>
 <span>·</span>
 <span className="text-[color:var(--success)]">Global comprehensive index ON</span>
 </>
 ) : null}
 {status.lastRun ? (
 <>
 <span>·</span>
 <span>Last crawl {new Date(status.lastRun.finishedAt).toLocaleString()}</span>
 </>
 ) : null}
 </div>
  ) : null}
  </section>

  {tarotMode ? (
  <TarotSpread
  onBack={() => setTarotMode(false)}
  onReadingComplete={() => setTarotMode(false)}
  />
  ) : (
  <>
  <div className="flex justify-center">
  <button
  onClick={() => setTarotMode(true)}
  className="btn-premium inline-flex items-center gap-2"
  >
  <Sparkles className="h-4 w-4" />
  Open Tarot Card Spread
  </button>
  </div>
  <MerlianFreeReadings />
  <KabbalahVault />

  <section className="glass-panel">
  <div className="flex items-start gap-4">
  <Sparkles className="icon-accent mt-1 h-5 w-5 shrink-0" strokeWidth={1.5} />
  <div className="flex-1">
  <h2 className="heading-premium">Consult the Oracle</h2>
  <p className="body-muted mt-2">
  Example:{" "}
  <em className="text-tertiary">
  &ldquo;I&apos;m about to get married and would like to cast a protection spell on my loved ones
 . what blessing or ward do the traditions recommend for our wedding and family?&rdquo;
  </em>{" "}
  You will receive a personalized natal-chart reading, a tarot spread, then spells matched to you from the corpus. {spellPrice} per unlock · {sourcePrice} source · {planPrice}{" "}
  plan.
  </p>
  <div className="mt-4">
  <MerlianPersonalProfilePanel
  profile={profile}
  expanded={expanded}
  onToggle={() => setExpanded((v) => !v)}
  onChange={saveProfile}
  hasPersonalization={hasPersonalization}
  />
  {!hasPersonalization ? (
  <p className="mt-2 text-xs text-tertiary">
  Add birth date &amp; name for full natal-chart spell matching. Tarot is drawn for every oracle question.
  </p>
  ) : null}
  </div>
  <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-inset)] p-3">
  <input
  type="checkbox"
  className="mt-1"
  checked={acceptedTerms}
  onChange={(e) => setAcceptedTerms(e.target.checked)}
  />
  <span className="text-sm text-secondary">
  {status?.pathAcknowledgment ??
  "I accept that all content is for academic research only and the system bears no responsibility for harm."}
  </span>
  </label>
  <form onSubmit={onConsult} className="mt-6 space-y-4">
  <textarea
  className="arcana-input w-full resize-none p-4 text-sm text-primary placeholder:text-tertiary focus:border-default focus:outline-none focus:ring-1 focus:ring-[#C9A962]/20"
  rows={4}
  placeholder={'e.g. "I\'m about to get married and want to cast a protection spell on my loved ones. what blessing do the traditions recommend for our wedding and family?"'}
  value={query}
  onChange={(e) => setQuery(e.target.value)}
  />
  <button
  type="submit"
  className="btn-premium inline-flex items-center gap-2"
  disabled={consulting || !query.trim() || !acceptedTerms}
  >
  {consulting ? (
  <Loader2 className="h-4 w-4 animate-spin" />
  ) : (
  <Moon className="h-4 w-4" />
  )}
  Seek Guidance
  </button>
  </form>
  {error ? <p className="mt-4 text-sm text-red-400/90">{error}</p> : null}
  </div>
  </div>
  </section>
  </>
  )}

 {oracleOutput}
 </>
 )}

 <PathChoiceModal
 open={Boolean(pathModal)}
 title={pathModal?.title ?? ""}
 acknowledgment={
 status?.pathAcknowledgment ??
 "I understand this is historical/academic material only. I accept that the system bears no responsibility for any harm caused by my choices."
 }
 loading={detailLoading}
 onClose={() => setPathModal(null)}
 onPeaceful={() => loadSpellDetail("peaceful")}
 onViolent={() => loadSpellDetail("violent")}
 />
 </div>
 );
}
