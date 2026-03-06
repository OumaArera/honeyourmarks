import React from "react";
import { STUDENT, GROUPS } from "../../data/dashboard.data";
import XpBar from "./XpBar";
import LevelBadge from "./LevelBadge";
import SectionHeader from "./SectionHeader";


export default function ProfileTab() {
  return (
    <div className="space-y-6">
      <SectionHeader icon="⚙️" title="My Profile" subtitle="Your academic identity" accent="#9B6B2A" />

      {/* Avatar + level */}
      <div className="p-6 rounded-2xl text-center"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-3"
          style={{ background: "rgba(232,74,12,0.2)", border: "2px solid rgba(232,74,12,0.5)" }}>
          {STUDENT.avatar}
        </div>
        <h2 className="font-black text-white text-2xl">{STUDENT.name}</h2>
        <p className="text-white/40 text-sm mt-1">{STUDENT.grade} · {STUDENT.badge}</p>
        <div className="flex items-center justify-center gap-3 mt-3">
          <LevelBadge level={STUDENT.level} size="lg" />
          <div className="text-left">
            <p className="text-white font-bold text-sm">Level {STUDENT.level}</p>
            <p className="text-white/40 text-xs">{STUDENT.xp}/{STUDENT.nextLevelXp} XP</p>
          </div>
        </div>
        <div className="mt-4 px-6">
          <XpBar current={STUDENT.xp} max={STUDENT.nextLevelXp} />
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2">
        {[
          { icon: "🔥", label: "Current Streak", value: `${STUDENT.streak} days` },
          { icon: "⚡", label: "Total XP", value: `${STUDENT.xp.toLocaleString()} XP` },
          { icon: "🏅", label: "Badge", value: STUDENT.badge },
          { icon: "📚", label: "Grade", value: STUDENT.grade },
          { icon: "👥", label: "Groups Joined", value: `${GROUPS.length} groups` },
        ].map(({ icon, label, value }) => (
          <div key={label} className="flex items-center gap-4 p-4 rounded-xl"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <span className="text-xl w-8 text-center">{icon}</span>
            <span className="text-white/50 text-sm flex-1">{label}</span>
            <span className="font-bold text-white text-sm">{value}</span>
          </div>
        ))}
      </div>

      <button className="w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-200 hover:opacity-80"
        style={{ background: "rgba(232,74,12,0.1)", border: "1px solid rgba(232,74,12,0.3)", color: "#f97316" }}>
        Change Password
      </button>
    </div>
  );
}
