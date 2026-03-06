import React from "react";
import { GROUPS } from "../../data/dashboard.data";
import SectionHeader from "./SectionHeader";


export default function GroupsTab() {
  return (
    <div className="space-y-6">
      <SectionHeader icon="👥" title="My Groups" subtitle="Teacher-curated study groups" accent="#2E8B2A" />
      <div className="space-y-3">
        {GROUPS.map(g => (
          <div key={g.id} className="p-5 rounded-2xl"
            style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${g.color}33` }}>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                style={{ background: `${g.color}20`, border: `1px solid ${g.color}40` }}>
                {g.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-white">{g.name}</p>
                <p className="text-white/40 text-sm mt-0.5">{g.teacher}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-white/30">👤 {g.members} members</span>
                  <span className="text-xs font-semibold" style={{ color: g.color }}>📅 {g.nextClass}</span>
                </div>
              </div>
              <button className="px-4 py-2 rounded-xl text-xs font-bold shrink-0"
                style={{ background: `${g.color}20`, color: g.color, border: `1px solid ${g.color}40` }}>
                Open →
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-5 rounded-2xl text-center"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(255,255,255,0.1)" }}>
        <p className="text-3xl mb-2">🤝</p>
        <p className="text-white/50 text-sm">Not in a group yet? Your teacher will add you.</p>
        <p className="text-white/25 text-xs mt-1">Groups are created by teacher-admins</p>
      </div>
    </div>
  );
}