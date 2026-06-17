import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Clock, Loader2 } from "lucide-react";
import { SeoHead } from "../components/SeoHead";
import { AstroWatch } from "../components/merlian/AstroWatch";
import { CelestialSphere } from "../components/merlian/CelestialSphere";
import { fetchAstroNow, type AstroSnapshot } from "../api/merlianReadingsClient";

export default function AstroWatchPage() {
  const [snapshot, setSnapshot] = useState<AstroSnapshot | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAstroNow({ lat: 40.7128, lon: -74.006 });
      setSnapshot(data);
    } catch {} finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); const t = setInterval(load, 60000); return () => clearInterval(t); }, [load]);

  return (
    <div className="min-h-screen">
      <SeoHead title="Astro Watch · Live Sky Dashboard" description="Real-time planetary positions, moon phase, and astrological data for your current location." path="/astro-watch" />
      <section className="relative border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-900/10 via-blue-900/5 to-transparent" />
        <div className="relative mx-auto max-w-6xl px-5 py-12 text-center md:px-8 md:py-16">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-4 py-1.5 text-sm text-sky-300">
            <Clock className="h-3.5 w-3.5" />
            Live Sky Data
          </div>
          <h1 className="font-serif text-3xl font-bold text-white md:text-4xl">
            Astro Watch. Live Sky Dashboard
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-zinc-400">
            Real-time planetary positions, moon phase, and astrological data for your location.
          </p>
          <Link
            to="/consult"
            className="mt-6 inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-zinc-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all divination methods
          </Link>
        </div>
      </section>

      {loading && !snapshot ? (
        <section className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-sky-400/60" />
        </section>
      ) : null}

      {snapshot ? (
        <section className="mx-auto max-w-6xl px-5 py-8 md:px-8">
          <div className="mb-8 flex justify-center">
            <div className="rounded-2xl border border-white/5 bg-black/40 p-4 backdrop-blur-sm">
              <CelestialSphere snapshot={snapshot} size={440} />
            </div>
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-6xl px-5 py-8 md:px-8">
        <AstroWatch />
      </section>
    </div>
  );
}
