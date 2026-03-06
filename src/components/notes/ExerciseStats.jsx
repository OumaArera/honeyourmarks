import { useEffect, useState } from "react";
import { getData } from "../../api/api.service";

// ── Reusable stat card ────────────────────────────────────────────────────────
function StatCard({ label, value, color = "#fff", sub }) {
  return (
    <div className="flex flex-col gap-1 p-4 rounded-2xl"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
      <p className="text-2xl font-black" style={{ color }}>{value ?? "—"}</p>
      <p className="text-xs font-black tracking-wide uppercase" style={{ color: "rgba(255,255,255,0.35)" }}>{label}</p>
      {sub && <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.2)" }}>{sub}</p>}
    </div>
  );
}

// ── Level pill ────────────────────────────────────────────────────────────────
const LEVEL_COLORS = {
  beginner:     { color: "#34D399", bg: "rgba(52,211,153,0.12)"  },
  intermediate: { color: "#F59E0B", bg: "rgba(245,158,11,0.12)"  },
  expert:       { color: "#F87171", bg: "rgba(248,113,113,0.12)" },
};

function LevelPill({ level, count }) {
  const s = LEVEL_COLORS[level] ?? { color: "#fff", bg: "rgba(255,255,255,0.08)" };
  return (
    <div className="flex items-center justify-between px-3 py-2 rounded-xl"
      style={{ background: s.bg, border: `1px solid ${s.color}30` }}>
      <span className="text-xs font-black capitalize" style={{ color: s.color }}>{level}</span>
      <span className="text-sm font-black text-white">{count}</span>
    </div>
  );
}

// ── Section heading ───────────────────────────────────────────────────────────
function SectionHeading({ children }) {
  return (
    <h4 className="text-[10px] font-black tracking-widest uppercase mb-3"
      style={{ color: "rgba(255,255,255,0.3)" }}>{children}</h4>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ExerciseStats() {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await getData("dashboard/teacher/exercises/");
        if (res?.error) throw new Error(res.error);
        setStats(res);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return (
    <div className="flex items-center gap-2 px-4 py-6 text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>
      <span className="w-4 h-4 border-2 border-white/20 border-t-amber-600 rounded-full animate-spin" />
      Loading exercise stats…
    </div>
  );

  if (error) return (
    <div className="px-4 py-3 rounded-xl text-sm" style={{ color: "#F87171",
      background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)" }}>
      Couldn't load stats: {error}
    </div>
  );

  if (!stats) return null;

  const { overall, level_distribution, per_subject, per_topic, most_active_students } = stats;

  return (
    <div className="space-y-8">

      {/* ── Overall ── */}
      <div>
        <SectionHeading>Overall</SectionHeading>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <StatCard label="Total Submissions" value={overall.total_submissions} color="#F59E0B" />
          <StatCard label="Marked"            value={overall.marked_count}      color="#34D399" />
          <StatCard label="Unmarked"          value={overall.unmarked_count}    color="#F87171" />
          <StatCard label="Commented"         value={overall.commented_count}   color="#7dd3fc" />
          <StatCard label="Unique Students"   value={overall.unique_students}   color="#c4b5fd" />
          <StatCard label="Unique Exercises"  value={overall.unique_exercises}  color="#f9a8d4" />
        </div>
      </div>

      {/* ── Level distribution ── */}
      {level_distribution && Object.keys(level_distribution).length > 0 && (
        <div>
          <SectionHeading>By Difficulty</SectionHeading>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {Object.entries(level_distribution).map(([level, data]) => (
              <LevelPill key={level} level={level} count={data.total_submissions} />
            ))}
          </div>
        </div>
      )}

      {/* ── Per subject ── */}
      {per_subject?.length > 0 && (
        <div>
          <SectionHeading>By Subject</SectionHeading>
          <div className="space-y-2">
            {per_subject.map((s) => (
              <div key={s.subject_name} className="rounded-2xl p-4"
                style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-center justify-between mb-3">
                  <p className="font-black text-sm text-white">{s.subject_name}</p>
                  <span className="text-xs font-black px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(245,158,11,0.15)", color: "#F59E0B" }}>
                    {s.total_submissions} submission{s.total_submissions !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[
                    { label: "Beginner",     val: s.beginner_count,     color: "#34D399" },
                    { label: "Intermediate", val: s.intermediate_count,  color: "#F59E0B" },
                    { label: "Expert",       val: s.expert_count,        color: "#F87171" },
                  ].map((item) => (
                    <div key={item.label} className="rounded-xl py-2"
                      style={{ background: "rgba(255,255,255,0.03)" }}>
                      <p className="font-black text-sm" style={{ color: item.color }}>{item.val}</p>
                      <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Per topic ── */}
      {per_topic?.length > 0 && (
        <div>
          <SectionHeading>By Topic</SectionHeading>
          <div className="space-y-2">
            {per_topic.map((t) => (
              <div key={t.topic_name} className="flex items-center gap-4 px-4 py-3 rounded-xl"
                style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-sm text-white truncate">{t.topic_name}</p>
                  <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>{t.subject_name}</p>
                </div>
                <div className="flex items-center gap-3 text-xs text-right shrink-0">
                  <span style={{ color: "#34D399" }}>{t.marked_count} marked</span>
                  <span style={{ color: "#F87171" }}>{t.unmarked_count ?? 0} pending</span>
                  <span className="font-black" style={{ color: "#F59E0B" }}>{t.total_submissions} total</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Most active students ── */}
      {most_active_students?.length > 0 && (
        <div>
          <SectionHeading>Most Active Students</SectionHeading>
          <div className="space-y-2">
            {most_active_students.map((s, i) => (
              <div key={s.student_id}
                className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <span className="text-xs font-black w-5 text-center" style={{ color: "rgba(255,255,255,0.2)" }}>
                  {i + 1}
                </span>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0"
                  style={{ background: "rgba(245,158,11,0.15)", color: "#F59E0B" }}>
                  {s.first_name?.[0]}{s.last_name?.[0]}
                </div>
                <p className="flex-1 font-black text-sm text-white">
                  {s.first_name} {s.last_name}
                </p>
                <div className="flex items-center gap-3 text-xs shrink-0">
                  <span style={{ color: "#34D399" }}>{s.marked_count} marked</span>
                  <span className="font-black" style={{ color: "#F59E0B" }}>{s.total_submissions} total</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}