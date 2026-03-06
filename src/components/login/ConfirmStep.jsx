import { Stepper } from "../common/UI";
import { REG_STEPS } from "./constants";

// ─── Helpers ───────────────────────────────────────────────────────────────

/**
 * Converts ISO date (YYYY-MM-DD) → DDMMYYYY (no hyphens).
 * e.g. "2008-05-12" → "12052008"
 */
function dobToPassword(dateOfBirth) {
  if (!dateOfBirth) return "";
  const [yyyy, mm, dd] = dateOfBirth.split("-");
  return `${dd}${mm}${yyyy}`;
}

// ─── ConfirmStep ───────────────────────────────────────────────────────────
// Receives the real API response object as `student`
export default function ConfirmStep({ student }) {
  const {
    first_name, middle_names, last_name,
    admission_number, date_of_birth,
    school_name, county, current_school_level,
  } = student;

  const fullName     = [first_name, middle_names, last_name].filter(Boolean).join(" ");
  const defaultPassword = dobToPassword(date_of_birth);

  return (
    <>
      <Stepper step={REG_STEPS.CONFIRM} />

      <div className="accent-line" />
      <h1 className="form-heading">Welcome, <em>{first_name}!</em> 🎉</h1>
      <p className="form-subheading">
        Congratulations on joining <strong>Hone Your Marks</strong>! Your account has been
        created successfully. Save your credentials below — take a screenshot before you leave.
      </p>

      {/* Credential card */}
      <div className="cred-box">
        <div className="cred-box-title">🎓 Your Login Credentials</div>

        <CredRow label="Full name"  value={fullName} />
        <CredRow label="Username"   value={admission_number} highlight />
        <CredRow label="Password"   value={defaultPassword}  highlight mono />

        <p className="cred-note">
          📸 <strong>Take a screenshot now.</strong> Your username is your{" "}
          <strong style={{ color: "rgba(253,248,242,0.75)" }}>admission number</strong> and
          your default password is your{" "}
          <strong style={{ color: "rgba(253,248,242,0.75)" }}>date of birth</strong> in{" "}
          <strong style={{ color: "rgba(253,248,242,0.75)" }}>DDMMYYYY</strong> format.
          Change your password after your first login.
        </p>
      </div>

      {/* Registration summary */}
      <div className="cred-summary">
        <div className="cred-summary-title">Registered details</div>
        {[
          ["School",  school_name],
          ["Level",   current_school_level],
          ["County",  county],
        ].map(([k, v]) => (
          <div key={k} className="cred-summary-row">
            <span className="cred-summary-key">{k}</span>
            <span className="cred-summary-val">{v}</span>
          </div>
        ))}
      </div>

      <button
        className="btn-submit"
        style={{ cursor: "pointer", border: "none", marginTop: 8 }}
        onClick={() => (window.location.href = "/login")}
      >
        Go to Sign In →
      </button>
    </>
  );
}

// ─── CredRow ───────────────────────────────────────────────────────────────
function CredRow({ label, value, highlight, mono }) {
  return (
    <div className="cred-row">
      <span className="cred-key">{label}</span>
      <span
        className="cred-val"
        style={{
          ...(highlight && { color: "#fff", fontWeight: 600 }),
          ...(mono && { letterSpacing: "0.12em", fontFamily: "monospace" }),
        }}
      >
        {value}
      </span>
    </div>
  );
}