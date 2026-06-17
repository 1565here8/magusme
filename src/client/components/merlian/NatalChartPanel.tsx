import React, { useState } from "react";
import { Loader2, MapPin, Star } from "lucide-react";

import { fetchNatalChart, type NatalChart } from "../../api/merlianReadingsClient";
import { ChartWheel } from "./ChartWheel";

export function NatalChartPanel() {
 const [birthDate, setBirthDate] = useState("");
 const [birthTime, setBirthTime] = useState("");
 const [lat, setLat] = useState("40.7128");
 const [lon, setLon] = useState("-74.006");
 const [chart, setChart] = useState<NatalChart | null>(null);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState<string | null>(null);

 function useMyLocation() {
 navigator.geolocation?.getCurrentPosition((pos) => {
 setLat(String(pos.coords.latitude));
 setLon(String(pos.coords.longitude));
 });
 }

 async function onSubmit(e: React.FormEvent) {
 e.preventDefault();
 if (!birthDate) return;
 setLoading(true);
 setError(null);
 try {
 const result = await fetchNatalChart({
 birthDate,
 birthTime: birthTime || undefined,
 lat: Number(lat),
 lon: Number(lon),
 });
 setChart(result);
 } catch (err) {
 setError(err instanceof Error ? err.message : "Chart failed.");
 } finally {
 setLoading(false);
 }
 }

 return (
 <div className="space-y-6">
 <div>
 <h2 className="heading-premium flex items-center gap-2">
 <Star className="icon-accent h-5 w-5" strokeWidth={1.5} />
 Natal Chart Map
 </h2>
 <p className="body-muted mt-1 text-sm">Free birth chart. planets, houses, ascendant &amp; midheaven</p>
 </div>

 <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
 <label className="block text-sm">
 <span className="text-tertiary">Birth date</span>
 <input
 type="date"
 required
 className="input-field mt-1"
 value={birthDate}
 onChange={(e) => setBirthDate(e.target.value)}
 />
 </label>
 <label className="block text-sm">
 <span className="text-tertiary">Birth time (optional)</span>
 <input
 type="time"
 className="input-field mt-1"
 value={birthTime}
 onChange={(e) => setBirthTime(e.target.value)}
 />
 </label>
 <label className="block text-sm">
 <span className="text-tertiary">Latitude</span>
 <input
 type="number"
 step="any"
 className="input-field mt-1"
 value={lat}
 onChange={(e) => setLat(e.target.value)}
 />
 </label>
 <label className="block text-sm">
 <span className="text-tertiary">Longitude</span>
 <input
 type="number"
 step="any"
 className="input-field mt-1"
 value={lon}
 onChange={(e) => setLon(e.target.value)}
 />
 </label>
 <div className="flex flex-wrap items-end gap-2 sm:col-span-2 lg:col-span-4">
 <button type="button" className="btn-premium-ghost text-sm" onClick={useMyLocation}>
 <MapPin className="mr-1 inline h-3.5 w-3.5" />
 Use my location
 </button>
 <button type="submit" className="btn-premium inline-flex items-center gap-2" disabled={loading}>
 {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
 Generate chart
 </button>
 </div>
 </form>

 {error ? <p className="text-sm text-red-400/90">{error}</p> : null}

 {chart ? (
 <div className="grid gap-8 lg:grid-cols-[minmax(0,340px)_1fr]">
 <ChartWheel chart={chart} />
 <div className="space-y-4">
 {!chart.birth.timeKnown ? (
 <p className="text-sm text-amber-500/80">No birth time. chart uses noon placeholder. Ascendant &amp; houses are approximate.</p>
 ) : null}
 <div className="glass-inset rounded-xl p-4">
 <div className="text-xs uppercase text-tertiary">Angles</div>
 <div className="mt-2 text-sm text-primary">
 Ascendant {chart.ascendant.label}
 <br />
 Midheaven {chart.midheaven.label}
 </div>
 </div>
 <div className="glass-inset overflow-x-auto rounded-xl p-4">
 <table className="w-full min-w-[280px] text-sm">
 <thead>
 <tr className="text-xs text-tertiary">
 <th className="pb-2 text-left">Planet</th>
 <th className="pb-2 text-left">Position</th>
 <th className="pb-2 text-left">House</th>
 </tr>
 </thead>
 <tbody className="text-primary">
 {chart.planets.map((p) => (
 <tr key={p.body} className="border-t border-default">
 <td className="py-1.5">
 {p.body}
 {p.retrograde ? " ℞" : ""}
 </td>
 <td className="py-1.5">{p.sign.label}</td>
 <td className="py-1.5">{p.house}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 <div className="glass-inset rounded-xl p-4">
 <div className="text-xs uppercase text-tertiary mb-2">House cusps (equal)</div>
 <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-secondary sm:grid-cols-3">
 {chart.houses.map((h) => (
 <div key={h.house}>
 H{h.house}: {h.sign.label}
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>
 ) : null}
 </div>
 );
}
