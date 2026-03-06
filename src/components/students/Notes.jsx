import { useState } from "react";
import { NOTES_STATS } from "../../data/dashboard.data";
import SectionHeader from "./SectionHeader";
import LevelPill from "./LevelPill";


export default function NotesTab() {
  const [view, setView] = useState("overview");
  const o = NOTES_STATS.overall;

  return (
    <div className="space-y-6">
      <SectionHeader icon="📝" title="Notes & Exercises" subtitle="Topic-based exercises with teacher marking" accent="#1B7FC4" />

      {/* Overall pills */}
      <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-4">Overall Performance</p>
        <div className="flex flex-wrap gap-2 mb-4">
          <LevelPill level="beginner" count={o.beginner_count} />
          <LevelPill level="intermediate" count={o.intermediate_count} />
          <LevelPill level="expert" count={o.expert_count} />
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: "📤", val: o.total_submissions, lbl: "Submitted", c: "#FDF8F2" },
            { icon: "✅", val: o.marked_count, lbl: "Marked", c: "#4ade80" },
            { icon: "💬", val: o.commented_count, lbl: "Commented", c: "#60a5fa" },
          ].map(({ icon, val, lbl, c }) => (
            <div key={lbl} className="text-center p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
              <div className="text-xl mb-1">{icon}</div>
              <div className="font-black text-xl" style={{ color: c }}>{val}</div>
              <div className="text-[10px] text-white/40 mt-0.5">{lbl}</div>
            </div>
          ))}
        </div>
        {o.unmarked_count > 0 && (
          <div className="mt-3 p-3 rounded-xl flex items-center gap-2"
            style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.3)" }}>
            <span className="text-lg">⏳</span>
            <span className="text-yellow-300 text-sm font-semibold">{o.unmarked_count} exercise(s) awaiting marking</span>
          </div>
        )}
      </div>

      {/* View toggle */}
      <div className="flex gap-2">
        {["overview", "by-subject", "by-topic"].map(v => (
          <button key={v} onClick={() => setView(v)}
            className="px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 capitalize"
            style={view === v ? { background: "#1B7FC4", color: "#fff" } : { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}>
            {v.replace("-", " ")}
          </button>
        ))}
      </div>

      {view === "by-subject" && (
        <div className="space-y-3">
          {NOTES_STATS.per_subject.map(s => {
            const pct = Math.round((s.marked_count / s.total_submissions) * 100);
            const colors = { English: "#1B7FC4", Mathematics: "#E84A0C", Chemistry: "#2E8B2A" };
            const c = colors[s.subject_name] || "#718096";
            return (
              <div key={s.subject_name} className="p-4 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${c}33` }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-white">{s.subject_name}</span>
                  <span className="font-black text-sm px-2.5 py-1 rounded-full" style={{ background: `${c}22`, color: c }}>{pct}% marked</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  <LevelPill level="beginner" count={s.beginner_count} />
                  <LevelPill level="intermediate" count={s.intermediate_count} />
                  <LevelPill level="expert" count={s.expert_count} />
                </div>
                <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: c }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {view === "by-topic" && (
        <div className="space-y-3">
          {NOTES_STATS.per_topic.map(t => {
            const pct = Math.round((t.marked_count / t.total_submissions) * 100);
            const colors = { English: "#1B7FC4", Mathematics: "#E84A0C", Chemistry: "#2E8B2A" };
            const c = colors[t.subject_name] || "#718096";
            return (
              <div key={`${t.subject_name}-${t.topic_name}`} className="p-4 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="font-bold text-white text-sm">{t.topic_name}</p>
                    <p className="text-xs mt-0.5" style={{ color: c }}>{t.subject_name}</p>
                  </div>
                  <span className="font-black text-xs px-2 py-1 rounded-full shrink-0" style={{ background: `${c}22`, color: c }}>{pct}%</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {t.beginner_count > 0 && <LevelPill level="beginner" count={t.beginner_count} />}
                  {t.intermediate_count > 0 && <LevelPill level="intermediate" count={t.intermediate_count} />}
                  {t.expert_count > 0 && <LevelPill level="expert" count={t.expert_count} />}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {view === "overview" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl" style={{ background: "rgba(46,139,42,0.1)", border: "1px solid rgba(46,139,42,0.25)" }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#4ade80" }}>🌱 Beginner Level</p>
            <p className="font-black text-4xl text-white">{o.beginner_count}</p>
            <p className="text-white/40 text-sm mt-1">exercises completed</p>
          </div>
          <div className="p-5 rounded-2xl" style={{ background: "rgba(27,127,196,0.1)", border: "1px solid rgba(27,127,196,0.25)" }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#60a5fa" }}>⚡ Intermediate Level</p>
            <p className="font-black text-4xl text-white">{o.intermediate_count}</p>
            <p className="text-white/40 text-sm mt-1">exercises completed</p>
          </div>
          <div className="p-5 rounded-2xl col-span-full" style={{ background: "rgba(232,74,12,0.1)", border: "1px solid rgba(232,74,12,0.25)" }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#f97316" }}>🔥 Expert Level</p>
            <p className="font-black text-4xl text-white">{o.expert_count}</p>
            <p className="text-white/40 text-sm mt-1">exercises mastered — you're on fire!</p>
          </div>
        </div>
      )}
    </div>
  );
}