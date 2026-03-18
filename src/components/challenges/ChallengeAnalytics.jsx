import { useEffect, useState } from "react";
import { getData } from "../../api/api.service";

function StatCard({ label, value, icon, colorClass }) {
  return (
    <div className="rounded-2xl p-4 flex flex-col gap-1 bg-white/4 border border-white/[0.07]">
      <span className="text-xl">{icon}</span>
      <span className={`text-2xl font-black ${colorClass}`}>{value ?? "—"}</span>
      <span className="text-xs font-bold uppercase tracking-widest text-white/35">{label}</span>
    </div>
  );
}

export default function ChallengeAnalytics({ challengeId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!challengeId) return;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const res = await getData(`challenge/${challengeId}/analytics/`);
        if (res?.error) throw new Error(res.error);
        setData(res);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [challengeId]);

  if (loading)
    return (
      <div className="grid grid-cols-2 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 rounded-2xl animate-pulse bg-white/5" />
        ))}
      </div>
    );

  if (error) return <p className="text-xs text-red-400">{error}</p>;

  const progress = data?.average_progress ?? 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Total Students" value={data?.total_students} icon="👥" colorClass="text-blue-400" />
        <StatCard label="Approved"       value={data?.approved}       icon="✅" colorClass="text-emerald-400" />
        <StatCard label="Pending"        value={data?.pending}        icon="⏳" colorClass="text-amber-400" />
        <StatCard label="Completed"      value={data?.completed}      icon="🏁" colorClass="text-violet-400" />
      </div>

      <div className="rounded-2xl p-4 space-y-2 bg-white/4 border border-white/[0.07]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-widest text-white/35">Avg. Progress</span>
          <span className="text-sm font-black text-white">{progress.toFixed(1)}%</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden bg-white/8">
          <div
            className="h-full rounded-full bg-linear-to-r from-blue-700 to-blue-400 transition-all duration-500"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}