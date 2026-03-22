import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { logoutAction } from "@/app/actions/auth";
import NoteForm from "@/components/notes/NoteForm";
import NoteCard from "@/components/notes/NoteCard";
import AiDemoButton from "@/components/AiDemoButton";
import { Button } from "@/components/ui/button";
import { FileText, LogOut, StickyNote } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Dashboard — PatientNotes" };

export default async function DashboardPage() {
  const { user } = await validateRequest();
  if (!user) redirect("/login");

  const notes = await prisma.note.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <span className="font-bold text-slate-900">PatientNotes</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {user.email}
            </span>
            <AiDemoButton />
            <form action={logoutAction}>
              <Button variant="ghost" size="sm" type="submit" className="gap-2">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Log out</span>
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-10">
        {/* Page title */}
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Notes</h1>
          <p className="text-muted-foreground mt-1">
            {notes.length === 0
              ? "No notes yet — add your first one below."
              : `${notes.length} note${notes.length === 1 ? "" : "s"}`}
          </p>
        </div>

        {/* Add note form */}
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <StickyNote className="h-5 w-5 text-blue-600" />
            New Note
          </h2>
          <NoteForm />
        </div>

        {/* Notes list */}
        {notes.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                id={note.id}
                title={note.title}
                content={note.content}
                createdAt={note.createdAt}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground border rounded-xl bg-white">
            <StickyNote className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Your notes will appear here.</p>
          </div>
        )}
      </main>
    </div>
  );
}
