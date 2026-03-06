import { useState } from "react";
import { 
  TEACHER, STATS, GROUPS, 
  CLASSES, PENDING_MARKS, 
} from "../../data/teacher.dashboard.data";
import Badge from "./Badge";
import StatCard from "./StatCard";
import SectionTitle from "./SectionTitle";


export default function OverviewTab({ onNav }) {
  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden p-6"
        style={{ background: "linear-gradient(135deg,#0C2340 0%,#081C14 60%,#0C1A2E 100%)", border: "1px solid rgba(13,148,136,0.2)" }}>
        <div className="absolute top-0 right-0 w-56 h-56 rounded-full -translate-y-1/3 translate-x-1/3"
          style={{ background: "radial-gradient(circle,rgba(13,148,136,0.18),transparent 70%)" }} />
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full translate-y-1/2 -translate-x-1/4"
          style={{ background: "radial-gradient(circle,rgba(8,145,178,0.12),transparent 70%)" }} />
        <div className="relative z-10 flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0"
            style={{ background: "rgba(13,148,136,0.2)", border: "1px solid rgba(13,148,136,0.4)" }}>
            {TEACHER.avatar}
          </div>
          <div className="flex-1">
            <p className="text-teal-400/70 text-xs font-black tracking-widest uppercase mb-0.5">Good morning</p>
            <h1 className="text-white font-black text-2xl leading-tight">{TEACHER.name}</h1>
            <p className="text-white/40 text-sm mt-0.5">{TEACHER.title} · {TEACHER.school}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {TEACHER.subjects.map(s => <Badge key={s} color="#0D9488">{s}</Badge>)}
            </div>
          </div>
        </div>
      </div>

      {/* Stat grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatCard icon="⚠" value={STATS.pendingMarking} label="Pending Marking" sub="Needs attention" color="#DC2626" urgent />
        <StatCard icon="👥" value={STATS.activeStudents} label="Active Students" sub={`${TEACHER.activeGroups} groups`} color="#0D9488" />
        <StatCard icon="📡" value={STATS.classesThisWeek} label="Classes This Week" color="#0891B2" />
        <StatCard icon="📝" value={STATS.totalExercises} label="Exercises Created" color="#7C3AED" />
        <StatCard icon="🏆" value={STATS.totalExams} label="Exams Published" color="#B45309" />
        <StatCard icon="📈" value={`${STATS.avgScore}%`} label="Class Avg Score" sub="Across all exams" color="#0D9488" />
      </div>

      {/* Next class */}
      <div className="rounded-2xl p-4 flex items-center gap-4"
        style={{ background: "rgba(13,148,136,0.08)", border: "1px solid rgba(13,148,136,0.25)" }}>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
          style={{ background: "rgba(13,148,136,0.2)" }}>📡</div>
        <div className="flex-1">
          <p className="text-white font-black text-sm">{CLASSES[0].title}</p>
          <p className="text-white/40 text-xs mt-0.5">{CLASSES[0].grade} · {CLASSES[0].enrolled} students · {CLASSES[0].duration}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-teal-400/60 text-[10px] font-black uppercase tracking-wider">Today</p>
          <p className="font-black text-teal-400 text-lg">{CLASSES[0].time}</p>
          <button className="mt-1 px-3 py-1 rounded-lg text-xs font-black"
            style={{ background: "#0D9488", color: "#fff" }}>Start →</button>
        </div>
      </div>

      {/* Pending marking quick list */}
      <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <SectionTitle icon="⚑" title="Needs Marking" subtitle={`${STATS.pendingMarking} submissions waiting`}
          action="View All" onAction={() => onNav("marking")} color="#DC2626" />
        <div className="space-y-2">
          {PENDING_MARKS.slice(0, 3).map(m => (
            <div key={m.id} className="flex items-center gap-3 p-3 rounded-xl"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-base shrink-0"
                style={{ background: "rgba(13,148,136,0.15)" }}>{m.avatar}</div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-bold truncate">{m.student}</p>
                <p className="text-white/35 text-xs truncate">{m.exercise}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-white/30 text-[10px]">{m.submitted}</p>
                <button className="mt-1 px-2.5 py-1 rounded-lg text-[10px] font-black"
                  style={{ background: "rgba(13,148,136,0.2)", color: "#2DD4BF", border: "1px solid rgba(13,148,136,0.3)" }}>
                  Mark
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Group overview */}
      <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <SectionTitle icon="◈" title="My Groups" subtitle="Active study groups" action="Manage" onAction={() => onNav("groups")} color="#0D9488" />
        <div className="space-y-2">
          {GROUPS.map(g => (
            <div key={g.id} className="flex items-center gap-3 p-3 rounded-xl"
              style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${g.color}22` }}>
              <div className="w-2 h-10 rounded-full shrink-0" style={{ background: g.color }} />
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-bold truncate">{g.name}</p>
                <p className="text-white/35 text-xs">👤 {g.members} · {g.nextClass}</p>
              </div>
              {g.pending > 0 && (
                <span className="text-xs font-black px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(220,38,38,0.15)", color: "#F87171" }}>
                  {g.pending} pending
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}