"use client";

import { useState, useTransition } from "react";
import { deleteNoteAction, updateNoteAction } from "@/app/actions/notes";
import type { NoteRecord } from "@/lib/store";
import type { MockNote } from "@/lib/mockData";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Trash2,
  Pencil,
  Check,
  X,
  Sparkles,
  Clock,
  FileText,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Unified display type
interface DisplayNote {
  id: string;
  title: string;
  content: string;
  isAiGenerated: boolean;
  createdAt: string; // ISO or formatted
  patientName?: string;
  isReal: boolean; // from store (can edit/delete)
}

interface NotesGridProps {
  realNotes: NoteRecord[];
  mockNotes: MockNote[];
}

function NoteItem({ note }: { note: DisplayNote }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    if (!note.isReal) return;
    startTransition(async () => {
      await updateNoteAction(note.id, title, content);
      setEditing(false);
    });
  };

  const handleDelete = () => {
    if (!note.isReal) return;
    startTransition(async () => {
      await deleteNoteAction(note.id);
    });
  };

  const date =
    typeof note.createdAt === "string" && note.createdAt.includes("T")
      ? new Date(note.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : note.createdAt;

  return (
    <Card
      className={cn(
        "group relative transition-all duration-150 hover:shadow-md",
        isPending && "opacity-50 pointer-events-none",
        !note.isReal && "opacity-90"
      )}
    >
      {/* Left accent bar */}
      <div
        className={cn(
          "absolute top-0 left-0 w-1 h-full rounded-l-lg",
          note.isAiGenerated ? "bg-purple-500" : "bg-blue-500"
        )}
      />

      <CardHeader className="pb-1.5 pl-4">
        <div className="flex items-start justify-between gap-2">
          {editing ? (
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xs font-semibold h-7 py-0"
              autoFocus
            />
          ) : (
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <p className="text-xs font-semibold text-slate-800 truncate leading-tight">
                {note.title}
              </p>
            </div>
          )}

          <div className="flex items-center gap-0.5 shrink-0">
            {note.isAiGenerated && !editing && (
              <Badge
                variant="outline"
                className="text-purple-600 border-purple-200 text-[9px] py-0 h-4 px-1.5 hidden sm:flex"
              >
                <Sparkles className="h-2.5 w-2.5 mr-0.5" />
                AI
              </Badge>
            )}
            {note.isReal &&
              (editing ? (
                <>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 text-emerald-600 hover:bg-emerald-50"
                    onClick={handleSave}
                    disabled={isPending}
                  >
                    <Check className="h-3 w-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 text-muted-foreground"
                    onClick={() => {
                      setTitle(note.title);
                      setContent(note.content);
                      setEditing(false);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-blue-600"
                    onClick={() => setEditing(true)}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
                    onClick={handleDelete}
                    disabled={isPending}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </>
              ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pl-4 pt-0">
        {editing ? (
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="text-xs min-h-[70px] resize-none"
          />
        ) : (
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 whitespace-pre-wrap">
            {note.content}
          </p>
        )}

        <div className="flex items-center justify-between mt-2">
          {note.patientName && (
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <User className="h-2.5 w-2.5" />
              {note.patientName}
            </span>
          )}
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground ml-auto">
            <Clock className="h-2.5 w-2.5" />
            {date}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function NotesGrid({ realNotes, mockNotes }: NotesGridProps) {
  const allNotes: DisplayNote[] = [
    ...realNotes.map((n) => ({
      id: n.id,
      title: n.title,
      content: n.content,
      isAiGenerated: n.isAiGenerated,
      createdAt: n.createdAt.toISOString(),
      isReal: true,
    })),
    ...mockNotes.map((n) => ({
      id: n.id,
      title: n.title,
      content: n.content,
      isAiGenerated: n.isAiGenerated,
      createdAt: n.createdAt,
      patientName: n.patientName,
      isReal: false,
    })),
  ];

  if (allNotes.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
          Recent Notes
        </h2>
        <span className="text-xs text-muted-foreground">{allNotes.length} total</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {allNotes.map((note) => (
          <NoteItem key={note.id} note={note} />
        ))}
      </div>
    </div>
  );
}
