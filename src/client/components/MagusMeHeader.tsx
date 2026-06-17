import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { clsx } from "clsx";
import { Sparkles, BookOpen, Wand2, Clock, Menu, User, BookMarked, LayoutDashboard, Store } from "lucide-react";
import { LoginModal } from "./LoginModal";

const NAV_ITEMS = [
  { path: "/", label: "Home", icon: Sparkles, exact: true },
  { path: "/consult", label: "Consult", icon: Sparkles },
  { path: "/learn", label: "Learn", icon: BookOpen },
  { path: "/marketplace", label: "Shop", icon: Store },
  { path: "/create", label: "Create", icon: Wand2 },
  { path: "/tools", label: "Tools", icon: Clock },
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/references", label: "References", icon: BookMarked },
];

export function MagusMeHeader() {
  const { pathname } = useLocation();
  const [loginOpen, setLoginOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  function handleSignOut() {
    fetch("/api/auth/logout", { method: "POST", credentials: "include" })
      .catch(() => null)
      .finally(() => setIsLoggedIn(false));
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#09090b]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🔮</span>
            <span className="font-serif text-xl font-bold tracking-tight text-white">
              Magus<span className="text-purple-400">Me</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map((item) => {
              const isActive = item.exact
                ? pathname === item.path
                : pathname.startsWith(item.path) && item.path !== "/";
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={clsx(
                    "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-purple-500/20 text-purple-300"
                      : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
            <div className="ml-2 flex items-center gap-2 border-l border-white/10 pl-4">
              {isLoggedIn ? (
                <div className="flex items-center gap-2">
                  <Link
                    to="/human-map"
                    className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-400 transition hover:border-white/20"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="text-xs text-zinc-500 transition hover:text-zinc-300"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setLoginOpen(true)}
                  className="rounded-full bg-purple-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-purple-500"
                >
                  Sign In
                </button>
              )}
            </div>
          </nav>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-400 transition hover:border-white/20 md:hidden"
          >
            <Menu className="h-4 w-4" />
            Menu
          </button>
        </div>

        {mobileOpen && (
          <div className="border-t border-white/10 bg-[#09090b] md:hidden">
            <div className="space-y-1 px-5 py-4">
              {NAV_ITEMS.map((item) => {
                const isActive = item.exact
                  ? pathname === item.path
                  : pathname.startsWith(item.path) && item.path !== "/";
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={clsx(
                      "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition",
                      isActive
                        ? "bg-purple-500/20 text-purple-300"
                        : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200",
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
              <hr className="border-white/10" />
              {isLoggedIn ? (
                <>
                  <Link
                    to="/human-map"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-zinc-400 transition hover:bg-white/5 hover:text-zinc-200"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                  <button
                    onClick={() => { handleSignOut(); setMobileOpen(false); }}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-zinc-500 transition hover:bg-white/5 hover:text-zinc-300"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { setLoginOpen(true); setMobileOpen(false); }}
                  className="flex w-full items-center gap-3 rounded-xl bg-purple-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-purple-500"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
