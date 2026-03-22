/**
 * In-memory store — persists within a warm Lambda, resets on cold start.
 * Pinned to globalThis so Next.js dev hot-reloads don't wipe state.
 *
 * Auth sessions are stateless (signed cookies) so they survive cold starts.
 * Users + notes are ephemeral — acceptable for demo.
 */

import { MOCK_NOTES } from "@/lib/mockData";

export interface UserRecord {
  id: string;
  email: string;
  password: string; // bcrypt hash
}

export interface NoteRecord {
  id: string;
  title: string;
  content: string;
  userId: string;
  isAiGenerated: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const g = globalThis as unknown as {
  _pn_users?: Map<string, UserRecord>;
  _pn_notes?: Map<string, NoteRecord>;
};

export const users: Map<string, UserRecord> = (g._pn_users ??= new Map());
export const notes: Map<string, NoteRecord> = (g._pn_notes ??= new Map());

export function getUserByEmail(email: string): UserRecord | null {
  return Array.from(users.values()).find((u) => u.email === email) ?? null;
}

export function getNotesByUser(userId: string): NoteRecord[] {
  return Array.from(notes.values())
    .filter((n) => n.userId === userId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

/**
 * Seed demo notes for a user if they have none.
 * Called at signup/login so the dashboard is never empty.
 * Safe to call multiple times — no-ops if notes already exist.
 */
export function seedDemoNotes(userId: string): void {
  if (getNotesByUser(userId).length > 0) return;
  for (const mock of MOCK_NOTES) {
    const id = `${userId}-${mock.id}`;
    notes.set(id, {
      id,
      title: mock.title,
      content: mock.content,
      userId,
      isAiGenerated: mock.isAiGenerated,
      createdAt: new Date(mock.createdAt),
      updatedAt: new Date(mock.createdAt),
    });
  }
}
