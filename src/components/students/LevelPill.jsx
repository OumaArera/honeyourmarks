import React from "react";


export default function LevelPill({ level, color, count }) {
  const config = {
    beginner: { emoji: "🌱", label: "Beginner", bg: "#2E8B2A" },
    intermediate: { emoji: "⚡", label: "Intermediate", bg: "#1B7FC4" },
    expert: { emoji: "🔥", label: "Expert", bg: "#E84A0C" },
    scout: { emoji: "🔭", label: "Scout", bg: "#2E8B2A" },
    explorer: { emoji: "🗺️", label: "Explorer", bg: "#1B7FC4" },
    legend: { emoji: "👑", label: "Legend", bg: "#E84A0C" },
  }[level] || { emoji: "⭐", label: level, bg: "#718096" };
  const c = color || config.bg;
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-white text-xs font-bold"
      style={{ background: `${c}22`, border: `1px solid ${c}55`, color: c }}>
      {config.emoji} {config.label}: <span className="text-white font-black">{count}</span>
    </div>
  );
}