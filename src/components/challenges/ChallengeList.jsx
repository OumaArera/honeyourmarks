import { useEffect, useState } from "react";
import { getData } from "../../api/api.service";

export default function ChallengeList({ onSelect, onError }) {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await getData("challenges/");
        if (res?.error) throw new Error(res.error);
        setChallenges(res?.results ?? []);
      } catch (err) {
        onError?.(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading)
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 rounded-2xl animate-pulse bg-white/5" />
        ))}
      </div>
    );

  if (challenges.length === 0)
    return (
      <div className="rounded-2xl p-8 text-center bg-white/3 border border-dashed border-white/10">
        <p className="text-3xl mb-2">🏆</p>
        <p className="text-sm font-bold text-white">No challenges yet</p>
        <p className="text-xs mt-1 text-white/35">
          Switch to the Create tab to publish your first challenge.
        </p>
      </div>
    );

  return (
    <div className="space-y-3">
      {challenges.map((c) => {
        const filled = c.days?.filter((d) => d.assignments?.length > 0).length ?? 0;
        const total = c.duration_days ?? c.days?.length ?? 0;
        const daysSetUp = c.days?.length ?? 0;
        const pct = total > 0 ? Math.round((daysSetUp / total) * 100) : 0;

        return (
          <button
            key={c.id}
            onClick={() => onSelect(c)}
            className="w-full text-left rounded-2xl p-4 transition-all group bg-white/3 border border-white/10 hover:border-blue-500/40 hover:bg-blue-950/20"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-white group-hover:text-blue-400 transition-colors truncate">
                  {c.title}
                </p>
                <p className="text-xs mt-0.5 line-clamp-2 text-white/40">{c.description}</p>
              </div>
              <span className="shrink-0 text-xs font-black px-2.5 py-1 rounded-xl bg-blue-500/15 text-blue-400">
                {total}d
              </span>
            </div>

            <div className="mt-3 space-y-1.5">
              <div className="flex justify-between text-xs text-white/30">
                <span>{daysSetUp}/{total} days set up · {filled} with assignments</span>
                <span>{pct}%</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden bg-white/[0.07]">
                <div
                  className="h-full rounded-full bg-linear-to-r from-blue-700 to-blue-400 transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}