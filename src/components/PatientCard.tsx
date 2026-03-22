"use client";

import type { MockPatient } from "@/lib/mockData";
import { Activity, Calendar, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PatientCardProps {
  patient: MockPatient;
  isSelected: boolean;
  onSelect: (patient: MockPatient) => void;
}

export default function PatientCard({
  patient,
  isSelected,
  onSelect,
}: PatientCardProps) {
  return (
    <button
      onClick={() => onSelect(patient)}
      className={cn(
        "w-full text-left px-3 py-3 rounded-xl border transition-all duration-150 group",
        isSelected
          ? "bg-forest-50 border-forest-300 shadow-sm"
          : "bg-white border-slate-100 hover:border-forest-200 hover:bg-forest-50/40"
      )}
    >
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div
          className={cn(
            "h-9 w-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm",
            patient.avatarColor
          )}
        >
          {patient.initials}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p
            className={cn(
              "text-sm font-semibold leading-tight truncate",
              isSelected ? "text-forest-800" : "text-slate-800"
            )}
          >
            {patient.firstName} {patient.lastName}
          </p>
          <p className="text-xs text-muted-foreground truncate mt-0.5">
            {patient.condition} · {patient.age}y
          </p>
        </div>

        {/* Chevron */}
        <ChevronRight
          className={cn(
            "h-3.5 w-3.5 shrink-0 transition-transform",
            isSelected
              ? "text-forest-500 translate-x-0"
              : "text-muted-foreground -translate-x-1 group-hover:translate-x-0"
          )}
        />
      </div>

      {/* Footer row */}
      <div className="flex items-center gap-3 mt-2 ml-12">
        <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <Activity className="h-2.5 w-2.5" />
          {patient.visits} visits
        </span>
        <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <Calendar className="h-2.5 w-2.5" />
          {patient.lastVisit}
        </span>
      </div>
    </button>
  );
}
