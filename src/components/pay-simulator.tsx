"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { formatINR } from "@/lib/money";

// The UPI moment. In production this is where the gateway SDK opens the app;
// the state machine after that (confirming → confirmed) is identical.
export function PaySimulator({ code, token, attemptId, amountPaise, orderStatus }: {
  code: string; token: string; attemptId: string; amountPaise: number; orderStatus: string;
}) {
  const router = useRouter();
  const [phase, setPhase] = useState<"apps" | "confirming" | "failed">(orderStatus.startsWith("confirm") ? "confirming" : "apps");
  const poll = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (phase !== "confirming") return;
    poll.current = setInterval(async () => {
      const res = await fetch(`/api/orders/${code}/status?t=${token}`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.status === "confirmed" || data.status === "partially_paid") {
        stop();
        router.push(`/track/${token}`);
      }
    }, 1200);
    function stop() { if (poll.current) clearInterval(poll.current); }
    return stop;
  }, [phase, code, token, router]);

  async function decide(outcome: "success" | "failure") {
    setPhase("confirming");
    await fetch("/api/mock-gateway/approve", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ providerOrderId: attemptId, outcome }),
    });
    if (outcome === "failure") {
      setTimeout(() => setPhase("failed"), 1400);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 pt-[calc(var(--header-h)+3rem)] pb-24">
      <div className="panel p-6 text-center">
        <p className="eyebrow text-cocoa-600">B38 Bake House</p>
        <p className="num display-md mt-3">{formatINR(amountPaise)}</p>
        <p className="num mt-1 text-[0.85rem] text-ink-soft">Order {code} · amount locked</p>

        {phase === "apps" && (
          <div className="mt-7">
            <p className="text-[0.92rem] text-ink-soft">Choose a UPI app to approve the payment:</p>
            <div className="mt-4 grid grid-cols-4 gap-3">
              {["GPay", "PhonePe", "Paytm", "BHIM"].map(app => (
                <button
                  key={app}
                  onClick={() => decide("success")}
                  className="border border-line rounded-[4px] py-3 text-[0.8rem] font-medium hover:bg-cream-100 transition-colors"
                >
                  {app}
                </button>
              ))}
            </div>
            <button onClick={() => decide("failure")} className="mt-5 text-[0.82rem] text-ink-soft underline underline-offset-2">
              Simulate a failed payment (demo)
            </button>
            <p className="mt-6 text-[0.75rem] text-ink-soft border-t border-line pt-4">
              Demo gateway: this screen stands in for your UPI app. A real deployment replaces it with the gateway&rsquo;s SDK — the signed-webhook confirmation behind it stays the same.
            </p>
          </div>
        )}

        {phase === "confirming" && (
          <div className="mt-7" role="status">
            <p className="display-sm">Confirming payment…</p>
            <p className="mt-2 text-[0.9rem] text-ink-soft">Don&rsquo;t pay again — we&rsquo;ll take you to your order the moment it lands.</p>
            <div className="mt-5 mx-auto w-8 h-8 rounded-full border-2 border-cocoa-700 border-t-transparent animate-spin" aria-hidden />
          </div>
        )}

        {phase === "failed" && (
          <div className="mt-7">
            <p className="display-sm">Payment didn&rsquo;t go through</p>
            <p className="mt-2 text-[0.9rem] text-ink-soft">No money left your account. Your date is still held for a few more minutes.</p>
            <button onClick={() => setPhase("apps")} className="btn btn-cocoa mt-5">Try again</button>
          </div>
        )}
      </div>
    </div>
  );
}
