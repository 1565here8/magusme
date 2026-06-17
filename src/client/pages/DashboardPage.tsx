import { useState } from "react";
import { Link } from "react-router-dom";
import { User, Coins, Calendar, MessageSquare, BookOpen, LogOut, Loader2, ArrowRight } from "lucide-react";
import { useSession } from "../context/SessionContext";
import { SeoHead } from "../components/SeoHead";

export function DashboardPage() {
  const { user, authenticated, loading, error, createSession, refresh } = useSession();
  const [creating, setCreating] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
      </div>
    );
  }

  if (!authenticated || !user) {
    return (
      <div className="mx-auto max-w-4xl px-5 py-20 text-center md:px-8">
        <SeoHead title="Dashboard" description="Your MagusMe account dashboard." path="/dashboard" />
        <div className="mb-4 text-6xl">🔮</div>
        <h1 className="mb-4 font-serif text-2xl font-bold text-white">Session Required</h1>
        <p className="mb-8 text-zinc-400">Create a free session to track your reading history, saved spells, and token balance.</p>
        <button
          onClick={async () => {
            setCreating(true);
            try { await createSession(); } catch { /* handled by context */ }
            setCreating(false);
          }}
          disabled={creating}
          className="inline-flex items-center gap-2 rounded-full bg-purple-600 px-8 py-3 text-sm font-medium text-white transition hover:bg-purple-500 disabled:opacity-50"
        >
          {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Create Free Session
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SeoHead title="Dashboard" description={`Welcome, ${user.id.slice(0, 8)}. manage your MagusMe session.`} path="/dashboard" />
      <section className="relative border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-indigo-900/5 to-transparent" />
        <div className="relative mx-auto max-w-4xl px-5 py-12 md:px-8 md:py-16">
          <h1 className="font-serif text-3xl font-bold text-white">Dashboard</h1>
          <p className="mt-2 text-zinc-400">Manage your session and activity.</p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-8 md:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="rounded-lg bg-purple-500/10 p-2">
                <User className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <div className="text-xs text-zinc-500">User ID</div>
                <div className="text-sm font-mono text-zinc-300">{user.id.slice(0, 12)}...</div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="rounded-lg bg-emerald-500/10 p-2">
                <Coins className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <div className="text-xs text-zinc-500">Token Balance</div>
                <div className="text-2xl font-bold text-white">{user.tokens}</div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="rounded-lg bg-amber-500/10 p-2">
                <Calendar className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <div className="text-xs text-zinc-500">Created</div>
                <div className="text-sm text-zinc-300">{new Date(user.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Link to="/learn" className="group rounded-xl border border-white/10 bg-white/[0.02] p-5 transition hover:border-emerald-500/30">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="h-5 w-5 text-emerald-400" />
              <h2 className="font-serif text-lg font-bold text-white">Browse Spells</h2>
            </div>
            <p className="text-sm text-zinc-500">Explore the grimoire of 990+ verified spells.</p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs text-emerald-400 opacity-0 transition-opacity group-hover:opacity-100">
              Browse <ArrowRight className="h-3 w-3" />
            </span>
          </Link>

          <Link to="/references" className="group rounded-xl border border-white/10 bg-white/[0.02] p-5 transition hover:border-purple-500/30">
            <div className="flex items-center gap-3 mb-2">
              <MessageSquare className="h-5 w-5 text-purple-400" />
              <h2 className="font-serif text-lg font-bold text-white">References</h2>
            </div>
            <p className="text-sm text-zinc-500">View external sources and attributions.</p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs text-purple-400 opacity-0 transition-opacity group-hover:opacity-100">
              View <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
