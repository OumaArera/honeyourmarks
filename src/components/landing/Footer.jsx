import React from "react";
import { Link } from "react-router-dom";
import { FOOTER_COLS, POLICY_LINKS } from "../constants/data";
import LogoMark from "../landing/LogoMark";
import { Youtube } from "lucide-react";

// ─── Custom SVG icons not in Lucide ──────────────────────────────────────────

function IconX() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function IconFacebook() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
    </svg>
  );
}

function IconInstagram() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  );
}

function IconTikTok() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
    </svg>
  );
}

// ─── Social links ─────────────────────────────────────────────────────────────

const SOCIALS = [
  { icon: IconFacebook,  label: "Facebook",  href: "#" },
  { icon: IconTikTok,    label: "TikTok",    href: "#" },
  { icon: IconX,         label: "X",         href: "#" },
  { icon: IconInstagram, label: "Instagram", href: "#" },
  { icon: Youtube,       label: "YouTube",   href: "#", size: 16 },
];

// ─── Footer ───────────────────────────────────────────────────────────────────

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
          cursor: pointer; text-decoration: none;
          color: rgba(253,248,242,0.65);
          transition: background 0.2s, border-color 0.2s, transform 0.2s, color 0.2s;
        }
        .ft-social:hover {
          background: rgba(232,74,12,0.18);
          border-color: rgba(232,74,12,0.4);
          transform: translateY(-2px);
          color: #FDF8F2;
        }
        .ft-policy-link {
          color: rgba(253,248,242,0.35);
          font-size: 13px;
          text-decoration: none;
          transition: color 0.2s;
        }
        .ft-policy-link:hover { color: rgba(253,248,242,0.75); }
        .ft-zafrika { color: rgba(253,248,242,0.5); text-decoration: none; transition: color 0.2s; }
        .ft-zafrika:hover { color: #E84A0C; }
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
              <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: "10px", textDecoration: "none", marginBottom: "16px" }}>
                <LogoMark size={34} />
                <span className="font-bold text-[20px] text-[#FDF8F2]">
                  Hone Your <span style={{ color: "#E84A0C" }}>Marks</span>
                </span>
              </Link>

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
                {SOCIALS.map(({ icon: Icon, label, href, size }) => (
                  <a key={label} href={href} className="ft-social" aria-label={label} target="_blank" rel="noopener noreferrer">
                    <Icon size={size ?? 15} />
                  </a>
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
                <ul className="flex flex-col gap-3" style={{ listStyle: "none", margin: 0, padding: 0 }}>
                  {col.links.map(({ label, to }) => (
                    <li key={label}>
                      <Link to={to} className="ft-link">{label}</Link>
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
              © 2025 Hone Your Marks · Built by{" "}
              <a
                href="https://zafrika.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="ft-zafrika"
              >
                Zafrika Tech Lab
              </a>
            </span>
            <div className="flex gap-5">
              {POLICY_LINKS.map(({ label, to }) => (
                <Link key={label} to={to} className="ft-policy-link">{label}</Link>
              ))}
            </div>
          </div>

        </div>
      </footer>
    </>
  );
}