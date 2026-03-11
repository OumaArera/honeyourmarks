import { useEffect, useMemo, useRef, useState } from "react";
import "react-quill-new/dist/quill.snow.css";
import { getData, createData } from "../../api/api.service";
import RichEditor from "../notes/RichEditor";
import ExerciseModal from "../notes/ExerciseModal";
import ExerciseStats from "../notes/ExerciseStats";
import NoteViewer from "../notes/NoteViewer"; 
import Field from "../common/NotesUI";
import Toast from "../common/Toast";
import WordCount from "../common/WordCount";
import ImageAdvisory from "../common/ImageAdvisory";
import PublishButton from "../common/PublishButton";
import { getAuthorId, inputCls, inputStyle } from "../../utils/notes.utils";

// ─────────────────────────────────────────────────────────────────────────────
// ── Shared helpers
// ─────────────────────────────────────────────────────────────────────────────

const VIEWS = { CREATE: "create", BROWSE: "browse", STATS: "stats" };

function ViewTab({ label, icon, active, onClick }) {
  return (
    <button onClick={onClick}
      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black transition-all duration-150"
      style={active
        ? { background: "linear-gradient(135deg,#B45309,#D97706)", color: "#fff",
            boxShadow: "0 4px 16px rgba(180,83,9,0.35)" }
        : { background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.4)",
            border: "1px solid rgba(255,255,255,0.07)" }}>
      <span>{icon}</span> {label}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── NoteCard
// ─────────────────────────────────────────────────────────────────────────────

function NoteCard({ note, onCreateExercise, onView }) {
  const subjectName = note.subject?.name ?? "—";
  const authorName  = note.author
    ? `${note.author.first_name ?? ""} ${note.author.last_name ?? ""}`.trim()
    : "—";

  // Plain-text preview stripped from HTML (≤ 160 chars)
  const plainPreview = useMemo(() => {
    const stripped = (note.content ?? "")
      .replace(/&nbsp;/g, " ")
      .replace(/<[^>]+>/g, "")
      .replace(/\s+/g, " ")
      .trim();
    return stripped.length > 160 ? stripped.slice(0, 160) + "…" : stripped;
  }, [note.content]);

  const exerciseCount = note.exercises?.length ?? 0;

  const normalisedNote = {
    ...note,
    subjectId:   note.subject?.id ?? note.subject,
    subjectName,
  };

  return (
    <div className="rounded-2xl overflow-hidden flex flex-col"
      style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
      <div className="h-0.5 w-full" style={{ background: "linear-gradient(90deg,#B45309,transparent)" }} />

      <div className="p-5 flex flex-col gap-3 flex-1">
        {/* Title + subject */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-black text-white text-sm leading-snug flex-1">{note.title}</h3>
          <span className="text-[10px] font-black px-2 py-0.5 rounded-full shrink-0"
            style={{ background: "rgba(245,158,11,0.12)", color: "#F59E0B",
              border: "1px solid rgba(245,158,11,0.25)" }}>
            {subjectName}
          </span>
        </div>

        {/* Description */}
        {note.description && (
          <p className="text-xs leading-relaxed line-clamp-1" style={{ color: "rgba(255,255,255,0.4)" }}>
            {note.description}
          </p>
        )}

        {/* Content preview */}
        {plainPreview && (
          <p className="text-[11px] leading-relaxed line-clamp-3"
            style={{ color: "rgba(255,255,255,0.3)", fontStyle: "italic" }}>
            {plainPreview}
          </p>
        )}

        {/* Meta */}
        <div className="flex items-center justify-between mt-auto pt-1">
          <div className="flex items-center gap-3">
            <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.25)" }}>{authorName}</span>
            {exerciseCount > 0 && (
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full"
                style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.3)",
                  border: "1px solid rgba(255,255,255,0.08)" }}>
                {exerciseCount} ex
              </span>
            )}
          </div>
          <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>
            {note.created_at ? new Date(note.created_at).toLocaleDateString() : ""}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <button onClick={() => onView(note)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg
              text-[11px] font-black transition-all duration-150 hover:opacity-90 active:scale-95"
            style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.6)",
              border: "1px solid rgba(255,255,255,0.09)" }}>
            👁 View Note
          </button>
          <button onClick={() => onCreateExercise(normalisedNote)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg
              text-[11px] font-black transition-all duration-150 hover:opacity-90 active:scale-95"
            style={{ background: "rgba(180,83,9,0.15)", color: "#F59E0B",
              border: "1px solid rgba(180,83,9,0.3)" }}>
            ＋ Exercise
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── BrowseView
// ─────────────────────────────────────────────────────────────────────────────

function BrowseView({ subjects, onCreateExercise, onViewNote }) {
  const [notes,    setNotes]    = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [total,    setTotal]    = useState(0);
  const [search,   setSearch]   = useState("");
  const [subject,  setSubject]  = useState("");
  const [author,   setAuthor]   = useState("");
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await getData("teachers/");
      if (!res?.error) setTeachers(res?.results ?? []);
    })();
  }, []);

  const searchTimer = useRef(null);

  const fetchNotes = async ({ searchVal, subjectVal, authorVal } = {}) => {
    setLoading(true);
    const params = new URLSearchParams();
    const s   = searchVal  ?? search;
    const sub = subjectVal ?? subject;
    const aut = authorVal  ?? author;
    if (s)   params.set("search", s);
    if (sub) params.set("subject", sub);
    if (aut) params.set("author", aut);
    const res = await getData(`topics/?${params.toString()}`);
    if (!res?.error) { setNotes(res?.results ?? []); setTotal(res?.count ?? 0); }
    setLoading(false);
  };

  useEffect(() => { fetchNotes(); }, []); // eslint-disable-line

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearch(val);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => fetchNotes({ searchVal: val }), 400);
  };
  const handleSubject = (e) => { setSubject(e.target.value); fetchNotes({ subjectVal: e.target.value }); };
  const handleAuthor  = (e) => { setAuthor(e.target.value);  fetchNotes({ authorVal:  e.target.value }); };

  const selectStyle = {
    ...inputStyle,
    appearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='rgba(255,255,255,0.3)' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 12px center",
    paddingRight: "32px",
  };

  return (
    <div className="space-y-5">
      {/* Filter bar */}
      <div className="rounded-2xl p-4 space-y-3"
        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm pointer-events-none"
            style={{ color: "rgba(255,255,255,0.3)" }}>🔍</span>
          <input type="text" value={search} onChange={handleSearch}
            placeholder="Search by title or description…"
            className={`${inputCls} pl-9`} style={inputStyle} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <select value={subject} onChange={handleSubject} className={inputCls} style={selectStyle}>
            <option value="" style={{ background: "#111827" }}>All Subjects</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id} style={{ background: "#111827" }}>{s.name}</option>
            ))}
          </select>
          <select value={author} onChange={handleAuthor} className={inputCls} style={selectStyle}>
            <option value="" style={{ background: "#111827" }}>All Authors</option>
            {teachers.map((t) => (
              <option key={t.id} value={t.id} style={{ background: "#111827" }}>
                {t.first_name} {t.last_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results header */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-black" style={{ color: "rgba(255,255,255,0.3)" }}>
          {loading ? "Loading…" : `${total} note${total !== 1 ? "s" : ""} found`}
        </p>
        {(search || subject || author) && (
          <button
            onClick={() => { setSearch(""); setSubject(""); setAuthor("");
              fetchNotes({ searchVal: "", subjectVal: "", authorVal: "" }); }}
            className="text-[10px] font-black hover:opacity-70 transition-opacity"
            style={{ color: "#F59E0B" }}>
            Clear filters
          </button>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center gap-2 py-8 justify-center text-sm"
          style={{ color: "rgba(255,255,255,0.25)" }}>
          <span className="w-4 h-4 border-2 border-white/20 border-t-amber-600 rounded-full animate-spin" />
          Fetching notes…
        </div>
      ) : notes.length === 0 ? (
        <div className="py-12 text-center text-sm" style={{ color: "rgba(255,255,255,0.25)" }}>
          No notes found. Try adjusting your filters or create one.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onCreateExercise={onCreateExercise}
              onView={onViewNote}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── CreateView (unchanged)
// ─────────────────────────────────────────────────────────────────────────────

function CreateView({ subjects, loadingSubs, teacherId, onSuccess, onError }) {
  const [form, setForm] = useState({
    title: "", description: "", subject: "", content: "", video_link: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const set = (key) => (eOrValue) =>
    setForm((f) => ({ ...f, [key]: eOrValue?.target ? eOrValue.target.value : eOrValue }));

  const isValid = Boolean(
    form.title.trim() &&
    form.description.trim() &&
    form.subject &&
    form.content.replace(/<[^>]+>/g, "").trim()
  );

  const handleSubmit = async () => {
    if (!isValid || submitting) return;
    if (!teacherId) { onError("Teacher profile could not be resolved. Please log in again."); return; }
    setSubmitting(true);
    try {
      const payload = {
        title:       form.title.trim(),
        description: form.description.trim(),
        subject:     form.subject,
        author:      teacherId,
        content:     form.content,
        video_link:  form.video_link.trim() || null,
      };
      const res = await createData("topics/", payload);
      if (res?.error) throw new Error(typeof res.error === "string" ? res.error : JSON.stringify(res.error));
      onSuccess(`"${payload.title}" published successfully.`);
      setForm({ title: "", description: "", subject: "", content: "", video_link: "" });
    } catch (err) {
      onError(err.message ?? "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const selectStyle = {
    ...inputStyle,
    appearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='rgba(255,255,255,0.3)' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 14px center",
    paddingRight: "36px",
  };

  return (
    <div className="space-y-8 w-full">
      {/* <ImageAdvisory /> */}
      <div className="rounded-2xl space-y-6 p-4 sm:p-6"
        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Field label="Title" required>
            <input type="text" value={form.title} onChange={set("title")}
              placeholder="e.g. Photosynthesis — Light & Dark Reactions"
              className={inputCls} style={inputStyle} maxLength={200} />
          </Field>
          <Field label="Subject" required>
            {loadingSubs ? (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
                style={{ ...inputStyle, color: "rgba(255,255,255,0.3)" }}>
                <span className="w-4 h-4 border-2 border-white/20 border-t-amber-600 rounded-full animate-spin" />
                Loading subjects…
              </div>
            ) : (
              <select value={form.subject} onChange={set("subject")} className={inputCls} style={selectStyle}>
                <option value="" style={{ background: "#111827" }}>— Select a subject —</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id} style={{ background: "#111827" }}>{s.name}</option>
                ))}
              </select>
            )}
          </Field>
        </div>
        <Field label="Description" required hint="Brief summary shown in listings">
          <textarea value={form.description} onChange={set("description")}
            placeholder="What will students learn from this note?"
            rows={3} className={`${inputCls} resize-none`} style={inputStyle} maxLength={500} />
        </Field>
        <Field label="Video Link" hint="Optional — YouTube, Vimeo, etc.">
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">🎥</span>
            <input type="url" value={form.video_link} onChange={set("video_link")}
              placeholder="https://youtube.com/watch?v=…"
              className={`${inputCls} pl-10`} style={inputStyle} />
          </div>
        </Field>
      </div>
      <div className="space-y-2 -mx-50"> 
        <div className="flex items-center gap-2">
          <span className="text-xs font-black tracking-widest uppercase"
            style={{ color: "rgba(255,255,255,0.45)" }}>Note Content</span>
          <span style={{ color: "#B45309" }}>*</span>
          <span className="ml-auto flex items-center gap-3">
            <WordCount html={form.content} />
            <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>
              Headings · Lists · Images · Code · Video
            </span>
          </span>
        </div>
        <RichEditor value={form.content} onChange={set("content")} />
      </div>
      <PublishButton onClick={handleSubmit} disabled={!isValid} submitting={submitting}
        className="sm:hidden w-full py-4 rounded-2xl text-base"
        style={{ boxShadow: !isValid ? "none" : "0 6px 24px rgba(180,83,9,0.5)" }} />
      <div className="hidden sm:flex justify-end">
        <PublishButton onClick={handleSubmit} disabled={!isValid} submitting={submitting}
          className="px-8 py-3 rounded-xl text-sm" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── Main NotesTab
// ─────────────────────────────────────────────────────────────────────────────

export default function NotesTab() {
  const [view,        setView]        = useState(VIEWS.CREATE);
  const [subjects,    setSubjects]    = useState([]);
  const [loadingSubs, setLoadingSubs] = useState(true);
  const [toast,       setToast]       = useState(null);

  // Modals
  const [exerciseFor, setExerciseFor] = useState(null); // note → ExerciseModal
  const [viewingNote, setViewingNote] = useState(null); // note → NoteViewer

  const userId = useMemo(() => getAuthorId(), []);
  const [teacherId, setTeacherId] = useState(null);

  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        const res = await getData(`teachers/?user_id=${userId}`);
        if (res?.error) throw new Error(res.error);
        const teacher = res?.results?.[0];
        if (!teacher) throw new Error("Teacher profile not found for this account.");
        setTeacherId(teacher.id);
      } catch (err) {
        setToast({ type: "error", title: "Profile error", message: err.message });
      }
    })();
  }, [userId]);

  useEffect(() => {
    (async () => {
      try {
        const res = await getData("subjects/");
        if (res?.error) throw new Error(res.error);
        setSubjects(res?.results ?? []);
      } catch (err) {
        setToast({ type: "error", title: "Couldn't load subjects", message: err.message });
      } finally {
        setLoadingSubs(false);
      }
    })();
  }, []);

  const notify = (type, title, message) => setToast({ type, title, message });

  return (
    <>
      <Toast toast={toast} onDismiss={() => setToast(null)} />

      {/* Exercise creation modal */}
      {exerciseFor && (
        <ExerciseModal
          note={exerciseFor}
          onClose={() => setExerciseFor(null)}
          onSuccess={(msg) => {
            setExerciseFor(null);
            notify("success", "Exercise created!", msg);
          }}
        />
      )}

      {/* Note viewer modal — no extra fetch needed; exercises are embedded in the list response */}
      {viewingNote && (
        <NoteViewer
          note={viewingNote}
          onClose={() => setViewingNote(null)}
        />
      )}

      <div className="space-y-6 pb-10 w-full max-w-none">
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">📚 Notes</h2>
              <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>
                Create, browse, and build exercises from your notes
              </p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <ViewTab icon="✍️" label="Create Note"    active={view === VIEWS.CREATE} onClick={() => setView(VIEWS.CREATE)} />
            <ViewTab icon="🔍" label="Browse Notes"   active={view === VIEWS.BROWSE} onClick={() => setView(VIEWS.BROWSE)} />
            <ViewTab icon="📊" label="Exercise Stats" active={view === VIEWS.STATS}  onClick={() => setView(VIEWS.STATS)} />
          </div>
        </div>

        {view === VIEWS.CREATE && (
          <CreateView
            subjects={subjects}
            loadingSubs={loadingSubs}
            teacherId={teacherId}
            onSuccess={(msg) => notify("success", "Note published!", msg)}
            onError={(msg)    => notify("error",   "Failed to save note", msg)}
          />
        )}

        {view === VIEWS.BROWSE && (
          <BrowseView
            subjects={subjects}
            onCreateExercise={(note) => setExerciseFor(note)}
            onViewNote={(note) => setViewingNote(note)}
          />
        )}

        {view === VIEWS.STATS && <ExerciseStats />}
      </div>
    </>
  );
}