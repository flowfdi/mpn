/**
 * In-memory data store — no database required.
 * Uses `globalThis` so data survives Next.js hot reloads in dev.
 * On Vercel: data resets per cold start (fine for demo).
 */

export interface UserRecord {
  id: string;
  email: string;
  password: string; // bcrypt hash
}

export interface SessionRecord {
  id: string;
  userId: string;
  expiresAt: Date;
}

export interface NoteRecord {
  id: string;
  title: string;
  content: string;
  userId: string;
  createdAt: Date;
}

const g = globalThis as unknown as {
  _pn_users?: Map<string, UserRecord>;
  _pn_sessions?: Map<string, SessionRecord>;
  _pn_notes?: Map<string, NoteRecord>;
};

export const users: Map<string, UserRecord> = (g._pn_users ??= new Map());
export const sessions: Map<string, SessionRecord> = (g._pn_sessions ??= new Map());
export const notes: Map<string, NoteRecord> = (g._pn_notes ??= new Map());

export function getUserByEmail(email: string): UserRecord | null {
  return Array.from(users.values()).find((u) => u.email === email) ?? null;
}

export function getNotesByUser(userId: string): NoteRecord[] {
  return Array.from(notes.values())
    .filter((n) => n.userId === userId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}
