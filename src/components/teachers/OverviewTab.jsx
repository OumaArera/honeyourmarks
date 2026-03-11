import { useEffect, useMemo, useState } from "react";
import { getData } from "../../api/api.service";
import { getAuthorId } from "../../utils/notes.utils";

// ─────────────────────────────────────────────────────────────────────────────
// ── Helpers
// ─────────────────────────────────────────────────────────────────────────────

function fmtDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
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

// ─────────────────────────────────────────────────────────────────────────────
// ── Skeleton pulse
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
// ── StatCard
// ─────────────────────────────────────────────────────────────────────────────

function StatCard({ icon, value, label, sub, color, loading }) {
  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-2"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: `1px solid ${color}25`,
      }}
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
        {sub && <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>{sub}</p>}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── ScoreRing — circular progress
// ─────────────────────────────────────────────────────────────────────────────

function ScoreRing({ pct, color, size = 72 }) {
  const r   = (size - 10) / 2;
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
// ── OverviewTab
// ─────────────────────────────────────────────────────────────────────────────

export default function OverviewTab({ onNav }) {
  const userId = useMemo(() => getAuthorId(), []);

  const [teacher,      setTeacher]      = useState(null);
  const [stats,        setStats]        = useState(null);
  const [loadTeacher,  setLoadTeacher]  = useState(true);
  const [loadStats,    setLoadStats]    = useState(true);
  const [error,        setError]        = useState(null);

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

  // ── Fetch dashboard stats
  useEffect(() => {
    (async () => {
      try {
        const res = await getData("teacher/dashboard/stats/");
        if (res?.error) throw new Error(res.error);
        setStats(res);
      } catch {
        // stats failing silently — still show rest of UI
      } finally {
        setLoadStats(false);
      }
    })();
  }, []);

  const loading = loadTeacher;

  // Derived
  const fullName    = teacher ? `${teacher.first_name} ${teacher.last_name}` : "";
  const initials    = getInitials(teacher?.first_name, teacher?.last_name);
  const avgScore    = stats?.average_exam_score    != null ? `${stats.average_exam_score.toFixed(1)}%`   : "—";
  const overallPct  = stats?.overall_exam_percentage != null ? stats.overall_exam_percentage : null;
  const pendingSubs = stats != null
    ? (stats.total_exam_submissions - stats.total_exams_marked)
    : null;

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

      {/* ── Hero card ── */}
      <div
        className="relative rounded-2xl overflow-hidden p-6"
        style={{
          background: "linear-gradient(135deg,#0C2340 0%,#081C14 60%,#0C1A2E 100%)",
          border: "1px solid rgba(13,148,136,0.2)",
        }}
      >
        {/* Glow blobs */}
        <div className="absolute top-0 right-0 w-56 h-56 rounded-full -translate-y-1/3 translate-x-1/3 pointer-events-none"
          style={{ background: "radial-gradient(circle,rgba(13,148,136,0.18),transparent 70%)" }} />
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none"
          style={{ background: "radial-gradient(circle,rgba(8,145,178,0.12),transparent 70%)" }} />

        <div className="relative z-10 flex items-start gap-4">
          {/* Avatar */}
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 text-xl font-black"
            style={{
              background: "linear-gradient(135deg,rgba(13,148,136,0.35),rgba(8,145,178,0.2))",
              border: "1px solid rgba(13,148,136,0.4)",
              color: "#2DD4BF",
            }}
          >
            {loading ? "👤" : initials}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-teal-400/70 text-xs font-black tracking-widest uppercase mb-0.5">
              {greetingByHour()}
            </p>

            {loading ? (
              <div className="space-y-2 mt-1">
                <Skeleton w="w-48" h="h-6" />
                <Skeleton w="w-36" h="h-3" />
              </div>
            ) : (
              <>
                <h1 className="text-white font-black text-2xl leading-tight truncate">{fullName}</h1>
                <p className="text-white/40 text-sm mt-0.5 truncate">
                  {teacher?.tsc_number ? `TSC: ${teacher.tsc_number}` : "Teacher"} · {teacher?.county ?? "—"}
                </p>

                {/* Meta chips */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {[
                    { icon: "📧", val: teacher?.email },
                    { icon: "📞", val: teacher?.phone_number },
                    { icon: "🎂", val: teacher?.date_of_birth ? fmtDate(teacher.date_of_birth) : null },
                  ].filter((m) => m.val).map(({ icon, val }) => (
                    <span
                      key={val}
                      className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full"
                      style={{ background: "rgba(13,148,136,0.12)", color: "#5EEAD4", border: "1px solid rgba(13,148,136,0.2)" }}
                    >
                      {icon} {val}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Stats grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatCard
          icon="👥" color="#0D9488" label="Total Students"
          value={stats?.total_students} loading={loadStats}
          sub={stats ? `${stats.total_groups} group${stats.total_groups !== 1 ? "s" : ""}` : null}
        />
        <StatCard
          icon="📚" color="#0891B2" label="Total Subjects"
          value={stats?.total_subjects} loading={loadStats}
        />
        <StatCard
          icon="📝" color="#7C3AED" label="Exam Submissions"
          value={stats?.total_exam_submissions} loading={loadStats}
          sub={pendingSubs != null && pendingSubs > 0 ? `${pendingSubs} unmarked` : "All marked"}
        />
        <StatCard
          icon="✅" color="#10B981" label="Exams Marked"
          value={stats?.total_exams_marked} loading={loadStats}
          sub={stats ? `of ${stats.total_exam_submissions} total` : null}
        />
        <StatCard
          icon="🏃" color="#F59E0B" label="Exercise Submissions"
          value={stats?.total_exercise_submissions} loading={loadStats}
        />
        <StatCard
          icon="📈" color="#3B82F6" label="Avg Exam Score"
          value={avgScore} loading={loadStats}
        />
      </div>

      {/* ── Performance ring + quick facts ── */}
      <div
        className="rounded-2xl p-5 flex items-center gap-5 flex-wrap sm:flex-nowrap"
        style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(59,130,246,0.18)" }}
      >
        {/* Ring */}
        <div className="relative shrink-0">
          {loadStats ? (
            <Skeleton w="w-[72px]" h="h-[72px]" rounded="rounded-full" />
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

        {/* Quick-nav buttons */}
        <div className="ml-auto flex gap-2 flex-wrap">
          {[
            { label: "📋 Submissions", nav: "exams" },
            { label: "👥 Students",    nav: "students" },
            { label: "◈ Groups",       nav: "groups" },
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
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
            style={{ background: "rgba(239,68,68,0.15)" }}
          >
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

      {/* ── Teacher profile detail card ── */}
      {!loadTeacher && teacher && (
        <div
          className="rounded-2xl p-5 space-y-4"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <p className="text-xs font-black tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>
            Profile Details
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: "Full Name",  value: fullName },
              { label: "Email",      value: teacher.email },
              { label: "Phone",      value: teacher.phone_number },
              { label: "TSC Number", value: teacher.tsc_number },
              { label: "County",     value: teacher.county },
              { label: "Date of Birth", value: fmtDate(teacher.date_of_birth) },
              { label: "Sex",        value: teacher.sex ? teacher.sex.charAt(0).toUpperCase() + teacher.sex.slice(1) : "—" },
              { label: "Joined",     value: fmtDate(teacher.created_at) },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="rounded-xl p-3"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <p className="text-[9px] font-black tracking-widest uppercase mb-1" style={{ color: "rgba(255,255,255,0.28)" }}>
                  {label}
                </p>
                <p className="text-xs font-bold text-white truncate">{value || "—"}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}