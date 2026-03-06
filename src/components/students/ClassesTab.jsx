import { useState } from "react";
import { CLASSES } from "../../data/dashboard.data";
import SectionHeader from "./SectionHeader";



export default function ClassesTab() {
  const [section, setSection] = useState("upcoming");

  return (
    <div className="space-y-6">
      <SectionHeader icon="📡" title="Virtual Classes" subtitle="Live & recorded sessions" accent="#1B7FC4" />

      <div className="flex gap-2">
        {[["upcoming", "🔔 Upcoming"], ["past", "📼 Past"]].map(([key, label]) => (
          <button key={key} onClick={() => setSection(key)}
            className="px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200"
            style={section === key ? { background: "#1B7FC4", color: "#fff" } : { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}>
            {label}
          </button>
        ))}
      </div>

      {section === "upcoming" && (
        <div className="space-y-3">
          {CLASSES.upcoming.map((cls, i) => (
            <div key={cls.id} className={`p-4 rounded-2xl flex items-center gap-4 ${i === 0 ? "ring-1" : ""}`}
              style={{ background: i === 0 ? `${cls.color}18` : "rgba(255,255,255,0.04)", border: `1px solid ${cls.color}33`, ...(i === 0 ? { boxShadow: `0 0 20px ${cls.color}20` } : {}) }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                style={{ background: `${cls.color}20` }}>{cls.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-white text-sm truncate">{cls.title}</p>
                <p className="text-white/40 text-xs mt-0.5">{cls.teacher} · {cls.subject} · {cls.duration}</p>
                <p className="text-white/30 text-xs mt-0.5">{cls.date} at {cls.time}</p>
              </div>
              <div className="text-right shrink-0">
                {i === 0 && (
                  <div className="flex items-center gap-1.5 justify-end mb-1">
                    <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: cls.color }} />
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: cls.color }}>Live Soon</span>
                  </div>
                )}
                <span className="font-black text-sm" style={{ color: cls.color }}>{cls.countdown}</span>
                {i === 0 && (
                  <button className="mt-2 px-3 py-1 rounded-lg text-xs font-bold block w-full"
                    style={{ background: cls.color, color: "#fff" }}>
                    Join →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {section === "past" && (
        <div className="space-y-3">
          {CLASSES.past.map(cls => (
            <div key={cls.id} className="p-4 rounded-2xl flex items-center gap-4"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 opacity-70"
                style={{ background: `${cls.color}15` }}>{cls.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-white/70 text-sm truncate">{cls.title}</p>
                <p className="text-white/30 text-xs mt-0.5">{cls.teacher} · {cls.date} {cls.time}</p>
              </div>
              <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 ${cls.attended ? "text-green-400" : "text-red-400"}`}
                style={{ background: cls.attended ? "rgba(74,222,128,0.1)" : "rgba(248,113,113,0.1)" }}>
                {cls.attended ? "✓ Attended" : "✗ Missed"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}