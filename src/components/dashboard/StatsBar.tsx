import { FileText, Sparkles, Clock, TrendingUp } from "lucide-react";

interface StatsBarProps {
  totalNotes: number;
  aiNotes: number;
}

export default function StatsBar({ totalNotes, aiNotes }: StatsBarProps) {
  const manualNotes = totalNotes - aiNotes;

  const stats = [
    {
      icon: <FileText className="h-4 w-4 text-blue-600" />,
      label: "Total Notes",
      value: totalNotes,
      bg: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      icon: <Sparkles className="h-4 w-4 text-purple-600" />,
      label: "AI Generated",
      value: aiNotes,
      bg: "bg-purple-50 dark:bg-purple-950/30",
    },
    {
      icon: <Clock className="h-4 w-4 text-slate-500" />,
      label: "Manual",
      value: manualNotes,
      bg: "bg-slate-50 dark:bg-slate-800/50",
    },
    {
      icon: <TrendingUp className="h-4 w-4 text-emerald-600" />,
      label: "This Session",
      value: totalNotes,
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map((s) => (
        <div
          key={s.label}
          className={`${s.bg} rounded-xl px-4 py-3 flex items-center gap-3`}
        >
          <div>{s.icon}</div>
          <div>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 leading-none">
              {s.value}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
