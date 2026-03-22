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

  notes.set(crypto.randomUUID(), {
    id: crypto.randomUUID(),
    title,
    content,
    userId: user.id,
    isAiGenerated: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  revalidatePath("/dashboard");
  return null;
}

export async function createNoteFromAiAction(
  title: string,
  content: string
): Promise<void> {
  const { user } = await validateRequest();
  if (!user) return;

  const id = crypto.randomUUID();
  notes.set(id, {
    id,
    title: title.trim(),
    content: content.trim(),
    userId: user.id,
    isAiGenerated: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  revalidatePath("/dashboard");
}

export async function updateNoteAction(
  noteId: string,
  title: string,
  content: string
): Promise<void> {
  const { user } = await validateRequest();
  if (!user) return;

  const note = notes.get(noteId);
  if (!note || note.userId !== user.id) return;

  notes.set(noteId, {
    ...note,
    title: title.trim(),
    content: content.trim(),
    updatedAt: new Date(),
  });

  revalidatePath("/dashboard");
}

export async function deleteNoteAction(noteId: string): Promise<void> {
  const { user } = await validateRequest();
  if (!user) return;

  const note = notes.get(noteId);
  if (note && note.userId === user.id) notes.delete(noteId);

  revalidatePath("/dashboard");
}
