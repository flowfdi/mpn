import { cookies } from "next/headers";
import {
  SESSION_COOKIE,
  decodeSession,
  type SessionPayload,
} from "./session";

export type AuthUser = SessionPayload;

/**
 * Read and verify the session cookie. Returns the authenticated user
 * or null — works identically in Server Components, Server Actions,
 * and Middleware across all Vercel Lambda invocations (stateless).
 */
export async function validateRequest(): Promise<
  { user: AuthUser } | { user: null }
> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    if (!token) return { user: null };

    const user = await decodeSession(token);
    return user ? { user } : { user: null };
  } catch {
    return { user: null };
  }
}
