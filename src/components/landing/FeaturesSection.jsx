import React from "react";
import { FEATURES } from "../constants/data";
import Eyebrow from "../landing/Eyebrow";

export default function FeaturesSection() {
  return (
    <section id="features" className="py-25 px-[5%]" style={{ background: "#FDF8F2" }}>
      <div className="max-w-300 mx-auto">
        {/* Heading */}
        <div className="mb-16 max-w-140">
          <Eyebrow>Everything You Need</Eyebrow>
          <h2
            className="font-display font-black leading-[1.1]"
            style={{ fontSize: "clamp(32px, 4.5vw, 54px)", color: "#1B2F4E" }}
          >
            One Platform.<br />
            <em style={{ color: "#2E8B2A" }}>Infinite</em> Possibilities.
          </h2>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map(feature => (
            <div
              key={feature.title}
              className="feat-card bg-white p-8 border border-[rgba(27,47,78,0.08)]"
              style={{ "--accent": feature.accent }}
            >
              <div className="text-[36px] mb-5">{feature.icon}</div>
              <h3 className="font-display font-bold text-[22px] mb-2.5" style={{ color: "#1B2F4E" }}>
                {feature.title}
              </h3>
              <p className="font-body font-light text-[14px] leading-[1.75]" style={{ color: "#4A5568" }}>
                {feature.desc}
              </p>
              <div
                className="mt-5 font-body font-semibold text-[13px] flex items-center gap-1.5 cursor-pointer"
                style={{ color: feature.accent }}
              >
                Learn more <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}