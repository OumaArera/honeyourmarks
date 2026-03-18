import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/teachers/Sidebar";
import Header from "../components/teachers/Header";
import BottomNav from "../components/teachers/BottomNav";
import OverviewTab from "../components/teachers/OverviewTab";
import GroupsTab from "../components/teachers/GroupsTab";
import StudentsTab from "../components/teachers/StudentsTab";
import ExamsTab from "../components/teachers/ExamsTab";
import ClassesTab from "../components/teachers/ClassesTab";
import { useAuth } from "../hooks/useAuth";
import NotesTab from "../components/teachers/NotesTab";
import ProfileTab from "../components/teachers/Profile";
import PricingTab from "../components/teachers/Pricing";
import AdminTab from "../components/teachers/Admin";
import ChallengesTab from "../components/challenges/ChallengesTab";


export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const TABS = {
    overview: OverviewTab,
    groups: GroupsTab,
    students: StudentsTab,
    notes: NotesTab,
    exams: ExamsTab,
    classes: ClassesTab,
    pricing: PricingTab,
    profile: ProfileTab,
    admin: AdminTab,
    challenges: ChallengesTab,
  };

  const TabContent = TABS[activeTab] || OverviewTab;

  return (
    <div className="min-h-screen flex"
      style={{ background: "#080E1A", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* Sidebar desktop */}
      <div className={`hidden lg:flex flex-col fixed top-0 left-0 h-full z-50 transition-all duration-300 ${sidebarCollapsed ? "w-20" : "w-64"}`}>
        <Sidebar active={activeTab} onNav={setActiveTab} collapsed={sidebarCollapsed} onLogout={handleLogout} />
      </div>

      {/* Main */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarCollapsed ? "lg:ml-20" : "lg:ml-64"}`}>
        <Header active={activeTab} onToggleSidebar={() => setSidebarCollapsed(v => !v)} onLogout={handleLogout} />
        <main className="flex-1 px-4 sm:px-6 py-6 pb-24 lg:pb-8 overflow-y-auto">
          <div className="max-w-2xl mx-auto">
            <TabContent onNav={setActiveTab} />
          </div>
        </main>
      </div>

      <BottomNav active={activeTab} onNav={setActiveTab} onLogout={handleLogout} />
    </div>
  );
}