
import { useState } from "react";

// ── Config ────────────────────────────────────────────────────────────────────
const WHATSAPP_NUMBER  = "254748800714";   
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hi, I need help with the HoneYourMarks login page."
);
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

// ── Component ─────────────────────────────────────────────────────────────────
export default function WhatsAppSupportButton() {
  const [hovered, setHovered] = useState(false);

  return (
    <>
      {/* ── Scoped styles ── */}
      <style>{`
        .wa-fab {
          position: fixed;
          bottom: 28px;
          right: 28px;
          z-index: 9999;
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          text-decoration: none;

          /* Pill shape */
          background: #25D366;
          border-radius: 50px;
          padding: 12px 20px 12px 14px;
          box-shadow: 0 4px 24px rgba(37, 211, 102, 0.45),
                      0 2px 8px  rgba(0, 0, 0, 0.18);

          /* Smooth expand/contract */
          transition: transform 0.22s cubic-bezier(.34,1.56,.64,1),
                      box-shadow 0.22s ease,
                      padding    0.22s ease;
        }

        .wa-fab:hover,
        .wa-fab:focus-visible {
          transform: translateY(-3px) scale(1.04);
          box-shadow: 0 8px 32px rgba(37, 211, 102, 0.55),
                      0 4px 12px rgba(0, 0, 0, 0.22);
          outline: none;
        }

        .wa-fab:active {
          transform: translateY(0) scale(0.97);
          box-shadow: 0 3px 12px rgba(37, 211, 102, 0.4);
        }

        /* WhatsApp SVG icon */
        .wa-fab__icon {
          width: 26px;
          height: 26px;
          flex-shrink: 0;
          filter: drop-shadow(0 1px 2px rgba(0,0,0,0.15));
        }

        /* Label */
        .wa-fab__label {
          display: flex;
          flex-direction: column;
          line-height: 1.2;
          overflow: hidden;
          max-width: 140px;          /* clamp width for the label */
        }

        .wa-fab__label-top {
          font-family: inherit;
          font-size: 11px;
          font-weight: 500;
          color: rgba(255,255,255,0.82);
          letter-spacing: 0.04em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .wa-fab__label-main {
          font-family: inherit;
          font-size: 14px;
          font-weight: 700;
          color: #ffffff;
          white-space: nowrap;
        }

        /* Pulse ring — draws attention on first render */
        @keyframes wa-pulse {
          0%   { transform: scale(1);   opacity: 0.6; }
          70%  { transform: scale(1.55); opacity: 0;   }
          100% { transform: scale(1.55); opacity: 0;   }
        }

        .wa-fab__pulse {
          position: absolute;
          inset: 0;
          border-radius: 50px;
          border: 2px solid #25D366;
          animation: wa-pulse 2.4s ease-out infinite;
          pointer-events: none;
        }
      `}</style>

      {/* ── Button ── */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="wa-fab"
        aria-label="Chat with support on WhatsApp"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Pulse ring */}
        <span className="wa-fab__pulse" aria-hidden="true" />

        {/* WhatsApp logo SVG (official green-on-white version, inlined for zero deps) */}
        <svg
          className="wa-fab__icon"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle cx="16" cy="16" r="16" fill="#ffffff" />
          <path
            d="M23.5 8.5A10.45 10.45 0 0 0 16 5.5C10.2 5.5 5.5 10.2 5.5 16c0 1.86.49 3.67 1.41 5.27L5.5 26.5l5.36-1.4A10.43 10.43 0 0 0 16 26.5c5.8 0 10.5-4.7 10.5-10.5 0-2.8-1.09-5.43-3.0-7.5ZM16 24.6a8.57 8.57 0 0 1-4.37-1.19l-.31-.19-3.18.83.85-3.1-.2-.32A8.55 8.55 0 0 1 7.4 16c0-4.74 3.86-8.6 8.6-8.6 2.3 0 4.46.9 6.08 2.53A8.55 8.55 0 0 1 24.6 16c0 4.74-3.86 8.6-8.6 8.6Zm4.72-6.44c-.26-.13-1.52-.75-1.76-.84-.23-.08-.4-.13-.57.13-.17.26-.65.84-.8 1.01-.14.17-.29.19-.55.06a6.97 6.97 0 0 1-2.05-1.27 7.7 7.7 0 0 1-1.42-1.77c-.15-.26-.02-.4.11-.53.12-.12.26-.3.39-.46.13-.15.17-.26.26-.43.08-.17.04-.32-.02-.45-.06-.13-.57-1.38-.78-1.89-.21-.5-.41-.43-.57-.44h-.49c-.17 0-.44.06-.67.3-.23.24-.88.86-.88 2.1s.9 2.43 1.03 2.6c.13.17 1.78 2.72 4.3 3.81.6.26 1.07.41 1.44.53.6.19 1.15.16 1.59.1.48-.07 1.49-.61 1.7-1.2.21-.58.21-1.08.15-1.19-.07-.1-.23-.16-.49-.29Z"
            fill="#25D366"
          />
        </svg>

        {/* Label */}
        <span className="wa-fab__label">
          <span className="wa-fab__label-top">Need help?</span>
          <span className="wa-fab__label-main">Chat with us</span>
        </span>
      </a>
    </>
  );
}