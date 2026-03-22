import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { users, getUserByEmail, seedDemoNotes } from "@/lib/store";
import { encodeSession, SESSION_COOKIE, sessionCookieOptions } from "@/lib/session";

export async function POST(req: NextRequest) {
  const { email: rawEmail, password } = await req.json();

  const email = rawEmail?.toString().trim().toLowerCase();

  if (!email || !password)
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  if (password.length < 8)
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  if (getUserByEmail(email))
    return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });

  const id = crypto.randomUUID();
  const hashed = await bcrypt.hash(password, 10);
  users.set(id, { id, email, password: hashed });

  seedDemoNotes(id);

  const token = await encodeSession({ id, email });
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
  return res;
}
