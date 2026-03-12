import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/students/Sidebar";
import BottomNav from "../components/students/BottomNav";
import HomeTab from "../components/students/Home";
import ClassesTab from "../components/students/ClassesTab";
import GroupsTab from "../components/students/GroupsTab";
import PricingTab from "../components/students/PricingTab";
import Header from "../components/students/Header";
import { useAuth } from "../hooks/useAuth";
import { getData } from "../api/api.service";
import { getUserId } from "../utils/notes.utils";
import NotesTab from "../components/students/notes/NotesTab";
import ExamsTab from "../components/students/exams/ExamsTab";
import ProfileTab from '../components/students/ProfileTab'

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("home");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [student, setStudent] = useState(null);
  const [examStats, setExamStats] = useState(null);
  const [exerciseStats, setExerciseStats] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const { logout } = useAuth();
  const navigate = useNavigate();

  // Step 1: fetch student profile
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const userId = getUserId();
        const response = await getData(`students/?user_id=${userId}`);
        setStudent(response?.results?.[0] ?? null);
      } catch (err) {
        console.error("Failed to fetch student profile:", err);
      }
    };
    fetchStudent();
  }, []);

  // Step 2: once student ID is known, fetch all dashboard data in parallel
  useEffect(() => {
    if (!student?.id) return;

    const fetchAll = async () => {
      setStatsLoading(true);
      try {
        const [exams, exercises, subs] = await Promise.all([
          getData(`dashboard/student/${student.id}/stats/`),
          getData(`dashboard/student/${student.id}/exercises/`),
          getData(`subscriptions/?student=${student.id}&active=true`),
        ]);
        setExamStats(exams);
        setExerciseStats(exercises);
        // Take the first active subscription (there should only be one)
        setSubscription(subs?.results?.[0] ?? null);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchAll();
  }, [student?.id]);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const TABS = {
    home: HomeTab,
    notes: NotesTab,
    exams: ExamsTab,
    classes: ClassesTab,
    groups: GroupsTab,
    pricing: PricingTab,
    profile: ProfileTab,
  };
  const TabContent = TABS[activeTab] || HomeTab;

  return (
    <div
      className="min-h-screen flex"
      style={{ background: "#0A1018", fontFamily: "'Segoe UI', system-ui, sans-serif" }}
    >
      <div
        className={`hidden lg:flex flex-col fixed top-0 left-0 h-full z-50 transition-all duration-300 ${
          sidebarCollapsed ? "w-20" : "w-60"
        }`}
      >
        <Sidebar active={activeTab} onNav={setActiveTab} collapsed={sidebarCollapsed} />
      </div>

      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          sidebarCollapsed ? "lg:ml-20" : "lg:ml-60"
        }`}
      >
        <Header
          active={activeTab}
          student={student}
          onToggleSidebar={() => setSidebarCollapsed(v => !v)}
          onLogout={handleLogout}
        />
        <main className="flex-1 px-4 sm:px-6 py-6 pb-24 lg:pb-8 overflow-y-auto">
          <div className="max-w-2xl mx-auto">
            <TabContent
              student={student}
              examStats={examStats}
              exerciseStats={exerciseStats}
              subscription={subscription}
              statsLoading={statsLoading}
              onNav={setActiveTab}
            />
          </div>
        </main>
      </div>

      <BottomNav active={activeTab} onNav={setActiveTab} onLogout={handleLogout} />
    </div>
  );
}