import React from "react";
import { STUDENT, NOTES_STATS, EXAM_STATS, CLASSES } from "../../data/dashboard.data";;
import XpBar from "./XpBar";
import StatChip from "./StatChip";
import SectionHeader from "./SectionHeader";


export default function HomeTab() {
  const exercisePct = Math.round((NOTES_STATS.overall.marked_count / NOTES_STATS.overall.total_submissions) * 100);
  // const examPct = Math.round((EXAM_STATS.overall.marked_submissions / EXAM_STATS.overall.total_submissions) * 100);

  return (
    <div className="space-y-6">
      {/* Welcome hero */}
      <div className="relative rounded-2xl overflow-hidden p-6"
        style={{ background: "linear-gradient(135deg,#1B2F4E 0%,#0F2A1A 100%)", border: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full -translate-y-1/2 translate-x-1/2"
          style={{ background: "radial-gradient(circle,rgba(232,74,12,0.2),transparent 70%)" }} />
        <div className="relative z-10 flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0"
            style={{ background: "rgba(232,74,12,0.2)", border: "1px solid rgba(232,74,12,0.4)" }}>
            {STUDENT.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white/50 text-xs font-bold tracking-widest uppercase mb-0.5">Welcome back</p>
            <h1 className="text-white font-black text-2xl leading-tight">{STUDENT.name}</h1>
            <p className="text-white/50 text-sm mt-0.5">{STUDENT.grade} · {STUDENT.badge}</p>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-xs"
              style={{ background: "rgba(232,74,12,0.2)", border: "1px solid rgba(232,74,12,0.4)", color: "#f97316" }}>
              🔥 {STUDENT.streak}-day streak
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-xs"
              style={{ background: "rgba(46,139,42,0.2)", border: "1px solid rgba(46,139,42,0.4)", color: "#4ade80" }}>
              ⚡ {STUDENT.xp.toLocaleString()} XP
            </div>
          </div>
        </div>
        <div className="relative z-10 mt-4">
          <div className="flex justify-between text-xs text-white/40 mb-1.5">
            <span>Level {STUDENT.level} progress</span>
            <span>{STUDENT.xp}/{STUDENT.nextLevelXp} XP to Level {STUDENT.level + 1}</span>
          </div>
          <XpBar current={STUDENT.xp} max={STUDENT.nextLevelXp} />
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatChip icon="📝" value={NOTES_STATS.overall.total_submissions} label="Exercises Done" color="#E84A0C" />
        <StatChip icon="🏆" value={EXAM_STATS.overall.total_submissions} label="Exams Taken" color="#1B7FC4" />
        <StatChip icon="✅" value={`${exercisePct}%`} label="Exercises Marked" color="#2E8B2A" />
        <StatChip icon="💬" value={NOTES_STATS.overall.commented_count} label="Feedback Got" color="#9B6B2A" />
      </div>

      {/* Next class alert */}
      <div className="rounded-2xl p-4 flex items-center gap-4"
        style={{ background: "rgba(232,74,12,0.1)", border: "1px solid rgba(232,74,12,0.3)" }}>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
          style={{ background: "rgba(232,74,12,0.2)" }}>📡</div>
        <div className="flex-1">
          <p className="text-white font-bold text-sm">{CLASSES.upcoming[0].title}</p>
          <p className="text-white/50 text-xs mt-0.5">{CLASSES.upcoming[0].teacher} · {CLASSES.upcoming[0].time}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-white/30 text-[10px] font-bold uppercase tracking-wider">Starts in</span>
          <span className="font-black text-lg" style={{ color: "#E84A0C" }}>{CLASSES.upcoming[0].countdown}</span>
        </div>
      </div>

      {/* Progress by subject */}
      <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <SectionHeader icon="📊" title="Subject Progress" subtitle="Exercise completion by subject" />
        <div className="space-y-4">
          {NOTES_STATS.per_subject.map(s => {
            const pct = Math.round((s.marked_count / s.total_submissions) * 100);
            const colors = { English: "#1B7FC4", Mathematics: "#E84A0C", Chemistry: "#2E8B2A" };
            const c = colors[s.subject_name] || "#718096";
            return (
              <div key={s.subject_name}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white/70 text-sm font-semibold">{s.subject_name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/40">{s.marked_count}/{s.total_submissions}</span>
                    <span className="font-black text-sm" style={{ color: c }}>{pct}%</span>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, background: `linear-gradient(90deg,${c},${c}bb)`, boxShadow: `0 0 8px ${c}66` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}