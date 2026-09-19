# Payment provider decision record — B38 Bake House

**Date compiled:** 20 September 2026 (desktop research; re-verify before merchant activation)

## Current state

Checkout runs on `MockUpiProvider` — a simulated gateway that implements the *exact* production
contract: server-created order with a locked amount → signed webhook → verification (signature,
idempotency by event id, no double-credit on repeated captures, amount matching) → order
confirmation. The customer-facing flow (UPI app chooser → "Confirming payment…" → tracking page)
is identical to a real gateway's.

## Regulatory context (re-verify on activation day)

- Ministry of Finance (15 Sep 2026): P2M UPI above ₹2,000 attracts 0.3–0.4% MDR from 15 Oct 2026,
  with small-merchant exemptions (historically ~₹1 lakh/month QR turnover). P2P stays free.
  Consumers are not to be charged MDR.
- Practical reading for B38: monthly GMV will likely stay inside the small-merchant exemption for
  a long time; all-in UPI cost should stay near zero either way. Reconfirm at onboarding.

## Options compared (snapshot)

| Route | Cost signal | Fit |
|---|---|---|
| **Cashfree** | Promo: 0% platform fee on first ₹20L GMV (campaign advertised through 31 Mar 2027); ~1.95% after | **First choice to onboard** — mature UPI intent + dynamic QR + webhooks |
| **PhonePe PG** | ~1.99% standard; current "Free*" offer terms must be read | Strong second |
| **Razorpay** | 0% for 90 days / ₹5L for new merchants; ₹199 KYC fee; ~2% after | Strong fallback |
| **Bank dynamic QR** (HDFC SmartHub Vyapar / ICICI UPI Collections / Axis) | Potentially near-zero MDR within exemption | Ask the bakery's bank; best long-term if API + callbacks exist |
| Zoho Payments | 0.5% + GST UPI published | Worth a quote |

## Activation checklist (when Chhaya is ready)

1. Re-query the provider's current pricing page the same day.
2. Complete KYC (individual proprietor/home bakery is accepted by the majors; keep FSSAI handy).
3. Sandbox ₹1 test → one real ₹10 live transaction.
4. Verify: UPI intent on Android + iOS web, webhook received + signature verified + replay
   rejected, refund executed, settlement T+1 visible.
5. Record results here and set keys in `.env`; flip `PAYMENT_PROVIDER` to the adapter name.

## Adapter contract

```ts
interface PaymentProvider {
  createCheckout(input: { orderId; amountPaise; customer; returnUrl }): Promise<{
    providerOrderId; mode: "upi_intent" | "dynamic_qr" | "hosted"; intentUrl?; qrPayload?; checkoutUrl?; expiresAt?
  }>;
  verifyWebhook(request: Request): Promise<VerifiedPaymentEvent>;
  fetchPayment(providerOrderId: string): Promise<PaymentStatus>;
  refund(input: RefundInput): Promise<RefundResult>;
}
```

`MockUpiProvider` (see `src/app/api/checkout/pay`, `src/app/api/mock-gateway/approve`,
`src/app/api/webhooks/mock`) demonstrates every branch a real adapter must implement, including
the failure path and replay idempotency that were both tested.
