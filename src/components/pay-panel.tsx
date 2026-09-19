"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatINR } from "@/lib/money";

export function PayPanel({ code, token, amountPaise, upiConfigured }: { code: string; token: string; amountPaise: number; upiConfigured: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function pay(method: "mock_upi" | "direct_upi") {
    setBusy(true);
    setError(null);
    const res = await fetch("/api/checkout/pay", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ code, token, method }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Couldn't start the payment. Try again.");
      setBusy(false);
      return;
    }
    router.push(`/checkout/${code}/pay?t=${token}&attempt=${data.attemptId}`);
  }

  return (
    <div className="mt-4 space-y-3">
      <button className="btn btn-gold w-full sm:w-auto min-w-64" disabled={busy} onClick={() => pay("mock_upi")}>
        {busy ? "Opening UPI…" : `Pay ${formatINR(amountPaise)} with UPI`}
      </button>
      <p className="text-[0.8rem] text-ink-soft max-w-sm">
        GPay, PhonePe, Paytm or any UPI app. The amount is fixed to this order — the UPI app won&rsquo;t let anyone change it.
      </p>
      {!upiConfigured && (
        <p className="text-[0.78rem] text-ink-soft max-w-sm border-l-2 border-gold-500 pl-3">
          Demo mode: a simulated UPI gateway completes this payment end-to-end (signed webhook, idempotent confirmation) so you can see the whole flow. Drop in live gateway keys from Studio → Settings to go real.
        </p>
      )}
      {error && <p className="text-[0.9rem] text-cocoa-700" role="alert">{error}</p>}
    </div>
  );
}
