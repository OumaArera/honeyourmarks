import { useMemo } from "react";
import { LEVEL_META, GRADE_LABEL } from "./constants";

// ─────────────────────────────────────────────────────────────────────────────
// ── Shared atoms
// ─────────────────────────────────────────────────────────────────────────────

export function LevelBadge({ level }) {
  const m = LEVEL_META[level] ?? LEVEL_META.scout;
  return (
    <span
      className="inline-block text-[10px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full shrink-0"
      style={{ color: m.color, background: m.bg, border: `1px solid ${m.border}` }}
    >
      {m.label}
    </span>
  );
}

export function GradeBadge({ grade }) {
  return (
    <span
      className="text-[10px] font-black px-2 py-0.5 rounded-full shrink-0"
      style={{
        background: "rgba(99,102,241,0.12)",
        color: "#818CF8",
        border: "1px solid rgba(99,102,241,0.25)",
      }}
    >
      {GRADE_LABEL[grade] ?? grade}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── ExamCard
// ─────────────────────────────────────────────────────────────────────────────

export default function ExamCard({ exam, onView }) {
  const tagName     = exam.subject_tag?.name ?? "—";
  const subjectName = exam.subject_tag?.subject_name ?? "";

  // Plain-text preview stripped from HTML
  const plainPreview = useMemo(() => {
    const stripped = (exam.content ?? "")
      .replace(/&nbsp;/g, " ")
      .replace(/<[^>]+>/g, "")
      .replace(/\s+/g, " ")
      .trim();
    return stripped.length > 160 ? stripped.slice(0, 160) + "…" : stripped;
  }, [exam.content]);

  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col"
      style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      {/* Accent bar */}
      <div className="h-0.5 w-full" style={{ background: "linear-gradient(90deg,#1D4ED8,transparent)" }} />

      <div className="p-5 flex flex-col gap-3 flex-1">
        {/* Title + tag */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-black text-white text-sm leading-snug flex-1">{exam.title}</h3>
          <span
            className="text-[10px] font-black px-2 py-0.5 rounded-full shrink-0"
            style={{
              background: "rgba(96,165,250,0.1)",
              color: "#60A5FA",
              border: "1px solid rgba(96,165,250,0.2)",
            }}
          >
            {tagName}
          </span>
        </div>

        {/* Subject name */}
        {subjectName && (
          <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>
            {subjectName}
          </p>
        )}

        {/* Instructions preview */}
        {exam.instructions && (
          <p
            className="text-xs leading-relaxed line-clamp-2"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            {exam.instructions}
          </p>
        )}

        {/* Content preview */}
        {plainPreview && (
          <p
            className="text-[11px] leading-relaxed line-clamp-3"
            style={{ color: "rgba(255,255,255,0.3)", fontStyle: "italic" }}
          >
            {plainPreview}
          </p>
        )}

        {/* Grade + Level badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <GradeBadge grade={exam.grade} />
          <LevelBadge level={exam.level} />
        </div>

        {/* Footer meta */}
        <div className="flex items-center justify-between mt-auto pt-1">
          <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>
            {exam.created_at ? new Date(exam.created_at).toLocaleDateString() : ""}
          </span>
          {exam.video_link && (
            <span
              className="text-[10px] font-black px-2 py-0.5 rounded-full"
              style={{
                background: "rgba(248,113,113,0.08)",
                color: "#F87171",
                border: "1px solid rgba(248,113,113,0.18)",
              }}
            >
              ▶ Video
            </span>
          )}
        </div>

        {/* Action */}
        <div className="pt-1" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <button
            onClick={() => onView(exam)}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg
              text-[11px] font-black transition-all duration-150 hover:opacity-90 active:scale-95"
            style={{
              background: "rgba(29,78,216,0.12)",
              color: "#60A5FA",
              border: "1px solid rgba(29,78,216,0.25)",
            }}
          >
            👁 View Exam
          </button>
        </div>
      </div>
    </div>
  );
}