import { useEffect, useRef, useState } from "react";
import { getData, createData, patchData } from "../../api/api.service";
// ↑ Adjust createData/patchData to match your actual api.service exports
// e.g. postData/patchData or createData/updateData

// ─────────────────────────────────────────────────────────────────────────────
// ── Constants
// ─────────────────────────────────────────────────────────────────────────────

const GROUP_COLORS = [
  "#3B82F6","#10B981","#F59E0B","#EF4444",
  "#A855F7","#EC4899","#14B8A6","#F97316",
];

const SCHOOL_LEVELS = [
  "","PP1","PP2",
  "Grade 1","Grade 2","Grade 3","Grade 4","Grade 5","Grade 6",
  "Grade 7","Grade 8","Grade 9","Grade 10","Grade 11","Grade 12",
  "Form 1","Form 2","Form 3","Form 4",
];

// ─────────────────────────────────────────────────────────────────────────────
// ── Helpers
// ─────────────────────────────────────────────────────────────────────────────

function getInitials(first = "", last = "") {
  return `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase();
}

function groupColor(id = "") {
  return GROUP_COLORS[id.charCodeAt(0) % GROUP_COLORS.length];
}

function fmtDate(d) {
  return new Date(d).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

// ─────────────────────────────────────────────────────────────────────────────
// ── Shared atoms
// ─────────────────────────────────────────────────────────────────────────────

const inputCls  = "w-full rounded-xl px-3 py-2.5 text-sm text-white outline-none";
const inputStyle = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" };

function Spinner({ size = 4 }) {
  return (
    <span
      className={`inline-block w-${size} h-${size} border-2 border-white/20 border-t-blue-400 rounded-full animate-spin`}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── StudentPicker  — search / filter / toggle students in/out of selection
// ─────────────────────────────────────────────────────────────────────────────

function StudentPicker({ selected, onChange }) {
  const [search,   setSearch]   = useState("");
  const [level,    setLevel]    = useState("");
  const [sex,      setSex]      = useState("");
  const [students, setStudents] = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [total,    setTotal]    = useState(0);
  const timer = useRef(null);

  const fetch_ = async ({ s = search, lv = level, sx = sex } = {}) => {
    setLoading(true);
    const p = new URLSearchParams({ page_size: 50 });
    if (s)  p.set("search", s);
    if (lv) p.set("current_school_level", lv);
    if (sx) p.set("sex", sx);
    const res = await getData(`students/?${p}`);
    if (!res?.error) { setStudents(res?.results ?? []); setTotal(res?.count ?? 0); }
    setLoading(false);
  };

  useEffect(() => { fetch_(); }, []); // eslint-disable-line

  const handleSearch = (e) => {
    const v = e.target.value; setSearch(v);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => fetch_({ s: v }), 350);
  };
  const handleLevel = (e) => { const v = e.target.value; setLevel(v); fetch_({ lv: v }); };
  const handleSex   = (e) => { const v = e.target.value; setSex(v);   fetch_({ sx: v }); };

  const toggle = (student) => {
    const already = selected.some((s) => s.id === student.id);
    onChange(already ? selected.filter((s) => s.id !== student.id) : [...selected, student]);
  };

  const isSelected = (id) => selected.some((s) => s.id === id);

  // Select all visible
  const toggleAll = () => {
    const allIn = students.every((s) => isSelected(s.id));
    if (allIn) {
      onChange(selected.filter((s) => !students.some((st) => st.id === s.id)));
    } else {
      const toAdd = students.filter((s) => !isSelected(s.id));
      onChange([...selected, ...toAdd]);
    }
  };

  const allVisible = students.length > 0 && students.every((s) => isSelected(s.id));

  return (
    <div className="space-y-3">
      {/* Selected chips */}
      {selected.length > 0 && (
        <div
          className="flex flex-wrap gap-1.5 p-3 rounded-xl max-h-24 overflow-y-auto"
          style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.18)" }}
        >
          {selected.map((s) => (
            <span
              key={s.id}
              className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full"
              style={{ background: "rgba(59,130,246,0.18)", color: "#93C5FD", border: "1px solid rgba(59,130,246,0.3)" }}
            >
              {s.first_name} {s.last_name}
              <button
                onClick={() => toggle(s)}
                className="ml-0.5 leading-none hover:opacity-70 text-xs"
              >×</button>
            </span>
          ))}
        </div>
      )}

      {/* Search + filters */}
      <div className="space-y-2">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs pointer-events-none" style={{ color: "rgba(255,255,255,0.3)" }}>🔍</span>
          <input
            type="text" value={search} onChange={handleSearch}
            placeholder="Search students…"
            className={`${inputCls} pl-8 text-xs`} style={inputStyle}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <select value={level} onChange={handleLevel} className={`${inputCls} text-xs`} style={{ ...inputStyle, cursor: "pointer" }}>
            <option value="" style={{ background: "#0a1120" }}>All Levels</option>
            {SCHOOL_LEVELS.filter(Boolean).map((l) => (
              <option key={l} value={l} style={{ background: "#0a1120" }}>{l}</option>
            ))}
          </select>
          <select value={sex} onChange={handleSex} className={`${inputCls} text-xs`} style={{ ...inputStyle, cursor: "pointer" }}>
            <option value=""     style={{ background: "#0a1120" }}>All Genders</option>
            <option value="male" style={{ background: "#0a1120" }}>Male</option>
            <option value="female" style={{ background: "#0a1120" }}>Female</option>
          </select>
        </div>
      </div>

      {/* Student list */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: "1px solid rgba(255,255,255,0.08)" }}
      >
        {/* List header */}
        <div
          className="flex items-center justify-between px-3 py-2"
          style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}
        >
          <span className="text-[10px] font-black" style={{ color: "rgba(255,255,255,0.3)" }}>
            {loading ? "Loading…" : `${total} student${total !== 1 ? "s" : ""}${total > 50 ? " (showing 50)" : ""}`}
          </span>
          {students.length > 0 && (
            <button
              onClick={toggleAll}
              className="text-[10px] font-black hover:opacity-70 transition-opacity"
              style={{ color: allVisible ? "#F87171" : "#60A5FA" }}
            >
              {allVisible ? "Deselect all" : "Select all visible"}
            </button>
          )}
        </div>

        <div className="max-h-52 overflow-y-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.08) transparent" }}>
          {loading ? (
            <div className="flex items-center justify-center py-8 gap-2 text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
              <Spinner /> Loading…
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-6 text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>No students found</div>
          ) : (
            students.map((s) => {
              const sel = isSelected(s.id);
              return (
                <button
                  key={s.id}
                  onClick={() => toggle(s)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-left transition-all"
                  style={{
                    background: sel ? "rgba(59,130,246,0.1)" : "transparent",
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                  }}
                >
                  {/* Checkbox */}
                  <div
                    className="w-4 h-4 rounded flex items-center justify-center shrink-0"
                    style={sel
                      ? { background: "#3B82F6", border: "1px solid #3B82F6" }
                      : { background: "transparent", border: "1px solid rgba(255,255,255,0.2)" }}
                  >
                    {sel && <span className="text-white text-[9px] font-black">✓</span>}
                  </div>

                  {/* Avatar */}
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black shrink-0"
                    style={{
                      background: sel ? "rgba(59,130,246,0.3)" : "rgba(255,255,255,0.07)",
                      color: sel ? "#93C5FD" : "rgba(255,255,255,0.5)",
                    }}
                  >
                    {getInitials(s.first_name, s.last_name)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate">{s.first_name} {s.last_name}</p>
                    <p className="text-[10px] truncate" style={{ color: "rgba(255,255,255,0.3)" }}>
                      {s.admission_number} · {s.current_school_level}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      <p className="text-[10px] font-black text-right" style={{ color: "rgba(255,255,255,0.3)" }}>
        {selected.length} student{selected.length !== 1 ? "s" : ""} selected
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── GroupFormModal  — create or edit a group
// ─────────────────────────────────────────────────────────────────────────────

function GroupFormModal({ group, onClose, onSaved }) {
  const isEdit = !!group;

  const [name,     setName]     = useState(group?.name        ?? "");
  const [desc,     setDesc]     = useState(group?.description ?? "");
  const [selected, setSelected] = useState(
    group?.students?.map((s) => ({ id: s.id, first_name: s.first_name, last_name: s.last_name, admission_number: s.admission_number, current_school_level: s.current_school_level })) ?? []
  );
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState(null);

  const handleSave = async () => {
    if (!name.trim()) { setError("Group name is required."); return; }
    setSaving(true); setError(null);
    try {
      const payload = {
        name:        name.trim(),
        description: desc.trim(),
        student_ids: selected.map((s) => s.id),
      };
      const res = isEdit
        ? await patchData(`groups/${group.id}/`, payload)
        : await createData("groups/", payload);
      if (res?.error) throw new Error(res.error);
      onSaved(res);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to save group.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <style>{`
        .gm-scroll::-webkit-scrollbar { width:4px; }
        .gm-scroll::-webkit-scrollbar-track { background:transparent; }
        .gm-scroll::-webkit-scrollbar-thumb { background:rgba(255,255,255,.08); border-radius:99px; }
      `}</style>
      <div
        className="fixed inset-0 flex items-center justify-center p-3 sm:p-6"
        style={{ background: "rgba(0,0,0,0.88)", backdropFilter: "blur(10px)", zIndex: 9990 }}
        onClick={onClose}
      >
        <div
          className="w-full flex flex-col gm-scroll"
          style={{
            maxWidth: 560,
            maxHeight: "90vh",
            background: "#070F1C",
            border: "1px solid rgba(255,255,255,0.09)",
            borderRadius: 22,
            boxShadow: "0 32px 100px rgba(0,0,0,0.8)",
            overflow: "hidden",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-6 py-4 shrink-0"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div>
              <h2 className="text-base font-black text-white">{isEdit ? "✏️ Edit Group" : "➕ Create Group"}</h2>
              <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
                {isEdit ? `Editing "${group.name}"` : "Set up a new student group"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full text-lg"
              style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.35)" }}
            >×</button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto gm-scroll px-6 py-5 space-y-5">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.35)" }}>
                Group Name *
              </label>
              <input
                type="text" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Form 3 Chemistry Elite"
                className={inputCls} style={inputStyle}
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.35)" }}>
                Description
              </label>
              <textarea
                value={desc} onChange={(e) => setDesc(e.target.value)}
                rows={3} placeholder="Optional description…"
                className={`${inputCls} resize-none`} style={inputStyle}
              />
            </div>

            {/* Divider */}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }} />

            {/* Student picker */}
            <div className="space-y-2">
              <label className="text-[10px] font-black tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.35)" }}>
                Students
              </label>
              <StudentPicker selected={selected} onChange={setSelected} />
            </div>

            {error && (
              <p className="text-xs px-3 py-2.5 rounded-xl" style={{ background: "rgba(239,68,68,0.08)", color: "#F87171", border: "1px solid rgba(239,68,68,0.18)" }}>
                {error}
              </p>
            )}
          </div>

          {/* Footer */}
          <div
            className="flex gap-2 px-6 py-4 shrink-0"
            style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
          >
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-black"
              style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 py-2.5 rounded-xl text-sm font-black transition-all disabled:opacity-50"
              style={{ background: "linear-gradient(135deg,#1D4ED8,#3B82F6)", color: "#fff", boxShadow: "0 4px 16px rgba(29,78,216,0.3)" }}
            >
              {saving ? (
                <span className="flex items-center justify-center gap-2"><Spinner size={3.5} /> Saving…</span>
              ) : isEdit ? "Save Changes" : "Create Group"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── GroupCard
// ─────────────────────────────────────────────────────────────────────────────

function GroupCard({ group, onEdit }) {
  const [expanded, setExpanded] = useState(false);
  const color = groupColor(group.id);

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all"
      style={{ background: "rgba(255,255,255,0.025)", border: `1px solid rgba(255,255,255,0.08)` }}
    >
      {/* Color accent bar */}
      <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg,${color},${color}44)` }} />

      <div className="p-5">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-lg font-black shrink-0"
            style={{ background: `${color}18`, border: `1px solid ${color}35`, color }}
          >
            ◈
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-black text-white text-base truncate">{group.name}</h3>
            {group.description && (
              <p className="text-xs mt-0.5 truncate" style={{ color: "rgba(255,255,255,0.35)" }}>{group.description}</p>
            )}
          </div>

          {/* Edit btn */}
          <button
            onClick={() => onEdit(group)}
            className="px-3 py-1.5 rounded-lg text-[10px] font-black shrink-0 transition-all hover:opacity-80"
            style={{ background: `${color}18`, color, border: `1px solid ${color}35` }}
          >
            ✏️ Edit
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          {[
            { icon: "👥", val: group.students.length, lbl: "Students" },
            { icon: "📅", val: fmtDate(group.created_at), lbl: "Created" },
            { icon: "🔄", val: fmtDate(group.updated_at), lbl: "Updated" },
          ].map(({ icon, val, lbl }) => (
            <div key={lbl} className="p-2.5 rounded-xl text-center" style={{ background: "rgba(255,255,255,0.03)" }}>
              <p className="text-base">{icon}</p>
              <p className="font-black text-white text-xs mt-0.5 truncate">{val}</p>
              <p className="text-[9px]" style={{ color: "rgba(255,255,255,0.25)" }}>{lbl}</p>
            </div>
          ))}
        </div>

        {/* Student list toggle */}
        {group.students.length > 0 && (
          <>
            <button
              onClick={() => setExpanded((p) => !p)}
              className="w-full mt-3 py-1.5 rounded-xl text-[11px] font-black flex items-center justify-center gap-2 transition-all hover:opacity-80"
              style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <span style={{ transform: expanded ? "rotate(180deg)" : "none", display: "inline-block", transition: "transform .2s" }}>▾</span>
              {expanded ? "Hide" : "View"} {group.students.length} student{group.students.length !== 1 ? "s" : ""}
            </button>

            {expanded && (
              <div className="mt-2 space-y-1.5">
                {group.students.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black shrink-0"
                      style={{ background: `${color}20`, color }}
                    >
                      {getInitials(s.first_name, s.last_name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white truncate">{s.first_name} {s.last_name}</p>
                      <p className="text-[10px] truncate" style={{ color: "rgba(255,255,255,0.3)" }}>
                        {s.admission_number} · {s.current_school_level}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── GroupsTab  (main export)
// ─────────────────────────────────────────────────────────────────────────────

export default function GroupsTab() {
  const [groups,  setGroups]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(null); // null | "create" | group-object (edit)

  const fetchGroups = async () => {
    setLoading(true);
    const res = await getData("groups/");
    if (!res?.error) setGroups(res?.results ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchGroups(); }, []);

  // Merge saved group back into list (create or update)
  const handleSaved = (saved) => {
    setGroups((prev) => {
      const exists = prev.find((g) => g.id === saved.id);
      return exists ? prev.map((g) => (g.id === saved.id ? saved : g)) : [saved, ...prev];
    });
  };

  return (
    <>
      {/* Modal */}
      {modal && (
        <GroupFormModal
          group={modal === "create" ? null : modal}
          onClose={() => setModal(null)}
          onSaved={handleSaved}
        />
      )}

      <div className="space-y-6 pb-10">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">◈ My Groups</h2>
            <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>
              {loading ? "Loading…" : `${groups.length} group${groups.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <button
            onClick={() => setModal("create")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg,#1D4ED8,#3B82F6)", color: "#fff", boxShadow: "0 4px 16px rgba(29,78,216,0.3)" }}
          >
            + New Group
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center gap-2 py-16 justify-center text-sm" style={{ color: "rgba(255,255,255,0.25)" }}>
            <Spinner /> Loading groups…
          </div>
        ) : groups.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <p className="text-4xl">◈</p>
            <p className="text-sm font-bold text-white">No groups yet</p>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>Create your first group to get started.</p>
            <button
              onClick={() => setModal("create")}
              className="mt-1 px-5 py-2 rounded-xl text-sm font-black"
              style={{ background: "linear-gradient(135deg,#1D4ED8,#3B82F6)", color: "#fff" }}
            >
              + Create Group
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {groups.map((g) => (
              <GroupCard key={g.id} group={g} onEdit={setModal} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}