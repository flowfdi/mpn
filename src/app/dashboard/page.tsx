import { validateRequest } from "@/lib/auth";
import { getNotesByUser } from "@/lib/store";
import { redirect } from "next/navigation";
import { logoutAction } from "@/app/actions/auth";
import NoteForm from "@/components/notes/NoteForm";
import NoteCard from "@/components/notes/NoteCard";
import AiNoteGenerator from "@/components/ai/AiNoteGenerator";
import StatsBar from "@/components/dashboard/StatsBar";
import EmptyState from "@/components/dashboard/EmptyState";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, LogOut, Stethoscope, PlusCircle, User } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Dashboard — PatientNotes" };

export default async function DashboardPage() {
  const { user } = await validateRequest();
  if (!user) redirect("/login");

  const notesList = getNotesByUser(user.id);
  const aiNotes = notesList.filter((n) => n.isAiGenerated).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* ── Sidebar + Main layout ── */}
      <div className="flex h-screen overflow-hidden">

        {/* ── Sidebar ── */}
        <aside className="hidden md:flex w-60 shrink-0 flex-col border-r bg-white dark:bg-slate-900 dark:border-slate-800">
          {/* Logo */}
          <div className="h-16 flex items-center gap-2.5 px-5 border-b dark:border-slate-800">
            <div className="p-1.5 rounded-lg bg-blue-600">
              <Stethoscope className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-slate-900 dark:text-slate-100">
              PatientNotes
            </span>
          </div>

          {/* Nav items */}
          <nav className="flex-1 p-3 space-y-1">
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 text-sm font-medium">
              <FileText className="h-4 w-4" />
              Notes
            </div>
          </nav>

          {/* User footer */}
          <div className="p-3 border-t dark:border-slate-800">
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg">
              <div className="h-7 w-7 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                <User className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-900 dark:text-slate-100 truncate">
                  {user.email}
                </p>
                <p className="text-[10px] text-muted-foreground">Provider</p>
              </div>
            </div>
            <form action={logoutAction} className="mt-1">
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2 text-muted-foreground hover:text-slate-900 dark:hover:text-slate-100 text-xs h-8"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign out
              </Button>
            </form>
          </div>
        </aside>

        {/* ── Main area ── */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* ── Top bar (mobile) ── */}
          <header className="md:hidden h-14 flex items-center justify-between px-4 bg-white dark:bg-slate-900 border-b dark:border-slate-800">
            <Link href="/" className="flex items-center gap-2">
              <div className="p-1 rounded-lg bg-blue-600">
                <Stethoscope className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                PatientNotes
              </span>
            </Link>
            <form action={logoutAction}>
              <Button variant="ghost" size="sm" type="submit" className="gap-1.5 text-xs">
                <LogOut className="h-3.5 w-3.5" />
                Out
              </Button>
            </form>
          </header>

          {/* ── Page header ── */}
          <div className="bg-white dark:bg-slate-900 border-b dark:border-slate-800 px-6 py-4">
            <div className="max-w-5xl mx-auto flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Clinical Notes
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {notesList.length === 0
                    ? "No notes yet — create your first below"
                    : `${notesList.length} note${notesList.length === 1 ? "" : "s"} on record`}
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{user.email}</span>
              </div>
            </div>
          </div>

          {/* ── Scrollable content ── */}
          <ScrollArea className="flex-1">
            <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">

              {/* Stats */}
              <StatsBar totalNotes={notesList.length} aiNotes={aiNotes} />

              {/* ── Input zone: 2-col on lg ── */}
              <div className="grid lg:grid-cols-2 gap-4">

                {/* Manual note form */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border dark:border-slate-800 shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40">
                      <PlusCircle className="h-4 w-4 text-blue-600" />
                    </div>
                    <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Quick Note
                    </h2>
                  </div>
                  <NoteForm />
                </div>

                {/* AI generator */}
                <AiNoteGenerator />
              </div>

              {/* ── Notes list ── */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                    Recent Notes
                  </h2>
                  {notesList.length > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {notesList.length} total
                    </span>
                  )}
                </div>
                <Separator className="mb-4 dark:bg-slate-800" />

                {notesList.length === 0 ? (
                  <EmptyState />
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {notesList.map((note) => (
                      <NoteCard
                        key={note.id}
                        id={note.id}
                        title={note.title}
                        content={note.content}
                        createdAt={note.createdAt}
                        isAiGenerated={note.isAiGenerated}
                      />
                    ))}
                  </div>
                )}
              </div>

            </main>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
