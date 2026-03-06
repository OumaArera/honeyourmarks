import React from "react";

export default function Field({ label, hint, required, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-2 text-xs font-black tracking-widest uppercase"
        style={{ color: "rgba(255,255,255,0.45)" }}>
        {label}
        {required && <span style={{ color: "#B45309" }}>*</span>}
        {hint && <span className="ml-auto text-[10px] font-medium normal-case tracking-normal"
          style={{ color: "rgba(255,255,255,0.25)" }}>{hint}</span>}
      </label>
      {children}
    </div>
  );
}