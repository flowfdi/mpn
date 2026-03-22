/**
 * Custom Lucia v3 Adapter — pure in-memory, no external packages.
 * Implements the full Adapter interface from "lucia".
 */
import type { Adapter, DatabaseSession, DatabaseUser } from "lucia";
import { sessions, users } from "./store";

export const memoryAdapter: Adapter = {
  async getSessionAndUser(
    sessionId: string
  ): Promise<[DatabaseSession | null, DatabaseUser | null]> {
    const s = sessions.get(sessionId);
    if (!s) return [null, null];
    if (s.expiresAt < new Date()) {
      sessions.delete(sessionId);
      return [null, null];
    }
    const u = users.get(s.userId);
    if (!u) return [null, null];
    return [
      { id: s.id, userId: s.userId, expiresAt: s.expiresAt, attributes: {} },
      { id: u.id, attributes: { email: u.email } },
    ];
  },

  async getUserSessions(userId: string): Promise<DatabaseSession[]> {
    const now = new Date();
    return Array.from(sessions.values())
      .filter((s) => s.userId === userId && s.expiresAt >= now)
      .map((s) => ({
        id: s.id,
        userId: s.userId,
        expiresAt: s.expiresAt,
        attributes: {},
      }));
  },

  async setSession(session: DatabaseSession): Promise<void> {
    sessions.set(session.id, {
      id: session.id,
      userId: session.userId,
      expiresAt: session.expiresAt,
    });
  },

  async updateSessionExpiration(
    sessionId: string,
    expiresAt: Date
  ): Promise<void> {
    const s = sessions.get(sessionId);
    if (s) s.expiresAt = expiresAt;
  },

  async deleteSession(sessionId: string): Promise<void> {
    sessions.delete(sessionId);
  },

  async deleteUserSessions(userId: string): Promise<void> {
    for (const [id, s] of sessions) {
      if (s.userId === userId) sessions.delete(id);
    }
  },

  async deleteExpiredSessions(): Promise<void> {
    const now = new Date();
    for (const [id, s] of sessions) {
      if (s.expiresAt < now) sessions.delete(id);
    }
  },
};
