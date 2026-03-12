import React, { useState } from "react";
import { ShieldCheck, Lock, Eye, Database, UserCheck, Bell, Mail, ChevronDown } from "lucide-react";
import LogoMark from "../components/landing/LogoMark";

// ─── Data ─────────────────────────────────────────────────────────────────────

const SECTIONS = [
  {
    icon: Database,
    color: "#60a5fa",
    bg: "rgba(96,165,250,0.1)",
    title: "What We Collect",
    body: `We collect only what is necessary to deliver your learning experience. This includes your name, email address, date of birth, school details, and academic progress data. We do not collect sensitive personal data beyond what is required for registration and platform functionality. Payment information is processed by certified third-party providers and is never stored on our servers.`,
  },
  {
    icon: Eye,
    color: "#4ade80",
    bg: "rgba(74,222,128,0.1)",
    title: "How We Use Your Data",
    body: `Your data is used exclusively to personalise your learning journey, deliver virtual classes, track academic progress, and communicate important platform updates. We do not use your data for profiling, advertising, or any purpose unrelated to your education. Aggregated, anonymised data may be used to improve platform performance and content quality.`,
  },
  {
    icon: Lock,
    color: "#E84A0C",
    bg: "rgba(232,74,12,0.1)",
    title: "How We Protect It",
    body: `All data is encrypted in transit using TLS and at rest using AES-256 encryption. Access to personal data is restricted to authorised personnel only, governed by strict role-based access controls. We conduct regular security audits and vulnerability assessments to ensure your data remains safe at all times.`,
  },
  {
    icon: UserCheck,
    color: "#facc15",
    bg: "rgba(250,204,21,0.1)",
    title: "Your Rights",
    body: `Under the Kenya Data Protection Act 2019 and applicable regulations, you have the right to access, correct, or request deletion of your personal data at any time. You may also object to or restrict certain processing activities. Requests can be submitted through your profile settings or by contacting us directly. We will respond within 30 days.`,
  },
  {
    icon: Bell,
    color: "#c084fc",
    bg: "rgba(192,132,252,0.1)",
    title: "Cookies & Tracking",
    body: `We use strictly necessary cookies to keep you signed in and maintain session security. With your consent, we use analytics cookies to understand how the platform is used and where we can improve. We do not use third-party advertising cookies. You may adjust your cookie preferences at any time through your browser settings.`,
  },
  {
    icon: Mail,
    color: "#34d399",
    bg: "rgba(52,211,153,0.1)",
    title: "Contact & Complaints",
    body: `If you have questions, concerns, or a complaint about how we handle your data, please contact our Data Protection Officer at privacy@honeyourmarks.ac.ke. If you are unsatisfied with our response, you have the right to lodge a complaint with the Office of the Data Protection Commissioner of Kenya.`,
  },
];

// ─── Accordion item ───────────────────────────────────────────────────────────

function AccordionItem({ section, index }) {
  const [open, setOpen] = useState(false);
  const Icon = section.icon;

  return (
    <div
      style={{
        borderRadius: "14px", overflow: "hidden",
        background: open ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${open ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.06)"}`,
        transition: "background 0.2s, border-color 0.2s",
      }}
    >
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: "100%", display: "flex", alignItems: "center", gap: "14px",
          padding: "16px", background: "none", border: "none", cursor: "pointer",
          textAlign: "left",
        }}
      >
        {/* Number + icon */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
          <span style={{ fontSize: "10px", fontWeight: 900, color: "rgba(255,255,255,0.2)", width: 16, textAlign: "right" }}>
            {String(index + 1).padStart(2, "0")}
          </span>
          <div style={{ width: 36, height: 36, borderRadius: "10px", background: section.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon size={17} color={section.color} />
          </div>
        </div>

        <span style={{ flex: 1, fontSize: "14px", fontWeight: 800, color: "#fff", minWidth: 0 }}>
          {section.title}
        </span>

        <ChevronDown
          size={16}
          color="rgba(255,255,255,0.3)"
          style={{ flexShrink: 0, transition: "transform 0.25s", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      {/* Body */}
      <div style={{
        maxHeight: open ? "300px" : "0px",
        overflow: "hidden",
        transition: "max-height 0.3s ease",
      }}>
        <p style={{
          margin: 0, padding: "0 16px 18px 76px",
          fontSize: "13px", lineHeight: 1.8,
          color: "rgba(253,248,242,0.5)",
        }}>
          {section.body}
        </p>
      </div>
    </div>
  );
}

// ─── OurCommitment ────────────────────────────────────────────────────────────

export default function OurCommitment() {
  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes shieldPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(232,74,12,0.3); }
          50%       { box-shadow: 0 0 0 16px rgba(232,74,12,0); }
        }
      `}</style>

      <section
        style={{
          background: "linear-gradient(180deg, #080E1A 0%, #0A1422 60%, #080E1A 100%)",
          padding: "80px 5% 100px",
          position: "relative",
          overflowX: "hidden",
        }}
      >
        {/* Background grid texture */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.025,
          backgroundImage: "linear-gradient(rgba(253,248,242,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(253,248,242,0.6) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }} />

        {/* Glow */}
        <div style={{
          position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)",
          width: "600px", height: "400px", borderRadius: "50%", pointerEvents: "none",
          background: "radial-gradient(ellipse, rgba(232,74,12,0.07) 0%, transparent 70%)",
        }} />

        <div style={{ maxWidth: "720px", margin: "0 auto", position: "relative", zIndex: 1 }}>

          {/* ── Hero block ── */}
          <div style={{ textAlign: "center", marginBottom: "56px", animation: "fadeUp 0.6s ease both" }}>

            {/* Shield badge */}
            <div style={{
              width: 72, height: 72, borderRadius: "20px", margin: "0 auto 24px",
              background: "rgba(232,74,12,0.12)", border: "1px solid rgba(232,74,12,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              animation: "shieldPulse 3s ease-in-out infinite",
            }}>
              <ShieldCheck size={34} color="#E84A0C" />
            </div>

            {/* Eyebrow */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "rgba(232,74,12,0.08)", border: "1px solid rgba(232,74,12,0.2)",
              borderRadius: "999px", padding: "5px 14px", marginBottom: "20px",
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#E84A0C", display: "inline-block" }} />
              <span style={{ fontSize: "11px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em", color: "#E84A0C" }}>
                Privacy Policy
              </span>
            </div>

            <h1 style={{
              fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 900, color: "#FDF8F2",
              margin: "0 0 16px", lineHeight: 1.15,
            }}>
              Our Commitment to{" "}
              <span style={{
                background: "linear-gradient(135deg, #E84A0C, #ff7043)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
                Your Privacy
              </span>
            </h1>

            <p style={{
              fontSize: "15px", lineHeight: 1.75, color: "rgba(253,248,242,0.5)",
              maxWidth: "520px", margin: "0 auto 28px",
            }}>
              Hone Your Marks is fully committed to complying with the{" "}
              <strong style={{ color: "rgba(253,248,242,0.75)", fontWeight: 700 }}>Kenya Data Protection Act 2019</strong>{" "}
              and all applicable data protection regulations. We believe your data belongs to you — we are simply its custodian.
            </p>

            {/* Last updated */}
            <span style={{
              display: "inline-block", fontSize: "11px", fontWeight: 700,
              color: "rgba(253,248,242,0.25)", letterSpacing: "0.06em",
            }}>
              Last updated: March 2026
            </span>
          </div>

          {/* ── Commitment strip ── */}
          <div style={{
            borderRadius: "16px", padding: "18px 20px", marginBottom: "32px",
            background: "rgba(74,222,128,0.05)", border: "1px solid rgba(74,222,128,0.15)",
            display: "flex", alignItems: "flex-start", gap: "14px",
            animation: "fadeUp 0.6s ease 0.1s both",
          }}>
            <ShieldCheck size={20} color="#4ade80" style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: "13px", lineHeight: 1.75, color: "rgba(253,248,242,0.6)", margin: 0 }}>
              We <strong style={{ color: "#4ade80", fontWeight: 800 }}>never sell, rent, or trade</strong> your personal data to third parties. 
              Your information is used solely to power your education on this platform. 
              We are transparent about what we collect, why we collect it, and how long we keep it.
            </p>
          </div>

          {/* ── Accordion sections ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "48px" }}>
            {SECTIONS.map((section, i) => (
              <div key={section.title} style={{ animation: `fadeUp 0.5s ease ${0.15 + i * 0.06}s both` }}>
                <AccordionItem section={section} index={i} />
              </div>
            ))}
          </div>

          {/* ── Footer CTA ── */}
          <div style={{
            borderRadius: "16px", padding: "28px 24px", textAlign: "center",
            background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)",
            animation: "fadeUp 0.6s ease 0.6s both",
          }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "14px" }}>
              <LogoMark size={28} />
            </div>
            <p style={{ fontSize: "13px", color: "rgba(253,248,242,0.4)", margin: "0 0 4px" }}>
              Questions about your data?
            </p>
            <a
              href="mailto:privacy@honeyourmarks.ac.ke"
              style={{
                fontSize: "14px", fontWeight: 800, color: "#E84A0C",
                textDecoration: "none", letterSpacing: "0.01em",
              }}
            >
              privacy@honeyourmarks.ac.ke
            </a>
          </div>

        </div>
      </section>
    </>
  );
}