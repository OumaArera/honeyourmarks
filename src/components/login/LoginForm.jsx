import { useState } from "react";
import { AlertBox, EyeIcon, SubmitButton } from "../common/UI";
import { MODES } from "./constants";

// ─── LoginForm ────────────────────────────────────────────────────────────────
export default function LoginForm({ onSwitchMode }) {
  const [form, setForm]     = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert]   = useState(null);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setAlert(null);
    if (!form.email.includes("@"))
      return setAlert({ type: "error", msg: "Please enter a valid email address." });
    if (!form.password)
      return setAlert({ type: "error", msg: "Password is required." });

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setAlert({ type: "success", msg: "Welcome back! Redirecting…" });
    }, 1500);
  };

  return (
    <>
      <div className="accent-line" />
      <h1 className="form-heading">Welcome <em>back.</em></h1>
      <p className="form-subheading">Sign in to continue your learning journey.</p>

      <AlertBox alert={alert} />

      <form onSubmit={handleSubmit} noValidate>
        <div className="field-group">
          <div>
            <label className="field-label">Email address</label>
            <input
              className="field-input" type="email" placeholder="you@example.com"
              value={form.email} onChange={update("email")}
              autoComplete="email" required
            />
          </div>
          <div>
            <label className="field-label">Password</label>
            <div className="field-wrap">
              <input
                className="field-input has-eye"
                type={showPw ? "text" : "password"}
                placeholder="Your password"
                value={form.password} onChange={update("password")}
                autoComplete="current-password" required
              />
              <button type="button" className="eye-btn" onClick={() => setShowPw((v) => !v)} aria-label="Toggle password">
                <EyeIcon open={showPw} />
              </button>
            </div>
          </div>
        </div>

        <div className="forgot-row">
          <button type="button" className="forgot-link" onClick={() => onSwitchMode(MODES.FORGOT)}>
            Forgot password?
          </button>
        </div>

        <SubmitButton loading={loading} label="Sign In →" />
      </form>

      <div className="switch-row">
        Don't have an account?
        <button className="switch-btn" onClick={() => onSwitchMode(MODES.REGISTER)}>Register free</button>
      </div>
    </>
  );
}