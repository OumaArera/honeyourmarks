import { useEffect, useMemo, useState } from "react";
import { getData } from "../../api/api.service";
import { getAuthorId } from "../../utils/notes.utils";

// ─────────────────────────────────────────────────────────────────────────────
// ── Helpers
// ─────────────────────────────────────────────────────────────────────────────

function fmtDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function greetingByHour() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function getInitials(first = "", last = "") {
  return `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase();
}

function fmtPct(val) {
  if (val == null) return "—";
  return `${parseFloat(val).toFixed(1)}%`;
}

// ─────────────────────────────────────────────────────────────────────────────
// ── Constants
// ─────────────────────────────────────────────────────────────────────────────

const LEVEL_META = {
  scout:    { icon: "🔭", color: "#10B981", label: "Scout"    },
  explorer: { icon: "🧭", color: "#F59E0B", label: "Explorer" },
  legend:   { icon: "⚡", color: "#A855F7", label: "Legend"   },
};

const ANALYTICS_TABS = [
  { key: "subjects", label: "📚 By Subject" },
  { key: "grades",   label: "🏫 By Grade"   },
];

const RANK_COLORS = ["#F59E0B", "#94A3B8", "#CD7C2F"];

// ─────────────────────────────────────────────────────────────────────────────
// ── Skeleton
// ─────────────────────────────────────────────────────────────────────────────

function Skeleton({ w = "w-full", h = "h-4", rounded = "rounded-lg" }) {
  return (
    <div
      className={`${w} ${h} ${rounded} animate-pulse`}
      style={{ background: "rgba(255,255,255,0.07)" }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── StatCard — existing summary card
// ─────────────────────────────────────────────────────────────────────────────

function StatCard({ icon, value, label, sub, color, loading }) {
  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-2"
      style={{ background: "rgba(255,255,255,0.025)", border: `1px solid ${color}25` }}
    >
      <div className="flex items-center justify-between">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
          style={{ background: `${color}18`, border: `1px solid ${color}30` }}
        >
          {icon}
        </div>
        {loading ? (
          <Skeleton w="w-12" h="h-6" />
        ) : (
          <p className="font-black text-white text-xl leading-none">{value ?? "—"}</p>
        )}
      </div>
      <div>
        <p className="text-xs font-black text-white/70">{label}</p>
        {sub && (
          <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── LevelCard — Scout / Explorer / Legend card
// ─────────────────────────────────────────────────────────────────────────────

function LevelCard({ level, data, loading }) {
  const { icon, color, label } = LEVEL_META[level];
  const subs     = data?.total_submissions ?? 0;
  const students = data?.unique_students   ?? 0;

  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-2"
      style={{ background: `${color}0D`, border: `1px solid ${color}25` }}
    >
      <div className="flex items-center justify-between">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
          style={{ background: `${color}18`, border: `1px solid ${color}30` }}
        >
          {icon}
        </div>
        {loading ? (
          <Skeleton w="w-10" h="h-6" />
        ) : (
          <p className="font-black text-white text-xl leading-none">{subs}</p>
        )}
      </div>
      <div>
        <p className="text-xs font-black" style={{ color }}>{label}</p>
        <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
          {loading ? "…" : `${students} student${students !== 1 ? "s" : ""}`}
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── ScoreRing
// ─────────────────────────────────────────────────────────────────────────────

function ScoreRing({ pct, color, size = 80 }) {
  const r    = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const dash = circ * ((pct ?? 0) / 100);

  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={7} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={7}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        style={{ transition: "stroke-dasharray .6s ease" }}
      />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── MiniBar — proportional level split bar
// ─────────────────────────────────────────────────────────────────────────────

function MiniBar({ scout = 0, explorer = 0, legend = 0 }) {
  const total = scout + explorer + legend;
  if (!total) {
    return <div className="h-1.5 rounded-full w-full" style={{ background: "rgba(255,255,255,0.06)" }} />;
  }
  const pct = (n) => `${((n / total) * 100).toFixed(0)}%`;
  return (
    <div className="flex h-1.5 rounded-full overflow-hidden w-full gap-px">
      {scout    > 0 && <div style={{ width: pct(scout),    background: LEVEL_META.scout.color    }} />}
      {explorer > 0 && <div style={{ width: pct(explorer), background: LEVEL_META.explorer.color }} />}
      {legend   > 0 && <div style={{ width: pct(legend),   background: LEVEL_META.legend.color   }} />}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── ScoreBar
// ─────────────────────────────────────────────────────────────────────────────

function ScoreBar({ pct, color = "#0D9488" }) {
  const filled = Math.min(Math.max(parseFloat(pct) || 0, 0), 100);
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
        <div
          className="h-full rounded-full"
          style={{ width: `${filled}%`, background: color, transition: "width .6s ease" }}
        />
      </div>
      <span
        className="text-[11px] font-black tabular-nums"
        style={{ color, minWidth: "3.5rem", textAlign: "right" }}
      >
        {pct != null ? `${parseFloat(pct).toFixed(1)}%` : "—"}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── TabBar
// ─────────────────────────────────────────────────────────────────────────────

function TabBar({ tabs, active, onChange }) {
  return (
    <div
      className="flex rounded-xl p-1 mb-4"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className="flex-1 py-1.5 rounded-lg text-xs font-black transition-all"
          style={
            active === t.key
              ? { background: "rgba(59,130,246,0.18)", color: "#93C5FD", border: "1px solid rgba(59,130,246,0.25)" }
              : { color: "rgba(255,255,255,0.35)", border: "1px solid transparent" }
          }
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── PerGradeList
// ─────────────────────────────────────────────────────────────────────────────

function PerGradeList({ rows, loading }) {
  if (loading) {
    return <div className="space-y-2">{[1, 2, 3].map((i) => <Skeleton key={i} h="h-14" />)}</div>;
  }
  if (!rows?.length) {
    return <p className="text-xs text-center py-4" style={{ color: "rgba(255,255,255,0.3)" }}>No grade data yet.</p>;
  }

  return (
    <div className="space-y-2">
      {rows.map((row) => (
        <div
          key={row.grade}
          className="rounded-xl px-4 py-3"
          style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black text-white capitalize">
              {row.grade.replace("_", " ")}
            </span>
            <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.35)" }}>
              {row.total_submissions} sub · {row.unique_students} student{row.unique_students !== 1 ? "s" : ""}
            </span>
          </div>
          <MiniBar scout={row.scout_count} explorer={row.explorer_count} legend={row.legend_count} />
          <div className="flex gap-3 mt-2">
            {["scout", "explorer", "legend"].map((lvl) => {
              const cnt = row[`${lvl}_count`];
              if (!cnt) return null;
              const { icon, color } = LEVEL_META[lvl];
              return (
                <span key={lvl} className="text-[10px] font-bold" style={{ color }}>
                  {icon} {cnt}
                </span>
              );
            })}
          </div>
        </div>
      ))}
      {/* Colour key */}
      <div className="flex gap-4 mt-1 px-1">
        {["scout", "explorer", "legend"].map((lvl) => {
          const { color, label } = LEVEL_META[lvl];
          return (
            <span key={lvl} className="flex items-center gap-1.5 text-[10px] font-bold" style={{ color }}>
              <span className="w-2 h-2 rounded-full inline-block" style={{ background: color }} />
              {label}
            </span>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── SubjectList
// ─────────────────────────────────────────────────────────────────────────────

function SubjectList({ rows, loading }) {
  if (loading) {
    return <div className="space-y-2">{[1, 2, 3].map((i) => <Skeleton key={i} h="h-16" />)}</div>;
  }
  if (!rows?.length) {
    return <p className="text-xs text-center py-4" style={{ color: "rgba(255,255,255,0.3)" }}>No subject data yet.</p>;
  }

  return (
    <div className="space-y-2">
      {rows.map((row) => (
        <div
          key={`${row.subject_name}-${row.subject_tag_name}`}
          className="rounded-xl px-4 py-3"
          style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="min-w-0 mb-2">
            <p className="text-xs font-black text-white truncate">{row.subject_name}</p>
            <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.35)" }}>
              {row.subject_tag_name} · {row.total_submissions} sub{row.total_submissions !== 1 ? "s" : ""}
            </p>
          </div>
          <ScoreBar pct={row.overall_avg_score} />
          <div className="flex gap-3 mt-2">
            {["scout", "explorer", "legend"].map((lvl) => {
              const cnt = row[`${lvl}_count`];
              if (!cnt) return null;
              const { icon, color } = LEVEL_META[lvl];
              return (
                <span key={lvl} className="text-[10px] font-bold" style={{ color }}>
                  {icon} {cnt}
                </span>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── TopStudentsList
// ─────────────────────────────────────────────────────────────────────────────

function TopStudentsList({ rows, loading }) {
  if (loading) {
    return <div className="space-y-2">{[1, 2, 3].map((i) => <Skeleton key={i} h="h-14" />)}</div>;
  }
  if (!rows?.length) {
    return <p className="text-xs text-center py-4" style={{ color: "rgba(255,255,255,0.3)" }}>No student results yet.</p>;
  }

  return (
    <div className="space-y-2">
      {rows.map((student, idx) => (
        <div
          key={student.student_id}
          className="rounded-xl px-4 py-3 flex items-center gap-3"
          style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <span
            className="text-sm font-black tabular-nums w-5 text-center shrink-0"
            style={{ color: RANK_COLORS[idx] ?? "rgba(255,255,255,0.2)" }}
          >
            {idx + 1}
          </span>
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0"
            style={{
              background: "rgba(13,148,136,0.15)",
              border: "1px solid rgba(13,148,136,0.3)",
              color: "#2DD4BF",
            }}
          >
            {getInitials(student.first_name, student.last_name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black text-white truncate">
              {student.first_name} {student.last_name}
            </p>
            <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.35)" }}>
              {student.marked_submissions}/{student.total_submissions} marked
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-sm font-black" style={{ color: "#3B82F6" }}>
              {fmtPct(student.overall_avg_score)}
            </p>
            <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>avg</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── OverviewTab — root
// ─────────────────────────────────────────────────────────────────────────────

export default function OverviewTab({ onNav }) {
  const userId = useMemo(() => getAuthorId(), []);

  const [teacher,      setTeacher]      = useState(null);
  const [loadTeacher,  setLoadTeacher]  = useState(true);
  const [error,        setError]        = useState(null);

  const [stats,        setStats]        = useState(null);
  const [loadStats,    setLoadStats]    = useState(true);

  const [dashStats,    setDashStats]    = useState(null);
  const [loadDash,     setLoadDash]     = useState(true);

  const [analyticsTab, setAnalyticsTab] = useState("subjects");

  // ── Fetch teacher profile
  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        const res = await getData(`teachers/?user_id=${userId}`);
        if (res?.error) throw new Error(res.error);
        const t = res?.results?.[0];
        if (!t) throw new Error("Teacher profile not found.");
        setTeacher(t);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadTeacher(false);
      }
    })();
  }, [userId]);

  // ── Fetch summary stats  (parallel)
  useEffect(() => {
    (async () => {
      try {
        const res = await getData("teacher/dashboard/stats/");
        if (res?.error) throw new Error(res.error);
        setStats(res);
      } catch {
        // fail silently
      } finally {
        setLoadStats(false);
      }
    })();
  }, []);

  // ── Fetch detailed analytics  (parallel)
  useEffect(() => {
    (async () => {
      try {
        const res = await getData("dashboard/teacher/stats/");
        if (res?.error) throw new Error(res.error);
        setDashStats(res);
      } catch {
        // fail silently
      } finally {
        setLoadDash(false);
      }
    })();
  }, []);

  // ── Derived
  const fullName    = teacher ? `${teacher.first_name} ${teacher.last_name}` : "";
  const initials    = getInitials(teacher?.first_name, teacher?.last_name);
  const avgScore    = stats?.average_exam_score    != null ? fmtPct(stats.average_exam_score) : "—";
  const overallPct  = stats?.overall_exam_percentage ?? null;
  const pendingSubs = stats != null ? stats.total_exam_submissions - stats.total_exams_marked : null;

  const levelDist   = dashStats?.level_distribution  ?? {};
  const perGrade    = dashStats?.per_grade            ?? [];
  const subjectDist = dashStats?.subject_distribution ?? [];
  const topStudents = dashStats?.top_students         ?? [];

  return (
    <div className="space-y-6 pb-10">

      {/* ── Error banner ── */}
      {error && (
        <div
          className="rounded-xl px-4 py-3 text-sm"
          style={{ background: "rgba(239,68,68,0.08)", color: "#F87171", border: "1px solid rgba(239,68,68,0.2)" }}
        >
          ⚠️ {error}
        </div>
      )}

      

      {/* ══════════════════════════════════════════════════════
          STATS GRID — Row 1: existing 6 summary cards
          ══════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatCard icon="👥" color="#0D9488" label="Total Students"
          value={stats?.total_students} loading={loadStats}
          sub={stats ? `${stats.total_groups} group${stats.total_groups !== 1 ? "s" : ""}` : null}
        />
        <StatCard icon="📚" color="#0891B2" label="Total Subjects"
          value={stats?.total_subjects} loading={loadStats}
        />
        <StatCard icon="📝" color="#7C3AED" label="Exam Submissions"
          value={stats?.total_exam_submissions} loading={loadStats}
          sub={pendingSubs != null && pendingSubs > 0 ? `${pendingSubs} unmarked` : "All marked"}
        />
        <StatCard icon="✅" color="#10B981" label="Exams Marked"
          value={stats?.total_exams_marked} loading={loadStats}
          sub={stats ? `of ${stats.total_exam_submissions} total` : null}
        />
        <StatCard icon="🏃" color="#F59E0B" label="Exercise Submissions"
          value={stats?.total_exercise_submissions} loading={loadStats}
        />
        <StatCard icon="📈" color="#3B82F6" label="Avg Exam Score"
          value={avgScore} loading={loadStats}
        />
      </div>

      {/* STATS GRID — Row 2: level distribution cards */}
      <div className="grid grid-cols-3 gap-3">
        {["scout", "explorer", "legend"].map((lvl) => (
          <LevelCard key={lvl} level={lvl} data={levelDist[lvl]} loading={loadDash} />
        ))}
      </div>

      {/* ── Performance ring + quick nav ── */}
      <div
        className="rounded-2xl p-5 flex items-center gap-5 flex-wrap sm:flex-nowrap"
        style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(59,130,246,0.18)" }}
      >
        <div className="relative shrink-0">
          {loadStats ? (
            <Skeleton w="w-[80px]" h="h-[80px]" rounded="rounded-full" />
          ) : (
            <>
              <ScoreRing pct={overallPct ?? 0} color="#3B82F6" size={80} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-white font-black text-sm leading-none">
                  {overallPct != null ? `${overallPct.toFixed(0)}%` : "—"}
                </p>
              </div>
            </>
          )}
        </div>
        <div>
          <p className="font-black text-white text-base">Overall Exam Performance</p>
          <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>
            Average score across all published exam results
          </p>
          {stats && (
            <p className="text-xs mt-2 font-bold" style={{ color: "rgba(255,255,255,0.45)" }}>
              {stats.total_exam_results} result{stats.total_exam_results !== 1 ? "s" : ""} recorded · avg {avgScore}
            </p>
          )}
        </div>
        <div className="ml-auto flex gap-2 flex-wrap">
          {[
            { label: "📋 Submissions", nav: "exams"    },
            { label: "👥 Students",    nav: "students" },
            { label: "◈ Groups",       nav: "groups"   },
          ].map(({ label, nav }) => (
            <button
              key={nav}
              onClick={() => onNav?.(nav)}
              className="px-3 py-1.5 rounded-xl text-[11px] font-black transition-all hover:opacity-80"
              style={{ background: "rgba(59,130,246,0.1)", color: "#93C5FD", border: "1px solid rgba(59,130,246,0.2)" }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Pending marking alert ── */}
      {!loadStats && pendingSubs != null && pendingSubs > 0 && (
        <div
          className="rounded-2xl p-4 flex items-center gap-4"
          style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)" }}
        >
          <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
            style={{ background: "rgba(239,68,68,0.15)" }}>
            ⚠️
          </div>
          <div className="flex-1">
            <p className="text-white font-black text-sm">
              {pendingSubs} submission{pendingSubs !== 1 ? "s" : ""} need marking
            </p>
            <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
              Students are waiting for their results
            </p>
          </div>
          <button
            onClick={() => onNav?.("exams")}
            className="px-4 py-2 rounded-xl text-xs font-black shrink-0 transition-all hover:opacity-90"
            style={{ background: "#EF4444", color: "#fff", boxShadow: "0 4px 14px rgba(239,68,68,0.3)" }}
          >
            Mark Now →
          </button>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          SUBJECT / GRADE PANEL — tabbed
          ══════════════════════════════════════════════════════ */}
      <div
        className="rounded-2xl p-5"
        style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <TabBar tabs={ANALYTICS_TABS} active={analyticsTab} onChange={setAnalyticsTab} />
        {analyticsTab === "subjects"
          ? <SubjectList rows={subjectDist} loading={loadDash} />
          : <PerGradeList rows={perGrade}   loading={loadDash} />
        }
      </div>

      {/* ══════════════════════════════════════════════════════
          TOP STUDENTS
          ══════════════════════════════════════════════════════ */}
      <div
        className="rounded-2xl p-5"
        style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="mb-3">
          <p className="text-white font-black text-base">🏆 Top Students</p>
          <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
            Ranked by average score across all marked submissions
          </p>
        </div>
        <TopStudentsList rows={topStudents} loading={loadDash} />
      </div>

    </div>
  );
}