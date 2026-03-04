import { AlertBox, SubmitButton, Stepper } from "../common/UI";
import { KE_COUNTIES, SCHOOL_LEVELS, REG_STEPS } from "./constants";

// ─── StudentStep ──────────────────────────────────────────────────────────────
export default function StudentStep({ data, onChange, onNext, onBack, alert, setAlert, loading }) {
  const update = (k) => (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    onChange({ ...data, [k]: val });
  };
  const setSex = (sex) => onChange({ ...data, sex });

  const handleSubmit = (e) => {
    e.preventDefault();
    setAlert(null);

    const { firstName, lastName, sex, dateOfBirth, county, schoolName, schoolLevel, parentalConsent } = data;
    if (!firstName || !lastName)
      return setAlert({ type: "error", msg: "Student's full name is required." });
    if (!sex)
      return setAlert({ type: "error", msg: "Please select the student's sex." });
    if (!dateOfBirth)
      return setAlert({ type: "error", msg: "Student's date of birth is required." });
    if (!county)
      return setAlert({ type: "error", msg: "Please select a county." });
    if (!schoolName.trim())
      return setAlert({ type: "error", msg: "Please enter the school name." });
    if (!schoolLevel)
      return setAlert({ type: "error", msg: "Please select the current school level." });
    if (!parentalConsent)
      return setAlert({ type: "error", msg: "Parental consent is required to complete registration." });

    onNext();
  };

  return (
    <>
      <Stepper step={REG_STEPS.STUDENT} />

      <div className="accent-line" />
      <h1 className="form-heading">Student <em>details.</em></h1>
      <p className="form-subheading">Tell us about the student joining the platform.</p>

      <AlertBox alert={alert} />

      <form onSubmit={handleSubmit} noValidate>
        <div className="field-group">
          {/* Name row */}
          <div className="field-row">
            <div>
              <label className="field-label">First name</label>
              <input className="field-input" type="text" placeholder="Amani" value={data.firstName} onChange={update("firstName")} autoComplete="given-name" required />
            </div>
            <div>
              <label className="field-label">Last name</label>
              <input className="field-input" type="text" placeholder="Wanjiku" value={data.lastName} onChange={update("lastName")} autoComplete="family-name" required />
            </div>
          </div>

          {/* Middle names */}
          <div>
            <label className="field-label">Middle name(s) <span style={{ fontWeight: 300, opacity: 0.5 }}>(optional)</span></label>
            <input className="field-input" type="text" placeholder="e.g. Njeri" value={data.middleNames} onChange={update("middleNames")} />
          </div>

          {/* Sex */}
          <div>
            <label className="field-label">Sex</label>
            <div className="sex-toggle">
              {["Male", "Female"].map((s) => (
                <div
                  key={s}
                  className={`sex-card ${data.sex === s ? "selected" : ""}`}
                  onClick={() => setSex(s)}
                  role="radio"
                  aria-checked={data.sex === s}
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && setSex(s)}
                >
                  {s === "Male" ? "♂ Male" : "♀ Female"}
                </div>
              ))}
            </div>
          </div>

          {/* Date of birth */}
          <div>
            <label className="field-label">Date of birth</label>
            <input
              className="field-input" type="date"
              value={data.dateOfBirth} onChange={update("dateOfBirth")}
              max={new Date().toISOString().split("T")[0]}
              required style={{ colorScheme: "dark" }}
            />
          </div>

          {/* County */}
          <div>
            <label className="field-label">County</label>
            <select className="field-select" value={data.county} onChange={update("county")} required>
              <option value="">Select county…</option>
              {KE_COUNTIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* School name */}
          <div>
            <label className="field-label">School name</label>
            <input className="field-input" type="text" placeholder="e.g. Nairobi School" value={data.schoolName} onChange={update("schoolName")} required />
          </div>

          {/* School level */}
          <div>
            <label className="field-label">Current level</label>
            <select className="field-select" value={data.schoolLevel} onChange={update("schoolLevel")} required>
              <option value="">Select level…</option>
              {SCHOOL_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          {/* Parental consent */}
          <div className="checkbox-row">
            <input
              id="consent"
              className="checkbox-input"
              type="checkbox"
              checked={data.parentalConsent}
              onChange={update("parentalConsent")}
            />
            <label htmlFor="consent" className="checkbox-label">
              I confirm that the <strong>parent / guardian named above</strong> consents
              to this student's registration and use of the platform.
            </label>
          </div>
        </div>

        <SubmitButton loading={loading} label="Complete Registration →" />

        <button type="button" className="btn-ghost" style={{ marginTop: 10 }} onClick={onBack}>
          ← Back to Parent Details
        </button>
      </form>
    </>
  );
}