import { useEffect, useRef, useState } from "react";
import { getData } from "../../api/api.service";
import { inputStyle, inputCls, selectStyle, GRADE_OPTIONS, LEVEL_OPTIONS } from "./constants";
import ExamCard from "./ExamCard";
import ExamViewer from "./ExamViewer";

// ─────────────────────────────────────────────────────────────────────────────
// ── ExamBrowseView
// ─────────────────────────────────────────────────────────────────────────────

export default function ExamBrowseView({ subjectTags }) {
  const [exams,       setExams]       = useState([]);
  const [loading,     setLoading]     = useState(false);
  const [total,       setTotal]       = useState(0);
  const [search,      setSearch]      = useState("");
  const [subjectTag,  setSubjectTag]  = useState("");
  const [grade,       setGrade]       = useState("");
  const [level,       setLevel]       = useState("");
  const [viewingExam, setViewingExam] = useState(null);

  const searchTimer = useRef(null);

  const fetchExams = async ({ searchVal, tagVal, gradeVal, levelVal } = {}) => {
    setLoading(true);
    const params = new URLSearchParams();
    const s  = searchVal ?? search;
    const t  = tagVal    ?? subjectTag;
    const g  = gradeVal  ?? grade;
    const lv = levelVal  ?? level;
    if (s)  params.set("search", s);
    if (t)  params.set("subject_tag", t);
    if (g)  params.set("grade", g);
    if (lv) params.set("level", lv);
    const res = await getData(`exam-questions/?${params.toString()}`);
    if (!res?.error) {
      setExams(res?.results ?? []);
      setTotal(res?.count ?? 0);
    }
    setLoading(false);
  };

  useEffect(() => { fetchExams(); }, []); // eslint-disable-line

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearch(val);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => fetchExams({ searchVal: val }), 400);
  };

  const handleTag   = (e) => { setSubjectTag(e.target.value); fetchExams({ tagVal:   e.target.value }); };
  const handleGrade = (e) => { setGrade(e.target.value);      fetchExams({ gradeVal: e.target.value }); };
  const handleLevel = (e) => { setLevel(e.target.value);      fetchExams({ levelVal: e.target.value }); };

  const clearFilters = () => {
    setSearch(""); setSubjectTag(""); setGrade(""); setLevel("");
    fetchExams({ searchVal: "", tagVal: "", gradeVal: "", levelVal: "" });
  };

  const hasFilters = search || subjectTag || grade || level;

  return (
    <>
      {viewingExam && (
        <ExamViewer exam={viewingExam} onClose={() => setViewingExam(null)} />
      )}

      <div className="space-y-5">
        {/* Filter bar */}
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
              onChange={handleSearch}
              placeholder="Search by title or instructions…"
              className={`${inputCls} pl-9`}
              style={inputStyle}
            />
          </div>

          {/* Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <select value={subjectTag} onChange={handleTag} className={inputCls} style={selectStyle}>
              <option value="" style={{ background: "#111827" }}>All Subject Tags</option>
              {subjectTags.map((t) => (
                <option key={t.id} value={t.id} style={{ background: "#111827" }}>{t.name}</option>
              ))}
            </select>

            <select value={grade} onChange={handleGrade} className={inputCls} style={selectStyle}>
              <option value="" style={{ background: "#111827" }}>All Grades</option>
              {GRADE_OPTIONS.map((g) => (
                <option key={g.value} value={g.value} style={{ background: "#111827" }}>{g.label}</option>
              ))}
            </select>

            <select value={level} onChange={handleLevel} className={inputCls} style={selectStyle}>
              <option value="" style={{ background: "#111827" }}>All Levels</option>
              {LEVEL_OPTIONS.map((l) => (
                <option key={l.value} value={l.value} style={{ background: "#111827" }}>{l.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results header */}
        <div className="flex items-center justify-between">
          <p className="text-xs font-black" style={{ color: "rgba(255,255,255,0.3)" }}>
            {loading ? "Loading…" : `${total} exam${total !== 1 ? "s" : ""} found`}
          </p>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="text-[10px] font-black hover:opacity-70 transition-opacity"
              style={{ color: "#60A5FA" }}
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div
            className="flex items-center gap-2 py-8 justify-center text-sm"
            style={{ color: "rgba(255,255,255,0.25)" }}
          >
            <span className="w-4 h-4 border-2 border-white/20 border-t-blue-600 rounded-full animate-spin" />
            Fetching exams…
          </div>
        ) : exams.length === 0 ? (
          <div className="py-12 text-center text-sm" style={{ color: "rgba(255,255,255,0.25)" }}>
            No exams found. Try adjusting your filters or create one.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {exams.map((exam) => (
              <ExamCard key={exam.id} exam={exam} onView={setViewingExam} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}