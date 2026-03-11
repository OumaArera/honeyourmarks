import { useEffect, useMemo, useState } from "react";
import { getData, createData } from "../../api/api.service";
import { getAuthorId } from "../../utils/notes.utils";

// ─────────────────────────────────────────────────────────────────────────────
// ── Helpers
// ─────────────────────────────────────────────────────────────────────────────

function fmtDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
}

function getInitials(first = "", last = "") {
  return `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase();
}

// ─────────────────────────────────────────────────────────────────────────────
// ── Skeleton
// ─────────────────────────────────────────────────────────────────────────────

function Skeleton({ w = "w-full", h = "h-4", rounded = "rounded-lg" }) {
  return (
    <div className={`${w} ${h} ${rounded} animate-pulse`}
      style={{ background: "rgba(255,255,255,0.07)" }} />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── InfoRow
// ─────────────────────────────────────────────────────────────────────────────

function InfoRow({ label, value, loading }) {
  return (
    <div className="flex flex-col gap-1 py-3"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <p className="text-[9px] font-black tracking-widest uppercase"
        style={{ color: "rgba(255,255,255,0.28)" }}>{label}</p>
      {loading
        ? <Skeleton w="w-40" h="h-4" />
        : <p className="text-sm font-bold text-white">{value || "—"}</p>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── PasswordSection
// ─────────────────────────────────────────────────────────────────────────────

function PasswordSection() {
  const [oldPw,    setOldPw]    = useState("");
  const [newPw,    setNewPw]    = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [saving,   setSaving]   = useState(false);
  const [success,  setSuccess]  = useState(false);
  const [error,    setError]    = useState(null);
  const [showOld,  setShowOld]  = useState(false);
  const [showNew,  setShowNew]  = useState(false);

  const isValid = oldPw.trim() && newPw.trim().length >= 8 && newPw === confirmPw;

  const handleSubmit = async () => {
    if (!isValid || saving) return;
    setSaving(true); setError(null); setSuccess(false);
    try {
      const res = await createData("auth/change-password/", {
        old_password: oldPw,
        new_password: newPw,
      });
      if (res?.error) throw new Error(
        typeof res.error === "string" ? res.error : JSON.stringify(res.error)
      );
      setSuccess(true);
      setOldPw(""); setNewPw(""); setConfirmPw("");
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError(err.message || "Failed to change password.");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#fff",
  };

  const inputCls = "w-full rounded-xl px-4 py-2.5 text-sm text-white outline-none pr-10";

  return (
    <div className="rounded-2xl p-5 space-y-4"
      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
      <div>
        <p className="text-sm font-black text-white">🔒 Change Password</p>
        <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
          New password must be at least 8 characters
        </p>
      </div>

      <div className="space-y-3">
        {/* Old password */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black tracking-widest uppercase"
            style={{ color: "rgba(255,255,255,0.35)" }}>Current Password</label>
          <div className="relative">
            <input
              type={showOld ? "text" : "password"}
              value={oldPw} onChange={(e) => setOldPw(e.target.value)}
              placeholder="Enter current password"
              className={inputCls} style={inputStyle}
            />
            <button
              type="button" onClick={() => setShowOld((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >{showOld ? "🙈" : "👁"}</button>
          </div>
        </div>

        {/* New password */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black tracking-widest uppercase"
            style={{ color: "rgba(255,255,255,0.35)" }}>New Password</label>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              value={newPw} onChange={(e) => setNewPw(e.target.value)}
              placeholder="At least 8 characters"
              className={inputCls} style={inputStyle}
            />
            <button
              type="button" onClick={() => setShowNew((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >{showNew ? "🙈" : "👁"}</button>
          </div>
          {/* Strength bar */}
          {newPw && (
            <div className="flex gap-1 mt-1">
              {[8, 12, 16].map((thresh, i) => (
                <div key={thresh} className="flex-1 h-1 rounded-full transition-all"
                  style={{
                    background: newPw.length >= thresh
                      ? i === 0 ? "#EF4444" : i === 1 ? "#F59E0B" : "#10B981"
                      : "rgba(255,255,255,0.08)"
                  }} />
              ))}
            </div>
          )}
        </div>

        {/* Confirm */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black tracking-widest uppercase"
            style={{ color: "rgba(255,255,255,0.35)" }}>Confirm New Password</label>
          <input
            type="password"
            value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)}
            placeholder="Repeat new password"
            className={`${inputCls} pr-4`}
            style={{
              ...inputStyle,
              borderColor: confirmPw && newPw !== confirmPw
                ? "rgba(239,68,68,0.5)"
                : confirmPw && newPw === confirmPw
                  ? "rgba(16,185,129,0.5)"
                  : "rgba(255,255,255,0.1)",
            }}
          />
          {confirmPw && newPw !== confirmPw && (
            <p className="text-[10px]" style={{ color: "#F87171" }}>Passwords do not match</p>
          )}
        </div>
      </div>

      {error && (
        <p className="text-xs px-3 py-2.5 rounded-xl"
          style={{ background: "rgba(239,68,68,0.08)", color: "#F87171", border: "1px solid rgba(239,68,68,0.18)" }}>
          {error}
        </p>
      )}

      {success && (
        <p className="text-xs px-3 py-2.5 rounded-xl"
          style={{ background: "rgba(16,185,129,0.08)", color: "#34D399", border: "1px solid rgba(16,185,129,0.18)" }}>
          ✅ Password changed successfully
        </p>
      )}

      <button
        onClick={handleSubmit}
        disabled={!isValid || saving}
        className="w-full py-2.5 rounded-xl text-sm font-black transition-all disabled:opacity-40"
        style={{
          background: isValid ? "linear-gradient(135deg,#1D4ED8,#3B82F6)" : "rgba(255,255,255,0.06)",
          color: isValid ? "#fff" : "rgba(255,255,255,0.3)",
          boxShadow: isValid ? "0 4px 16px rgba(29,78,216,0.3)" : "none",
        }}
      >
        {saving ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Updating…
          </span>
        ) : "Update Password"}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── ProfileTab
// ─────────────────────────────────────────────────────────────────────────────

export default function ProfileTab() {
  const userId = useMemo(() => getAuthorId(), []);

  const [teacher,  setTeacher]  = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        const res = await getData(`teachers/?user_id=${userId}`);
        if (res?.error) throw new Error(res.error);
        const t = res?.results?.[0];
        if (!t) throw new Error("Teacher profile not found.");
        setTeacher(t);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  const fullName = teacher ? `${teacher.first_name} ${teacher.last_name}` : "";
  const initials = getInitials(teacher?.first_name, teacher?.last_name);

  return (
    <div className="space-y-6 pb-10">

      {/* Error */}
      {error && (
        <div className="rounded-xl px-4 py-3 text-sm"
          style={{ background: "rgba(239,68,68,0.08)", color: "#F87171", border: "1px solid rgba(239,68,68,0.2)" }}>
          ⚠️ {error}
        </div>
      )}

      {/* ── Avatar hero ── */}
      <div
        className="rounded-2xl p-6 flex items-center gap-5"
        style={{
          background: "linear-gradient(135deg,#0C2340,#081C14 70%,#0C1A2E)",
          border: "1px solid rgba(13,148,136,0.2)",
        }}
      >
        {/* Avatar circle */}
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-black shrink-0"
          style={{
            background: "linear-gradient(135deg,rgba(13,148,136,0.4),rgba(8,145,178,0.25))",
            border: "2px solid rgba(13,148,136,0.4)",
            color: "#2DD4BF",
          }}
        >
          {loading ? "👤" : initials}
        </div>

        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="space-y-2">
              <Skeleton w="w-44" h="h-6" />
              <Skeleton w="w-32" h="h-3" />
              <Skeleton w="w-24" h="h-3" />
            </div>
          ) : (
            <>
              <h1 className="text-white font-black text-xl truncate">{fullName}</h1>
              <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
                {teacher?.tsc_number ?? "Teacher"}
              </p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span
                  className="text-[10px] font-black px-2.5 py-1 rounded-full"
                  style={{ background: "rgba(13,148,136,0.15)", color: "#2DD4BF", border: "1px solid rgba(13,148,136,0.25)" }}
                >
                  📍 {teacher?.county ?? "—"}
                </span>
                <span
                  className="text-[10px] font-black px-2.5 py-1 rounded-full"
                  style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.45)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  {teacher?.sex ? teacher.sex.charAt(0).toUpperCase() + teacher.sex.slice(1) : "—"}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Personal details ── */}
      <div
        className="rounded-2xl px-5 py-2"
        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <p className="text-[10px] font-black tracking-widest uppercase pt-4 pb-2"
          style={{ color: "rgba(255,255,255,0.28)" }}>Personal Information</p>

        {[
          { label: "Full Name",     value: fullName },
          { label: "Email",         value: teacher?.email },
          { label: "Username",      value: teacher?.username },
          { label: "Phone",         value: teacher?.phone_number },
          { label: "TSC Number",    value: teacher?.tsc_number },
          { label: "County",        value: teacher?.county },
          { label: "Date of Birth", value: fmtDate(teacher?.date_of_birth) },
          { label: "Joined",        value: fmtDate(teacher?.created_at) },
        ].map(({ label, value }) => (
          <InfoRow key={label} label={label} value={value} loading={loading} />
        ))}

        {/* remove bottom border on last */}
        <div className="h-3" />
      </div>

      {/* ── Password change ── */}
      <PasswordSection />
    </div>
  );
}