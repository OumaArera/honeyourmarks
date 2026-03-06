import React from "react";


export default function SectionTitle({ icon, title, subtitle, action, onAction, color = "#0D9488" }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-black"
        style={{ background: `${color}18`, border: `1px solid ${color}35`, color }}>
        {icon}
      </div>
      <div className="flex-1">
        <h2 className="text-white font-black text-xl leading-tight">{title}</h2>
        {subtitle && <p className="text-white/35 text-xs mt-0.5">{subtitle}</p>}
      </div>
      {action && (
        <button onClick={onAction}
          className="px-4 py-2 rounded-xl text-xs font-black tracking-wider uppercase transition-all duration-200 hover:opacity-80"
          style={{ background: `${color}20`, color, border: `1px solid ${color}40` }}>
          {action}
        </button>
      )}
    </div>
  );
}