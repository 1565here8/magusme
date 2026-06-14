import { Link, useParams } from "react-router-dom";
import { useState, useEffect, useMemo, useCallback } from "react";
import { ArrowLeft, Sparkles, Loader2, Scroll, BookOpen, Moon, Sun, Star, Globe, Heart, Wind, Cloud, Flame, Droplets, Eye, Brain, Music, Coffee, Home, Calendar, Users } from "lucide-react";
import { SeoHead } from "../components/SeoHead";
import { getSystemById, DIVINATION_SYSTEMS, type DivinationSystemDef } from "../../shared/divinationSystems";
import { DivinationPanel } from "../components/merlian/DivinationPanel";
import {
  fetchDivinations,
  type DivinationMethod,
  type DivinationCatalogResponse,
} from "../api/merlianReadingsClient";
import {
  MerlianPersonalProfilePanel,
  useMerlianPersonalProfile,
  profileToApiPayload,
} from "../components/merlian/MerlianPersonalProfilePanel";

const CATEGORY_STYLES: Record<string, { from: string; via: string; icon: React.ReactNode; label: string }> = {
  "Cartomancy": { from: "from-indigo-900/10", via: "via-purple-900/5", icon: <Scroll className="h-3.5 w-3.5" />, label: "Card & Tile" },
  "Cleromancy & Sortilege": { from: "from-amber-900/10", via: "via-orange-900/5", icon: <Star className="h-3.5 w-3.5" />, label: "Lot & Sortilege" },
  "Scrying & Vision": { from: "from-blue-900/10", via: "via-cyan-900/5", icon: <Eye className="h-3.5 w-3.5" />, label: "Scrying & Vision" },
  "Physiognomy & Body": { from: "from-rose-900/10", via: "via-pink-900/5", icon: <Brain className="h-3.5 w-3.5" />, label: "Body Signs" },
  "Tasseography & Food": { from: "from-emerald-900/10", via: "via-teal-900/5", icon: <Coffee className="h-3.5 w-3.5" />, label: "Cup & Plate" },
  "Numerology & Onomancy": { from: "from-violet-900/10", via: "via-purple-900/5", icon: <Sun className="h-3.5 w-3.5" />, label: "Numbers & Names" },
  "Bibliomancy & Sacred Text": { from: "from-yellow-900/10", via: "via-amber-900/5", icon: <BookOpen className="h-3.5 w-3.5" />, label: "Sacred Words" },
  "Oneiromancy & Trance": { from: "from-sky-900/10", via: "via-blue-900/5", icon: <Moon className="h-3.5 w-3.5" />, label: "Dream & Trance" },
  "Natural Omens": { from: "from-green-900/10", via: "via-lime-900/5", icon: <Wind className="h-3.5 w-3.5" />, label: "Nature Signs" },
  "Spirit & Mediumship": { from: "from-fuchsia-900/10", via: "via-purple-900/5", icon: <Heart className="h-3.5 w-3.5" />, label: "Spirit Contact" },
  "Ceremonial Oracle": { from: "from-red-900/10", via: "via-rose-900/5", icon: <Flame className="h-3.5 w-3.5" />, label: "Ritual Oracle" },
  "Astronomical": { from: "from-sky-900/10", via: "via-indigo-900/5", icon: <Globe className="h-3.5 w-3.5" />, label: "Astral & Sky" },
  "Indian Traditions": { from: "from-orange-900/10", via: "via-red-900/5", icon: <Sun className="h-3.5 w-3.5" />, label: "Indian" },
  "Chinese Traditions": { from: "from-red-900/10", via: "via-yellow-900/5", icon: <Home className="h-3.5 w-3.5" />, label: "Chinese" },
  "Japanese Traditions": { from: "from-pink-900/10", via: "via-rose-900/5", icon: <Cloud className="h-3.5 w-3.5" />, label: "Japanese" },
  "Meditation & Relaxation": { from: "from-teal-900/10", via: "via-emerald-900/5", icon: <Moon className="h-3.5 w-3.5" />, label: "Stillness" },
  "Practical Kabbalah": { from: "from-red-900/20", via: "via-rose-900/10", icon: <Flame className="h-3.5 w-3.5" />, label: "Kabbalah" },
};

export function GenericDivinationPage({ systemId }: { systemId?: string }) {
  const params = useParams();
  const id = systemId ?? params.systemId ?? "";

  const [catalog, setCatalog] = useState<DivinationCatalogResponse | null>(null);
  const [method, setMethod] = useState<DivinationMethod | null>(null);
  const [loading, setLoading] = useState(true);
  const [drawing, setDrawing] = useState(false);
  const { profile, saveProfile, expanded, setExpanded, hasPersonalization, updateField } = useMerlianPersonalProfile();

  const systemDef = getSystemById(id) ?? DIVINATION_SYSTEMS.find((s) => s.route === `/consult/${id}`) ?? null;
  const category = systemDef?.category ?? method?.category ?? "Divination";
  const style = CATEGORY_STYLES[category] ?? { from: "from-purple-900/10", via: "via-purple-900/5", icon: <Sparkles className="h-3.5 w-3.5" />, label: "Divination" };

  useEffect(() => {
    fetchDivinations()
      .then((data) => {
        setCatalog(data);
        const match = data.catalog.find(
          (m) => m.id === id || m.id === systemDef?.id,
        );
        setMethod(match ?? null);
      })
      .catch(() => null)
      .finally(() => setLoading(false));
  }, [id]);

  const handleDraw = useCallback(() => {
    setDrawing(true);
    setTimeout(() => setDrawing(false), 800);
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
      </div>
    );
  }

  const displayName = systemDef?.label ?? method?.label ?? id;
  const displayBlurb = systemDef?.description ?? method?.blurb ?? "";
  const displayTradition = systemDef?.tradition ?? method?.tradition;
  const iconName = systemDef?.icon ?? "Sparkles";

  return (
    <div className="min-h-screen">
      <SeoHead title={systemDef ? `${systemDef.label} · ${systemDef.category} Reading` : "Divination Reading"} description={systemDef ? `${systemDef.label}: ${systemDef.description}` : "Divination reading with multiple esoteric systems."} path={systemId ? `/consult/${systemId}` : "/consult"} />
      {/* Themed header */}
      <section className={`relative border-b border-white/5 ${style.from} ${style.via}`}>
        <div className={`absolute inset-0 bg-gradient-to-b ${style.from} ${style.via} to-transparent`} />
        <div className="relative mx-auto max-w-4xl px-5 py-8 md:px-8 md:py-12">
          <Link
            to="/consult"
            className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-zinc-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all divination methods
          </Link>

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-1.5 text-sm text-zinc-300">
            {style.icon}
            {category}
          </div>

          <h1 className="font-serif text-3xl font-bold text-white md:text-4xl">
            {displayName}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-zinc-400">
            {displayBlurb}
          </p>
          {displayTradition && (
            <p className="mt-2 text-xs uppercase tracking-wider text-zinc-600">
              Tradition: {displayTradition}
            </p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-8 md:px-8">
        <MerlianPersonalProfilePanel
          profile={profile}
          onChange={saveProfile}
          expanded={expanded}
          onToggle={() => setExpanded(!expanded)}
          hasPersonalization={hasPersonalization}
        />

        {/* Draw animation overlay */}
        {drawing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="animate-pulse text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-amber-600">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
              <p className="font-serif text-xl text-white">Drawing {displayName}...</p>
            </div>
          </div>
        )}

        {method ? (
          <div className="mt-8">
            {/* Animated draw button */}
            <div className="mb-6 text-center">
              <button
                onClick={handleDraw}
                className="inline-flex items-center gap-2 rounded-xl bg-white/[0.05] px-6 py-3 text-sm text-zinc-400 transition hover:bg-white/[0.08] hover:text-zinc-200"
              >
                <Sparkles className={`h-4 w-4 transition ${drawing ? "animate-spin text-amber-400" : ""}`} />
                Open {displayName} Divination
              </button>
            </div>
            <DivinationPanel
              method={method}
              personalization={hasPersonalization ? profileToApiPayload(profile) : undefined}
              profile={profile}
            />
          </div>
        ) : (
          <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.02] p-12 text-center">
            <Sparkles className="mx-auto mb-4 h-8 w-8 text-zinc-600" />
            <p className="text-zinc-500">
              {displayName} is being prepared.
            </p>
            <Link
              to="/consult"
              className="mt-4 inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300"
            >
              Browse available methods →
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
