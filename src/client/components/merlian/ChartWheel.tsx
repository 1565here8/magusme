import React from "react";

import type { NatalChart, PlanetPosition } from "../../api/merlianReadingsClient";

const SIGN_COLORS: Record<string, string> = {
  Aries: "#e85d5d",
  Taurus: "#6b9e6b",
  Gemini: "#c9a962",
  Cancer: "#6b8cae",
  Leo: "#d4a017",
  Virgo: "#8b7355",
  Libra: "#c9a962",
  Scorpio: "#8b2942",
  Sagittarius: "#7b5ea7",
  Capricorn: "#4a5568",
  Aquarius: "#5b8def",
  Pisces: "#6b8cae",
};

function planetAngle(longitude: number, ascendantLon: number) {
  const diff = (((longitude - ascendantLon) % 360) + 360) % 360;
  return ((180 - diff) * Math.PI) / 180;
}

export function ChartWheel(props: { chart: NatalChart | { ascendant: { longitude: number }; planets: PlanetPosition[] }; size?: number }) {
  const size = props.size ?? 320;
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size * 0.46;
  const innerR = size * 0.28;
  const ascLon = props.chart.ascendant.longitude;

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="merlian-chart-wheel mx-auto w-full max-w-sm" aria-label="Natal chart wheel">
      <circle cx={cx} cy={cy} r={outerR} fill="none" stroke="var(--border-strong)" strokeWidth="1" />
      <circle cx={cx} cy={cy} r={innerR} fill="none" stroke="var(--border)" strokeWidth="1" />

      {Array.from({ length: 12 }, (_, i) => {
        const houseLon = (ascLon + i * 30) % 360;
        const a = planetAngle(houseLon, ascLon);
        const x1 = cx + innerR * Math.cos(a);
        const y1 = cy + innerR * Math.sin(a);
        const x2 = cx + outerR * Math.cos(a);
        const y2 = cy + outerR * Math.sin(a);
        const sign = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"][
          Math.floor(houseLon / 30)
        ]!;
        const labelA = planetAngle(houseLon + 15, ascLon);
        const lx = cx + (outerR + 14) * Math.cos(labelA);
        const ly = cy + (outerR + 14) * Math.sin(labelA);
        return (
          <g key={i}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--border)" strokeWidth="1" />
            <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" fill={SIGN_COLORS[sign] ?? "#888"} fontSize="8" opacity={0.85}>
              {i + 1}
            </text>
          </g>
        );
      })}

      <text x={cx - outerR - 8} y={cy} textAnchor="end" dominantBaseline="middle" fill="var(--accent)" fontSize="9">
        ASC
      </text>
      <text x={cx} y={cy - outerR - 8} textAnchor="middle" fill="var(--accent)" fontSize="9">
        MC
      </text>

      {props.chart.planets.map((p) => {
        const a = planetAngle(p.longitude, ascLon);
        const r = (innerR + outerR) / 2;
        const px = cx + r * Math.cos(a);
        const py = cy + r * Math.sin(a);
        return (
          <g key={p.body}>
            <circle cx={px} cy={py} r="5" fill={SIGN_COLORS[p.sign.sign] ?? "var(--accent)"} opacity={0.9} />
            <text x={px} y={py - 8} textAnchor="middle" fill="var(--text-primary)" fontSize="7">
              {p.body.slice(0, 2)}
              {p.retrograde ? "℞" : ""}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
