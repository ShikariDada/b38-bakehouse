import { createHash, randomBytes, createHmac, timingSafeEqual } from "node:crypto";

export function trackingToken(): string {
  return randomBytes(24).toString("base64url");
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function orderCode(): string {
  const n = randomBytes(3).readUIntBE(0, 3) % 10000;
  return `B38-${String(1000 + n)}`;
}

export function requestId(): string {
  const n = randomBytes(3).readUIntBE(0, 3) % 10000;
  return `B38-R${String(1000 + n)}`;
}

// --- webhook signature (mock provider mirrors how a real gateway signs) ---
export function signPayload(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

export function verifySignature(payload: string, signature: string, secret: string): boolean {
  const expected = signPayload(payload, secret);
  const a = Buffer.from(expected);
  const b = Buffer.from(signature || "");
  return a.length === b.length && timingSafeEqual(a, b);
}

export function webhookSecret(): string {
  return process.env.PAYMENT_WEBHOOK_SECRET || "dev-only-webhook-secret";
}
