"use client";

import { deleteNoteAction } from "@/app/actions/notes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface NoteCardProps {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
}

export default function NoteCard({ id, title, content, createdAt }: NoteCardProps) {
  return (
    <Card className="group">
      <CardHeader className="pb-2 flex flex-row items-start justify-between space-y-0">
        <CardTitle className="text-base font-semibold leading-tight">
          {title}
        </CardTitle>
        <form
          action={async () => {
            await deleteNoteAction(id);
          }}
        >
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="sr-only">Delete note</span>
          </Button>
        </form>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
          {content}
        </p>
        <p className="mt-3 text-xs text-muted-foreground/60">
          {new Date(createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </CardContent>
    </Card>
  );
}
