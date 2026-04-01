import { useState } from "react";
import Toast from "../common/Toast";
import StudentChallengeList from "./StudentChallengeList";
import StudentChallengeDetail from "./StudentChallengeDetail";

export default function StudentChallengesTab() {
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [toast, setToast] = useState(null);

  const notify = (type, title, message) => setToast({ type, title, message });

  const handleSelect = (challenge, enrollmentRecord) => {
    setSelectedChallenge(challenge);
    setEnrollment(enrollmentRecord ?? null);
  };

  const handleBack = () => {
    setSelectedChallenge(null);
    setEnrollment(null);
  };

  return (
    <>
      <Toast toast={toast} onDismiss={() => setToast(null)} />

      {/*
       * overflow-x-hidden here is a belt-and-suspenders guard at the tab
       * level. If the parent panel ever produces a scrollbar or clips content,
       * this wrapper ensures nothing inside this tab causes horizontal scroll.
       * w-full + min-w-0 ensure the tab takes exactly its allocated column width.
       */}
      <div className="w-full min-w-0 overflow-x-hidden space-y-6 pb-10">
        {/* Header — hidden in detail view to save vertical space on mobile */}
        {!selectedChallenge && (
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              🏆 Challenges
            </h2>
            <p className="text-sm mt-1 text-white/35">
              Browse and join multi-day learning challenges
            </p>
          </div>
        )}

        {!selectedChallenge ? (
          <StudentChallengeList
            onSelect={handleSelect}
            onEnrolled={(msg) => notify("success", "Enrolled!", msg)}
            onError={(msg) => notify("error", "Error", msg)}
          />
        ) : (
          <StudentChallengeDetail
            challenge={selectedChallenge}
            enrollment={enrollment}
            onBack={handleBack}
            onError={(msg) => notify("error", "Error", msg)}
          />
        )}
      </div>
    </>
  );
}