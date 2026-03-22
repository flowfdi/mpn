"use client";

import { useState, useRef, useTransition } from "react";
import { createNoteFromAiAction } from "@/app/actions/notes";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import VoiceDictation from "@/components/VoiceDictation";
import type { MockPatient } from "@/lib/mockData";
import { MOCK_SOAP_TEMPLATES } from "@/lib/mockData";
import {
  Sparkles,
  Save,
  Loader2,
  CheckCircle2,
  UserRound,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";

type SOAPKey = "subjective" | "objective" | "assessment" | "plan";

interface SOAPData {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

const TABS: { key: SOAPKey; label: string; short: string; color: string }[] = [
  {
    key: "subjective",
    label: "Subjective",
    short: "S",
    color: "text-blue-600 border-blue-400 bg-blue-50",
  },
  {
    key: "objective",
    label: "Objective",
    short: "O",
    color: "text-purple-600 border-purple-400 bg-purple-50",
  },
  {
    key: "assessment",
    label: "Assessment",
    short: "A",
    color: "text-amber-600 border-amber-400 bg-amber-50",
  },
  {
    key: "plan",
    label: "Plan",
    short: "P",
    color: "text-emerald-600 border-emerald-400 bg-emerald-50",
  },
];

const PLACEHOLDER: Record<SOAPKey, string> = {
  subjective:
    "Patient's chief complaint, history, pain level, aggravating/relieving factors…",
  objective:
    "Physical findings, ROM measurements, orthopedic tests, neurological exam…",
  assessment:
    "Diagnosis, ICD-10 codes, clinical impression, differential diagnosis…",
  plan:
    "Treatment plan, manipulation technique, modalities, exercises, follow-up…",
};

interface NoteEditorProps {
  patient: MockPatient | null;
  onNoteSaved?: () => void;
}

export default function NoteEditor({ patient, onNoteSaved }: NoteEditorProps) {
  const [activeTab, setActiveTab] = useState<SOAPKey>("subjective");
  const [soap, setSoap] = useState<SOAPData>({
    subjective: "",
    objective: "",
    assessment: "",
    plan: "",
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();
  const streamTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearStreamTimers = () => {
    streamTimers.current.forEach(clearTimeout);
    streamTimers.current = [];
  };

  const handleVoiceTranscript = (text: string) => {
    setSoap((prev) => ({
      ...prev,
      [activeTab]: prev[activeTab] ? prev[activeTab] + " " + text : text,
    }));
  };

  const handleGenerate = () => {
    if (!patient) return;
    clearStreamTimers();
    setIsGenerating(true);
    setSaved(false);

    const template =
      MOCK_SOAP_TEMPLATES[patient.id] ?? MOCK_SOAP_TEMPLATES["demo-p1"];

    // Reset then stream each field word-by-word
    setSoap({ subjective: "", objective: "", assessment: "", plan: "" });

    const fields: SOAPKey[] = ["subjective", "objective", "assessment", "plan"];
    let globalDelay = 0;

    for (const field of fields) {
      const words = template[field].split(" ");
      words.forEach((_, i) => {
        const t = setTimeout(() => {
          setSoap((prev) => ({
            ...prev,
            [field]: words.slice(0, i + 1).join(" "),
          }));
        }, globalDelay);
        streamTimers.current.push(t);
        globalDelay += 18;
      });
      // Small pause between sections
      globalDelay += 120;
    }

    const doneTimer = setTimeout(() => {
      setSoap({
        subjective: template.subjective,
        objective: template.objective,
        assessment: template.assessment,
        plan: template.plan,
      });
      setIsGenerating(false);
    }, globalDelay);
    streamTimers.current.push(doneTimer);
  };

  const handleSave = () => {
    if (!patient) return;
    const hasContent = Object.values(soap).some((v) => v.trim());
    if (!hasContent) return;

    const title = `${patient.firstName} ${patient.lastName} — ${new Date().toLocaleDateString(
      "en-US",
      { month: "short", day: "numeric", year: "numeric" }
    )}`;
    const content = [
      soap.subjective && `SUBJECTIVE:\n${soap.subjective}`,
      soap.objective && `\nOBJECTIVE:\n${soap.objective}`,
      soap.assessment && `\nASSESSMENT:\n${soap.assessment}`,
      soap.plan && `\nPLAN:\n${soap.plan}`,
    ]
      .filter(Boolean)
      .join("");

    startTransition(async () => {
      await createNoteFromAiAction(title, content);
      setSaved(true);
      setSoap({ subjective: "", objective: "", assessment: "", plan: "" });
      onNoteSaved?.();
      setTimeout(() => setSaved(false), 3000);
    });
  };

  // Completion indicator
  const filled = Object.values(soap).filter((v) => v.trim()).length;

  if (!patient) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-white rounded-2xl border border-slate-100">
        <div className="p-4 rounded-2xl bg-forest-50 mb-4">
          <ClipboardList className="h-8 w-8 text-forest-400" />
        </div>
        <p className="text-sm font-medium text-slate-700 mb-1">
          No patient selected
        </p>
        <p className="text-xs text-muted-foreground max-w-xs">
          Click a patient on the left to start a new SOAP note. You can dictate
          via voice or use AI to generate the full note.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl border border-slate-100 overflow-hidden">
      {/* ── Header ── */}
      <div className="px-4 py-3 border-b bg-forest-50/50 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={cn(
              "h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0",
              patient.avatarColor
            )}
          >
            {patient.initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">
              {patient.firstName} {patient.lastName}
            </p>
            <p className="text-xs text-muted-foreground">{patient.condition}</p>
          </div>
        </div>
        {/* Progress dots */}
        <div className="flex items-center gap-1 shrink-0">
          {TABS.map((tab) => (
            <div
              key={tab.key}
              className={cn(
                "h-2 w-2 rounded-full transition-colors",
                soap[tab.key].trim()
                  ? "bg-forest-500"
                  : "bg-slate-200"
              )}
              title={tab.label}
            />
          ))}
          <span className="text-[10px] text-muted-foreground ml-1">
            {filled}/4
          </span>
        </div>
      </div>

      {/* ── Voice dictation ── */}
      <div className="px-4 py-2.5 border-b bg-white">
        <VoiceDictation
          onTranscript={handleVoiceTranscript}
          disabled={isGenerating}
        />
      </div>

      {/* ── SOAP Tabs ── */}
      <div className="flex border-b bg-slate-50">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "flex-1 py-2.5 text-xs font-semibold transition-colors border-b-2 relative",
              activeTab === tab.key
                ? `border-current ${tab.color}`
                : "border-transparent text-muted-foreground hover:text-slate-700 hover:bg-white"
            )}
          >
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.short}</span>
            {soap[tab.key].trim() && (
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-forest-500" />
            )}
          </button>
        ))}
      </div>

      {/* ── Active textarea ── */}
      <div className="flex-1 overflow-hidden relative">
        <Textarea
          key={activeTab}
          value={soap[activeTab]}
          onChange={(e) =>
            setSoap((prev) => ({ ...prev, [activeTab]: e.target.value }))
          }
          placeholder={PLACEHOLDER[activeTab]}
          className={cn(
            "h-full w-full resize-none rounded-none border-0 focus-visible:ring-0 text-sm leading-relaxed p-4",
            isGenerating && "cursor-wait"
          )}
          readOnly={isGenerating}
        />
        {isGenerating && (
          <span className="absolute bottom-4 right-4 text-forest-500 font-mono animate-pulse">
            ▊
          </span>
        )}
      </div>

      {/* ── Action bar ── */}
      <div className="px-4 py-3 border-t bg-slate-50/80 flex items-center gap-2">
        <Button
          type="button"
          size="sm"
          onClick={handleGenerate}
          disabled={isGenerating || isPending}
          className="gap-2 bg-purple-600 hover:bg-purple-700 text-white"
        >
          {isGenerating ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Sparkles className="h-3.5 w-3.5" />
          )}
          {isGenerating ? "Generating…" : "AI Generate"}
        </Button>

        <Button
          type="button"
          size="sm"
          onClick={handleSave}
          disabled={isPending || isGenerating || filled === 0}
          className="gap-2"
        >
          {isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : saved ? (
            <CheckCircle2 className="h-3.5 w-3.5" />
          ) : (
            <Save className="h-3.5 w-3.5" />
          )}
          {saved ? "Saved!" : "Save Note"}
        </Button>

        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="ml-auto text-xs text-muted-foreground"
          onClick={() => {
            clearStreamTimers();
            setIsGenerating(false);
            setSoap({ subjective: "", objective: "", assessment: "", plan: "" });
          }}
          disabled={isPending || isGenerating}
        >
          Clear
        </Button>
      </div>
    </div>
  );
}
