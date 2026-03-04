import { useState } from "react";
import { REG_STEPS, MODES } from "./constants";
import ParentStep   from "./ParentStep";
import StudentStep  from "./StudentStep";
import ConfirmStep  from "./ConfirmStep";

// ─── Default state factories ───────────────────────────────────────────────────
const defaultParent = () => ({
  firstName: "", lastName: "", idNumber: "",
  phone: "", email: "", dateOfBirth: "",
});

const defaultStudent = () => ({
  firstName: "", middleNames: "", lastName: "",
  sex: "", dateOfBirth: "", county: "",
  schoolName: "", schoolLevel: "", parentalConsent: false,
});

// ─── RegisterFlow ─────────────────────────────────────────────────────────────
export default function RegisterFlow({ onSwitchMode }) {
  const [step,        setStep]        = useState(REG_STEPS.PARENT);
  const [parentData,  setParentData]  = useState(defaultParent());
  const [studentData, setStudentData] = useState(defaultStudent());
  const [alert,       setAlert]       = useState(null);
  const [loading,     setLoading]     = useState(false);

  // ── Step navigation ───────────────────────────────────────────────────────
  const goToStudent = () => {
    setAlert(null);
    setStep(REG_STEPS.STUDENT);
  };

  const goBackToParent = () => {
    setAlert(null);
    setStep(REG_STEPS.PARENT);
  };

  // ── Final submission ──────────────────────────────────────────────────────
  const handleFinalSubmit = () => {
    setLoading(true);
    // TODO: replace with real API call
    // POST /api/auth/register/ with { parent: parentData, student: studentData }
    setTimeout(() => {
      setLoading(false);
      setStep(REG_STEPS.CONFIRM);
    }, 1800);
  };

  return (
    <>
      {step === REG_STEPS.PARENT && (
        <ParentStep
          data={parentData}
          onChange={setParentData}
          onNext={goToStudent}
          alert={alert}
          setAlert={setAlert}
        />
      )}

      {step === REG_STEPS.STUDENT && (
        <StudentStep
          data={studentData}
          onChange={setStudentData}
          onNext={handleFinalSubmit}
          onBack={goBackToParent}
          alert={alert}
          setAlert={setAlert}
          loading={loading}
        />
      )}

      {step === REG_STEPS.CONFIRM && (
        <ConfirmStep studentData={studentData} />
      )}

      {/* Switch back to login (only on step 0 or 1) */}
      {step !== REG_STEPS.CONFIRM && (
        <div className="switch-row">
          Already have an account?
          <button className="switch-btn" onClick={() => onSwitchMode(MODES.LOGIN)}>Sign in</button>
        </div>
      )}
    </>
  );
}