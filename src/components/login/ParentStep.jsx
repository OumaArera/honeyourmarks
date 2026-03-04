import { Stepper, AlertBox, SubmitButton } from "../common/UI";
import { REG_STEPS } from "./constants";

// ─── ParentStep ───────────────────────────────────────────────────────────────
export default function ParentStep({ data, onChange, onNext, alert, setAlert }) {
  const update = (k) => (e) => onChange({ ...data, [k]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setAlert(null);

    const { firstName, lastName, idNumber, phone, email, dateOfBirth } = data;
    if (!firstName || !lastName)
      return setAlert({ type: "error", msg: "Parent's full name is required." });
    if (!idNumber || !/^\d{7,8}$/.test(idNumber.trim()))
      return setAlert({ type: "error", msg: "Please enter a valid Kenyan ID number (7–8 digits)." });
    if (!phone || !/^(\+?254|0)7\d{8}$/.test(phone.replace(/\s/g, "")))
      return setAlert({ type: "error", msg: "Please enter a valid Kenyan phone number." });
    if (!email.includes("@"))
      return setAlert({ type: "error", msg: "Please enter a valid email address." });
    if (!dateOfBirth)
      return setAlert({ type: "error", msg: "Parent's date of birth is required." });

    onNext();
  };

  return (
    <>
      <Stepper step={REG_STEPS.PARENT} />

      <div className="accent-line" />
      <h1 className="form-heading">Parent / <em>Guardian.</em></h1>
      <p className="form-subheading">We collect parent details for account verification and consent.</p>

      <AlertBox alert={alert} />

      <form onSubmit={handleSubmit} noValidate>
        <div className="field-group">
          <div className="field-row">
            <div>
              <label className="field-label">First name</label>
              <input className="field-input" type="text" placeholder="John" value={data.firstName} onChange={update("firstName")} autoComplete="given-name" required />
            </div>
            <div>
              <label className="field-label">Last name</label>
              <input className="field-input" type="text" placeholder="Kamau" value={data.lastName} onChange={update("lastName")} autoComplete="family-name" required />
            </div>
          </div>

          <div>
            <label className="field-label">National ID number</label>
            <input className="field-input" type="text" inputMode="numeric" placeholder="e.g. 12345678" value={data.idNumber} onChange={update("idNumber")} required />
          </div>

          <div>
            <label className="field-label">M-Pesa phone number</label>
            <input className="field-input" type="tel" placeholder="+254 7XX XXX XXX" value={data.phone} onChange={update("phone")} autoComplete="tel" required />
          </div>

          <div>
            <label className="field-label">Email address</label>
            <input className="field-input" type="email" placeholder="parent@example.com" value={data.email} onChange={update("email")} autoComplete="email" required />
          </div>

          <div>
            <label className="field-label">Date of birth</label>
            <input
              className="field-input" type="date"
              value={data.dateOfBirth} onChange={update("dateOfBirth")}
              max={new Date(Date.now() - 18 * 365.25 * 24 * 3600 * 1000).toISOString().split("T")[0]}
              required
              style={{ colorScheme: "dark" }}
            />
          </div>
        </div>

        <SubmitButton loading={false} label="Continue to Student Details →" />
      </form>
    </>
  );
}