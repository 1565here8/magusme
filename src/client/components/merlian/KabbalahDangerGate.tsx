import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { AlertTriangle, ShieldAlert } from "lucide-react";

import {
  KABBALAH_USER_ACKNOWLEDGMENT,
  KABBALAH_USER_DANGER_INTRO,
} from "../../../shared/kabbalahDivinations";

type Props = {
  methodLabel: string;
  acknowledged: boolean;
  onAcknowledge: (value: boolean) => void;
};

export function KabbalahDangerGate({ methodLabel, acknowledged, onAcknowledge }: Props) {
  return (
    <div className="space-y-5 rounded-2xl border border-red-900/40 bg-red-950/20 p-6">
      <div className="flex items-start gap-3">
        <ShieldAlert className="mt-0.5 h-7 w-7 shrink-0 text-red-400" strokeWidth={1.5} />
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-400/90">
            Practical Kabbalah · highest caution
          </p>
          <h3 className="mt-2 text-xl font-semibold text-red-100">{methodLabel}</h3>
        </div>
      </div>

      <div className="prose-luxury rounded-xl border border-red-900/30 bg-black/40 p-4 text-sm text-red-100/80">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{KABBALAH_USER_DANGER_INTRO}</ReactMarkdown>
      </div>

      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-red-900/35 bg-red-950/30 p-4">
        <input
          type="checkbox"
          className="mt-1 accent-red-500"
          checked={acknowledged}
          onChange={(e) => onAcknowledge(e.target.checked)}
        />
        <span className="text-sm text-red-100/85">{KABBALAH_USER_ACKNOWLEDGMENT}</span>
      </label>

      {!acknowledged ? (
        <p className="flex items-center gap-2 text-sm text-red-300/85">
          <AlertTriangle className="h-4 w-4" />
          Acknowledge the warning to open this reading.
        </p>
      ) : null}
    </div>
  );
}
