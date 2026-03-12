import React, { useState, useEffect } from "react";
import { X, CheckCircle2, Clock, ChevronDown, ChevronUp, ExternalLink, BookOpen, AlertCircle } from "lucide-react";
import HtmlContent from "../../common/HtmlContent";
import { getData } from "../../../api/api.service";



function TopicNotesView({ topicId, onClose }) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getData(`topics/${topicId}/`);
        setData(res);
      } catch {
        setError("Could not load topic notes.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [topicId]);

  const exercises    = data?.exercises ?? [];
  const beginner     = exercises.filter(e => e.level === "beginner").length;
  const intermediate = exercises.filter(e => e.level === "intermediate").length;
  const expert       = exercises.filter(e => e.level === "expert").length;

  return (
    <div
      className="fixed inset-0 flex items-end justify-center"
      style={{ background: "rgba(13,21,32,0.75)", backdropFilter: "blur(16px)", zIndex: 120 }}
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-lg sm:mx-4 rounded-3xl flex flex-col overflow-hidden"
        style={{
          background: "#0B1322",
          border: "1px solid rgba(255,255,255,0.1)",
          maxHeight: "calc(100dvh - 64px)",
          marginBottom: "32px",
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="px-5 pt-4 pb-4 flex items-start justify-between gap-3 shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="min-w-0">
            {data?.subject?.name && (
              <span
                className="text-[10px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full mb-2 inline-block"
                style={{ background: "rgba(232,74,12,0.15)", color: "#E84A0C" }}
              >
                {data.subject.name}
              </span>
            )}
            <h2 className="font-black text-white text-base leading-snug">
              {loading ? "Loading…" : (data?.title ?? "Topic Notes")}
            </h2>
            {data?.description && (
              <p className="text-xs mt-1 leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
                {data.description}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 hover:opacity-70 transition-opacity"
            style={{ background: "rgba(255,255,255,0.08)" }}
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
              {/* Exercise summary */}
              <div
                className="rounded-2xl p-4 space-y-3"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>
                  Exercises Overview
                </p>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
                  This topic has <span className="font-black text-white">{exercises.length}</span> exercise{exercises.length !== 1 ? "s" : ""} available for revision.
                </p>
                {exercises.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {beginner > 0 && (
                      <span className="text-[10px] font-black px-2.5 py-1 rounded-full"
                        style={{ background: "rgba(74,222,128,0.12)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.25)" }}>
                        {beginner} Beginner
                      </span>
                    )}
                    {intermediate > 0 && (
                      <span className="text-[10px] font-black px-2.5 py-1 rounded-full"
                        style={{ background: "rgba(250,204,21,0.12)", color: "#facc15", border: "1px solid rgba(250,204,21,0.25)" }}>
                        {intermediate} Intermediate
                      </span>
                    )}
                    {expert > 0 && (
                      <span className="text-[10px] font-black px-2.5 py-1 rounded-full"
                        style={{ background: "rgba(248,113,113,0.12)", color: "#f87171", border: "1px solid rgba(248,113,113,0.25)" }}>
                        {expert} Expert
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Notes content */}
              {data.content && (
                <div
                  className="rounded-xl p-4"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <p className="text-[10px] font-black uppercase tracking-widest mb-3"
                    style={{ color: "rgba(255,255,255,0.3)" }}>Notes Content</p>
                  <HtmlContent html={data.content} />
                </div>
              )}
            </>
          )}
          <div className="h-2" />
        </div>
      </div>
    </div>
  );
}


const LEVEL_CONFIG = {
  beginner:     { label: "Beginner",     color: "#4ade80" },
  intermediate: { label: "Intermediate", color: "#facc15" },
  expert:       { label: "Expert",       color: "#f87171" },
};

// ─── Single submission card ───────────────────────────────────────────────────

function SubmissionCard({ submission }) {
  const [expanded, setExpanded] = useState(false);
  const [showTopicNotes, setShowTopicNotes] = useState(false);

  const exercise    = submission.exercise ?? {};
  const levelCfg    = LEVEL_CONFIG[exercise.level] ?? { label: exercise.level ?? "—", color: "rgba(255,255,255,0.4)" };
  const submittedAt = new Date(submission.created_at).toLocaleDateString("en-KE", {
    year: "numeric", month: "short", day: "numeric",
  });

  return (
    <>
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: `1px solid ${submission.is_marked ? "rgba(74,222,128,0.18)" : "rgba(255,255,255,0.07)"}`,
      }}
    >
      {/* Card header — always visible */}
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
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-black text-white truncate">
              {exercise.title ?? "Exercise"}
            </p>
            <span
              className="text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase"
              style={{ color: levelCfg.color, background: `${levelCfg.color}18` }}
            >
              {levelCfg.label}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span
              className="text-[10px] font-semibold"
              style={{ color: submission.is_marked ? "#4ade80" : "#facc15" }}
            >
              {submission.is_marked ? "Marked" : "Awaiting marking"}
            </span>
            <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>
              · {submittedAt}
            </span>
            {submission.images?.length > 0 && (
              <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                · {submission.images.length} image{submission.images.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>

        {expanded
          ? <ChevronUp size={15} color="rgba(255,255,255,0.3)" className="shrink-0" />
          : <ChevronDown size={15} color="rgba(255,255,255,0.3)" className="shrink-0" />
        }
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div
          className="px-4 pb-4 space-y-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          {exercise.content && (
            <div className="pt-3">
              <p className="text-[10px] font-black uppercase tracking-widest mb-2"
                style={{ color: "rgba(255,255,255,0.3)" }}>Question</p>
              <div className="rounded-xl p-3"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <HtmlContent html={exercise.content} />
              </div>
            </div>
          )}

          {submission.supervisor_comment && (
            <div className="rounded-xl p-3"
              style={{ background: "rgba(27,127,196,0.08)", border: "1px solid rgba(27,127,196,0.2)" }}>
              <p className="text-[10px] font-black uppercase tracking-widest mb-1"
                style={{ color: "rgba(27,127,196,0.7)" }}>Supervisor Comment</p>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
                {submission.supervisor_comment}
              </p>
            </div>
          )}

          {submission.images?.length > 0 && (
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest mb-2"
                style={{ color: "rgba(255,255,255,0.3)" }}>Submitted Work</p>
              <div className="grid grid-cols-2 gap-2">
                {submission.images.map(img => (
                  <a
                    key={img.id}
                    href={img.image}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative group rounded-xl overflow-hidden block"
                    style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <img
                      src={img.image}
                      alt="Submitted work"
                      className="w-full object-cover"
                      style={{ height: "110px" }}
                    />
                    <div
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: "rgba(0,0,0,0.45)" }}
                    >
                      <ExternalLink size={16} color="white" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      {expanded && exercise.topic_id && (
        <div className="px-4 pb-4">  {/* add inside the existing expanded div, as last child */}
          <button
            onClick={(e) => { e.stopPropagation(); setShowTopicNotes(true); }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-opacity hover:opacity-80"
            style={{
              background: "rgba(27,127,196,0.15)",
              border: "1px solid rgba(27,127,196,0.3)",
              color: "#1B7FC4",
            }}
          >
            <BookOpen size={13} /> View Topic Notes
          </button>
        </div>
        )}
    </div>
      {showTopicNotes && exercise.topic_id && (
        <TopicNotesView
          topicId={exercise.topic_id}
          onClose={() => setShowTopicNotes(false)}
        />
      )}
    </>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="py-14 text-center space-y-2">
      <p className="text-4xl">📭</p>
      <p className="font-bold text-white text-sm">No submissions yet</p>
      <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
        Complete exercises to see your submissions here.
      </p>
    </div>
  );
}

// ─── MySubmissions ────────────────────────────────────────────────────────────

export default function MySubmissions({ submissions, onClose }) {
  const marked  = submissions.filter(s =>  s.is_marked);
  const pending = submissions.filter(s => !s.is_marked);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{
        background: "rgba(0,0,0,0.82)",
        backdropFilter: "blur(10px)",
        /**
         * z-index: must be above the bottom nav bar.
         * Use 100 here (same level as NoteDetail) — or higher if
         * MySubmissions is opened from within NoteDetail (use 150+).
         */
        zIndex: 100,
      }}
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
        <div
          className="px-5 pt-3 pb-4 flex items-center justify-between gap-3 shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div>
            <h2 className="font-black text-white text-base">My Submissions</h2>
            <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
              {submissions.length} total · {marked.length} marked · {pending.length} pending
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