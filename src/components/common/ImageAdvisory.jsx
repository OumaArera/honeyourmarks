import { useState } from "react";


export default function ImageAdvisory() {
  const [open, setOpen] = useState(true);
  if (!open) return null;
  return (
    <div className="flex items-start gap-3 rounded-xl px-4 py-3"
      style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)" }}>
      <span className="text-base mt-0.5">💡</span>
      <div className="flex-1 text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
        <span className="font-black" style={{ color: "#F59E0B" }}>Image storage: </span>
        Images insert as <span className="font-bold text-white/70">base64</span> by default — fine for drafts, but
        bloats large payloads. For production, wire the{" "}
        <code className="px-1 rounded" style={{ background: "rgba(255,255,255,0.08)" }}>imageHandler</code> in{" "}
        <code className="px-1 rounded" style={{ background: "rgba(255,255,255,0.08)" }}>RichEditor.jsx</code>{" "}
        to upload to your backend/S3 and store only the returned URL.
      </div>
      <button onClick={() => setOpen(false)} className="text-white/20 hover:text-white/60 text-base leading-none shrink-0">×</button>
    </div>
  );
}