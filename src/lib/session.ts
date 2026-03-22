/**
 * Stateless signed-cookie sessions using Web Crypto HMAC-SHA256.
 *
 * Why: Vercel runs every request in a potentially different Lambda.
 * Server-side session stores (Map, Redis, DB) require shared state.
 * Signed cookies are self-contained — no server storage at all.
 *
 * Format: base64url(JSON payload) + "." + base64url(HMAC signature)
 * The signature covers the payload, so tampering invalidates the cookie.
 *
 * No external dependencies — uses the Web Crypto API built into Node 18+.
 */

export const SESSION_COOKIE = "pn_sess";

// Hardcoded for demo (no env vars required).
// In production: replace with process.env.SESSION_SECRET (32+ random chars).
const SECRET = "patient-notes-demo-secret-key-2024";

const enc = new TextEncoder();

async function getKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    enc.encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export interface SessionPayload {
  /** User's store ID */
  id: string;
  email: string;
}

/**
 * Encode a session payload into a signed token string.
 * Safe to store in a cookie — the signature prevents forgery.
 */
export async function encodeSession(payload: SessionPayload): Promise<string> {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const key = await getKey();
  const raw = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  const sig = Buffer.from(raw).toString("base64url");
  return `${data}.${sig}`;
}

/**
 * Decode and verify a token from the session cookie.
 * Returns null if missing, malformed, or signature invalid.
 */
export async function decodeSession(
  token: string
): Promise<SessionPayload | null> {
  try {
    const dot = token.lastIndexOf(".");
    if (dot === -1) return null;

    const data = token.slice(0, dot);
    const sig = token.slice(dot + 1);

    const key = await getKey();
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      Buffer.from(sig, "base64url"),
      enc.encode(data)
    );
    if (!valid) return null;

    return JSON.parse(
      Buffer.from(data, "base64url").toString("utf8")
    ) as SessionPayload;
  } catch {
    return null;
  }
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  };
}
