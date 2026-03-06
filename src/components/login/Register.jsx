import { useState } from "react";
import { REG_STEPS, MODES } from "./constants";
import StudentStep from "./StudentStep";
import ConfirmStep from "./ConfirmStep";
import { authMethod } from "../../api/api.service";

// ─── Default state ─────────────────────────────────────────────────────────
const defaultStudent = () => ({
  first_name: "", middle_names: "", last_name: "",
  sex: "", date_of_birth: "", county: "",
  school_name: "", current_school_level: "",
  phone_number: "", parental_consent: false,
});

// ─── RegisterFlow ──────────────────────────────────────────────────────────
export default function RegisterFlow({ onSwitchMode }) {
  const [step,          setStep]          = useState(REG_STEPS.STUDENT);
  const [studentData,   setStudentData]   = useState(defaultStudent());
  const [registeredStudent, setRegisteredStudent] = useState(null);
  const [alert,         setAlert]         = useState(null);
  const [loading,       setLoading]       = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setAlert(null);
    try {
      const payload = {
        first_name:           studentData.first_name,
        last_name:            studentData.last_name,
        sex:                  studentData.sex.toLowerCase(),
        date_of_birth:        studentData.date_of_birth,
        phone_number:         studentData.phone_number,
        school_name:          studentData.school_name,
        county:               studentData.county,
        current_school_level: studentData.current_school_level,
        parental_consent:     studentData.parental_consent,
        ...(studentData.middle_names && { middle_names: studentData.middle_names }),
      };

      const response = await authMethod("students/", payload);
      console.log("Respon")
      setRegisteredStudent(response);
      setStep(REG_STEPS.CONFIRM);
    } catch (err) {
      const data = err?.response?.data;
      // Flatten first API error message found
      const msg = data
        ? Object.values(data).flat()[0]
        : "Registration failed. Please try again.";
      setAlert({ type: "error", msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {step === REG_STEPS.STUDENT && (
        <StudentStep
          data={studentData}
          onChange={setStudentData}
          onNext={handleSubmit}
          alert={alert}
          setAlert={setAlert}
          loading={loading}
        />
      )}

      {step === REG_STEPS.CONFIRM && registeredStudent && (
        <ConfirmStep student={registeredStudent} />
      )}

      {step === REG_STEPS.STUDENT && (
        <div className="switch-row">
          Already have an account?{" "}
          <button className="switch-btn" onClick={() => onSwitchMode(MODES.LOGIN)}>
            Sign in
          </button>
        </div>
      )}
    </>
  );
}