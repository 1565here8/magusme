import React from "react";
import { useSession } from "../context/SessionContext";

export function ServerConnectionBanner() {
  const { error, user, creating, refresh, createSession } = useSession();

  if (!error || user) return null;

  return (
    <div className="border-b border-amber-500/30 bg-amber-950/40 px-6 py-3 text-center text-sm text-amber-100">
      <p>
        <strong>Connection issue.</strong> {error}
      </p>
      <div className="mt-3 flex justify-center gap-3">
        <button
          type="button"
          className="btn-premium text-xs"
          onClick={() => void refresh()}
        >
          Retry
        </button>
        <button
          type="button"
          className="btn-premium text-xs"
          disabled={creating}
          onClick={() => void createSession()}
        >
          {creating ? "Connecting\u2026" : "Create session"}
        </button>
      </div>
    </div>
  );
}
