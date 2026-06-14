export const ALLMAGUS_NAME = "MagusMe";
export const ALLMAGUS_DOMAIN = "magusme.com";
export const ALLMAGUS_TAGLINE = "The Vault of Everything Occult";

export const allmagusRoutesShared = {
  home: "/allmagus",
  cloud: "/allmagus/cloud",
  pocket: "/allmagus/pocket",
  corporate: "/allmagus/corporate",
  merlian: "/merlian",
} as const;

export const allmagusRoutesOnDomain = {
  home: "/",
  cloud: "/cloud",
  pocket: "/pocket",
  corporate: "/corporate",
  merlian: "/",
} as const;

export type AllMagusRoutes = { readonly [K in keyof typeof allmagusRoutesShared]: string };

function brandFromHost(hostname: string): string | null {
  const host = hostname.replace(/^www\./i, "").toLowerCase();
  if (host === ALLMAGUS_DOMAIN) return "allmagus";
  return null;
}

export function allmagusRoutesFor(hostname?: string): AllMagusRoutes {
  const host = hostname ?? (typeof window !== "undefined" ? window.location.hostname : "");
  return brandFromHost(host) === "allmagus" ? allmagusRoutesOnDomain : allmagusRoutesShared;
}

export const allmagusRoutes = new Proxy(allmagusRoutesShared, {
  get(_target, prop: keyof AllMagusRoutes) {
    return allmagusRoutesFor()[prop];
  },
}) as AllMagusRoutes;

export function isAllMagusPath(pathname: string, hostname?: string) {
  const routes = allmagusRoutesFor(hostname);
  if (pathname === routes.home || pathname === routes.merlian) return true;
  if (
    pathname === routes.cloud ||
    pathname === routes.pocket ||
    pathname === routes.corporate
  ) {
    return true;
  }
  return pathname.startsWith("/allmagus") || pathname.startsWith("/merlian");
}
