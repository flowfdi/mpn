"use server";

import { users, getUserByEmail } from "@/lib/store";
import {
  encodeSession,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "@/lib/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

type AuthState = { error: string } | null;

export async function signupAction(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const password = formData.get("password")?.toString();

  if (!email || !password)
    return { error: "Email and password are required." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return { error: "Please enter a valid email address." };
  if (password.length < 8)
    return { error: "Password must be at least 8 characters." };
  if (getUserByEmail(email))
    return { error: "An account with this email already exists." };

  const id = crypto.randomUUID();
  const hashed = await bcrypt.hash(password, 10);
  users.set(id, { id, email, password: hashed });

  // Encode user identity into a signed cookie — no server-side session store.
  // This token is verified on every request via HMAC, so it's safe across
  // any number of Vercel Lambda invocations.
  const token = await encodeSession({ id, email });
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, sessionCookieOptions());

  redirect("/dashboard");
}

export async function loginAction(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const password = formData.get("password")?.toString();

  if (!email || !password)
    return { error: "Email and password are required." };

  const user = getUserByEmail(email);
  if (!user) return { error: "Invalid email or password." };

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return { error: "Invalid email or password." };

  const token = await encodeSession({ id: user.id, email: user.email });
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, sessionCookieOptions());

  redirect("/dashboard");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect("/login");
}
