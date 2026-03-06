import React from "react";


export default function XpBar({ current, max }) {
  const pct = Math.round((current / max) * 100);
  return (
    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${pct}%`, background: "linear-gradient(90deg,#E84A0C,#f97316)" }}
      />
    </div>
  );
}