import React from "react";
import { Link, Outlet } from "react-router-dom";
import { MagusMeHeader } from "../components/MagusMeHeader";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100">
      <MagusMeHeader />
      <main className="relative">
        {children}
      </main>
      <footer className="border-t border-white/5 bg-[#09090b]">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-4 px-5 py-8 md:flex-row md:items-center md:px-8">
          <p className="text-sm text-zinc-500">
            🔮 MagusMe. The Vault of Everything Occult
          </p>
          <div className="flex items-center gap-6 text-sm">
            <Link className="font-medium text-zinc-500 transition hover:text-zinc-300" to="/terms">
              Terms
            </Link>
            <Link className="font-medium text-zinc-500 transition hover:text-zinc-300" to="/privacy">
              Privacy
            </Link>
            <Link className="font-medium text-zinc-500 transition hover:text-zinc-300" to="/references">
              References
            </Link>
            <Link className="font-medium text-zinc-500 transition hover:text-zinc-300" to="/admin">
              Admin
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
