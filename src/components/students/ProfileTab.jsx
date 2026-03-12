import React, { useState, useEffect } from "react";
import {
  User, GraduationCap, MapPin, School, BookOpen,
  Edit3, Check, X, Plus, ChevronDown, Loader2,
} from "lucide-react";
import { getData, patchData, createData } from "../../api/api.service";

// ─── Kenya counties ───────────────────────────────────────────────────────────
const KENYA_COUNTIES = [
  "Baringo","Bomet","Bungoma","Busia","Elgeyo-Marakwet","Embu","Garissa",
  "Homa Bay","Isiolo","Kajiado","Kakamega","Kericho","Kiambu","Kilifi",
  "Kirinyaga","Kisii","Kisumu","Kitui","Kwale","Laikipia","Lamu","Machakos",
  "Makueni","Mandera","Marsabit","Meru","Migori","Mombasa","Murang'a",
  "Nairobi","Nakuru","Nandi","Narok","Nyamira","Nyandarua","Nyeri",
  "Samburu","Siaya","Taita-Taveta","Tana River","Tharaka-Nithi","Trans Nzoia",
  "Turkana","Uasin Gishu","Vihiga","Wajir","West Pokot",
];

// ─── CBC + 8-4-4 school levels ────────────────────────────────────────────────
const SCHOOL_LEVELS = [
  "PP1","PP2",
  "Grade 1","Grade 2","Grade 3","Grade 4","Grade 5","Grade 6",
  "Grade 7","Grade 8","Grade 9",
  "Form 1","Form 2","Form 3","Form 4",
];

const SEX_OPTIONS = [
  { value: "male",   label: "Male"   },
  { value: "female", label: "Female" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Avatar({ name, size = 56 }) {
  const initials = name.split(" ").filter(Boolean).map(n => n[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: "rgba(232,74,12,0.15)", border: "2px solid rgba(232,74,12,0.4)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.32, fontWeight: 900, color: "#E84A0C", flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

function Field({ icon: Icon, label, value }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <Icon size={11} color="rgba(255,255,255,0.3)" />
        <span style={{ fontSize: "9px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)" }}>
          {label}
        </span>
      </div>
      <p style={{ fontSize: "13px", fontWeight: 700, color: "#fff", margin: 0, wordBreak: "break-word" }}>
        {value || <span style={{ color: "rgba(255,255,255,0.25)", fontWeight: 400 }}>—</span>}
      </p>
    </div>
  );
}

function SelectField({ label, icon: Icon, value, onChange, options }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <Icon size={11} color="rgba(255,255,255,0.3)" />
        <span style={{ fontSize: "9px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)" }}>
          {label}
        </span>
      </div>
      <div style={{ position: "relative" }}>
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{
            width: "100%", appearance: "none", WebkitAppearance: "none",
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "10px", color: "#fff", fontSize: "13px", fontWeight: 700,
            padding: "9px 32px 9px 12px", outline: "none", cursor: "pointer", boxSizing: "border-box",
          }}
        >
          {options.map(o => (
            <option key={o.value ?? o} value={o.value ?? o} style={{ background: "#0A1018", color: "#fff" }}>
              {o.label ?? o}
            </option>
          ))}
        </select>
        <ChevronDown size={13} color="rgba(255,255,255,0.35)"
          style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
      </div>
    </div>
  );
}

function TextInputField({ label, icon: Icon, value, onChange, placeholder }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <Icon size={11} color="rgba(255,255,255,0.3)" />
        <span style={{ fontSize: "9px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)" }}>
          {label}
        </span>
      </div>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%", background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.12)", borderRadius: "10px",
          color: "#fff", fontSize: "13px", fontWeight: 700,
          padding: "9px 12px", outline: "none", boxSizing: "border-box",
        }}
      />
    </div>
  );
}

function SubjectPill({ name }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center",
      background: "rgba(27,127,196,0.12)", border: "1px solid rgba(27,127,196,0.25)",
      borderRadius: "999px", padding: "4px 12px",
    }}>
      <span style={{ fontSize: "11px", fontWeight: 700, color: "#60a5fa" }}>{name}</span>
    </div>
  );
}

// ─── ProfileTab ───────────────────────────────────────────────────────────────

export default function ProfileTab({ student, subscription }) {
  // local copy of student data so the display updates after save
  const [localStudent, setLocalStudent] = useState(null);

  const [editing, setEditing]         = useState(false);
  const [saving, setSaving]           = useState(false);
  const [saveError, setSaveError]     = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // editable fields (form state)
  const [sex, setSex]           = useState("");
  const [county, setCounty]     = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [level, setLevel]       = useState("");

  // subjects
  const [subjects, setSubjects]               = useState([]);
  const [allSubjects, setAllSubjects]         = useState([]);
  const [subjectsLoading, setSubjectsLoading] = useState(false);
  const [addingSubject, setAddingSubject]     = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [addingId, setAddingId]               = useState(null);
  const [subjectError, setSubjectError]       = useState(null);

  // seed local copy + form from prop
  useEffect(() => {
    if (!student) return;
    setLocalStudent(student);
    setSex(student.sex ?? "");
    setCounty(student.county ?? "");
    setSchoolName(student.school_name ?? "");
    setLevel(student.current_school_level ?? "");
    setSubjects(student.subjects ?? []);
  }, [student]);

  // fetch all available subjects once
  useEffect(() => {
    const load = async () => {
      setSubjectsLoading(true);
      try {
        const res = await getData("subjects/");
        setAllSubjects(res?.results ?? []);
      } catch (e) {
        console.error("Failed to fetch subjects", e);
      } finally {
        setSubjectsLoading(false);
      }
    };
    load();
  }, []);

  if (!localStudent) {
    return (
      <div style={{ padding: "64px 0", textAlign: "center" }}>
        <Loader2 size={24} color="rgba(255,255,255,0.3)" style={{ animation: "spin 1s linear infinite", margin: "0 auto" }} />
      </div>
    );
  }

  const fullName = [localStudent.first_name, localStudent.middle_names, localStudent.last_name].filter(Boolean).join(" ");
  const enrolledIds = new Set(subjects.map(s => s.id));
  const availableToAdd = allSubjects.filter(s => !enrolledIds.has(s.id));

  // ── Save profile ────────────────────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      await patchData(`students/${localStudent.id}/`, {
        sex,
        county,
        school_name: schoolName,
        current_school_level: level,
      });
      // update local display copy so the read-only view reflects new values immediately
      setLocalStudent(prev => ({
        ...prev,
        sex,
        county,
        school_name: schoolName,
        current_school_level: level,
      }));
      setSaveSuccess(true);
      setEditing(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to save profile:", err);
      setSaveError("Could not save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // reset form to current local (already-saved) values
    setSex(localStudent.sex ?? "");
    setCounty(localStudent.county ?? "");
    setSchoolName(localStudent.school_name ?? "");
    setLevel(localStudent.current_school_level ?? "");
    setSaveError(null);
    setEditing(false);
  };

  // ── Add subject ─────────────────────────────────────────────────────────────
  const handleAddSubject = async () => {
    if (!selectedSubject) return;
    setAddingId(selectedSubject);
    setSubjectError(null);
    try {
      await createData("student-subjects/", { student: localStudent.id, subject: selectedSubject });
      const added = allSubjects.find(s => s.id === selectedSubject);
      if (added) setSubjects(prev => [...prev, added]);
      setSelectedSubject("");
      setAddingSubject(false);
    } catch (err) {
      console.error("Failed to add subject:", err);
      setSubjectError("Could not add subject. Please try again.");
    } finally {
      setAddingId(null);
    }
  };

  // ── Shared card style ────────────────────────────────────────────────────────
  const card = {
    borderRadius: "16px", overflow: "hidden",
    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
  };

  return (
    <div style={{ width: "100%", maxWidth: "100%", boxSizing: "border-box", overflowX: "hidden", display: "flex", flexDirection: "column", gap: "16px" }}>

      {/* ── Page header ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <User size={16} color="rgba(255,255,255,0.4)" />
        <p style={{ fontSize: "12px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)", margin: 0 }}>
          My Profile
        </p>
      </div>

      {/* ── Identity card (read-only) ── */}
      <div style={card}>
        <div style={{ height: "4px", background: "linear-gradient(90deg, #E84A0C, #1B7FC4)" }} />
        <div style={{ padding: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "20px" }}>
            <Avatar name={fullName} />
            <div style={{ minWidth: 0, flex: 1 }}>
              <p style={{ fontSize: "16px", fontWeight: 900, color: "#fff", margin: "0 0 2px", wordBreak: "break-word" }}>
                {fullName}
              </p>
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", margin: 0 }}>
                {localStudent.admission_number}
              </p>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <Field icon={User}          label="First Name"    value={localStudent.first_name} />
            <Field icon={User}          label="Last Name"     value={localStudent.last_name} />
            {localStudent.middle_names && (
              <div style={{ gridColumn: "1 / -1" }}>
                <Field icon={User} label="Middle Names" value={localStudent.middle_names} />
              </div>
            )}
            <Field icon={GraduationCap} label="Date of Birth" value={localStudent.date_of_birth} />
            <Field icon={BookOpen}      label="Admission No."  value={localStudent.admission_number} />
          </div>
        </div>
      </div>

      {/* ── Editable school details ── */}
      <div style={card}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Edit3 size={13} color="rgba(255,255,255,0.35)" />
            <span style={{ fontSize: "10px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.35)" }}>
              School Details
            </span>
          </div>

          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              style={{
                background: "rgba(232,74,12,0.12)", border: "1px solid rgba(232,74,12,0.25)",
                borderRadius: "8px", color: "#E84A0C", fontSize: "11px", fontWeight: 900,
                padding: "5px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px",
              }}
            >
              <Edit3 size={11} /> Edit
            </button>
          ) : (
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={handleCancel}
                disabled={saving}
                style={{
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px", color: "rgba(255,255,255,0.5)", fontSize: "11px", fontWeight: 900,
                  padding: "5px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px",
                }}
              >
                <X size={11} /> Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  background: saving ? "rgba(74,222,128,0.08)" : "rgba(74,222,128,0.15)",
                  border: "1px solid rgba(74,222,128,0.3)",
                  borderRadius: "8px", color: "#4ade80", fontSize: "11px", fontWeight: 900,
                  padding: "5px 12px", cursor: saving ? "default" : "pointer",
                  display: "flex", alignItems: "center", gap: "5px",
                }}
              >
                {saving
                  ? <Loader2 size={11} style={{ animation: "spin 1s linear infinite" }} />
                  : <Check size={11} />
                }
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          )}
        </div>

        <div style={{ padding: "14px 16px 16px", display: "flex", flexDirection: "column", gap: "14px" }}>
          {saveSuccess && (
            <div style={{ borderRadius: "10px", padding: "10px 14px", background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)", display: "flex", alignItems: "center", gap: "8px" }}>
              <Check size={13} color="#4ade80" />
              <span style={{ fontSize: "12px", color: "#4ade80", fontWeight: 700 }}>Profile updated successfully.</span>
            </div>
          )}
          {saveError && (
            <div style={{ borderRadius: "10px", padding: "10px 14px", background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)" }}>
              <span style={{ fontSize: "12px", color: "#f87171", fontWeight: 700 }}>{saveError}</span>
            </div>
          )}

          {editing ? (
            <>
              <SelectField label="Sex" icon={User} value={sex} onChange={setSex} options={SEX_OPTIONS} />
              <SelectField
                label="Current Level" icon={GraduationCap}
                value={level} onChange={setLevel}
                options={SCHOOL_LEVELS.map(l => ({ value: l, label: l }))}
              />
              <TextInputField
                label="School Name" icon={School}
                value={schoolName} onChange={setSchoolName}
                placeholder="e.g. St. Teresa Girls"
              />
              <SelectField
                label="County" icon={MapPin}
                value={county} onChange={setCounty}
                options={KENYA_COUNTIES.map(c => ({ value: c, label: c }))}
              />
            </>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <Field icon={User}          label="Sex"           value={localStudent.sex ? localStudent.sex.charAt(0).toUpperCase() + localStudent.sex.slice(1) : ""} />
              <Field icon={GraduationCap} label="Current Level" value={localStudent.current_school_level} />
              <Field icon={School}        label="School"        value={localStudent.school_name} />
              <Field icon={MapPin}        label="County"        value={localStudent.county} />
            </div>
          )}
        </div>
      </div>

      {/* ── Subjects ── */}
      <div style={card}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <BookOpen size={13} color="rgba(255,255,255,0.35)" />
            <span style={{ fontSize: "10px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.35)" }}>
              Enrolled Subjects
            </span>
            <span style={{
              fontSize: "9px", fontWeight: 900, padding: "1px 7px", borderRadius: "999px",
              background: "rgba(27,127,196,0.12)", color: "#60a5fa", border: "1px solid rgba(96,165,250,0.2)",
            }}>
              {subjects.length}
            </span>
          </div>

          {!addingSubject && availableToAdd.length > 0 && (
            <button
              onClick={() => { setAddingSubject(true); setSubjectError(null); }}
              style={{
                background: "rgba(27,127,196,0.12)", border: "1px solid rgba(27,127,196,0.25)",
                borderRadius: "8px", color: "#60a5fa", fontSize: "11px", fontWeight: 900,
                padding: "5px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px",
              }}
            >
              <Plus size={11} /> Add Subject
            </button>
          )}
        </div>

        <div style={{ padding: "14px 16px 16px", display: "flex", flexDirection: "column", gap: "12px" }}>
          {/* Add subject row */}
          {addingSubject && (
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <div style={{ position: "relative", flex: 1 }}>
                <select
                  value={selectedSubject}
                  onChange={e => setSelectedSubject(e.target.value)}
                  style={{
                    width: "100%", appearance: "none", WebkitAppearance: "none",
                    background: "rgba(255,255,255,0.06)", border: "1px solid rgba(27,127,196,0.3)",
                    borderRadius: "10px", color: selectedSubject ? "#fff" : "rgba(255,255,255,0.4)",
                    fontSize: "12px", fontWeight: 700, padding: "8px 28px 8px 12px",
                    outline: "none", cursor: "pointer", boxSizing: "border-box",
                  }}
                >
                  <option value="" style={{ background: "#0A1018" }}>Select a subject…</option>
                  {availableToAdd.map(s => (
                    <option key={s.id} value={s.id} style={{ background: "#0A1018", color: "#fff" }}>{s.name}</option>
                  ))}
                </select>
                <ChevronDown size={12} color="rgba(255,255,255,0.35)"
                  style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
              </div>
              <button
                onClick={handleAddSubject}
                disabled={!selectedSubject || !!addingId}
                style={{
                  background: selectedSubject ? "rgba(74,222,128,0.15)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${selectedSubject ? "rgba(74,222,128,0.3)" : "rgba(255,255,255,0.08)"}`,
                  borderRadius: "10px", color: selectedSubject ? "#4ade80" : "rgba(255,255,255,0.25)",
                  padding: "8px 12px", cursor: selectedSubject ? "pointer" : "default",
                  display: "flex", alignItems: "center", fontSize: "12px", fontWeight: 900,
                }}
              >
                {addingId
                  ? <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} />
                  : <Check size={13} />
                }
              </button>
              <button
                onClick={() => { setAddingSubject(false); setSelectedSubject(""); setSubjectError(null); }}
                style={{
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "10px", color: "rgba(255,255,255,0.4)",
                  padding: "8px 12px", cursor: "pointer", display: "flex", alignItems: "center",
                }}
              >
                <X size={13} />
              </button>
            </div>
          )}

          {subjectError && (
            <div style={{ borderRadius: "10px", padding: "8px 12px", background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)" }}>
              <span style={{ fontSize: "12px", color: "#f87171", fontWeight: 700 }}>{subjectError}</span>
            </div>
          )}

          {subjectsLoading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "16px 0" }}>
              <Loader2 size={18} color="rgba(255,255,255,0.3)" style={{ animation: "spin 1s linear infinite" }} />
            </div>
          ) : subjects.length === 0 ? (
            <div style={{ padding: "24px 0", textAlign: "center" }}>
              <p style={{ fontSize: "24px", margin: "0 0 6px" }}>📚</p>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", margin: 0 }}>No subjects enrolled yet.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {subjects.map(s => <SubjectPill key={s.id} name={s.name} />)}
            </div>
          )}
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}