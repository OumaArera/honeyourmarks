import { useEffect, useMemo, useState } from "react";
import { getData } from "../../api/api.service";
import { getAuthorId } from "../../utils/notes.utils";
import Toast from "../common/Toast";
import ExamCreateView from "../exams/ExamCreateView";
import ExamBrowseView from "../exams/ExamBrowseView";
import ExamStatsView from "../exams/ExamStatsView";
import ExamSubmissionsView from "../exams/ExamSubmission";

// ─────────────────────────────────────────────────────────────────────────────
// ── Constants
// ─────────────────────────────────────────────────────────────────────────────

const VIEWS = { CREATE: "create", BROWSE: "browse", STATS: "stats", SUBMISSION: "submissions" };

// ─────────────────────────────────────────────────────────────────────────────
// ── ViewTab
// ─────────────────────────────────────────────────────────────────────────────

function ViewTab({ label, icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black transition-all duration-150"
      style={
        active
          ? {
              background: "linear-gradient(135deg,#1D4ED8,#3B82F6)",
              color: "#fff",
              boxShadow: "0 4px 16px rgba(29,78,216,0.35)",
            }
          : {
              background: "rgba(255,255,255,0.04)",
              color: "rgba(255,255,255,0.4)",
              border: "1px solid rgba(255,255,255,0.07)",
            }
      }
    >
      <span>{icon}</span> {label}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── ExamsTab
// ─────────────────────────────────────────────────────────────────────────────

export default function ExamsTab() {
  const [view, setView] = useState(VIEWS.CREATE);
  const [subjectTags, setSubjectTags] = useState([]);
  const [loadingTags, setLoadingTags] = useState(true);
  const [toast, setToast] = useState(null);

  const userId = useMemo(() => getAuthorId(), []);
  const [teacherId, setTeacherId] = useState(null);

  // Resolve teacher profile
  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        const res = await getData(`teachers/?user_id=${userId}`);
        if (res?.error) throw new Error(res.error);
        const teacher = res?.results?.[0];
        if (!teacher) throw new Error("Teacher profile not found for this account.");
        setTeacherId(teacher.id);
      } catch (err) {
        setToast({ type: "error", title: "Profile error", message: err.message });
      }
    })();
  }, [userId]);

  // Load subject tags
  useEffect(() => {
    (async () => {
      try {
        const res = await getData("subject-tags/");
        if (res?.error) throw new Error(res.error);
        setSubjectTags(res?.results ?? []);
      } catch (err) {
        setToast({ type: "error", title: "Couldn't load subject tags", message: err.message });
      } finally {
        setLoadingTags(false);
      }
    })();
  }, []);

  const notify = (type, title, message) => setToast({ type, title, message });

  return (
    <>
      <Toast toast={toast} onDismiss={() => setToast(null)} />

      <div className="space-y-6 pb-10">
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">📝 Exams Centre</h2>
              <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>
                Create, browse, and track examination questions
              </p>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <ViewTab icon="✍️" label="Create Exam"        active={view === VIEWS.CREATE}     onClick={() => setView(VIEWS.CREATE)} />
            <ViewTab icon="🔍" label="Browse Exams"       active={view === VIEWS.BROWSE}     onClick={() => setView(VIEWS.BROWSE)} />
            <ViewTab icon="📊" label="Exam Stats"         active={view === VIEWS.STATS}      onClick={() => setView(VIEWS.STATS)} />
            <ViewTab icon="📋" label="Exam Submissions"   active={view === VIEWS.SUBMISSION} onClick={() => setView(VIEWS.SUBMISSION)} />
          </div>
        </div>

        {view === VIEWS.CREATE && (
          <ExamCreateView
            subjectTags={subjectTags}
            loadingTags={loadingTags}
            teacherId={teacherId}
            onSuccess={(msg) => notify("success", "Exam published!", msg)}
            onError={(msg) => notify("error", "Failed to save exam", msg)}
          />
        )}

        {view === VIEWS.BROWSE && (
          <ExamBrowseView subjectTags={subjectTags} />
        )}

        {view === VIEWS.STATS && <ExamStatsView />}

        {view === VIEWS.SUBMISSION && <ExamSubmissionsView />}
      </div>
    </>
  );
}