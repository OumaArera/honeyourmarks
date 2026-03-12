import React, { useState } from "react";
import { X, Lock, Download, FileText, Youtube, ChevronRight, CheckCircle2, Clock, Loader2 } from "lucide-react";
import SubmissionForm from "./SubmissionForm";
import HtmlContent from "../../common/HtmlContent";
import { usePdfDownload } from "../../../hooks/usePdfDownload";

// ─── Level config (shared with NoteDetail) ────────────────────────────────────

const LEVEL_CONFIG = {
  beginner:     { label: "Beginner",     color: "#4ade80", bg: "rgba(74,222,128,0.12)",  border: "rgba(74,222,128,0.25)"  },
  intermediate: { label: "Intermediate", color: "#facc15", bg: "rgba(250,204,21,0.12)",  border: "rgba(250,204,21,0.25)"  },
  expert:       { label: "Expert",       color: "#f87171", bg: "rgba(248,113,113,0.12)", border: "rgba(248,113,113,0.25)" },
};

function LevelBadge({ level }) {
  const cfg = LEVEL_CONFIG[level] ?? { label: level ?? "—", color: "rgba(255,255,255,0.5)", bg: "rgba(255,255,255,0.06)", border: "rgba(255,255,255,0.12)" };
  return (
    <span
      className="text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide"
      style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
    >
      {cfg.label}
    </span>
  );
}

// ─── Locked overlay ───────────────────────────────────────────────────────────

function LockedOverlay() {
  return (
    <div
      className="rounded-2xl p-6 flex flex-col items-center gap-3 text-center"
      style={{ background: "rgba(232,74,12,0.06)", border: "1px solid rgba(232,74,12,0.18)" }}
    >
      <Lock size={28} color="rgba(232,74,12,0.5)" />
      <div>
        <p className="font-black text-white text-sm">Subscription Required</p>
        <p className="text-xs mt-1 leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
          Subscribe to access exercise content and submit responses.
        </p>
      </div>
    </div>
  );
}

// ─── Partial-access notice ────────────────────────────────────────────────────

function PartialNotice() {
  return (
    <div
      className="rounded-xl p-3 flex items-start gap-2"
      style={{ background: "rgba(27,127,196,0.1)", border: "1px solid rgba(27,127,196,0.25)" }}
    >
      <span className="text-base shrink-0">ℹ️</span>
      <p className="text-xs leading-relaxed" style={{ color: "rgba(27,127,196,0.9)" }}>
        Your plan includes viewing exercises. Upgrade to <strong>Full Access</strong> to submit responses.
      </p>
    </div>
  );
}

// ─── Exercise PDF block ───────────────────────────────────────────────────────

function ExercisePdf({ fileUrl }) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.09)" }}>
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="flex items-center gap-2">
          <FileText size={14} color="rgba(255,255,255,0.5)" />
          <span className="text-sm font-bold text-white">Exercise PDF</span>
        </div>
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          download
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-opacity hover:opacity-80"
          style={{ background: "rgba(46,139,42,0.2)", color: "#4ade80", border: "1px solid rgba(46,139,42,0.3)" }}
        >
          <Download size={11} /> Download
        </a>
      </div>
      <div style={{ height: 220 }}>
        <iframe src={`${fileUrl}#toolbar=0`} className="w-full h-full" title="Exercise PDF" />
      </div>
    </div>
  );
}

// ─── Existing submission view ─────────────────────────────────────────────────

function SubmissionView({ submission }) {
  const submittedAt = new Date(submission.created_at).toLocaleDateString("en-KE", {
    year: "numeric", month: "short", day: "numeric",
  });

  return (
    <div className="space-y-4">
      {/* Status banner */}
      <div
        className="rounded-xl p-3 flex items-center gap-3"
        style={{
          background: submission.is_marked ? "rgba(74,222,128,0.08)" : "rgba(250,204,21,0.08)",
          border: `1px solid ${submission.is_marked ? "rgba(74,222,128,0.2)" : "rgba(250,204,21,0.2)"}`,
        }}
      >
        {submission.is_marked
          ? <CheckCircle2 size={18} color="#4ade80" className="shrink-0" />
          : <Clock size={18} color="#facc15" className="shrink-0" />
        }
        <div>
          <p className="text-sm font-black" style={{ color: submission.is_marked ? "#4ade80" : "#facc15" }}>
            {submission.is_marked ? "Marked" : "Awaiting marking"}
          </p>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
            Submitted {submittedAt}
          </p>
        </div>
      </div>

      {/* Supervisor comment */}
      {submission.supervisor_comment && (
        <div
          className="rounded-xl p-4"
          style={{ background: "rgba(27,127,196,0.08)", border: "1px solid rgba(27,127,196,0.2)" }}
        >
          <p className="text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: "rgba(27,127,196,0.7)" }}>
            Supervisor Comment
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
            {submission.supervisor_comment}
          </p>
        </div>
      )}

      {/* Submitted images */}
      {submission.images?.length > 0 && (
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>
            Your Submission ({submission.images.length} image{submission.images.length !== 1 ? "s" : ""})
          </p>
          <div className="grid grid-cols-2 gap-2">
            {submission.images.map(img => (
              <a key={img.id} href={img.image} target="_blank" rel="noopener noreferrer">
                <img
                  src={img.image}
                  alt="Submission"
                  className="w-full rounded-xl object-cover"
                  style={{ height: "120px", border: "1px solid rgba(255,255,255,0.08)" }}
                />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ExerciseDetail ───────────────────────────────────────────────────────────

export default function ExerciseDetail({
  exercise,
  note,
  student,
  hasPlan,
  fullAccess,
  existingSubmission,   // most recent submission object if attempted, else null
  onClose,
  onSubmissionAdded,
}) {
  const fileUrl     = exercise.file ?? exercise.pdf ?? exercise.document ?? null;
  const isAttempted = Boolean(existingSubmission);
  const { downloading, downloadExercisePdf } = usePdfDownload();

  // "My Submission" appears when there is a prior submission to review.
  // "Submit" always appears for full-access subscribers regardless of attempt state.
  const tabs = [
    "Exercise",
    ...(hasPlan && isAttempted ? ["My Submission"] : []),
    ...(hasPlan && fullAccess ? ["Submit"] : []),
  ];
  const [activeTab, setActiveTab] = useState("Exercise");

  return (
    <div
      className="fixed inset-0 z-60 flex items-end justify-center"
      style={{ background: "rgba(13, 21, 32, 0.75)", backdropFilter: "blur(16px)" }}
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-lg sm:mx-4 sm:rounded-3xl rounded-3xl flex flex-col overflow-hidden"
        style={{
          background: "#0B1322",
          border: "1px solid rgba(255,255,255,0.1)",
          maxHeight: "calc(100dvh - 64px)",
          minHeight: "min(55dvh, 400px)",
          marginBottom: "32px",
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
              <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: "rgba(27,127,196,0.8)" }}>
                Exercise
              </span>
              <LevelBadge level={exercise.level} />
              {isAttempted && (
                <span
                  className="text-[9px] font-black px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(74,222,128,0.12)", color: "#4ade80" }}
                >
                  ✓ Done
                </span>
              )}
            </div>
            <h2 className="font-black text-white text-sm sm:text-base leading-snug">
              {exercise.title ?? exercise.name ?? "Exercise"}
            </h2>
            {note?.title && (
              <p className="text-xs mt-0.5 truncate" style={{ color: "rgba(255,255,255,0.3)" }}>
                From: {note.title}
              </p>
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

        {/* Tab bar — only when there are multiple tabs */}
        {tabs.length > 1 && (
          <div
            className="flex shrink-0"
            style={{
              background: "rgba(255,255,255,0.02)",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="flex-1 py-3 text-xs font-black transition-colors relative"
                style={{
                  color: activeTab === tab ? "#E84A0C" : "rgba(255,255,255,0.35)",
                  background: activeTab === tab ? "rgba(232,74,12,0.07)" : "transparent",
                }}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: "#E84A0C" }} />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">

          {/* No plan */}
          {!hasPlan && <LockedOverlay />}

          {/* Has plan */}
          {hasPlan && (
            <>
              {/* ── Exercise tab ── */}
              {activeTab === "Exercise" && (
                <>
                  {exercise.instructions && (
                    <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
                      {exercise.instructions}
                    </p>
                  )}

                  {exercise.content && (
                    <div
                      className="rounded-xl p-4"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                    >
                      <HtmlContent html={exercise.content} />
                    </div>
                  )}

                  {fileUrl && <ExercisePdf fileUrl={fileUrl} />}

                  {/* Video link */}
                  {exercise.video_link && (
                    <a
                      href={exercise.video_link}
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
                        <p className="text-sm font-bold text-white">Watch Exercise Video</p>
                        <p className="text-xs truncate mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                          {exercise.video_link}
                        </p>
                      </div>
                      <ChevronRight size={14} color="rgba(255,255,255,0.2)" />
                    </a>
                  )}

                  {!fullAccess && <PartialNotice />}

                  {/* Download exercise as PDF */}
                  {hasPlan && (
                    <button
                      onClick={() => downloadExercisePdf(exercise, note, !fullAccess)}
                      disabled={downloading}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black transition-opacity hover:opacity-80 disabled:opacity-50"
                      style={{
                        background: "rgba(232,74,12,0.1)",
                        border: "1px solid rgba(232,74,12,0.22)",
                        color: "#E84A0C",
                      }}
                    >
                      {downloading
                        ? <><Loader2 size={13} className="animate-spin" /> Generating…</>
                        : <><Download size={13} /> Download Exercise PDF</>
                      }
                    </button>
                  )}
                </>
              )}

              {/* ── My Submission tab ── */}
              {activeTab === "My Submission" && existingSubmission && (
                <SubmissionView submission={existingSubmission} />
              )}

              {/* ── Submit tab (full access — re-submission always allowed) ── */}
              {activeTab === "Submit" && fullAccess && (
                <SubmissionForm
                  exercise={exercise}
                  student={student}
                  onSuccess={(newSub) => onSubmissionAdded?.(newSub)}
                />
              )}
            </>
          )}

          <div className="h-2" />
        </div>
      </div>
    </div>
  );
}