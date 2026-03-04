import React from "react";


export default function BtnPrimary({ children, className = "", style = {}, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`font-semibold text-white transition-all duration-200
        hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(232,74,12,0.45)] ${className}`}
      style={{
        background: "linear-gradient(135deg, #E84A0C 0%, #c73d09 100%)",
        border: "none",
        cursor: "pointer",
        letterSpacing: ".4px",
        clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
        ...style,
      }}
    >
      {children}
    </button>
  );
}