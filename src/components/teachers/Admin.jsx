import { useState, useEffect } from "react";
import {
  ShieldCheck, UserPlus, BookOpen, Tag, ChevronDown,
  Check, X, Loader2, Plus, ChevronRight, AlertCircle,
} from "lucide-react";
import { createData, getData } from "../../api/api.service";

// ─── Constants ────────────────────────────────────────────────────────────────

const KENYA_COUNTIES = [
  "Baringo","Bomet","Bungoma","Busia","Elgeyo-Marakwet","Embu","Garissa",
  "Homa Bay","Isiolo","Kajiado","Kakamega","Kericho","Kiambu","Kilifi",
  "Kirinyaga","Kisii","Kisumu","Kitui","Kwale","Laikipia","Lamu","Machakos",
  "Makueni","Mandera","Marsabit","Meru","Migori","Mombasa","Murang'a",
  "Nairobi","Nakuru","Nandi","Narok","Nyamira","Nyandarua","Nyeri",
  "Samburu","Siaya","Taita-Taveta","Tana River","Tharaka-Nithi","Trans Nzoia",
  "Turkana","Uasin Gishu","Vihiga","Wajir","West Pokot",
];

const SEX_OPTIONS = [
  { value: "male",   label: "Male"   },
  { value: "female", label: "Female" },
];

// ─── Shared primitives ────────────────────────────────────────────────────────

const s = {
  card: {
    borderRadius: "16px", overflow: "hidden",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    boxSizing: "border-box", width: "100%",
  },
  cardPad: { padding: "16px", boxSizing: "border-box" },
  label: {
    fontSize: "9px", fontWeight: 900, textTransform: "uppercase",
    letterSpacing: "0.1em", color: "rgba(255,255,255,0.35)",
    display: "block", marginBottom: "6px",
  },
  input: {
    width: "100%", boxSizing: "border-box",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "10px", color: "#fff",
    fontSize: "13px", fontWeight: 600,
    padding: "9px 12px", outline: "none",
  },
  inputFocus: { border: "1px solid rgba(27,127,196,0.5)", background: "rgba(27,127,196,0.06)" },
  select: {
    width: "100%", boxSizing: "border-box", appearance: "none", WebkitAppearance: "none",
    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "10px", color: "#fff", fontSize: "13px", fontWeight: 600,
    padding: "9px 32px 9px 12px", outline: "none", cursor: "pointer",
  },
  error: {
    borderRadius: "10px", padding: "10px 14px",
    background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)",
    color: "#f87171", fontSize: "12px", fontWeight: 700,
    display: "flex", alignItems: "flex-start", gap: "8px",
  },
  success: {
    borderRadius: "10px", padding: "10px 14px",
    background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)",
    color: "#4ade80", fontSize: "12px", fontWeight: 700,
    display: "flex", alignItems: "center", gap: "8px",
  },
};

function Input({ label, value, onChange, placeholder, type = "text" }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label style={s.label}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{ ...s.input, ...(focused ? s.inputFocus : {}) }}
      />
    </div>
  );
}

function Select({ label, value, onChange, options, placeholder }) {
  return (
    <div>
      <label style={s.label}>{label}</label>
      <div style={{ position: "relative" }}>
        <select value={value} onChange={e => onChange(e.target.value)} style={s.select}>
          {placeholder && <option value="" style={{ background: "#0A1018" }}>{placeholder}</option>}
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

function SubmitBtn({ loading, label, loadingLabel, disabled }) {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      style={{
        width: "100%", padding: "11px", borderRadius: "12px",
        background: loading || disabled ? "rgba(232,74,12,0.12)" : "rgba(232,74,12,0.9)",
        border: "1px solid rgba(232,74,12,0.4)",
        color: loading || disabled ? "rgba(255,255,255,0.4)" : "#fff",
        fontSize: "13px", fontWeight: 900, cursor: loading || disabled ? "default" : "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
        transition: "all 0.15s",
      }}
    >
      {loading
        ? <><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />{loadingLabel}</>
        : <><Check size={14} />{label}</>
      }
    </button>
  );
}

function SectionHeader({ icon: Icon, color, bg, title, subtitle }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
      <div style={{ width: 40, height: 40, borderRadius: "12px", background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon size={20} color={color} />
      </div>
      <div>
        <p style={{ fontSize: "15px", fontWeight: 900, color: "#fff", margin: 0 }}>{title}</p>
        <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", margin: 0 }}>{subtitle}</p>
      </div>
    </div>
  );
}

// ─── Panel switcher tabs ──────────────────────────────────────────────────────

const PANELS = [
  { id: "teacher",  label: "New Teacher",  icon: UserPlus  },
  { id: "subject",  label: "New Subject",  icon: BookOpen  },
  { id: "tag",      label: "Subject Tag",  icon: Tag       },
];

function PanelTabs({ active, onChange }) {
  return (
    <div style={{ display: "flex", gap: "6px", marginBottom: "20px" }}>
      {PANELS.map(p => {
        const isActive = active === p.id;
        return (
          <button
            key={p.id}
            onClick={() => onChange(p.id)}
            style={{
              flex: 1, padding: "8px 4px", borderRadius: "10px",
              background: isActive ? "rgba(232,74,12,0.15)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${isActive ? "rgba(232,74,12,0.35)" : "rgba(255,255,255,0.08)"}`,
              color: isActive ? "#E84A0C" : "rgba(255,255,255,0.4)",
              fontSize: "10px", fontWeight: 900, cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
              transition: "all 0.15s",
            }}
          >
            <p.icon size={14} />
            <span style={{ whiteSpace: "nowrap" }}>{p.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Create Teacher form ──────────────────────────────────────────────────────

function CreateTeacherForm() {
  const empty = { first_name: "", last_name: "", email: "", phone_number: "", sex: "", county: "", date_of_birth: "", tsc_number: "" };
  const [form, setForm]       = useState(empty);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(null);

  const set = k => v => setForm(f => ({ ...f, [k]: v }));

  const valid = Object.values(form).every(v => v.trim() !== "");

  const handleSubmit = async e => {
    e.preventDefault();
    if (!valid) return;
    setLoading(true); setError(null); setSuccess(null);
    try {
      await createData("teachers/", form);
      setSuccess(`Teacher ${form.first_name} ${form.last_name} created. Login: ${form.email} / ${form.tsc_number}`);
      setForm(empty);
    } catch (err) {
      const msg = err?.response?.data
        ? Object.entries(err.response.data).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`).join(" · ")
        : "Failed to create teacher. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      <SectionHeader
        icon={UserPlus} color="#E84A0C" bg="rgba(232,74,12,0.12)"
        title="Create Teacher Account"
        subtitle="Email becomes username · TSC/ID number becomes password"
      />

      {error   && <div style={s.error}><AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} /><span>{error}</span></div>}
      {success && <div style={s.success}><Check size={14} style={{ flexShrink: 0 }} /><span>{success}</span></div>}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <Input label="First Name"   value={form.first_name}   onChange={set("first_name")}   placeholder="Jane" />
        <Input label="Last Name"    value={form.last_name}    onChange={set("last_name")}    placeholder="Mwangi" />
      </div>

      <Input label="Email Address" type="email" value={form.email} onChange={set("email")} placeholder="jane@school.ac.ke" />
      <Input label="Phone Number"  type="tel"   value={form.phone_number} onChange={set("phone_number")} placeholder="+254700000000" />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <Select label="Sex"    value={form.sex}    onChange={set("sex")}    options={SEX_OPTIONS}     placeholder="Select…" />
        <Select label="County" value={form.county} onChange={set("county")} options={KENYA_COUNTIES}  placeholder="Select…" />
      </div>

      <Input label="Date of Birth" type="date" value={form.date_of_birth} onChange={set("date_of_birth")} />

      <div>
        <Input label="TSC / National ID / Passport Number" value={form.tsc_number} onChange={set("tsc_number")} placeholder="TSC12345 or 12345678" />
        <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", margin: "5px 0 0 2px" }}>
          This will be used as the teacher's initial password.
        </p>
      </div>

      <SubmitBtn loading={loading} disabled={!valid} label="Create Teacher Account" loadingLabel="Creating…" />
    </form>
  );
}

// ─── Create Subject form ──────────────────────────────────────────────────────

function CreateSubjectForm({ onSubjectCreated }) {
  const [name, setName]       = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true); setError(null); setSuccess(null);
    try {
      const res = await createData("subjects/", { name: name.trim() });
      setSuccess(`Subject "${name.trim()}" created successfully.`);
      onSubjectCreated?.(res);
      setName("");
    } catch (err) {
      const msg = err?.response?.data?.name?.[0] ?? err?.response?.data?.detail ?? "Failed to create subject.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      <SectionHeader
        icon={BookOpen} color="#60a5fa" bg="rgba(96,165,250,0.12)"
        title="Create Subject"
        subtitle="Add a new subject to the academic catalogue"
      />

      {error   && <div style={s.error}><AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} /><span>{error}</span></div>}
      {success && <div style={s.success}><Check size={14} /><span>{success}</span></div>}

      <Input label="Subject Name" value={name} onChange={setName} placeholder="e.g. Mathematics" />
      <SubmitBtn loading={loading} disabled={!name.trim()} label="Create Subject" loadingLabel="Creating…" />
    </form>
  );
}

// ─── Create Subject Tag form ──────────────────────────────────────────────────

function CreateSubjectTagForm({ freshSubjects }) {
  const [subjects, setSubjects]       = useState([]);
  const [loadingSubs, setLoadingSubs] = useState(true);
  const [subjectId, setSubjectId]     = useState("");
  const [tagName, setTagName]         = useState("");
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);
  const [success, setSuccess]         = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getData("subjects/");
        setSubjects(res?.results ?? []);
      } catch { /* silent */ }
      finally { setLoadingSubs(false); }
    };
    load();
  }, []);

  // merge any freshly-created subjects into the list
  useEffect(() => {
    if (!freshSubjects?.length) return;
    setSubjects(prev => {
      const ids = new Set(prev.map(s => s.id));
      return [...prev, ...freshSubjects.filter(s => !ids.has(s.id))];
    });
  }, [freshSubjects]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!subjectId || !tagName.trim()) return;
    setLoading(true); setError(null); setSuccess(null);
    try {
      await createData("subject-tags/", { subject: subjectId, name: tagName.trim() });
      const subName = subjects.find(s => s.id === subjectId)?.name ?? "subject";
      setSuccess(`Tag "${tagName.trim()}" added to ${subName}.`);
      setTagName("");
    } catch (err) {
      const msg = err?.response?.data?.name?.[0] ?? err?.response?.data?.detail ?? "Failed to create tag.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const subjectOptions = subjects.map(s => ({ value: s.id, label: s.name }));

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      <SectionHeader
        icon={Tag} color="#4ade80" bg="rgba(74,222,128,0.12)"
        title="Create Subject Tag"
        subtitle="Tags help categorise topics within a subject"
      />

      {error   && <div style={s.error}><AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} /><span>{error}</span></div>}
      {success && <div style={s.success}><Check size={14} /><span>{success}</span></div>}

      {loadingSubs ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "16px 0" }}>
          <Loader2 size={18} color="rgba(255,255,255,0.3)" style={{ animation: "spin 1s linear infinite" }} />
        </div>
      ) : (
        <Select
          label="Subject"
          value={subjectId}
          onChange={setSubjectId}
          options={subjectOptions}
          placeholder="Select a subject…"
        />
      )}

      <Input label="Tag Name" value={tagName} onChange={setTagName} placeholder="e.g. Algebra, Cell Biology" />
      <SubmitBtn loading={loading} disabled={!subjectId || !tagName.trim()} label="Create Tag" loadingLabel="Creating…" />
    </form>
  );
}

// ─── AdminTab ─────────────────────────────────────────────────────────────────

export default function AdminTab() {
  const [panel, setPanel]               = useState("teacher");
  const [freshSubjects, setFreshSubjects] = useState([]);

  const handleSubjectCreated = (sub) => {
    if (sub?.id) setFreshSubjects(prev => [...prev, sub]);
  };

  return (
    <div style={{ width: "100%", maxWidth: "100%", boxSizing: "border-box", overflowX: "hidden", display: "flex", flexDirection: "column", gap: "16px" }}>

      {/* Page header */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <ShieldCheck size={16} color="rgba(255,255,255,0.4)" />
        <p style={{ fontSize: "12px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)", margin: 0 }}>
          Administration
        </p>
      </div>

      {/* Panel card */}
      <div style={s.card}>
        {/* Accent strip */}
        <div style={{ height: "3px", background: "linear-gradient(90deg, #E84A0C 0%, #1B7FC4 50%, #4ade80 100%)" }} />

        <div style={s.cardPad}>
          <PanelTabs active={panel} onChange={setPanel} />

          {panel === "teacher" && <CreateTeacherForm />}
          {panel === "subject" && <CreateSubjectForm onSubjectCreated={handleSubjectCreated} />}
          {panel === "tag"     && <CreateSubjectTagForm freshSubjects={freshSubjects} />}
        </div>
      </div>

      {/* Hint */}
      <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)", textAlign: "center", margin: 0 }}>
        Changes take effect immediately. Share credentials with teachers securely.
      </p>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}