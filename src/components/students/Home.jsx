import React from "react";
import { NAV_ITEMS } from "../../data/dashboard.data";


// ─── Helpers ────────────────────────────────────────────────────────────────

function safeNum(val) {
  const n = parseFloat(val);
  return isNaN(n) ? null : n;
}

function fmt(val, decimals = 1) {
  const n = safeNum(val);
  return n === null ? "—" : `${n.toFixed(decimals)}%`;
}

// ─── Skeleton loader ────────────────────────────────────────────────────────

function Skeleton({ className = "", style = {} }) {
  return (
    <div
      className={`animate-pulse rounded-xl ${className}`}
      style={{ background: "rgba(255,255,255,0.06)", ...style }}
    />
  );
}

// ─── Stat chip ──────────────────────────────────────────────────────────────

function StatChip({ icon, value, label, color, loading }) {
  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-2"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <span className="text-xl">{icon}</span>
      {loading ? (
        <Skeleton className="h-7 w-16" />
      ) : (
        <span className="font-black text-2xl" style={{ color }}>
          {value}
        </span>
      )}
      <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.4)" }}>
        {label}
      </span>
    </div>
  );
}

// ─── Difficulty badge row ────────────────────────────────────────────────────

function DifficultyRow({ levels, loading }) {
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {levels.map(({ label, count, color, avg }) =>
        loading ? (
          <Skeleton key={label} className="h-7 w-24" />
        ) : (
          <div
            key={label}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
            style={{
              background: `${color}18`,
              border: `1px solid ${color}40`,
              color,
            }}
          >
            <span>{count}×</span>
            <span>{label}</span>
            {avg !== null && (
              <span style={{ color: `${color}aa` }}>· {avg.toFixed(1)}%</span>
            )}
          </div>
        )
      )}
    </div>
  );
}

// ─── Progress bar ────────────────────────────────────────────────────────────

function ProgressBar({ pct, color }) {
  return (
    <div
      className="w-full h-2 rounded-full overflow-hidden"
      style={{ background: "rgba(255,255,255,0.07)" }}
    >
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{
          width: `${Math.min(pct, 100)}%`,
          background: `linear-gradient(90deg, ${color}, ${color}bb)`,
          boxShadow: `0 0 8px ${color}55`,
        }}
      />
    </div>
  );
}

// ─── Nav shortcut card ───────────────────────────────────────────────────────

const NAV_COLORS = {
  notes:   { bg: "rgba(232,74,12,0.12)",  border: "rgba(232,74,12,0.3)",  accent: "#E84A0C" },
  exams:   { bg: "rgba(27,127,196,0.12)", border: "rgba(27,127,196,0.3)", accent: "#1B7FC4" },
  classes: { bg: "rgba(46,139,42,0.12)",  border: "rgba(46,139,42,0.3)",  accent: "#2E8B2A" },
  groups:  { bg: "rgba(155,107,42,0.12)", border: "rgba(155,107,42,0.3)", accent: "#9B6B2A" },
  pricing: { bg: "rgba(139,46,139,0.12)", border: "rgba(139,46,139,0.3)", accent: "#8B2E8B" },
  profile: { bg: "rgba(46,107,139,0.12)", border: "rgba(46,107,139,0.3)", accent: "#2E6B8B" },
};

function NavCard({ item, onNav }) {
  const c = NAV_COLORS[item.key] || NAV_COLORS.notes;
  return (
    <button
      onClick={() => onNav(item.key)}
      className="rounded-2xl p-4 flex flex-col items-center gap-2 transition-all duration-200 hover:scale-105 active:scale-95 w-full"
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
      }}
    >
      <span className="text-2xl">{item.icon}</span>
      <span
        className="text-xs font-black tracking-wide uppercase"
        style={{ color: c.accent }}
      >
        {item.label}
      </span>
    </button>
  );
}

// ─── Section card wrapper ────────────────────────────────────────────────────

function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl p-5 ${className}`}
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {children}
    </div>
  );
}

function SectionTitle({ icon, title, subtitle }) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2">
        <span className="text-base">{icon}</span>
        <h2 className="font-black text-white text-sm sm:text-base">{title}</h2>
      </div>
      {subtitle && (
        <p className="text-xs mt-0.5 ml-6" style={{ color: "rgba(255,255,255,0.35)" }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ─── Subject colours pool ────────────────────────────────────────────────────

const SUBJECT_COLORS = ["#1B7FC4", "#E84A0C", "#2E8B2A", "#9B6B2A", "#8B2E8B", "#2E6B8B"];

function subjectColor(index) {
  return SUBJECT_COLORS[index % SUBJECT_COLORS.length];
}

// ─── Main HomeTab ─────────────────────────────────────────────────────────────

export default function HomeTab({ examStats, exerciseStats, statsLoading, onNav }) {
  const exOverall = examStats?.overall;
  const exSubjects = examStats?.per_subject ?? [];
  const ezOverall = exerciseStats?.overall;
  const ezSubjects = exerciseStats?.per_subject ?? [];

  // Exam difficulty levels
  const examLevels = [
    { label: "Scout",    count: exOverall?.scout_count ?? 0,    color: "#6B8B2E", avg: safeNum(exOverall?.scout_avg_score) },
    { label: "Explorer", count: exOverall?.explorer_count ?? 0, color: "#1B7FC4", avg: safeNum(exOverall?.explorer_avg_score) },
    { label: "Legend",   count: exOverall?.legend_count ?? 0,   color: "#E84A0C", avg: safeNum(exOverall?.legend_avg_score) },
  ];

  // Exercise difficulty levels
  const exerciseLevels = [
    { label: "Beginner",     count: ezOverall?.beginner_count ?? 0,     color: "#2E8B2A", avg: null },
    { label: "Intermediate", count: ezOverall?.intermediate_count ?? 0, color: "#1B7FC4", avg: null },
    { label: "Expert",       count: ezOverall?.expert_count ?? 0,       color: "#E84A0C", avg: null },
  ];

  // Exercise marked rate
  const ezTotal = ezOverall?.total_submissions ?? 0;
  const ezMarked = ezOverall?.marked_count ?? 0;
  const ezMarkedPct = ezTotal > 0 ? Math.round((ezMarked / ezTotal) * 100) : 0;

  // NAV items excluding home
  const quickNavItems = NAV_ITEMS.filter(n => n.key !== "home");

  return (
    <div className="space-y-5">

      {/* ── Quick stats row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatChip
          icon="📝" label="Exercises Done"
          value={ezOverall?.total_submissions ?? "—"}
          color="#E84A0C" loading={statsLoading}
        />
        <StatChip
          icon="🏆" label="Exams Taken"
          value={exOverall?.total_submissions ?? "—"}
          color="#1B7FC4" loading={statsLoading}
        />
        <StatChip
          icon="✅" label="Exercises Marked"
          value={statsLoading ? "—" : `${ezMarkedPct}%`}
          color="#2E8B2A" loading={statsLoading}
        />
        <StatChip
          icon="💬" label="Feedback Got"
          value={ezOverall?.commented_count ?? "—"}
          color="#9B6B2A" loading={statsLoading}
        />
      </div>

      {/* ── Exam performance ── */}
      <Card>
        <SectionTitle icon="🏆" title="Exam Performance" subtitle="Results by difficulty level" />

        {statsLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-3/4" />
          </div>
        ) : exOverall?.total_submissions === 0 || !exOverall ? (
          <p className="text-sm text-center py-4" style={{ color: "rgba(255,255,255,0.3)" }}>
            No exams taken yet
          </p>
        ) : (
          <>
            {/* Difficulty badges */}
            <DifficultyRow levels={examLevels} loading={false} />

            {/* Per-subject breakdown */}
            {exSubjects.length > 0 && (
              <div className="mt-5 space-y-4">
                {exSubjects.map((s, i) => {
                  const color = subjectColor(i);
                  const avg = safeNum(s.avg_score) ?? 0;
                  return (
                    <div key={`${s.subject_name}-${i}`}>
                      <div className="flex justify-between items-center mb-1.5">
                        <div className="flex flex-col">
                          <span className="text-white/80 text-sm font-semibold">{s.subject_name}</span>
                          <span className="text-white/35 text-xs">{s.subject_tag_name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                            {s.total_submissions} exam{s.total_submissions !== 1 ? "s" : ""}
                          </span>
                          <span className="font-black text-sm" style={{ color }}>
                            {avg.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      <ProgressBar pct={avg} color={color} />
                      {/* Difficulty mini-badges per subject */}
                      <div className="flex gap-1.5 mt-1.5 flex-wrap">
                        {[
                          { label: "Scout",    count: s.scout_count,    color: "#6B8B2E" },
                          { label: "Explorer", count: s.explorer_count, color: "#1B7FC4" },
                          { label: "Legend",   count: s.legend_count,   color: "#E84A0C" },
                        ].filter(d => d.count > 0).map(d => (
                          <span
                            key={d.label}
                            className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                            style={{ background: `${d.color}20`, color: d.color }}
                          >
                            {d.count}× {d.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </Card>

      {/* ── Exercise progress ── */}
      <Card>
        <SectionTitle icon="📝" title="Exercise Progress" subtitle="Submission & marking status" />

        {statsLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-2/3" />
          </div>
        ) : ezOverall?.total_submissions === 0 || !ezOverall ? (
          <p className="text-sm text-center py-4" style={{ color: "rgba(255,255,255,0.3)" }}>
            No exercises submitted yet
          </p>
        ) : (
          <>
            {/* Marking status bar */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.5)" }}>
                  Marked
                </span>
                <span className="text-xs font-black" style={{ color: "#2E8B2A" }}>
                  {ezMarked} / {ezTotal} ({ezMarkedPct}%)
                </span>
              </div>
              <ProgressBar pct={ezMarkedPct} color="#2E8B2A" />
            </div>

            {/* Difficulty breakdown */}
            <DifficultyRow levels={exerciseLevels} loading={false} />

            {/* Unmarked warning */}
            {(ezOverall.unmarked_count ?? 0) > 0 && (
              <div
                className="mt-4 rounded-xl px-3 py-2.5 flex items-center gap-2"
                style={{
                  background: "rgba(232,74,12,0.1)",
                  border: "1px solid rgba(232,74,12,0.25)",
                }}
              >
                <span className="text-sm">⏳</span>
                <span className="text-xs font-semibold" style={{ color: "rgba(232,74,12,0.9)" }}>
                  {ezOverall.unmarked_count} exercise{ezOverall.unmarked_count !== 1 ? "s" : ""} awaiting marking
                </span>
              </div>
            )}

            {/* Per-subject exercise breakdown */}
            {ezSubjects.length > 0 && (
              <div className="mt-5 space-y-4">
                {ezSubjects.map((s, i) => {
                  const color = subjectColor(i);
                  const markedPct = s.total_submissions > 0
                    ? Math.round((s.marked_count / s.total_submissions) * 100)
                    : 0;
                  return (
                    <div key={`${s.subject_name}-${i}`}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-white/80 text-sm font-semibold">{s.subject_name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                            {s.marked_count}/{s.total_submissions} marked
                          </span>
                          <span className="font-black text-sm" style={{ color }}>
                            {markedPct}%
                          </span>
                        </div>
                      </div>
                      <ProgressBar pct={markedPct} color={color} />
                      <div className="flex gap-1.5 mt-1.5 flex-wrap">
                        {[
                          { label: "Beginner",     count: s.beginner_count,     color: "#2E8B2A" },
                          { label: "Intermediate", count: s.intermediate_count, color: "#1B7FC4" },
                          { label: "Expert",       count: s.expert_count,       color: "#E84A0C" },
                        ].filter(d => d.count > 0).map(d => (
                          <span
                            key={d.label}
                            className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                            style={{ background: `${d.color}20`, color: d.color }}
                          >
                            {d.count}× {d.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </Card>

      {/* ── Quick navigation ── */}
      <Card>
        <SectionTitle icon="🧭" title="Quick Navigation" subtitle="Jump to any section" />
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {quickNavItems.map(item => (
            <NavCard key={item.key} item={item} onNav={onNav} />
          ))}
        </div>
      </Card>

    </div>
  );
}