import React, { useState, useEffect } from "react";
import { Copy, Check, X, ChevronRight, Shield, Crown } from "lucide-react";
import { getData } from "../../api/api.service";
import {
  hasActivePlan,
  isFullAccess,
  getDaysRemaining,
  getExpiryLabel,
} from "../../utils/subscription.utils";

// ─── Constants ────────────────────────────────────────────────────────────────

const PAYBILL = "247247";

const DURATION_ORDER = ["daily", "weekly", "monthly", "annually"];

const DURATION_META = {
  daily:    { label: "Daily",   icon: "☀️",  tag: null },
  weekly:   { label: "Weekly",  icon: "📅",  tag: "Save" },
  monthly:  { label: "Monthly", icon: "🗓️",  tag: "Popular" },
  annually: { label: "Annual",  icon: "🏆",  tag: "Best" },
};

const TIER_META = {
  partial: {
    label: "Partial Access",
    color: "#1B7FC4",
    Icon: Shield,
    bg: "rgba(27,127,196,0.12)",
    border: "rgba(27,127,196,0.3)",
  },
  full: {
    label: "Full Access",
    color: "#E84A0C",
    Icon: Crown,
    bg: "rgba(232,74,12,0.12)",
    border: "rgba(232,74,12,0.3)",
  },
};

const FEATURES = [
  { key: "notes_access",           label: "Notes" },
  { key: "exercises_access",       label: "Exercises" },
  { key: "exams_access",           label: "Exams" },
  { key: "virtual_classes_access", label: "Classes" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function groupByDuration(plans) {
  return DURATION_ORDER.reduce((acc, dur) => {
    const group = plans.filter(p => p.duration === dur && p.active);
    if (group.length) acc[dur] = group;
    return acc;
  }, {});
}

function fmt(price, currency = "KES") {
  return `${currency} ${parseFloat(price).toLocaleString()}`;
}

function expiryProgress(subscription) {
  if (!subscription?.start_date || !subscription?.end_date) return 0;
  const start = new Date(subscription.start_date).getTime();
  const end   = new Date(subscription.end_date).getTime();
  const elapsed = Date.now() - start;
  return Math.min(100, Math.max(0, Math.round((elapsed / (end - start)) * 100)));
}

const DURATION_DAYS = { daily: 1, weekly: 7, monthly: 30, annually: 365 };

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton({ h = "h-20" }) {
  return (
    <div
      className={`animate-pulse rounded-2xl w-full ${h}`}
      style={{ background: "rgba(255,255,255,0.06)" }}
    />
  );
}

// ─── Expiry Ring (scales to container) ───────────────────────────────────────

function ExpiryRing({ daysLeft, totalDays, size = 56 }) {
  const r = (size / 2) - 5;
  const circ = 2 * Math.PI * r;
  const pct  = totalDays > 0 ? Math.min(100, (daysLeft / totalDays) * 100) : 0;
  const offset = circ - (pct / 100) * circ;
  const color = pct > 40 ? "#2E8B2A" : pct > 15 ? "#f97316" : "#ef4444";

  return (
    <div
      className="relative flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      <svg
        width={size} height={size}
        className="-rotate-90"
        viewBox={`0 0 ${size} ${size}`}
      >
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4"
        />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color} strokeWidth="4"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center leading-none">
        <span className="font-black text-white" style={{ fontSize: size * 0.22 }}>
          {daysLeft}
        </span>
        <span style={{ fontSize: size * 0.14, color: "rgba(255,255,255,0.4)", fontWeight: 700 }}>
          {daysLeft === 1 ? "day" : "days"}
        </span>
      </div>
    </div>
  );
}

// ─── M-Pesa Modal (bottom sheet on mobile, centered on sm+) ──────────────────

function MpesaModal({ plan, admissionNumber, onClose }) {
  const [copiedKey, setCopiedKey] = useState(null);
  const accountNumber = `1234#${admissionNumber}`;
  const tier = TIER_META[plan.tier] || TIER_META.partial;

  const copy = (text, key) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    });
  };

  const steps = [
    { id: "s1", text: "Open M-Pesa on your phone" },
    { id: "s2", text: "Go to Lipa na M-Pesa → Paybill" },
    { id: "s3", text: "Business Number", value: PAYBILL,        copyKey: "paybill",  color: "#f97316" },
    { id: "s4", text: "Account Number",  value: accountNumber,  copyKey: "account",  color: "#1B7FC4" },
    { id: "s5", text: "Amount",          value: fmt(plan.price, plan.currency), color: "#2E8B2A" },
    { id: "s6", text: "Enter M-Pesa PIN and confirm" },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(10px)" }}
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-sm sm:mx-4 sm:rounded-3xl rounded-t-3xl overflow-hidden flex flex-col"
        style={{
          background: "#0D1520",
          border: "1px solid rgba(255,255,255,0.1)",
          /* Cap height so it doesn't overflow on short phones */
          maxHeight: "92dvh",
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Drag handle — mobile affordance */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div
            className="w-10 h-1 rounded-full"
            style={{ background: "rgba(255,255,255,0.18)" }}
          />
        </div>

        {/* Header */}
        <div
          className="px-5 pt-3 pb-4 flex items-center justify-between shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
              style={{ background: "rgba(46,139,42,0.15)" }}
            >
              📱
            </div>
            <div className="min-w-0">
              <p className="font-black text-white text-sm leading-tight">Pay via M-Pesa</p>
              <p
                className="text-xs truncate"
                style={{ color: "rgba(255,255,255,0.4)", maxWidth: "180px" }}
              >
                {plan.name} · {fmt(plan.price, plan.currency)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 ml-2 transition-opacity hover:opacity-70"
            style={{ background: "rgba(255,255,255,0.08)" }}
            aria-label="Close"
          >
            <X size={15} color="rgba(255,255,255,0.6)" />
          </button>
        </div>

        {/* Scrollable steps */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">
          {steps.map(({ id, text, value, copyKey, color }, i) => (
            <div key={id} className="flex items-start gap-3">
              {/* Step number */}
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5"
                style={{ background: "rgba(232,74,12,0.18)", color: "#E84A0C" }}
              >
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>{text}</p>
                {value && (
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span
                      className="font-black text-xl tracking-widest break-all"
                      style={{ color: color || "rgba(255,255,255,0.9)" }}
                    >
                      {value}
                    </span>
                    {copyKey && (
                      <button
                        onClick={() => copy(value, copyKey)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 transition-all active:scale-95"
                        style={{
                          background: copiedKey === copyKey
                            ? "rgba(46,139,42,0.2)"
                            : "rgba(255,255,255,0.08)",
                          color: copiedKey === copyKey
                            ? "#4ade80"
                            : "rgba(255,255,255,0.5)",
                          border: `1px solid ${copiedKey === copyKey ? "rgba(46,139,42,0.3)" : "rgba(255,255,255,0.1)"}`,
                        }}
                      >
                        {copiedKey === copyKey
                          ? <><Check size={11} /> Copied!</>
                          : <><Copy size={11} /> Copy</>
                        }
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Confirmation note */}
          <div
            className="rounded-2xl p-3.5 text-center mt-2"
            style={{
              background: "rgba(46,139,42,0.1)",
              border: "1px solid rgba(46,139,42,0.25)",
            }}
          >
            <p className="text-xs font-semibold leading-relaxed" style={{ color: "rgba(74,222,128,0.9)" }}>
              ✅ Your teacher-admin will activate your plan shortly after confirming payment.
            </p>
          </div>

          {/* Bottom safe area padding on mobile */}
          <div className="h-2 sm:h-0" />
        </div>
      </div>
    </div>
  );
}

// ─── Plan Card (stacked layout on xs, row on sm+) ────────────────────────────

function PlanCard({ plan, isActive, onSelect }) {
  const tier = TIER_META[plan.tier] || TIER_META.partial;
  const { Icon } = tier;

  return (
    <button
      onClick={() => !isActive && onSelect(plan)}
      className="w-full text-left rounded-2xl p-3.5 sm:p-4 transition-all duration-200 active:scale-[0.98]"
      style={{
        background: isActive ? tier.bg : "rgba(255,255,255,0.03)",
        border: `1px solid ${isActive ? tier.border : "rgba(255,255,255,0.08)"}`,
        cursor: isActive ? "default" : "pointer",
      }}
    >
      {/* Row: icon + name + price on one line (always) */}
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `${tier.color}20` }}
        >
          <Icon size={16} color={tier.color} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-black text-white text-sm leading-tight">{plan.name}</span>
            {isActive && (
              <span
                className="text-[10px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wide"
                style={{ background: tier.color, color: "#fff" }}
              >
                Active
              </span>
            )}
          </div>
          {/* Feature pills — compact on mobile */}
          <div className="flex gap-1 mt-1.5 flex-wrap">
            {FEATURES.filter(f => plan[f.key]).map(f => (
              <span
                key={f.key}
                className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  color: "rgba(255,255,255,0.4)",
                }}
              >
                {f.label}
              </span>
            ))}
          </div>
        </div>

        {/* Price + CTA — always right-aligned, never wraps */}
        <div className="shrink-0 flex flex-col items-end gap-1.5 ml-1">
          <span className="font-black text-base sm:text-lg leading-none" style={{ color: tier.color }}>
            {fmt(plan.price, plan.currency)}
          </span>
          {!isActive && (
            <span
              className="flex items-center gap-0.5 text-[11px] font-black px-2 py-1 rounded-xl whitespace-nowrap"
              style={{
                background: `${tier.color}20`,
                color: tier.color,
                border: `1px solid ${tier.color}40`,
              }}
            >
              Subscribe <ChevronRight size={10} />
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

// ─── Duration Tabs (scrollable on very small screens) ────────────────────────

function DurationTabs({ durations, active, onChange }) {
  return (
    <div
      className="flex overflow-x-auto scrollbar-none"
      style={{
        background: "rgba(255,255,255,0.03)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        /* Prevent tab bar from wrapping on 320px */
        WebkitOverflowScrolling: "touch",
      }}
    >
      {durations.map(dur => {
        const meta = DURATION_META[dur];
        const isActive = active === dur;
        return (
          <button
            key={dur}
            onClick={() => onChange(dur)}
            className="flex-1 min-w-18 flex flex-col items-center gap-0.5 py-3 px-1 text-xs font-bold relative transition-colors duration-150"
            style={{
              color: isActive ? "#E84A0C" : "rgba(255,255,255,0.35)",
              background: isActive ? "rgba(232,74,12,0.08)" : "transparent",
            }}
          >
            <span className="text-base leading-none">{meta.icon}</span>
            <span className="leading-tight">{meta.label}</span>
            {meta.tag && (
              <span
                className="text-[9px] px-1 py-0.5 rounded font-black"
                style={{
                  background: isActive ? "rgba(232,74,12,0.2)" : "rgba(255,255,255,0.06)",
                  color: isActive ? "#E84A0C" : "rgba(255,255,255,0.22)",
                }}
              >
                {meta.tag}
              </span>
            )}
            {isActive && (
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5"
                style={{ background: "#E84A0C" }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── Active Plan Card ─────────────────────────────────────────────────────────

function ActivePlanCard({ subscription }) {
  const daysLeft     = getDaysRemaining(subscription);
  const expiryLabel  = getExpiryLabel(subscription);
  const progressPct  = expiryProgress(subscription);
  const remainingPct = 100 - progressPct;
  const totalDays    = DURATION_DAYS[subscription.plan?.duration] ?? 30;
  const barColor     = remainingPct > 40 ? "#2E8B2A" : remainingPct > 15 ? "#f97316" : "#ef4444";
  const full         = isFullAccess(subscription);

  return (
    <div
      className="rounded-2xl p-4 sm:p-5"
      style={{
        background: "rgba(46,139,42,0.08)",
        border: "1px solid rgba(46,139,42,0.3)",
      }}
    >
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Ring — smaller on xs */}
        <ExpiryRing
          daysLeft={daysLeft}
          totalDays={totalDays}
          size={52}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-[10px] font-black uppercase tracking-widest"
              style={{ color: "#4ade80" }}
            >
              Active Plan
            </span>
            <span
              className="text-[10px] font-black px-2 py-0.5 rounded-full uppercase"
              style={{
                background: full ? "rgba(232,74,12,0.2)" : "rgba(27,127,196,0.2)",
                color: full ? "#E84A0C" : "#1B7FC4",
              }}
            >
              {full ? "Full" : "Partial"} Access
            </span>
          </div>

          <p className="font-black text-white text-sm sm:text-base mt-0.5 truncate">
            {subscription.plan.name}
          </p>

          <p className="text-xs mt-0.5 leading-snug" style={{ color: "rgba(255,255,255,0.4)" }}>
            Expires{" "}
            {new Date(subscription.end_date).toLocaleDateString("en-KE", {
              day: "numeric", month: "short", year: "numeric",
            })}
            {" · "}
            <span style={{ color: barColor }}>{expiryLabel}</span>
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4">
        <div
          className="w-full h-1.5 rounded-full overflow-hidden"
          style={{ background: "rgba(255,255,255,0.08)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${remainingPct}%`,
              background: barColor,
              boxShadow: `0 0 8px ${barColor}55`,
            }}
          />
        </div>
        <p className="text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.28)" }}>
          {remainingPct}% of plan remaining
        </p>
      </div>
    </div>
  );
}

// ─── No-plan Nudge ────────────────────────────────────────────────────────────

function NoPlanCard() {
  return (
    <div
      className="rounded-2xl p-5 text-center"
      style={{
        background: "rgba(232,74,12,0.08)",
        border: "1px solid rgba(232,74,12,0.25)",
      }}
    >
      <p className="text-3xl mb-2">📚</p>
      <p className="font-black text-white">No Active Plan</p>
      <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>
        Pick a plan below to unlock Notes, Exams, Classes and more.
      </p>
    </div>
  );
}

// ─── Main PricingTab ──────────────────────────────────────────────────────────

export default function PricingTab({ student, subscription }) {
  const [plans, setPlans]               = useState([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [activeDuration, setActiveDuration] = useState("daily");

  useEffect(() => {
    getData("subscription-plans/")
      .then(res => setPlans(res?.results ?? []))
      .catch(err => console.error("Failed to fetch plans:", err))
      .finally(() => setPlansLoading(false));
  }, []);

  const grouped            = groupByDuration(plans);
  const availableDurations = DURATION_ORDER.filter(d => grouped[d]);
  const activePlanId       = subscription?.plan?.id;

  return (
    /* Outer container: full width, no horizontal overflow */
    <div className="space-y-4 w-full overflow-x-hidden">

      {/* ── Plan status ── */}
      {hasActivePlan(subscription)
        ? <ActivePlanCard subscription={subscription} />
        : <NoPlanCard />
      }

      {/* ── Plan browser ── */}
      <div
        className="rounded-2xl overflow-hidden w-full"
        style={{ border: "1px solid rgba(255,255,255,0.07)" }}
      >
        {/* Duration tab bar */}
        {!plansLoading && availableDurations.length > 0 && (
          <DurationTabs
            durations={availableDurations}
            active={activeDuration}
            onChange={setActiveDuration}
          />
        )}

        {/* Cards area */}
        <div
          className="p-3 space-y-2"
          style={{ background: "rgba(10,16,28,0.6)" }}
        >
          {plansLoading ? (
            <>
              <Skeleton h="h-[72px]" />
              <Skeleton h="h-[72px]" />
            </>
          ) : (grouped[activeDuration] ?? []).length === 0 ? (
            <p
              className="text-center text-sm py-8"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              No plans available
            </p>
          ) : (
            (grouped[activeDuration] ?? []).map(plan => (
              <PlanCard
                key={plan.id}
                plan={plan}
                isActive={plan.id === activePlanId}
                onSelect={setSelectedPlan}
              />
            ))
          )}
        </div>
      </div>

      {/* ── M-Pesa footer strip ── */}
      <div
        className="rounded-2xl p-4 flex items-center gap-3"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
          style={{ background: "rgba(46,139,42,0.15)" }}
        >
          📱
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white">Pay via M-Pesa</p>
          <p className="text-xs mt-0.5 leading-snug" style={{ color: "rgba(255,255,255,0.35)" }}>
            Tap any plan · Paybill{" "}
            <strong style={{ color: "rgba(255,255,255,0.65)" }}>{PAYBILL}</strong>
            {" "}· No auto-renewal
          </p>
        </div>
      </div>

      {/* ── Payment modal ── */}
      {selectedPlan && (
        <MpesaModal
          plan={selectedPlan}
          admissionNumber={student?.admission_number ?? ""}
          onClose={() => setSelectedPlan(null)}
        />
      )}
    </div>
  );
}