import { useEffect, useMemo, useRef, useState } from "react";
import { NAV_ITEMS } from "../../data/teacher.dashboard.data";
import { getData } from "../../api/api.service";
import { getAuthorId } from "../../utils/notes.utils";

// ─────────────────────────────────────────────────────────────────────────────
// ── Helpers
// ─────────────────────────────────────────────────────────────────────────────

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function greetingEmoji() {
  const h = new Date().getHours();
  if (h < 12) return "🌤";
  if (h < 17) return "☀️";
  return "🌙";
}

function fmtTime() {
  return new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

// ─────────────────────────────────────────────────────────────────────────────
// ── NotificationDropdown
// ─────────────────────────────────────────────────────────────────────────────

function NotificationDropdown({ pendingSubs, onMarkNow, onClose }) {
  const hasNotifs = pendingSubs > 0;

  return (
    <div
      className="absolute right-0 top-full mt-2 w-72 rounded-2xl overflow-hidden z-50"
      style={{
        background: "rgba(10,18,35,0.97)",
        border: "1px solid rgba(255,255,255,0.09)",
        boxShadow: "0 24px 48px rgba(0,0,0,0.5)",
        backdropFilter: "blur(24px)",
      }}
    >
      {/* Dropdown header */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <p className="text-xs font-black text-white/60 uppercase tracking-widest">Notifications</p>
        {hasNotifs && (
          <span
            className="text-[10px] font-black px-2 py-0.5 rounded-full"
            style={{ background: "rgba(220,38,38,0.2)", color: "#F87171" }}
          >
            {pendingSubs} new
          </span>
        )}
      </div>

      {/* Dropdown body */}
      <div className="p-2">
        {hasNotifs ? (
          <div
            className="rounded-xl p-3 flex items-start gap-3 cursor-pointer transition-all hover:opacity-80"
            style={{ background: "rgba(220,38,38,0.07)", border: "1px solid rgba(220,38,38,0.18)" }}
            onClick={() => { onMarkNow?.(); onClose(); }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0 mt-0.5"
              style={{ background: "rgba(220,38,38,0.15)" }}
            >
              📝
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-white leading-tight">
                {pendingSubs} submission{pendingSubs !== 1 ? "s" : ""} awaiting marking
              </p>
              <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                Students are waiting for their results
              </p>
              <p className="text-[11px] mt-2 font-black" style={{ color: "#F87171" }}>
                Tap to mark now →
              </p>
            </div>
          </div>
        ) : (
          <div className="py-6 flex flex-col items-center gap-2">
            <span className="text-2xl">✅</span>
            <p className="text-xs font-black" style={{ color: "rgba(255,255,255,0.3)" }}>
              All submissions marked
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── Header
// ─────────────────────────────────────────────────────────────────────────────

export default function Header({ active, onToggleSidebar, onLogout, onNav }) {
  const userId = useMemo(() => getAuthorId(), []);

  const [teacherName, setTeacherName] = useState("");
  const [pendingSubs, setPendingSubs] = useState(0);
  const [notifOpen,   setNotifOpen]   = useState(false);
  const [time,        setTime]        = useState(fmtTime());

  const notifRef = useRef(null);

  // ── Live clock — updates every 30 s
  useEffect(() => {
    const id = setInterval(() => setTime(fmtTime()), 30_000);
    return () => clearInterval(id);
  }, []);

  // ── Fetch teacher name
  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        const res = await getData(`teachers/?user_id=${userId}`);
        const t = res?.results?.[0];
        if (t) setTeacherName(`${t.first_name} ${t.last_name}`);
      } catch {
        // fail silently
      }
    })();
  }, [userId]);

  // ── Fetch pending submissions count
  useEffect(() => {
    (async () => {
      try {
        const res = await getData("teacher/dashboard/stats/");
        if (res) setPendingSubs(res.total_exam_submissions - res.total_exams_marked);
      } catch {
        // fail silently
      }
    })();
  }, []);

  // ── Close notification dropdown on outside click
  useEffect(() => {
    if (!notifOpen) return;
    function handleOutsideClick(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [notifOpen]);

  const current = NAV_ITEMS.find((n) => n.key === active);

  return (
    <header
      className="sticky top-0 z-40 flex items-center gap-3 px-5 py-3"
      style={{
        background: "rgba(8,14,26,0.92)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Sidebar toggle */}
      <button
        onClick={onToggleSidebar}
        className="hidden lg:flex w-9 h-9 rounded-lg items-center justify-center text-sm font-black transition-all hover:opacity-70 shrink-0"
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.09)",
          color: "rgba(255,255,255,0.5)",
        }}
      >
        ☰
      </button>

      {/* Current page label */}
      <div className="flex items-center gap-2 min-w-0">
        <span className="font-black text-lg shrink-0" style={{ color: "#0D9488" }}>
          {current?.icon}
        </span>
        <h1 className="font-black text-white text-base truncate">{current?.label}</h1>
      </div>

      {/* ── Right side ── */}
      <div className="ml-auto flex items-center gap-2 shrink-0">

        {/* Greeting + name (md and up) */}
        {teacherName && (
          <div className="hidden md:flex flex-col items-end leading-tight mr-1">
            <span
              className="text-[10px] font-bold uppercase tracking-widest"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              {greetingEmoji()} {greeting()}
            </span>
            <span className="text-sm font-black text-white">{teacherName}</span>
          </div>
        )}

        {/* Live time pill */}
        <div
          className="hidden sm:flex items-center px-2.5 py-1 rounded-lg text-[11px] font-black tabular-nums"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
            color: "rgba(255,255,255,0.35)",
          }}
        >
          {time}
        </div>

        {/* Notification bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen((o) => !o)}
            className="relative w-9 h-9 rounded-xl flex items-center justify-center text-base transition-all hover:opacity-80"
            style={{
              background: notifOpen
                ? "rgba(220,38,38,0.12)"
                : "rgba(255,255,255,0.05)",
              border: notifOpen
                ? "1px solid rgba(220,38,38,0.3)"
                : "1px solid rgba(255,255,255,0.09)",
            }}
          >
            🔔
            {pendingSubs > 0 && (
              <span
                className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] font-black px-1"
                style={{ background: "#DC2626", color: "#fff", lineHeight: 1 }}
              >
                {pendingSubs}
              </span>
            )}
          </button>

          {notifOpen && (
            <NotificationDropdown
              pendingSubs={pendingSubs}
              onMarkNow={() => onNav?.("exams")}
              onClose={() => setNotifOpen(false)}
            />
          )}
        </div>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:opacity-70"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.4)",
          }}
        >
          ↩ Logout
        </button>
      </div>
    </header>
  );
}