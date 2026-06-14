import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Loader2, Sparkles } from "lucide-react";

import {
 streamDivination,
 type DivinationMethod,
 type MerlianPersonalizationPayload,
 type ReadingMeta,
} from "../../api/merlianReadingsClient";
import { streamKabbalahDivination } from "../../api/kabbalahClient";
import type { MerlianPersonalProfile } from "./useMerlianPersonalProfile";

function MetaBlock(props: { meta: ReadingMeta }) {
 const { meta } = props;
 if (meta.type === "tarot") {
 return (
 <div className="flex flex-wrap gap-2">
 {(meta.cards ?? []).map((c) => (
 <div key={c.id} className="rounded-lg border border-default px-3 py-2 text-xs">
 <div className="text-primary">{c.name}</div>
 <div className="text-tertiary">{c.reversed ? "Reversed" : "Upright"}</div>
 </div>
 ))}
 </div>
 );
 }
  if (meta.type === "rune") {
  return (
  <div className="flex flex-wrap gap-3">
  {meta.runes.map((r) => (
  <div key={r.id} className="text-center">
  <div className="text-3xl">{r.glyph}</div>
  <div className="text-xs font-medium text-primary">{r.name}</div>
  <div className="text-[10px] text-tertiary">{r.merkstave ? "Merkstave (reversed)" : "Upright"}</div>
  </div>
  ))}
  </div>
  );
  }
 if (meta.type === "numerology") {
 const p = meta.profile;
 return (
 <div className="grid gap-2 text-sm text-primary sm:grid-cols-2">
 <div>Life Path: <strong>{p.lifePath.number}</strong></div>
 <div>Expression: <strong>{p.expression.number}</strong></div>
 <div>Soul Urge: <strong>{p.soulUrge.number}</strong></div>
 <div>Personality: <strong>{p.personality.number}</strong></div>
 </div>
 );
 }
 return null;
}

export function DivinationPanel(props: {
 method: DivinationMethod;
 personalization?: MerlianPersonalizationPayload;
 profile?: MerlianPersonalProfile;
}) {
 const { method, personalization, profile } = props;
 const [question, setQuestion] = useState("");
 const [description, setDescription] = useState("");
 const [birthDate, setBirthDate] = useState("");
 const [fullName, setFullName] = useState("");
 const [loading, setLoading] = useState(false);
 const [meta, setMeta] = useState<ReadingMeta | null>(null);
 const [text, setText] = useState("");
 const [error, setError] = useState<string | null>(null);

 const needsDescribe = method.mode === "describe" || method.id === "letter_perm";
 const needsKabbalah = method.mode === "kabbalah";
 const needsManifestation = method.mode === "manifestation_llm" || method.mode === "generic_llm";
 const needsNumerology = method.mode === "numerology";

 async function onSubmit(e: React.FormEvent) {
 e.preventDefault();
 setLoading(true);
 setError(null);
 setText("");
 setMeta(null);
 try {
 if (needsKabbalah) {
 await streamKabbalahDivination(
 {
 divinationId: method.id,
 question: question.trim() || undefined,
 description: needsDescribe ? description.trim() || undefined : undefined,
 },
 (chunk) => setText((prev) => prev + chunk),
 );
 } else {
 await streamDivination(
 {
 divinationId: method.id,
 question,
 description: needsDescribe || needsManifestation ? description : undefined,
 birthDate: needsNumerology ? birthDate || profile?.birthDate : undefined,
 fullName: needsNumerology ? fullName || profile?.fullName : undefined,
 ...personalization,
 },
 (chunk) => setText((prev) => prev + chunk),
 setMeta,
 );
 }
 } catch (err) {
 setError(err instanceof Error ? err.message : "Reading failed.");
 } finally {
 setLoading(false);
 }
 }

 return (
 <div className="space-y-6 border-t border-default pt-8">
 <div>
 <h2 className="heading-premium">{method.label}</h2>
 <p className="body-muted mt-1 text-sm">{method.blurb}</p>
 {method.tradition ? (
 <p className="mt-1 text-xs uppercase tracking-wider text-tertiary">{method.tradition}</p>
 ) : null}
 </div>

 <form onSubmit={onSubmit} className="space-y-4">
 {needsNumerology && !profile?.birthDate ? (
 <>
 <label className="block text-sm">
 <span className="text-tertiary">Full birth name</span>
 <input
 required
 className="input-field mt-1"
 value={fullName}
 onChange={(e) => setFullName(e.target.value)}
 />
 </label>
 <label className="block text-sm">
 <span className="text-tertiary">Birth date</span>
 <input
 type="date"
 required
 className="input-field mt-1"
 value={birthDate}
 onChange={(e) => setBirthDate(e.target.value)}
 />
 </label>
 </>
 ) : null}
 {needsNumerology && profile?.birthDate && profile?.fullName ? (
 <p className="text-xs text-emerald-400/80">
 Using birth name and date from your personal profile above.
 </p>
 ) : null}

 <label className="block text-sm">
 <span className="text-tertiary">Your question</span>
 <input
 className="input-field mt-1"
 placeholder="Optional focus for your reading"
 value={question}
 onChange={(e) => setQuestion(e.target.value)}
 />
 </label>

 {needsManifestation && method.mode !== "describe" ? (
 <label className="block text-sm">
 <span className="text-tertiary">Your goal or context (optional)</span>
 <textarea
 rows={3}
 className="input-field mt-1 p-3"
 placeholder="What do you want to manifest? Any blocks or background?"
 value={description}
 onChange={(e) => setDescription(e.target.value)}
 />
 </label>
 ) : null}

 {needsDescribe ? (
 <label className="block text-sm">
 <span className="text-tertiary">Details (symbols, visions, patterns…)</span>
 <textarea
 rows={4}
 required={method.mode === "describe"}
 className="input-field mt-1 p-3"
 value={description}
 onChange={(e) => setDescription(e.target.value)}
 />
 </label>
 ) : null}

 {personalization && (method.mode === "manifestation_llm" || method.mode === "generic_llm") ? (
 <p className="text-xs text-purple-400/80">
 Your personal profile (chart, culture, destination, growth) will shape this guide.
 </p>
 ) : null}

 <button type="submit" className="btn-premium inline-flex items-center gap-2" disabled={loading}>
 {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
 {loading ? "Reading…" : method.mode === "manifestation_llm" ? `Learn ${method.label}` : `Begin ${method.label}`}
 </button>
 </form>

 {error ? <p className="text-sm text-red-400/90">{error}</p> : null}
 {meta ? (
 <div className="glass-inset rounded-xl p-4">
 <MetaBlock meta={meta} />
 </div>
 ) : null}
 {text ? (
 <div className="glass-panel prose-luxury">
 <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
 </div>
 ) : null}
 </div>
 );
}
