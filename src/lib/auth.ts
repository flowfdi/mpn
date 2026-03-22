import { Lucia } from "lucia";
import { memoryAdapter } from "./adapter";
import { cookies } from "next/headers";

export const lucia = new Lucia(memoryAdapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return { email: attributes.email };
  },
});

export async function validateRequest() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(lucia.sessionCookieName)?.value ?? null;
  if (!sessionId) return { user: null, session: null };

  const result = await lucia.validateSession(sessionId);

  try {
    if (result.session?.fresh) {
      const c = lucia.createSessionCookie(result.session.id);
      cookieStore.set(c.name, c.value, c.attributes);
    }
    if (!result.session) {
      const c = lucia.createBlankSessionCookie();
      cookieStore.set(c.name, c.value, c.attributes);
    }
  } catch {
    // Ignore: Next.js blocks cookie writes during static render
  }

  return result;
}

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: { email: string };
  }
}
