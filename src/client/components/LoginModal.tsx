import { useState } from "react";
import { X, Sparkles, Eye, EyeOff } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [mode, setMode] = useState<"login" | "register" | "admin">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      if (mode === "admin") {
        const res = await fetch("/api/auth/admin-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
          credentials: "include",
        });
        if (!res.ok) throw new Error("Invalid admin password");
        setStatus("success");
        setMessage("Welcome, Admin.");
        setTimeout(() => { onClose(); window.location.reload(); }, 1000);
        return;
      }

      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/bootstrap";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mode === "login" ? { email, password } : {}),
        credentials: "include",
      });
      if (!res.ok) throw new Error(mode === "login" ? "Invalid credentials" : "Session creation failed");
      setStatus("success");
      setMessage(mode === "login" ? "Welcome back." : "Session created.");
      setTimeout(() => { onClose(); window.location.reload(); }, 1000);
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#09090b] p-8 shadow-2xl">
        <button onClick={onClose} className="absolute right-4 top-4 text-zinc-500 hover:text-white">
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6 text-center">
          <div className="mb-2 text-3xl">🔮</div>
          <h2 className="font-serif text-xl font-bold text-white">Welcome to MagusMe</h2>
          <p className="mt-1 text-sm text-zinc-500">The Vault of Everything Occult</p>
        </div>

        <div className="mb-6 flex rounded-xl border border-white/10 bg-white/[0.02] p-1">
          {["login", "register", "admin"].map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m as typeof mode); setStatus("idle"); }}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
                mode === m ? "bg-purple-500/20 text-purple-300" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {m === "login" ? "Member" : m === "register" ? "Guest" : "Admin"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode !== "admin" && (
            <>
              <div>
                <label className="mb-1 block text-xs text-zinc-500">Email (optional)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none focus:border-purple-500/40"
                />
              </div>
            </>
          )}

          {mode === "admin" ? (
            <div>
              <label className="mb-1 block text-xs text-zinc-500">Admin Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 pr-10 text-sm text-white placeholder-zinc-600 outline-none focus:border-purple-500/40"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          ) : mode === "login" ? (
            <div>
              <label className="mb-1 block text-xs text-zinc-500">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 pr-10 text-sm text-white placeholder-zinc-600 outline-none focus:border-purple-500/40"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          ) : null}

          <button
            type="submit"
            disabled={status === "loading"}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-purple-600 py-3 text-sm font-medium text-white transition hover:bg-purple-500 disabled:opacity-50"
          >
            {status === "loading" ? (
              <Sparkles className="h-4 w-4 animate-spin" />
            ) : mode === "admin" ? (
              "Access Admin Panel"
            ) : mode === "register" ? (
              "Continue as Guest"
            ) : (
              "Sign In"
            )}
          </button>

          {status === "success" && (
            <p className="text-center text-sm text-emerald-400">{message}</p>
          )}
          {status === "error" && (
            <p className="text-center text-sm text-red-400">{message}</p>
          )}
        </form>

        <p className="mt-6 text-center text-[10px] text-zinc-600">
          By continuing, you agree to the Terms of Service and Privacy Policy.
          No data is collected, sold, or used for AI training.
        </p>
      </div>
    </div>
  );
}
