import React from "react";
import { BookOpen, Lock, CheckCircle2, ChevronRight, Youtube } from "lucide-react";

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
    <span
      className="text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide shrink-0"
      style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
    >
      {cfg.label}
    </span>
  );
}

function ExamCard({ exam, hasPlan, isAttempted, onOpen }) {
  const subject = exam.subject_tag?.subject_name ?? exam.subject_tag?.name ?? null;
  const grade   = GRADE_LABELS[exam.grade] ?? exam.grade ?? null;

  return (
    <button
      onClick={() => onOpen(exam)}
      className="w-full text-left rounded-2xl p-4 transition-all active:scale-[0.98]"
      style={{
        background: isAttempted ? "rgba(74,222,128,0.04)" : "rgba(255,255,255,0.03)",
        border: `1px solid ${isAttempted ? "rgba(74,222,128,0.18)" : "rgba(255,255,255,0.08)"}`,
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
          style={{ background: isAttempted ? "rgba(74,222,128,0.12)" : "rgba(232,74,12,0.1)" }}
        >
          {isAttempted
            ? <CheckCircle2 size={16} color="#4ade80" />
            : <BookOpen size={16} color="#E84A0C" />
          }
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            {subject && (
              <span
                className="text-[9px] font-black uppercase tracking-wide px-1.5 py-0.5 rounded-full"
                style={{ background: "rgba(232,74,12,0.15)", color: "#E84A0C" }}
              >
                {subject}
              </span>
            )}
            <LevelBadge level={exam.level} />
            {isAttempted && (
              <span
                className="text-[9px] font-black px-1.5 py-0.5 rounded-full"
                style={{ background: "rgba(74,222,128,0.12)", color: "#4ade80" }}
              >
                ✓ Attempted
              </span>
            )}
          </div>

          <p className="text-sm font-black text-white leading-snug">{exam.title}</p>

          {grade && (
            <p className="text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>
              {grade}
            </p>
          )}
        </div>

        <div className="shrink-0 flex items-center gap-1">
          {!hasPlan && <Lock size={12} color="rgba(255,255,255,0.25)" />}
          <ChevronRight size={14} color="rgba(255,255,255,0.2)" />
        </div>
      </div>
    </button>
  );
}

function EmptyState() {
  return (
    <div className="py-14 text-center space-y-2">
      <p className="text-4xl">📋</p>
      <p className="font-bold text-white text-sm">No exams available</p>
      <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
        Check back later for new exam questions.
      </p>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl p-4 animate-pulse" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl shrink-0" style={{ background: "rgba(255,255,255,0.07)" }} />
        <div className="flex-1 space-y-2">
          <div className="h-2.5 rounded-full w-1/3" style={{ background: "rgba(255,255,255,0.07)" }} />
          <div className="h-3.5 rounded-full w-3/4" style={{ background: "rgba(255,255,255,0.07)" }} />
          <div className="h-2 rounded-full w-1/4" style={{ background: "rgba(255,255,255,0.07)" }} />
        </div>
      </div>
    </div>
  );
}

export default function ExamList({ exams, loading, hasPlan, submittedExamIds, onSelectExam, nextUrl, loadingMore, onLoadMore }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (!exams.length) return <EmptyState />;

  // Group by level
  const levels = ["scout", "explorer", "legend"];
  const grouped = levels.reduce((acc, level) => {
    const list = exams.filter(e => e.level === level);
    if (list.length) acc.push({ level, list });
    return acc;
  }, []);
  const other = exams.filter(e => !levels.includes(e.level));
  if (other.length) grouped.push({ level: "other", list: other });

  return (
    <div className="space-y-5">
      {grouped.map(({ level, list }) => {
        const cfg = LEVEL_CONFIG[level] ?? { label: "Other", color: "rgba(255,255,255,0.5)" };
        return (
          <div key={level}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: cfg.color }}>
                {cfg.label}
              </span>
              <div className="flex-1 h-px" style={{ background: `${cfg.color}28` }} />
              <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.25)" }}>
                {list.filter(e => submittedExamIds.has(e.id)).length}/{list.length}
              </span>
            </div>
            <div className="space-y-2">
              {list.map(exam => (
                <ExamCard
                  key={exam.id}
                  exam={exam}
                  hasPlan={hasPlan}
                  isAttempted={submittedExamIds.has(exam.id)}
                  onOpen={onSelectExam}
                />
              ))}
            </div>
          </div>
        );
      })}

      {nextUrl && (
        <button
          onClick={onLoadMore}
          disabled={loadingMore}
          className="w-full py-3 rounded-xl text-xs font-black transition-opacity hover:opacity-80 disabled:opacity-40"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}
        >
          {loadingMore ? "Loading…" : "Load more exams"}
        </button>
      )}
    </div>
  );
}