"use server";

import { validateRequest } from "@/lib/auth";
import { notes } from "@/lib/store";
import { revalidatePath } from "next/cache";

type NoteState = { error: string } | null;

export async function createNoteAction(
  _prevState: NoteState,
  formData: FormData
): Promise<NoteState> {
  const { user } = await validateRequest();
  if (!user) return { error: "Unauthorized." };

  const title = formData.get("title")?.toString().trim();
  const content = formData.get("content")?.toString().trim();

  if (!title) return { error: "Title is required." };
  if (!content) return { error: "Note content is required." };

  const id = crypto.randomUUID();
  notes.set(id, {
    id,
    title,
    content,
    userId: user.id,
    createdAt: new Date(),
  });

  revalidatePath("/dashboard");
  return null;
}

export async function deleteNoteAction(noteId: string) {
  const { user } = await validateRequest();
  if (!user) return;

  const note = notes.get(noteId);
  if (note && note.userId === user.id) notes.delete(noteId);

  revalidatePath("/dashboard");
}
