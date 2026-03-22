"use client";

import { useActionState, useRef, useEffect } from "react";
import { createNoteAction } from "@/app/actions/notes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2, Plus } from "lucide-react";

export default function NoteForm() {
  const [state, formAction, isPending] = useActionState(createNoteAction, null);
  const formRef = useRef<HTMLFormElement>(null);

  // Reset form on success (state === null after a successful submit returns null)
  useEffect(() => {
    if (state === null && !isPending) {
      formRef.current?.reset();
    }
  }, [state, isPending]);

  return (
    <form ref={formRef} action={formAction} className="space-y-3">
      {state?.error && (
        <div className="flex items-center gap-2 rounded-md bg-destructive/10 border border-destructive/20 px-3 py-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {state.error}
        </div>
      )}
      <div className="space-y-1.5">
        <Label htmlFor="title">Note Title</Label>
        <Input
          id="title"
          name="title"
          placeholder="e.g. Initial consult — John D."
          required
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="content">Note Content</Label>
        <Textarea
          id="content"
          name="content"
          placeholder="Chief complaint, history, assessment, plan…"
          rows={4}
          required
        />
      </div>
      <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
        Add Note
      </Button>
    </form>
  );
}
