import { useState } from "react";
import { TEACHER, STUDENTS } from "../../data/teacher.dashboard.data";
import SectionTitle from "./SectionTitle";


export default function StudentsTab() {
  const [filter, setFilter] = useState("all");
  const filters = ["all", "active", "warning", "inactive"];
  const filtered = filter === "all" ? STUDENTS : STUDENTS.filter(s => s.status === filter);

  const statusColor = { active: "#0D9488", warning: "#B45309", inactive: "#DC2626" };
  const statusLabel = { active: "Active", warning: "At Risk", inactive: "Inactive" };

  return (
    <div className="space-y-6">
      <SectionTitle icon="◉" title="Students" subtitle={`${STUDENTS.length} enrolled across ${TEACHER.activeGroups} groups`}
        action="+ Invite" color="#0D9488" />

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-4 py-2 rounded-xl text-xs font-black tracking-wider uppercase transition-all"
            style={filter === f
              ? { background: "#0D9488", color: "#fff" }
              : { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.09)" }}>
            {f === "all" ? `All (${STUDENTS.length})` : `${statusLabel[f]} (${STUDENTS.filter(s => s.status === f).length})`}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(s => {
          const sc = statusColor[s.status];
          return (
            <div key={s.id} className="p-4 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.03)", border: `1px solid rgba(255,255,255,0.07)` }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0"
                  style={{ background: `${sc}18`, border: `1px solid ${sc}35` }}>{s.avatar}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-black text-white text-sm">{s.name}</p>
                    <span className="text-[9px] font-black px-2 py-0.5 rounded-full"
                      style={{ background: `${sc}20`, color: sc }}>{statusLabel[s.status]}</span>
                  </div>
                  <p className="text-white/35 text-xs mt-0.5">{s.grade} · {s.group}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-black text-white text-sm">{s.avgScore}%</p>
                  <p className="text-white/30 text-[10px]">avg score</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-3">
                {[
                  { icon: "🔥", val: `${s.streak}d`, lbl: "Streak" },
                  { icon: "📤", val: s.submissions, lbl: "Submitted" },
                  { icon: "⚡", val: `Lv${s.level}`, lbl: "Level" },
                ].map(({ icon, val, lbl }) => (
                  <div key={lbl} className="text-center p-2 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
                    <span className="text-sm">{icon}</span>
                    <p className="font-black text-white text-xs mt-0.5">{val}</p>
                    <p className="text-white/25 text-[9px]">{lbl}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mt-3">
                <button className="flex-1 py-1.5 rounded-lg text-[10px] font-black"
                  style={{ background: "rgba(13,148,136,0.12)", color: "#2DD4BF", border: "1px solid rgba(13,148,136,0.25)" }}>
                  View Progress
                </button>
                <button className="flex-1 py-1.5 rounded-lg text-[10px] font-black"
                  style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.09)" }}>
                  Send Message
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}