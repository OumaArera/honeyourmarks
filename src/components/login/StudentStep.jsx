import { AlertBox, SubmitButton, Stepper } from "../common/UI";
import { KE_COUNTIES, SCHOOL_LEVELS, REG_STEPS } from "./constants";

// ─── StudentStep ───────────────────────────────────────────────────────────
export default function StudentStep({ data, onChange, onNext, alert, setAlert, loading }) {
  const update = (k) => (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    onChange({ ...data, [k]: val });
  };

  const setSex = (sex) => onChange({ ...data, sex });

  const handleSubmit = (e) => {
    e.preventDefault();
    setAlert(null);

    const {
      first_name, last_name, sex, date_of_birth,
      phone_number, county, school_name,
      current_school_level, parental_consent,
    } = data;

    if (!first_name.trim() || !last_name.trim())
      return setAlert({ type: "error", msg: "Student's full name is required." });
    if (!sex)
      return setAlert({ type: "error", msg: "Please select the student's sex." });
    if (!date_of_birth)
      return setAlert({ type: "error", msg: "Student's date of birth is required." });
    if (!phone_number || !/^(\+?254|0)7\d{8}$/.test(phone_number.replace(/\s/g, "")))
      return setAlert({ type: "error", msg: "Please enter a valid Kenyan phone number." });
    if (!county)
      return setAlert({ type: "error", msg: "Please select a county." });
    if (!school_name.trim())
      return setAlert({ type: "error", msg: "Please enter the school name." });
    if (!current_school_level)
      return setAlert({ type: "error", msg: "Please select the current school level." });
    if (!parental_consent)
      return setAlert({ type: "error", msg: "Parental consent is required to complete registration." });

    onNext();
  };

  return (
    <>
      <Stepper step={REG_STEPS.STUDENT} />

      <div className="accent-line" />
      <h1 className="form-heading">Create <em>account.</em></h1>
      <p className="form-subheading">Fill in the student's details to get started.</p>

      <AlertBox alert={alert} />

      <form onSubmit={handleSubmit} noValidate>
        <div className="field-group">

          {/* Name row */}
          <div className="field-row">
            <div>
              <label className="field-label">First name</label>
              <input
                className="field-input" type="text" placeholder="Amani"
                value={data.first_name} onChange={update("first_name")}
                autoComplete="given-name" required
              />
            </div>
            <div>
              <label className="field-label">Last name</label>
              <input
                className="field-input" type="text" placeholder="Wanjiku"
                value={data.last_name} onChange={update("last_name")}
                autoComplete="family-name" required
              />
            </div>
          </div>

          {/* Middle names */}
          <div>
            <label className="field-label">
              Middle name(s){" "}
              <span style={{ fontWeight: 300, opacity: 0.5 }}>(optional)</span>
            </label>
            <input
              className="field-input" type="text" placeholder="e.g. Njeri"
              value={data.middle_names} onChange={update("middle_names")}
            />
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
              value={data.date_of_birth} onChange={update("date_of_birth")}
              max={new Date().toISOString().split("T")[0]}
              required style={{ colorScheme: "dark" }}
            />
          </div>

          {/* Phone number */}
          <div>
            <label className="field-label">Phone number</label>
            <input
              className="field-input" type="tel"
              placeholder="+254 7XX XXX XXX"
              value={data.phone_number} onChange={update("phone_number")}
              autoComplete="tel" required
            />
          </div>

          {/* County */}
          <div>
            <label className="field-label">County</label>
            <select
              className="field-select"
              value={data.county} onChange={update("county")} required
            >
              <option value="">Select county…</option>
              {KE_COUNTIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* School name */}
          <div>
            <label className="field-label">School name</label>
            <input
              className="field-input" type="text"
              placeholder="e.g. Mbita High School"
              value={data.school_name} onChange={update("school_name")} required
            />
          </div>

          {/* School level */}
          <div>
            <label className="field-label">Current level</label>
            <select
              className="field-select"
              value={data.current_school_level} onChange={update("current_school_level")} required
            >
              <option value="">Select level…</option>
              {SCHOOL_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          {/* Parental consent */}
          <div className="checkbox-row">
            <input
              id="consent" className="checkbox-input" type="checkbox"
              checked={data.parental_consent} onChange={update("parental_consent")}
            />
            <label htmlFor="consent" className="checkbox-label">
              I confirm that the <strong>parent / guardian</strong> has given consent
              for this student's registration and use of the platform.
            </label>
          </div>

        </div>

        <SubmitButton loading={loading} label="Complete Registration →" />
      </form>
    </>
  );
}