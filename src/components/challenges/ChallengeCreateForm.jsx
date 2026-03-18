import { useEffect, useState } from "react";
import { getData, createData } from "../../api/api.service";

export default function ChallengeCreateForm({ onSuccess, onError }) {
  const [subjects, setSubjects] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    subject: "",
    title: "",
    description: "",
    duration_days: "",
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await getData("subjects/");
        if (res?.error) throw new Error(res.error);
        setSubjects(res?.results ?? []);
      } catch (err) {
        onError?.(err.message);
      } finally {
        setLoadingSubjects(false);
      }
    })();
  }, []);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async () => {
    const { subject, title, description, duration_days } = form;
    if (!subject || !title || !description || !duration_days) {
      onError?.("Please fill in all fields.");
      return;
    }
    const days = parseInt(duration_days, 10);
    if (isNaN(days) || days < 1 || days > 365) {
      onError?.("Duration must be between 1 and 365 days.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await createData("challenges/", { subject, title, description, duration_days: days });
      if (res?.error) throw new Error(res.error);
      setForm({ subject: "", title: "", description: "", duration_days: "" });
      // Pass the full created challenge object so the parent can jump into it
      onSuccess?.("Challenge created! Now set up your days below.", res);
    } catch (err) {
      onError?.(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls =
    "w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-all bg-white/5 border border-white/10 placeholder-white/25 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20";

  return (
    <div className="rounded-2xl p-6 space-y-5 bg-white/3 border border-white/[0.07]">
      <h3 className="text-white font-black text-base tracking-tight">Challenge Details</h3>

      {/* Subject */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-widest text-white/35">Subject</label>
        {loadingSubjects ? (
          <div className="h-11 rounded-xl animate-pulse bg-white/5" />
        ) : (
          <select
            value={form.subject}
            onChange={set("subject")}
            className={inputCls}
            style={{ colorScheme: "dark" }}
          >
            <option value="" style={{ background: "#111827" }}>— Select a subject —</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id} style={{ background: "#111827" }}>{s.name}</option>
            ))}
          </select>
        )}
      </div>

      {/* Title */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-widest text-white/35">Title</label>
        <input type="text" placeholder="e.g. 5-Day Reading Challenge" value={form.title} onChange={set("title")} className={inputCls} />
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-widest text-white/35">Description</label>
        <textarea rows={3} placeholder="What is this challenge about?" value={form.description} onChange={set("description")} className={`${inputCls} resize-none`} />
      </div>

      {/* Duration */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-widest text-white/35">Duration (days)</label>
        <input type="number" min={1} max={365} placeholder="e.g. 5" value={form.duration_days} onChange={set("duration_days")} className={inputCls} />
      </div>

      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full py-3 rounded-xl text-sm font-black transition-all duration-150 disabled:opacity-50 bg-linear-to-br from-blue-700 to-blue-500 text-white shadow-lg shadow-blue-900/30"
      >
        {submitting ? "Creating…" : "🚀 Create Challenge"}
      </button>
    </div>
  );
}