import { FileText, Sparkles, ArrowDown } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="text-center py-20 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-900">
      <div className="relative inline-flex items-center justify-center mb-4">
        <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-800">
          <FileText className="h-8 w-8 text-slate-400" />
        </div>
        <div className="absolute -top-1 -right-1 p-1.5 rounded-full bg-purple-100 dark:bg-purple-900/40">
          <Sparkles className="h-3.5 w-3.5 text-purple-600" />
        </div>
      </div>
      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1">
        No notes yet
      </h3>
      <p className="text-sm text-muted-foreground mb-4 max-w-xs mx-auto">
        Add your first note manually or use AI to generate a clinical SOAP note in seconds.
      </p>
      <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <ArrowDown className="h-3 w-3 animate-bounce" />
        <span>Use the forms above to get started</span>
      </div>
    </div>
  );
}
