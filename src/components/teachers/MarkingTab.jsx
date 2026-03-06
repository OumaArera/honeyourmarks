import { useState } from "react";
import { STATS, PENDING_MARKS } from "../../data/teacher.dashboard.data";
import SectionTitle from "./SectionTitle";
import LevelTag from "./LevelTag";



export default function MarkingTab() {
  const [selected, setSelected] = useState(null);

  if (selected) {
    const m = PENDING_MARKS.find(x => x.id === selected);
    return (
      <div className="space-y-6">
        <button onClick={() => setSelected(null)}
          className="flex items-center gap-2 text-sm font-black transition-all hover:opacity-70"
          style={{ color: "#0D9488" }}>
          ← Back to Queue
        </button>

        <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(13,148,136,0.25)" }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
              style={{ background: "rgba(13,148,136,0.15)" }}>{m.avatar}</div>
            <div>
              <p className="font-black text-white">{m.student}</p>
              <p className="text-white/40 text-xs">{m.exercise}</p>
            </div>
            <span className="ml-auto text-white/30 text-xs">{m.submitted}</span>
          </div>

          {/* Simulated submission content */}
          <div className="rounded-xl p-4 mb-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <p className="text-white/50 text-xs font-black uppercase tracking-widest mb-3">Student Submission</p>
            <div className="space-y-3">
              {["Q1: Solve 2x² + 5x - 3 = 0", "Q2: Find the vertex of y = x² - 4x + 3", "Q3: Sketch the parabola y = -x² + 2x"].map((q, i) => (
                <div key={i} className="p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <p className="text-white/60 text-xs font-bold mb-1">{q}</p>
                  <p className="text-white/40 text-xs">Student answer appears here...</p>
                </div>
              ))}
            </div>
          </div>

          {/* Marking controls */}
          <div className="space-y-3">
            <p className="text-white/50 text-xs font-black uppercase tracking-widest">Assign Level</p>
            <div className="grid grid-cols-3 gap-2">
              {["beginner", "intermediate", "expert"].map(l => (
                <button key={l} className="py-3 rounded-xl font-black text-xs capitalize transition-all hover:opacity-80"
                  style={l === "intermediate"
                    ? { background: "#0891B2", color: "#fff" }
                    : { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.09)" }}>
                  <LevelTag level={l} />
                </button>
              ))}
            </div>

            <p className="text-white/50 text-xs font-black uppercase tracking-widest mt-4">Feedback</p>
            <div className="w-full rounded-xl p-3 text-sm text-white/60 h-24 resize-none"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", outline: "none" }}>
              <p className="text-white/25 text-xs">Type teacher feedback here...</p>
            </div>

            <button className="w-full py-3 rounded-xl font-black text-sm"
              style={{ background: "linear-gradient(135deg,#0D9488,#0891B2)", color: "#fff" }}>
              Submit Mark & Feedback
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionTitle icon="⚑" title="Marking Queue"
        subtitle={`${PENDING_MARKS.length} submissions awaiting feedback`} color="#DC2626" />

      {/* Urgent banner */}
      <div className="rounded-2xl p-4 flex items-center gap-3"
        style={{ background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.25)" }}>
        <span className="text-2xl">⚠</span>
        <div>
          <p className="text-red-400 font-black text-sm">{STATS.pendingMarking} total submissions pending</p>
          <p className="text-red-400/50 text-xs">Students are waiting for feedback to progress</p>
        </div>
      </div>

      <div className="space-y-3">
        {PENDING_MARKS.map(m => (
          <div key={m.id} className="p-4 rounded-2xl flex items-center gap-3 cursor-pointer transition-all hover:border-teal-500/30"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
            onClick={() => setSelected(m.id)}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0"
              style={{ background: "rgba(13,148,136,0.15)" }}>{m.avatar}</div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-white text-sm">{m.student}</p>
              <p className="text-white/35 text-xs truncate">{m.exercise}</p>
              <p className="text-white/25 text-[10px] mt-0.5">{m.subject} · Submitted {m.submitted}</p>
            </div>
            <button className="px-3 py-2 rounded-xl text-xs font-black shrink-0 transition-all hover:opacity-80"
              style={{ background: "rgba(13,148,136,0.2)", color: "#2DD4BF", border: "1px solid rgba(13,148,136,0.35)" }}>
              Mark →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}