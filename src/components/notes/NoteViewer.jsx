import { useState } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// ── Constants
// ─────────────────────────────────────────────────────────────────────────────

const LEVEL_META = {
  beginner:     { label: "Beginner",     color: "#34D399", bg: "rgba(52,211,153,0.12)",  border: "rgba(52,211,153,0.25)"  },
  intermediate: { label: "Intermediate", color: "#F59E0B", bg: "rgba(245,158,11,0.12)",  border: "rgba(245,158,11,0.25)"  },
  expert:       { label: "Expert",       color: "#F87171", bg: "rgba(248,113,113,0.12)", border: "rgba(248,113,113,0.25)" },
};

const fmt = (iso) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

// ─────────────────────────────────────────────────────────────────────────────
// ── Tiny shared atoms
// ─────────────────────────────────────────────────────────────────────────────

function LevelBadge({ level }) {
  const m = LEVEL_META[level] ?? LEVEL_META.beginner;
  return (
    <span
      className="inline-block text-[10px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full shrink-0"
      style={{ color: m.color, background: m.bg, border: `1px solid ${m.border}` }}
    >
      {m.label}
    </span>
  );
}

function VideoChip({ href }) {
  if (!href) return null;
  return (
    <a
      href={href} target="_blank" rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-lg
        transition-opacity hover:opacity-80 shrink-0"
      style={{ background: "rgba(248,113,113,0.1)", color: "#F87171", border: "1px solid rgba(248,113,113,0.2)" }}
    >
      ▶ Video
    </a>
  );
}

function ScrollPane({ children, className = "" }) {
  return (
    <div
      className={`overflow-y-auto nv-scroll ${className}`}
      style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.1) transparent" }}
    >
      {children}
    </div>
  );
}

function HtmlContent({ html, className = "" }) {
  return (
    <div
      className={`nv-html ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── Exercise selector tab
// ─────────────────────────────────────────────────────────────────────────────

function ExerciseTab({ exercise, index, isActive, onClick }) {
  const m = LEVEL_META[exercise.level] ?? LEVEL_META.beginner;
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-3 py-3 rounded-xl transition-all duration-150"
      style={
        isActive
          ? { background: "rgba(255,255,255,0.07)", border: `1px solid ${m.border}` }
          : { background: "transparent", border: "1px solid transparent" }
      }
    >
      <div className="flex items-center justify-between gap-1 mb-1">
        <span className="text-[9px] font-black tracking-widest uppercase"
          style={{ color: isActive ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.2)" }}>
          #{String(index + 1).padStart(2, "0")}
        </span>
        <LevelBadge level={exercise.level} />
      </div>
      <p className="text-xs font-bold leading-snug truncate"
        style={{ color: isActive ? "#fff" : "rgba(255,255,255,0.45)" }}>
        {exercise.title}
      </p>
      <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.2)" }}>
        {fmt(exercise.created_at)}
      </p>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── Exercise detail pane
// ─────────────────────────────────────────────────────────────────────────────

function ExerciseDetail({ exercise }) {
  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="px-5 py-4 shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-sm font-black text-white leading-snug">{exercise.title}</h3>
          <LevelBadge level={exercise.level} />
        </div>
        <div className="flex gap-2.5 px-3.5 py-2.5 rounded-xl"
          style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.15)" }}>
          <span className="text-sm shrink-0 mt-0.5" style={{ color: "#818CF8" }}>📋</span>
          <div>
            <p className="text-[9px] font-black tracking-widest uppercase mb-0.5"
              style={{ color: "rgba(129,140,248,0.55)" }}>Instructions</p>
            <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
              {exercise.instructions}
            </p>
          </div>
        </div>
        {exercise.video_link && <div className="mt-2.5"><VideoChip href={exercise.video_link} /></div>}
      </div>

      <ScrollPane className="flex-1 px-5 py-4">
        <p className="text-[9px] font-black tracking-widest uppercase mb-3"
          style={{ color: "rgba(255,255,255,0.25)" }}>Questions</p>
        <HtmlContent html={exercise.content} className="nv-exercise" />
      </ScrollPane>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── NoteViewer — default export
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Props
 *   note    {object}   – full note from API (with nested exercises[])
 *   onClose {function} – dismiss the modal
 */
export default function NoteViewer({ note, onClose }) {
  const [activeExIdx, setActiveExIdx] = useState(0);
  const [mobilePanel, setMobilePanel] = useState("note");

  const exercises   = note.exercises ?? [];
  const activeEx    = exercises[activeExIdx];
  const subjectName = note.subject?.name ?? "—";
  const authorName  = note.author
    ? `${note.author.first_name} ${note.author.last_name}`.trim()
    : "—";

  return (
    <>
      <style>{`
        .nv-html p            { color:rgba(255,255,255,.72); font-size:.875rem; line-height:1.8; margin-bottom:.9rem; }
        .nv-html p:last-child { margin-bottom:0; }
        .nv-html strong       { color:rgba(255,255,255,.9); font-weight:700; }
        .nv-html em           { color:rgba(255,255,255,.65); }
        .nv-html .ql-indent-1 { padding-left:1.5rem; }
        .nv-html .ql-indent-2 { padding-left:3rem; }

        .nv-exercise ol            { color:rgba(255,255,255,.72); font-size:.8125rem; line-height:1.75; padding-left:1.1rem; margin-bottom:.5rem; }
        .nv-exercise li            { margin-bottom:.5rem; }
        .nv-exercise ol ol         { list-style-type:lower-alpha; color:rgba(255,255,255,.52); margin-top:.3rem; }
        .nv-exercise strong        { color:rgba(255,255,255,.9); font-weight:700; }
        .nv-exercise em            { color:rgba(255,255,255,.6); font-style:italic; }
        .nv-exercise p             { color:rgba(255,255,255,.6); font-size:.8125rem; line-height:1.75; margin:.25rem 0 .5rem; }
        .nv-exercise .ql-indent-1  { padding-left:1.5rem; }
        .nv-exercise .ql-indent-2  { padding-left:3rem; }

        .nv-scroll::-webkit-scrollbar       { width:4px; }
        .nv-scroll::-webkit-scrollbar-track { background:transparent; }
        .nv-scroll::-webkit-scrollbar-thumb { background:rgba(255,255,255,.1); border-radius:99px; }
      `}</style>

      {/* Backdrop */}
      <div
        className="fixed inset-0 flex items-center justify-center p-3 sm:p-6"
        style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", zIndex: 9995 }}
        onClick={onClose}
      >
        {/* Shell */}
        <div
          className="w-full flex flex-col"
          style={{
            maxWidth: 1080,
            height: "min(90vh, 800px)",
            background: "#07111F",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 22,
            boxShadow: "0 32px 100px rgba(0,0,0,0.85)",
            overflow: "hidden",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Top bar ── */}
          <div
            className="flex items-center justify-between gap-3 px-5 sm:px-7 py-4 shrink-0"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="hidden sm:inline-block shrink-0 text-[10px] font-black tracking-widest
                uppercase px-2.5 py-1 rounded-full"
                style={{ color: "#F59E0B", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)" }}>
                {subjectName}
              </span>
              <h2 className="font-black text-white truncate"
                style={{ fontSize: "clamp(0.95rem, 2.5vw, 1.2rem)" }}>
                {note.title}
              </h2>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Mobile toggle */}
              <div className="flex sm:hidden rounded-xl overflow-hidden text-[11px] font-black"
                style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
                {["note", "exercises"].map((p) => (
                  <button key={p} onClick={() => setMobilePanel(p)}
                    className="px-3 py-1.5 capitalize transition-colors"
                    style={mobilePanel === p
                      ? { background: "rgba(255,255,255,0.1)", color: "#fff" }
                      : { background: "transparent", color: "rgba(255,255,255,0.3)" }}>
                    {p === "note" ? "Note" : `Ex (${exercises.length})`}
                  </button>
                ))}
              </div>

              <span className="hidden md:block text-[11px]" style={{ color: "rgba(255,255,255,0.25)" }}>
                {authorName}
              </span>

              <button onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full text-lg
                  transition-opacity hover:opacity-100"
                style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)" }}
                aria-label="Close viewer">
                ×
              </button>
            </div>
          </div>

          {/* ── Body ── */}
          <div className="flex flex-1 min-h-0">

            {/* LEFT — note content */}
            <div
              className={`flex flex-col min-w-0 ${mobilePanel === "exercises" ? "hidden sm:flex" : "flex"}`}
              style={{ width: "54%", borderRight: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="flex items-center justify-between gap-3 px-5 sm:px-7 py-3 shrink-0"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <div>
                  <p className="text-[9px] font-black tracking-widest uppercase"
                    style={{ color: "rgba(255,255,255,0.2)" }}>Note Content</p>
                  {note.description && (
                    <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.38)" }}>
                      {note.description}
                    </p>
                  )}
                </div>
                <VideoChip href={note.video_link} />
              </div>

              <ScrollPane className="flex-1 px-5 sm:px-7 py-5">
                <HtmlContent html={note.content} />
              </ScrollPane>
            </div>

            {/* RIGHT — exercises */}
            <div className={`flex flex-1 min-w-0 min-h-0 ${mobilePanel === "note" ? "hidden sm:flex" : "flex"}`}>
              {exercises.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-3"
                  style={{ color: "rgba(255,255,255,0.2)" }}>
                  <span className="text-4xl">📭</span>
                  <p className="text-sm font-bold">No exercises yet</p>
                </div>
              ) : (
                <>
                  {/* Sidebar: exercise selector */}
                  <ScrollPane
                    className="flex flex-col gap-1 py-3 px-2 shrink-0"
                    style={{ width: 158, borderRight: "1px solid rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.15)" }}
                  >
                    <p className="text-[9px] font-black tracking-widest uppercase px-2 mb-1"
                      style={{ color: "rgba(255,255,255,0.2)" }}>
                      {exercises.length} Exercise{exercises.length !== 1 ? "s" : ""}
                    </p>
                    {exercises.map((ex, i) => (
                      <ExerciseTab key={ex.id} exercise={ex} index={i}
                        isActive={i === activeExIdx} onClick={() => setActiveExIdx(i)} />
                    ))}
                  </ScrollPane>

                  {/* Exercise detail */}
                  <div className="flex-1 min-w-0 min-h-0 flex flex-col">
                    {activeEx && <ExerciseDetail exercise={activeEx} />}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ── Footer ── */}
          <div className="flex items-center justify-between gap-4 px-5 sm:px-7 py-2.5 shrink-0"
            style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.18)" }}>
              {subjectName} · {exercises.length} exercise{exercises.length !== 1 ? "s" : ""}
            </p>
            <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.18)" }}>{authorName}</p>
          </div>
        </div>
      </div>
    </>
  );
}