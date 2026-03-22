"use server";

import { lucia } from "@/lib/auth";
import { users, getUserByEmail } from "@/lib/store";
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

  if (!email || !password) return { error: "Email and password are required." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return { error: "Please enter a valid email address." };
  if (password.length < 8)
    return { error: "Password must be at least 8 characters." };
  if (getUserByEmail(email))
    return { error: "An account with this email already exists." };

  const id = crypto.randomUUID();
  const hashedPassword = await bcrypt.hash(password, 10);
  users.set(id, { id, email, password: hashedPassword });

  const session = await lucia.createSession(id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  const cookieStore = await cookies();
  cookieStore.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

  redirect("/dashboard");
}

export async function loginAction(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const password = formData.get("password")?.toString();

  if (!email || !password) return { error: "Email and password are required." };

  const user = getUserByEmail(email);
  if (!user) return { error: "Invalid email or password." };

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return { error: "Invalid email or password." };

  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  const cookieStore = await cookies();
  cookieStore.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

  redirect("/dashboard");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(lucia.sessionCookieName)?.value;
  if (sessionId) await lucia.invalidateSession(sessionId);

  const blank = lucia.createBlankSessionCookie();
  cookieStore.set(blank.name, blank.value, blank.attributes);

  redirect("/login");
}
