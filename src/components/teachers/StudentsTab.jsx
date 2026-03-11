import { useEffect, useRef, useState } from "react";
import { getData } from "../../api/api.service";

// ─────────────────────────────────────────────────────────────────────────────
// ── Constants
// ─────────────────────────────────────────────────────────────────────────────

const PAGE_SIZE = 10;

const SCHOOL_LEVELS = [
  "Grade 1","Grade 2","Grade 3","Grade 4","Grade 5","Grade 6",
  "Grade 7","Grade 8","Grade 9","Grade 10","Grade 11","Grade 12",
  "Form 1","Form 2","Form 3","Form 4",
  "PP1","PP2",
];

const SEX_OPTIONS = [
  { value: "", label: "All Genders" },
  { value: "male",   label: "Male" },
  { value: "female", label: "Female" },
];

// ─────────────────────────────────────────────────────────────────────────────
// ── Helpers
// ─────────────────────────────────────────────────────────────────────────────

function getInitials(first = "", last = "") {
  return `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase();
}

function fmtDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

function ageFromDob(dob) {
  if (!dob) return null;
  const diff = Date.now() - new Date(dob).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}

const AVATAR_PALETTE = [
  ["#1D4ED8","#3B82F6"],
  ["#065F46","#10B981"],
  ["#7C3AED","#A78BFA"],
  ["#B45309","#F59E0B"],
  ["#BE185D","#F472B6"],
  ["#0369A1","#38BDF8"],
];

function avatarGrad(id = "") {
  const idx = id.charCodeAt(0) % AVATAR_PALETTE.length;
  return AVATAR_PALETTE[idx];
}

// ─────────────────────────────────────────────────────────────────────────────
// ── Sub-components
// ─────────────────────────────────────────────────────────────────────────────

const inputCls = "w-full rounded-xl px-3 py-2.5 text-sm text-white outline-none transition-all";
const inputStyle = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.09)",
  color: "#fff",
};
const selectStyle = { ...inputStyle, cursor: "pointer" };

function FilterBar({ search, onSearch, county, onCounty, level, onLevel, sex, onSex, onClear, hasFilters }) {
  return (
    <div
      className="rounded-2xl p-4 space-y-3"
      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      {/* Search */}
      <div className="relative">
        <span
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm pointer-events-none"
          style={{ color: "rgba(255,255,255,0.3)" }}
        >
          🔍
        </span>
        <input
          type="text"
          value={search}
          onChange={onSearch}
          placeholder="Search by name, admission number, or county…"
          className={`${inputCls} pl-9`}
          style={inputStyle}
        />
      </div>

      {/* Dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input
          type="text"
          value={county}
          onChange={onCounty}
          placeholder="Filter by county…"
          className={inputCls}
          style={inputStyle}
        />

        <select value={level} onChange={onLevel} className={inputCls} style={selectStyle}>
          <option value="" style={{ background: "#0a1120" }}>All School Levels</option>
          {SCHOOL_LEVELS.map((l) => (
            <option key={l} value={l} style={{ background: "#0a1120" }}>{l}</option>
          ))}
        </select>

        <select value={sex} onChange={onSex} className={inputCls} style={selectStyle}>
          {SEX_OPTIONS.map((o) => (
            <option key={o.value} value={o.value} style={{ background: "#0a1120" }}>{o.label}</option>
          ))}
        </select>
      </div>

      {hasFilters && (
        <div className="flex justify-end">
          <button
            onClick={onClear}
            className="text-[10px] font-black hover:opacity-70 transition-opacity"
            style={{ color: "#60A5FA" }}
          >
            ✕ Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}

function StudentCard({ student }) {
  const [expanded, setExpanded] = useState(false);
  const age  = ageFromDob(student.date_of_birth);
  const grad = avatarGrad(student.id);

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-200"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {/* Main row */}
      <div className="flex items-center gap-3 p-4">
        {/* Avatar */}
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-black shrink-0"
          style={{
            background: `linear-gradient(135deg, ${grad[0]}, ${grad[1]})`,
            boxShadow: `0 4px 14px ${grad[0]}55`,
            color: "#fff",
          }}
        >
          {getInitials(student.first_name, student.last_name)}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-black text-white text-sm truncate">
              {student.first_name} {student.middle_names ? `${student.middle_names} ` : ""}{student.last_name}
            </p>
            <span
              className="text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full shrink-0"
              style={
                student.sex === "male"
                  ? { background: "rgba(59,130,246,0.12)", color: "#60A5FA", border: "1px solid rgba(59,130,246,0.2)" }
                  : { background: "rgba(244,114,182,0.12)", color: "#F472B6", border: "1px solid rgba(244,114,182,0.2)" }
              }
            >
              {student.sex}
            </span>
          </div>
          <p className="text-[11px] mt-0.5 truncate" style={{ color: "rgba(255,255,255,0.35)" }}>
            {student.admission_number} · {student.current_school_level}
          </p>
        </div>

        {/* Right meta */}
        <div className="text-right shrink-0 hidden sm:block">
          <p className="font-black text-white text-sm">{student.school_name}</p>
          <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>{student.county}</p>
        </div>

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded((p) => !p)}
          className="w-7 h-7 flex items-center justify-center rounded-full text-xs shrink-0 transition-all"
          style={{
            background: "rgba(255,255,255,0.05)",
            color: "rgba(255,255,255,0.4)",
            transform: expanded ? "rotate(180deg)" : "none",
          }}
        >
          ▾
        </button>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div
          className="px-4 pb-4 pt-0 grid grid-cols-2 sm:grid-cols-4 gap-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          {[
            { label: "School",    value: student.school_name },
            { label: "County",    value: student.county },
            { label: "DOB",       value: fmtDate(student.date_of_birth) + (age ? ` (${age}y)` : "") },
            { label: "Level",     value: student.current_school_level },
            { label: "Admission", value: student.admission_number },
            { label: "Subjects",  value: student.subjects?.length ? `${student.subjects.length} enrolled` : "None" },
            { label: "Groups",    value: student.groups?.length   ? `${student.groups.length} group${student.groups.length !== 1 ? "s" : ""}` : "None" },
            { label: "Enrolled",  value: fmtDate(student.created_at) },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="rounded-xl p-2.5"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <p className="text-[9px] font-black tracking-widest uppercase mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>
                {label}
              </p>
              <p className="text-xs font-bold text-white truncate">{value ?? "—"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Pagination({ page, totalPages, total, pageSize, onPrev, onNext, onPage }) {
  if (totalPages <= 1) return null;

  const from = (page - 1) * pageSize + 1;
  const to   = Math.min(page * pageSize, total);

  // Build page numbers with ellipsis
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "…") {
      pages.push("…");
    }
  }

  return (
    <div className="flex items-center justify-between gap-3 flex-wrap">
      <p className="text-[11px] font-black" style={{ color: "rgba(255,255,255,0.25)" }}>
        Showing {from}–{to} of {total} student{total !== 1 ? "s" : ""}
      </p>

      <div className="flex items-center gap-1.5">
        <button
          onClick={onPrev}
          disabled={page === 1}
          className="px-3 py-1.5 rounded-lg text-xs font-black disabled:opacity-30 transition-all"
          style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          ← Prev
        </button>

        {pages.map((p, i) =>
          p === "…" ? (
            <span key={`ellipsis-${i}`} className="px-1 text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>…</span>
          ) : (
            <button
              key={p}
              onClick={() => onPage(p)}
              className="w-8 h-8 rounded-lg text-xs font-black transition-all"
              style={
                p === page
                  ? { background: "linear-gradient(135deg,#1D4ED8,#3B82F6)", color: "#fff", boxShadow: "0 4px 12px rgba(29,78,216,0.35)" }
                  : { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.45)", border: "1px solid rgba(255,255,255,0.08)" }
              }
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={onNext}
          disabled={page === totalPages}
          className="px-3 py-1.5 rounded-lg text-xs font-black disabled:opacity-30 transition-all"
          style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          Next →
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── StudentsTab  (main export)
// ─────────────────────────────────────────────────────────────────────────────

export default function StudentsTab() {
  const [students,    setStudents]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [total,       setTotal]       = useState(0);
  const [page,        setPage]        = useState(1);
  const [nextUrl,     setNextUrl]     = useState(null);
  const [prevUrl,     setPrevUrl]     = useState(null);

  // Filters
  const [search,  setSearch]  = useState("");
  const [county,  setCounty]  = useState("");
  const [level,   setLevel]   = useState("");
  const [sex,     setSex]     = useState("");

  const searchTimer = useRef(null);
  const countyTimer = useRef(null);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  // ── Fetch ────────────────────────────────────────────────────────────────

  const fetchStudents = async ({ searchVal, countyVal, levelVal, sexVal, pageNum } = {}) => {
    setLoading(true);
    const params = new URLSearchParams();

    const s  = searchVal  ?? search;
    const c  = countyVal  ?? county;
    const lv = levelVal   ?? level;
    const sx = sexVal     ?? sex;
    const pg = pageNum    ?? page;

    if (s)  params.set("search", s);
    if (c)  params.set("county", c);
    if (lv) params.set("current_school_level", lv);
    if (sx) params.set("sex", sx);
    params.set("page",      pg);
    params.set("page_size", PAGE_SIZE);

    const res = await getData(`students/?${params.toString()}`);
    if (!res?.error) {
      setStudents(res?.results ?? []);
      setTotal(res?.count ?? 0);
      setNextUrl(res?.next ?? null);
      setPrevUrl(res?.previous ?? null);
    }
    setLoading(false);
  };

  useEffect(() => { fetchStudents(); }, []); 

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearch(val);
    setPage(1);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => fetchStudents({ searchVal: val, pageNum: 1 }), 380);
  };

  const handleCounty = (e) => {
    const val = e.target.value;
    setCounty(val);
    setPage(1);
    clearTimeout(countyTimer.current);
    countyTimer.current = setTimeout(() => fetchStudents({ countyVal: val, pageNum: 1 }), 380);
  };

  const handleLevel = (e) => {
    const val = e.target.value;
    setLevel(val);
    setPage(1);
    fetchStudents({ levelVal: val, pageNum: 1 });
  };

  const handleSex = (e) => {
    const val = e.target.value;
    setSex(val);
    setPage(1);
    fetchStudents({ sexVal: val, pageNum: 1 });
  };

  const handleClear = () => {
    setSearch(""); setCounty(""); setLevel(""); setSex(""); setPage(1);
    fetchStudents({ searchVal: "", countyVal: "", levelVal: "", sexVal: "", pageNum: 1 });
  };

  const handlePage = (p) => {
    setPage(p);
    fetchStudents({ pageNum: p });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hasFilters = search || county || level || sex;

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">🎓 Students</h2>
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>
            {loading ? "Loading…" : `${total} student${total !== 1 ? "s" : ""} registered`}
          </p>
        </div>
      </div>

      {/* Filters */}
      <FilterBar
        search={search}   onSearch={handleSearch}
        county={county}   onCounty={handleCounty}
        level={level}     onLevel={handleLevel}
        sex={sex}         onSex={handleSex}
        onClear={handleClear}
        hasFilters={!!hasFilters}
      />

      {/* Results meta */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-black" style={{ color: "rgba(255,255,255,0.3)" }}>
          {loading
            ? "Fetching students…"
            : hasFilters
              ? `${total} result${total !== 1 ? "s" : ""} for current filters`
              : `${total} total student${total !== 1 ? "s" : ""}`}
        </p>
        {hasFilters && !loading && (
          <span className="text-[10px] font-black px-2.5 py-1 rounded-full" style={{ background: "rgba(59,130,246,0.12)", color: "#60A5FA", border: "1px solid rgba(59,130,246,0.2)" }}>
            Filtered
          </span>
        )}
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center gap-2 py-16 justify-center text-sm" style={{ color: "rgba(255,255,255,0.25)" }}>
          <span className="w-4 h-4 border-2 border-white/20 border-t-blue-500 rounded-full animate-spin" />
          Loading students…
        </div>
      ) : students.length === 0 ? (
        <div className="py-16 text-center space-y-2">
          <p className="text-4xl">🔍</p>
          <p className="text-sm font-bold text-white">No students found</p>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
            {hasFilters ? "Try adjusting your search or filters." : "No students have been registered yet."}
          </p>
          {hasFilters && (
            <button
              onClick={handleClear}
              className="mt-2 text-xs font-black hover:opacity-70 transition-opacity"
              style={{ color: "#60A5FA" }}
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2.5">
          {students.map((s) => (
            <StudentCard key={s.id} student={s} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && students.length > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          total={total}
          pageSize={PAGE_SIZE}
          onPrev={() => handlePage(page - 1)}
          onNext={() => handlePage(page + 1)}
          onPage={handlePage}
        />
      )}
    </div>
  );
}