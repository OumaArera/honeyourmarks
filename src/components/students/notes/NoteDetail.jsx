import React, { useState, useEffect } from "react";
import {
  X, Download, Lock, BookOpen, ChevronRight, ChevronLeft,
  Youtube, Eye, CheckCircle2, AlertCircle, Loader2,
} from "lucide-react";
import ExerciseDetail from "./ExerciseDetail";
import HtmlContent from "../../common/HtmlContent";
import NoteDownloadModal from "./NoteDownloadModal";
import { usePdfDownload } from "../../../hooks/usePdfDownload";
import { getData } from "../../../api/api.service";

// ─── Constants ────────────────────────────────────────────────────────────────

const LEVEL_ORDER  = ["beginner", "intermediate", "expert"];
const LEVEL_CONFIG = {
  beginner:     { label: "Beginner",     color: "#4ade80", bg: "rgba(74,222,128,0.12)",  border: "rgba(74,222,128,0.25)"  },
  intermediate: { label: "Intermediate", color: "#facc15", bg: "rgba(250,204,21,0.12)",  border: "rgba(250,204,21,0.25)"  },
  expert:       { label: "Expert",       color: "#f87171", bg: "rgba(248,113,113,0.12)", border: "rgba(248,113,113,0.25)" },
};

// ─── Watermarked PDF block ────────────────────────────────────────────────────
// No plan   → blurred subscribe gate
// Partial   → iframe viewable + client-side watermark overlay + download
// Full      → clean iframe + download

function PdfBlock({ fileUrl, hasPlan, fullAccess }) {
  if (!fileUrl) return null;

  const isLocked  = !hasPlan;
  const isPartial = hasPlan && !fullAccess;
  const isFull    = hasPlan && fullAccess;

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: "1px solid rgba(255,255,255,0.09)" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{
          background: "rgba(255,255,255,0.04)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div className="flex items-center gap-2">
          <span className="text-base">📄</span>
          <span className="text-sm font-bold text-white">Notes PDF</span>
          {isPartial && (
            <span
              className="text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wide"
              style={{ background: "rgba(250,204,21,0.15)", color: "#facc15" }}
            >
              Watermarked
            </span>
          )}
        </div>

        {isFull && (
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-opacity hover:opacity-80"
            style={{ background: "rgba(46,139,42,0.2)", color: "#4ade80", border: "1px solid rgba(46,139,42,0.3)" }}
          >
            <Download size={12} /> Download
          </a>
        )}
        {isPartial && (
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-opacity hover:opacity-80"
            style={{ background: "rgba(250,204,21,0.12)", color: "#facc15", border: "1px solid rgba(250,204,21,0.25)" }}
          >
            <Download size={12} /> Download
          </a>
        )}
        {isLocked && (
          <span
            className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl"
            style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.3)" }}
          >
            <Lock size={11} /> Locked
          </span>
        )}
      </div>

      {/* PDF viewport */}
      <div className="relative" style={{ height: "220px" }}>
        <iframe
          src={`${fileUrl}#view=FitH&toolbar=0`}
          className="w-full h-full"
          title="Note PDF"
          style={{ pointerEvents: isFull ? "auto" : "none" }}
        />

        {/* No-plan gate */}
        {isLocked && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-2"
            style={{ backdropFilter: "blur(12px)", background: "rgba(10,16,28,0.78)" }}
          >
            <Lock size={22} color="rgba(255,255,255,0.4)" />
            <p className="text-xs font-bold" style={{ color: "rgba(255,255,255,0.5)" }}>
              Subscribe to read & download
            </p>
          </div>
        )}

        {/* Partial: watermark overlay */}
        {isPartial && (
          <div
            className="absolute inset-0 pointer-events-none select-none"
            style={{ zIndex: 10 }}
          >
            {/* Diagonal stripe pattern */}
            <div
              className="absolute inset-0"
              style={{
                background: `repeating-linear-gradient(
                  -45deg,
                  transparent,
                  transparent 55px,
                  rgba(232,74,12,0.035) 55px,
                  rgba(232,74,12,0.035) 56px
                )`,
              }}
            />
            {/* Centre diagonal stamp */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-1"
              style={{ opacity: 0.15, transform: "rotate(-28deg)" }}
            >
              <span className="font-black text-white uppercase tracking-widest"
                style={{ fontSize: "clamp(8px, 2.5vw, 12px)" }}>
                Hone Your Marks
              </span>
              <span className="font-bold text-white uppercase tracking-widest"
                style={{ fontSize: "clamp(7px, 2vw, 10px)" }}>
                www.honeyourmarks.com
              </span>
            </div>
            {/* Footer bar */}
            <div
              className="absolute bottom-0 left-0 right-0 px-3 py-1.5 flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5"
              style={{
                background: "rgba(8,14,26,0.8)",
                borderTop: "1px solid rgba(232,74,12,0.25)",
              }}
            >
              <span className="text-[9px] font-black" style={{ color: "rgba(232,74,12,0.85)" }}>
                www.honeyourmarks.com
              </span>
              <span className="text-[8px]" style={{ color: "rgba(255,255,255,0.38)" }}>
                📞 +254 724 094 472 / +254 748 800 714 &nbsp;·&nbsp; ✉️ ask@honeyourmarks.com
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Level badge ──────────────────────────────────────────────────────────────

function LevelBadge({ level }) {
  const cfg = LEVEL_CONFIG[level] ?? { label: level ?? "—", color: "rgba(255,255,255,0.5)", bg: "rgba(255,255,255,0.06)", border: "rgba(255,255,255,0.12)" };
  return (
    <span
      className="text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide shrink-0"
      style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
    >
      {cfg.label}
    </span>
  );
}

// ─── Single exercise row ──────────────────────────────────────────────────────

function ExerciseRow({ exercise, hasPlan, fullAccess, isAttempted, onOpen }) {
  return (
    <button
      onClick={() => onOpen(exercise)}
      className="w-full flex items-center gap-3 p-3 rounded-xl transition-all active:scale-[0.98] text-left"
      style={{
        background: isAttempted ? "rgba(74,222,128,0.04)" : "rgba(255,255,255,0.03)",
        border: `1px solid ${isAttempted ? "rgba(74,222,128,0.18)" : "rgba(255,255,255,0.07)"}`,
      }}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: isAttempted ? "rgba(74,222,128,0.12)" : "rgba(27,127,196,0.15)" }}
      >
        {isAttempted
          ? <CheckCircle2 size={14} color="#4ade80" />
          : <BookOpen size={14} color="#1B7FC4" />
        }
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-white truncate">
          {exercise.title ?? exercise.name ?? "Exercise"}
        </p>
        {exercise.instructions && (
          <p className="text-xs truncate mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
            {exercise.instructions}
          </p>
        )}
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <LevelBadge level={exercise.level} />
        {!hasPlan && <Lock size={12} color="rgba(255,255,255,0.25)" />}
        {isAttempted && (
          <span
            className="text-[9px] font-black px-2 py-0.5 rounded-full"
            style={{ background: "rgba(74,222,128,0.12)", color: "#4ade80" }}
          >
            Done
          </span>
        )}
        {hasPlan && fullAccess && (
          <span
            className="text-[9px] font-black px-2 py-0.5 rounded-full"
            style={{ background: "rgba(46,139,42,0.12)", color: "#4ade80" }}
          >
            Submit
          </span>
        )}
        <ChevronRight size={14} color="rgba(255,255,255,0.2)" />
      </div>
    </button>
  );
}

// ─── Exercises grouped by level with pagination ───────────────────────────────

const PAGE_SIZE = 5; // exercises shown per level-group page

function LevelGroup({ level, list, hasPlan, fullAccess, submittedExerciseIds, onOpen }) {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(list.length / PAGE_SIZE);
  const visible    = list.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const attempted  = list.filter(ex => submittedExerciseIds.has(ex.id)).length;

  const cfg = LEVEL_CONFIG[level] ?? {
    label: "Other", color: "rgba(255,255,255,0.5)",
    bg: "rgba(255,255,255,0.05)", border: "rgba(255,255,255,0.1)",
  };

  return (
    <div>
      {/* Level header */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: cfg.color }}>
          {cfg.label}
        </span>
        <div className="flex-1 h-px" style={{ background: `${cfg.color}28` }} />
        <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.25)" }}>
          {attempted}/{list.length}
        </span>
      </div>

      {/* Exercise rows */}
      <div className="space-y-2">
        {visible.map(ex => (
          <ExerciseRow
            key={ex.id}
            exercise={ex}
            hasPlan={hasPlan}
            fullAccess={fullAccess}
            isAttempted={submittedExerciseIds.has(ex.id)}
            onOpen={onOpen}
          />
        ))}
      </div>

      {/* Pagination controls — only when needed */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-2 px-1">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="flex items-center gap-1 text-[10px] font-black disabled:opacity-30 transition-opacity hover:opacity-70"
            style={{ color: cfg.color }}
          >
            <ChevronLeft size={12} /> Prev
          </button>
          <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>
            {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="flex items-center gap-1 text-[10px] font-black disabled:opacity-30 transition-opacity hover:opacity-70"
            style={{ color: cfg.color }}
          >
            Next <ChevronRight size={12} />
          </button>
        </div>
      )}
    </div>
  );
}

function ExercisesByLevel({ exercises, hasPlan, fullAccess, submittedExerciseIds, onOpen }) {
  if (!exercises.length) return null;

  const ordered = LEVEL_ORDER.reduce((acc, level) => {
    const list = exercises.filter(ex => ex.level === level);
    if (list.length) acc.push({ level, list });
    return acc;
  }, []);
  const other = exercises.filter(ex => !LEVEL_ORDER.includes(ex.level));
  if (other.length) ordered.push({ level: "other", list: other });

  const totalAttempted = exercises.filter(ex => submittedExerciseIds.has(ex.id)).length;

  return (
    <div className="px-1 pb-1">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-black uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>
          Exercises ({exercises.length})
        </p>
        {hasPlan && (
          <span className="text-[10px] font-semibold" style={{ color: "rgba(255,255,255,0.3)" }}>
            {totalAttempted}/{exercises.length} attempted
          </span>
        )}
      </div>

      <div className="space-y-4">
        {ordered.map(({ level, list }) => (
          <LevelGroup
            key={level}
            level={level}
            list={list}
            hasPlan={hasPlan}
            fullAccess={fullAccess}
            submittedExerciseIds={submittedExerciseIds}
            onOpen={onOpen}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Full note content modal (fetches topics/{id}/) ───────────────────────────

function NoteContentView({ noteId, onClose }) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getData(`topics/${noteId}/`);
        setData(res);
      } catch {
        setError("Could not load note content.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [noteId]);

  return (
    <div
      className="fixed inset-0 z-70 flex items-end sm:items-center justify-center"
      style={{ background: "rgba(0,0,0,0.88)", backdropFilter: "blur(14px)" }}
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-lg sm:mx-4 sm:rounded-3xl rounded-t-3xl flex flex-col overflow-hidden"
        style={{
          background: "#0A1220",
          border: "1px solid rgba(255,255,255,0.1)",
          maxHeight: "92dvh",
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
            <span
              className="text-[10px] font-black uppercase tracking-widest mb-1 inline-block"
              style={{ color: "rgba(27,127,196,0.8)" }}
            >
              Full Notes
            </span>
            {data && (
              <h2 className="font-black text-white text-sm sm:text-base leading-snug">
                {data.title ?? "Untitled"}
              </h2>
            )}
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

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">
          {loading && (
            <div className="space-y-3 animate-pulse">
              {[0.6, 0.9, 0.75, 0.85, 0.5].map((w, i) => (
                <div key={i} className="h-3 rounded-full"
                  style={{ width: `${w * 100}%`, background: "rgba(255,255,255,0.07)" }} />
              ))}
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-sm" style={{ color: "#f87171" }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          {data && !loading && (
            <>
              {data.description && (
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                  {data.description}
                </p>
              )}

              {/* Quick stats */}
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                  📝 {data.exercises?.length ?? 0} exercise{data.exercises?.length !== 1 ? "s" : ""}
                </span>
                {data.video_link && (
                  <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                    🎬 Video lesson available
                  </span>
                )}
              </div>

              {/* HTML content */}
              {data.content && (
                <div
                  className="rounded-xl p-4"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <HtmlContent html={data.content} />
                </div>
              )}

              {/* Video link */}
              {data.video_link && (
                <a
                  href={data.video_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl transition-opacity hover:opacity-80"
                  style={{ background: "rgba(255,0,0,0.08)", border: "1px solid rgba(255,0,0,0.2)" }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: "rgba(255,0,0,0.15)" }}
                  >
                    <Youtube size={16} color="#f87171" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white">Watch Recorded Lesson</p>
                    <p className="text-xs truncate mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                      {data.video_link}
                    </p>
                  </div>
                  <ChevronRight size={14} color="rgba(255,255,255,0.2)" />
                </a>
              )}
            </>
          )}
          <div className="h-2" />
        </div>
      </div>
    </div>
  );
}

// ─── NoteDetail ───────────────────────────────────────────────────────────────

export default function NoteDetail({
  note,
  student,
  hasPlan,
  fullAccess,
  submissions,
  submittedExerciseIds,
  onClose,
  onSubmissionAdded,
}) {
  const [activeExercise, setActiveExercise]   = useState(null);
  const [showNoteContent, setShowNoteContent] = useState(false);
  const [showDownload, setShowDownload]       = useState(false);

  const { downloading, error: pdfError, downloadNotesPdf } = usePdfDownload();

  const fileUrl     = note.file ?? note.pdf ?? note.document ?? null;
  const exercises   = note.exercises ?? [];
  const subject     = note.subject?.name ?? note.subject_name ?? null;
  const authorFirst = note.author?.first_name ?? note.teacher?.first_name ?? "";
  const authorLast  = note.author?.last_name  ?? note.teacher?.last_name  ?? "";
  const authorName  = [authorFirst, authorLast].filter(Boolean).join(" ") || "Unknown";

  const activeSubmission = activeExercise
    ? (submissions?.find(s => s.exercise?.id === activeExercise.id) ?? null)
    : null;

  const handleDownload = async (selectedExerciseIds) => {
    await downloadNotesPdf(note, selectedExerciseIds, !fullAccess);
    if (!pdfError) setShowDownload(false);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
        style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(10px)" }}
        onClick={onClose}
      >
        {/*
          Mobile  : bottom-sheet that stops 64 px above the viewport bottom
                    so the BottomNav (h-16) stays fully tappable.
                    `mb-16` lifts the sheet; max-height accounts for that offset
                    plus a small top gap so it never reaches the status bar.
          Desktop : centred modal capped at 92 dvh, no bottom margin needed.
        */}
        <div
          className="
            w-full rounded-3xl flex flex-col overflow-hidden
            mb-16
            sm:mb-0 sm:max-w-lg sm:mx-4
          "
          style={{
            background: "#0D1520",
            border: "1px solid rgba(255,255,255,0.1)",
            maxHeight: "calc(100dvh - 80px)", // 64px nav + 16px top breathe
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
              {subject && (
                <span
                  className="text-[10px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full mb-2 inline-block"
                  style={{ background: "rgba(232,74,12,0.15)", color: "#E84A0C" }}
                >
                  {subject}
                </span>
              )}
              <h2 className="font-black text-white text-base leading-snug">
                {note.title ?? note.name ?? "Untitled"}
              </h2>
              <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                By {authorName}
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
          <div className="overflow-y-auto flex-1 px-5 py-4 space-y-5">

            {note.description && (
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                {note.description}
              </p>
            )}

            {/* Action buttons */}
            {hasPlan && (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setShowNoteContent(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-opacity hover:opacity-80"
                  style={{
                    background: "rgba(27,127,196,0.15)",
                    border: "1px solid rgba(27,127,196,0.3)",
                    color: "#1B7FC4",
                  }}
                >
                  <Eye size={13} /> View Notes
                </button>

                {/* Download PDF button */}
                <button
                  onClick={() => setShowDownload(true)}
                  disabled={downloading}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-opacity hover:opacity-80 disabled:opacity-50"
                  style={{
                    background: "rgba(232,74,12,0.13)",
                    border: "1px solid rgba(232,74,12,0.28)",
                    color: "#E84A0C",
                  }}
                >
                  {downloading
                    ? <><Loader2 size={13} className="animate-spin" /> Generating…</>
                    : <><Download size={13} /> Download PDF</>
                  }
                </button>

                {note.video_link && (
                  <a
                    href={note.video_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-opacity hover:opacity-80"
                    style={{
                      background: "rgba(255,0,0,0.09)",
                      border: "1px solid rgba(255,0,0,0.2)",
                      color: "#f87171",
                    }}
                  >
                    <Youtube size={13} /> Watch Lesson
                  </a>
                )}
              </div>
            )}

            {/* Embedded PDF preview block */}
            <PdfBlock fileUrl={fileUrl} hasPlan={hasPlan} fullAccess={fullAccess} />

            {/* Exercises — scrollable container with pagination per level */}
            {exercises.length > 0 && (
              hasPlan ? (
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{ border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  {/* Sticky exercises header */}
                  <div
                    className="px-4 py-2.5 flex items-center justify-between sticky top-0"
                    style={{
                      background: "#0D1520",
                      borderBottom: "1px solid rgba(255,255,255,0.06)",
                      zIndex: 1,
                    }}
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>
                      Exercises ({exercises.length})
                    </span>
                    <span className="text-[10px] font-semibold" style={{ color: "rgba(255,255,255,0.25)" }}>
                      {exercises.filter(ex => submittedExerciseIds.has(ex.id)).length}/{exercises.length} attempted
                    </span>
                  </div>

                  {/* Scrollable exercise list */}
                  <div
                    className="overflow-y-auto px-3 py-3 space-y-4"
                    style={{
                      maxHeight: "300px",
                      scrollbarWidth: "thin",
                      scrollbarColor: "rgba(255,255,255,0.08) transparent",
                    }}
                  >
                    {(() => {
                      const ordered = LEVEL_ORDER.reduce((acc, level) => {
                        const list = exercises.filter(ex => ex.level === level);
                        if (list.length) acc.push({ level, list });
                        return acc;
                      }, []);
                      const other = exercises.filter(ex => !LEVEL_ORDER.includes(ex.level));
                      if (other.length) ordered.push({ level: "other", list: other });

                      return ordered.map(({ level, list }) => (
                        <LevelGroup
                          key={level}
                          level={level}
                          list={list}
                          hasPlan={hasPlan}
                          fullAccess={fullAccess}
                          submittedExerciseIds={submittedExerciseIds}
                          onOpen={setActiveExercise}
                        />
                      ));
                    })()}
                  </div>
                </div>
              ) : (
                <div
                  className="rounded-xl p-3 flex items-center gap-2"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <Lock size={13} color="rgba(255,255,255,0.25)" />
                  <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                    {exercises.length} exercise{exercises.length !== 1 ? "s" : ""} — subscribe to access
                  </span>
                </div>
              )
            )}

            {!hasPlan && (
              <div
                className="rounded-2xl p-4 text-center"
                style={{ background: "rgba(232,74,12,0.07)", border: "1px solid rgba(232,74,12,0.18)" }}
              >
                <Lock size={20} color="rgba(232,74,12,0.6)" className="mx-auto mb-2" />
                <p className="text-sm font-black text-white">Full access required</p>
                <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
                  Subscribe to view notes, download PDFs and attempt exercises.
                </p>
              </div>
            )}

            <div className="h-2" />
          </div>
        </div>
      </div>

      {/* Download modal */}
      {showDownload && (
        <NoteDownloadModal
          note={note}
          isWatermarked={!fullAccess}
          onDownload={handleDownload}
          downloading={downloading}
          error={pdfError}
          onClose={() => setShowDownload(false)}
        />
      )}

      {/* Full note content modal */}
      {showNoteContent && (
        <NoteContentView noteId={note.id} onClose={() => setShowNoteContent(false)} />
      )}

      {/* Exercise detail modal */}
      {activeExercise && (
        <ExerciseDetail
          exercise={activeExercise}
          note={note}
          student={student}
          hasPlan={hasPlan}
          fullAccess={fullAccess}
          existingSubmission={activeSubmission}
          onClose={() => setActiveExercise(null)}
          onSubmissionAdded={(sub) => {
            onSubmissionAdded?.(sub);
            setActiveExercise(null);
          }}
        />
      )}
    </>
  );
}