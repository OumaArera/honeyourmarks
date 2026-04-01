import { useEffect, useState } from "react";
import { createData, getData } from "../../api/api.service";

// ─── helpers ────────────────────────────────────────────────────────────────

/**
 * Build a Set of challenge IDs the student is already enrolled in,
 * keyed from the enrollments response.
 */
function buildEnrolledIds(enrollments) {
  return new Set(enrollments.map((e) => e.challenge?.id ?? e.challenge));
}

/**
 * Find the enrollment record for a given challengeId.
 */
function findEnrollment(enrollments, challengeId) {
  return enrollments.find(
    (e) => (e.challenge?.id ?? e.challenge) === challengeId
  ) ?? null;
}

// ─── EnrollButton ─────────────────────────────────────────────────────────

function EnrollButton({ challengeId, onEnrolled, onError }) {
  const [enrolling, setEnrolling] = useState(false);

  const handleEnroll = async (e) => {
    e.stopPropagation(); // don't trigger the card's onClick
    setEnrolling(true);
    try {
      const res = await createData("challenge-enrollments/", { challenge: challengeId });
      if (res?.error) throw new Error(res.error);
      onEnrolled?.(res);
    } catch (err) {
      onError?.(err.message);
    } finally {
      setEnrolling(false);
    }
  };

  return (
    <button
      onClick={handleEnroll}
      disabled={enrolling}
      className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all disabled:opacity-50 bg-linear-to-br from-blue-700 to-blue-500 text-white shadow-md shadow-blue-900/30"
    >
      {enrolling ? (
        <>
          <span className="w-2.5 h-2.5 border border-white/30 border-t-white rounded-full animate-spin" />
          Joining…
        </>
      ) : (
        "🚀 Enroll"
      )}
    </button>
  );
}

// ─── EnrollmentBadge ──────────────────────────────────────────────────────

function EnrollmentBadge({ enrollment }) {
  const statusStyles = {
    approved: "bg-emerald-500/15 text-emerald-400",
    pending:  "bg-amber-500/15 text-amber-400",
    rejected: "bg-red-500/15 text-red-400",
  };
  const label = {
    approved: "✓ Enrolled",
    pending:  "⏳ Pending",
    rejected: "✗ Rejected",
  };
  const cls = statusStyles[enrollment.status] ?? "bg-white/10 text-white/50";
  return (
    <span className={`shrink-0 text-xs font-black px-2.5 py-1 rounded-xl ${cls}`}>
      {label[enrollment.status] ?? enrollment.status}
    </span>
  );
}

// ─── ChallengeCard ────────────────────────────────────────────────────────

function ChallengeCard({ challenge, enrollment, onSelect, onEnrolled, onError }) {
  const isEnrolled = !!enrollment;
  const total      = challenge.duration_days ?? challenge.days?.length ?? 0;
  const daysSetUp  = challenge.days?.length ?? 0;
  const pct        = total > 0 ? Math.round((daysSetUp / total) * 100) : 0;

  const totalAssignments = challenge.days?.reduce((acc, d) => acc + (d.assignments?.length ?? 0), 0) ?? 0;

  return (
    <button
      onClick={() => onSelect(challenge, enrollment)}
      className="w-full text-left rounded-2xl p-4 transition-all group bg-white/3 border border-white/10 hover:border-blue-500/40 hover:bg-blue-950/20"
    >
      {/* Title + description — full width, never truncated by action buttons */}
      <p className="text-sm font-black text-white group-hover:text-blue-400 transition-colors truncate">
        {challenge.title}
      </p>
      <p className="text-xs mt-0.5 line-clamp-2 text-white/40">{challenge.description}</p>

      {/* Action row: meta left, badge/button right — wraps on very small screens */}
      <div
        className="mt-3 flex flex-wrap items-center justify-between gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-xs text-white/30">
          {daysSetUp}/{total} days · {totalAssignments} assignment{totalAssignments !== 1 ? "s" : ""}
        </span>

        <div className="flex items-center gap-2">
          <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-blue-500/15 text-blue-400">
            {total}d
          </span>
          {isEnrolled ? (
            <EnrollmentBadge enrollment={enrollment} />
          ) : (
            <EnrollButton
              challengeId={challenge.id}
              onEnrolled={(newEnrollment) => onEnrolled(challenge.id, newEnrollment)}
              onError={onError}
            />
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-2 space-y-1.5">
        <div className="h-1.5 rounded-full overflow-hidden bg-white/[0.07]">
          <div
            className="h-full rounded-full bg-linear-to-r from-blue-700 to-blue-400 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Current day badge for enrolled students */}
      {isEnrolled && enrollment.status === "approved" && enrollment.current_day != null && (
        <div className="mt-3 flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            📅 Day {enrollment.current_day} of {total}
          </span>
          {enrollment.start_date && (
            <span className="text-xs text-white/25">
              Started {new Date(enrollment.start_date).toLocaleDateString()}
            </span>
          )}
        </div>
      )}
    </button>
  );
}

// ─── Skeleton loader ──────────────────────────────────────────────────────

function SkeletonCards() {
  return (
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-28 rounded-2xl animate-pulse bg-white/5" />
      ))}
    </div>
  );
}

// ─── StudentChallengeList (main export) ──────────────────────────────────

export default function StudentChallengeList({ onSelect, onEnrolled, onError }) {
  const [challenges, setChallenges]     = useState([]);
  const [enrollments, setEnrollments]   = useState([]);
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [challengeRes, enrollmentRes] = await Promise.all([
          getData("challenges/"),
          getData("challenge-enrollments/"),
        ]);
        if (challengeRes?.error)  throw new Error(challengeRes.error);
        if (enrollmentRes?.error) throw new Error(enrollmentRes.error);
        setChallenges(challengeRes?.results ?? []);
        setEnrollments(enrollmentRes?.results ?? []);
      } catch (err) {
        onError?.(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Optimistically update enrollment state without re-fetching
  const handleEnrolled = (challengeId, newEnrollment) => {
    setEnrollments((prev) => [...prev, newEnrollment]);
    onEnrolled?.("You've successfully joined the challenge!");
  };

  if (loading) return <SkeletonCards />;

  if (challenges.length === 0) {
    return (
      <div className="rounded-2xl p-8 text-center bg-white/3 border border-dashed border-white/10">
        <p className="text-3xl mb-2">🏆</p>
        <p className="text-sm font-bold text-white">No challenges available yet</p>
        <p className="text-xs mt-1 text-white/35">Check back soon — your teacher will publish challenges here.</p>
      </div>
    );
  }

  const enrolledIds = buildEnrolledIds(enrollments);

  return (
    <div className="space-y-3">
      {/* Enrolled section first if any */}
      {enrollments.length > 0 && (
        <p className="text-xs font-bold uppercase tracking-widest text-white/30 px-1">
          {enrollments.length} enrolled · {challenges.length - enrollments.length} available
        </p>
      )}

      {challenges.map((c) => {
        const enrollment = enrolledIds.has(c.id) ? findEnrollment(enrollments, c.id) : null;
        return (
          <ChallengeCard
            key={c.id}
            challenge={c}
            enrollment={enrollment}
            onSelect={onSelect}
            onEnrolled={handleEnrolled}
            onError={onError}
          />
        );
      })}
    </div>
  );
}