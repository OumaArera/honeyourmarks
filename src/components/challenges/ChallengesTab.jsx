import { useState } from "react";
import Toast from "../common/Toast";
import ChallengeCreateForm from "./ChallengeCreateForm";
import ChallengeList from "./ChallengeList";
import ChallengeDetail from "./ChallengeDetail";

const VIEWS = { CREATE: "create", BROWSE: "browse" };

function ViewTab({ label, icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black transition-all duration-150 ${
        active
          ? "bg-linear-to-br from-blue-700 to-blue-500 text-white shadow-lg shadow-blue-900/40"
          : "bg-white/5 text-white/40 border border-white/10 hover:bg-white/10 hover:text-white/60"
      }`}
    >
      <span>{icon}</span> {label}
    </button>
  );
}

export default function ChallengesTab() {
  const [view, setView] = useState(VIEWS.CREATE);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [toast, setToast] = useState(null);

  const notify = (type, title, message) => setToast({ type, title, message });

  const handleSelect = (challenge) => setSelectedChallenge(challenge);

  // Fixed: also resets view so "Create Challenge" tab works after back
  const handleBack = (targetView = VIEWS.BROWSE) => {
    setSelectedChallenge(null);
    setView(targetView);
  };

  // After creating, jump straight into the challenge to add days
  const handleCreated = (msg, challenge) => {
    notify("success", "Challenge created!", msg);
    if (challenge?.id) {
      setSelectedChallenge(challenge);
    } else {
      setView(VIEWS.BROWSE);
    }
  };

  return (
    <>
      <Toast toast={toast} onDismiss={() => setToast(null)} />

      <div className="space-y-6 pb-10">
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">🏆 Challenges</h2>
            <p className="text-sm mt-1 text-white/35">
              Create and manage multi-day student challenges
            </p>
          </div>

          {!selectedChallenge && (
            <div className="flex gap-2 flex-wrap">
              <ViewTab icon="✍️" label="Create Challenge" active={view === VIEWS.CREATE} onClick={() => setView(VIEWS.CREATE)} />
              <ViewTab icon="🔍" label="Browse Challenges" active={view === VIEWS.BROWSE} onClick={() => setView(VIEWS.BROWSE)} />
            </div>
          )}
        </div>

        {view === VIEWS.CREATE && !selectedChallenge && (
          <ChallengeCreateForm
            onSuccess={handleCreated}
            onError={(msg) => notify("error", "Error", msg)}
          />
        )}

        {view === VIEWS.BROWSE && !selectedChallenge && (
          <ChallengeList
            onSelect={handleSelect}
            onError={(msg) => notify("error", "Error loading challenges", msg)}
          />
        )}

        {selectedChallenge && (
          <ChallengeDetail
            challenge={selectedChallenge}
            onBack={handleBack}
            onError={(msg) => notify("error", "Error", msg)}
          />
        )}
      </div>
    </>
  );
}