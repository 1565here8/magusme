import React, { useEffect } from "react";

export function PaywallGate(props: {
  tokens: number;
  sessionActive?: boolean;
  topUpUrl?: string | null;
  children: React.ReactNode;
  lockedTitle?: string;
}) {
  const locked = (props.sessionActive ?? true) && props.tokens <= 0;

  useEffect(() => {
    if (!locked) return;
    document.body.classList.add("nc-paywall-blur");
    return () => document.body.classList.remove("nc-paywall-blur");
  }, [locked]);

  return (
    <div>
      <div>{props.children}</div>
      {locked ? (
        <div className="fixed inset-0 z-50">
          <div className="h-full w-full bg-black/70 backdrop-blur-md" />
          <div className="absolute inset-0 grid place-items-center p-8">
            <div className="ambient-depth glass-panel glass-panel-lg w-full max-w-xl">
              <div className="label-premium text-[#C9A962]/80">
                {props.lockedTitle ?? "Free tier used up"}
              </div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                Unlock more
              </h2>
              <p className="body-muted mt-6">
                Your session tokens are depleted. Local AI still runs on your
                machine — you only pay for platform access after the included
                allowance.
              </p>
              {props.topUpUrl ? (
                <a
                  href={props.topUpUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-premium mt-8 inline-block"
                >
                  Continue with payment
                </a>
              ) : (
                <p className="body-muted mt-6 text-sm">
                  Set <code className="text-zinc-400">EXTERNAL_BILLING_URL</code>{" "}
                  in server <code className="text-zinc-400">.env</code> (Stripe
                  checkout, etc.) to enable self-service top-up.
                </p>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
