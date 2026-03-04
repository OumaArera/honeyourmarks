import { MODES } from "./constants";

// ─── ModeTabs ────────────────────────────────────────────────────────────────
export default function ModeTabs({ mode, onSwitch }) {
  return (
    <div className="mode-tabs" role="tablist">
      {[
        { key: MODES.LOGIN,    label: "Sign In"  },
        { key: MODES.REGISTER, label: "Register" },
        { key: MODES.FORGOT,   label: "Reset"    },
      ].map(({ key, label }) => (
        <button
          key={key}
          role="tab"
          aria-selected={mode === key}
          className={`mode-tab ${mode === key ? "active" : ""}`}
          onClick={() => onSwitch(key)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}