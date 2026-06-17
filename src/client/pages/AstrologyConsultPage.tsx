import { Stars } from "lucide-react";
import { AstroWatch } from "../components/merlian/AstroWatch";
import { NatalChartPanel } from "../components/merlian/NatalChartPanel";
import { DeepAstroProfilePanel } from "../components/merlian/DeepAstroProfilePanel";
import { SeoHead } from "../components/SeoHead";

export default function AstrologyConsultPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-5 py-10 md:px-8">
      <SeoHead title="Astrology · Natal Charts & Transits" description="Western, Vedic, and Chinese BaZi astrology. Live sky snapshots, natal charts, transits, deep cosmic profiles, and compatibility analysis." path="/consult/astrology" />
      <section className="glass-panel glass-panel-lg text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-500/10">
          <Stars className="h-8 w-8 text-sky-400" strokeWidth={1.5} />
        </div>
        <h1 className="font-serif text-3xl font-bold text-white">Astrology</h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-zinc-400">
          Western, Vedic, Chinese BaZi. live sky, natal charts, transits, and deep cosmic profiles.
        </p>
      </section>

      <AstroWatch />
      <NatalChartPanel />
      <DeepAstroProfilePanel />
    </div>
  );
}
