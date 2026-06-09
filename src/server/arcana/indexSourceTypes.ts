/** Shared indexer source shape — avoids circular imports between indexSources and globalMagicSources. */
export type IndexSource = {
  id: string;
  name: string;
  url: string;
  institution: string;
  /** Internet Archive search query or collection id */
  archiveQuery?: string;
  priority: number;
  traditions: string[];
};

export function dedupeIndexSources(sources: IndexSource[]): IndexSource[] {
  const seen = new Set<string>();
  return sources.filter((s) => {
    if (seen.has(s.id)) return false;
    seen.add(s.id);
    return true;
  });
}
