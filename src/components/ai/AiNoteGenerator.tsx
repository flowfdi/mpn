"use client";

import { useState, useRef, useTransition } from "react";
import { createNoteFromAiAction } from "@/app/actions/notes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Loader2,
  CheckCircle2,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
} from "lucide-react";

const MOCK_AI_TEMPLATES = [
  {
    prompt: "Lumbar pain follow-up",
    response: `SUBJECTIVE:
Patient presents for follow-up of acute lumbar pain. Reports significant improvement since last visit (pain 3/10, down from 8/10). Able to return to light activities. No radiating symptoms. Sleeping better.

OBJECTIVE:
Lumbar ROM improved. Flexion 70° (was 40°), extension 20° (was 5°). Paraspinal muscle tension decreased bilaterally. SLR negative bilaterally. Neurological exam intact.

ASSESSMENT:
Lumbar sprain/strain, resolving. Patient responding well to conservative chiropractic care.

PLAN:
Continue current treatment protocol. Reduce frequency to 1x/week. Add home exercise program — lumbar stabilization exercises. Re-evaluate in 3 weeks. Patient educated on proper lifting mechanics.`,
  },
  {
    prompt: "Cervical headache new patient",
    response: `SUBJECTIVE:
New patient presents with chief complaint of cervicogenic headaches. Onset 3 months ago following MVA. Pain rated 6/10, primarily right occipital region with radiation to right temporal area. Aggravated by sustained postures and screen time. Denies nausea/vomiting, visual changes, or neurological symptoms.

OBJECTIVE:
Cervical ROM restricted: flexion 40° (nl 50°), right rotation 45° (nl 80°). Right suboccipital musculature hypertonicity. C1-C2 restriction palpated. Cranial nerve exam intact. Upper extremity strength and sensation WNL.

ASSESSMENT:
Cervicogenic headache, post-traumatic. Cervical facet syndrome C1-C2.

PLAN:
Chiropractic manipulation C1-C2 and upper thoracic. Soft tissue therapy suboccipital region. Ice 15 min BID. Posture education and ergonomic review. Re-evaluate in 2 weeks. MRI recommended if no improvement.`,
  },
  {
    prompt: "Shoulder impingement assessment",
    response: `SUBJECTIVE:
Patient reports persistent right shoulder pain × 6 weeks. Onset insidious, worsening with overhead activities and reaching across body. Pain 5/10 at rest, 8/10 with movement. Works as a painter — occupational exposure. No prior treatment.

OBJECTIVE:
Right shoulder: Active ROM limited — abduction 120° (nl 180°), flexion 130° (nl 180°). Neer's sign positive. Hawkins-Kennedy positive. Empty can test positive. Strength 4/5 supraspinatus. No instability. Bicipital groove tenderness.

ASSESSMENT:
Right shoulder impingement syndrome. Probable rotator cuff tendinopathy (supraspinatus).

PLAN:
Chiropractic adjustment glenohumeral and AC joints. Instrument-assisted soft tissue mobilization (IASTM) rotator cuff. Therapeutic exercises: scapular stabilization, rotator cuff strengthening. Modify occupational activities — limit overhead work. NSAIDs as needed. Refer for diagnostic ultrasound if no improvement in 4 weeks.`,
  },
];

type Stage = "idle" | "prompting" | "generating" | "done";

export default function AiNoteGenerator() {
  const [stage, setStage] = useState<Stage>("idle");
  const [prompt, setPrompt] = useState("");
  const [patientName, setPatientName] = useState("");
  const [generatedText, setGeneratedText] = useState("");
  const [editedText, setEditedText] = useState("");
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();
  const streamRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setStage("generating");
    setGeneratedText("");
    setEditedText("");

    // Pick a template or use generic
    const template =
      MOCK_AI_TEMPLATES.find((t) =>
        prompt.toLowerCase().includes(t.prompt.split(" ")[0].toLowerCase())
      ) ?? MOCK_AI_TEMPLATES[Math.floor(Math.random() * MOCK_AI_TEMPLATES.length)];

    const header = patientName
      ? `PATIENT: ${patientName}\nDATE: ${new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}\n\n`
      : "";

    const fullText = header + template.response;
    const words = fullText.split(" ");
    let i = 0;

    const stream = () => {
      if (i < words.length) {
        const chunk = words.slice(0, i + 1).join(" ");
        setGeneratedText(chunk);
        i++;
        streamRef.current = setTimeout(stream, 22);
      } else {
        setGeneratedText(fullText);
        setEditedText(fullText);
        setStage("done");
      }
    };
    stream();
  };

  const handleSave = () => {
    const title = patientName
      ? `AI Note — ${patientName} (${prompt})`
      : `AI Note — ${prompt}`;

    startTransition(async () => {
      await createNoteFromAiAction(title, editedText || generatedText);
      setStage("idle");
      setPrompt("");
      setPatientName("");
      setGeneratedText("");
      setEditedText("");
    });
  };

  const handleReset = () => {
    if (streamRef.current) clearTimeout(streamRef.current);
    setStage("idle");
    setPrompt("");
    setPatientName("");
    setGeneratedText("");
    setEditedText("");
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(editedText || generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="border-purple-200 dark:border-purple-900 dark:bg-slate-900">
      {/* Header */}
      <CardHeader
        className="cursor-pointer select-none pb-3"
        onClick={() => {
          if (stage === "idle") setStage("prompting");
          else if (stage === "prompting") setStage("idle");
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/40">
              <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <CardTitle className="text-base font-semibold">
              Generate Note with AI
            </CardTitle>
            <Badge
              variant="outline"
              className="text-purple-600 border-purple-200 dark:text-purple-400 dark:border-purple-800 text-xs"
            >
              Demo
            </Badge>
          </div>
          {stage === "idle" ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
        <p className="text-xs text-muted-foreground ml-9">
          Describe the encounter — AI drafts a SOAP note instantly.
        </p>
      </CardHeader>

      {/* Body */}
      {stage !== "idle" && (
        <CardContent className="space-y-4">
          {/* Prompt inputs */}
          {(stage === "prompting" || stage === "generating") && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Patient Name (optional)
                </Label>
                <Input
                  placeholder="e.g. Jane Smith"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="dark:bg-slate-800 dark:border-slate-700"
                  disabled={stage === "generating"}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Encounter / Chief Complaint *
                </Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g. lumbar pain follow-up, cervical headache, shoulder assessment"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && stage === "prompting" && handleGenerate()
                    }
                    className="dark:bg-slate-800 dark:border-slate-700"
                    disabled={stage === "generating"}
                    autoFocus
                  />
                  <Button
                    onClick={handleGenerate}
                    disabled={!prompt.trim() || stage === "generating"}
                    className="shrink-0 gap-2 bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {stage === "generating" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                    {stage === "generating" ? "Writing…" : "Generate"}
                  </Button>
                </div>
                {/* Quick suggestions */}
                {stage === "prompting" && (
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {MOCK_AI_TEMPLATES.map((t) => (
                      <button
                        key={t.prompt}
                        type="button"
                        onClick={() => setPrompt(t.prompt)}
                        className="text-xs px-2 py-0.5 rounded-full bg-slate-100 hover:bg-purple-50 hover:text-purple-700 dark:bg-slate-800 dark:hover:bg-purple-900/30 dark:hover:text-purple-300 transition-colors"
                      >
                        {t.prompt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Streaming output */}
          {(stage === "generating" || stage === "done") && generatedText && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {stage === "generating" ? (
                    <span className="flex items-center gap-1.5">
                      <Loader2 className="h-3 w-3 animate-spin text-purple-600" />
                      AI is writing…
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-emerald-600">
                      <CheckCircle2 className="h-3 w-3" />
                      Note ready — review &amp; edit below
                    </span>
                  )}
                </Label>
                {stage === "done" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs gap-1"
                    onClick={handleCopy}
                  >
                    {copied ? (
                      <Check className="h-3 w-3 text-emerald-600" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                )}
              </div>
              <div className="relative">
                <Textarea
                  value={stage === "done" ? editedText : generatedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  readOnly={stage === "generating"}
                  rows={12}
                  className={`font-mono text-xs leading-relaxed resize-none dark:bg-slate-800 dark:border-slate-700 ${
                    stage === "generating"
                      ? "bg-slate-50 dark:bg-slate-900 cursor-wait"
                      : "bg-white dark:bg-slate-800"
                  }`}
                />
                {stage === "generating" && (
                  <span className="absolute bottom-3 right-3 animate-pulse text-purple-500 font-mono text-sm">
                    ▊
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          {stage === "done" && (
            <div className="flex items-center gap-2 pt-1">
              <Button
                onClick={handleSave}
                disabled={isPending}
                className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" />
                )}
                Save to Notes
              </Button>
              <Button
                variant="outline"
                onClick={() => setStage("prompting")}
                className="gap-2"
                disabled={isPending}
              >
                <RefreshCw className="h-4 w-4" />
                Regenerate
              </Button>
              <Button
                variant="ghost"
                onClick={handleReset}
                className="ml-auto text-muted-foreground"
                disabled={isPending}
              >
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
