import { useState } from "react";
import { EXAMS } from "../../data/teacher.dashboard.data";
import Badge from "../../components/teachers/Badge";
import SectionTitle from "./SectionTitle";
import LevelTag from "./LevelTag";


export default function ExamsTab() {
  return (
    <div className="space-y-6">
      <SectionTitle icon="◈" title="Exams" subtitle="Scout · Explorer · Legend tiers" action="+ Create Exam" color="#B45309" />

      <div className="space-y-4">
        {EXAMS.map(e => (
          <div key={e.id} className="rounded-2xl overflow-hidden"
            style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${e.color}30` }}>
            <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg,${e.color},transparent)` }} />
            <div className="p-5">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h3 className="font-black text-white text-base">{e.title}</h3>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    <Badge color={e.color}>{e.subject}</Badge>
                    <Badge color="#718096">{e.grade}</Badge>
                    <LevelTag level={e.level} />
                  </div>
                </div>
                <span className="text-[10px] font-black px-2.5 py-1 rounded-full shrink-0"
                  style={e.published
                    ? { background: "rgba(13,148,136,0.15)", color: "#2DD4BF", border: "1px solid rgba(13,148,136,0.3)" }
                    : { background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.12)" }}>
                  {e.published ? "● Published" : "○ Draft"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 rounded-xl text-center" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <p className="font-black text-white text-xl">{e.attempts}</p>
                  <p className="text-white/30 text-[10px] mt-0.5">Attempts</p>
                </div>
                <div className="p-3 rounded-xl text-center" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <p className="font-black text-xl" style={{ color: e.color }}>{e.avgScore}%</p>
                  <p className="text-white/30 text-[10px] mt-0.5">Avg Score</p>
                </div>
              </div>

              <div className="flex gap-2">
                {["Edit", "Results", e.published ? "Unpublish" : "Publish"].map(a => (
                  <button key={a} className="flex-1 py-2 rounded-xl text-[11px] font-black transition-all hover:opacity-80"
                    style={a === "Publish" || a === "Unpublish"
                      ? { background: `${e.color}20`, color: e.color, border: `1px solid ${e.color}40` }
                      : { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.45)", border: "1px solid rgba(255,255,255,0.09)" }}>
                    {a}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}