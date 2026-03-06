import { useEffect, useState } from "react";
import { getData } from "../../api/api.service";
import { LEVEL_META, GRADE_LABEL } from "./constants";

// ─────────────────────────────────────────────────────────────────────────────
// ── Stat card atoms
// ─────────────────────────────────────────────────────────────────────────────

function StatCard({ icon, label, value, sub, accent = "#60A5FA" }) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-2"
      style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <div className="flex items-center gap-2">
        <span className="text-xl">{icon}</span>
        <span className="text-[10px] font-black tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>
          {label}
        </span>
      </div>
      <p className="text-3xl font-black" style={{ color: accent }}>{value}</p>
      {sub && <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.3)" }}>{sub}</p>}
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <h3
      className="text-[10px] font-black tracking-widest uppercase mb-3"
      style={{ color: "rgba(255,255,255,0.3)" }}
    >
      {children}
    </h3>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── Level Distribution
// ─────────────────────────────────────────────────────────────────────────────

function LevelDistribution({ data }) {
  if (!data || Object.keys(data).length === 0) return null;

  return (
    <div>
      <SectionTitle>Level Distribution</SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {Object.entries(data).map(([level, stats]) => {
          const m = LEVEL_META[level] ?? LEVEL_META.scout;
          return (
            <div
              key={level}
              className="rounded-xl p-4 flex flex-col gap-1"
              style={{ background: m.bg, border: `1px solid ${m.border}` }}
            >
              <span className="text-[10px] font-black tracking-widest uppercase" style={{ color: m.color }}>
                {m.label}
              </span>
              <p className="text-2xl font-black" style={{ color: m.color }}>
                {stats.total_submissions}
              </p>
              <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.4)" }}>
                {stats.unique_students} unique student{stats.unique_students !== 1 ? "s" : ""}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── Per-Grade table
// ─────────────────────────────────────────────────────────────────────────────

function PerGradeTable({ data }) {
  if (!data?.length) return null;

  return (
    <div>
      <SectionTitle>Submissions by Grade</SectionTitle>
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <table className="w-full text-left text-xs">
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {["Grade", "Submissions", "Students", "Scout", "Explorer", "Legend"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 font-black tracking-wider uppercase text-[10px]"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr
                key={row.grade}
                style={{
                  borderBottom: i < data.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
                }}
              >
                <td className="px-4 py-3 font-bold" style={{ color: "#818CF8" }}>
                  {GRADE_LABEL[row.grade] ?? row.grade}
                </td>
                <td className="px-4 py-3 font-bold text-white">{row.total_submissions}</td>
                <td className="px-4 py-3" style={{ color: "rgba(255,255,255,0.5)" }}>{row.unique_students}</td>
                <td className="px-4 py-3" style={{ color: LEVEL_META.scout.color }}>{row.scout_count}</td>
                <td className="px-4 py-3" style={{ color: LEVEL_META.explorer.color }}>{row.explorer_count}</td>
                <td className="px-4 py-3" style={{ color: LEVEL_META.legend.color }}>{row.legend_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── Subject Distribution
// ─────────────────────────────────────────────────────────────────────────────

function SubjectDistribution({ data }) {
  if (!data?.length) return null;

  return (
    <div>
      <SectionTitle>Subject Performance</SectionTitle>
      <div className="space-y-3">
        {data.map((row) => (
          <div
            key={row.subject_tag_name}
            className="rounded-xl p-4"
            style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
              <div>
                <p className="font-black text-white text-sm">{row.subject_tag_name}</p>
                <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.3)" }}>{row.subject_name}</p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="text-[10px] font-black px-2.5 py-1 rounded-full"
                  style={{ background: "rgba(96,165,250,0.1)", color: "#60A5FA", border: "1px solid rgba(96,165,250,0.2)" }}
                >
                  {row.total_submissions} submissions
                </span>
                {row.overall_avg_score && (
                  <span
                    className="text-[10px] font-black px-2.5 py-1 rounded-full"
                    style={{ background: "rgba(52,211,153,0.1)", color: "#34D399", border: "1px solid rgba(52,211,153,0.2)" }}
                  >
                    avg {parseFloat(row.overall_avg_score).toFixed(1)}%
                  </span>
                )}
              </div>
            </div>
            {/* Level mini-bar */}
            <div className="flex gap-3 text-[10px]">
              <span style={{ color: LEVEL_META.scout.color }}>Scout: {row.scout_count}</span>
              <span style={{ color: LEVEL_META.explorer.color }}>Explorer: {row.explorer_count}</span>
              <span style={{ color: LEVEL_META.legend.color }}>Legend: {row.legend_count}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── Top Students
// ─────────────────────────────────────────────────────────────────────────────

function TopStudents({ data }) {
  if (!data?.length) return null;

  return (
    <div>
      <SectionTitle>Top Students</SectionTitle>
      <div className="space-y-2">
        {data.map((student, i) => (
          <div
            key={student.student_id}
            className="flex items-center gap-4 px-4 py-3 rounded-xl"
            style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            {/* Rank */}
            <span
              className="text-sm font-black shrink-0 w-6 text-center"
              style={{ color: i === 0 ? "#F59E0B" : i === 1 ? "#94A3B8" : i === 2 ? "#CD7F32" : "rgba(255,255,255,0.3)" }}
            >
              #{i + 1}
            </span>
            {/* Name */}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-white truncate">
                {student.first_name} {student.last_name}
              </p>
              <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                {student.total_submissions} submission{student.total_submissions !== 1 ? "s" : ""}
                {" "}· {student.marked_submissions} marked
              </p>
            </div>
            {/* Score */}
            {student.overall_avg_score && (
              <span
                className="text-sm font-black shrink-0"
                style={{ color: parseFloat(student.overall_avg_score) >= 70 ? "#34D399" : parseFloat(student.overall_avg_score) >= 50 ? "#F59E0B" : "#F87171" }}
              >
                {parseFloat(student.overall_avg_score).toFixed(1)}%
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── ExamStatsView
// ─────────────────────────────────────────────────────────────────────────────

export default function ExamStatsView() {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await getData("dashboard/teacher/stats/");
        if (res?.error) throw new Error(typeof res.error === "string" ? res.error : "Failed to load stats");
        setStats(res);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-16 justify-center text-sm" style={{ color: "rgba(255,255,255,0.25)" }}>
        <span className="w-5 h-5 border-2 border-white/20 border-t-blue-600 rounded-full animate-spin" />
        Loading stats…
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center text-sm" style={{ color: "#F87171" }}>
        Failed to load stats: {error}
      </div>
    );
  }

  if (!stats) return null;

  // Aggregate totals from level_distribution
  const totalSubmissions = Object.values(stats.level_distribution ?? {}).reduce(
    (sum, l) => sum + (l.total_submissions ?? 0), 0
  );
  const totalStudents = Math.max(
    ...Object.values(stats.level_distribution ?? {}).map((l) => l.unique_students ?? 0),
    0
  );
  const avgScore = stats.subject_distribution?.length
    ? (
        stats.subject_distribution.reduce((s, r) => s + parseFloat(r.overall_avg_score || 0), 0) /
        stats.subject_distribution.length
      ).toFixed(1)
    : null;

  return (
    <div className="space-y-8">
      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <StatCard icon="📨" label="Total Submissions" value={totalSubmissions} accent="#60A5FA" />
        <StatCard icon="🎓" label="Active Students"   value={totalStudents}   accent="#34D399" />
        {avgScore && (
          <StatCard
            icon="📈"
            label="Overall Avg Score"
            value={`${avgScore}%`}
            accent={parseFloat(avgScore) >= 70 ? "#34D399" : parseFloat(avgScore) >= 50 ? "#F59E0B" : "#F87171"}
          />
        )}
      </div>

      <LevelDistribution data={stats.level_distribution} />
      <SubjectDistribution data={stats.subject_distribution} />
      <PerGradeTable data={stats.per_grade} />
      <TopStudents data={stats.top_students} />
    </div>
  );
}