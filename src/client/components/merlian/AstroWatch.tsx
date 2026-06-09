import React, { useCallback, useEffect, useState } from "react";
import { Clock, Loader2, MapPin, RefreshCw } from "lucide-react";

import { fetchAstroNow, type AstroSnapshot } from "../../api/merlianReadingsClient";

const DEFAULT = { lat: 40.7128, lon: -74.006, label: "New York" };

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function AstroWatch() {
  const [coords, setCoords] = useState(DEFAULT);
  const [snapshot, setSnapshot] = useState<AstroSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clock, setClock] = useState(new Date());

  const load = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAstroNow({ ...coords, signal });
      setSnapshot(data);
    } catch (err) {
      if (signal?.aborted) return;
      setError(err instanceof Error ? err.message : "Could not load sky data.");
    } finally {
      setLoading(false);
    }
  }, [coords]);

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    const poll = setInterval(() => load(), 60_000);
    return () => {
      controller.abort();
      clearInterval(poll);
    };
  }, [load]);

  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  function useMyLocation() {
    if (!navigator.geolocation) {
      setError("Geolocation not available in this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          label: "Your location",
        });
      },
      () => setError("Location permission denied."),
    );
  }

  const hour = snapshot?.planetaryHours.current;
  const progress = hour?.progress ?? 0;

  return (
    <div className="merlian-watch space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="heading-premium flex items-center gap-2">
            <Clock className="icon-accent h-5 w-5" strokeWidth={1.5} />
            Astronomical Watch
          </h2>
          <p className="body-muted mt-1 text-sm">
            Live planetary hours, moon phase, houses &amp; sky — free
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-premium-ghost text-sm" onClick={useMyLocation}>
            <MapPin className="mr-1.5 inline h-3.5 w-3.5" />
            My location
          </button>
          <button type="button" className="btn-premium-ghost text-sm" onClick={() => load()} disabled={loading}>
            <RefreshCw className={`mr-1.5 inline h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {error ? <p className="text-sm text-red-400/90">{error}</p> : null}

      {loading && !snapshot ? (
        <div className="flex justify-center py-12">
          <Loader2 className="icon-accent h-8 w-8 animate-spin opacity-60" />
        </div>
      ) : null}

      {snapshot ? (
        <>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,280px)_1fr]">
            <div className="merlian-watch-face mx-auto flex aspect-square w-full max-w-[280px] flex-col items-center justify-center rounded-full p-6">
              <div className="text-xs uppercase tracking-widest text-[color:var(--text-tertiary)]">Local time</div>
              <div className="mt-1 font-mono text-3xl tabular-nums text-[color:var(--text-primary)]">
                {clock.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </div>
              <div className="mt-4 text-center">
                <div className="text-4xl">{snapshot.moon.emoji}</div>
                <div className="mt-2 text-sm font-medium text-accent">{snapshot.moon.name}</div>
                <div className="text-xs text-tertiary">
                  Moon in {snapshot.moon.sign} · {snapshot.moon.ageDays}d old
                </div>
              </div>
              <div className="mt-4 w-full">
                <div className="text-center text-xs uppercase tracking-wider text-tertiary">Planetary hour</div>
                <div className="mt-1 text-center text-lg font-semibold text-primary">{hour?.ruler}</div>
                <div className="mt-1 text-center text-xs text-tertiary">
                  {hour?.minutesRemaining ?? 0} min left · {hour?.isDay ? "Day" : "Night"} hour {hour?.index}
                </div>
                <div className="progress-track mt-3 h-1.5">
                  <div
                    className="progress-fill transition-all duration-1000"
                    style={{ width: `${Math.round(progress * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="glass-inset rounded-xl p-4">
                  <div className="text-xs uppercase tracking-wider text-tertiary">Day ruler</div>
                  <div className="mt-1 text-lg text-primary">{snapshot.planetaryHours.dayRuler}</div>
                  <div className="mt-2 text-xs text-tertiary">{snapshot.planetaryHours.weekday}</div>
                </div>
                <div className="glass-inset rounded-xl p-4">
                  <div className="text-xs uppercase tracking-wider text-tertiary">Hour correspondence</div>
                  <div className="mt-2 space-y-1 text-xs text-secondary">
                    <div>Metal: {snapshot.correspondences.currentHourRuler.metal}</div>
                    <div>Color: {snapshot.correspondences.currentHourRuler.color}</div>
                    <div>Scent: {snapshot.correspondences.currentHourRuler.scent}</div>
                  </div>
                </div>
                <div className="glass-inset rounded-xl p-4">
                  <div className="text-xs uppercase tracking-wider text-tertiary">Sunrise / Sunset</div>
                  <div className="mt-2 text-sm text-primary">
                    ↑ {formatTime(snapshot.planetaryHours.sunrise)} · ↓ {formatTime(snapshot.planetaryHours.sunset)}
                  </div>
                </div>
                <div className="glass-inset rounded-xl p-4">
                  <div className="text-xs uppercase tracking-wider text-tertiary">Angles</div>
                  <div className="mt-2 text-sm text-primary">
                    ASC {snapshot.ascendant.label}
                    <br />
                    MC {snapshot.midheaven.label}
                  </div>
                </div>
              </div>

              <div className="glass-inset overflow-x-auto rounded-xl p-4">
                <div className="text-xs uppercase tracking-wider text-tertiary mb-3">Planets &amp; houses (now)</div>
                <table className="w-full min-w-[320px] text-left text-sm">
                  <thead>
                    <tr className="text-xs text-tertiary">
                      <th className="pb-2 pr-4">Body</th>
                      <th className="pb-2 pr-4">Sign</th>
                      <th className="pb-2">House</th>
                    </tr>
                  </thead>
                  <tbody className="text-primary">
                    {snapshot.planets.map((p) => (
                      <tr key={p.body} className="border-t border-default">
                        <td className="py-1.5 pr-4 font-medium">
                          {p.body}
                          {p.retrograde ? <span className="ml-1 text-amber-500/80">℞</span> : null}
                        </td>
                        <td className="py-1.5 pr-4">{p.sign.label}</td>
                        <td className="py-1.5">{p.house ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <details className="glass-inset rounded-xl p-4">
            <summary className="cursor-pointer text-sm font-medium text-secondary">
              Full planetary hour schedule (12 day + 12 night)
            </summary>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <div className="text-xs uppercase text-tertiary mb-2">Day hours</div>
                <ul className="space-y-1 text-xs text-secondary">
                  {snapshot.planetaryHours.dayHours.map((h) => (
                    <li key={`d-${h.index}`} className={h.ruler === hour?.ruler && h.isDay ? "text-accent" : ""}>
                      {h.index}. {h.ruler} — {formatTime(h.start)}–{formatTime(h.end)}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-xs uppercase text-tertiary mb-2">Night hours</div>
                <ul className="space-y-1 text-xs text-secondary">
                  {snapshot.planetaryHours.nightHours.map((h) => (
                    <li key={`n-${h.index}`} className={h.ruler === hour?.ruler && !h.isDay ? "text-accent" : ""}>
                      {h.index}. {h.ruler} — {formatTime(h.start)}–{formatTime(h.end)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </details>

          <p className="text-xs text-tertiary">
            Location: {coords.label ?? `${coords.lat.toFixed(2)}, ${coords.lon.toFixed(2)}`} · Equal houses ·
            Updated {new Date(snapshot.timestamp).toLocaleTimeString()}
          </p>
        </>
      ) : null}
    </div>
  );
}
