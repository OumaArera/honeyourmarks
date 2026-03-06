import { LEVEL_META, GRADE_LABEL } from "./constants";

// ─────────────────────────────────────────────────────────────────────────────
// ── Shared atoms
// ─────────────────────────────────────────────────────────────────────────────

function Badge({ color, bg, border, children }) {
  return (
    <span
      className="inline-block text-[10px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full shrink-0"
      style={{ color, background: bg, border: `1px solid ${border}` }}
    >
      {children}
    </span>
  );
}

function ScrollPane({ children, className = "" }) {
  return (
    <div
      className={`overflow-y-auto ev-scroll ${className}`}
      style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.1) transparent" }}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── ExamViewer
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Props:
 *   exam    {object}   – full exam object from API
 *   onClose {function} – dismiss the modal
 */
export default function ExamViewer({ exam, onClose }) {
  const levelMeta   = LEVEL_META[exam.level] ?? LEVEL_META.scout;
  const gradeName   = GRADE_LABEL[exam.grade] ?? exam.grade;
  const tagName     = exam.subject_tag?.name ?? "—";
  const subjectName = exam.subject_tag?.subject_name ?? "";

  return (
    <>
      <style>{`
        /* ── Exam content typography ──────────────────────────────────────── */
        .ev-content p            { color:rgba(255,255,255,.75); font-size:.9rem; line-height:1.85; margin-bottom:.9rem; }
        .ev-content p:last-child { margin-bottom:0; }
        .ev-content strong       { color:rgba(255,255,255,.9); font-weight:700; }
        .ev-content em           { color:rgba(255,255,255,.65); }
        .ev-content h1,.ev-content h2,.ev-content h3 { color:#fff; font-weight:700; margin:.6em 0 .3em; }
        .ev-content h1 { font-size:1.4em; }
        .ev-content h2 { font-size:1.2em; }
        .ev-content h3 { font-size:1.05em; }

        /* ── Fix: rendered ordered list numbering ─────────────────────────── */
        .ev-content ol {
          list-style-type: decimal;
          padding-left: 1.5em;
          color: rgba(255,255,255,.72);
          font-size: .875rem;
          line-height: 1.8;
          margin-bottom: .5rem;
        }
        .ev-content ol li            { margin-bottom: .4rem; list-style-type: decimal; }
        .ev-content ol ol            { list-style-type: lower-alpha; margin-top: .3rem; padding-left: 1.5em; }
        .ev-content ol ol ol         { list-style-type: lower-roman; }
        .ev-content ul               { list-style-type: disc; padding-left: 1.5em; color: rgba(255,255,255,.72); font-size:.875rem; line-height:1.8; margin-bottom:.5rem; }
        .ev-content ul li            { margin-bottom:.4rem; }
        .ev-content .ql-indent-1     { padding-left: 1.5rem; }
        .ev-content .ql-indent-2     { padding-left: 3rem; }
        .ev-content blockquote {
          border-left: 4px solid #1D4ED8;
          margin: 1em 0; padding: .6em 1em;
          background: rgba(29,78,216,0.06);
          border-radius: 0 8px 8px 0;
          color: rgba(255,255,255,0.6);
          font-style: italic;
        }
        .ev-content pre {
          background: rgba(0,0,0,0.4);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          color: #34D399;
          font-size: .8125rem;
          padding: 14px 18px;
          overflow-x: auto;
          margin: .75em 0;
        }
        .ev-content code {
          background: rgba(255,255,255,0.08);
          border-radius: 4px;
          padding: 1px 6px;
          font-size: .85em;
          color: #7dd3fc;
        }
        .ev-content img {
          max-width: 100%;
          border-radius: 10px;
          margin: .5em auto;
          display: block;
          box-shadow: 0 4px 20px rgba(0,0,0,0.4);
        }
        .ev-content a { color: #60A5FA; text-decoration: underline; }

        .ev-scroll::-webkit-scrollbar       { width: 4px; }
        .ev-scroll::-webkit-scrollbar-track { background: transparent; }
        .ev-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,.1); border-radius: 99px; }
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
            maxWidth: 820,
            height: "min(90vh, 820px)",
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
            <div className="flex items-center gap-3 min-w-0 flex-wrap">
              {/* Subject tag */}
              <Badge color="#60A5FA" bg="rgba(96,165,250,0.1)" border="rgba(96,165,250,0.2)">
                {tagName}
              </Badge>
              {/* Grade */}
              <Badge color="#818CF8" bg="rgba(99,102,241,0.1)" border="rgba(99,102,241,0.2)">
                {gradeName}
              </Badge>
              {/* Level */}
              <Badge color={levelMeta.color} bg={levelMeta.bg} border={levelMeta.border}>
                {levelMeta.label}
              </Badge>
              {/* Title */}
              <h2
                className="font-black text-white truncate"
                style={{ fontSize: "clamp(0.9rem, 2.5vw, 1.15rem)" }}
              >
                {exam.title}
              </h2>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full text-lg
                transition-opacity hover:opacity-100 shrink-0"
              style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)" }}
              aria-label="Close viewer"
            >
              ×
            </button>
          </div>

          {/* ── Body ── */}
          <ScrollPane className="flex-1 px-5 sm:px-8 py-6">
            {/* Meta row */}
            <div className="flex items-center gap-3 flex-wrap mb-5">
              <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                {subjectName}
              </span>
              {exam.created_at && (
                <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.2)" }}>
                  {new Date(exam.created_at).toLocaleDateString("en-US", {
                    day: "numeric", month: "long", year: "numeric",
                  })}
                </span>
              )}
              {exam.video_link && (
                <a
                  href={exam.video_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg
                    transition-opacity hover:opacity-80"
                  style={{
                    background: "rgba(248,113,113,0.1)",
                    color: "#F87171",
                    border: "1px solid rgba(248,113,113,0.2)",
                  }}
                >
                  ▶ Video Resource
                </a>
              )}
            </div>

            {/* Instructions block */}
            {exam.instructions && (
              <div
                className="flex gap-2.5 px-4 py-3.5 rounded-xl mb-6"
                style={{
                  background: "rgba(29,78,216,0.07)",
                  border: "1px solid rgba(29,78,216,0.18)",
                }}
              >
                <span className="text-base shrink-0 mt-0.5" style={{ color: "#60A5FA" }}>📋</span>
                <div>
                  <p
                    className="text-[9px] font-black tracking-widest uppercase mb-1"
                    style={{ color: "rgba(96,165,250,0.5)" }}
                  >
                    Instructions
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>
                    {exam.instructions}
                  </p>
                </div>
              </div>
            )}

            {/* Exam content */}
            <div
              className="ev-content"
              dangerouslySetInnerHTML={{ __html: exam.content }}
            />
          </ScrollPane>

          {/* ── Footer ── */}
          <div
            className="flex items-center justify-between gap-4 px-5 sm:px-7 py-2.5 shrink-0"
            style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
          >
            <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.18)" }}>
              {subjectName} · {tagName}
            </p>
            <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.18)" }}>
              {gradeName} · {levelMeta.label}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}