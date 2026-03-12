import React, { useState, useEffect, useCallback } from "react";
import { Video, Clock, ExternalLink, Users, Calendar, ChevronRight, Lock, ChevronDown } from "lucide-react";
import { getData } from "../../api/api.service";
import { hasActivePlan } from "../../utils/subscription.utils";

const DATE_FILTERS = [
  { value: "",           label: "All Dates"  },
  { value: "today",      label: "Today"      },
  { value: "tomorrow",   label: "Tomorrow"   },
  { value: "this_week",  label: "This Week"  },
  { value: "next_week",  label: "Next Week"  },
  { value: "last_week",  label: "Last Week"  },
  { value: "this_month", label: "This Month" },
];

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-KE", {
    weekday: "short", day: "numeric", month: "short", year: "numeric",
  });
}

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString("en-KE", {
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
}

function getDuration(start, end) {
  const mins = Math.round((new Date(end) - new Date(start)) / 60000);
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

function getStatus(start, end) {
  const now = Date.now();
  const s   = new Date(start).getTime();
  const e   = new Date(end).getTime();
  if (now < s) return "upcoming";
  if (now >= s && now <= e) return "live";
  return "ended";
}

const STATUS_CONFIG = {
  live:     { label: "Live",     color: "#4ade80", bg: "rgba(74,222,128,0.12)",  border: "rgba(74,222,128,0.25)",  dot: true  },
  upcoming: { label: "Upcoming", color: "#60a5fa", bg: "rgba(96,165,250,0.12)",  border: "rgba(96,165,250,0.25)",  dot: false },
  ended:    { label: "Ended",    color: "rgba(255,255,255,0.25)", bg: "rgba(255,255,255,0.05)", border: "rgba(255,255,255,0.1)", dot: false },
};

// ─── Date filter select ───────────────────────────────────────────────────────

function DateFilterSelect({ value, onChange }) {
  return (
    <div style={{ position: "relative", width: "100%" }}>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: "100%",
          appearance: "none",
          WebkitAppearance: "none",
          MozAppearance: "none",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.09)",
          borderRadius: "12px",
          color: "rgba(255,255,255,0.75)",
          fontSize: "12px",
          fontWeight: 900,
          padding: "8px 32px 8px 12px",
          outline: "none",
          cursor: "pointer",
        }}
      >
        {DATE_FILTERS.map(f => (
          <option key={f.value} value={f.value} style={{ background: "#0A1018", color: "#fff" }}>
            {f.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={13}
        color="rgba(255,255,255,0.35)"
        style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
      />
    </div>
  );
}

// ─── Class card ───────────────────────────────────────────────────────────────

function ClassCard({ cls, hasPlan }) {
  const status     = getStatus(cls.start_time, cls.end_time);
  const cfg        = STATUS_CONFIG[status];
  const isJoinable = status === "live" || status === "upcoming";
  const canJoin    = hasPlan && isJoinable;

  return (
    <div
      style={{
        borderRadius: "16px",
        overflow: "hidden",
        width: "100%",
        minWidth: 0,
        background: status === "live" ? "rgba(74,222,128,0.04)" : "rgba(255,255,255,0.03)",
        border: `1px solid ${status === "live" ? "rgba(74,222,128,0.2)" : "rgba(255,255,255,0.08)"}`,
        boxSizing: "border-box",
      }}
    >
      <div style={{ padding: "16px", minWidth: 0, boxSizing: "border-box" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", minWidth: 0 }}>
          {/* Icon */}
          <div
            style={{
              width: 40, height: 40, borderRadius: "12px",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              background: status === "live" ? "rgba(74,222,128,0.12)" : "rgba(27,127,196,0.12)",
            }}
          >
            <Video size={18} color={status === "live" ? "#4ade80" : "#1B7FC4"} />
          </div>

          <div style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
            {/* Status + duration */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", flexWrap: "wrap" }}>
              <span
                style={{
                  fontSize: "9px", fontWeight: 900, padding: "2px 8px", borderRadius: "999px",
                  textTransform: "uppercase", letterSpacing: "0.05em", flexShrink: 0,
                  display: "inline-flex", alignItems: "center", gap: "4px",
                  background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
                }}
              >
                {cfg.dot && (
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.color, animation: "pulse 2s infinite" }} />
                )}
                {cfg.label}
              </span>
              <span style={{ fontSize: "9px", fontWeight: 600, color: "rgba(255,255,255,0.3)", flexShrink: 0 }}>
                {getDuration(cls.start_time, cls.end_time)}
              </span>
            </div>

            {/* Title */}
            <p style={{ fontSize: "14px", fontWeight: 900, color: "#fff", lineHeight: 1.3, wordBreak: "break-word", margin: 0 }}>
              {cls.title}
            </p>

            {/* Date & time */}
            <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginTop: "6px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "4px", minWidth: 0 }}>
                <Calendar size={11} color="rgba(255,255,255,0.3)" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {formatDate(cls.start_time)}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "4px", minWidth: 0 }}>
                <Clock size={11} color="rgba(255,255,255,0.3)" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {formatTime(cls.start_time)} – {formatTime(cls.end_time)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Groups */}
        {cls.groups?.length > 0 && (
          <div
            style={{
              marginTop: "12px", borderRadius: "12px", padding: "12px",
              width: "100%", boxSizing: "border-box", overflow: "hidden",
              background: "rgba(232,74,12,0.05)", border: "1px solid rgba(232,74,12,0.12)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
              <Users size={11} color="rgba(232,74,12,0.7)" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: "9px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(232,74,12,0.7)" }}>
                Attending Groups
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {cls.groups.map(g => (
                <div key={g.id} style={{ display: "flex", alignItems: "flex-start", gap: "8px", minWidth: 0 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#E84A0C", flexShrink: 0, marginTop: "5px" }} />
                  <div style={{ minWidth: 0, flex: 1, overflow: "hidden" }}>
                    <p style={{ fontSize: "12px", fontWeight: 900, color: "#fff", wordBreak: "break-word", lineHeight: 1.3, margin: 0 }}>
                      {g.name}
                    </p>
                    {g.description && (
                      <p style={{ fontSize: "10px", marginTop: "2px", wordBreak: "break-word", color: "rgba(255,255,255,0.35)", margin: "2px 0 0" }}>
                        {g.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes / references */}
        {(cls.notes || cls.references) && (
          <div
            style={{
              marginTop: "12px", borderRadius: "12px", padding: "10px",
              boxSizing: "border-box", overflow: "hidden",
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {cls.notes && (
              <p style={{ fontSize: "12px", lineHeight: 1.6, wordBreak: "break-word", color: "rgba(255,255,255,0.5)", margin: 0 }}>
                📝 {cls.notes}
              </p>
            )}
            {cls.references && (
              <p style={{ fontSize: "12px", lineHeight: 1.6, marginTop: "4px", wordBreak: "break-word", color: "rgba(255,255,255,0.5)", margin: "4px 0 0" }}>
                📎 {cls.references}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Join / locked footer */}
      {isJoinable && cls.url && (
        canJoin ? (
          <a
            href={cls.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              padding: "12px", fontWeight: 900, fontSize: "12px", textDecoration: "none",
              width: "100%", boxSizing: "border-box",
              background: status === "live" ? "rgba(74,222,128,0.12)" : "rgba(27,127,196,0.1)",
              borderTop: `1px solid ${status === "live" ? "rgba(74,222,128,0.2)" : "rgba(27,127,196,0.15)"}`,
              color: status === "live" ? "#4ade80" : "#60a5fa",
            }}
          >
            <ExternalLink size={13} style={{ flexShrink: 0 }} />
            <span>{status === "live" ? "Join Now" : "Open Link"}</span>
            <ChevronRight size={12} style={{ flexShrink: 0 }} />
          </a>
        ) : (
          <div
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              padding: "12px", fontSize: "12px", fontWeight: 900,
              width: "100%", boxSizing: "border-box",
              background: "rgba(255,255,255,0.03)",
              borderTop: "1px solid rgba(255,255,255,0.07)",
              color: "rgba(255,255,255,0.3)",
            }}
          >
            <Lock size={12} style={{ flexShrink: 0 }} />
            <span>Subscribe to join this class</span>
          </div>
        )
      )}
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div
      className="animate-pulse"
      style={{ borderRadius: "16px", padding: "16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
        <div style={{ width: 40, height: 40, borderRadius: "12px", flexShrink: 0, background: "rgba(255,255,255,0.07)" }} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ height: "10px", borderRadius: "999px", width: "25%", background: "rgba(255,255,255,0.07)" }} />
          <div style={{ height: "14px", borderRadius: "999px", width: "75%", background: "rgba(255,255,255,0.07)" }} />
          <div style={{ height: "8px",  borderRadius: "999px", width: "50%", background: "rgba(255,255,255,0.07)" }} />
        </div>
      </div>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ filter }) {
  return (
    <div style={{ padding: "64px 0", textAlign: "center" }}>
      <p style={{ fontSize: "36px", margin: "0 0 8px" }}>📅</p>
      <p style={{ fontWeight: 700, color: "#fff", fontSize: "14px", margin: "0 0 4px" }}>No classes found</p>
      <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", margin: 0 }}>
        {filter
          ? `No classes scheduled for "${DATE_FILTERS.find(f => f.value === filter)?.label}".`
          : "No virtual classes have been scheduled yet."}
      </p>
    </div>
  );
}

// ─── ClassesTab ───────────────────────────────────────────────────────────────

export default function ClassesTab({ student, subscription }) {
  const hasPlan = hasActivePlan(subscription);

  const [classes, setClasses]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [dateFilter, setDateFilter] = useState("");

  const fetchClasses = useCallback(async (filter) => {
    setLoading(true);
    setError(null);
    try {
      const qs  = filter ? `?date_range=${filter}` : "";
      const res = await getData(`virtual-classes/${qs}`);
      setClasses(res?.results ?? []);
    } catch (err) {
      console.error("Failed to fetch classes:", err);
      setError("Could not load your classes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (student?.id) fetchClasses(dateFilter);
  }, [student?.id, dateFilter, fetchClasses]);

  const sorted = [...classes].sort((a, b) => {
    const order = { live: 0, upcoming: 1, ended: 2 };
    const sa = getStatus(a.start_time, a.end_time);
    const sb = getStatus(b.start_time, b.end_time);
    if (order[sa] !== order[sb]) return order[sa] - order[sb];
    return new Date(a.start_time) - new Date(b.start_time);
  });

  const liveCount = sorted.filter(c => getStatus(c.start_time, c.end_time) === "live").length;

  return (
    <div style={{ width: "100%", maxWidth: "100%", boxSizing: "border-box", overflowX: "hidden", display: "flex", flexDirection: "column", gap: "16px" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
        <Video size={16} color="rgba(255,255,255,0.4)" />
        <p style={{ fontSize: "12px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)", margin: 0 }}>
          Virtual Classes
        </p>
        {liveCount > 0 && (
          <span
            style={{
              fontSize: "9px", fontWeight: 900, padding: "2px 8px", borderRadius: "999px",
              display: "inline-flex", alignItems: "center", gap: "4px", flexShrink: 0,
              background: "rgba(74,222,128,0.12)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.25)",
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", animation: "pulse 2s infinite" }} />
            {liveCount} Live
          </span>
        )}
        {!hasPlan && (
          <span
            style={{
              fontSize: "9px", fontWeight: 900, padding: "2px 8px", borderRadius: "999px",
              display: "inline-flex", alignItems: "center", gap: "4px", flexShrink: 0, marginLeft: "auto",
              background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.35)", border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <Lock size={9} /> View only
          </span>
        )}
      </div>

      {/* Date filter — native select */}
      <DateFilterSelect value={dateFilter} onChange={setDateFilter} />

      {loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
        </div>
      )}

      {error && !loading && (
        <div style={{ borderRadius: "12px", padding: "16px", textAlign: "center", background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)" }}>
          <p style={{ fontSize: "14px", color: "#f87171", margin: 0 }}>{error}</p>
        </div>
      )}

      {!loading && !error && sorted.length === 0 && <EmptyState filter={dateFilter} />}

      {!loading && !error && sorted.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {sorted.map(cls => (
            <ClassCard key={cls.id} cls={cls} hasPlan={hasPlan} />
          ))}
        </div>
      )}

    </div>
  );
}