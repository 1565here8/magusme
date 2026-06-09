import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "merlian_personal_profile_v1";

export type MerlianPersonalProfile = {
  fullName: string;
  birthDate: string;
  birthTime: string;
  lat: string;
  lon: string;
  culturalBackground: string;
  heritageCommunity: string;
  destinationPlace: string;
  growthAreas: string;
  includeTarotAnchor: boolean;
};

export const EMPTY_MERLIAN_PROFILE: MerlianPersonalProfile = {
  fullName: "",
  birthDate: "",
  birthTime: "",
  lat: "40.7128",
  lon: "-74.006",
  culturalBackground: "",
  heritageCommunity: "",
  destinationPlace: "",
  growthAreas: "",
  includeTarotAnchor: true,
};

function loadProfile(): MerlianPersonalProfile {
  if (typeof window === "undefined") return EMPTY_MERLIAN_PROFILE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_MERLIAN_PROFILE;
    return { ...EMPTY_MERLIAN_PROFILE, ...JSON.parse(raw) };
  } catch {
    return EMPTY_MERLIAN_PROFILE;
  }
}

export function profileToApiPayload(profile: MerlianPersonalProfile) {
  const hasAny =
    profile.fullName.trim() ||
    profile.birthDate.trim() ||
    profile.culturalBackground.trim() ||
    profile.heritageCommunity.trim() ||
    profile.destinationPlace.trim() ||
    profile.growthAreas.trim();

  if (!hasAny) return undefined;

  return {
    fullName: profile.fullName.trim() || undefined,
    birthDate: profile.birthDate || undefined,
    birthTime: profile.birthTime || undefined,
    lat: profile.lat ? Number(profile.lat) : undefined,
    lon: profile.lon ? Number(profile.lon) : undefined,
    culturalBackground: profile.culturalBackground.trim() || undefined,
    heritageCommunity: profile.heritageCommunity.trim() || undefined,
    destinationPlace: profile.destinationPlace.trim() || undefined,
    growthAreas: profile.growthAreas.trim() || undefined,
    includeTarotAnchor: profile.includeTarotAnchor,
  };
}

export function useMerlianPersonalProfile() {
  const [profile, setProfile] = useState<MerlianPersonalProfile>(EMPTY_MERLIAN_PROFILE);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setProfile(loadProfile());
    const hasSaved = Boolean(localStorage.getItem(STORAGE_KEY));
    setExpanded(!hasSaved);
  }, []);

  const saveProfile = useCallback((next: MerlianPersonalProfile) => {
    setProfile(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const updateField = useCallback(
    <K extends keyof MerlianPersonalProfile>(key: K, value: MerlianPersonalProfile[K]) => {
      setProfile((prev) => {
        const next = { ...prev, [key]: value };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    },
    [],
  );

  const hasPersonalization = Boolean(
    profile.fullName.trim() ||
      profile.birthDate.trim() ||
      profile.culturalBackground.trim() ||
      profile.heritageCommunity.trim() ||
      profile.destinationPlace.trim() ||
      profile.growthAreas.trim(),
  );

  return { profile, saveProfile, updateField, expanded, setExpanded, hasPersonalization };
}
