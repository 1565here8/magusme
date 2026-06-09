import React, { useEffect, useMemo, useState } from "react";
import { BookOpen, ChevronRight, Loader2, Search, Sparkles } from "lucide-react";

import { bootstrapSession } from "../../api/apiClient";
import {
  fetchDivinations,
  type DivinationCatalogResponse,
  type DivinationMethod,
} from "../../api/merlianReadingsClient";
import { AstroWatch } from "./AstroWatch";
import { NatalChartPanel } from "./NatalChartPanel";
import { DeepAstroProfilePanel } from "./DeepAstroProfilePanel";
import { DivinationPanel } from "./DivinationPanel";
import {
  MerlianPersonalProfilePanel,
  useMerlianPersonalProfile,
  profileToApiPayload,
} from "./MerlianPersonalProfilePanel";
import { SpectrumBadge, SpectrumDot, SpectrumLegend } from "./SpectrumBadge";
import {
  resolveCategoryLabelSpectrum,
  resolveDivinationSpectrum,
  spectrumTierClass,
} from "../../../shared/merlianSpectrum";
import { KabbalahDangerGate } from "./KabbalahDangerGate";
import { isKabbalahDivinationId } from "../../../shared/kabbalahDivinations";

export function MerlianFreeReadings() {
  const [catalog, setCatalog] = useState<DivinationCatalogResponse | null>(null);
  const [activeId, setActiveId] = useState("watch");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sessionReady, setSessionReady] = useState(false);
  const [kabbalahAcked, setKabbalahAcked] = useState(false);
  const { profile, saveProfile, expanded, setExpanded, hasPersonalization } = useMerlianPersonalProfile();
  const personalizationPayload = profileToApiPayload(profile);

  useEffect(() => {
    bootstrapSession()
      .then(() => setSessionReady(true))
      .catch(() => setSessionReady(false));
    fetchDivinations().then(setCatalog).catch(() => null);
  }, []);

  const filtered = useMemo(() => {
    if (!catalog?.catalog?.length) return [];
    const q = search.trim().toLowerCase();
    if (!q) return catalog.catalog;
    return catalog.catalog.filter(
      (d) =>
        d.label.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q) ||
        d.blurb.toLowerCase().includes(q) ||
        (d.tradition?.toLowerCase().includes(q) ?? false),
    );
  }, [catalog, search]);

  const categories = useMemo(() => {
    if (!catalog?.catalog?.length) return [];
    const set = new Set<string>();
    for (const d of filtered) set.add(d.category);
    return [...set].sort(
      (a, b) => resolveCategoryLabelSpectrum(a).index - resolveCategoryLabelSpectrum(b).index,
    );
  }, [catalog, filtered]);

  const selectedCategory = activeCategory ?? categories[0] ?? null;

  const methodsInCategory = useMemo(() => {
    if (!selectedCategory) return filtered;
    return filtered
      .filter((d) => d.category === selectedCategory)
      .sort(
        (a, b) =>
          resolveDivinationSpectrum(a).index - resolveDivinationSpectrum(b).index ||
          a.label.localeCompare(b.label),
      );
  }, [filtered, selectedCategory]);

  const active = catalog?.catalog.find((d) => d.id === activeId);
  const activeSpectrum = active ? resolveDivinationSpectrum(active) : null;

  useEffect(() => {
    if (methodsInCategory.length && !methodsInCategory.some((m) => m.id === activeId)) {
      setActiveId(methodsInCategory[0]!.id);
    }
  }, [methodsInCategory, activeId]);

  useEffect(() => {
    if (!isKabbalahDivinationId(activeId)) setKabbalahAcked(false);
  }, [activeId]);

  const activeIsKabbalah = isKabbalahDivinationId(activeId);

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="label-premium">Readings &amp; oracles</p>
          <h2 className="heading-premium mt-1 flex items-center gap-2">
            <Sparkles className="icon-accent h-5 w-5" strokeWidth={1.75} />
            Divination Suite
          </h2>
          <p className="body-muted mt-2 max-w-xl">
            {catalog?.total ?? "130+"} methods — sorted by the magic spectrum from white to black.
          </p>
        </div>
        <span className="badge-free shrink-0">100% Free</span>
      </header>

      <SpectrumLegend />

      <MerlianPersonalProfilePanel
        profile={profile}
        expanded={expanded}
        onToggle={() => setExpanded(!expanded)}
        onChange={saveProfile}
        hasPersonalization={hasPersonalization}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,260px)_1fr]">
        {/* Sidebar — Apple Settings-style navigation */}
        <aside className="glass-inset flex max-h-[min(70vh,640px)] flex-col overflow-hidden p-0">
          <div className="border-b border-[color:var(--border)] p-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--text-tertiary)]" />
              <input
                type="search"
                placeholder="Search methods…"
                className="input-field py-2 pl-9 text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden">
            <div className="w-[42%] shrink-0 overflow-y-auto border-r border-[color:var(--border)] p-2 merlian-divination-menu">
              {categories.map((cat) => {
                const catSpec = resolveCategoryLabelSpectrum(cat);
                return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={cx(
                    "spectrum-sidebar-item mb-0.5 justify-between",
                    spectrumTierClass(catSpec.tier),
                    selectedCategory === cat && "spectrum-sidebar-item-active",
                  )}
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <SpectrumDot meta={catSpec} />
                    <span className="truncate text-xs">{cat}</span>
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-50" />
                </button>
              );})}
            </div>

            <div className="flex-1 overflow-y-auto p-2 merlian-divination-menu">
              {!catalog ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="icon-accent h-5 w-5 animate-spin opacity-50" />
                </div>
              ) : (
                methodsInCategory.map((d) => {
                  const methodSpec = resolveDivinationSpectrum(d);
                  return (
                  <button
                    key={d.id}
                    type="button"
                    title={d.blurb}
                    onClick={() => setActiveId(d.id)}
                    className={cx(
                      "spectrum-sidebar-item mb-0.5",
                      spectrumTierClass(methodSpec.tier),
                      activeId === d.id && "spectrum-sidebar-item-active",
                    )}
                  >
                    <SpectrumDot meta={methodSpec} className="mr-1" />
                    {d.label}
                  </button>
                );})
              )}
            </div>
          </div>
        </aside>

        {/* Main panel */}
        <div className="glass-panel min-h-[420px]">
          {!catalog ? (
            <div className="flex h-full min-h-[320px] items-center justify-center">
              <Loader2 className="icon-accent h-6 w-6 animate-spin opacity-50" />
            </div>
          ) : active ? (
            <div className="space-y-6">
              <div
                className={cx(
                  "spectrum-panel-header pb-5",
                  activeSpectrum && spectrumTierClass(activeSpectrum.tier),
                )}
              >
                {activeSpectrum ? <SpectrumBadge meta={activeSpectrum} className="mb-3" /> : null}
                <p className="text-xs font-medium text-[color:var(--text-tertiary)]">{active.category}</p>
                <h3 className="mt-1 text-2xl font-semibold tracking-tight text-[color:var(--text-primary)]">
                  {active.label}
                </h3>
                <p className="body-muted mt-2">{active.blurb}</p>
                {active.tradition ? (
                  <p className="mt-2 text-xs text-[color:var(--text-tertiary)]">{active.tradition}</p>
                ) : null}
              </div>

              {active.mode === "astro_watch" ? <AstroWatch /> : null}
              {active.mode === "astro_natal" ? <NatalChartPanel /> : null}
              {active.mode === "astro_deep" ? (
                <DeepAstroProfilePanel profile={profile} personalizationPayload={personalizationPayload} />
              ) : null}
              {active && !["astro_watch", "astro_natal", "astro_deep"].includes(active.mode) ? (
                activeIsKabbalah && !kabbalahAcked ? (
                  <KabbalahDangerGate
                    methodLabel={active.label}
                    acknowledged={kabbalahAcked}
                    onAcknowledge={setKabbalahAcked}
                  />
                ) : sessionReady ? (
                  <DivinationPanel method={active} personalization={personalizationPayload} profile={profile} />
                ) : (
                  <p className="body-muted">Connecting session for private AI readings…</p>
                )
              ) : null}
            </div>
          ) : (
            <p className="body-muted">Select a method from the sidebar.</p>
          )}
        </div>
      </div>

      <div className="callout-info flex gap-3">
        <BookOpen className="icon-accent mt-0.5 h-4 w-4 shrink-0" />
        <p>
          Magubrain indexes magic and wisdom traditions worldwide.{" "}
          <strong className="text-[color:var(--text-primary)]">Practical Kabbalah</strong> is in the menu above — more dangerous than most other practices; you must accept the warning before each session.
        </p>
      </div>
    </section>
  );
}
