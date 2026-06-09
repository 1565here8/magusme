export type NetworkCoreMode = "cloud" | "local" | "mesh";

export const networkCoreModes: Array<{
  id: NetworkCoreMode;
  label: string;
}> = [
  { id: "cloud", label: "CLOUD" },
  { id: "local", label: "LOCAL" },
  { id: "mesh", label: "MESH" },
];

export function modeFromPath(pathname: string): NetworkCoreMode {
  if (pathname.includes("/3modeai/local") || pathname === "/local" || pathname.startsWith("/local/"))
    return "local";
  if (pathname.includes("/3modeai/mesh") || pathname === "/mesh" || pathname.startsWith("/mesh/"))
    return "mesh";
  return "cloud";
}

