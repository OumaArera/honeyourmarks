import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { AlertBox, EyeIcon, SubmitButton } from "../common/UI";
import { MODES } from "./constants";


// ─── LoginForm ────────────────────────────────────────────────────────────
export default function LoginForm({ onSwitchMode }) {
  const [form,    setForm]    = useState({ username: "", password: "" });
  const [showPw,  setShowPw]  = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert,   setAlert]   = useState(null);

  const { login }  = useAuth();
  const navigate   = useNavigate();
  const location   = useLocation();

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);

    if (!form.username.trim())
      return setAlert({ type: "error", msg: "Please enter your username, email, or phone number." });
    if (!form.password)
      return setAlert({ type: "error", msg: "Password is required." });

    setLoading(true);
    try {
      // login() returns the correct dashboard path based on role
      const dashboardPath = await login(form.username.trim(), form.password);

      // Honour the originally intended destination (if redirected here by PrivateRoute)
      const intended = location.state?.from?.pathname;
      navigate(intended ?? dashboardPath, { replace: true });
    } catch (err) {
      const serverMsg = err?.response?.data?.detail;
      setAlert({
        type: "error",
        msg: serverMsg ?? "Invalid username or password. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="accent-line" />
      <h1 className="form-heading">Welcome <em>back.</em></h1>
      <p className="form-subheading">Sign in to continue your learning journey.</p>

      <AlertBox alert={alert} />

      <form onSubmit={handleSubmit} noValidate>
        <div className="field-group">

          {/* Username / email / phone */}
          <div>
            <label className="field-label">Admission Number or email</label>
            <input
              className="field-input"
              type="text"
              placeholder="e.g. HYM-808P-2026 or you@email.com"
              value={form.username}
              onChange={update("username")}
              autoComplete="username"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="field-label">Password</label>
            <div className="field-wrap">
              <input
                className="field-input has-eye"
                type={showPw ? "text" : "password"}
                placeholder="Your password"
                value={form.password}
                onChange={update("password")}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPw((v) => !v)}
                aria-label="Toggle password visibility"
              >
                <EyeIcon open={showPw} />
              </button>
            </div>
          </div>

        </div>

        <div className="forgot-row">
          <button
            type="button"
            className="forgot-link"
            onClick={() => onSwitchMode(MODES.FORGOT)}
          >
            Forgot password?
          </button>
        </div>

        <SubmitButton loading={loading} label="Sign In →" />
      </form>

      <div className="switch-row">
        Don't have an account?{" "}
        <button className="switch-btn" onClick={() => onSwitchMode(MODES.REGISTER)}>
          Register free
        </button>
      </div>
    </>
  );
}