export type MeshTextStreamOptions = {
  controllerSignal?: AbortSignal;
};

export function isMeshComputeConfigured(): boolean {
  if (process.env.MESH_COMPUTE_ENABLED === "false") return false;
  return Boolean(process.env.MESH_COMPUTE_URL?.trim());
}

export function meshComputeAvailability(): { available: boolean; reason?: string } {
  if (process.env.MESH_COMPUTE_ENABLED === "false") {
    return { available: false, reason: "mesh_compute_disabled" };
  }
  if (!process.env.MESH_COMPUTE_URL?.trim()) {
    return { available: false, reason: "mesh_compute_url_not_configured" };
  }
  return { available: true };
}

export async function* meshComputeTextStream(
  query: string,
  options: MeshTextStreamOptions = {},
): AsyncGenerator<string> {
  const availability = meshComputeAvailability();
  if (!availability.available) {
    throw new Error(
      availability.reason === "mesh_compute_disabled"
        ? "Mesh compute is disabled on this deployment."
        : "Mesh compute is not configured. Set MESH_COMPUTE_URL.",
    );
  }

  const baseUrl = process.env.MESH_COMPUTE_URL!.trim();
  const response = await fetch(baseUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    signal: options.controllerSignal,
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    const bodyText = await response.text().catch(() => "");
    throw new Error(`Mesh upstream error ${response.status}: ${bodyText || response.statusText}`);
  }

  if (!response.body) {
    yield await response.text();
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    yield decoder.decode(value, { stream: true });
  }
}

/** @deprecated Use meshComputeTextStream */
export const p2pMeshTextStream = meshComputeTextStream;
