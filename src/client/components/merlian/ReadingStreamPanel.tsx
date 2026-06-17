import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Loader2, Sparkles } from "lucide-react";

import {
 streamMerlianReading,
 type ReadingMeta,
 type ReadingType,
} from "../../api/merlianReadingsClient";

type ReadingConfig = {
 title: string;
 blurb: string;
 fields: Array<
 | { key: "question"; label: string; type: "text"; placeholder: string }
 | { key: "description"; label: string; type: "textarea"; placeholder: string; required?: boolean }
 | { key: "spread"; label: string; type: "select"; options: { value: string; label: string }[] }
 | { key: "cast"; label: string; type: "select"; options: { value: string; label: string }[] }
 | { key: "dominantHand"; label: string; type: "select"; options: { value: string; label: string }[] }
 >;
};

const CONFIGS: Record<ReadingType, ReadingConfig> = {
 tarot: {
 title: "Tarot Reading",
 blurb: "Draw cards from the full 78-card deck. free streaming interpretation",
 fields: [
 { key: "question", label: "Your question", type: "text", placeholder: "What should I focus on this month?" },
 {
 key: "spread",
 label: "Spread",
 type: "select",
 options: [
 { value: "single", label: "Single card" },
 { value: "three", label: "Past · Present · Future" },
 { value: "cross", label: "Five-card cross" },
 ],
 },
 ],
 },
 rune: {
 title: "Rune Magic Reading",
 blurb: "Elder Futhark cast with Norse magical correspondence. free",
 fields: [
 { key: "question", label: "Your question", type: "text", placeholder: "What force should I invoke?" },
 {
 key: "cast",
 label: "Cast",
 type: "select",
 options: [
 { value: "single", label: "Single rune" },
 { value: "three", label: "Three runes" },
 { value: "five", label: "Five rune spread" },
 ],
 },
 ],
 },
 coffee: {
 title: "Coffee Cup Reading",
 blurb: "Tasseography. describe symbols in your cup after drinking",
 fields: [
 { key: "question", label: "Your question", type: "text", placeholder: "Optional focus" },
 {
 key: "description",
 label: "What you see in the cup",
 type: "textarea",
 required: true,
 placeholder: "e.g. A bird near the rim, a road crossing the center, heavy grounds at the base…",
 },
 ],
 },
 palm: {
 title: "Palm Reading",
 blurb: "Chiromancy from your line and mount description. free",
 fields: [
 { key: "question", label: "Your question", type: "text", placeholder: "Optional" },
 {
 key: "dominantHand",
 label: "Dominant hand",
 type: "select",
 options: [
 { value: "right", label: "Right (active)" },
 { value: "left", label: "Left (receptive)" },
 ],
 },
 {
 key: "description",
 label: "Describe your palm",
 type: "textarea",
 required: true,
 placeholder: "Life line depth, heart line forks, fate line, mounts, marks…",
 },
 ],
 },
 face: {
 title: "Face Reading",
 blurb: "Physiognomy & face correspondence from your description. free",
 fields: [
 { key: "question", label: "Your question", type: "text", placeholder: "Optional" },
 {
 key: "description",
 label: "Describe your face",
 type: "textarea",
 required: true,
 placeholder: "Forehead, eyes, nose bridge, lips, jaw, symmetry, notable marks…",
 },
 ],
 },
};

function MetaDisplay(props: { meta: ReadingMeta }) {
 const { meta } = props;
 if (meta.type === "tarot") {
 return (
 <div className="flex flex-wrap gap-2">
 {meta.cards.map((c) => (
 <div
 key={c.id}
 className={`rounded-lg border px-3 py-2 text-center text-xs ${c.reversed ? "border-amber-900/40 bg-amber-950/20" : "border-default bg-[color:var(--accent-soft)]"}`}
 >
 <div className="font-medium text-primary">{c.name}</div>
 <div className="text-tertiary">{c.reversed ? "Reversed" : "Upright"}</div>
 {c.position ? <div className="text-tertiary">{c.position}</div> : null}
 </div>
 ))}
 </div>
 );
 }
 if (meta.type === "rune") {
 return (
 <div className="flex flex-wrap gap-3">
 {meta.runes.map((r) => (
 <div key={r.id} className="rounded-lg border border-default bg-[color:var(--accent-soft)] px-4 py-3 text-center">
 <div className="text-3xl text-primary">{r.glyph}</div>
 <div className="mt-1 text-sm font-medium">{r.name}</div>
 <div className="text-xs text-tertiary">{r.merkstave ? "Merkstave" : "Upright"}</div>
 </div>
 ))}
 </div>
 );
 }
 return null;
}

export function ReadingStreamPanel(props: { type: ReadingType }) {
 const config = CONFIGS[props.type];
 const [values, setValues] = useState<Record<string, string>>({
 spread: "three",
 cast: "three",
 dominantHand: "right",
 });
 const [loading, setLoading] = useState(false);
 const [meta, setMeta] = useState<ReadingMeta | null>(null);
 const [text, setText] = useState("");
 const [error, setError] = useState<string | null>(null);

 async function onSubmit(e: React.FormEvent) {
 e.preventDefault();
 setLoading(true);
 setError(null);
 setText("");
 setMeta(null);
 try {
 await streamMerlianReading(
 props.type,
 values,
 (chunk) => setText((prev) => prev + chunk),
 setMeta,
 );
 } catch (err) {
 setError(err instanceof Error ? err.message : "Reading failed.");
 } finally {
 setLoading(false);
 }
 }

 return (
 <div className="space-y-6">
 <div>
 <h2 className="heading-premium">{config.title}</h2>
 <p className="body-muted mt-1 text-sm">{config.blurb}</p>
 </div>

 <form onSubmit={onSubmit} className="space-y-4">
 {config.fields.map((field) => (
 <label key={field.key} className="block text-sm">
 <span className="text-tertiary">{field.label}</span>
 {field.type === "textarea" ? (
 <textarea
 required={field.required}
 rows={4}
 className="arcana-input mt-1 w-full rounded-xl border border-default p-3"
 placeholder={field.placeholder}
 value={values[field.key] ?? ""}
 onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
 />
 ) : field.type === "select" ? (
 <select
 className="arcana-input mt-1 w-full px-3 py-2"
 value={values[field.key] ?? field.options?.[0]?.value}
 onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
 >
 {field.options.map((o) => (
 <option key={o.value} value={o.value}>
 {o.label}
 </option>
 ))}
 </select>
 ) : (
 <input
 type="text"
 className="arcana-input mt-1 w-full px-3 py-2"
 placeholder={field.placeholder}
 value={values[field.key] ?? ""}
 onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
 />
 )}
 </label>
 ))}
 <button type="submit" className="btn-premium inline-flex items-center gap-2" disabled={loading}>
 {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
 {loading ? "Reading…" : "Draw & interpret"}
 </button>
 </form>

 {error ? <p className="text-sm text-red-400/90">{error}</p> : null}
 {meta ? (
 <div className="glass-inset rounded-xl p-4">
 <MetaDisplay meta={meta} />
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
