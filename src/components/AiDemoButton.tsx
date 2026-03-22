"use client";

import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";

export default function AiDemoButton() {
  return (
    <Button
      variant="outline"
      className="gap-2 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300"
      onClick={() => alert("AI works!")}
    >
      <Brain className="h-4 w-4" />
      AI Demo
    </Button>
  );
}
