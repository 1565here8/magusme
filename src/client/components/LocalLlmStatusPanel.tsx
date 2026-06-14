import React, { useEffect, useState } from "react";
import { Cpu, Download, RefreshCw } from "lucide-react";
import { fetchOllamaStatus, type OllamaStatus } from "../api/apiClient";

export function LocalLlmStatusPanel() {
  const [status, setStatus] = useState<OllamaStatus | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      setStatus(await fetchOllamaStatus());
    } catch {
      setStatus(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const ready = status?.reachable && !status.error;

  return (
    <div className="glass-panel">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Cpu className="icon-gold mt-0.5 h-5 w-5 shrink-0" strokeWidth={1.5} />
          <div>
            <div className="label-premium">Offline LLM Engine</div>
            <p className="body-muted mt-2">
              {loading
                ? "Checking\u2026"
                : ready
                  ? `Online \u2014 model ${status?.model}`
                  : (status?.error ?? "Ollama not running")}
            </p>
          </div>
        </div>
        <button
          type="button"
          className="btn-premium text-xs"
          onClick={() => void load()}
        >
          <RefreshCw className="mr-1 inline h-3 w-3" />
          Refresh
        </button>
      </div>

      {!loading && !ready ? (
        <div className="mt-6 rounded-lg border border-amber-500/20 bg-amber-950/30 p-4 text-sm text-amber-100">
          <p className="flex items-center gap-2 font-medium">
            <Download className="h-4 w-4" />
            One-time setup
          </p>
          <p className="mt-2 text-amber-200/90">
            Run a local LLM (Ollama) for private, offline readings.
          </p>
        </div>
      ) : null}
    </div>
  );
}
