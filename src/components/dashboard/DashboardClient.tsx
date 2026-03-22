"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { logoutAction } from "@/app/actions/auth";
import StatsBar from "@/components/dashboard/StatsBar";
import NotesGrid from "@/components/dashboard/NotesGrid";
import PatientCard from "@/components/PatientCard";
import NoteEditor from "@/components/NoteEditor";
import type { AuthUser } from "@/lib/auth";
import type { NoteRecord } from "@/lib/store";
import {
  MOCK_PATIENTS,
  MOCK_NOTES,
  type MockPatient,
} from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  LogOut,
  Stethoscope,
  User,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavView = "dashboard" | "patients" | "notes" | "settings";

const NAV_ITEMS: { key: NavView; label: string; icon: React.ReactNode }[] = [
  { key: "dashboard",  label: "Dashboard",  icon: <LayoutDashboard className="h-4 w-4" /> },
  { key: "patients",   label: "Patients",   icon: <Users className="h-4 w-4" /> },
  { key: "notes",      label: "Notes",      icon: <FileText className="h-4 w-4" /> },
  { key: "settings",   label: "Settings",   icon: <Settings className="h-4 w-4" /> },
];

interface Props {
  user: AuthUser;
  initialNotes: NoteRecord[];
}

export default function DashboardClient({ user, initialNotes }: Props) {
  const router = useRouter();
  const [view, setView] = useState<NavView>("dashboard");
  const [selectedPatient, setSelectedPatient] = useState<MockPatient | null>(null);
  const [notes, setNotes] = useState<NoteRecord[]>(initialNotes);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const aiNotes =
    notes.filter((n) => n.isAiGenerated).length +
    MOCK_NOTES.filter((n) => n.isAiGenerated).length;
  const totalNotes = notes.length + MOCK_NOTES.length;

  const handleNoteSaved = useCallback(() => {
    router.refresh();
  }, [router]);

  // ── Sidebar ──────────────────────────────────────────────────────────────
  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <aside
      className={cn(
        "flex flex-col bg-forest-900 text-white",
        mobile
          ? "fixed inset-y-0 left-0 z-50 w-64 shadow-2xl"
          : "hidden md:flex w-60 shrink-0"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center gap-2.5 px-5 border-b border-forest-800">
        <div className="p-1.5 rounded-lg bg-forest-500">
          <Stethoscope className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="font-bold text-white text-sm leading-none">PatientNotes</p>
          <p className="text-[10px] text-forest-300 mt-0.5">AI</p>
        </div>
        {mobile && (
          <button
            className="ml-auto p-1 text-forest-300 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-semibold text-forest-500 uppercase tracking-widest px-3 mb-2">
          Main
        </p>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            onClick={() => { setView(item.key); setSidebarOpen(false); }}
            className={cn("sidebar-item w-full", view === item.key && "active")}
          >
            {item.icon}
            {item.label}
            {view === item.key && (
              <ChevronRight className="ml-auto h-3.5 w-3.5 text-forest-300" />
            )}
          </button>
        ))}

        <div className="pt-4">
          <p className="text-[10px] font-semibold text-forest-500 uppercase tracking-widest px-3 mb-2">
            Patients
          </p>
          {MOCK_PATIENTS.slice(0, 3).map((p) => (
            <button
              key={p.id}
              onClick={() => { setView("dashboard"); setSelectedPatient(p); setSidebarOpen(false); }}
              className={cn(
                "sidebar-item w-full text-xs",
                selectedPatient?.id === p.id && "active"
              )}
            >
              <div
                className={cn(
                  "h-5 w-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold shrink-0",
                  p.avatarColor
                )}
              >
                {p.initials}
              </div>
              <span className="truncate">{p.firstName} {p.lastName}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* User footer */}
      <div className="border-t border-forest-800 p-3">
        <div className="flex items-center gap-2.5 px-2 py-1.5 mb-1">
          <div className="h-7 w-7 rounded-full bg-forest-600 flex items-center justify-center shrink-0">
            <User className="h-3.5 w-3.5 text-forest-100" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-white truncate">{user.email}</p>
            <p className="text-[10px] text-forest-400">Provider</p>
          </div>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="sidebar-item w-full text-xs text-forest-300 hover:text-white"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  );

  // ── Settings view ─────────────────────────────────────────────────────────
  const SettingsView = () => (
    <div className="max-w-lg mx-auto py-12 px-4">
      <h2 className="text-lg font-bold text-slate-900 mb-6">Settings</h2>
      <div className="space-y-4">
        {[
          { label: "Account email", value: user.email },
          { label: "Plan", value: "Demo (free)" },
          { label: "AI model", value: "Mock GPT (demo)" },
          { label: "Voice language", value: "English (US)" },
        ].map((s) => (
          <div key={s.label} className="flex items-center justify-between py-3 border-b border-slate-100">
            <span className="text-sm text-slate-700">{s.label}</span>
            <span className="text-sm text-muted-foreground">{s.value}</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-8 text-center">
        PatientNotes AI — Demo build · Data resets on cold start
      </p>
    </div>
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <Sidebar mobile />
        </>
      )}

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar */}
        <header className="h-14 bg-white border-b flex items-center px-4 gap-3 shrink-0">
          <button
            className="md:hidden p-1.5 rounded-lg hover:bg-slate-100"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-4 w-4 text-slate-600" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-semibold text-slate-900 capitalize">
              {view === "dashboard" ? "Clinical Dashboard" : view}
            </h1>
            <p className="text-[11px] text-muted-foreground hidden sm:block">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
          <span className="text-xs text-muted-foreground hidden sm:block">{user.email}</span>
        </header>

        {/* Scrollable content */}
        <ScrollArea className="flex-1">
          <div className="p-4 sm:p-6 space-y-5 max-w-screen-2xl mx-auto">

            {/* ── Settings view ── */}
            {view === "settings" && <SettingsView />}

            {/* ── Patients view ── */}
            {view === "patients" && (
              <div>
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-3">
                  All Patients
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {MOCK_PATIENTS.map((p) => (
                    <PatientCard
                      key={p.id}
                      patient={p}
                      isSelected={selectedPatient?.id === p.id}
                      onSelect={(pt) => { setSelectedPatient(pt); setView("dashboard"); }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* ── Notes view ── */}
            {view === "notes" && (
              <div>
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-3">
                  All Notes
                </h2>
                <NotesGrid realNotes={notes} mockNotes={MOCK_NOTES} />
              </div>
            )}

            {/* ── Dashboard view ── */}
            {(view === "dashboard" || view === "patients") && view !== "patients" && (
              <>
                {/* Stats */}
                <StatsBar totalNotes={totalNotes} aiNotes={aiNotes} />

                {/* Two panels */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 min-h-[520px]">

                  {/* Patient list — 2 cols */}
                  <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col overflow-hidden">
                    <div className="px-4 py-3 border-b bg-forest-50/60 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-forest-600" />
                        <h2 className="text-sm font-semibold text-forest-800">Patients</h2>
                        <span className="text-xs bg-forest-100 text-forest-700 px-1.5 py-0.5 rounded-full font-medium">
                          {MOCK_PATIENTS.length}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-forest-600 hover:text-forest-800 hover:bg-forest-50 h-7 px-2"
                        onClick={() => setView("patients")}
                      >
                        View all
                      </Button>
                    </div>
                    <ScrollArea className="flex-1">
                      <div className="p-3 space-y-2">
                        {MOCK_PATIENTS.map((p) => (
                          <PatientCard
                            key={p.id}
                            patient={p}
                            isSelected={selectedPatient?.id === p.id}
                            onSelect={setSelectedPatient}
                          />
                        ))}
                      </div>
                    </ScrollArea>
                    {selectedPatient && (
                      <div className="border-t px-4 py-2.5 bg-forest-50/40 text-xs text-forest-700 font-medium flex items-center gap-1.5">
                        <div className={cn("h-4 w-4 rounded-full flex items-center justify-center text-white text-[8px] font-bold", selectedPatient.avatarColor)}>
                          {selectedPatient.initials}
                        </div>
                        Active: {selectedPatient.firstName} {selectedPatient.lastName}
                      </div>
                    )}
                  </div>

                  {/* Note editor — 3 cols */}
                  <div className="lg:col-span-3">
                    <NoteEditor
                      patient={selectedPatient}
                      onNoteSaved={handleNoteSaved}
                    />
                  </div>
                </div>

                {/* Divider */}
                <Separator />

                {/* Notes grid */}
                <NotesGrid realNotes={notes} mockNotes={MOCK_NOTES} />
              </>
            )}

          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
