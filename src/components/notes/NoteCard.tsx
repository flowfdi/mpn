"use client";

import { useState, useTransition } from "react";
import { deleteNoteAction, updateNoteAction } from "@/app/actions/notes";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Trash2,
  Pencil,
  Check,
  X,
  Sparkles,
  Clock,
  FileText,
} from "lucide-react";

interface NoteCardProps {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  isAiGenerated?: boolean;
}

export default function NoteCard({
  id,
  title,
  content,
  createdAt,
  isAiGenerated,
}: NoteCardProps) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editContent, setEditContent] = useState(content);
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    startTransition(async () => {
      await updateNoteAction(id, editTitle, editContent);
      setEditing(false);
    });
  };

  const handleCancel = () => {
    setEditTitle(title);
    setEditContent(content);
    setEditing(false);
  };

  const handleDelete = () => {
    startTransition(async () => {
      await deleteNoteAction(id);
    });
  };

  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Card
      className={`group relative transition-all duration-200 hover:shadow-md dark:bg-slate-900 dark:border-slate-700 ${
        isPending ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      {/* Accent bar */}
      <div
        className={`absolute top-0 left-0 w-1 h-full rounded-l-lg ${
          isAiGenerated ? "bg-purple-500" : "bg-blue-500"
        }`}
      />

      <CardHeader className="pb-2 pl-5">
        <div className="flex items-start justify-between gap-2">
          {editing ? (
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="text-sm font-semibold h-8"
              autoFocus
            />
          ) : (
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate leading-tight">
                {title}
              </h3>
            </div>
          )}

          <div className="flex items-center gap-1 shrink-0">
            {isAiGenerated && !editing && (
              <Badge variant="outline" className="text-purple-600 border-purple-200 dark:border-purple-800 dark:text-purple-400 hidden sm:flex">
                <Sparkles className="h-3 w-3 mr-1" />
                AI
              </Badge>
            )}
            {editing ? (
              <>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                  onClick={handleSave}
                  disabled={isPending}
                >
                  <Check className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 text-muted-foreground"
                  onClick={handleCancel}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-blue-600"
                  onClick={() => setEditing(true)}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                  onClick={handleDelete}
                  disabled={isPending}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pl-5">
        {editing ? (
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="text-sm min-h-[100px] resize-none"
          />
        ) : (
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap line-clamp-4">
            {content}
          </p>
        )}

        <div className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>{formattedDate}</span>
        </div>
      </CardContent>
    </Card>
  );
}
