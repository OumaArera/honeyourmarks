import { useEffect, useState } from "react";
import { getData } from "../../api/api.service";
import BtnPrimary from "../landing/BtnPrimary";
import Eyebrow from "../landing/Eyebrow";

// ─────────────────────────────────────────────────────────────────────────────
// ── Constants
// ─────────────────────────────────────────────────────────────────────────────

const DURATIONS = [
  { key: "daily",   label: "Daily"   },
  { key: "weekly",  label: "Weekly"  },
  { key: "monthly", label: "Monthly" },
  { key: "annual",  label: "Annual"  },
];

const PERIOD_LABEL = {
  daily: "/ day", weekly: "/ week", monthly: "/ month", annual: "/ year",
};

const SAVINGS_BADGE = {
  monthly: "Save ~40%",
  annual:  "Best Value",
};

const FREE_FEATURES = [
  "Browse notes previews",
  "View class schedules",
  "Explore subject topics",
  "Access sample exercises",
];

const ACCESS_FLAG_LABELS = {
  notes_access:           "Full notes library",
  exercises_access:       "All exercises & solutions",
  exams_access:           "Past exams & marking schemes",
  virtual_classes_access: "Live virtual classes",
};

// ─────────────────────────────────────────────────────────────────────────────
// ── Small atoms
// ─────────────────────────────────────────────────────────────────────────────

function FeatureItem({ children, accent = "#2E8B2A" }) {
  return (
    <li className="font-body text-[14px] flex items-start gap-2.5 leading-[1.6]">
      <span style={{ color: accent, marginTop: 3, flexShrink: 0 }}>✓</span>
      <span>{children}</span>
    </li>
  );
}

function SavingsBadge({ duration }) {
  const badge = SAVINGS_BADGE[duration];
  if (!badge) return null;
  return (
    <span className="font-body font-bold text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full ml-2"
      style={{ background: "#E84A0C", color: "#fff", verticalAlign: "middle" }}>
      {badge}
    </span>
  );
}

function DurationToggle({ active, onChange, available }) {
  return (
    <div className="inline-flex rounded-full p-1 gap-0.5"
      style={{ background: "rgba(27,47,78,0.07)", border: "1px solid rgba(27,47,78,0.12)" }}
      role="group" aria-label="Billing duration">
      {DURATIONS.map(({ key, label }) => {
        const isActive  = active === key;
        const hasPlans  = available.includes(key);
        return (
          <button key={key} onClick={() => onChange(key)}
            className="font-body font-semibold text-[13px] px-5 py-2 rounded-full transition-all duration-200"
            style={{
              background:    isActive ? "#1B2F4E" : "transparent",
              color:         isActive ? "#FDF8F2" : hasPlans ? "#4A5568" : "#B0BEC5",
              cursor:        "pointer",
              border:        "none",
              letterSpacing: "0.02em",
            }}
            aria-pressed={isActive}>
            {label}
          </button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── Skeleton loader
// ─────────────────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {[0, 1, 2].map((i) => (
        <div key={i} className="p-8 animate-pulse"
          style={{ background: "#fff", border: "1.5px solid rgba(27,47,78,0.08)", minHeight: 400 }}>
          <div className="h-2.5 w-20 rounded-full mb-5" style={{ background: "rgba(27,47,78,0.07)" }} />
          <div className="h-10 w-28 rounded mb-3"       style={{ background: "rgba(27,47,78,0.07)" }} />
          <div className="h-3.5 w-full rounded mb-2"    style={{ background: "rgba(27,47,78,0.05)" }} />
          <div className="h-3.5 w-3/4 rounded mb-7"     style={{ background: "rgba(27,47,78,0.05)" }} />
          {[0, 1, 2, 3].map((j) => (
            <div key={j} className="h-3 w-full rounded mb-3" style={{ background: "rgba(27,47,78,0.04)" }} />
          ))}
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── Plan cards
// ─────────────────────────────────────────────────────────────────────────────

function PartialCard({ plan, periodLabel }) {
  const fmt = (n) => `KSh ${Number(n).toLocaleString("en-KE")}`;

  return (
    <div className="flex flex-col p-8"
      style={{ background: "#fff", border: "1.5px solid rgba(27,47,78,0.15)" }}>
      <div className="font-body font-bold text-[11px] tracking-[.14em] uppercase mb-3"
        style={{ color: "#2E8B2A" }}>
        Partial Access
      </div>
      <div className="font-display font-black leading-none mb-1"
        style={{ fontSize: 38, color: "#1B2F4E" }}>
        {fmt(plan.price)}
      </div>
      <div className="font-body text-[13px] mb-2" style={{ color: "#718096" }}>
        {periodLabel}
        <SavingsBadge duration={plan.duration} />
      </div>
      <p className="font-body text-[13.5px] leading-[1.65] mb-6" style={{ color: "#718096" }}>
        {plan.description || "Choose specific subjects or topics. Great for focused revision."}
      </p>

      <ul className="flex flex-col gap-2.5 mb-8 flex-1">
        {Object.entries(ACCESS_FLAG_LABELS).map(([key, label]) =>
          plan[key] ? <FeatureItem key={key} accent="#2E8B2A">{label}</FeatureItem> : null
        )}
      </ul>

      <button
        className="w-full py-3.5 font-body font-semibold text-[14px] transition-all duration-200 hover:bg-[#1B2F4E] hover:text-[#FDF8F2]"
        style={{ border: "1.5px solid #1B2F4E", color: "#1B2F4E", background: "transparent", cursor: "pointer", letterSpacing: "0.02em" }}
        onClick={() => (window.location.href = "/login")}>
        Choose Subjects →
      </button>
    </div>
  );
}

function FullCard({ plan, periodLabel }) {
  const fmt = (n) => `KSh ${Number(n).toLocaleString("en-KE")}`;

  return (
    <div className="relative flex flex-col p-8 overflow-hidden"
      style={{ background: "#1B2F4E" }}>
      <div className="absolute top-0 right-0 px-4 py-1.5 font-body font-bold text-[10px] text-white tracking-widest uppercase"
        style={{ background: "#E84A0C" }}>
        Most Popular
      </div>

      <div className="font-body font-bold text-[11px] tracking-[.14em] uppercase mb-3"
        style={{ color: "rgba(253,248,242,0.45)" }}>
        Full Access
      </div>
      <div className="font-display font-black leading-none mb-1"
        style={{ fontSize: 38, color: "#FDF8F2" }}>
        {fmt(plan.price)}
      </div>
      <div className="font-body text-[13px] mb-2"
        style={{ color: "rgba(253,248,242,0.45)" }}>
        {periodLabel}
        <SavingsBadge duration={plan.duration} />
      </div>
      <p className="font-body text-[13.5px] leading-[1.65] mb-6"
        style={{ color: "rgba(253,248,242,0.6)" }}>
        {plan.description || "Unrestricted access to everything. Pay via M-Pesa, confirmed instantly."}
      </p>

      <ul className="flex flex-col gap-2.5 mb-8 flex-1">
        {Object.entries(ACCESS_FLAG_LABELS).map(([key, label]) =>
          plan[key] ? (
            <FeatureItem key={key} accent="#E84A0C">
              <span style={{ color: "rgba(253,248,242,0.88)" }}>{label}</span>
            </FeatureItem>
          ) : null
        )}
      </ul>

      <BtnPrimary
        style={{ width: "100%", padding: "13px", fontSize: 14, clipPath: "none", textAlign: "center", display: "block", letterSpacing: "0.02em", fontWeight: 600 }}
        onClick={() => (window.location.href = "/login")}>
        Unlock Full Access →
      </BtnPrimary>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── Main Pricing section
// ─────────────────────────────────────────────────────────────────────────────

export default function Pricing() {
  const [duration, setDuration] = useState("monthly");
  const [plans,    setPlans]    = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    (async () => {
      const res = await getData("subscription-plans/", false);
      if (!res?.error) setPlans((res?.results ?? []).filter((p) => p.active));
      setLoading(false);
    })();
  }, []);

  // Durations that have at least one plan (for fading out toggle buttons)
  const availableDurations = [...new Set(plans.map((p) => p.duration))];

  // Plans for current duration selection
  const forDuration = plans.filter((p) => p.duration === duration);
  const partialPlan = forDuration.find((p) => p.tier === "partial") ?? null;
  const fullPlan    = forDuration.find((p) => p.tier === "full")    ?? null;
  const hasAny      = !!(partialPlan || fullPlan);

  const periodLabel = PERIOD_LABEL[duration] ?? "";

  // Grid: 3 cols when free + partial + full, 2 cols when only some paid plans exist
  const paidCount   = (partialPlan ? 1 : 0) + (fullPlan ? 1 : 0);
  const gridCols    = hasAny
    ? paidCount === 2 ? "md:grid-cols-3" : "md:grid-cols-2 max-w-3xl mx-auto"
    : "md:grid-cols-1 max-w-sm mx-auto";

  return (
    <section id="pricing" className="py-28 px-[5%]" style={{ background: "#FDF8F2" }}>
      <div className="max-w-5xl mx-auto">

        {/* ── Header ── */}
        <div className="text-center mb-12">
          <Eyebrow>Simple Pricing</Eyebrow>
          <h2
            className="font-display font-black leading-[1.1] mb-4"
            style={{ fontSize: "clamp(30px, 4vw, 50px)", color: "#1B2F4E" }}>
            Knowledge Shouldn't<br />
            <em style={{ color: "#2E8B2A" }}>Break the Bank.</em>
          </h2>
          <p
            className="font-body font-light text-[16px] leading-[1.75] max-w-lg mx-auto mb-8"
            style={{ color: "#4A5568" }}>
            Fees confirmed by your teacher — no hidden charges, no automatic billing.
            Pay via M-Pesa and get access instantly.
          </p>

          <DurationToggle
            active={duration}
            onChange={setDuration}
            available={availableDurations}
          />
        </div>

        {/* ── Cards ── */}
        {loading ? (
          <Skeleton />
        ) : (
          <div className={`grid grid-cols-1 gap-5 text-left items-stretch ${gridCols}`}>

            {/* Free / Preview — always shown */}
            <div className="flex flex-col p-8"
              style={{ background: "#fff", border: "1.5px solid rgba(27,47,78,0.1)" }}>
              <div className="font-body font-bold text-[11px] tracking-[.14em] uppercase mb-3"
                style={{ color: "#718096" }}>
                Preview
              </div>
              <div className="font-display font-black text-[42px] leading-none mb-1"
                style={{ color: "#1B2F4E" }}>
                Free
              </div>
              <p className="font-body text-[13.5px] leading-[1.65] mb-6 mt-2"
                style={{ color: "#718096" }}>
                Browse and explore before committing. No payment required.
              </p>
              <ul className="flex flex-col gap-2.5 mb-8 flex-1">
                {FREE_FEATURES.map((f) => (
                  <FeatureItem key={f} accent="#718096">{f}</FeatureItem>
                ))}
              </ul>
              <button
                className="w-full py-3.5 font-body font-semibold text-[14px] transition-all duration-200 hover:bg-[#1B2F4E] hover:text-[#FDF8F2]"
                style={{ border: "1.5px solid #1B2F4E", color: "#1B2F4E", background: "transparent", cursor: "pointer", letterSpacing: "0.02em" }}
                onClick={() => (window.location.href = "/login")}>
                Get Started Free
              </button>
            </div>

            {/* Partial — rendered only if plan exists for this duration */}
            {partialPlan && <PartialCard plan={partialPlan} periodLabel={periodLabel} />}

            {/* Full — rendered only if plan exists for this duration */}
            {fullPlan && <FullCard plan={fullPlan} periodLabel={periodLabel} />}

            {/* No paid plans for this duration */}
            {!hasAny && (
              <div className="flex flex-col items-center justify-center p-8 text-center"
                style={{ background: "#fff", border: "1.5px dashed rgba(27,47,78,0.12)" }}>
                <p className="font-body text-[15px] font-semibold mb-1" style={{ color: "#4A5568" }}>
                  No {duration} plans available
                </p>
                <p className="font-body text-[13px]" style={{ color: "#A0AEC0" }}>
                  Try selecting a different billing period above.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── Footer note ── */}
        <p className="text-center font-body text-[13px] mt-8" style={{ color: "#718096" }}>
          All plans are manually confirmed by your teacher-admin. Duration auto-expires —{" "}
          <strong style={{ color: "#1B2F4E" }}>no automatic renewal.</strong>
        </p>
      </div>
    </section>
  );
}