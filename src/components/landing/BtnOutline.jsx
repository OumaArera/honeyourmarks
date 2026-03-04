import React from "react";


export default function BtnOutline({ children, className = "" }) {
  return (
    <button
      className={`font-body font-medium text-[#FDF8F2] transition-all duration-200
        border border-[rgba(253,248,242,0.45)]
        hover:border-[#FDF8F2] hover:bg-[rgba(253,248,242,0.08)] ${className}`}
      style={{ background: "transparent", cursor: "pointer", letterSpacing: ".4px" }}
    >
      {children}
    </button>
  );
}

