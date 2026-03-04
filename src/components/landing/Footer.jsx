import React from "react";
import { FOOTER_COLS } from "../constants/data";
import LogoMark from "../landing/LogoMark";

export default function Footer() {
  return (
    <>
      <style>{`
        @keyframes floatOrb { from{transform:translateY(0)} to{transform:translateY(-14px)} }
        @keyframes pulseDot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(1.5)} }
        .ft-link {
          color: rgba(253,248,242,0.5);
          font-size: 14px;
          text-decoration: none;
          transition: color 0.2s, padding-left 0.2s;
          display: inline-block;
        }
        .ft-link:hover { color: #FDF8F2; padding-left: 5px; }
        .ft-social {
          width: 36px; height: 36px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(253,248,242,0.06);
          border: 1px solid rgba(253,248,242,0.1);
          font-size: 15px; cursor: pointer;
          transition: background 0.2s, border-color 0.2s, transform 0.2s;
          text-decoration: none;
        }
        .ft-social:hover { background: rgba(232,74,12,0.18); border-color: rgba(232,74,12,0.4); transform: translateY(-2px); }
        .ft-policy-link { color: rgba(253,248,242,0.35); font-size: 13px; text-decoration: none; transition: color 0.2s; }
        .ft-policy-link:hover { color: rgba(253,248,242,0.75); }
      `}</style>

      <footer
        className="relative overflow-hidden px-[5%] pt-20 pb-10"
        style={{ background: "linear-gradient(180deg, #0A1929 0%, #0D1E35 40%, #091520 100%)" }}
      >
        {/* Glow orbs */}
        <div className="absolute -top-20 left-[10%] w-72 h-72 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(232,74,12,0.10) 0%, transparent 70%)", animation: "floatOrb 6s ease-in-out infinite alternate" }} />
        <div className="absolute top-10 right-[8%] w-56 h-56 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(46,139,42,0.09) 0%, transparent 70%)", animation: "floatOrb 8s ease-in-out 1s infinite alternate" }} />

        {/* Top divider with glow */}
        <div className="absolute top-0 left-[5%] right-[5%] h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(232,74,12,0.6) 30%, rgba(46,139,42,0.5) 70%, transparent)" }} />

        <div className="max-w-7xl mx-auto relative z-10">

          {/* Main grid */}
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-12 mb-12">

            {/* Brand column */}
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <LogoMark size={34} />
                <span className="font-bold text-[20px] text-[#FDF8F2]">
                  Hone Your <span style={{ color: "#E84A0C" }}>Marks</span>
                </span>
              </div>
              <p className="text-[14px] font-light leading-[1.75] max-w-65 mb-6"
                style={{ color: "rgba(253,248,242,0.48)" }}>
                Kenya's e-learning platform for secondary school students. Built for holidays. Built for results.
              </p>

              {/* Live status chip */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
                style={{ background: "rgba(46,139,42,0.15)", border: "1px solid rgba(46,139,42,0.3)" }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#2E8B2A", animation: "pulseDot 1.5s ease-in-out infinite", display: "inline-block" }} />
                <span className="text-[11px] font-medium" style={{ color: "rgba(253,248,242,0.7)" }}>Platform live · Classes today</span>
              </div>

              {/* Socials */}
              <div className="flex gap-2.5">
                {[["𝕏", "#"], ["in", "#"], ["📘", "#"], ["▶", "#"]].map(([icon, href], i) => (
                  <a key={i} href={href} className="ft-social">{icon}</a>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {FOOTER_COLS.map(col => (
              <div key={col.title}>
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-1 h-4 rounded-full" style={{ background: "#E84A0C" }} />
                  <span className="font-bold text-[11px] tracking-[.16em] uppercase"
                    style={{ color: "rgba(253,248,242,0.55)" }}>
                    {col.title}
                  </span>
                </div>
                <ul className="flex flex-col gap-3">
                  {col.links.map(link => (
                    <li key={link}>
                      <a href="#" className="ft-link">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="flex flex-wrap justify-between items-center gap-4 pt-6"
            style={{ borderTop: "1px solid rgba(253,248,242,0.07)" }}>
            <span className="text-[13px]" style={{ color: "rgba(253,248,242,0.3)" }}>
              © 2025 Hone Your Marks · Built by <span style={{ color: "rgba(253,248,242,0.5)" }}>Zafrika Tech Lab</span>
            </span>
            <div className="flex gap-5">
              {["Privacy Policy", "Terms of Use", "Cookie Policy"].map(p => (
                <a key={p} href="#" className="ft-policy-link">{p}</a>
              ))}
            </div>
          </div>

        </div>
      </footer>
    </>
  );
}