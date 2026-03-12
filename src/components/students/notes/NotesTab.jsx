import React, { useState, useEffect, useCallback, useRef } from "react";
import ReactDOM from "react-dom";
import { ClipboardList } from "lucide-react";
import { getData } from "../../../api/api.service";
import { hasActivePlan, isFullAccess } from "../../../utils/subscription.utils";
import NotesFilter from "./NotesFilter";
import NotesList from "./NotesList";
import NoteDetail from "./NoteDetail";
import MySubmissions from "./MySubmissions";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildQueryString(filters) {
  const params = new URLSearchParams();
  if (filters.search)  params.set("search", filters.search);
  if (filters.subject) params.set("subject", filters.subject);
  if (filters.author)  params.set("author", filters.author);
  return params.toString();
}

// ─── Modal portal ─────────────────────────────────────────────────────────────
// Renders children directly into document.body so that no ancestor's
// overflow / transform / will-change can trap fixed positioning.

function ModalPortal({ children }) {
  // Guard for SSR / environments where document isn't available yet
  if (typeof document === "undefined") return null;
  return ReactDOM.createPortal(children, document.body);
}

// ─── No-plan banner ───────────────────────────────────────────────────────────

function NoSubscriptionBanner({ onGoToPricing }) {
  return (
    <div
      className="rounded-2xl p-5 text-center"
      style={{
        background: "rgba(232,74,12,0.07)",
        border: "1px solid rgba(232,74,12,0.2)",
      }}
    >
      <p className="text-3xl mb-2">📚</p>
      <p className="font-black text-white text-base">Preview Mode</p>
      <p className="text-sm mt-1 mb-3" style={{ color: "rgba(255,255,255,0.45)" }}>
        You're viewing a preview. Subscribe to download notes, attempt exercises,
        and submit responses.
      </p>
      <button
        onClick={onGoToPricing}
        className="px-5 py-2 rounded-xl text-sm font-black transition-opacity hover:opacity-80"
        style={{ background: "#E84A0C", color: "#fff" }}
      >
        View Plans →
      </button>
    </div>
  );
}

// ─── NotesTab ─────────────────────────────────────────────────────────────────

export default function NotesTab({ student, subscription, onNav }) {
  const hasPlan    = hasActivePlan(subscription);
  const fullAccess = isFullAccess(subscription);

  const [filters, setFilters] = useState({ search: "", subject: "", author: "" });

  const [notes, setNotes]             = useState([]);
  const [subjects, setSubjects]       = useState([]);
  const [teachers, setTeachers]       = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [notesLoading, setNotesLoading]     = useState(true);
  const [filtersLoading, setFiltersLoading] = useState(true);

  const [nextUrl, setNextUrl]         = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const [selectedNote, setSelectedNote]       = useState(null);
  const [showSubmissions, setShowSubmissions] = useState(false);

  const debounceRef = useRef(null);

  // Lock body scroll whenever a modal is open so the page behind doesn't scroll.
  // Uses a CSS class (.modal-open in index.css) rather than direct style mutation
  // so it survives React strict-mode double-invocation without leaving stale styles.
  useEffect(() => {
    const isOpen = Boolean(selectedNote) || showSubmissions;
    document.body.classList.toggle("modal-open", isOpen);
    return () => { document.body.classList.remove("modal-open"); };
  }, [selectedNote, showSubmissions]);

  // Fetch filter options once
  useEffect(() => {
    const load = async () => {
      try {
        const [subRes, teachRes] = await Promise.all([
          getData("subjects/"),
          getData("teachers/"),
        ]);
        setSubjects(subRes?.results ?? []);
        setTeachers(teachRes?.results ?? []);
      } catch (err) {
        console.error("Failed to fetch filter data:", err);
      } finally {
        setFiltersLoading(false);
      }
    };
    load();
  }, []);

  // Fetch all submissions for the student once (only if they have a plan)
  useEffect(() => {
    if (!student?.id || !hasPlan) return;
    const load = async () => {
      try {
        const res = await getData(`exercise-submissions/?student=${student.id}`);
        setSubmissions(res?.results ?? []);
      } catch (err) {
        console.error("Failed to fetch submissions:", err);
      }
    };
    load();
  }, [student?.id, hasPlan]);

  // Fetch notes on filter change (debounced search)
  const fetchNotes = useCallback(async (activeFilters) => {
    setNotesLoading(true);
    try {
      const qs  = buildQueryString(activeFilters);
      const res = await getData(`topics/${qs ? `?${qs}` : ""}`);
      setNotes(res?.results ?? []);
      setNextUrl(res?.next ?? null);
    } catch (err) {
      console.error("Failed to fetch notes:", err);
      setNotes([]);
    } finally {
      setNotesLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchNotes(filters), 350);
    return () => clearTimeout(debounceRef.current);
  }, [filters, fetchNotes]);

  const loadMore = async () => {
    if (!nextUrl || loadingMore) return;
    setLoadingMore(true);
    try {
      const url = new URL(nextUrl);
      const res = await getData(`topics/${url.search}`);
      setNotes(prev => [...prev, ...(res?.results ?? [])]);
      setNextUrl(res?.next ?? null);
    } catch (err) {
      console.error("Load more failed:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleFilterChange = (key, value) =>
    setFilters(prev => ({ ...prev, [key]: value }));

  // Derive the set of already-submitted exercise IDs for fast lookup
  const submittedExerciseIds = new Set(
    submissions.map(s => {
      const ex = s.exercise;
      return typeof ex === "string" ? ex : ex?.id;
    }).filter(Boolean)
  );

  return (
    <div className="space-y-4 w-full">

      {!hasPlan && (
        <NoSubscriptionBanner onGoToPricing={() => onNav?.("pricing")} />
      )}

      {hasPlan && (
        <div className="flex justify-end">
          <button
            onClick={() => setShowSubmissions(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-opacity hover:opacity-80"
            style={{
              background: "rgba(27,127,196,0.15)",
              border: "1px solid rgba(27,127,196,0.3)",
              color: "#1B7FC4",
            }}
          >
            <ClipboardList size={14} />
            My Submissions
          </button>
        </div>
      )}

      <NotesFilter
        filters={filters}
        subjects={subjects}
        teachers={teachers}
        loading={filtersLoading}
        onChange={handleFilterChange}
      />

      <NotesList
        notes={notes}
        loading={notesLoading}
        hasPlan={hasPlan}
        fullAccess={fullAccess}
        nextUrl={nextUrl}
        loadingMore={loadingMore}
        onLoadMore={loadMore}
        onSelectNote={setSelectedNote}
        submittedExerciseIds={submittedExerciseIds}
      />

      {/* ── Modals portalled to document.body ───────────────────────────────
          This ensures fixed positioning is always relative to the true
          viewport — no ancestor overflow / transform can trap it.        */}

      {selectedNote && (
        <ModalPortal>
          <NoteDetail
            note={selectedNote}
            student={student}
            hasPlan={hasPlan}
            fullAccess={fullAccess}
            submissions={submissions}
            submittedExerciseIds={submittedExerciseIds}
            onClose={() => setSelectedNote(null)}
            onSubmissionAdded={(newSub) => {
            // API returns exercise as a plain ID string — normalize it to match
            // the shape of list submissions which have exercise as an object
            const normalized = {
              ...newSub,
              exercise: typeof newSub.exercise === "string"
                ? { id: newSub.exercise }
                : newSub.exercise,
            };
            setSubmissions(prev => [normalized, ...prev]);
          }}
          />
        </ModalPortal>
      )}

      {showSubmissions && (
        <ModalPortal>
          <MySubmissions
            student={student}
            submissions={submissions}
            onClose={() => setShowSubmissions(false)}
          />
        </ModalPortal>
      )}

    </div>
  );
}