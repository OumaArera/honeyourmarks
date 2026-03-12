import React from "react";
import { Lock, FileText, BookOpen, ChevronRight } from "lucide-react";

// ─── Skeleton card ────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div
      className="rounded-2xl p-4 space-y-3 animate-pulse"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <div className="h-3 rounded-full w-1/3" style={{ background: "rgba(255,255,255,0.07)" }} />
      <div className="h-4 rounded-full w-3/4" style={{ background: "rgba(255,255,255,0.07)" }} />
      <div className="h-3 rounded-full w-full"  style={{ background: "rgba(255,255,255,0.05)" }} />
      <div className="h-3 rounded-full w-2/3"  style={{ background: "rgba(255,255,255,0.05)" }} />
      <div className="flex gap-2 pt-1">
        <div className="h-6 w-16 rounded-lg" style={{ background: "rgba(255,255,255,0.06)" }} />
        <div className="h-6 w-16 rounded-lg" style={{ background: "rgba(255,255,255,0.06)" }} />
      </div>
    </div>
  );
}

// ─── Note card ────────────────────────────────────────────────────────────────

function NoteCard({ note, hasPlan, onSelect }) {
  const subject      = note.subject?.name ?? note.subject_name ?? "—";
  const authorFirst  = note.author?.first_name ?? note.teacher?.first_name ?? "";
  const authorLast   = note.author?.last_name  ?? note.teacher?.last_name  ?? "";
  const authorName   = [authorFirst, authorLast].filter(Boolean).join(" ") || "Unknown";
  const exerciseCount = note.exercises?.length ?? note.exercise_count ?? 0;
  const hasFile      = Boolean(note.file ?? note.pdf ?? note.document);

  return (
    <button
      onClick={() => onSelect(note)}
      className="w-full text-left rounded-2xl p-4 flex flex-col gap-3 transition-all duration-200 active:scale-[0.98] hover:border-white/20 group"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* Top row: subject chip + lock */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <span
            className="text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide shrink-0"
            style={{
              background: "rgba(232,74,12,0.15)",
              color: "#E84A0C",
              border: "1px solid rgba(232,74,12,0.2)",
            }}
          >
            {subject}
          </span>
        </div>
        {!hasPlan && (
          <Lock size={13} color="rgba(255,255,255,0.25)" className="shrink-0 mt-0.5" />
        )}
      </div>

      {/* Title */}
      <div>
        <h3 className="font-black text-white text-sm leading-snug line-clamp-2 group-hover:text-orange-400 transition-colors">
          {note.title ?? note.name ?? "Untitled"}
        </h3>
        {note.description && (
          <p
            className="text-xs mt-1 line-clamp-2 leading-relaxed"
            style={{ color: "rgba(255,255,255,0.38)" }}
          >
            {note.description}
          </p>
        )}
      </div>

      {/* Meta row */}
      <div className="flex items-center justify-between gap-2 mt-auto">
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          {/* Author */}
          <span
            className="flex items-center gap-1 text-[10px] font-semibold truncate"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            <span
              className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black shrink-0"
              style={{ background: "rgba(27,127,196,0.2)", color: "#1B7FC4" }}
            >
              {authorFirst?.[0] ?? "?"}
            </span>
            {authorName}
          </span>

          {/* Exercise count */}
          {exerciseCount > 0 && (
            <span
              className="flex items-center gap-1 text-[10px] font-semibold shrink-0"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              <BookOpen size={10} />
              {exerciseCount} ex.
            </span>
          )}

          {/* PDF badge */}
          {hasFile && (
            <span
              className="flex items-center gap-1 text-[10px] font-semibold shrink-0"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              <FileText size={10} />
              PDF
            </span>
          )}
        </div>

        <ChevronRight size={14} color="rgba(255,255,255,0.2)" className="shrink-0 group-hover:text-white/50 transition-colors" />
      </div>

      {/* Preview-only strip */}
      {!hasPlan && (
        <div
          className="rounded-xl px-3 py-1.5 text-center text-[11px] font-bold"
          style={{
            background: "rgba(232,74,12,0.07)",
            color: "rgba(232,74,12,0.7)",
            border: "1px solid rgba(232,74,12,0.15)",
          }}
        >
          Preview only — subscribe to access
        </div>
      )}
    </button>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="py-16 text-center space-y-2">
      <p className="text-4xl">🔍</p>
      <p className="font-bold text-white text-sm">No notes found</p>
      <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
        Try adjusting your search or filters
      </p>
    </div>
  );
}

// ─── NotesList ────────────────────────────────────────────────────────────────

export default function NotesList({
  notes,
  loading,
  hasPlan,
  fullAccess,
  nextUrl,
  loadingMore,
  onLoadMore,
  onSelectNote,
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (!notes.length) return <EmptyState />;

  return (
    <div className="space-y-3">
      {/* Results count */}
      <p className="text-[11px] font-semibold" style={{ color: "rgba(255,255,255,0.3)" }}>
        {notes.length} note{notes.length !== 1 ? "s" : ""} found
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {notes.map(note => (
          <NoteCard
            key={note.id}
            note={note}
            hasPlan={hasPlan}
            onSelect={onSelectNote}
          />
        ))}
      </div>

      {/* Load more */}
      {nextUrl && (
        <div className="flex justify-center pt-2">
          <button
            onClick={onLoadMore}
            disabled={loadingMore}
            className="px-6 py-2.5 rounded-xl text-sm font-black transition-opacity hover:opacity-80 disabled:opacity-50"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            {loadingMore ? "Loading…" : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
}