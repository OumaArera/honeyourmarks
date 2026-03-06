import React from "react";


export default function LevelBadge({ level, size = "sm" }) {
  const s = size === "lg" ? "w-12 h-12 text-lg" : "w-7 h-7 text-xs";
  return (
    <div className={`${s} rounded-full flex items-center justify-center font-black`}
      style={{ background: "linear-gradient(135deg,#E84A0C,#f97316)", boxShadow: "0 0 12px rgba(232,74,12,0.5)" }}>
      {level}
    </div>
  );
}