import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/students/Sidebar";
import BottomNav from '../components/students/BottomNav';
import HomeTab from "../components/students/Home";
import NotesTab from '../components/students/Notes';
import ExamsTab from "../components/students/Exam";
import ClassesTab from "../components/students/ClassesTab";
import GroupsTab from "../components/students/GroupsTab";
import PricingTab from "../components/students/PricingTab";
import ProfileTab from "../components/students/ProfileTab";
import Header from "../components/students/Header";
import { useAuth } from "../hooks/useAuth";


export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("home");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const TABS = { home: HomeTab, notes: NotesTab, exams: ExamsTab, classes: ClassesTab, groups: GroupsTab, pricing: PricingTab, profile: ProfileTab };
  const TabContent = TABS[activeTab] || HomeTab;

  return (
    <div className="min-h-screen flex"
      style={{ background: "#0A1018", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div className={`hidden lg:flex flex-col fixed top-0 left-0 h-full z-50 transition-all duration-300 ${sidebarCollapsed ? "w-20" : "w-60"}`}>
        <Sidebar active={activeTab} onNav={setActiveTab} collapsed={sidebarCollapsed} />
      </div>
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarCollapsed ? "lg:ml-20" : "lg:ml-60"}`}>
        <Header active={activeTab} onToggleSidebar={() => setSidebarCollapsed(v => !v)} onLogout={handleLogout} />
        <main className="flex-1 px-4 sm:px-6 py-6 pb-24 lg:pb-8 overflow-y-auto">
          <div className="max-w-2xl mx-auto">
            <TabContent />
          </div>
        </main>
      </div>
      <BottomNav active={activeTab} onNav={setActiveTab} onLogout={handleLogout} />
    </div>
  );
}