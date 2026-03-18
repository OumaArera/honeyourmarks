import { useState } from "react";
import { createData, getData } from "../../api/api.service";
import ChallengeAnalytics from "./ChallengeAnalytics";

// ─────────────────────────────────────────────────────────────────────────────
// ── DaysBuilder
// ─────────────────────────────────────────────────────────────────────────────

function DaysBuilder({ challenge, onDaysSaved, onError }) {
  const existing = challenge.days ?? [];
  const total = challenge.duration_days ?? 0;

  const buildDrafts = () =>
    Array.from({ length: total }, (_, i) => {
      const dayNum = i + 1;
      const saved = existing.find((d) => d.day_number === dayNum);
      return {
        day_number: dayNum,
        title: saved?.title ?? `Day ${dayNum}`,
        description: saved?.description ?? "",
        content: saved?.content ?? "",
        saved: !!saved,
        savedId: saved?.id ?? null,
      };
    });

  const [days, setDays] = useState(buildDrafts);
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState(null);

  const setDay = (i, field, val) =>
    setDays((prev) => prev.map((d, idx) => (idx === i ? { ...d, [field]: val } : d)));

  const handleSave = async () => {
    const unsaved = days.filter((d) => !d.saved);
    if (unsaved.length === 0) { onError?.("All days are already saved."); return; }
    const invalid = unsaved.find((d) => !d.title.trim() || !d.description.trim());
    if (invalid) { onError?.(`Day ${invalid.day_number}: title and description are required.`); return; }

    setSaving(true);
    try {
      const results = await Promise.all(
        unsaved.map((d) =>
          createData("challenge-days/", {
            challenge: challenge.id,
            day_number: d.day_number,
            title: d.title,
            description: d.description,
            content: d.content,
          })
        )
      );
      const errors = results.filter((r) => r?.error);
      if (errors.length) throw new Error(errors[0].error);
      setDays((prev) =>
        prev.map((d) => {
          if (d.saved) return d;
          const res = results.find((r) => r.day_number === d.day_number);
          return { ...d, saved: true, savedId: res?.id ?? null };
        })
      );
      onDaysSaved?.(results);
    } catch (err) {
      onError?.(err.message);
    } finally {
      setSaving(false);
    }
  };

  const unsavedCount = days.filter((d) => !d.saved).length;

  const inputCls =
    "w-full rounded-lg px-3 py-2 text-xs text-white outline-none transition-all bg-white/5 border border-white/10 placeholder-white/25 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20";

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="text-xs font-bold text-white/40 uppercase tracking-widest">
          {total} Day{total !== 1 ? "s" : ""} · {unsavedCount} unsaved
        </p>
        <button
          onClick={handleSave}
          disabled={saving || unsavedCount === 0}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all disabled:opacity-40 bg-linear-to-br from-blue-700 to-blue-500 text-white shadow-md shadow-blue-900/30"
        >
          {saving ? (
            <><span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</>
          ) : (
            <>💾 Save {unsavedCount > 0 ? `${unsavedCount} Day${unsavedCount !== 1 ? "s" : ""}` : "Days"}</>
          )}
        </button>
      </div>

      {days.map((day, i) => (
        <div key={day.day_number}
          className={`rounded-2xl overflow-hidden border transition-all ${day.saved ? "border-white/10 bg-white/3" : "border-blue-500/30 bg-blue-950/20"}`}>
          <button
            onClick={() => setExpanded(expanded === i ? null : i)}
            className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/5 transition-all"
          >
            <div className="flex items-center gap-3">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${day.saved ? "bg-linear-to-br from-emerald-600 to-emerald-400" : "bg-linear-to-br from-blue-700 to-blue-500"} text-white`}>
                {day.saved ? "✓" : day.day_number}
              </span>
              <div className="text-left">
                <p className="text-sm font-black text-white leading-tight">{day.title || `Day ${day.day_number}`}</p>
                <p className="text-xs text-white/40 mt-0.5 line-clamp-1">{day.description || "No description yet"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {!day.saved && <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-blue-500/20 text-blue-400">unsaved</span>}
              <span className="text-white/30 text-xs">{expanded === i ? "▲" : "▼"}</span>
            </div>
          </button>

          {expanded === i && (
            <div className="px-4 pb-4 pt-2 border-t border-white/5 space-y-3">
              {["title", "description"].map((field) => (
                <div key={field} className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-white/35">{field}</label>
                  <input type="text" value={day[field]} onChange={(e) => setDay(i, field, e.target.value)}
                    disabled={day.saved} placeholder={field === "title" ? `Day ${day.day_number} title` : "Brief description of this day's focus"}
                    className={inputCls + (day.saved ? " opacity-50 cursor-not-allowed" : "")} />
                </div>
              ))}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest text-white/35">Content</label>
                <textarea rows={3} value={day.content} onChange={(e) => setDay(i, "content", e.target.value)}
                  disabled={day.saved} placeholder="Reading material, instructions, or notes for students…"
                  className={`${inputCls} resize-none${day.saved ? " opacity-50 cursor-not-allowed" : ""}`} />
              </div>
              {day.saved && (
                <p className="text-xs text-emerald-400/70 flex items-center gap-1.5">
                  <span>✓</span> Saved — use the Assignments tab to add tasks to this day.
                </p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── AssignmentSubmissions  — per-assignment submissions panel
// ─────────────────────────────────────────────────────────────────────────────

function AssignmentSubmissions({ assignmentId, onError }) {
  const [submissions, setSubmissions] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getData(`challenge-submissions/?assignment=${assignmentId}`);
      if (res?.error) throw new Error(res.error);
      setSubmissions(res?.results ?? []);
    } catch (err) {
      onError?.(err.message);
    } finally {
      setLoading(false);
    }
  };



  if (!submissions) return (
    <button onClick={load} disabled={loading}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50 bg-white/5 text-white/50 border border-white/10 hover:bg-white/10">
      {loading
        ? <><span className="w-2.5 h-2.5 border border-white/20 border-t-white/60 rounded-full animate-spin" /> Loading…</>
        : "👁 View Submissions"
      }
    </button>
  );

  if (submissions.length === 0)
    return <p className="text-xs text-white/30 pl-1">No submissions for this assignment yet.</p>;



  return (
    <div className="space-y-2">
      {submissions.map((s) => (
        <div key={s.id}
          className="rounded-xl px-3 py-2.5 flex items-start gap-3 bg-white/3 border border-white/6">
          <div className="flex-1 min-w-0 space-y-1">
            {/* Student identifier */}
            <p className="text-xs font-bold text-white truncate">
              {s.student_name ?? s.student ?? "Student"}
            </p>
            {/* Response text */}
            {s.text_content && (
              <p className="text-xs text-white/50 leading-relaxed line-clamp-3 bg-white/3 rounded-lg px-2.5 py-2 border border-white/5">
                {s.text_content}
              </p>
            )}
            {/* Submitted at */}
            <p className="text-xs text-white/25">
              {s.submitted_at ? new Date(s.submitted_at).toLocaleString() : ""}
            </p>
          </div>

          
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── AssignmentForm
// ─────────────────────────────────────────────────────────────────────────────

function AssignmentForm({ dayId, onCreated, onError }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "" });
  const [saving, setSaving] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.title || !form.description) { onError?.("Title and description are required."); return; }
    setSaving(true);
    try {
      const res = await createData("challenge-assignments/", { ...form, day: dayId });
      if (res?.error) throw new Error(res.error);
      setForm({ title: "", description: "" });
      setOpen(false);
      onCreated?.(res);
    } catch (err) {
      onError?.(err.message);
    } finally {
      setSaving(false);
    }
  };

  const inputCls =
    "w-full rounded-xl px-3 py-2.5 text-xs text-white outline-none transition-all bg-white/5 border border-white/10 placeholder-white/25 focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/20";

  if (!open) return (
    <button onClick={() => setOpen(true)}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all bg-blue-500/10 text-blue-400 border border-dashed border-blue-500/30 hover:bg-blue-500/20">
      + Add Assignment
    </button>
  );

  return (
    <div className="rounded-xl p-3 space-y-2 bg-white/4 border border-white/8">
      <input type="text" placeholder="Assignment title" value={form.title} onChange={set("title")} className={inputCls} />
      <textarea rows={2} placeholder="Description / instructions" value={form.description} onChange={set("description")} className={`${inputCls} resize-none`} />
      <div className="flex gap-2">
        <button onClick={handleSubmit} disabled={saving}
          className="flex-1 py-2 rounded-lg text-xs font-black transition-all disabled:opacity-50 bg-linear-to-br from-blue-700 to-blue-500 text-white">
          {saving ? "Saving…" : "Save Assignment"}
        </button>
        <button onClick={() => setOpen(false)} className="px-3 py-2 rounded-lg text-xs font-bold bg-white/5 text-white/40 hover:bg-white/10">
          Cancel
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── AssignmentCard  — assignment row with inline submissions toggle
// ─────────────────────────────────────────────────────────────────────────────

function AssignmentCard({ assignment, onError }) {
  const [showSubmissions, setShowSubmissions] = useState(false);

  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/4 overflow-hidden">
      {/* Assignment header */}
      <div className="px-3 py-2.5 flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-white">{assignment.title}</p>
          <p className="text-xs mt-0.5 text-white/40">{assignment.description}</p>
        </div>
        <button
          onClick={() => setShowSubmissions((v) => !v)}
          className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
            showSubmissions
              ? "bg-blue-500/20 text-blue-400"
              : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/60"
          }`}
        >
          {showSubmissions ? "Hide" : "Submissions"}
        </button>
      </div>

      {/* Submissions panel — per assignment */}
      {showSubmissions && (
        <div className="px-3 pb-3 pt-1 border-t border-white/5">
          <AssignmentSubmissions assignmentId={assignment.id} onError={onError} />
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── DayCard  — day accordion with assignments and per-assignment submissions
// ─────────────────────────────────────────────────────────────────────────────

function DayCard({ day, onError }) {
  const [assignments, setAssignments] = useState(day.assignments ?? []);
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/3">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/5 transition-all"
      >
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black bg-linear-to-br from-blue-700 to-blue-500 text-white shrink-0">
            {day.day_number}
          </span>
          <div>
            <p className="text-sm font-black text-white">{day.title}</p>
            <p className="text-xs text-white/40">{day.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-blue-500/15 text-blue-400">
            {assignments.length} task{assignments.length !== 1 ? "s" : ""}
          </span>
          <span className="text-white/30 text-xs">{expanded ? "▲" : "▼"}</span>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 pt-3 border-t border-white/5 space-y-3">
          {day.content && <p className="text-xs text-white/50 leading-relaxed">{day.content}</p>}

          {assignments.length > 0 && (
            <div className="space-y-2">
              {assignments.map((a) => (
                <AssignmentCard key={a.id} assignment={a} onError={onError} />
              ))}
            </div>
          )}

          <AssignmentForm dayId={day.id} onCreated={(a) => setAssignments((p) => [...p, a])} onError={onError} />
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── ChallengeDetail
// ─────────────────────────────────────────────────────────────────────────────

const DETAIL_TABS = [
  { id: "days",        label: "📅 Days" },
  { id: "assignments", label: "📝 Assignments" },
  { id: "analytics",  label: "📊 Analytics" },
];

export default function ChallengeDetail({ challenge, onBack, onError }) {
  const [tab, setTab] = useState("days");
  const [localChallenge, setLocalChallenge] = useState(challenge);

  const days = localChallenge.days ?? [];
  const allDaysSaved = days.length >= (localChallenge.duration_days ?? 0);

  const handleDaysSaved = (newDays) => {
    setLocalChallenge((prev) => {
      const merged = [...(prev.days ?? [])];
      newDays.forEach((nd) => {
        if (!merged.find((d) => d.day_number === nd.day_number))
          merged.push({ ...nd, assignments: [] });
      });
      merged.sort((a, b) => a.day_number - b.day_number);
      return { ...prev, days: merged };
    });
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start gap-3">
        <button onClick={() => onBack()}
          className="mt-0.5 w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black transition-all shrink-0 bg-white/5 text-white/50 hover:bg-white/10 hover:text-white">
          ←
        </button>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-black text-white leading-tight truncate">{localChallenge.title}</h3>
          <p className="text-xs mt-0.5 text-white/40">
            {localChallenge.description} · {localChallenge.duration_days} day{localChallenge.duration_days !== 1 ? "s" : ""}
          </p>
        </div>
        <button onClick={() => onBack("create")}
          className="shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all bg-white/5 text-white/40 border border-white/10 hover:bg-white/10 hover:text-white/60">
          + New
        </button>
      </div>

      {/* Status bar */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/3 border border-white/6 text-xs text-white/40">
        <span className={`w-2 h-2 rounded-full shrink-0 ${allDaysSaved ? "bg-emerald-400" : "bg-amber-400 animate-pulse"}`} />
        {allDaysSaved
          ? `All ${localChallenge.duration_days} days set up · ${days.reduce((acc, d) => acc + (d.assignments?.length ?? 0), 0)} assignments`
          : `${days.length} of ${localChallenge.duration_days} days configured — complete setup in the Days tab`}
      </div>

      {/* Tab bar */}
      <div className="flex gap-1.5 flex-wrap">
        {DETAIL_TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              tab === t.id
                ? "bg-linear-to-br from-blue-700 to-blue-500 text-white shadow-md shadow-blue-900/30"
                : "bg-white/5 text-white/40 border border-white/10 hover:bg-white/10 hover:text-white/60"
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Days tab */}
      {tab === "days" && (
        <DaysBuilder challenge={localChallenge} onDaysSaved={handleDaysSaved} onError={onError} />
      )}

      {/* Assignments + submissions tab */}
      {tab === "assignments" && (
        <div className="space-y-3">
          {days.length === 0 ? (
            <div className="rounded-2xl p-5 text-center bg-white/3 border border-dashed border-white/10">
              <p className="text-2xl mb-2">📅</p>
              <p className="text-sm font-bold text-white">Set up days first</p>
              <p className="text-xs mt-1 text-white/35">Go to the Days tab to create your challenge days before adding assignments.</p>
              <button onClick={() => setTab("days")}
                className="mt-3 px-4 py-2 rounded-xl text-xs font-black bg-linear-to-br from-blue-700 to-blue-500 text-white">
                Set Up Days
              </button>
            </div>
          ) : (
            days.map((day) => <DayCard key={day.id} day={day} onError={onError} />)
          )}
        </div>
      )}

      {/* Analytics tab */}
      {tab === "analytics" && <ChallengeAnalytics challengeId={localChallenge.id} />}
    </div>
  );
}