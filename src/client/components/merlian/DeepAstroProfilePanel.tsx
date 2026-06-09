import React, { useEffect, useState } from "react";
import { Loader2, MapPin, Sparkles, Star } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
 fetchDeepAstroProfile,
 streamDivination,
 type DeepAstroProfile,
 type MerlianPersonalizationPayload,
} from "../../api/merlianReadingsClient";
import { ChartWheel } from "./ChartWheel";
import type { MerlianPersonalProfile } from "./useMerlianPersonalProfile";

export function DeepAstroProfilePanel(props: {
 profile?: MerlianPersonalProfile;
 personalizationPayload?: MerlianPersonalizationPayload;
}) {
 const { profile: savedProfile, personalizationPayload } = props;
 const [birthDate, setBirthDate] = useState(savedProfile?.birthDate ?? "");
 const [birthTime, setBirthTime] = useState(savedProfile?.birthTime ?? "");
 const [fullName, setFullName] = useState(savedProfile?.fullName ?? "");
 const [lat, setLat] = useState(savedProfile?.lat ?? "40.7128");
 const [lon, setLon] = useState(savedProfile?.lon ?? "-74.006");
 const [astroProfile, setAstroProfile] = useState<DeepAstroProfile | null>(null);
 const [loading, setLoading] = useState(false);
 const [aiText, setAiText] = useState("");
 const [aiLoading, setAiLoading] = useState(false);
 const [error, setError] = useState<string | null>(null);

 useEffect(() => {
 if (!savedProfile) return;
 if (savedProfile.birthDate) setBirthDate(savedProfile.birthDate);
 if (savedProfile.birthTime) setBirthTime(savedProfile.birthTime);
 if (savedProfile.fullName) setFullName(savedProfile.fullName);
 if (savedProfile.lat) setLat(savedProfile.lat);
 if (savedProfile.lon) setLon(savedProfile.lon);
 }, [savedProfile]);

 function useMyLocation() {
 navigator.geolocation?.getCurrentPosition((pos) => {
 setLat(String(pos.coords.latitude));
 setLon(String(pos.coords.longitude));
 });
 }

 async function onSubmit(e: React.FormEvent) {
 e.preventDefault();
 if (!birthDate || !fullName.trim()) return;
 setLoading(true);
 setError(null);
 setAiText("");
 try {
 const result = await fetchDeepAstroProfile({
 birthDate,
 birthTime: birthTime || undefined,
 fullName: fullName.trim(),
 lat: Number(lat),
 lon: Number(lon),
 });
 setAstroProfile(result);
 } catch (err) {
 setError(err instanceof Error ? err.message : "Profile failed.");
 } finally {
 setLoading(false);
 }
 }

 async function getAiSynthesis() {
 if (!astroProfile) return;
 setAiLoading(true);
 setAiText("");
 setError(null);
 try {
 const snapshot = JSON.stringify(
 {
 summary: astroProfile.summary,
 sunSign: astroProfile.sunSign,
 moonSign: astroProfile.moonSign,
 risingSign: astroProfile.risingSign,
 numerology: astroProfile.numerology,
 chineseZodiac: astroProfile.chineseZodiac,
 chartRuler: astroProfile.chartRuler,
 dominantElement: astroProfile.dominantElement,
 personalYear: astroProfile.personalYear,
 nameAstroHarmony: astroProfile.nameAstroHarmony,
 manifestationProfile: astroProfile.manifestationProfile,
 aspects: astroProfile.aspects.slice(0, 6),
 },
 null,
 2,
 );
 await streamDivination(
 {
 divinationId: "manifest_loa",
 question: `Deep cosmic profile synthesis for ${astroProfile.fullName} — personalized manifestation path using my chart, culture, destination, and growth areas.`,
 description: snapshot,
 ...personalizationPayload,
 },
 (chunk) => setAiText((prev) => prev + chunk),
 );
 } catch (err) {
 setError(err instanceof Error ? err.message : "AI synthesis failed.");
 } finally {
 setAiLoading(false);
 }
 }

 return (
 <div className="space-y-6">
 <div>
 <h2 className="heading-premium flex items-center gap-2">
 <Star className="icon-accent h-5 w-5" strokeWidth={1.5} />
 Deep Cosmic Profile
 </h2>
 <p className="body-muted mt-1 text-sm">
 Natal chart + numerology + name letter map + Chinese zodiac + aspects + manifestation profile — from DOB &amp; full name
 </p>
 </div>

 <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
 <label className="block text-sm sm:col-span-2 lg:col-span-3">
 <span className="text-tertiary">Full birth name</span>
 <input
 required
 className="input-field mt-1"
 value={fullName}
 onChange={(e) => setFullName(e.target.value)}
 placeholder="As on birth certificate"
 />
 </label>
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
 <div className="flex flex-wrap items-end gap-2 sm:col-span-2 lg:col-span-3">
 <button type="button" className="btn-premium-ghost text-sm" onClick={useMyLocation}>
 <MapPin className="mr-1 inline h-3.5 w-3.5" />
 Use my location
 </button>
 <button type="submit" className="btn-premium inline-flex items-center gap-2" disabled={loading}>
 {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
 Generate deep profile
 </button>
 </div>
 </form>

 {error ? <p className="text-sm text-red-400/90">{error}</p> : null}

 {astroProfile ? (
 <div className="space-y-8">
 <p className="rounded-xl border border-default bg-[color:var(--accent-soft)] p-4 text-sm text-primary">
 {astroProfile.summary}
 </p>

 <div className="grid gap-8 lg:grid-cols-[minmax(0,340px)_1fr]">
 <ChartWheel chart={astroProfile.natal} />
 <div className="space-y-4">
 <div className="glass-inset rounded-xl p-4">
 <div className="text-xs uppercase text-tertiary">Big three + chart ruler</div>
 <div className="mt-2 grid gap-1 text-sm text-primary sm:grid-cols-2">
 <div>Sun: {astroProfile.sunSign}</div>
 <div>Moon: {astroProfile.moonSign}</div>
 <div>Rising: {astroProfile.risingSign}</div>
 <div>Chart ruler: {astroProfile.chartRuler.planet}</div>
 <div>Chinese: {astroProfile.chineseZodiac.label}</div>
 <div>Personal year {astroProfile.personalYear.number}: {astroProfile.personalYear.theme}</div>
 </div>
 </div>

 <div className="glass-inset rounded-xl p-4">
 <div className="text-xs uppercase text-tertiary">Numerology (name + DOB)</div>
 <div className="mt-2 grid gap-1 text-sm text-primary sm:grid-cols-2">
 <div>Life Path: <strong>{astroProfile.numerology.lifePath.number}</strong></div>
 <div>Expression: <strong>{astroProfile.numerology.expression.number}</strong></div>
 <div>Soul Urge: <strong>{astroProfile.numerology.soulUrge.number}</strong></div>
 <div>Personality: <strong>{astroProfile.numerology.personality.number}</strong></div>
 </div>
 <p className="mt-2 text-xs text-tertiary">{astroProfile.nameAstroHarmony.synthesis}</p>
 </div>

 <div className="glass-inset rounded-xl p-4">
 <div className="text-xs uppercase text-tertiary">Dominant element &amp; modality</div>
 <div className="mt-2 text-sm text-primary">
 {astroProfile.dominantElement.element} ({astroProfile.dominantElement.count} planets: {astroProfile.dominantElement.planets.join(", ")})
 <br />
 {astroProfile.dominantModality.modality} ({astroProfile.dominantModality.count} planets)
 </div>
 </div>

 {astroProfile.aspects.length > 0 ? (
 <div className="glass-inset rounded-xl p-4">
 <div className="text-xs uppercase text-tertiary mb-2">Major aspects</div>
 <ul className="space-y-1 text-xs text-secondary">
 {astroProfile.aspects.map((a) => (
 <li key={a.interpretation}>{a.interpretation}</li>
 ))}
 </ul>
 </div>
 ) : null}

 <div className="glass-inset rounded-xl p-4">
 <div className="text-xs uppercase text-tertiary mb-2">Manifestation profile</div>
 <div className="text-sm text-primary space-y-2">
 <div>
 <span className="text-emerald-400/80">Strengths:</span>{" "}
 {astroProfile.manifestationProfile.strengths.join(" · ")}
 </div>
 {astroProfile.manifestationProfile.challenges.length > 0 ? (
 <div>
 <span className="text-amber-400/80">Watch:</span>{" "}
 {astroProfile.manifestationProfile.challenges.join(" · ")}
 </div>
 ) : null}
 <div>
 <span className="text-accent">Best techniques:</span>{" "}
 {astroProfile.manifestationProfile.recommendedPractices.join(", ")}
 </div>
 </div>
 </div>
 </div>
 </div>

 <div>
 <button
 type="button"
 className="btn-premium inline-flex items-center gap-2"
 onClick={getAiSynthesis}
 disabled={aiLoading}
 >
 {aiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
 AI manifestation synthesis
 </button>
 </div>

 {aiText ? (
 <div className="glass-panel prose-luxury">
 <ReactMarkdown remarkPlugins={[remarkGfm]}>{aiText}</ReactMarkdown>
 </div>
 ) : null}
 </div>
 ) : null}
 </div>
 );
}
