import React, { useState, useEffect, useCallback, useRef } from "react";
import ReactDOM from "react-dom";
import { ClipboardList, BookOpen } from "lucide-react";
import { getData } from "../../../api/api.service";
import { hasActivePlan, isFullAccess } from "../../../utils/subscription.utils";
import ExamList from "./ExamList";
import ExamDetail from "./ExamDetail";
import MyExamSubmissions from "./MyExamSubmission";

// ─── Modal portal ─────────────────────────────────────────────────────────────

function ModalPortal({ children }) {
  if (typeof document === "undefined") return null;
  return ReactDOM.createPortal(children, document.body);
}

// ─── No-plan banner ───────────────────────────────────────────────────────────

function NoSubscriptionBanner({ onGoToPricing }) {
  return (
    <div className="rounded-2xl p-5 text-center"
      style={{ background: "rgba(232,74,12,0.07)", border: "1px solid rgba(232,74,12,0.2)" }}>
      <p className="text-3xl mb-2">🏆</p>
      <p className="font-black text-white text-base">Preview Mode</p>
      <p className="text-sm mt-1 mb-3" style={{ color: "rgba(255,255,255,0.45)" }}>
        Subscribe to attempt exams, submit responses, and receive grades from your teachers.
      </p>
      <button onClick={onGoToPricing}
        className="px-5 py-2 rounded-xl text-sm font-black transition-opacity hover:opacity-80"
        style={{ background: "#E84A0C", color: "#fff" }}>
        View Plans →
      </button>
    </div>
  );
}

// ─── ExamsTab ─────────────────────────────────────────────────────────────────

export default function ExamsTab({ student, subscription, onNav }) {
  const hasPlan    = hasActivePlan(subscription);
  const fullAccess = isFullAccess(subscription);

  const [exams, setExams]               = useState([]);
  const [submissions, setSubmissions]   = useState([]);
  const [examsLoading, setExamsLoading] = useState(true);

  const [nextUrl, setNextUrl]         = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const [selectedExam, setSelectedExam]       = useState(null);
  const [showSubmissions, setShowSubmissions] = useState(false);

  // Lock body scroll when modal open
  useEffect(() => {
    const isOpen = Boolean(selectedExam) || showSubmissions;
    document.body.classList.toggle("modal-open", isOpen);
    return () => { document.body.classList.remove("modal-open"); };
  }, [selectedExam, showSubmissions]);

  // Fetch exam questions
  const fetchExams = useCallback(async () => {
    setExamsLoading(true);
    try {
      const res = await getData("exam-questions/");
      setExams(res?.results ?? []);
      setNextUrl(res?.next ?? null);
    } catch (err) {
      console.error("Failed to fetch exams:", err);
      setExams([]);
    } finally {
      setExamsLoading(false);
    }
  }, []);

  useEffect(() => { fetchExams(); }, [fetchExams]);

  // Fetch student exam submissions
  useEffect(() => {
    if (!student?.id || !hasPlan) return;
    const load = async () => {
      try {
        const res = await getData(`exam-submissions/?student=${student.id}`);
        setSubmissions(res?.results ?? []);
      } catch (err) {
        console.error("Failed to fetch exam submissions:", err);
      }
    };
    load();
  }, [student?.id, hasPlan]);

  const loadMore = async () => {
    if (!nextUrl || loadingMore) return;
    setLoadingMore(true);
    try {
      const url = new URL(nextUrl);
      const res = await getData(`exam-questions/${url.search}`);
      setExams(prev => [...prev, ...(res?.results ?? [])]);
      setNextUrl(res?.next ?? null);
    } catch (err) {
      console.error("Load more failed:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  // Derive submitted exam IDs — handle both string and object shapes
  const submittedExamIds = new Set(
    submissions.map(s => {
      const ex = s.exam;
      return typeof ex === "string" ? ex : ex?.id;
    }).filter(Boolean)
  );

  // Find existing submission for a given exam
  const getSubmissionForExam = (examId) =>
    submissions.find(s => {
      const ex = s.exam;
      return (typeof ex === "string" ? ex : ex?.id) === examId;
    }) ?? null;

  return (
    <div className="space-y-4 w-full">

      {!hasPlan && (
        <NoSubscriptionBanner onGoToPricing={() => onNav?.("pricing")} />
      )}

      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen size={16} color="rgba(255,255,255,0.4)" />
          <p className="text-xs font-black uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>
            Exam Questions
          </p>
        </div>
        {hasPlan && (
          <button
            onClick={() => setShowSubmissions(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-opacity hover:opacity-80"
            style={{ background: "rgba(27,127,196,0.15)", border: "1px solid rgba(27,127,196,0.3)", color: "#1B7FC4" }}
          >
            <ClipboardList size={14} />
            My Results
          </button>
        )}
      </div>

      <ExamList
        exams={exams}
        loading={examsLoading}
        hasPlan={hasPlan}
        submittedExamIds={submittedExamIds}
        onSelectExam={setSelectedExam}
        nextUrl={nextUrl}
        loadingMore={loadingMore}
        onLoadMore={loadMore}
      />

      {/* Modals */}
      {selectedExam && (
        <ModalPortal>
          <ExamDetail
            exam={selectedExam}
            student={student}
            hasPlan={hasPlan}
            fullAccess={fullAccess}
            existingSubmission={getSubmissionForExam(selectedExam.id)}
            onClose={() => setSelectedExam(null)}
            onSubmissionAdded={(newSub) => {
              const normalized = {
                ...newSub,
                exam: typeof newSub.exam === "string" ? { id: newSub.exam } : newSub.exam,
              };
              setSubmissions(prev => [normalized, ...prev]);
            }}
          />
        </ModalPortal>
      )}

      {showSubmissions && (
        <ModalPortal>
          <MyExamSubmissions
            submissions={submissions}
            onClose={() => setShowSubmissions(false)}
          />
        </ModalPortal>
      )}
    </div>
  );
}