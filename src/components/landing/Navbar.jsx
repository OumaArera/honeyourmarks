import { useState, useEffect } from "react";
import { NAV_LINKS } from "../constants/data";
import LogoMark from "../landing/LogoMark";
import BtnPrimary from "../landing/BtnPrimary";

// ─── Font import (add once to your index.html or global CSS instead if preferred) ───
// <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet">
// Then set in your Tailwind config:
//   fontFamily: { display: ["Playfair Display", "serif"], body: ["DM Sans", "sans-serif"] }

export default function Navbar() {
  const [scrolled,   setScrolled]   = useState(false);
  const [menuOpen,   setMenuOpen]   = useState(false);

  // ── Scroll detection ──────────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Lock body scroll when mobile menu is open ─────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const navBg = scrolled
    ? "rgba(14, 26, 46, 0.97)"
    : "transparent";

  return (
    <>
      {/* ── Main bar ──────────────────────────────────────────────────────────── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 px-[5%] transition-all duration-300"
        style={{
          background:           navBg,
          backdropFilter:       scrolled ? "blur(18px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(18px)" : "none",
          borderBottom:         scrolled ? "1px solid rgba(255,255,255,0.07)" : "none",
          boxShadow:            scrolled ? "0 6px 32px rgba(0,0,0,0.3)"       : "none",
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between h-20">

          {/* Brand ──────────────────────────────────────────────────────────── */}
          <a
            href="/"
            className="flex items-center gap-3 group no-underline"
            aria-label="Hone Your Marks — home"
          >
            <LogoMark size={46} />
            <span
              className="font-display font-extrabold text-[#FDF8F2] transition-opacity duration-200 group-hover:opacity-80 leading-none"
              style={{ fontSize: "20px", letterSpacing: "-0.02em" }}
            >
              Hone Your{" "}
              <span style={{ color: "#E84A0C" }}>Marks</span>
            </span>
          </a>

          {/* Desktop nav ─────────────────────────────────────────────────────── */}
          <div className="hidden md:flex items-center gap-9">
            {NAV_LINKS.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase().replace(/ /g, "-")}`}
                className="font-body font-medium text-[#A8B8D0] hover:text-white transition-colors duration-200"
                style={{ fontSize: "13.5px", letterSpacing: "0.04em" }}
              >
                {link}
              </a>
            ))}
            <BtnPrimary
              style={{ padding: "9px 22px", fontSize: 13.5, letterSpacing: "0.03em", fontWeight: 600 }}
              onClick={() => (window.location.href = "/login")}
            >
              Get Started Free
            </BtnPrimary>
          </div>

          {/* Hamburger (mobile only) ─────────────────────────────────────────── */}
          <button
            className="md:hidden flex flex-col justify-center items-center gap-1.25 w-10 h-10 rounded-lg transition-colors duration-200 hover:bg-white/10"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <span
              className="block w-5 h-[1.5px] bg-[#FDF8F2] transition-all duration-300 origin-center"
              style={{ transform: menuOpen ? "translateY(6.5px) rotate(45deg)" : "none" }}
            />
            <span
              className="block w-5 h-[1.5px] bg-[#FDF8F2] transition-all duration-300"
              style={{ opacity: menuOpen ? 0 : 1 }}
            />
            <span
              className="block w-5 h-[1.5px] bg-[#FDF8F2] transition-all duration-300 origin-center"
              style={{ transform: menuOpen ? "translateY(-6.5px) rotate(-45deg)" : "none" }}
            />
          </button>
        </div>
      </nav>

      {/* ── Mobile drawer ─────────────────────────────────────────────────────── */}
      <div
        className="fixed inset-0 z-40 md:hidden transition-all duration-300 pointer-events-none"
        style={{
          background:   menuOpen ? "rgba(8,16,32,0.85)" : "transparent",
          backdropFilter: menuOpen ? "blur(6px)" : "none",
          pointerEvents: menuOpen ? "auto" : "none",
        }}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />
      <div
        className="fixed top-0 right-0 bottom-0 z-40 md:hidden flex flex-col pt-24 pb-10 px-8 transition-transform duration-300 ease-in-out"
        style={{
          width:      "min(320px, 85vw)",
          background: "rgba(14, 26, 46, 0.98)",
          borderLeft: "1px solid rgba(255,255,255,0.08)",
          transform:  menuOpen ? "translateX(0)" : "translateX(100%)",
        }}
        aria-hidden={!menuOpen}
      >
        {/* Mobile links */}
        <nav className="flex flex-col gap-1 flex-1">
          {NAV_LINKS.map((link, i) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(/ /g, "-")}`}
              onClick={() => setMenuOpen(false)}
              className="font-body font-medium text-[#A8B8D0] hover:text-white transition-colors duration-200 py-3 border-b border-white/5"
              style={{
                fontSize: "15px",
                letterSpacing: "0.05em",
                transitionDelay: menuOpen ? `${i * 40}ms` : "0ms",
              }}
            >
              {link}
            </a>
          ))}
        </nav>

        {/* Mobile CTA */}
        <BtnPrimary
          style={{ width: "100%", padding: "13px 0", fontSize: 14, fontWeight: 600, textAlign: "center", marginTop: "auto" }}
          onClick={() => (window.location.href = "/login")}
        >
          Get Started Free
        </BtnPrimary>
      </div>
    </>
  );
}