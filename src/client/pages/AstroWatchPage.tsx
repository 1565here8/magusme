import { Link } from "react-router-dom";
import { ArrowLeft, Clock } from "lucide-react";
import { SeoHead } from "../components/SeoHead";
import { AstroWatch } from "../components/merlian/AstroWatch";

export default function AstroWatchPage() {
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
      <section className="mx-auto max-w-6xl px-5 py-8 md:px-8">
        <AstroWatch />
      </section>
    </div>
  );
}
