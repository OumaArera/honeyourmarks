import { useEffect, useState } from "react";
import { getData, createData } from "../../api/api.service";

// ─────────────────────────────────────────────────────────────────────────────
// ── Helpers
// ─────────────────────────────────────────────────────────────────────────────

const CLASS_COLORS = [
  "#0891B2","#3B82F6","#10B981","#F59E0B",
  "#A855F7","#EF4444","#EC4899","#14B8A6",
];

function classColor(id = "") {
  return CLASS_COLORS[id.charCodeAt(0) % CLASS_COLORS.length];
}

function fmtDatetime(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-US", {
    weekday: "short", day: "numeric", month: "short",
    year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

function fmtTime(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

function fmtDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}

function duration(start, end) {
  if (!start || !end) return "";
  const mins = Math.round((new Date(end) - new Date(start)) / 60000);
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60), m = mins % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

function isUpcoming(cls) {
  return new Date(cls.end_time) > new Date();
}

function totalStudents(groups = []) {
  const ids = new Set();
  groups.forEach((g) => (g.students ?? []).forEach((s) => ids.add(s.id)));
  return ids.size;
}

// ─────────────────────────────────────────────────────────────────────────────
// ── Shared atoms
// ─────────────────────────────────────────────────────────────────────────────

const inputCls  = "w-full rounded-xl px-4 py-2.5 text-sm text-white outline-none";
const inputStyle = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" };

function ViewTab({ label, active, onClick }) {
  return (
    <button onClick={onClick}
      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black transition-all duration-150"
      style={active
        ? { background: "linear-gradient(135deg,#0369A1,#0891B2)", color: "#fff", boxShadow: "0 4px 16px rgba(8,145,178,0.35)" }
        : { background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.07)" }}>
      {label}
    </button>
  );
}

function Spinner() {
  return <span className="w-4 h-4 border-2 border-white/20 border-t-cyan-400 rounded-full animate-spin inline-block" />;
}

// ─────────────────────────────────────────────────────────────────────────────
// ── GroupPicker
// ─────────────────────────────────────────────────────────────────────────────

function GroupPicker({ selected, onChange, groups, loading }) {
  const toggle = (g) => {
    const already = selected.some((s) => s.id === g.id);
    onChange(already ? selected.filter((s) => s.id !== g.id) : [...selected, g]);
  };
  const isSelected = (id) => selected.some((s) => s.id === id);

  return (
    <div className="space-y-2">
      {/* Selected chips */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 p-3 rounded-xl"
          style={{ background: "rgba(8,145,178,0.06)", border: "1px solid rgba(8,145,178,0.18)" }}>
          {selected.map((g) => (
            <span key={g.id}
              className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full"
              style={{ background: "rgba(8,145,178,0.18)", color: "#67E8F9", border: "1px solid rgba(8,145,178,0.3)" }}>
              ◈ {g.name}
              <button onClick={() => toggle(g)} className="ml-0.5 hover:opacity-70 text-xs">×</button>
            </span>
          ))}
        </div>
      )}

      {/* List */}
      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="px-3 py-2 flex items-center justify-between"
          style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <span className="text-[10px] font-black" style={{ color: "rgba(255,255,255,0.3)" }}>
            {loading ? "Loading groups…" : `${groups.length} group${groups.length !== 1 ? "s" : ""} available`}
          </span>
          <span className="text-[10px] font-black" style={{ color: "#67E8F9" }}>
            {selected.length} selected
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-6 text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
            <Spinner /> Loading…
          </div>
        ) : groups.length === 0 ? (
          <div className="text-center py-5 text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
            No groups found. Create a group first.
          </div>
        ) : (
          groups.map((g) => {
            const sel = isSelected(g.id);
            return (
              <button key={g.id} onClick={() => toggle(g)}
                className="w-full flex items-center gap-3 px-3 py-3 text-left transition-all"
                style={{
                  background: sel ? "rgba(8,145,178,0.1)" : "transparent",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                }}>
                {/* Checkbox */}
                <div className="w-4 h-4 rounded flex items-center justify-center shrink-0"
                  style={sel
                    ? { background: "#0891B2", border: "1px solid #0891B2" }
                    : { background: "transparent", border: "1px solid rgba(255,255,255,0.2)" }}>
                  {sel && <span className="text-white text-[9px] font-black">✓</span>}
                </div>

                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0"
                  style={{ background: sel ? "rgba(8,145,178,0.3)" : "rgba(255,255,255,0.06)", color: sel ? "#67E8F9" : "rgba(255,255,255,0.4)" }}>
                  ◈
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">{g.name}</p>
                  <p className="text-[10px] truncate" style={{ color: "rgba(255,255,255,0.3)" }}>
                    {g.students?.length ?? 0} student{g.students?.length !== 1 ? "s" : ""}
                    {g.description ? ` · ${g.description}` : ""}
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── CreateView
// ─────────────────────────────────────────────────────────────────────────────

function CreateView({ onSuccess, onError }) {
  const [form, setForm] = useState({
    title: "", url: "", start_time: "", end_time: "",
    references: "", notes: "",
  });
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [groups,         setGroups]         = useState([]);
  const [loadingGroups,  setLoadingGroups]  = useState(true);
  const [submitting,     setSubmitting]     = useState(false);

  useEffect(() => {
    (async () => {
      const res = await getData("groups/");
      if (!res?.error) setGroups(res?.results ?? []);
      setLoadingGroups(false);
    })();
  }, []);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const isValid = form.title.trim() && form.url.trim() && form.start_time && form.end_time && selectedGroups.length > 0;

  const handleSubmit = async () => {
    if (!isValid || submitting) return;
    if (new Date(form.end_time) <= new Date(form.start_time)) {
      onError("End time must be after start time.");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        title:      form.title.trim(),
        url:        form.url.trim(),
        start_time: new Date(form.start_time).toISOString(),
        end_time:   new Date(form.end_time).toISOString(),
        group_ids:  selectedGroups.map((g) => g.id),
        ...(form.references.trim() && { references: form.references.trim() }),
        ...(form.notes.trim()      && { notes:      form.notes.trim() }),
      };
      const res = await createData("virtual-classes/", payload);
      if (res?.error) throw new Error(typeof res.error === "string" ? res.error : JSON.stringify(res.error));
      onSuccess(`"${payload.title}" scheduled successfully.`);
      setForm({ title: "", url: "", start_time: "", end_time: "", references: "", notes: "" });
      setSelectedGroups([]);
    } catch (err) {
      onError(err.message ?? "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl p-5 space-y-5"
        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>

        {/* Title */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.35)" }}>
            Class Title <span style={{ color: "#0891B2" }}>*</span>
          </label>
          <input type="text" value={form.title} onChange={set("title")}
            placeholder="e.g. Introduction to Moles"
            className={inputCls} style={inputStyle} maxLength={200} />
        </div>

        {/* URL */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.35)" }}>
            Meeting URL <span style={{ color: "#0891B2" }}>*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm pointer-events-none">🔗</span>
            <input type="url" value={form.url} onChange={set("url")}
              placeholder="https://meet.google.com/…"
              className={`${inputCls} pl-9`} style={inputStyle} />
          </div>
        </div>

        {/* Date/time row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.35)" }}>
              Start Time <span style={{ color: "#0891B2" }}>*</span>
            </label>
            <input type="datetime-local" value={form.start_time} onChange={set("start_time")}
              className={inputCls} style={{ ...inputStyle, colorScheme: "dark" }} />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.35)" }}>
              End Time <span style={{ color: "#0891B2" }}>*</span>
            </label>
            <input type="datetime-local" value={form.end_time} onChange={set("end_time")}
              className={inputCls} style={{ ...inputStyle, colorScheme: "dark" }} />
          </div>
        </div>

        {/* Duration preview */}
        {form.start_time && form.end_time && new Date(form.end_time) > new Date(form.start_time) && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{ background: "rgba(8,145,178,0.07)", border: "1px solid rgba(8,145,178,0.18)" }}>
            <span style={{ color: "#67E8F9" }}>⏱</span>
            <span className="text-xs font-bold" style={{ color: "#67E8F9" }}>
              Duration: {duration(form.start_time, form.end_time)}
            </span>
          </div>
        )}

        {/* References (optional) */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.35)" }}>
            References <span className="normal-case font-normal" style={{ color: "rgba(255,255,255,0.2)" }}>(optional)</span>
          </label>
          <input type="text" value={form.references} onChange={set("references")}
            placeholder="e.g. Chapter 4, pg 78-92"
            className={inputCls} style={inputStyle} />
        </div>

        {/* Notes (optional) */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.35)" }}>
            Notes <span className="normal-case font-normal" style={{ color: "rgba(255,255,255,0.2)" }}>(optional)</span>
          </label>
          <textarea value={form.notes} onChange={set("notes")}
            rows={3} placeholder="Any notes or pre-class instructions for students…"
            className={`${inputCls} resize-none`} style={inputStyle} />
        </div>
      </div>

      {/* Group picker */}
      <div className="rounded-2xl p-5 space-y-3"
        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div>
          <p className="text-sm font-black text-white">
            Assign Groups <span style={{ color: "#0891B2" }}>*</span>
          </p>
          <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
            Select which groups will attend this class
          </p>
        </div>
        <GroupPicker
          selected={selectedGroups}
          onChange={setSelectedGroups}
          groups={groups}
          loading={loadingGroups}
        />
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!isValid || submitting}
        className="w-full py-3 rounded-xl text-sm font-black transition-all disabled:opacity-40"
        style={{
          background: isValid ? "linear-gradient(135deg,#0369A1,#0891B2)" : "rgba(255,255,255,0.06)",
          color: isValid ? "#fff" : "rgba(255,255,255,0.3)",
          boxShadow: isValid ? "0 4px 20px rgba(8,145,178,0.35)" : "none",
        }}
      >
        {submitting ? (
          <span className="flex items-center justify-center gap-2"><Spinner /> Scheduling…</span>
        ) : "📅 Schedule Class"}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── ClassCard
// ─────────────────────────────────────────────────────────────────────────────

function ClassCard({ cls, upcoming }) {
  const [expanded, setExpanded] = useState(false);
  const color    = classColor(cls.id);
  const students = totalStudents(cls.groups ?? []);

  return (
    <div className="rounded-2xl overflow-hidden transition-all"
      style={{
        background: upcoming ? `${color}0a` : "rgba(255,255,255,0.025)",
        border: `1px solid ${color}${upcoming ? "35" : "18"}`,
      }}>
      <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg,${color},${color}33)` }} />

      <div className="p-4 flex items-center gap-4">
        {/* Icon */}
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
          style={{ background: `${color}18`, border: `1px solid ${color}30`, color }}>
          {upcoming ? "📡" : "📼"}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-black text-white text-sm truncate">{cls.title}</p>
          <p className="text-xs mt-0.5 truncate" style={{ color: "rgba(255,255,255,0.35)" }}>
            {fmtDate(cls.start_time)} · {fmtTime(cls.start_time)}–{fmtTime(cls.end_time)}
            {" · "}{duration(cls.start_time, cls.end_time)}
          </p>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            {(cls.groups ?? []).map((g) => (
              <span key={g.id} className="text-[9px] font-black px-2 py-0.5 rounded-full"
                style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}>
                ◈ {g.name}
              </span>
            ))}
            <span className="text-[9px] font-bold" style={{ color: "rgba(255,255,255,0.25)" }}>
              👥 {students} student{students !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 shrink-0 items-end">
          {upcoming && (
            <a href={cls.url} target="_blank" rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg text-xs font-black transition-all hover:opacity-90"
              style={{ background: color, color: "#fff", boxShadow: `0 4px 12px ${color}40` }}>
              Join →
            </a>
          )}
          {(cls.references || cls.notes) && (
            <button onClick={() => setExpanded((p) => !p)}
              className="px-3 py-1.5 rounded-lg text-[10px] font-black transition-all"
              style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.08)" }}>
              {expanded ? "Less" : "Details"}
            </button>
          )}
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (cls.references || cls.notes) && (
        <div className="px-4 pb-4 space-y-2.5" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          {cls.references && (
            <div className="mt-3 rounded-xl px-3 py-2.5"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <p className="text-[9px] font-black tracking-widest uppercase mb-1" style={{ color: "rgba(255,255,255,0.28)" }}>References</p>
              <p className="text-xs text-white/70">{cls.references}</p>
            </div>
          )}
          {cls.notes && (
            <div className="rounded-xl px-3 py-2.5"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <p className="text-[9px] font-black tracking-widest uppercase mb-1" style={{ color: "rgba(255,255,255,0.28)" }}>Notes</p>
              <p className="text-xs text-white/70">{cls.notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── BrowseView
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// ── Date range filter config
// ─────────────────────────────────────────────────────────────────────────────

const DATE_RANGES = [
  { value: "",           label: "All",        icon: "◎" },
  { value: "today",      label: "Today",      icon: "📍" },
  { value: "tomorrow",   label: "Tomorrow",   icon: "⏭" },
  { value: "this_week",  label: "This Week",  icon: "📆" },
  { value: "next_week",  label: "Next Week",  icon: "🗓" },
  { value: "last_week",  label: "Last Week",  icon: "📼" },
  { value: "this_month", label: "This Month", icon: "🗃" },
];

function BrowseView() {
  const [classes,    setClasses]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [section,    setSection]    = useState("upcoming");
  const [dateRange,  setDateRange]  = useState("");

  const fetchClasses = async (range = dateRange) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (range) params.set("date_range", range);
    const res = await getData(`virtual-classes/?${params.toString()}`);
    if (!res?.error) setClasses(res?.results ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchClasses(); }, []); // eslint-disable-line

  const handleRangeChange = (val) => {
    setDateRange(val);
    fetchClasses(val);
  };

  const upcoming = classes.filter(isUpcoming);
  const past     = classes.filter((c) => !isUpcoming(c));
  const shown    = section === "upcoming" ? upcoming : past;

  const activeDateLabel = DATE_RANGES.find((r) => r.value === dateRange)?.label ?? "All";

  return (
    <div className="space-y-4">

      {/* ── Date range filter pills ── */}
      <div
        className="rounded-2xl p-3"
        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <p className="text-[10px] font-black tracking-widest uppercase mb-2.5"
          style={{ color: "rgba(255,255,255,0.28)" }}>Filter by Date</p>
        <div className="flex flex-wrap gap-1.5">
          {DATE_RANGES.map(({ value, label, icon }) => {
            const active = dateRange === value;
            return (
              <button
                key={value}
                onClick={() => handleRangeChange(value)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all"
                style={active
                  ? { background: "linear-gradient(135deg,#0369A1,#0891B2)", color: "#fff", boxShadow: "0 3px 10px rgba(8,145,178,0.35)" }
                  : { background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <span>{icon}</span> {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Upcoming / Past toggle + refresh ── */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex gap-2">
          {[
            { key: "upcoming", label: `🔔 Upcoming (${upcoming.length})` },
            { key: "past",     label: `📼 Past (${past.length})` },
          ].map(({ key, label }) => (
            <button key={key} onClick={() => setSection(key)}
              className="px-4 py-2 rounded-xl text-xs font-black transition-all"
              style={section === key
                ? { background: "#0891B2", color: "#fff" }
                : { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.09)" }}>
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {dateRange && (
            <button
              onClick={() => handleRangeChange("")}
              className="text-[10px] font-black hover:opacity-70 transition-opacity"
              style={{ color: "#F87171" }}
            >
              ✕ Clear filter
            </button>
          )}
          <button onClick={() => fetchClasses()}
            className="text-[10px] font-black hover:opacity-70 transition-opacity"
            style={{ color: "#67E8F9" }}>
            ↺ Refresh
          </button>
        </div>
      </div>

      {/* Results label */}
      {dateRange && !loading && (
        <p className="text-[11px] font-black" style={{ color: "rgba(255,255,255,0.3)" }}>
          Showing classes for <span style={{ color: "#67E8F9" }}>{activeDateLabel}</span>
          {" "}· {classes.length} result{classes.length !== 1 ? "s" : ""}
        </p>
      )}

      {loading ? (
        <div className="flex items-center gap-2 py-14 justify-center text-sm" style={{ color: "rgba(255,255,255,0.25)" }}>
          <Spinner /> Loading classes…
        </div>
      ) : shown.length === 0 ? (
        <div className="py-14 text-center space-y-2">
          <p className="text-3xl">{section === "upcoming" ? "📅" : "📼"}</p>
          <p className="text-sm font-bold text-white">
            {section === "upcoming" ? "No upcoming classes" : "No past classes"}
            {dateRange ? ` for ${activeDateLabel.toLowerCase()}` : ""}
          </p>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
            {section === "upcoming"
              ? dateRange ? "Try a different date range or clear the filter." : "Schedule a class using the Create tab."
              : "Completed classes will appear here."}
          </p>
          {dateRange && (
            <button
              onClick={() => handleRangeChange("")}
              className="text-xs font-black hover:opacity-70 mt-1"
              style={{ color: "#67E8F9" }}
            >
              Clear filter
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {shown.map((cls) => (
            <ClassCard key={cls.id} cls={cls} upcoming={section === "upcoming"} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── Toast
// ─────────────────────────────────────────────────────────────────────────────

function Toast({ toast, onDismiss }) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onDismiss, 4000);
    return () => clearTimeout(t);
  }, [toast, onDismiss]);

  if (!toast) return null;
  const isErr = toast.type === "error";
  return (
    <div className="fixed bottom-24 lg:bottom-6 left-1/2 -translate-x-1/2 z-9999 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-bold max-w-sm w-full"
      style={isErr
        ? { background: "#1a0808", border: "1px solid rgba(239,68,68,0.4)", color: "#F87171" }
        : { background: "#071a10", border: "1px solid rgba(16,185,129,0.4)", color: "#34D399" }}>
      <span>{isErr ? "⚠️" : "✅"}</span>
      <span className="flex-1">{toast.message}</span>
      <button onClick={onDismiss} className="opacity-50 hover:opacity-100 text-base">×</button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── ClassesTab  (main export)
// ─────────────────────────────────────────────────────────────────────────────

const VIEWS = { CREATE: "create", BROWSE: "browse" };

export default function ClassesTab() {
  const [view,  setView]  = useState(VIEWS.BROWSE);
  const [toast, setToast] = useState(null);

  const notify = (type, message) => setToast({ type, message });

  return (
    <>
      <Toast toast={toast} onDismiss={() => setToast(null)} />

      <div className="space-y-6 pb-10">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">◎ Virtual Classes</h2>
            <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>
              Schedule and manage live sessions
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 flex-wrap">
          <ViewTab label="📅 Schedule Class" active={view === VIEWS.CREATE} onClick={() => setView(VIEWS.CREATE)} />
          <ViewTab label="🔍 Browse Classes" active={view === VIEWS.BROWSE} onClick={() => setView(VIEWS.BROWSE)} />
        </div>

        {view === VIEWS.CREATE && (
          <CreateView
            onSuccess={(msg) => { notify("success", msg); setView(VIEWS.BROWSE); }}
            onError={(msg)   => notify("error", msg)}
          />
        )}
        {view === VIEWS.BROWSE && <BrowseView />}
      </div>
    </>
  );
}