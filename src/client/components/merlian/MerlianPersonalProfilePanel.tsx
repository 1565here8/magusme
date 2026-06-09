import React from "react";
import { ChevronDown, ChevronUp, MapPin, User } from "lucide-react";

import {
 type MerlianPersonalProfile,
 useMerlianPersonalProfile,
} from "./useMerlianPersonalProfile";

export type { MerlianPersonalProfile };
export { useMerlianPersonalProfile, profileToApiPayload } from "./useMerlianPersonalProfile";

type Props = {
 profile: MerlianPersonalProfile;
 expanded: boolean;
 onToggle: () => void;
 onChange: (profile: MerlianPersonalProfile) => void;
 hasPersonalization: boolean;
};

export function MerlianPersonalProfilePanel(props: Props) {
 const { profile, expanded, onToggle, onChange, hasPersonalization } = props;

 function set<K extends keyof MerlianPersonalProfile>(key: K, value: MerlianPersonalProfile[K]) {
 onChange({ ...profile, [key]: value });
 }

 function useMyLocation() {
 navigator.geolocation?.getCurrentPosition((pos) => {
 onChange({
 ...profile,
 lat: String(pos.coords.latitude),
 lon: String(pos.coords.longitude),
 });
 });
 }

 return (
 <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-inset)]">
 <button
 type="button"
 onClick={onToggle}
 className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
 >
 <div className="flex items-center gap-2">
 <User className="h-4 w-4 text-[color:var(--accent)]" strokeWidth={1.5} />
 <span className="text-sm font-medium text-[color:var(--text-primary)]">Your personal profile</span>
 {hasPersonalization ? (
 <span className="rounded-full bg-emerald-950/40 px-2 py-0.5 text-[10px] uppercase tracking-wider text-emerald-400/90">
 AI will personalize
 </span>
 ) : (
 <span className="text-xs text-tertiary">Optional — chart, culture, destination, growth</span>
 )}
 </div>
 {expanded ? (
 <ChevronUp className="h-4 w-4 text-tertiary" />
 ) : (
 <ChevronDown className="h-4 w-4 text-tertiary" />
 )}
 </button>

 {expanded ? (
 <div className="space-y-4 border-t border-default px-4 pb-4 pt-3">
 <p className="text-xs text-tertiary">
 Merlian weaves your astral chart, tarot anchor, cultural background, where you want to go, and what
 you are working on into every AI reading and technique guide.
 </p>

 <div className="grid gap-4 sm:grid-cols-2">
 <label className="block text-sm sm:col-span-2">
 <span className="text-tertiary">Full birth name</span>
 <input
 className="input-field mt-1"
 value={profile.fullName}
 onChange={(e) => set("fullName", e.target.value)}
 placeholder="For numerology & name map"
 />
 </label>
 <label className="block text-sm">
 <span className="text-tertiary">Birth date</span>
 <input
 type="date"
 className="input-field mt-1"
 value={profile.birthDate}
 onChange={(e) => set("birthDate", e.target.value)}
 />
 </label>
 <label className="block text-sm">
 <span className="text-tertiary">Birth time (optional)</span>
 <input
 type="time"
 className="input-field mt-1"
 value={profile.birthTime}
 onChange={(e) => set("birthTime", e.target.value)}
 />
 </label>
 <label className="block text-sm">
 <span className="text-tertiary">Birth latitude</span>
 <input
 type="number"
 step="any"
 className="input-field mt-1"
 value={profile.lat}
 onChange={(e) => set("lat", e.target.value)}
 />
 </label>
 <label className="block text-sm">
 <span className="text-tertiary">Birth longitude</span>
 <input
 type="number"
 step="any"
 className="input-field mt-1"
 value={profile.lon}
 onChange={(e) => set("lon", e.target.value)}
 />
 </label>
 <div className="sm:col-span-2">
 <button type="button" className="btn-premium-ghost text-xs" onClick={useMyLocation}>
 <MapPin className="mr-1 inline h-3 w-3" />
 Use current location for birth place
 </button>
 </div>

 <label className="block text-sm sm:col-span-2">
 <span className="text-tertiary">Cultural background &amp; traditions</span>
 <textarea
 rows={2}
 className="input-field mt-1 p-3"
 value={profile.culturalBackground}
 onChange={(e) => set("culturalBackground", e.target.value)}
 placeholder="Upbringing, spiritual practices, festivals, folk magic you honor…"
 />
 </label>
 <label className="block text-sm sm:col-span-2">
 <span className="text-tertiary">Heritage / community (how you identify)</span>
 <input
 className="input-field mt-1"
 value={profile.heritageCommunity}
 onChange={(e) => set("heritageCommunity", e.target.value)}
 placeholder="Optional — self-described, used respectfully in readings"
 />
 </label>
 <label className="block text-sm sm:col-span-2">
 <span className="text-tertiary">Where you want to go</span>
 <input
 className="input-field mt-1"
 value={profile.destinationPlace}
 onChange={(e) => set("destinationPlace", e.target.value)}
 placeholder="City, country, career path, relationship, spiritual destination…"
 />
 </label>
 <label className="block text-sm sm:col-span-2">
 <span className="text-tertiary">What you need to work on to grow</span>
 <textarea
 rows={2}
 className="input-field mt-1 p-3"
 value={profile.growthAreas}
 onChange={(e) => set("growthAreas", e.target.value)}
 placeholder="Patterns, fears, skills, healing themes…"
 />
 </label>
 <label className="flex items-center gap-2 text-sm sm:col-span-2">
 <input
 type="checkbox"
 checked={profile.includeTarotAnchor}
 onChange={(e) => set("includeTarotAnchor", e.target.checked)}
 className="rounded border-white/20"
 />
 <span className="text-secondary">Draw tarot anchor cards to personalize each AI reading</span>
 </label>
 </div>
 </div>
 ) : null}
 </div>
 );
}
