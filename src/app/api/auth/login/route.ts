import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getUserByEmail, seedDemoNotes } from "@/lib/store";
import { encodeSession, SESSION_COOKIE, sessionCookieOptions } from "@/lib/session";

export async function POST(req: NextRequest) {
  const { email: rawEmail, password } = await req.json();

  const email = rawEmail?.toString().trim().toLowerCase();

  if (!email || !password)
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });

  const user = getUserByEmail(email);
  if (!user)
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid)
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });

  seedDemoNotes(user.id);

  const token = await encodeSession({ id: user.id, email: user.email });
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
  return res;
}
