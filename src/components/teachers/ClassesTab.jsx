import { useState } from "react";
import { CLASSES } from "../../data/teacher.dashboard.data";
import SectionTitle from "./SectionTitle";


export default function ClassesTab() {
  const [section, setSection] = useState("upcoming");
  const upcoming = CLASSES.filter(c => c.upcoming);
  const past = CLASSES.filter(c => !c.upcoming);

  return (
    <div className="space-y-6">
      <SectionTitle icon="◎" title="Virtual Classes" subtitle="Live sessions & recordings" action="+ Schedule" color="#0891B2" />

      <div className="flex gap-2">
        {[["upcoming", "🔔 Upcoming"], ["past", "📼 Past"]].map(([key, label]) => (
          <button key={key} onClick={() => setSection(key)}
            className="px-4 py-2 rounded-xl text-sm font-black transition-all"
            style={section === key ? { background: "#0891B2", color: "#fff" } : { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.09)" }}>
            {label}
          </button>
        ))}
      </div>

      {section === "upcoming" && (
        <div className="space-y-3">
          {upcoming.map((cls, i) => (
            <div key={cls.id} className="p-4 rounded-2xl flex items-center gap-4"
              style={{ background: i === 0 ? `${cls.color}10` : "rgba(255,255,255,0.03)", border: `1px solid ${cls.color}${i === 0 ? "45" : "22"}` }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm shrink-0"
                style={{ background: `${cls.color}20`, color: cls.color, border: `1px solid ${cls.color}35` }}>
                {cls.grade.replace("Form ", "F")}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-white text-sm truncate">{cls.title}</p>
                <p className="text-white/35 text-xs mt-0.5">{cls.grade} · {cls.enrolled} students · {cls.duration}</p>
                <p className="text-white/25 text-xs">{cls.date} at {cls.time}</p>
              </div>
              <div className="text-right shrink-0">
                {i === 0 && (
                  <button className="px-3 py-1.5 rounded-lg text-xs font-black block mb-1"
                    style={{ background: cls.color, color: "#fff" }}>Start →</button>
                )}
                <button className="px-3 py-1.5 rounded-lg text-[10px] font-black"
                  style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.09)" }}>
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {section === "past" && (
        <div className="space-y-3">
          {past.map(cls => (
            <div key={cls.id} className="p-4 rounded-2xl flex items-center gap-4"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm shrink-0 opacity-60"
                style={{ background: `${cls.color}15`, color: cls.color }}>
                {cls.grade.replace("Form ", "F")}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-white/70 text-sm truncate">{cls.title}</p>
                <p className="text-white/30 text-xs mt-0.5">{cls.date} · {cls.attended}/{cls.enrolled} attended</p>
              </div>
              <button className="px-3 py-1.5 rounded-lg text-[10px] font-black shrink-0"
                style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.09)" }}>
                Recording
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}