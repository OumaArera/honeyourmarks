import React, { useEffect, useRef } from "react";
import BtnPrimary from "./BtnPrimary";



function BtnOutline({ children, className = "", onClick }) {
  return (
    <button
    onClick={onClick}
      className={`font-medium text-[#FDF8F2] transition-all duration-200
        border border-[rgba(253,248,242,0.45)]
        hover:border-[#FDF8F2] hover:bg-[rgba(253,248,242,0.08)] ${className}`}
      style={{ background: "transparent", cursor: "pointer", letterSpacing: ".4px" }}
    >
      {children}
    </button>
  );
}

// ─── Animated Particle Canvas ────────────────────────────────────────────────

function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 55 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.4,
      dx: (Math.random() - 0.5) * 0.35,
      dy: (Math.random() - 0.5) * 0.35,
      opacity: Math.random() * 0.5 + 0.15,
      color: Math.random() > 0.6 ? "232,74,12" : Math.random() > 0.5 ? "46,139,42" : "253,248,242",
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${p.opacity})`;
        ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(253,248,242,${(1 - dist / 120) * 0.1})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.75 }} />;
}

// ─── Floating Subject Cards ───────────────────────────────────────────────────

const SUBJECTS = [
  { icon: "📐", label: "Mathematics", sub: "Grade 6–Form 4", color: "#E84A0C", delay: "0s" },
  { icon: "🔬", label: "Sciences", sub: "Physics · Chem · Bio", color: "#2E8B2A", delay: "0.8s" },
  { icon: "📚", label: "Languages", sub: "English · Kiswahili", color: "#1B7FC4", delay: "1.4s" },
  { icon: "🌍", label: "Humanities", sub: "History · Geography", color: "#9B6B2A", delay: "2s" },
];

function SubjectCard({ icon, label, sub, color, delay }) {
  return (
    <div
      className="flex items-center gap-3 rounded-xl px-4 py-3"
      style={{
        background: "rgba(255,255,255,0.05)",
        border: `1px solid ${color}44`,
        boxShadow: `0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.07)`,
        backdropFilter: "blur(8px)",
        animation: `floatCard 4s ease-in-out ${delay} infinite alternate`,
      }}
    >
      <span style={{ fontSize: 24 }}>{icon}</span>
      <div>
        <p className="text-[13px] font-semibold text-[#FDF8F2] leading-tight">{label}</p>
        <p className="text-[10px]" style={{ color: "rgba(253,248,242,0.45)" }}>{sub}</p>
      </div>
      <div className="ml-auto w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
    </div>
  );
}

// ─── Dashboard Mock ───────────────────────────────────────────────────────────

function DashboardMock() {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden"
      style={{ background: "rgba(13,20,32,0.9)", border: "1px solid rgba(255,255,255,0.09)", boxShadow: "0 32px 80px rgba(0,0,0,0.55)", backdropFilter: "blur(16px)" }}>
      {/* Window chrome */}
      <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.03)" }}>
        <span className="w-3 h-3 rounded-full" style={{ background: "#E84A0C" }} />
        <span className="w-3 h-3 rounded-full" style={{ background: "#E8A00C" }} />
        <span className="w-3 h-3 rounded-full" style={{ background: "#2E8B2A" }} />
        <span className="ml-auto text-[11px]" style={{ color: "rgba(253,248,242,0.28)" }}>EduEdge Dashboard</span>
      </div>
      <div className="p-4 space-y-3">
        {/* Welcome */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-[16px]" style={{ background: "linear-gradient(135deg,#E84A0C,#c73d09)" }}>👋</div>
          <div>
            <p className="text-[12px] font-semibold text-[#FDF8F2]">Welcome back, Amara!</p>
            <p className="text-[10px]" style={{ color: "rgba(253,248,242,0.4)" }}>Form 3 · KCSE Prep</p>
          </div>
          <div className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(46,139,42,0.2)", color: "#4ade80" }}>🔥 14-day streak</div>
        </div>

        {/* Progress */}
        <div className="rounded-xl p-3 space-y-2" style={{ background: "rgba(255,255,255,0.04)" }}>
          <p className="text-[11px] font-semibold text-[#FDF8F2] mb-2">Today's Progress</p>
          {[{ s: "Mathematics", p: 75, c: "#E84A0C" }, { s: "Chemistry", p: 50, c: "#2E8B2A" }, { s: "English", p: 90, c: "#1B7FC4" }].map(({ s, p, c }) => (
            <div key={s}>
              <div className="flex justify-between mb-1">
                <span className="text-[10px]" style={{ color: "rgba(253,248,242,0.55)" }}>{s}</span>
                <span className="text-[10px] font-bold" style={{ color: c }}>{p}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                <div className="h-full rounded-full" style={{ width: `${p}%`, background: `linear-gradient(90deg,${c},${c}bb)`, boxShadow: `0 0 8px ${c}77` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Live class */}
        <div className="rounded-xl p-3 flex items-center gap-3" style={{ background: "rgba(232,74,12,0.1)", border: "1px solid rgba(232,74,12,0.22)" }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[14px]" style={{ background: "rgba(232,74,12,0.2)" }}>📡</div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold text-[#FDF8F2] truncate">Live: Quadratic Equations</p>
            <p className="text-[10px]" style={{ color: "rgba(253,248,242,0.42)" }}>Starts in 12 minutes · Mr. Omondi</p>
          </div>
          <span className="w-2 h-2 rounded-full" style={{ background: "#E84A0C", boxShadow: "0 0 6px #E84A0C", animation: "pulseDot 1.5s ease-in-out infinite", flexShrink: 0 }} />
        </div>

        {/* Leaderboard */}
        <div className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.04)" }}>
          <p className="text-[11px] font-semibold text-[#FDF8F2] mb-2">🏆 Class Leaderboard</p>
          {[{ r: 1, n: "Amara W.", p: 2840, you: true }, { r: 2, n: "Brian K.", p: 2710 }, { r: 3, n: "Cynthia M.", p: 2650 }].map(({ r, n, p, you }) => (
            <div key={r} className="flex items-center gap-2 py-1 px-1.5 rounded" style={you ? { background: "rgba(232,74,12,0.1)" } : {}}>
              <span className="text-[10px] font-bold w-4 text-center" style={{ color: r === 1 ? "#F59E0B" : "rgba(253,248,242,0.35)" }}>{r}</span>
              <span className="text-[11px] flex-1" style={{ color: you ? "#FDF8F2" : "rgba(253,248,242,0.55)" }}>
                {n} {you && <span className="text-[9px] text-[#E84A0C]">YOU</span>}
              </span>
              <span className="text-[10px] font-bold" style={{ color: "rgba(253,248,242,0.45)" }}>{p.toLocaleString()} pts</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Stats ────────────────────────────────────────────────────────────────────

const STATS = [
  { value: "47K+", label: "Active Students" },
  { value: "1,200+", label: "Practice Questions" },
  { value: "98%", label: "Curriculum Aligned" },
  { value: "4.9★", label: "Student Rating" },
];

// ─── Hero ─────────────────────────────────────────────────────────────────────

export default function Hero() {
  return (
    <>
      <style>{`
        @keyframes floatCard { from { transform: translateY(0px); } to { transform: translateY(-10px); } }
        @keyframes pulseDot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(1.5)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(26px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideRight { from{opacity:0;transform:translateX(40px)} to{opacity:1;transform:translateX(0)} }
        @keyframes badgePop { from{opacity:0;transform:scale(0.85)} to{opacity:1;transform:scale(1)} }
        @keyframes spinRing { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .a-badge  { animation: badgePop  0.5s cubic-bezier(.34,1.56,.64,1) 0.1s both; }
        .a-h1     { animation: fadeUp    0.7s ease 0.2s both; }
        .a-sub    { animation: fadeUp    0.7s ease 0.35s both; }
        .a-cta    { animation: fadeUp    0.7s ease 0.5s both; }
        .a-chips  { animation: fadeUp    0.7s ease 0.65s both; }
        .a-stats  { animation: fadeUp    0.7s ease 0.8s both; }
        .a-right  { animation: slideRight 0.9s ease 0.25s both; }
      `}</style>

      <section
        className="relative min-h-screen flex flex-col justify-center overflow-hidden px-[5%] pt-28 pb-20"
        style={{ background: "linear-gradient(135deg, #0D1E35 0%, #1B2F4E 55%, #0F2A1A 100%)" }}
      >
        {/* Particle network */}
        <ParticleCanvas />

        {/* Diagonal texture */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: "repeating-linear-gradient(-45deg,transparent,transparent 8px,rgba(253,248,242,1) 8px,rgba(253,248,242,1) 9px)" }} />

        {/* Glow blobs */}
        <div className="absolute -bottom-40 -left-40 w-150 h-150 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(232,74,12,0.18) 0%, transparent 65%)" }} />
        <div className="absolute top-0 right-[8%] w-125 h-125 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(46,139,42,0.13) 0%, transparent 65%)" }} />

        {/* Decorative rings */}
        <div className="absolute top-[10%] right-[3%] w-72 h-72 rounded-full pointer-events-none"
          style={{ border: "1px solid rgba(232,74,12,0.18)", animation: "floatCard 7s ease-in-out infinite alternate" }} />
        <div className="absolute top-[14%] right-[6%] w-52 h-52 rounded-full pointer-events-none"
          style={{ border: "1px solid rgba(46,139,42,0.14)", animation: "floatCard 9s ease-in-out 1.5s infinite alternate" }} />
        <div className="absolute bottom-[20%] left-[2%] w-40 h-40 rounded-full pointer-events-none"
          style={{ border: "1px dashed rgba(253,248,242,0.07)", animation: "spinRing 20s linear infinite" }} />

        {/* Two-column layout */}
        <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* LEFT */}
          <div className="flex-1 min-w-0">
            <div className="a-badge inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-7"
              style={{ background: "rgba(232,74,12,0.15)", border: "1px solid rgba(232,74,12,0.4)" }}>
              <span className="w-2 h-2 rounded-full" style={{ background: "#E84A0C", animation: "pulseDot 1.5s ease-in-out infinite", display: "inline-block" }} />
              <span className="text-[13px] font-medium tracking-[.08em]" style={{ color: "rgba(253,248,242,0.9)" }}>
                KENYA'S ACADEMIC EDGE PLATFORM
              </span>
            </div>

            <h1 className="a-h1 font-black leading-[1.04] text-[#FDF8F2] max-w-2xl mb-7"
              style={{ fontSize: "clamp(40px, 6vw, 80px)" }}>
              Your Best<br />
              <em style={{ color: "#E84A0C", fontStyle: "normal", textShadow: "0 0 40px rgba(232,74,12,0.35)" }}>Mark</em>{" "}
              Is Still<br />
              Ahead of You.
            </h1>

            <p className="a-sub font-light leading-[1.75] mb-10 max-w-lg"
              style={{ fontSize: "clamp(15px, 1.7vw, 19px)", color: "rgba(253,248,242,0.7)" }}>
              Live classes, gamified exercises, expert notes, and teacher-marked revision — all in one platform built for Kenyan students from{" "}
              <strong style={{ color: "rgba(253,248,242,0.92)", fontWeight: 600 }}>Grade 6 to Grade 12 </strong>,
              <strong style={{ color: "rgba(253,248,242,0.92)", fontWeight: 600 }}>Form 3 to Form 4</strong>.
            </p>

            <div className="a-cta flex flex-wrap gap-4 items-center mb-10">
              <BtnPrimary style={{ fontSize: 16, padding: "16px 38px" }} onClick={() => window.location.href = "/login"}>
                Start Learning Free →
              </BtnPrimary>
              <BtnOutline className="px-8 py-4 text-[15px]" onClick={() => window.location.href = "/tutorial"}>▶ Watch How It Works</BtnOutline>
            </div>

            <div className="a-chips flex flex-wrap gap-8 mb-10">
              {["✓ No credit card needed", "✓ Ready in 5 minutes", "✓ 100% Kenya curriculum"].map(chip => (
                <span key={chip} className="text-[13px]" style={{ color: "rgba(253,248,242,0.5)" }}>{chip}</span>
              ))}
            </div>

            <div className="a-stats flex flex-wrap gap-8" style={{ borderTop: "1px solid rgba(253,248,242,0.08)", paddingTop: 22 }}>
              {STATS.map(({ value, label }) => (
                <div key={label}>
                  <p className="text-[22px] font-black text-[#FDF8F2] leading-none"
                    style={{ textShadow: "0 0 20px rgba(232,74,12,0.28)" }}>{value}</p>
                  <p className="text-[11px] mt-1 tracking-wide" style={{ color: "rgba(253,248,242,0.42)" }}>{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="a-right shrink-0 w-full max-w-sm lg:max-w-md flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              {SUBJECTS.map(s => <SubjectCard key={s.label} {...s} />)}
            </div>
            <DashboardMock />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-10">
          <span className="text-[11px] tracking-[.2em]" style={{ color: "rgba(253,248,242,0.3)" }}>SCROLL</span>
          <div className="w-px h-10" style={{ background: "linear-gradient(to bottom, rgba(232,74,12,0.8), transparent)" }} />
        </div>
      </section>
    </>
  );
}