import React from "react";

import {
  getSpectrumMeta,
  spectrumTierClass,
  type SpectrumMeta,
  type SpectrumTier,
} from "../../../shared/merlianSpectrum";
import { cx } from "../../utils/classnames";

export function SpectrumDot(props: { meta: SpectrumMeta; className?: string }) {
  return (
    <span
      className={cx("spectrum-dot shrink-0", spectrumTierClass(props.meta.tier), props.className)}
      title={`${props.meta.label} — ${props.meta.hint}`}
      aria-hidden
    />
  );
}

export function SpectrumBadge(props: {
  meta: SpectrumMeta;
  compact?: boolean;
  className?: string;
}) {
  const { meta, compact } = props;
  return (
    <span
      className={cx(
        "spectrum-badge inline-flex items-center gap-1.5",
        spectrumTierClass(meta.tier),
        compact && "spectrum-badge-compact",
        props.className,
      )}
      title={meta.hint}
    >
      <SpectrumDot meta={meta} />
      {!compact ? (
        <>
          <span className="spectrum-badge-label">{meta.label}</span>
          <span className="spectrum-badge-family">{meta.family}</span>
        </>
      ) : null}
    </span>
  );
}

export function SpectrumLegend(props: { className?: string }) {
  const tiers: SpectrumTier[] = [
    "pure_white",
    "pearl",
    "angelic",
    "celestial",
    "nature",
    "cultural",
    "oracle",
    "spirit",
    "passion",
    "folk",
    "warrior",
    "orisha",
    "kabbalah",
    "death",
    "black",
    "infernal",
  ];

  return (
    <div className={cx("spectrum-legend", props.className)}>
      <p className="label-premium mb-2">Magic spectrum — white to black</p>
      <div className="spectrum-legend-track" aria-label="Magic color spectrum from white to black">
        {tiers.map((tier) => {
          const meta = getSpectrumMeta(tier);
          return (
            <div
              key={tier}
              className={cx("spectrum-legend-segment", spectrumTierClass(tier))}
              title={`${meta.index}. ${meta.label}: ${meta.hint}`}
            >
              <span className="spectrum-legend-index">{meta.index}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-tertiary">
        <span>0–1 harmless</span>
        <span>2–3 divine / sky</span>
        <span>4–7 earth &amp; spirits</span>
        <span>8–11 entity &amp; folk</span>
        <span>12–15 vault &amp; dark</span>
      </div>
    </div>
  );
}
