import { useState } from "react";
import { FontLoader } from "../components/common/UI";
import LeftPanel from '../components/login/LeftPanel';
import ModeTabs from "../components/login/ModeTab";
import LoginForm from "../components/login/LoginForm";
import ForgotForm from '../components/login/ForgotPassword'
import RegisterFlow  from "../components/login/Register";
import { MODES } from "../components/login/constants";

// ─── LoginPage ────────────────────────────────────────────────────────────────
export default function LoginPage() {
  const [mode,    setMode]    = useState(MODES.LOGIN);
  const [animKey, setAnimKey] = useState(0);

  const switchMode = (m) => {
    setMode(m);
    setAnimKey((k) => k + 1);
  };

  return (
    <>
      <FontLoader />
      <div className="login-root">

        {/* ── Animated background ── */}
        <div className="bg-canvas">
          <div className="bg-orb bg-orb-1" />
          <div className="bg-orb bg-orb-2" />
          <div className="bg-orb bg-orb-3" />
        </div>
        <div className="bg-grid" />

        {/* ── Left decorative panel ── */}
        <LeftPanel />

        {/* ── Right form panel ── */}
        <div className="right-panel">
          <div className="form-shell">

            {/* Mobile brand */}
            <a href="/" className="mobile-brand">
              <img src="/logo.png" alt="" className="mobile-brand-logo" />
              <span className="mobile-brand-name">Hone Your <em>Marks</em></span>
            </a>

            {/* Mode tabs */}
            <ModeTabs mode={mode} onSwitch={switchMode} />

            {/* Animated form area — re-mounts on mode switch */}
            <div key={animKey} className="slide-enter">
              {mode === MODES.LOGIN    && <LoginForm    onSwitchMode={switchMode} />}
              {mode === MODES.FORGOT   && <ForgotForm   onSwitchMode={switchMode} />}
              {mode === MODES.REGISTER && <RegisterFlow onSwitchMode={switchMode} />}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}