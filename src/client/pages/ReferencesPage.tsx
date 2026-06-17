import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BookOpen, ExternalLink } from "lucide-react";
import { fetchSpellsWithReferences, type SpellListItem } from "../api/spellsClient";
import { SeoHead } from "../components/SeoHead";

export function ReferencesPage() {
  const [spells, setSpells] = useState<SpellListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSpellsWithReferences()
      .then((res) => { setSpells(res.spells); setTotal(res.total); })
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen">
      <SeoHead title="External References · Source Attribution" description="Browse 300+ verified spells with external source references. books, grimoires, academic papers, and historical records." path="/references" />
      <section className="relative border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-indigo-900/5 to-transparent" />
        <div className="relative mx-auto max-w-4xl px-5 py-12 text-center md:px-8 md:py-16">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-1.5 text-sm text-purple-300">
            <BookOpen className="h-3.5 w-3.5" />
            {total} Referenced Spells
          </div>
          <h1 className="font-serif text-3xl font-bold text-white md:text-4xl">
            External References
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-zinc-400">
            Every spell with a verifiable external source. books, grimoires, academic papers, historical records, and trusted online resources.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-8 md:px-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-500/30 border-t-purple-400" />
          </div>
        ) : spells.length === 0 ? (
          <div className="py-20 text-center text-zinc-500">No referenced spells found.</div>
        ) : (
          <div className="space-y-4">
            {spells.map((spell) => (
              <div key={spell.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <Link to={`/learn/${spell.slug}`} className="font-serif text-lg font-bold text-white hover:text-purple-300 transition">
                      {spell.title}
                    </Link>
                    <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500">
                      <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-emerald-300">{spell.category}</span>
                      {spell.tradition && <span>{spell.tradition}</span>}
                    </div>
                  </div>
                  {spell.reference_link && (
                    <a
                      href={spell.reference_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-2 text-xs text-zinc-400 hover:text-white hover:bg-white/10 transition flex-shrink-0"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Source
                    </a>
                  )}
                </div>
                {spell.summary && (
                  <p className="mt-3 text-sm text-zinc-500 line-clamp-2">{spell.summary}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
