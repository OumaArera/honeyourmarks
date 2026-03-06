import { useEffect } from "react";

export default function Toast({ toast, onDismiss }) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onDismiss, 4000);
    return () => clearTimeout(t);
  }, [toast, onDismiss]);

  if (!toast) return null;

  const map = {
    success: { bg: "rgba(13,148,136,0.15)", border: "rgba(45,212,191,0.35)",  color: "#2DD4BF", icon: "✓" },
    error:   { bg: "rgba(220,38,38,0.12)",  border: "rgba(248,113,113,0.35)", color: "#F87171", icon: "✕" },
  };
  const s = map[toast.type] || map.success;

  return (
    <>
      <style>{`@keyframes _toast-in{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}}`}</style>
      <div className="fixed top-6 right-6 flex items-start gap-3 rounded-2xl px-5 py-4 shadow-2xl"
        style={{ background: s.bg, border: `1px solid ${s.border}`, maxWidth: 380, zIndex: 9998,
          animation: "_toast-in 0.3s cubic-bezier(.34,1.56,.64,1)" }}>
        <span className="text-lg font-black mt-0.5" style={{ color: s.color }}>{s.icon}</span>
        <div className="flex-1">
          <p className="font-black text-sm text-white">{toast.title}</p>
          {toast.message && <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.55)" }}>{toast.message}</p>}
        </div>
        <button onClick={onDismiss} className="text-white/30 hover:text-white/70 text-xl leading-none">×</button>
      </div>
    </>
  );
}