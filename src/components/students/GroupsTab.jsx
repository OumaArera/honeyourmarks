import React, { useState, useEffect } from "react";
import { Users, ChevronDown, ChevronUp, GraduationCap } from "lucide-react";
import { getData } from "../../api/api.service";

// ─── Avatar initials ──────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  ["#E84A0C", "rgba(232,74,12,0.15)"],
  ["#1B7FC4", "rgba(27,127,196,0.15)"],
  ["#4ade80", "rgba(74,222,128,0.12)"],
  ["#facc15", "rgba(250,204,21,0.12)"],
  ["#f87171", "rgba(248,113,113,0.12)"],
  ["#60a5fa", "rgba(96,165,250,0.12)"],
];

function Avatar({ name, index, size = 32 }) {
  const [color, bg] = AVATAR_COLORS[index % AVATAR_COLORS.length];
  const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div
      className="rounded-full flex items-center justify-center shrink-0 font-black"
      style={{ width: size, height: size, background: bg, color, border: `1.5px solid ${color}30`, fontSize: size * 0.35 }}
    >
      {initials}
    </div>
  );
}

// ─── Single member row ────────────────────────────────────────────────────────

function MemberRow({ member, index, isMe }) {
  const fullName = `${member.first_name} ${member.last_name}`;
  return (
    <div
      className="flex items-center gap-3 py-2.5 px-3 rounded-xl"
      style={{
        background: isMe ? "rgba(232,74,12,0.06)" : "transparent",
        border: isMe ? "1px solid rgba(232,74,12,0.15)" : "1px solid transparent",
      }}
    >
      <Avatar name={fullName} index={index} size={34} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold text-white truncate">{fullName}</p>
          {isMe && (
            <span
              className="text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wide shrink-0"
              style={{ background: "rgba(232,74,12,0.15)", color: "#E84A0C" }}
            >
              You
            </span>
          )}
        </div>
        <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
          {member.current_school_level}
        </p>
      </div>
    </div>
  );
}

// ─── Group card ───────────────────────────────────────────────────────────────

function GroupCard({ group, studentId }) {
  const [expanded, setExpanded] = useState(false);
  const memberCount = group.students?.length ?? 0;

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center gap-3 p-4 text-left"
      >
        {/* Group icon */}
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
          style={{ background: "rgba(232,74,12,0.12)", border: "1px solid rgba(232,74,12,0.2)" }}
        >
          <Users size={18} color="#E84A0C" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-black text-white truncate">{group.name}</p>
          {group.description && (
            <p className="text-[10px] mt-0.5 truncate" style={{ color: "rgba(255,255,255,0.35)" }}>
              {group.description}
            </p>
          )}
          <div className="flex items-center gap-1.5 mt-1">
            <div className="flex -space-x-1.5">
              {group.students?.slice(0, 4).map((s, i) => (
                <Avatar
                  key={s.id}
                  name={`${s.first_name} ${s.last_name}`}
                  index={i}
                  size={18}
                />
              ))}
            </div>
            <span className="text-[10px] font-semibold" style={{ color: "rgba(255,255,255,0.35)" }}>
              {memberCount} member{memberCount !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <div className="shrink-0">
          {expanded
            ? <ChevronUp size={15} color="rgba(255,255,255,0.3)" />
            : <ChevronDown size={15} color="rgba(255,255,255,0.3)" />
          }
        </div>
      </button>

      {/* Expanded member list */}
      {expanded && (
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <p
            className="px-4 pt-3 pb-1 text-[10px] font-black uppercase tracking-widest"
            style={{ color: "rgba(255,255,255,0.25)" }}
          >
            Members
          </p>
          <div className="px-3 pb-3 space-y-1">
            {group.students?.map((member, i) => (
              <MemberRow
                key={member.id}
                member={member}
                index={i}
                isMe={member.id === studentId}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="rounded-2xl p-4 animate-pulse"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl shrink-0" style={{ background: "rgba(255,255,255,0.07)" }} />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 rounded-full w-2/3" style={{ background: "rgba(255,255,255,0.07)" }} />
          <div className="h-2.5 rounded-full w-1/3" style={{ background: "rgba(255,255,255,0.07)" }} />
        </div>
      </div>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="py-16 text-center space-y-2">
      <p className="text-4xl">👥</p>
      <p className="font-bold text-white text-sm">No groups yet</p>
      <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
        You haven't been added to any study groups yet.
      </p>
    </div>
  );
}

// ─── GroupsTab ────────────────────────────────────────────────────────────────

export default function GroupsTab({ student }) {
  const [groups, setGroups]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!student?.id) return;
    const load = async () => {
      setLoading(true);
      try {
        const res = await getData(`groups/?students=${student.id}`);
        setGroups(res?.results ?? []);
      } catch (err) {
        console.error("Failed to fetch groups:", err);
        setError("Could not load your groups.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [student?.id]);

  return (
    <div className="space-y-4 w-full">

      {/* Header */}
      <div className="flex items-center gap-2">
        <GraduationCap size={16} color="rgba(255,255,255,0.4)" />
        <p className="text-xs font-black uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>
          My Study Groups
        </p>
      </div>

      {/* Content */}
      {loading && (
        <div className="space-y-3">
          {[1, 2].map(i => <SkeletonCard key={i} />)}
        </div>
      )}

      {error && !loading && (
        <div className="rounded-xl p-4 text-center"
          style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)" }}>
          <p className="text-sm" style={{ color: "#f87171" }}>{error}</p>
        </div>
      )}

      {!loading && !error && groups.length === 0 && <EmptyState />}

      {!loading && !error && groups.length > 0 && (
        <>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
            You're in <span className="font-black text-white">{groups.length}</span> group{groups.length !== 1 ? "s" : ""}
          </p>
          <div className="space-y-3">
            {groups.map(group => (
              <GroupCard key={group.id} group={group} studentId={student.id} />
            ))}
          </div>
        </>
      )}

    </div>
  );
}