import React, { useState } from "react";
import {
  X, Lock, Download, CheckCircle2, Clock, ChevronRight,
  Loader2, Trophy, Target, MessageSquare,
} from "lucide-react";
import HtmlContent from "../../common/HtmlContent";
import ExamSubmissionForm from "./ExamSubmissionForm";
import { usePdfDownload } from "../../../hooks/usePdfDownload";

const LEVEL_CONFIG = {
  scout:    { label: "Scout",    color: "#4ade80", bg: "rgba(74,222,128,0.12)",  border: "rgba(74,222,128,0.25)"  },
  explorer: { label: "Explorer", color: "#60a5fa", bg: "rgba(96,165,250,0.12)",  border: "rgba(96,165,250,0.25)"  },
  legend:   { label: "Legend",   color: "#f87171", bg: "rgba(248,113,113,0.12)", border: "rgba(248,113,113,0.25)" },
};

const GRADE_LABELS = {
  grade_7: "Grade 7", grade_8: "Grade 8", grade_9: "Grade 9",
  grade_10: "Grade 10", grade_11: "Grade 11", grade_12: "Grade 12",
  form_1: "Form 1", form_2: "Form 2", form_3: "Form 3", form_4: "Form 4",
};

function LevelBadge({ level }) {
  const cfg = LEVEL_CONFIG[level] ?? { label: level ?? "—", color: "rgba(255,255,255,0.5)", bg: "rgba(255,255,255,0.06)", border: "rgba(255,255,255,0.12)" };
  return (
    <span className="text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide shrink-0"
      style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
      {cfg.label}
    </span>
  );
}

// ─── Result view ──────────────────────────────────────────────────────────────

function ResultView({ submission }) {
  const submittedAt = new Date(submission.created_at).toLocaleDateString("en-KE", {
    year: "numeric", month: "short", day: "numeric",
  });
  const result = submission.result ?? null;
  const pct    = submission.percentage ?? null;

  // Score colour
  const scoreColor = pct == null ? "#facc15"
    : pct >= 70 ? "#4ade80"
    : pct >= 50 ? "#facc15"
    : "#f87171";

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
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>Submitted {submittedAt}</p>
        </div>
      </div>

      {/* Grade card — only when marked */}
      {submission.is_marked && result && (
        <div
          className="rounded-2xl p-4 space-y-3"
          style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${scoreColor}30` }}
        >
          <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>
            Your Grade
          </p>

          {/* Score display */}
          <div className="flex items-end gap-3">
            <div className="flex items-baseline gap-1">
              <span className="font-black text-4xl" style={{ color: scoreColor }}>
                {result.score}
              </span>
              <span className="font-bold text-lg" style={{ color: "rgba(255,255,255,0.3)" }}>
                / {result.out_of}
              </span>
            </div>
            {pct != null && (
              <div
                className="ml-auto px-3 py-1.5 rounded-xl flex items-center gap-1.5"
                style={{ background: `${scoreColor}15`, border: `1px solid ${scoreColor}30` }}
              >
                <Trophy size={14} style={{ color: scoreColor }} />
                <span className="font-black text-lg" style={{ color: scoreColor }}>
                  {Math.round(pct)}%
                </span>
              </div>
            )}
          </div>

          {/* Progress bar */}
          {pct != null && (
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, pct)}%`, background: scoreColor }}
              />
            </div>
          )}

          {/* Comments */}
          {result.comments && (
            <div
              className="rounded-xl p-3 flex items-start gap-2"
              style={{ background: "rgba(27,127,196,0.08)", border: "1px solid rgba(27,127,196,0.2)" }}
            >
              <MessageSquare size={14} color="rgba(27,127,196,0.7)" className="shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: "rgba(27,127,196,0.7)" }}>
                  Teacher Comments
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
                  {result.comments}
                </p>
              </div>
            </div>
          )}
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
              <a key={img.id} href={img.image} target="_blank" rel="noopener noreferrer"
                className="block rounded-xl overflow-hidden"
                style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
                <img src={img.image} alt="Submission" className="w-full object-cover"
                  style={{ height: "120px" }} />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Locked overlay ───────────────────────────────────────────────────────────

function LockedOverlay() {
  return (
    <div className="rounded-2xl p-6 flex flex-col items-center gap-3 text-center"
      style={{ background: "rgba(232,74,12,0.06)", border: "1px solid rgba(232,74,12,0.18)" }}>
      <Lock size={28} color="rgba(232,74,12,0.5)" />
      <div>
        <p className="font-black text-white text-sm">Subscription Required</p>
        <p className="text-xs mt-1 leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
          Subscribe to access exam content and submit responses.
        </p>
      </div>
    </div>
  );
}

function PartialNotice() {
  return (
    <div className="rounded-xl p-3 flex items-start gap-2"
      style={{ background: "rgba(27,127,196,0.1)", border: "1px solid rgba(27,127,196,0.25)" }}>
      <span className="text-base shrink-0">ℹ️</span>
      <p className="text-xs leading-relaxed" style={{ color: "rgba(27,127,196,0.9)" }}>
        Your plan includes viewing exam questions. Upgrade to <strong>Full Access</strong> to submit responses.
      </p>
    </div>
  );
}

// ─── ExamDetail ───────────────────────────────────────────────────────────────

export default function ExamDetail({
  exam,
  student,
  hasPlan,
  fullAccess,
  existingSubmission,
  onClose,
  onSubmissionAdded,
}) {
  const isAttempted = Boolean(existingSubmission);
  const { downloading, downloadExercisePdf } = usePdfDownload();

  const tabs = [
    "Exam",
    ...(hasPlan && isAttempted ? ["My Result"] : []),
    ...(hasPlan && fullAccess   ? ["Submit"]    : []),
  ];
  const [activeTab, setActiveTab] = useState("Exam");

  const subject = exam.subject_tag?.subject_name ?? exam.subject_tag?.name ?? null;
  const grade   = GRADE_LABELS[exam.grade] ?? exam.grade ?? null;

  return (
    <div
      className="fixed inset-0 z-60 flex items-end justify-center"
      style={{ background: "rgba(13,21,32,0.75)", backdropFilter: "blur(16px)" }}
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-lg sm:mx-4 rounded-3xl flex flex-col overflow-hidden"
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
        <div className="px-5 pt-3 pb-4 flex items-start justify-between gap-3 shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              {subject && (
                <span className="text-[9px] font-black uppercase tracking-wide px-1.5 py-0.5 rounded-full"
                  style={{ background: "rgba(232,74,12,0.15)", color: "#E84A0C" }}>
                  {subject}
                </span>
              )}
              <LevelBadge level={exam.level} />
              {isAttempted && (
                <span className="text-[9px] font-black px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(74,222,128,0.12)", color: "#4ade80" }}>
                  ✓ Attempted
                </span>
              )}
            </div>
            <h2 className="font-black text-white text-sm sm:text-base leading-snug">{exam.title}</h2>
            {grade && (
              <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>{grade}</p>
            )}
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 hover:opacity-70 transition-opacity"
            style={{ background: "rgba(255,255,255,0.08)" }}>
            <X size={15} color="rgba(255,255,255,0.6)" />
          </button>
        </div>

        {/* Tab bar */}
        {tabs.length > 1 && (
          <div className="flex shrink-0"
            style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            {tabs.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className="flex-1 py-3 text-xs font-black transition-colors relative"
                style={{
                  color: activeTab === tab ? "#E84A0C" : "rgba(255,255,255,0.35)",
                  background: activeTab === tab ? "rgba(232,74,12,0.07)" : "transparent",
                }}>
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: "#E84A0C" }} />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">

          {!hasPlan && <LockedOverlay />}

          {hasPlan && (
            <>
              {/* ── Exam tab ── */}
              {activeTab === "Exam" && (
                <>
                  {exam.instructions && (
                    <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
                      {exam.instructions}
                    </p>
                  )}

                  {exam.content && (
                    <div className="rounded-xl p-4"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                      <HtmlContent html={exam.content} />
                    </div>
                  )}

                  {/* Video link — only visible after submission */}
                  {isAttempted && exam.video_link && (
                    <a href={exam.video_link} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl transition-opacity hover:opacity-80"
                      style={{ background: "rgba(255,0,0,0.08)", border: "1px solid rgba(255,0,0,0.2)" }}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: "rgba(255,0,0,0.15)" }}>
                        <span className="text-sm">▶️</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white">Watch Solution Video</p>
                        <p className="text-xs truncate mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                          {exam.video_link}
                        </p>
                      </div>
                      <ChevronRight size={14} color="rgba(255,255,255,0.2)" />
                    </a>
                  )}

                  {!fullAccess && <PartialNotice />}

                  {/* Download PDF */}
                  <button
                    onClick={() => downloadExercisePdf(exam, null, !fullAccess)}
                    disabled={downloading}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black transition-opacity hover:opacity-80 disabled:opacity-50"
                    style={{ background: "rgba(232,74,12,0.1)", border: "1px solid rgba(232,74,12,0.22)", color: "#E84A0C" }}
                  >
                    {downloading
                      ? <><Loader2 size={13} className="animate-spin" /> Generating…</>
                      : <><Download size={13} /> Download Exam PDF</>
                    }
                  </button>
                </>
              )}

              {/* ── My Result tab ── */}
              {activeTab === "My Result" && existingSubmission && (
                <ResultView submission={existingSubmission} />
              )}

              {/* ── Submit tab ── */}
              {activeTab === "Submit" && fullAccess && (
                <ExamSubmissionForm
                  exam={exam}
                  student={student}
                  onSuccess={(newSub) => {
                    onSubmissionAdded?.(newSub);
                    setActiveTab("My Result");
                  }}
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