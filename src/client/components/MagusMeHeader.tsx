import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { clsx } from "clsx";
import { Sparkles, BookOpen, Wand2, Clock, Search, User, LogOut } from "lucide-react";
import { LoginModal } from "./LoginModal";

const NAV_ITEMS = [
  { path: "/", label: "Home", icon: Sparkles, exact: true },
  { path: "/consult", label: "Consult", icon: Sparkles },
  { path: "/learn", label: "Learn", icon: BookOpen },
  { path: "/create", label: "Create", icon: Wand2 },
  { path: "/tools", label: "Tools", icon: Clock },
];

export function MagusMeHeader() {
  const { pathname } = useLocation();
  const [loginOpen, setLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
                <button className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-400 transition hover:border-white/20">
                  <User className="h-4 w-4" />
                  Profile
                </button>
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

          <button className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-400 md:hidden">
            <Search className="h-4 w-4" />
            Menu
          </button>
        </div>
      </header>

      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
