import React from "react";
import { PRICING } from "../../data/dashboard.data";
import SectionHeader from "./SectionHeader";


export default function PricingTab() {
  return (
    <div className="space-y-6">
      <SectionHeader icon="💳" title="My Plan" subtitle="Pay via M-Pesa — no auto-renewal" accent="#2E8B2A" />

      {/* Current plan */}
      <div className="p-5 rounded-2xl"
        style={{ background: "rgba(46,139,42,0.1)", border: "1px solid rgba(46,139,42,0.35)" }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ background: "rgba(46,139,42,0.2)" }}>⭐</div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#4ade80" }}>Current Plan</p>
            <p className="font-black text-white text-lg">Partial Access</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs text-white/40">Expires</p>
            <p className="font-bold text-white text-sm">{PRICING.expiry}</p>
          </div>
        </div>
        <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
          <div className="h-full rounded-full" style={{ width: `${(PRICING.daysLeft / 30) * 100}%`, background: "#2E8B2A" }} />
        </div>
        <p className="text-white/40 text-xs mt-2">{PRICING.daysLeft} days remaining</p>
      </div>

      {/* Plans */}
      <div className="space-y-3">
        {PRICING.plans.map(plan => (
          <div key={plan.key} className="p-4 rounded-2xl flex items-center gap-4"
            style={{
              background: plan.active ? `${plan.color}15` : "rgba(255,255,255,0.04)",
              border: `1px solid ${plan.active ? plan.color : "rgba(255,255,255,0.08)"}55`,
            }}>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-bold text-white">{plan.name}</p>
                {plan.active && <span className="text-[10px] font-black px-2 py-0.5 rounded-full"
                  style={{ background: plan.color, color: "#fff" }}>ACTIVE</span>}
              </div>
              <p className="text-white/40 text-xs mt-0.5">{plan.desc}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="font-black text-lg" style={{ color: plan.color }}>{plan.price}</p>
              {!plan.active && (
                <button className="mt-1 px-3 py-1 rounded-lg text-xs font-bold"
                  style={{ background: `${plan.color}20`, color: plan.color, border: `1px solid ${plan.color}40` }}>
                  Upgrade
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-2xl text-center"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <p className="text-2xl mb-2">📱</p>
        <p className="text-white font-bold text-sm">Pay via M-Pesa</p>
        <p className="text-white/40 text-xs mt-1">Send to Paybill <span className="font-bold text-white/70">123456</span>, Account: your username</p>
        <p className="text-white/25 text-xs mt-1">Your teacher-admin will confirm your payment</p>
      </div>
    </div>
  );
}