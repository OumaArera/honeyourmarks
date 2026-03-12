import { useEffect, useState } from "react";
import { getData, createData, patchData } from "../../api/api.service";

// ─────────────────────────────────────────────────────────────────────────────
// ── Constants
// ─────────────────────────────────────────────────────────────────────────────

const TIER_OPTIONS     = [{ value: "full", label: "Full Access" }, { value: "partial", label: "Partial Access" }];
const DURATION_OPTIONS = [{ value: "daily", label: "Daily" }, { value: "weekly", label: "Weekly" }, { value: "monthly", label: "Monthly" }, { value: "annual", label: "Annual" }];
const DURATION_META    = {
  daily:   { color: "#F59E0B", bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.2)"  },
  weekly:  { color: "#3B82F6", bg: "rgba(59,130,246,0.1)",  border: "rgba(59,130,246,0.2)"  },
  monthly: { color: "#10B981", bg: "rgba(16,185,129,0.1)",  border: "rgba(16,185,129,0.2)"  },
  annual:  { color: "#A855F7", bg: "rgba(168,85,247,0.1)",  border: "rgba(168,85,247,0.2)"  },
};
const ACCESS_FLAGS = [
  { key: "notes_access",           icon: "📚", label: "Notes"           },
  { key: "exercises_access",       icon: "✏️", label: "Exercises"       },
  { key: "exams_access",           icon: "📝", label: "Exams"           },
  { key: "virtual_classes_access", icon: "📡", label: "Virtual Classes" },
  { key: "submit_exam_questions_attempts", icon: "📝", label: "Submit Exams Attempt for Marking" },
  { key: "submit_exercise_attempts", icon: "✏️", label: "Submit Practice Exercise for Marking" },
];
const EMPTY_FORM = {
  name: "", tier: "full", duration: "monthly", price: "",
  currency: "KES", description: "",
  notes_access: true, exercises_access: true,
  exams_access: true, virtual_classes_access: true,
  active: true, submit_exam_questions_attempts: true,
  submit_exercise_attempts:true
};
const DONUT_COLORS = ["#10B981","#3B82F6","#F59E0B","#A855F7","#EF4444","#EC4899","#14B8A6"];

// ─────────────────────────────────────────────────────────────────────────────
// ── Shared atoms
// ─────────────────────────────────────────────────────────────────────────────

const inputCls   = "w-full rounded-xl px-3.5 py-2.5 text-sm text-white outline-none";
const inputStyle = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" };

function Spinner() {
  return <span className="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin inline-block" />;
}
function FieldLabel({ children, required }) {
  return (
    <label className="text-[10px] font-black tracking-widest uppercase block mb-1.5"
      style={{ color: "rgba(255,255,255,0.35)" }}>
      {children}{required && <span className="ml-1" style={{ color: "#10B981" }}>*</span>}
    </label>
  );
}
function Toggle({ checked, onChange, label }) {
  return (
    <button onClick={() => onChange(!checked)} type="button" className="flex items-center gap-2.5 w-full text-left">
      <div className="w-8 h-4.5 rounded-full relative shrink-0 transition-colors"
        style={{ background: checked ? "#10B981" : "rgba(255,255,255,0.15)" }}>
        <div className="absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white shadow transition-all"
          style={{ left: checked ? "calc(100% - 16px)" : "2px" }} />
      </div>
      <span className="text-sm font-bold" style={{ color: checked ? "#fff" : "rgba(255,255,255,0.4)" }}>{label}</span>
    </button>
  );
}
function fmtMoney(n) {
  if (n >= 1_000_000) return `${(n/1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n/1_000).toFixed(1)}K`;
  return (n ?? 0).toLocaleString("en-KE");
}
function fmtMonth(iso) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", year: "2-digit" });
}

// ─────────────────────────────────────────────────────────────────────────────
// ── StudentSearch
// ─────────────────────────────────────────────────────────────────────────────

function StudentSearch({ selected, onSelect }) {
  const [query,   setQuery]   = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open,    setOpen]    = useState(false);

  useEffect(() => {
    if (!query.trim()) { setResults([]); setOpen(false); return; }
    const t = setTimeout(async () => {
      setLoading(true);
      const res = await getData(`students/?search=${encodeURIComponent(query)}&page_size=10`);
      setResults(res?.results ?? []);
      setLoading(false);
      setOpen(true);
    }, 350);
    return () => clearTimeout(t);
  }, [query]);

  const pick = (s) => { onSelect(s); setOpen(false); setQuery(""); };

  if (selected) {
    return (
      <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl"
        style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.22)" }}>
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black shrink-0"
          style={{ background: "rgba(16,185,129,0.2)", color: "#6EE7B7" }}>
          {selected.first_name?.[0]}{selected.last_name?.[0]}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white truncate">{selected.first_name} {selected.last_name}</p>
          <p className="text-[10px] truncate" style={{ color: "rgba(255,255,255,0.35)" }}>
            {selected.admission_number} · {selected.current_school_level}
          </p>
        </div>
        <button onClick={() => onSelect(null)} className="text-lg leading-none hover:opacity-60"
          style={{ color: "rgba(255,255,255,0.35)" }}>×</button>
      </div>
    );
  }

  return (
    <div className="relative">
      <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
        onFocus={() => results.length > 0 && setOpen(true)}
        placeholder="Search by name or admission number…"
        className={inputCls} style={inputStyle} />
      {loading && <span className="absolute right-3 top-1/2 -translate-y-1/2"><Spinner /></span>}
      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 rounded-xl overflow-hidden z-50 max-h-52 overflow-y-auto"
          style={{ background: "#0d1a2e", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 12px 40px rgba(0,0,0,0.6)" }}>
          {results.map((s) => (
            <button key={s.id} onClick={() => pick(s)}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 text-left hover:bg-white/5 transition-all"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black shrink-0"
                style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}>
                {s.first_name?.[0]}{s.last_name?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{s.first_name} {s.last_name}</p>
                <p className="text-[10px] truncate" style={{ color: "rgba(255,255,255,0.35)" }}>
                  {s.admission_number} · {s.current_school_level}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── SubscriptionFormModal
// ─────────────────────────────────────────────────────────────────────────────

function SubscriptionFormModal({ plans, onClose, onSuccess }) {
  const [student,   setStudent]   = useState(null);
  const [planId,    setPlanId]    = useState("");
  const [startDate, setStartDate] = useState("");
  const [saving,    setSaving]    = useState(false);
  const [error,     setError]     = useState(null);

  const activePlans  = plans.filter((p) => p.active);
  const selectedPlan = activePlans.find((p) => p.id === planId) ?? null;
  const isValid      = student && planId;

  const handleSave = async () => {
    if (!isValid || saving) return;
    setSaving(true); setError(null);
    try {
      const payload = {
        student_id: student.id,
        plan_id:    planId,
        ...(startDate && { start_date: new Date(startDate).toISOString() }),
      };
      const res = await createData("subscriptions/", payload);
      if (res?.error) throw new Error(typeof res.error === "string" ? res.error : JSON.stringify(res.error));
      onSuccess(`Plan assigned to ${student.first_name} ${student.last_name}.`);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to assign plan.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-end sm:items-center justify-center p-0 sm:p-6"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", zIndex: 9991 }}
      onClick={onClose}>
      <div className="w-full sm:max-w-md flex flex-col"
        style={{ maxHeight: "90vh", background: "#08111E", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, boxShadow: "0 24px 80px rgba(0,0,0,0.7)", overflow: "hidden" }}
        onClick={(e) => e.stopPropagation()}>

        <div className="px-5 py-4 flex items-center justify-between shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div>
            <p className="font-black text-white text-sm">Assign Subscription</p>
            <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>Manually assign a plan to a student</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center text-base"
            style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.4)" }}>×</button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4" style={{ overflowY: "auto" }}>

          <div>
            <FieldLabel required>Student</FieldLabel>
            <StudentSearch selected={student} onSelect={setStudent} />
          </div>

          <div>
            <FieldLabel required>Plan</FieldLabel>
            {activePlans.length === 0 ? (
              <p className="text-xs px-3 py-2.5 rounded-xl"
                style={{ background: "rgba(245,158,11,0.08)", color: "#FCD34D", border: "1px solid rgba(245,158,11,0.18)" }}>
                No active plans. Create a plan first.
              </p>
            ) : (
              <div className="space-y-1.5">
                {activePlans.map((p) => {
                  const sel = planId === p.id;
                  return (
                    <button key={p.id} onClick={() => setPlanId(p.id)}
                      className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left transition-all"
                      style={sel
                        ? { background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.28)" }
                        : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                      <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                        style={sel ? { background: "#10B981", border: "1px solid #10B981" } : { background: "transparent", border: "1px solid rgba(255,255,255,0.2)" }}>
                        {sel && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">{p.name}</p>
                        <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                          {p.currency} {parseFloat(p.price).toLocaleString("en-KE")} / {p.duration} · {p.tier === "full" ? "Full" : "Partial"}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <FieldLabel>Start Date <span className="normal-case font-normal" style={{ color: "rgba(255,255,255,0.2)" }}>(optional)</span></FieldLabel>
            <input type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)}
              className={inputCls} style={{ ...inputStyle, colorScheme: "dark" }} />
          </div>

          {student && selectedPlan && (
            <div className="rounded-xl px-4 py-3 space-y-1.5"
              style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.18)" }}>
              <p className="text-[9px] font-black tracking-widest uppercase mb-2" style={{ color: "rgba(255,255,255,0.28)" }}>Summary</p>
              <p className="text-xs text-white"><span style={{ color: "rgba(255,255,255,0.4)" }}>Student: </span>{student.first_name} {student.last_name}</p>
              <p className="text-xs text-white"><span style={{ color: "rgba(255,255,255,0.4)" }}>Plan: </span>{selectedPlan.name}</p>
              <p className="text-xs text-white"><span style={{ color: "rgba(255,255,255,0.4)" }}>Cost: </span>{selectedPlan.currency} {parseFloat(selectedPlan.price).toLocaleString("en-KE")} / {selectedPlan.duration}</p>
            </div>
          )}

          {error && (
            <p className="text-xs px-3 py-2.5 rounded-xl"
              style={{ background: "rgba(239,68,68,0.08)", color: "#F87171", border: "1px solid rgba(239,68,68,0.15)" }}>
              {error}
            </p>
          )}
        </div>

        <div className="px-5 py-3 flex gap-2 shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-black"
            style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.08)" }}>
            Cancel
          </button>
          <button onClick={handleSave} disabled={!isValid || saving || activePlans.length === 0}
            className="flex-1 py-2.5 rounded-xl text-sm font-black disabled:opacity-40"
            style={{ background: "linear-gradient(135deg,#065F46,#10B981)", color: "#fff", boxShadow: isValid ? "0 4px 14px rgba(16,185,129,0.25)" : "none" }}>
            {saving ? <span className="flex items-center justify-center gap-2"><Spinner /> Assigning…</span> : "Assign Plan →"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── Charts
// ─────────────────────────────────────────────────────────────────────────────

function MiniBarChart({ data, color = "#10B981" }) {
  if (!data?.length) return null;
  const max = Math.max(...data.map((d) => d.revenue), 1);
  return (
    <div className="flex items-end gap-1 h-20">
      {data.map((d, i) => {
        const pct    = Math.max((d.revenue / max) * 100, 2);
        const isLast = i === data.length - 1;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
            <div className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col items-center z-10 pointer-events-none">
              <div className="rounded-lg px-2 py-1.5 text-center whitespace-nowrap"
                style={{ background: "#0d1a2e", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 8px 24px rgba(0,0,0,0.5)" }}>
                <p className="text-[10px] font-black text-white">KES {fmtMoney(d.revenue)}</p>
                <p className="text-[9px]" style={{ color: "rgba(255,255,255,0.4)" }}>{d.subscriptions} sub{d.subscriptions !== 1 ? "s" : ""}</p>
              </div>
            </div>
            <div className="w-full rounded-t-sm"
              style={{ height: `${pct}%`, background: isLast ? `linear-gradient(180deg,${color},${color}bb)` : `${color}44`, border: isLast ? `1px solid ${color}88` : "none" }} />
            <span className="text-[8px] font-bold" style={{ color: "rgba(255,255,255,0.22)" }}>{fmtMonth(d.month)}</span>
          </div>
        );
      })}
    </div>
  );
}

function DonutChart({ data }) {
  if (!data?.length) return null;
  const total        = data.reduce((s, d) => s + d.total, 0) || 1;
  let   offset       = 0;
  const r            = 38, cx = 48, cy = 48;
  const circumference = 2 * Math.PI * r;

  const slices = data.map((d, i) => {
    const pct  = d.total / total;
    const dash = pct * circumference;
    const rot  = offset * 360;
    offset    += pct;
    return { ...d, dash, gap: circumference - dash, rot, color: DONUT_COLORS[i % DONUT_COLORS.length] };
  });

  return (
    <div className="flex items-center gap-5">
      <svg width={96} height={96} viewBox="0 0 96 96" className="shrink-0">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={10} />
        {slices.map((s, i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={s.color} strokeWidth={10}
            strokeDasharray={`${s.dash} ${s.gap}`}
            strokeDashoffset={circumference / 4}
            transform={`rotate(${s.rot} ${cx} ${cy})`} />
        ))}
        <text x={cx} y={cy - 4} textAnchor="middle" fill="white" fontSize={13} fontWeight={900}>{total}</text>
        <text x={cx} y={cy + 9} textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize={8}>total</text>
      </svg>
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        {slices.map((s, i) => (
          <div key={i} className="flex items-center gap-2 min-w-0">
            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: s.color }} />
            <span className="text-[11px] truncate" style={{ color: "rgba(255,255,255,0.55)" }}>{s.plan__name}</span>
            <span className="ml-auto text-[11px] font-black shrink-0" style={{ color: s.color }}>{s.total}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── PlanStatsPanel
// ─────────────────────────────────────────────────────────────────────────────

function StatCard({ icon, label, value, sub, color = "#10B981" }) {
  return (
    <div className="rounded-xl px-4 py-3.5 flex items-center gap-3"
      style={{ background: "rgba(255,255,255,0.025)", border: `1px solid ${color}22` }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0"
        style={{ background: `${color}18`, border: `1px solid ${color}28` }}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-black tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>{label}</p>
        <p className="font-black text-white text-lg leading-none mt-0.5">{value}</p>
        {sub && <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>{sub}</p>}
      </div>
    </div>
  );
}

function PlanStatsPanel() {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await getData("plan-stats/");
      if (!res?.error) setStats(res);
      setLoading(false);
    })();
  }, []);

  if (loading) return (
    <div className="flex items-center gap-2 py-10 justify-center text-sm" style={{ color: "rgba(255,255,255,0.25)" }}>
      <Spinner /> Loading stats…
    </div>
  );

  if (!stats) return (
    <div className="py-8 text-center text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>Could not load stats.</div>
  );

  const revenue12 = stats.monthly_revenue_last_12_months ?? [];
  const dist      = stats.plan_distribution ?? [];
  const lastMonth = revenue12[revenue12.length - 1];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2.5">
        <StatCard icon="💳" label="Total Plans"   value={stats.total_plans}        color="#3B82F6" />
        <StatCard icon="👥" label="Subscribers"   value={stats.total_subscriptions} color="#10B981"
          sub={`${stats.active_subscriptions} active`} />
        <StatCard icon="💰" label="Total Revenue"
          value={`KES ${fmtMoney(stats.total_revenue)}`} color="#F59E0B" sub="all time" />
        <StatCard icon="📈" label="This Month"
          value={`KES ${fmtMoney(lastMonth?.revenue ?? 0)}`} color="#A855F7"
          sub={`${lastMonth?.subscriptions ?? 0} new subs`} />
      </div>

      {revenue12.length > 0 && (
        <div className="rounded-xl p-4"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <p className="text-[10px] font-black tracking-widest uppercase mb-3" style={{ color: "rgba(255,255,255,0.28)" }}>
            Revenue — Last 12 Months
          </p>
          <MiniBarChart data={revenue12} color="#10B981" />
        </div>
      )}

      {dist.length > 0 && (
        <div className="rounded-xl p-4"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <p className="text-[10px] font-black tracking-widest uppercase mb-3" style={{ color: "rgba(255,255,255,0.28)" }}>
            Subscription Distribution
          </p>
          <DonutChart data={dist} />
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── Plan form modal (create / edit)
// ─────────────────────────────────────────────────────────────────────────────

function PlanFormModal({ plan, onClose, onSaved }) {
  const isEdit = !!plan;
  const [form,   setForm]   = useState(isEdit ? { ...plan, price: String(plan.price) } : { ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState(null);

  const set      = (key, val) => setForm((f) => ({ ...f, [key]: val }));
  const setField = (key)      => (e) => set(key, e.target.value);

  const handleTierChange = (val) => {
    if (val === "partial") setForm((f) => ({ ...f, tier: val, submit_exam_questions_attempts: false, submit_exercise_attempts: false }));
    else setForm((f) => ({ ...f, tier: val, notes_access: true, exercises_access: true, exams_access: true, virtual_classes_access: true }));
  };

  const isValid = form.name.trim() && form.price && parseFloat(form.price) > 0 && form.currency.trim();

  const handleSave = async () => {
    if (!isValid || saving) return;
    setSaving(true); setError(null);
    try {
      const payload = { ...form, price: parseFloat(form.price), name: form.name.trim(), description: form.description?.trim() || null };
      const res = isEdit
        ? await patchData(`subscription-plans/${plan.id}/`, payload)
        : await createData("subscription-plans/", payload);
      if (res?.error) throw new Error(typeof res.error === "string" ? res.error : JSON.stringify(res.error));
      onSaved(res); onClose();
    } catch (err) {
      setError(err.message || "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-end sm:items-center justify-center p-0 sm:p-6"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", zIndex: 9990 }}
      onClick={onClose}>
      <div className="w-full sm:max-w-lg flex flex-col"
        style={{ maxHeight: "92vh", background: "#08111E", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, boxShadow: "0 24px 80px rgba(0,0,0,0.7)", overflow: "hidden" }}
        onClick={(e) => e.stopPropagation()}>

        <div className="px-5 py-4 flex items-center justify-between shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <p className="font-black text-white text-sm">{isEdit ? "Edit Plan" : "New Subscription Plan"}</p>
          <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center text-base"
            style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.4)" }}>×</button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4" style={{ overflowY: "auto" }}>
          <div>
            <FieldLabel required>Plan Name</FieldLabel>
            <input type="text" value={form.name} onChange={setField("name")} placeholder="e.g. Weekly Full Access"
              maxLength={150} className={inputCls} style={inputStyle} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel required>Tier</FieldLabel>
              <select value={form.tier} onChange={(e) => handleTierChange(e.target.value)}
                className={inputCls} style={{ ...inputStyle, cursor: "pointer" }}>
                {TIER_OPTIONS.map((o) => <option key={o.value} value={o.value} style={{ background: "#0a1120" }}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <FieldLabel required>Duration</FieldLabel>
              <select value={form.duration} onChange={setField("duration")}
                className={inputCls} style={{ ...inputStyle, cursor: "pointer" }}>
                {DURATION_OPTIONS.map((o) => <option key={o.value} value={o.value} style={{ background: "#0a1120" }}>{o.label}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel required>Price</FieldLabel>
              <input type="number" min={0} step="0.01" value={form.price} onChange={setField("price")}
                placeholder="0.00" className={inputCls} style={inputStyle} />
            </div>
            <div>
              <FieldLabel required>Currency</FieldLabel>
              <input type="text" value={form.currency} onChange={setField("currency")}
                placeholder="KES" maxLength={10} className={inputCls} style={inputStyle} />
            </div>
          </div>
          <div>
            <FieldLabel>Description</FieldLabel>
            <textarea value={form.description ?? ""} onChange={setField("description")}
              rows={2} placeholder="Optional description…" className={`${inputCls} resize-none`} style={inputStyle} />
          </div>
          <div>
            <FieldLabel>Feature Access</FieldLabel>
            <div className="grid grid-cols-2 gap-1.5">
              {ACCESS_FLAGS.map(({ key, icon, label }) => (
                <button key={key} onClick={() => set(key, !form[key])}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all"
                  style={form[key]
                    ? { background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.22)" }
                    : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <span className="text-xs">{icon}</span>
                  <span className="text-xs font-bold truncate" style={{ color: form[key] ? "#6EE7B7" : "rgba(255,255,255,0.35)" }}>{label}</span>
                  <span className="ml-auto text-[9px] font-black" style={{ color: form[key] ? "#6EE7B7" : "rgba(255,255,255,0.18)" }}>
                    {form[key] ? "ON" : "OFF"}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="px-3.5 py-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <Toggle checked={form.active} onChange={(v) => set("active", v)}
              label={form.active ? "Active — visible to students" : "Inactive — hidden from students"} />
          </div>
          {error && (
            <p className="text-xs px-3 py-2.5 rounded-xl"
              style={{ background: "rgba(239,68,68,0.08)", color: "#F87171", border: "1px solid rgba(239,68,68,0.15)" }}>
              {error}
            </p>
          )}
        </div>

        <div className="px-5 py-3 flex gap-2 shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-black"
            style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.08)" }}>
            Cancel
          </button>
          <button onClick={handleSave} disabled={!isValid || saving}
            className="flex-1 py-2.5 rounded-xl text-sm font-black disabled:opacity-40"
            style={{ background: "linear-gradient(135deg,#065F46,#10B981)", color: "#fff", boxShadow: isValid ? "0 4px 14px rgba(16,185,129,0.25)" : "none" }}>
            {saving ? <span className="flex items-center justify-center gap-2"><Spinner /> Saving…</span> : isEdit ? "Save Changes" : "Create Plan"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── PlanRow
// ─────────────────────────────────────────────────────────────────────────────

function PlanRow({ plan, onEdit, isLast }) {
  const dm = DURATION_META[plan.duration] ?? DURATION_META.monthly;
  return (
    <div className="flex items-center gap-3 px-4 py-3.5 transition-all hover:bg-white/[0.018] group"
      style={{ borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.05)" }}>
      <div className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ background: plan.active ? "#10B981" : "rgba(255,255,255,0.2)" }} />
      <div className="flex-1 min-w-0">
        <p className="font-black text-white text-sm truncate">{plan.name}</p>
        {plan.description && (
          <p className="text-[11px] mt-0.5 truncate" style={{ color: "rgba(255,255,255,0.28)" }}>{plan.description}</p>
        )}
        <div className="flex gap-1 mt-1.5 flex-wrap">
          {ACCESS_FLAGS.map(({ key, icon, label }) => (
            <span key={key} className="text-[9px] font-bold px-1.5 py-0.5 rounded"
              style={plan[key]
                ? { background: "rgba(16,185,129,0.1)", color: "#6EE7B7" }
                : { background: "transparent", color: "rgba(255,255,255,0.15)", textDecoration: "line-through" }}>
              {icon} {label}
            </span>
          ))}
        </div>
      </div>
      <span className="text-[10px] font-black px-2.5 py-1 rounded-full shrink-0 hidden sm:inline"
        style={{ background: dm.bg, color: dm.color, border: `1px solid ${dm.border}` }}>
        {DURATION_OPTIONS.find((d) => d.value === plan.duration)?.label ?? plan.duration}
      </span>
      <span className="text-[10px] font-black px-2.5 py-1 rounded-full shrink-0 hidden sm:inline"
        style={plan.tier === "full"
          ? { background: "rgba(16,185,129,0.08)", color: "#6EE7B7", border: "1px solid rgba(16,185,129,0.18)" }
          : { background: "rgba(245,158,11,0.08)", color: "#FCD34D", border: "1px solid rgba(245,158,11,0.18)" }}>
        {plan.tier === "full" ? "Full" : "Partial"}
      </span>
      <div className="text-right shrink-0 min-w-22">
        <p className="font-black text-white text-sm leading-none">
          {plan.currency} {parseFloat(plan.price).toLocaleString("en-KE", { minimumFractionDigits: 2 })}
        </p>
        <p className="text-[10px] mt-0.5" style={{ color: dm.color }}>/{plan.duration}</p>
      </div>
      <button onClick={() => onEdit(plan)}
        className="px-3 py-1.5 rounded-lg text-[11px] font-black shrink-0 transition-all opacity-0 group-hover:opacity-100"
        style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)" }}>
        Edit
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── Toast
// ─────────────────────────────────────────────────────────────────────────────

function Toast({ message, onDismiss }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onDismiss, 4000);
    return () => clearTimeout(t);
  }, [message, onDismiss]);
  if (!message) return null;
  return (
    <div className="fixed bottom-24 lg:bottom-6 left-1/2 -translate-x-1/2 z-9999 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-bold max-w-sm w-full"
      style={{ background: "#071a10", border: "1px solid rgba(16,185,129,0.4)", color: "#34D399" }}>
      <span>✅</span>
      <span className="flex-1">{message}</span>
      <button onClick={onDismiss} className="opacity-50 hover:opacity-100">×</button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── PricingTab  — main export
// ─────────────────────────────────────────────────────────────────────────────

const VIEWS = { PLANS: "plans", ASSIGN: "assign", STATS: "stats" };

export default function PricingTab() {
  const [plans,          setPlans]          = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [view,           setView]           = useState(VIEWS.PLANS);
  const [modal,          setModal]          = useState(null);   // null | "create" | plan object
  const [showSubModal,   setShowSubModal]   = useState(false);
  const [toast,          setToast]          = useState(null);
  const [filterDuration, setFilterDuration] = useState("");
  const [filterTier,     setFilterTier]     = useState("");
  const [filterStatus,   setFilterStatus]   = useState("");

  const fetchPlans = async () => {
    setLoading(true);
    const res = await getData("subscription-plans/");
    if (!res?.error) setPlans(res?.results ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchPlans(); }, []);

  const handleSaved = (saved) => {
    setPlans((prev) => {
      const idx = prev.findIndex((p) => p.id === saved.id);
      if (idx !== -1) { const next = [...prev]; next[idx] = saved; return next; }
      return [saved, ...prev];
    });
  };

  const filtered = plans.filter((p) => {
    if (filterDuration && p.duration !== filterDuration)  return false;
    if (filterTier     && p.tier     !== filterTier)      return false;
    if (filterStatus === "active"   && !p.active)         return false;
    if (filterStatus === "inactive" &&  p.active)         return false;
    return true;
  });

  const hasFilter   = filterDuration || filterTier || filterStatus;
  const activeCount = plans.filter((p) => p.active).length;

  const selCls = "rounded-lg text-xs text-white outline-none px-3 py-1.5 font-bold";
  const selSt  = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", color: "#fff", cursor: "pointer" };

  const ViewBtn = ({ v, label }) => (
    <button onClick={() => setView(v)}
      className="px-4 py-2 rounded-xl text-xs font-black transition-all"
      style={view === v
        ? { background: "#10B981", color: "#fff", boxShadow: "0 4px 12px rgba(16,185,129,0.3)" }
        : { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.08)" }}>
      {label}
    </button>
  );

  return (
    <>
      <Toast message={toast} onDismiss={() => setToast(null)} />

      {modal && (
        <PlanFormModal
          plan={modal === "create" ? null : modal}
          onClose={() => setModal(null)}
          onSaved={handleSaved}
        />
      )}

      {showSubModal && (
        <SubscriptionFormModal
          plans={plans}
          onClose={() => setShowSubModal(false)}
          onSuccess={(msg) => { setToast(msg); setShowSubModal(false); }}
        />
      )}

      <div className="space-y-5 pb-10">

        {/* Header */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">💳 Subscription Plans</h2>
            <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
              Manage plans, assign to students, view revenue
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowSubModal(true)}
              className="px-4 py-2 rounded-xl text-sm font-black transition-all hover:opacity-90"
              style={{ background: "rgba(59,130,246,0.15)", color: "#93C5FD", border: "1px solid rgba(59,130,246,0.25)" }}>
              + Assign
            </button>
            <button onClick={() => setModal("create")}
              className="px-4 py-2 rounded-xl text-sm font-black transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg,#065F46,#10B981)", color: "#fff", boxShadow: "0 4px 14px rgba(16,185,129,0.25)" }}>
              + New Plan
            </button>
          </div>
        </div>

        {/* View toggle */}
        <div className="flex gap-2 flex-wrap">
          <ViewBtn v={VIEWS.PLANS}  label="📋 Plans" />
          {/* <ViewBtn v={VIEWS.ASSIGN} label="👥 Assign History" /> */}
          <ViewBtn v={VIEWS.STATS}  label="📊 Stats & Revenue" />
        </div>

        {/* ── PLANS VIEW ── */}
        {view === VIEWS.PLANS && (
          <>
            {/* Summary */}
            {!loading && plans.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {[
                  { label: `${plans.length} total`,                  color: "rgba(255,255,255,0.4)", bg: "rgba(255,255,255,0.05)",  border: "rgba(255,255,255,0.09)" },
                  { label: `${activeCount} active`,                  color: "#6EE7B7",               bg: "rgba(16,185,129,0.08)",   border: "rgba(16,185,129,0.18)"  },
                  { label: `${plans.length - activeCount} inactive`, color: "rgba(255,255,255,0.3)", bg: "rgba(255,255,255,0.03)",  border: "rgba(255,255,255,0.07)" },
                ].map(({ label, color, bg, border }) => (
                  <span key={label} className="text-[11px] font-black px-3 py-1 rounded-full"
                    style={{ color, background: bg, border: `1px solid ${border}` }}>
                    {label}
                  </span>
                ))}
              </div>
            )}

            {/* Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              <select value={filterDuration} onChange={(e) => setFilterDuration(e.target.value)} className={selCls} style={selSt}>
                <option value="" style={{ background: "#0a1120" }}>All Durations</option>
                {DURATION_OPTIONS.map((o) => <option key={o.value} value={o.value} style={{ background: "#0a1120" }}>{o.label}</option>)}
              </select>
              <select value={filterTier} onChange={(e) => setFilterTier(e.target.value)} className={selCls} style={selSt}>
                <option value="" style={{ background: "#0a1120" }}>All Tiers</option>
                {TIER_OPTIONS.map((o) => <option key={o.value} value={o.value} style={{ background: "#0a1120" }}>{o.label}</option>)}
              </select>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className={selCls} style={selSt}>
                <option value=""         style={{ background: "#0a1120" }}>All Status</option>
                <option value="active"   style={{ background: "#0a1120" }}>Active only</option>
                <option value="inactive" style={{ background: "#0a1120" }}>Inactive only</option>
              </select>
              {hasFilter && (
                <button onClick={() => { setFilterDuration(""); setFilterTier(""); setFilterStatus(""); }}
                  className="text-[10px] font-black hover:opacity-70" style={{ color: "#F87171" }}>
                  ✕ Clear
                </button>
              )}
            </div>

            {loading ? (
              <div className="flex items-center justify-center gap-2 py-16 text-sm" style={{ color: "rgba(255,255,255,0.25)" }}>
                <Spinner /> Loading plans…
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <p className="text-3xl">📋</p>
                <p className="text-sm font-bold text-white">
                  {hasFilter ? "No plans match these filters" : "No subscription plans yet"}
                </p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                  {hasFilter ? "Adjust or clear the filters." : "Create your first plan to get started."}
                </p>
                {!hasFilter && (
                  <button onClick={() => setModal("create")}
                    className="px-5 py-2 rounded-xl text-sm font-black mt-1"
                    style={{ background: "linear-gradient(135deg,#065F46,#10B981)", color: "#fff" }}>
                    + Create Plan
                  </button>
                )}
              </div>
            ) : (
              <div className="rounded-2xl overflow-hidden"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex items-center gap-3 px-4 py-2"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
                  <span className="w-1.5 shrink-0" />
                  <span className="flex-1 text-[9px] font-black tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.2)" }}>Plan</span>
                  <span className="hidden sm:inline text-[9px] font-black tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.2)", minWidth: 72 }}>Duration</span>
                  <span className="hidden sm:inline text-[9px] font-black tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.2)", minWidth: 60 }}>Tier</span>
                  <span className="text-[9px] font-black tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.2)", minWidth: 88, textAlign: "right" }}>Price</span>
                  <span style={{ minWidth: 56 }} />
                </div>
                {filtered.map((plan, i) => (
                  <PlanRow key={plan.id} plan={plan} onEdit={setModal} isLast={i === filtered.length - 1} />
                ))}
              </div>
            )}
          </>
        )}

        {/* ── ASSIGN HISTORY VIEW ── */}
        {view === VIEWS.ASSIGN && (
          <div className="rounded-2xl py-16 text-center"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <p className="text-3xl mb-3">👥</p>
            <p className="text-sm font-bold text-white mb-1">Subscription Assignment History</p>
            <p className="text-xs mb-5" style={{ color: "rgba(255,255,255,0.3)" }}>
              Use the "+ Assign" button to assign a plan to a student.
            </p>
            <button onClick={() => setShowSubModal(true)}
              className="px-5 py-2 rounded-xl text-sm font-black"
              style={{ background: "rgba(59,130,246,0.15)", color: "#93C5FD", border: "1px solid rgba(59,130,246,0.25)" }}>
              + Assign a Plan
            </button>
          </div>
        )}

        {/* ── STATS VIEW ── */}
        {view === VIEWS.STATS && <PlanStatsPanel />}
      </div>
    </>
  );
}