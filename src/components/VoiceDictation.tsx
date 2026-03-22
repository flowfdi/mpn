"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VoiceDictationProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

export default function VoiceDictation({
  onTranscript,
  disabled,
}: VoiceDictationProps) {
  const [state, setState] = useState<"idle" | "listening" | "unsupported">("idle");
  const [interimText, setInterimText] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    const API = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!API) setState("unsupported");
  }, []);

  const start = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    const API = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!API) return;

    const recognition = new API();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => setState("listening");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (e: any) => {
      let interim = "";
      let final = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) final += t;
        else interim += t;
      }
      setInterimText(interim);
      if (final) {
        onTranscript(final);
        setInterimText("");
      }
    };

    recognition.onerror = () => {
      setState("idle");
      setInterimText("");
    };

    recognition.onend = () => {
      setState("idle");
      setInterimText("");
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stop = () => {
    recognitionRef.current?.stop();
    setState("idle");
    setInterimText("");
  };

  if (state === "unsupported") {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-muted-foreground">
        <MicOff className="h-3.5 w-3.5" />
        Voice dictation not supported in this browser
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {state === "listening" ? (
        <Button
          type="button"
          size="sm"
          onClick={stop}
          className="gap-2 bg-red-500 hover:bg-red-600 text-white shrink-0"
        >
          <Square className="h-3.5 w-3.5 fill-white" />
          Stop
        </Button>
      ) : (
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={start}
          disabled={disabled}
          className={cn(
            "gap-2 shrink-0 border-forest-300 text-forest-700 hover:bg-forest-50",
            "disabled:opacity-40"
          )}
        >
          <Mic className="h-3.5 w-3.5" />
          Dictate
        </Button>
      )}

      {/* Waveform + interim text */}
      <div className="flex items-center gap-2 min-w-0">
        {state === "listening" && (
          <div className="flex items-end gap-px h-5 shrink-0">
            {[...Array(7)].map((_, i) => (
              <span key={i} className="waveform-bar" />
            ))}
          </div>
        )}
        {interimText ? (
          <p className="text-xs text-muted-foreground italic truncate">
            {interimText}
          </p>
        ) : state === "listening" ? (
          <p className="text-xs text-forest-600 font-medium">Listening…</p>
        ) : (
          <p className="text-xs text-muted-foreground">Click to dictate into active tab</p>
        )}
      </div>
    </div>
  );
}
