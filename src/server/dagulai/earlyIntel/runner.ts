export function getEarlyIntelRunnerStatus(): { enabled: boolean; pollMs: number } {
  return { enabled: false, pollMs: 0 };
}
export function startEarlyIntelBackgroundJobs(): void {}
export function stopEarlyIntelBackgroundJobs(): void {}
