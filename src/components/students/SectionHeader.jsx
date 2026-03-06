import React from "react";


export default function SectionHeader({ icon, title, subtitle, accent = "#E84A0C" }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
        style={{ background: `${accent}22`, border: `1px solid ${accent}44` }}>
        {icon}
      </div>
      <div>
        <h2 className="font-black text-xl text-white leading-tight">{title}</h2>
        {subtitle && <p className="text-white/40 text-xs mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}