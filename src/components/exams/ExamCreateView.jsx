import { useState } from "react";
import { createData } from "../../api/api.service";
import Field from "../common/NotesUI";
import WordCount from "../common/WordCount";
import PublishButton from "../common/PublishButton";
import RichEditor from "../notes/RichEditor";
import {
  GRADE_OPTIONS,
  LEVEL_OPTIONS,
  selectStyle,
  inputStyle,
  inputCls,
} from "./constants";

// ─────────────────────────────────────────────────────────────────────────────
// ── ExamCreateView
// ─────────────────────────────────────────────────────────────────────────────

export default function ExamCreateView({
  subjectTags,
  loadingTags,
  teacherId,
  onSuccess,
  onError,
}) {
  const [form, setForm] = useState({
    title: "",
    instructions: "",
    subject_tag: "",
    grade: "",
    level: "",
    content: "",
    video_link: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const set = (key) => (eOrValue) =>
    setForm((f) => ({
      ...f,
      [key]: eOrValue?.target ? eOrValue.target.value : eOrValue,
    }));

  const isValid = Boolean(
    form.title.trim() &&
    form.instructions.trim() &&
    form.subject_tag &&
    form.grade &&
    form.level &&
    form.content.replace(/<[^>]+>/g, "").trim()
  );

  const handleSubmit = async () => {
    if (!isValid || submitting) return;
    setSubmitting(true);
    try {
      const payload = {
        title:        form.title.trim(),
        instructions: form.instructions.trim(),
        subject_tag:  form.subject_tag,
        grade:        form.grade,
        level:        form.level,
        content:      form.content,
        video_link:   form.video_link.trim() || null,
      };
      const res = await createData("exam-questions/", payload);
      if (res?.error)
        throw new Error(typeof res.error === "string" ? res.error : JSON.stringify(res.error));
      onSuccess(`"${payload.title}" published successfully.`);
      setForm({
        title: "", instructions: "", subject_tag: "", grade: "",
        level: "", content: "", video_link: "",
      });
    } catch (err) {
      onError(err.message ?? "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  // Group subject tags by subject_name for optgroup display
  const groupedTags = subjectTags.reduce((acc, tag) => {
    if (!acc[tag.subject_name]) acc[tag.subject_name] = [];
    acc[tag.subject_name].push(tag);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      {/* <ImageAdvisory /> */}

      {/* ── Core fields ── */}
      <div
        className="rounded-2xl space-y-6 p-6"
        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* Row 1: Title + Subject Tag */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Field label="Title" required>
            <input
              type="text"
              value={form.title}
              onChange={set("title")}
              placeholder="e.g. End of Term Mathematics Paper 1"
              className={inputCls}
              style={inputStyle}
              maxLength={200}
            />
          </Field>

          <Field label="Subject Tag" required>
            {loadingTags ? (
              <div
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
                style={{ ...inputStyle, color: "rgba(255,255,255,0.3)" }}
              >
                <span className="w-4 h-4 border-2 border-white/20 border-t-blue-600 rounded-full animate-spin" />
                Loading tags…
              </div>
            ) : (
              <select
                value={form.subject_tag}
                onChange={set("subject_tag")}
                className={inputCls}
                style={selectStyle}
              >
                <option value="" style={{ background: "#111827" }}>— Select a subject tag —</option>
                {Object.entries(groupedTags).map(([subjectName, tags]) => (
                  <optgroup key={subjectName} label={subjectName}>
                    {tags.map((tag) => (
                      <option key={tag.id} value={tag.id} style={{ background: "#111827" }}>
                        {tag.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            )}
          </Field>
        </div>

        {/* Row 2: Grade + Level */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Field label="Grade" required>
            <select
              value={form.grade}
              onChange={set("grade")}
              className={inputCls}
              style={selectStyle}
            >
              <option value="" style={{ background: "#111827" }}>— Select a grade —</option>
              {GRADE_OPTIONS.map((g) => (
                <option key={g.value} value={g.value} style={{ background: "#111827" }}>
                  {g.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Level" required>
            <select
              value={form.level}
              onChange={set("level")}
              className={inputCls}
              style={selectStyle}
            >
              <option value="" style={{ background: "#111827" }}>— Select a level —</option>
              {LEVEL_OPTIONS.map((l) => (
                <option key={l.value} value={l.value} style={{ background: "#111827" }}>
                  {l.label}
                </option>
              ))}
            </select>
          </Field>
        </div>

        {/* Instructions */}
        <Field label="Instructions" required hint="Shown at the top of the exam paper">
          <textarea
            value={form.instructions}
            onChange={set("instructions")}
            placeholder="e.g. Answer ALL questions. Show all working. Each question carries equal marks."
            rows={3}
            className={`${inputCls} resize-none`}
            style={inputStyle}
            maxLength={1000}
          />
        </Field>

        {/* Video Link */}
        <Field label="Video Link" hint="Optional — YouTube, Vimeo, etc.">
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"></span>
            <input
              type="url"
              value={form.video_link}
              onChange={set("video_link")}
              placeholder="https://youtube.com/watch?v=…"
              className={`${inputCls} pl-10`}
              style={inputStyle}
            />
          </div>
        </Field>
      </div>

      {/* ── Rich content editor ── */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-black tracking-widest uppercase"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            Exam Questions
          </span>
          <span style={{ color: "#1D4ED8" }}>*</span>
          <span className="ml-auto flex items-center gap-3">
            <WordCount html={form.content} />
            <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>
              Numbered lists · Headings · Images · Code · Formulas
            </span>
          </span>
        </div>
        <RichEditor value={form.content} onChange={set("content")} />
      </div>

      {/* ── Submit ── */}
      <PublishButton
        onClick={handleSubmit}
        disabled={!isValid}
        submitting={submitting}
        className="sm:hidden w-full py-4 rounded-2xl text-base"
        style={{ boxShadow: !isValid ? "none" : "0 6px 24px rgba(29,78,216,0.5)" }}
      />
      <div className="hidden sm:flex justify-end">
        <PublishButton
          onClick={handleSubmit}
          disabled={!isValid}
          submitting={submitting}
          className="px-8 py-3 rounded-xl text-sm"
        />
      </div>
    </div>
  );
}