import React from "react";

export default function ProgressBar({ value, max, color }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
      <div className="h-full rounded-full transition-all duration-700"
        style={{ width: `${pct}%`, background: color, boxShadow: `0 0 8px ${color}55` }} />
    </div>
  );
}