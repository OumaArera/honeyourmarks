import React from "react";


export default function PublishButton({
  onClick,
  disabled,
  submitting,
  label = "Publish Note →",
  className = "",
  style: styleProp = {},
}) {
  const active = !disabled && !submitting;

  return (
    <button
      onClick={onClick}
      disabled={disabled || submitting}
      className={`flex items-center justify-center gap-2 font-black transition-all duration-200
        disabled:opacity-30 disabled:cursor-not-allowed ${className}`}
      style={{
        background: active ? "linear-gradient(135deg,#B45309,#D97706)" : "rgba(255,255,255,0.07)",
        color:      active ? "#fff" : "rgba(255,255,255,0.35)",
        boxShadow:  active ? "0 4px 20px rgba(180,83,9,0.4)" : "none",
        ...styleProp,
      }}
    >
      {submitting ? (
        <>
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Saving…
        </>
      ) : label}
    </button>
  );
}
