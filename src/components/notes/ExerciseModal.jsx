import { useState, useMemo } from "react";
import { createData } from "../../api/api.service";
import RichEditor from "./RichEditor";
import Field from "../common/NotesUI";
import PublishButton from "../common/PublishButton";
import WordCount from "../common/WordCount";
import { inputCls, inputStyle } from "../../utils/notes.utils";

const LEVELS = [
  { value: "beginner",     label: "Beginner",     color: "#34D399", bg: "rgba(52,211,153,0.1)"  },
  { value: "intermediate", label: "Intermediate",  color: "#F59E0B", bg: "rgba(245,158,11,0.1)"  },
  { value: "expert",       label: "Expert",        color: "#F87171", bg: "rgba(248,113,113,0.1)" },
];

export default function ExerciseModal({ note, onClose, onSuccess }) {
  const [form, setForm] = useState({
    title:        "",
    instructions: "",
    content:      "",
    video_link:   "",
    level:        "beginner",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState(null);

  const set = (key) => (eOrValue) =>
    setForm((f) => ({ ...f, [key]: eOrValue?.target ? eOrValue.target.value : eOrValue }));

  const isValid = Boolean(
    form.title.trim() &&
    form.instructions.trim() &&
    form.content.replace(/<[^>]+>/g, "").trim() &&
    form.level
  );

  const handleSubmit = async () => {
    if (!isValid || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        title:        form.title.trim(),
        topic:        note.id,                       // Topic/Note UUID
        subject:      note.subjectId ?? note.subject, // flat UUID (normalised by NoteCard)
        instructions: form.instructions.trim(),
        content:      form.content,                  // stringified HTML
        video_link:   form.video_link.trim() || null,
        level:        form.level,
      };

      const res = await createData("exercises/", payload);
      if (res?.error) throw new Error(typeof res.error === "string" ? res.error : JSON.stringify(res.error));

      onSuccess?.(`Exercise "${payload.title}" created successfully.`);
      onClose();
    } catch (err) {
      setError(err.message ?? "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  // Close on backdrop click
  const handleBackdrop = (e) => { if (e.target === e.currentTarget) onClose(); };

  return (
    <div
      className="fixed inset-0 flex items-start justify-center overflow-y-auto py-8 px-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)", zIndex: 9990 }}
      onClick={handleBackdrop}
    >
      <div
        className="w-full max-w-4xl rounded-3xl overflow-hidden flex flex-col"
        style={{ background: "#080E1A", border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.7)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-4 px-8 pt-7 pb-5"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div>
            <p className="text-[10px] font-black tracking-widest uppercase mb-1"
              style={{ color: "rgba(255,255,255,0.3)" }}>Creating exercise for</p>
            <h2 className="text-xl font-black text-white leading-tight">{note.title}</h2>
            {note.subjectName && (
              <p className="text-xs mt-1 font-semibold" style={{ color: "#F59E0B" }}>
                {note.subjectName}
              </p>
            )}
          </div>
          <button onClick={onClose}
            className="text-white/30 hover:text-white/70 text-2xl leading-none mt-1 shrink-0"
            aria-label="Close">×</button>
        </div>

        {/* ── Body ── */}
        <div className="px-8 py-6 space-y-6 overflow-y-auto">

          {/* Error banner */}
          {error && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm"
              style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)", color: "#F87171" }}>
              <span className="font-black">✕</span> {error}
            </div>
          )}

          {/* Title + Level side by side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Field label="Exercise Title" required>
              <input type="text" value={form.title} onChange={set("title")}
                placeholder="e.g. Practice — Photosynthesis Reactions"
                className={inputCls} style={inputStyle} maxLength={200} />
            </Field>

            <Field label="Difficulty Level" required>
              <div className="flex gap-2">
                {LEVELS.map((l) => (
                  <button key={l.value} onClick={() => setForm((f) => ({ ...f, level: l.value }))}
                    className="flex-1 py-2.5 rounded-xl text-xs font-black transition-all duration-150"
                    style={form.level === l.value
                      ? { background: l.bg, color: l.color, border: `1px solid ${l.color}40` }
                      : { background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.3)",
                          border: "1px solid rgba(255,255,255,0.08)" }}>
                    {l.label}
                  </button>
                ))}
              </div>
            </Field>
          </div>

          {/* Instructions — plain textarea (not rich, as it's a short directive) */}
          <Field label="Instructions" required hint="What should students do?">
            <textarea value={form.instructions} onChange={set("instructions")}
              placeholder="Read the passage below and answer the questions that follow."
              rows={3} className={`${inputCls} resize-none`} style={inputStyle} maxLength={1000} />
          </Field>

          {/* Video link */}
          <Field label="Video Link" hint="Optional — supplementary video">
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">🎥</span>
              <input type="url" value={form.video_link} onChange={set("video_link")}
                placeholder="https://youtube.com/watch?v=…"
                className={`${inputCls} pl-10`} style={inputStyle} />
            </div>
          </Field>

          {/* Rich content */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black tracking-widest uppercase"
                style={{ color: "rgba(255,255,255,0.45)" }}>Exercise Content</span>
              <span style={{ color: "#B45309" }}>*</span>
              <span className="ml-auto"><WordCount html={form.content} /></span>
            </div>
            <RichEditor value={form.content} onChange={set("content")} compact />
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-end gap-3 px-8 py-5"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <button onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-black transition-all duration-150 hover:opacity-80"
            style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.45)",
              border: "1px solid rgba(255,255,255,0.08)" }}>
            Cancel
          </button>
          <PublishButton onClick={handleSubmit} disabled={!isValid} submitting={submitting}
            label="Create Exercise →"
            className="px-6 py-2.5 rounded-xl text-sm" />
        </div>
      </div>
    </div>
  );
}