import React from "react";
import { Monitor, Moon, Sun } from "lucide-react";

import { useTheme, type ThemeMode } from "../context/ThemeContext";

const options: { id: ThemeMode; icon: React.ReactNode; label: string }[] = [
  { id: "light", icon: <Sun className="h-3.5 w-3.5" strokeWidth={2} />, label: "Light" },
  { id: "dark", icon: <Moon className="h-3.5 w-3.5" strokeWidth={2} />, label: "Dark" },
  { id: "system", icon: <Monitor className="h-3.5 w-3.5" strokeWidth={2} />, label: "Auto" },
];

export function ThemeToggle() {
  const { mode, setMode } = useTheme();

  return (
    <div
      className="inline-flex rounded-full border border-[color:var(--border)] bg-[color:var(--surface-inset)] p-0.5"
      role="group"
      aria-label="Appearance"
    >
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          title={opt.label}
          aria-pressed={mode === opt.id}
          onClick={() => setMode(opt.id)}
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
            mode === opt.id
              ? "bg-[color:var(--surface-elevated)] text-[color:var(--text-primary)] shadow-sm"
              : "text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]"
          }`}
        >
          {opt.icon}
          <span className="hidden sm:inline">{opt.label}</span>
        </button>
      ))}
    </div>
  );
}
