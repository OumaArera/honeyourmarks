import React from "react";
import { HOW_STEPS } from "../constants/data";
import Eyebrow from "../landing/Eyebrow";


export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative py-25 px-[5%] overflow-hidden"
      style={{ background: "#1B2F4E" }}
    >
      <div className="stripe-bg absolute inset-0 opacity-[0.04]" />

      <div className="max-w-300 mx-auto relative z-10">
        {/* Heading */}
        <div className="text-center mb-18">
          <Eyebrow>The Journey</Eyebrow>
          <h2
            className="font-display font-black leading-[1.1] text-[#FDF8F2]"
            style={{ fontSize: "clamp(32px, 4.5vw, 54px)" }}
          >
            From Sign-Up to<br />
            <em style={{ color: "#E84A0C" }}>Top of the Class</em>
          </h2>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {HOW_STEPS.map((step, i) => (
            <div key={step.n} className="text-center relative">
              {/* Ghost step number */}
              <span
                className="font-display font-black absolute -top-3 left-1/2 -translate-x-1/2 leading-none select-none pointer-events-none"
                style={{ fontSize: 52, color: "rgba(253,248,242,0.05)" }}
              >
                {step.n}
              </span>

              {/* Icon circle */}
              <div
                className="w-18 h-18 rounded-full flex items-center justify-center text-[28px] mx-auto mb-5"
                style={{ background: i % 2 === 0 ? "#E84A0C" : "#2E8B2A" }}
              >
                {step.icon}
              </div>

              <h3 className="font-display font-bold text-[22px] text-[#FDF8F2] mb-3">{step.title}</h3>
              <p className="font-body font-light text-[14px] leading-[1.75]" style={{ color: "rgba(253,248,242,0.6)" }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}