import { useState } from "react";
import {  GROUPS
} from "../../data/teacher.dashboard.data";
import Badge from "./Badge";
import SectionTitle from "./SectionTitle";


export default function GroupsTab() {
  return (
    <div className="space-y-6">
      <SectionTitle icon="◈" title="My Groups" subtitle="Manage your study groups" action="+ New Group" color="#0D9488" />
      <div className="space-y-4">
        {GROUPS.map(g => (
          <div key={g.id} className="rounded-2xl overflow-hidden"
            style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${g.color}33` }}>
            {/* Color bar */}
            <div className="h-1 w-full" style={{ background: `linear-gradient(90deg,${g.color},${g.color}55)` }} />
            <div className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg shrink-0"
                  style={{ background: `${g.color}18`, border: `1px solid ${g.color}40`, color: g.color }}>
                  {g.grade.replace("Form ", "F")}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-white text-base">{g.name}</h3>
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    <Badge color={g.color}>{g.subject}</Badge>
                    <Badge color="#718096">{g.grade}</Badge>
                  </div>
                </div>
                {g.pending > 0 && (
                  <span className="font-black text-xs px-2.5 py-1 rounded-full shrink-0"
                    style={{ background: "rgba(220,38,38,0.15)", color: "#F87171", border: "1px solid rgba(220,38,38,0.3)" }}>
                    ⚠ {g.pending} to mark
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3 mt-4">
                {[
                  { icon: "👥", val: g.members, lbl: "Students" },
                  { icon: "📝", val: g.exercises, lbl: "Exercises" },
                  { icon: "📅", val: g.nextClass, lbl: "Next Class" },
                ].map(({ icon, val, lbl }) => (
                  <div key={lbl} className="p-3 rounded-xl text-center"
                    style={{ background: "rgba(255,255,255,0.03)" }}>
                    <p className="text-lg">{icon}</p>
                    <p className="font-black text-white text-sm mt-0.5">{val}</p>
                    <p className="text-white/30 text-[10px]">{lbl}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mt-4">
                {["View Students", "Add Exercise", "Schedule Class"].map(a => (
                  <button key={a} className="flex-1 py-2 rounded-xl text-[11px] font-black transition-all hover:opacity-80"
                    style={{ background: `${g.color}15`, color: g.color, border: `1px solid ${g.color}35` }}>
                    {a}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}