import { useState } from "react";

// ─── AssignmentItem ───────────────────────────────────────────────────────

function AssignmentItem({ assignment }) {
  return (
    <div className="rounded-xl px-3 py-2.5 flex items-start gap-3 bg-white/3 border border-white/[0.07]">
      <span className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-xs bg-blue-500/15 text-blue-400 font-black">
        ✎
      </span>
      <div className="min-w-0 flex-1 space-y-0.5">
        <p className="text-xs font-black text-white truncate">{assignment.title}</p>
        {assignment.description && (
          <p className="text-xs text-white/45 leading-relaxed wrap-break-word">
            {assignment.description}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── DayAccordion ─────────────────────────────────────────────────────────

function DayAccordion({ day, isCurrentDay }) {
  const [expanded, setExpanded] = useState(isCurrentDay);
  const assignmentCount = day.assignments?.length ?? 0;

  return (
    <div
      className={`rounded-2xl border transition-all overflow-hidden ${
        isCurrentDay
          ? "border-blue-500/40 bg-blue-950/20"
          : "border-white/10 bg-white/3"
      }`}
    >
      {/* Accordion header */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-2 px-3 py-3 text-left hover:bg-white/5 transition-all"
      >
        {/* Day number circle */}
        <span
          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 text-white ${
            isCurrentDay
              ? "bg-linear-to-br from-blue-600 to-blue-400"
              : "bg-white/10"
          }`}
        >
          {day.day_number}
        </span>

        {/* Title — takes remaining space, truncates instead of overflowing */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-black text-white leading-tight truncate">
            {day.title}
          </p>
          {day.description && (
            <p className="text-xs text-white/40 mt-0.5 truncate">
              {day.description}
            </p>
          )}
        </div>

        {/* Right-side badges — shrink-0 so they never disappear, compact text */}
        <div className="flex items-center gap-1 shrink-0">
          {isCurrentDay && (
            <span className="text-xs px-1.5 py-0.5 rounded-full font-bold bg-blue-500/20 text-blue-400 whitespace-nowrap">
              Today
            </span>
          )}
          <span className="text-xs px-1.5 py-0.5 rounded-full font-semibold bg-white/5 text-white/30 whitespace-nowrap">
            {assignmentCount} {assignmentCount !== 1 ? "tasks" : "task"}
          </span>
          <span className="text-white/30 text-xs ml-0.5">
            {expanded ? "▲" : "▼"}
          </span>
        </div>
      </button>

      {/* Accordion body */}
      {expanded && (
        <div className="px-3 pb-4 pt-3 border-t border-white/5 space-y-3">
          {day.content && (
            <div className="rounded-xl px-3 py-2.5 bg-white/3 border border-white/[0.07]">
              <p className="text-xs font-bold uppercase tracking-widest text-white/30 mb-1.5">
                Reading Material
              </p>
              <p className="text-xs text-white/55 leading-relaxed whitespace-pre-wrap wrap-break-word">
                {day.content}
              </p>
            </div>
          )}

          {assignmentCount > 0 ? (
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest text-white/30">
                Assignments
              </p>
              {day.assignments.map((a) => (
                <AssignmentItem key={a.id} assignment={a} />
              ))}
            </div>
          ) : (
            <p className="text-xs text-white/25 italic">
              No assignments for this day yet.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── EnrollmentStatusBar ──────────────────────────────────────────────────

function EnrollmentStatusBar({ enrollment, totalDays }) {
  if (!enrollment) return null;

  const { status, current_day, start_date } = enrollment;

  if (status !== "approved") {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400">
        <span className="w-2 h-2 rounded-full shrink-0 bg-amber-400 animate-pulse" />
        <span className="min-w-0 truncate">
          Your enrollment is{" "}
          <span className="font-bold">{status}</span> — check back soon.
        </span>
      </div>
    );
  }

  const progress =
    totalDays > 0 ? Math.round((current_day / totalDays) * 100) : 0;

  return (
    <div className="rounded-xl p-3 bg-white/3 border border-white/[0.07] space-y-2">
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="flex items-center gap-1.5 text-white/50 shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
          Day{" "}
          <span className="font-black text-white">{current_day}</span>{" "}
          of {totalDays}
        </span>
        <div className="flex items-center gap-2 min-w-0">
          {start_date && (
            <span className="text-white/25 truncate">
              Since {new Date(start_date).toLocaleDateString()}
            </span>
          )}
          <span className="font-bold text-white/50 shrink-0">{progress}%</span>
        </div>
      </div>

      <div className="h-1.5 rounded-full overflow-hidden bg-white/[0.07]">
        <div
          className="h-full rounded-full bg-linear-to-r from-emerald-600 to-emerald-400 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

// ─── StudentChallengeDetail (main export) ─────────────────────────────────

export default function StudentChallengeDetail({
  challenge,
  enrollment,
  onBack,
  onError,
}) {
  const days       = challenge.days ?? [];
  const totalDays  = challenge.duration_days ?? days.length;
  const currentDay = enrollment?.current_day ?? null;

  return (
    /*
     * KEY FIX: `overflow-x-hidden` creates a new block formatting context.
     * Combined with `w-full min-w-0`, no child element can expand this
     * container beyond the parent's width — regardless of what the parent
     * layout does. This is what stops the right-side clipping in the panel.
     */
    <div className="w-full min-w-0 overflow-x-hidden space-y-5">
      {/* Header */}
      <div className="flex items-start gap-2">
        <button
          onClick={onBack}
          aria-label="Back to challenges"
          className="mt-0.5 w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black transition-all shrink-0 bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
        >
          ←
        </button>

        <div className="flex-1 min-w-0">
          <h3 className="text-base font-black text-white leading-tight wrap-break-word">
            {challenge.title}
          </h3>
          <p className="text-xs mt-0.5 text-white/40 line-clamp-2 wrap-break-word">
            {challenge.description}
            {challenge.description ? " · " : ""}
            {totalDays} day{totalDays !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Enrollment progress */}
      <EnrollmentStatusBar enrollment={enrollment} totalDays={totalDays} />

      {/* Days */}
      {days.length === 0 ? (
        <div className="rounded-2xl p-6 text-center bg-white/3 border border-dashed border-white/10">
          <p className="text-2xl mb-2">📅</p>
          <p className="text-sm font-bold text-white">Days not set up yet</p>
          <p className="text-xs mt-1 text-white/35">
            Your teacher is still preparing this challenge. Check back soon.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {days.map((day) => (
            <DayAccordion
              key={day.id}
              day={day}
              isCurrentDay={currentDay === day.day_number}
            />
          ))}
        </div>
      )}
    </div>
  );
}