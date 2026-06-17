import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { AlertTriangle, Lock, Scale, Shield } from "lucide-react";
import type { ArcanaPrivacyManifest } from "../../api/arcanaClient";

export function ArcanaPrivacyShield(props: { privacy: ArcanaPrivacyManifest | null }) {
  const p = props.privacy;
  if (!p) return null;

  return (
    <div className="rounded-xl border border-emerald-900/30 bg-emerald-950/15 p-5">
      <div className="flex items-start gap-3">
        <Shield className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500/80" strokeWidth={1.5} />
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-emerald-400/90">
            {p.privateCloud ? "Private Cloud AI (your VPS)" : "Private Local AI"}
          </h3>
          <ul className="mt-3 space-y-1.5 text-xs text-zinc-400">
            <li className="flex items-center gap-2">
              <Lock className="h-3 w-3 text-emerald-600" />
              Mode: <span className="text-zinc-300">{p.llmMode}</span> ·{" "}
              <span className="font-mono text-zinc-300">{p.llmModel}</span>
            </li>
            <li className="font-mono text-[11px] text-zinc-500">{p.llmHost}</li>
            <li>Streaming: {p.streamingEnabled ? "On ✓ (faster feel)" : "Off"}</li>
            <li>Prompts to public AI vendors: No ✓</li>
            <li>Data sold: No ✓</li>
            <li>Used to train models: No ✓</li>
            {p.minimalLogging ? <li>Minimal local logging: On ✓</li> : null}
          </ul>
          {!p.secureDefaults ? (
            <p className="mt-3 text-xs text-amber-500/90">
              Warning: LLM is not on localhost. Set OLLAMA_HOST=http://127.0.0.1:11434 for maximum
              privacy.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function ArcanaDisclaimerBanner(props: { disclaimer: string }) {
  return (
    <div className="arcana-disclaimer rounded-xl border border-amber-900/30 bg-amber-950/20 p-5">
      <div className="flex items-start gap-3">
        <Scale className="mt-0.5 h-5 w-5 shrink-0 text-amber-500/80" strokeWidth={1.5} />
        <div className="prose-luxury min-w-0 text-sm">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{props.disclaimer}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

export function ArcanaSpellFooter() {
  return (
    <div className="arcana-spell-footer mt-8 rounded-lg border border-amber-900/20 bg-amber-950/10 p-5 text-xs leading-relaxed text-zinc-500">
      <AlertTriangle className="mb-2 h-4 w-4 text-amber-600/70" />
      <p className="font-medium text-amber-600/80">Entertainment & curio only</p>
      <p className="mt-2">
        This spell is reproduced from traceable historical sources for curiosity and amusement. not
        as advice to perform against any person. Merlian and its operators{" "}
        <strong className="text-zinc-400">deny all liability</strong> for backlash, injury, legal
        consequences, or any outcome. You chose to read this; we are not responsible for what you do
        with it.
      </p>
    </div>
  );
}

export function BacklashPanel(props: { backlash: string; alternatives: string }) {
  if (!props.backlash && !props.alternatives) return null;
  return (
    <div className="mt-4 space-y-4 rounded-xl border border-red-900/20 bg-red-950/10 p-4">
      {props.backlash ? (
        <div>
          <h4 className="text-xs font-medium uppercase tracking-wider text-red-400/80">
            Magical Warnings & Backlash
          </h4>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">{props.backlash}</p>
        </div>
      ) : null}
      {props.alternatives ? (
        <div>
          <h4 className="text-xs font-medium uppercase tracking-wider text-emerald-500/80">
            Non-Harmful Options That Work
          </h4>
          <div className="prose-luxury mt-2 text-sm">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{props.alternatives}</ReactMarkdown>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function PathChoiceModal(props: {
  open: boolean;
  title: string;
  onPeaceful: () => void;
  onViolent: () => void;
  onClose: () => void;
  loading?: boolean;
  acknowledgment: string;
}) {
  const [accepted, setAccepted] = React.useState(false);
  if (!props.open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={props.onClose} />
      <div className="arcana-path-modal relative z-10 w-full max-w-lg rounded-2xl border border-white/[0.06] bg-[#030303] p-8">
        <h3 className="text-xl font-semibold text-[#E8D5A3]">How do you want to proceed?</h3>
        <p className="body-muted mt-2">
          <strong className="text-zinc-300">{props.title}</strong>. we strongly recommend the
          non-harmful path first. The tradition document is curio/entertainment only.
        </p>

        <div className="mt-4 flex items-start gap-2 rounded-lg border border-emerald-900/30 bg-emerald-950/20 p-3 text-sm text-emerald-400/90">
          <Shield className="mt-0.5 h-4 w-4 shrink-0" />
          Reversal & mirror-return work without directing harm at anyone.
        </div>

        <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-lg border border-white/[0.04] p-4">
          <input
            type="checkbox"
            className="mt-1"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
          />
          <span className="text-sm text-zinc-400">{props.acknowledgment}</span>
        </label>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            className="btn-premium-ghost py-4 text-emerald-400/90"
            disabled={!accepted || props.loading}
            onClick={props.onPeaceful}
          >
            Reversal & Protection
            <span className="mt-1 block text-xs font-normal text-zinc-500">Recommended</span>
          </button>
          <button
            type="button"
            className="btn-premium border-red-900/30 py-4 text-red-400/90"
            disabled={!accepted || props.loading}
            onClick={props.onViolent}
          >
            Tradition Document
            <span className="mt-1 block text-xs font-normal text-zinc-500">Curio / folklore</span>
          </button>
        </div>
        <button
          type="button"
          className="mt-4 w-full text-sm text-zinc-600 hover:text-zinc-400"
          onClick={props.onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
