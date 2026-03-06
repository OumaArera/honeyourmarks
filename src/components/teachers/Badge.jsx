import React from "react";


export default function Badge({ children, color = "#0D9488" }) {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-black tracking-widest uppercase"
      style={{ background: `${color}20`, color, border: `1px solid ${color}40` }}>
      {children}
    </span>
  );
}