import { useState } from "react";
import { AlertBox, SubmitButton } from "../common/UI";
import { MODES } from "./constants";

// ─── ForgotForm ───────────────────────────────────────────────────────────────
export default function ForgotForm({ onSwitchMode }) {
  const [email, setEmail]     = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert]     = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setAlert(null);
    if (!email.includes("@"))
      return setAlert({ type: "error", msg: "Please enter a valid username." });

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setAlert({ type: "success", msg: "Reset link sent! Check your inbox." });
    }, 1500);
  };

  return (
    <>
      <div className="accent-line" />
      <h1 className="form-heading">Reset your <em>password.</em></h1>
      <p className="form-subheading">Your date of birth will be restored as password DDMMYYYY.</p>

      <AlertBox alert={alert} />

      <form onSubmit={handleSubmit} noValidate>
        <div className="field-group">
          <div>
            <label className="field-label">Username/Admission Number</label>
            <input
              className="field-input" type="text" placeholder="HYM-06E-2026"
              value={email} onChange={(e) => setEmail(e.target.value)}
              autoComplete="text" required
            />
          </div>
        </div>

        <SubmitButton loading={loading} label="Reset Password →" />
      </form>

      <div className="switch-row">
        Remembered it?
        <button className="switch-btn" onClick={() => onSwitchMode(MODES.LOGIN)}>Back to sign in</button>
      </div>
    </>
  );
}