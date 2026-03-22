"use server";

import { prisma } from "@/lib/db";
import { validateRequest } from "@/lib/auth";
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

  await prisma.note.create({
    data: { title, content, userId: user.id },
  });

  revalidatePath("/dashboard");
  return null;
}

export async function deleteNoteAction(noteId: string) {
  const { user } = await validateRequest();
  if (!user) return;

  await prisma.note.deleteMany({
    where: { id: noteId, userId: user.id },
  });

  revalidatePath("/dashboard");
}
