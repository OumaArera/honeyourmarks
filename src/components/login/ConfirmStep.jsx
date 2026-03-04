import { Stepper } from "../common/UI";
import { REG_STEPS } from "./constants";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Generate a mock admission number: HYM-YYYY-XXXX */
function generateAdmissionNumber() {
  const year = new Date().getFullYear();
  const seq  = String(Math.floor(1000 + Math.random() * 9000));
  return `HYM-${year}-${seq}`;
}

/**
 * Default password = DOB without hyphens.
 * e.g. 2010-03-15 → 20100315
 */
function dobToPassword(dateOfBirth) {
  return dateOfBirth.replace(/-/g, "");
}

// ─── ConfirmStep ──────────────────────────────────────────────────────────────
export default function ConfirmStep({ studentData }) {
  const admissionNumber = generateAdmissionNumber();
  const defaultPassword = dobToPassword(studentData.dateOfBirth);

  const fullName = [studentData.firstName, studentData.middleNames, studentData.lastName]
    .filter(Boolean).join(" ");

  return (
    <>
      <Stepper step={REG_STEPS.CONFIRM} />

      <div className="accent-line" />
      <h1 className="form-heading">You're <em>in!</em></h1>
      <p className="form-subheading">
        Registration complete. Your teacher-admin will confirm access shortly.
        Save your login credentials below.
      </p>

      {/* Credential reveal */}
      <div className="cred-box">
        <div className="cred-box-title">🎓 Your Login Credentials</div>

        <div className="cred-row">
          <span className="cred-key">Name</span>
          <span className="cred-val" style={{ fontSize: 14 }}>{fullName}</span>
        </div>
        <div className="cred-row">
          <span className="cred-key">Username</span>
          <span className="cred-val">{admissionNumber}</span>
        </div>
        <div className="cred-row">
          <span className="cred-key">Password</span>
          <span className="cred-val" style={{ letterSpacing: "0.1em" }}>{defaultPassword}</span>
        </div>

        <p className="cred-note">
          📌 Your username is your <strong style={{ color: "rgba(253,248,242,0.7)" }}>admission number</strong>.
          Your default password is your <strong style={{ color: "rgba(253,248,242,0.7)" }}>date of birth</strong> (YYYYMMDD).
          Please change it after your first login.
        </p>
      </div>

      {/* Summary */}
      <div style={{ marginBottom: 20, padding: "14px 16px", background: "rgba(253,248,242,0.04)", border: "1px solid rgba(253,248,242,0.08)", borderRadius: 2 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(253,248,242,0.3)", marginBottom: 10 }}>
          Registered details
        </div>
        {[
          ["School",  studentData.schoolName],
          ["Level",   studentData.schoolLevel],
          ["County",  studentData.county],
        ].map(([k, v]) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderTop: "1px solid rgba(253,248,242,0.06)" }}>
            <span style={{ fontSize: 12, color: "rgba(253,248,242,0.35)", fontWeight: 500 }}>{k}</span>
            <span style={{ fontSize: 12.5, color: "rgba(253,248,242,0.75)" }}>{v}</span>
          </div>
        ))}
      </div>

      <button
        className="btn-submit"
        style={{ cursor: "pointer", border: "none" }}
        onClick={() => window.location.href = "/login"}
      >
        Go to Sign In →
      </button>
    </>
  );
}