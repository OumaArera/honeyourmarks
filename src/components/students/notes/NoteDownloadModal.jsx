import React, { useState } from "react";
import { X, Download, FileText, CheckSquare, Square, Loader2, AlertCircle } from "lucide-react";

const LEVEL_CONFIG = {
  beginner:     { label: "Beginner",     color: "#4ade80", bg: "rgba(74,222,128,0.12)"  },
  intermediate: { label: "Intermediate", color: "#facc15", bg: "rgba(250,204,21,0.12)"  },
  expert:       { label: "Expert",       color: "#f87171", bg: "rgba(248,113,113,0.12)" },
};

function ExerciseCheckRow({ exercise, checked, onToggle }) {
  const cfg = LEVEL_CONFIG[exercise.level] ?? { label: exercise.level ?? "—", color: "rgba(255,255,255,0.4)", bg: "rgba(255,255,255,0.06)" };
  return (
    <button
      onClick={() => onToggle(exercise.id)}
      className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all active:scale-[0.98]"
      style={{
        background: checked ? "rgba(27,127,196,0.08)" : "rgba(255,255,255,0.03)",
        border: `1px solid ${checked ? "rgba(27,127,196,0.25)" : "rgba(255,255,255,0.07)"}`,
      }}
    >
      {checked
        ? <CheckSquare size={16} color="#1B7FC4" className="shrink-0" />
        : <Square size={16} color="rgba(255,255,255,0.25)" className="shrink-0" />
      }
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-white truncate">{exercise.title ?? "Exercise"}</p>
        {exercise.instructions && (
          <p className="text-xs truncate mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
            {exercise.instructions}
          </p>
        )}
      </div>
      <span
        className="text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide shrink-0"
        style={{ background: cfg.bg, color: cfg.color }}
      >
        {cfg.label}
      </span>
    </button>
  );
}

export default function NoteDownloadModal({ note, isWatermarked, onDownload, downloading, error, onClose }) {
  const exercises = note.exercises ?? [];
  const [selected, setSelected] = useState(new Set());

  const toggle = (id) =>
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const selectAll   = () => setSelected(new Set(exercises.map(e => e.id)));
  const deselectAll = () => setSelected(new Set());
  const allSelected = exercises.length > 0 && selected.size === exercises.length;

  return (
    <div
      className="fixed inset-0 z-80 flex items-end sm:items-center justify-center"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(14px)" }}
      onClick={onClose}
    >
      {/*
        Mobile  : mb-16 lifts the sheet above the BottomNav (h-16 = 64px).
                  maxHeight accounts for the nav + 16px top gap.
        Desktop : mb-0 reset, standard centred modal.
      */}
      <div
        className="
          w-full rounded-t-3xl flex flex-col
          mb-16
          sm:mb-0 sm:max-w-md sm:mx-4 sm:rounded-3xl
        "
        style={{
          background: "#0D1520",
          border: "1px solid rgba(255,255,255,0.1)",
          maxHeight: "calc(100dvh - 80px)",
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden shrink-0">
          <div className="w-10 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.18)" }} />
        </div>

        {/* Header */}
        <div
          className="px-5 pt-3 pb-4 flex items-start justify-between gap-3 shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <FileText size={14} color="#E84A0C" />
              <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: "#E84A0C" }}>
                Download PDF
              </span>
              {isWatermarked && (
                <span
                  className="text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase"
                  style={{ background: "rgba(250,204,21,0.15)", color: "#facc15" }}
                >
                  Watermarked
                </span>
              )}
            </div>
            <h2 className="font-black text-white text-sm leading-snug truncate">
              {note.title ?? "Notes"}
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
              Select exercises to include alongside the notes
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 hover:opacity-70 transition-opacity"
            style={{ background: "rgba(255,255,255,0.08)" }}
            aria-label="Close"
          >
            <X size={15} color="rgba(255,255,255,0.6)" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-3 min-h-0">

          {/* Notes included notice */}
          <div
            className="flex items-center gap-2 p-3 rounded-xl"
            style={{ background: "rgba(27,127,196,0.08)", border: "1px solid rgba(27,127,196,0.18)" }}
          >
            <CheckSquare size={14} color="#1B7FC4" className="shrink-0" />
            <p className="text-xs" style={{ color: "rgba(27,127,196,0.9)" }}>
              Full lesson notes are always included in the PDF.
            </p>
          </div>

          {exercises.length > 0 && (
            <>
              {/* Select all toggle */}
              <div className="flex items-center justify-between">
                <p className="text-xs font-black uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>
                  Exercises ({exercises.length})
                </p>
                <button
                  onClick={allSelected ? deselectAll : selectAll}
                  className="text-[10px] font-black transition-opacity hover:opacity-80"
                  style={{ color: "#1B7FC4" }}
                >
                  {allSelected ? "Deselect all" : "Select all"}
                </button>
              </div>

              <div className="space-y-2">
                {exercises.map(ex => (
                  <ExerciseCheckRow
                    key={ex.id}
                    exercise={ex}
                    checked={selected.has(ex.id)}
                    onToggle={toggle}
                  />
                ))}
              </div>
            </>
          )}

          {error && (
            <div className="flex items-center gap-2 text-xs rounded-xl p-3"
              style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)", color: "#f87171" }}>
              <AlertCircle size={14} className="shrink-0" /> {error}
            </div>
          )}
        </div>

        {/* Fixed footer CTA */}
        <div
          className="px-5 py-4 shrink-0"
          style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
        >
          <button
            onClick={() => onDownload(selected)}
            disabled={downloading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-black transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ background: "#E84A0C", color: "#fff" }}
          >
            {downloading
              ? <><Loader2 size={16} className="animate-spin" /> Generating PDF…</>
              : <><Download size={16} /> Download PDF{selected.size > 0 ? ` + ${selected.size} exercise${selected.size !== 1 ? "s" : ""}` : ""}</>
            }
          </button>
          <p className="text-center text-[10px] mt-2" style={{ color: "rgba(255,255,255,0.25)" }}>
            Powered by Hone Your Marks · www.honeyourmarks.com
          </p>
        </div>
      </div>
    </div>
  );
}