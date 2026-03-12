import React, { useState } from "react";
import { X, CheckCircle2, Clock, ChevronDown, ChevronUp, Trophy, MessageSquare } from "lucide-react";

const LEVEL_CONFIG = {
  scout:    { label: "Scout",    color: "#4ade80" },
  explorer: { label: "Explorer", color: "#60a5fa" },
  legend:   { label: "Legend",   color: "#f87171" },
};

function ScoreBar({ pct }) {
  const color = pct >= 70 ? "#4ade80" : pct >= 50 ? "#facc15" : "#f87171";
  return (
    <div className="h-1.5 rounded-full overflow-hidden mt-2" style={{ background: "rgba(255,255,255,0.07)" }}>
      <div className="h-full rounded-full" style={{ width: `${Math.min(100, pct)}%`, background: color }} />
    </div>
  );
}

function SubmissionCard({ submission }) {
  const [expanded, setExpanded] = useState(false);

  const examId   = typeof submission.exam === "string" ? submission.exam : submission.exam?.id;
  const examTitle = typeof submission.exam === "object" ? submission.exam?.title : null;
  const result   = submission.result ?? null;
  const pct      = submission.percentage ?? null;
  const scoreColor = pct == null ? "#facc15" : pct >= 70 ? "#4ade80" : pct >= 50 ? "#facc15" : "#f87171";

  const submittedAt = new Date(submission.created_at).toLocaleDateString("en-KE", {
    year: "numeric", month: "short", day: "numeric",
  });

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: `1px solid ${submission.is_marked ? "rgba(74,222,128,0.18)" : "rgba(255,255,255,0.07)"}`,
      }}
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center gap-3 p-4 text-left"
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: submission.is_marked ? "rgba(74,222,128,0.12)" : "rgba(250,204,21,0.1)" }}
        >
          {submission.is_marked
            ? <CheckCircle2 size={18} color="#4ade80" />
            : <Clock size={18} color="#facc15" />
          }
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-black text-white truncate">
            {examTitle ?? "Exam"}
          </p>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className="text-[10px] font-semibold"
              style={{ color: submission.is_marked ? "#4ade80" : "#facc15" }}>
              {submission.is_marked ? "Marked" : "Awaiting marking"}
            </span>
            <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>
              · {submittedAt}
            </span>
            {result && pct != null && (
              <span className="text-[10px] font-black" style={{ color: scoreColor }}>
                · {Math.round(pct)}%
              </span>
            )}
          </div>
        </div>

        {expanded
          ? <ChevronUp size={15} color="rgba(255,255,255,0.3)" className="shrink-0" />
          : <ChevronDown size={15} color="rgba(255,255,255,0.3)" className="shrink-0" />
        }
      </button>

      {/* Expanded */}
      {expanded && (
        <div className="px-4 pb-4 space-y-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>

          {/* Grade */}
          {submission.is_marked && result && (
            <div className="pt-3">
              <div className="rounded-xl p-3 space-y-2"
                style={{ background: `${scoreColor}0d`, border: `1px solid ${scoreColor}28` }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy size={14} style={{ color: scoreColor }} />
                    <span className="text-xs font-black" style={{ color: scoreColor }}>Grade</span>
                  </div>
                  <span className="font-black text-lg" style={{ color: scoreColor }}>
                    {result.score} / {result.out_of}
                    {pct != null && <span className="text-sm ml-1">({Math.round(pct)}%)</span>}
                  </span>
                </div>
                {pct != null && <ScoreBar pct={pct} />}
              </div>
            </div>
          )}

          {/* Teacher comments */}
          {result?.comments && (
            <div className="rounded-xl p-3"
              style={{ background: "rgba(27,127,196,0.08)", border: "1px solid rgba(27,127,196,0.2)" }}>
              <div className="flex items-center gap-1.5 mb-1">
                <MessageSquare size={11} color="rgba(27,127,196,0.7)" />
                <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: "rgba(27,127,196,0.7)" }}>
                  Teacher Comments
                </p>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
                {result.comments}
              </p>
            </div>
          )}

          {/* Images */}
          {submission.images?.length > 0 && (
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest mb-2"
                style={{ color: "rgba(255,255,255,0.3)" }}>
                Submitted Work
              </p>
              <div className="grid grid-cols-2 gap-2">
                {submission.images.map(img => (
                  <a key={img.id} href={img.image} target="_blank" rel="noopener noreferrer"
                    className="block rounded-xl overflow-hidden"
                    style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
                    <img src={img.image} alt="Submission" className="w-full object-cover"
                      style={{ height: "110px" }} />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="py-14 text-center space-y-2">
      <p className="text-4xl">🏆</p>
      <p className="font-bold text-white text-sm">No exam submissions yet</p>
      <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
        Attempt exams to see your results here.
      </p>
    </div>
  );
}

export default function MyExamSubmissions({ submissions, onClose }) {
  const marked  = submissions.filter(s =>  s.is_marked);
  const pending = submissions.filter(s => !s.is_marked);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ background: "rgba(13,21,32,0.82)", backdropFilter: "blur(10px)", zIndex: 100 }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-3xl flex flex-col overflow-hidden"
        style={{
          background: "#0D1520",
          border: "1px solid rgba(255,255,255,0.1)",
          maxHeight: "calc(100dvh - 80px)",
          minHeight: "min(55dvh, 400px)",
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 pt-4 pb-4 flex items-center justify-between gap-3 shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div>
            <h2 className="font-black text-white text-base">My Exam Results</h2>
            <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
              {submissions.length} total · {marked.length} marked · {pending.length} pending
            </p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 hover:opacity-70 transition-opacity"
            style={{ background: "rgba(255,255,255,0.08)" }}>
            <X size={15} color="rgba(255,255,255,0.6)" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-3">
          {submissions.length === 0 && <EmptyState />}

          {pending.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-widest"
                style={{ color: "rgba(250,204,21,0.7)" }}>
                Awaiting Marking ({pending.length})
              </p>
              {pending.map(s => <SubmissionCard key={s.id} submission={s} />)}
            </div>
          )}

          {marked.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-widest mt-2"
                style={{ color: "rgba(74,222,128,0.7)" }}>
                Marked ({marked.length})
              </p>
              {marked.map(s => <SubmissionCard key={s.id} submission={s} />)}
            </div>
          )}

          <div className="h-2" />
        </div>
      </div>
    </div>
  );
}