import { useState } from "react";
import { EXERCISES } from "../../data/teacher.dashboard.data";
import Badge from "./Badge";
import SectionTitle from "./SectionTitle";
import LevelTag from "./LevelTag";
import ProgressBar from "./ProgressBar";


export default function ExercisesTab() {
  const [view, setView] = useState("all");

  const dueColor = { Today: "#B45309", Tomorrow: "#0891B2", Done: "#0D9488", Overdue: "#DC2626" };

  return (
    <div className="space-y-6">
      <SectionTitle icon="◧" title="Exercises" subtitle="Topic-based student exercises" action="+ Create" color="#7C3AED" />

      <div className="flex gap-2">
        {["all", "pending", "done"].map(v => (
          <button key={v} onClick={() => setView(v)}
            className="px-4 py-2 rounded-xl text-xs font-black tracking-wider uppercase transition-all"
            style={view === v ? { background: "#7C3AED", color: "#fff" } : { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.09)" }}>
            {v}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {EXERCISES
          .filter(e => view === "all" ? true : view === "done" ? e.marked === e.submissions : e.marked < e.submissions)
          .map(e => {
            const pct = Math.round((e.marked / e.submissions) * 100);
            const dc = dueColor[e.dueDate] || "#718096";
            return (
              <div key={e.id} className="p-4 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${e.color}25` }}>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-white text-sm">{e.title}</p>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      <Badge color={e.color}>{e.subject}</Badge>
                      <Badge color="#718096">{e.grade}</Badge>
                      <LevelTag level={e.level} />
                    </div>
                  </div>
                  <span className="text-xs font-black px-2.5 py-1 rounded-full shrink-0"
                    style={{ background: `${dc}18`, color: dc, border: `1px solid ${dc}35` }}>
                    {e.dueDate}
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-2">
                  <span className="text-white/40 text-xs">{e.marked}/{e.submissions} marked</span>
                  <span className="font-black text-xs ml-auto" style={{ color: e.color }}>{pct}%</span>
                </div>
                <ProgressBar value={e.marked} max={e.submissions} color={e.color} />

                <div className="flex gap-2 mt-3">
                  {e.marked < e.submissions && (
                    <button className="flex-1 py-1.5 rounded-lg text-[10px] font-black"
                      style={{ background: "rgba(220,38,38,0.12)", color: "#F87171", border: "1px solid rgba(220,38,38,0.25)" }}>
                      ⚑ Mark ({e.submissions - e.marked})
                    </button>
                  )}
                  <button className="flex-1 py-1.5 rounded-lg text-[10px] font-black"
                    style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.09)" }}>
                    Edit
                  </button>
                  <button className="flex-1 py-1.5 rounded-lg text-[10px] font-black"
                    style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.09)" }}>
                    Results
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}