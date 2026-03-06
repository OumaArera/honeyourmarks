import { useState } from "react";
import { EXAM_STATS } from "../../data/dashboard.data";
import SectionHeader from "./SectionHeader";
import LevelPill from "./LevelPill";


export default function ExamsTab() {
  const [view, setView] = useState("overview");
  const o = EXAM_STATS.overall;

  return (
    <div className="space-y-6">
      <SectionHeader icon="🏆" title="Examination Materials" subtitle="Test yourself — Scout · Explorer · Legend" accent="#E84A0C" />

      {/* Overall scorecard */}
      <div className="rounded-2xl p-5 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg,#1B2F4E,#0F1E35)", border: "1px solid rgba(255,255,255,0.1)" }}>
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full -translate-y-1/2 translate-x-1/2"
          style={{ background: "radial-gradient(circle,rgba(232,74,12,0.2),transparent)" }} />
        <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-4">Overall Exam Stats</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10">
          {[
            { icon: "📤", val: o.total_submissions, lbl: "Total Attempts" },
            { icon: "✅", val: o.marked_submissions, lbl: "Marked" },
            { icon: "🔭", val: o.scout_count, lbl: "Scout" },
            { icon: "👑", val: o.legend_count, lbl: "Legend" },
          ].map(({ icon, val, lbl }) => (
            <div key={lbl} className="text-center p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.05)" }}>
              <div className="text-xl mb-1">{icon}</div>
              <div className="font-black text-2xl text-white">{val}</div>
              <div className="text-[10px] text-white/40">{lbl}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 relative z-10">
          {[
            { level: "scout", avg: o.scout_avg_score, color: "#2E8B2A" },
            { level: "explorer", avg: o.explorer_avg_score, color: "#1B7FC4" },
            { level: "legend", avg: o.legend_avg_score, color: "#E84A0C" },
          ].map(({ level, avg, color }) => (
            <div key={level} className="p-3 rounded-xl text-center"
              style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
              <LevelPill level={level} count="" color={color} />
              <p className="font-black text-xl mt-2" style={{ color }}>{avg ? `${avg}%` : "—"}</p>
              <p className="text-[10px] text-white/40">avg score</p>
            </div>
          ))}
        </div>
      </div>

      {/* View toggle */}
      <div className="flex gap-2">
        {["overview", "by-grade", "by-subject"].map(v => (
          <button key={v} onClick={() => setView(v)}
            className="px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 capitalize"
            style={view === v ? { background: "#E84A0C", color: "#fff" } : { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}>
            {v.replace("-", " ")}
          </button>
        ))}
      </div>

      {view === "by-grade" && (
        <div className="space-y-3">
          {EXAM_STATS.per_grade.map(g => (
            <div key={g.grade} className="p-4 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-white capitalize">{g.grade.replace("_", " ")}</span>
                <span className="font-black px-3 py-1 rounded-full text-sm"
                  style={{ background: "rgba(232,74,12,0.2)", color: "#f97316" }}>
                  Avg: {g.overall_avg_score}%
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {g.scout_count > 0 && <LevelPill level="scout" count={g.scout_count} />}
                {g.explorer_count > 0 && <LevelPill level="explorer" count={g.explorer_count} />}
                {g.legend_count > 0 && <LevelPill level="legend" count={g.legend_count} />}
              </div>
              <p className="text-white/30 text-xs mt-2">{g.total_submissions} total submissions</p>
            </div>
          ))}
        </div>
      )}

      {view === "by-subject" && (
        <div className="space-y-3">
          {EXAM_STATS.per_subject.map((s, i) => {
            const colors = { Mathematics: "#E84A0C", English: "#1B7FC4", Chemistry: "#2E8B2A" };
            const c = colors[s.subject_name] || "#718096";
            return (
              <div key={i} className="p-4 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${c}33` }}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-bold text-white text-sm">{s.subject_tag_name}</p>
                    <p className="text-xs mt-0.5 capitalize" style={{ color: c }}>{s.grade.replace("_", " ")}</p>
                  </div>
                  <span className="font-black text-sm px-2.5 py-1 rounded-full" style={{ background: `${c}22`, color: c }}>{s.avg_score}%</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {s.scout_count > 0 && <LevelPill level="scout" count={s.scout_count} />}
                  {s.explorer_count > 0 && <LevelPill level="explorer" count={s.explorer_count} />}
                  {s.legend_count > 0 && <LevelPill level="legend" count={s.legend_count} />}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {view === "overview" && (
        <div className="space-y-3">
          <div className="p-5 rounded-2xl" style={{ background: "rgba(46,139,42,0.1)", border: "1px solid rgba(46,139,42,0.25)" }}>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🔭</span>
              <div>
                <p className="font-bold text-white">Scout Level</p>
                <p className="text-white/40 text-xs">Foundation — build your base</p>
              </div>
              <span className="ml-auto font-black text-2xl" style={{ color: "#4ade80" }}>{o.scout_avg_score}%</span>
            </div>
            <p className="text-white/30 text-xs">{o.scout_count} exam(s) attempted at this level</p>
          </div>
          <div className="p-5 rounded-2xl" style={{ background: "rgba(27,127,196,0.1)", border: "1px solid rgba(27,127,196,0.25)" }}>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🗺️</span>
              <div>
                <p className="font-bold text-white">Explorer Level</p>
                <p className="text-white/40 text-xs">Intermediate — push the limits</p>
              </div>
              <span className="ml-auto font-black text-2xl" style={{ color: "#60a5fa" }}>{o.explorer_avg_score ?? "—"}%</span>
            </div>
            <p className="text-white/30 text-xs">{o.explorer_count} exam(s) attempted at this level</p>
          </div>
          <div className="p-5 rounded-2xl" style={{ background: "rgba(232,74,12,0.1)", border: "1px solid rgba(232,74,12,0.25)" }}>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">👑</span>
              <div>
                <p className="font-bold text-white">Legend Level</p>
                <p className="text-white/40 text-xs">Elite — top of the class</p>
              </div>
              <span className="ml-auto font-black text-2xl" style={{ color: "#f97316" }}>{o.legend_avg_score}%</span>
            </div>
            <p className="text-white/30 text-xs">{o.legend_count} exam(s) attempted at this level</p>
          </div>
        </div>
      )}
    </div>
  );
}