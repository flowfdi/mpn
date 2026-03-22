import { FileText, Sparkles, Clock, CalendarDays } from "lucide-react";

interface StatsBarProps {
  totalNotes: number;
  aiNotes: number;
}

export default function StatsBar({ totalNotes, aiNotes }: StatsBarProps) {
  const manualNotes = totalNotes - aiNotes;
  const today = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const stats = [
    {
      icon: <FileText className="h-5 w-5 text-forest-600" />,
      label: "Total Notes",
      value: totalNotes,
      sub: "all time",
      bg: "bg-forest-50 border-forest-200",
      val: "text-forest-700",
    },
    {
      icon: <Sparkles className="h-5 w-5 text-purple-600" />,
      label: "AI Generated",
      value: aiNotes,
      sub: "by AI",
      bg: "bg-purple-50 border-purple-200",
      val: "text-purple-700",
    },
    {
      icon: <Clock className="h-5 w-5 text-blue-600" />,
      label: "Manual",
      value: manualNotes,
      sub: "hand-typed",
      bg: "bg-blue-50 border-blue-200",
      val: "text-blue-700",
    },
    {
      icon: <CalendarDays className="h-5 w-5 text-amber-600" />,
      label: "Today",
      value: today,
      sub: new Date().toLocaleDateString("en-US", { weekday: "long" }),
      bg: "bg-amber-50 border-amber-200",
      val: "text-amber-700",
      isDate: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((s) => (
        <div
          key={s.label}
          className={`${s.bg} border rounded-xl px-4 py-3.5 flex items-center gap-3`}
        >
          <div className="p-2 bg-white/70 rounded-lg shadow-sm">{s.icon}</div>
          <div>
            <p className={`text-xl font-bold leading-none ${s.val}`}>
              {s.value}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5 font-medium">
              {s.label}
            </p>
            <p className="text-[10px] text-muted-foreground/60">{s.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
