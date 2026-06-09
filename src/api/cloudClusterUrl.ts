export function defaultCloudBridgeUrl(): string {
  const port = process.env.PORT ?? "3001";
  return `http://127.0.0.1:${port}/api/cloud/infer`;
}

/** Resolves where Cloud mode sends queries (online no-training cluster). */
export function resolvePrivateClusterUrl(): string | undefined {
  const explicit = process.env.PRIVATE_CLUSTER_URL?.trim();
  if (explicit) return explicit;

  if (process.env.CLOUD_NO_TRAINING_ACTIVE?.trim().toLowerCase() === "true") {
    return defaultCloudBridgeUrl();
  }

  return undefined;
}

export function isCloudNoTrainingBridgeActive(): boolean {
  const url = resolvePrivateClusterUrl();
  return Boolean(url?.includes("/api/cloud/infer"));
}
