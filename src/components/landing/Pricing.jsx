import { useState } from "react";
import {
  FREE_FEATURES,
  PARTIAL_FEATURES,
  FULL_FEATURES,
  DURATIONS,
  PRICES,
} from "../constants/data";
import BtnPrimary from "../landing/BtnPrimary";
import Eyebrow from "../landing/Eyebrow";

// ─── Small reusable components ────────────────────────────────────────────────

function FeatureItem({ children, accent = "#2E8B2A" }) {
  return (
    <li className="font-body text-[14px] flex items-start gap-2.5 leading-[1.6]">
      <span style={{ color: accent, marginTop: 2, flexShrink: 0 }}>✓</span>
      <span>{children}</span>
    </li>
  );
}

function DurationToggle({ durations, active, onChange }) {
  return (
    <div
      className="inline-flex rounded-full p-1 gap-1"
      style={{ background: "rgba(27,47,78,0.08)", border: "1px solid rgba(27,47,78,0.12)" }}
      role="group"
      aria-label="Billing duration"
    >
      {durations.map(({ key, label }) => {
        const isActive = active === key;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className="font-body font-semibold text-[13px] px-5 py-2 rounded-full transition-all duration-200"
            style={{
              background:  isActive ? "#1B2F4E" : "transparent",
              color:       isActive ? "#FDF8F2" : "#4A5568",
              cursor:      "pointer",
              border:      "none",
              letterSpacing: "0.02em",
            }}
            aria-pressed={isActive}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

function SavingsBadge({ duration }) {
  const badges = { weekly: null, monthly: "Save ~40%", annual: "Best Value" };
  const badge = badges[duration];
  if (!badge) return null;
  return (
    <span
      className="font-body font-bold text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full ml-2"
      style={{ background: "#E84A0C", color: "#fff", verticalAlign: "middle" }}
    >
      {badge}
    </span>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────

export default function Pricing() {
  const [duration, setDuration] = useState("monthly");

  const fmt = (n) =>
    `KSh ${n.toLocaleString("en-KE")}`;

  const periodLabel = { weekly: "/ week", monthly: "/ month", annual: "/ year" }[duration];

  return (
    <section id="pricing" className="py-28 px-[5%]" style={{ background: "#FDF8F2" }}>
      <div className="max-w-5xl mx-auto">

        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <div className="text-center mb-12">
          <Eyebrow>Simple Pricing</Eyebrow>
          <h2
            className="font-display font-black leading-[1.1] mb-4"
            style={{ fontSize: "clamp(30px, 4vw, 50px)", color: "#1B2F4E" }}
          >
            Knowledge Shouldn't<br />
            <em style={{ color: "#2E8B2A" }}>Break the Bank.</em>
          </h2>
          <p
            className="font-body font-light text-[16px] leading-[1.75] max-w-lg mx-auto mb-8"
            style={{ color: "#4A5568" }}
          >
            Fees confirmed by your teacher — no hidden charges, no automatic billing.
            Pay via M-Pesa and get access instantly.
          </p>

          {/* Duration toggle */}
          <DurationToggle
            durations={DURATIONS}
            active={duration}
            onChange={setDuration}
          />
        </div>

        {/* ── Cards ──────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left items-stretch">

          {/* Free / Preview ────────────────────────────────────────────────── */}
          <div
            className="flex flex-col p-8"
            style={{
              background: "#fff",
              border: "1.5px solid rgba(27,47,78,0.1)",
            }}
          >
            <div
              className="font-body font-bold text-[11px] tracking-[.14em] uppercase mb-3"
              style={{ color: "#718096" }}
            >
              Preview
            </div>
            <div
              className="font-display font-black text-[42px] leading-none mb-1"
              style={{ color: "#1B2F4E" }}
            >
              Free
            </div>
            <p
              className="font-body text-[13.5px] leading-[1.65] mb-6 mt-2"
              style={{ color: "#718096" }}
            >
              Browse and explore before committing. No payment required.
            </p>

            <ul className="flex flex-col gap-2.5 mb-8 flex-1">
              {FREE_FEATURES.map((f) => (
                <FeatureItem key={f} accent="#718096">{f}</FeatureItem>
              ))}
            </ul>

            <button
              className="w-full py-3.5 font-body font-semibold text-[14px] transition-all duration-200 hover:bg-[#1B2F4E] hover:text-[#FDF8F2]"
              style={{
                border: "1.5px solid #1B2F4E",
                color: "#1B2F4E",
                background: "transparent",
                cursor: "pointer",
                letterSpacing: "0.02em",
              }}
              onClick={() => (window.location.href = "/login")}
            >
              Get Started Free
            </button>
          </div>

          {/* Partial Access ─────────────────────────────────────────────────── */}
          <div
            className="flex flex-col p-8"
            style={{
              background: "#fff",
              border: "1.5px solid rgba(27,47,78,0.15)",
            }}
          >
            <div
              className="font-body font-bold text-[11px] tracking-[.14em] uppercase mb-3"
              style={{ color: "#2E8B2A" }}
            >
              Partial Access
            </div>
            <div className="flex items-end gap-1 mb-1">
              <span
                className="font-display font-black leading-none"
                style={{ fontSize: 38, color: "#1B2F4E" }}
              >
                {fmt(PRICES.partial[duration])}
              </span>
            </div>
            <div
              className="font-body text-[13px] mb-2"
              style={{ color: "#718096" }}
            >
              {periodLabel}
              <SavingsBadge duration={duration} />
            </div>
            <p
              className="font-body text-[13.5px] leading-[1.65] mb-6"
              style={{ color: "#718096" }}
            >
              Choose specific subjects or topics. Great for focused revision.
            </p>

            <ul className="flex flex-col gap-2.5 mb-8 flex-1">
              {PARTIAL_FEATURES.map((f) => (
                <FeatureItem key={f} accent="#2E8B2A">{f}</FeatureItem>
              ))}
            </ul>

            <button
              className="w-full py-3.5 font-body font-semibold text-[14px] transition-all duration-200 hover:bg-[#1B2F4E] hover:text-[#FDF8F2]"
              style={{
                border: "1.5px solid #1B2F4E",
                color: "#1B2F4E",
                background: "transparent",
                cursor: "pointer",
                letterSpacing: "0.02em",
              }}
              onClick={() => (window.location.href = "/login")}
            >
              Choose Subjects →
            </button>
          </div>

          {/* Full Access ────────────────────────────────────────────────────── */}
          <div
            className="relative flex flex-col p-8 overflow-hidden"
            style={{ background: "#1B2F4E" }}
          >
            {/* Most popular badge */}
            <div
              className="absolute top-0 right-0 px-4 py-1.5 font-body font-bold text-[10px] text-white tracking-widest uppercase"
              style={{ background: "#E84A0C" }}
            >
              Most Popular
            </div>

            <div
              className="font-body font-bold text-[11px] tracking-[.14em] uppercase mb-3"
              style={{ color: "rgba(253,248,242,0.45)" }}
            >
              Full Access
            </div>
            <div className="flex items-end gap-1 mb-1">
              <span
                className="font-display font-black leading-none"
                style={{ fontSize: 38, color: "#FDF8F2" }}
              >
                {fmt(PRICES.full[duration])}
              </span>
            </div>
            <div
              className="font-body text-[13px] mb-2"
              style={{ color: "rgba(253,248,242,0.45)" }}
            >
              {periodLabel}
              <SavingsBadge duration={duration} />
            </div>
            <p
              className="font-body text-[13.5px] leading-[1.65] mb-6"
              style={{ color: "rgba(253,248,242,0.6)" }}
            >
              Unrestricted access to everything. Pay via M-Pesa, confirmed instantly.
            </p>

            <ul className="flex flex-col gap-2.5 mb-8 flex-1">
              {FULL_FEATURES.map((f) => (
                <FeatureItem key={f} accent="#E84A0C">
                  <span style={{ color: "rgba(253,248,242,0.88)" }}>{f}</span>
                </FeatureItem>
              ))}
            </ul>

            <BtnPrimary
              style={{
                width: "100%",
                padding: "13px",
                fontSize: 14,
                clipPath: "none",
                textAlign: "center",
                display: "block",
                letterSpacing: "0.02em",
                fontWeight: 600,
              }}
              onClick={() => (window.location.href = "/login")}
            >
              Unlock Full Access →
            </BtnPrimary>
          </div>
        </div>

        {/* ── Footer note ────────────────────────────────────────────────────── */}
        <p
          className="text-center font-body text-[13px] mt-8"
          style={{ color: "#718096" }}
        >
          All plans are manually confirmed by your teacher-admin. Duration auto-expires —{" "}
          <strong style={{ color: "#1B2F4E" }}>no automatic renewal.</strong>
        </p>
      </div>
    </section>
  );
}