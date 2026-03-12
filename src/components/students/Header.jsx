import React, { useMemo } from "react";
import { LogOut, Bell } from "lucide-react";
import { NAV_ITEMS } from "../../data/dashboard.data";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function Header({ active, student, onToggleSidebar, onLogout }) {
  const currentNav = NAV_ITEMS.find(n => n.key === active);
  const greeting = useMemo(() => getGreeting(), []);
  const firstName = student?.first_name ?? "...";

  return (
    <header
      className="sticky top-0 z-40 flex items-center gap-3 px-4 sm:px-5 py-3.5"
      style={{
        background: "rgba(10,16,28,0.9)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(16px)",
      }}
    >
      {/* Sidebar toggle — desktop only */}
      <button
        onClick={onToggleSidebar}
        className="hidden lg:flex w-9 h-9 rounded-lg items-center justify-center shrink-0"
        style={{
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "rgba(255,255,255,0.6)",
        }}
      >
        ☰
      </button>

      {/* Page title */}
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-lg shrink-0">{currentNav?.icon}</span>
        <h1 className="font-black text-white text-base sm:text-lg truncate">
          {currentNav?.label}
        </h1>
      </div>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-2 sm:gap-3 shrink-0">

        {/* Greeting — visible on ALL screen sizes */}
        <div className="flex flex-col items-end leading-tight">
          <span className="text-[10px] sm:text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
            {greeting},
          </span>
          <span
            className="text-xs sm:text-sm font-bold text-white truncate"
            style={{ maxWidth: "80px", }}
            title={firstName}
          >
            {firstName}
          </span>
        </div>

        {/* Notification bell */}
        <button
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition-opacity hover:opacity-70"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
          aria-label="Notifications"
        >
          <Bell size={15} color="rgba(255,255,255,0.6)" />
        </button>

        {/* Logout — desktop only */}
        <button
          onClick={onLogout}
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-opacity hover:opacity-70"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "rgba(255,255,255,0.5)",
          }}
          aria-label="Logout"
        >
          <LogOut size={13} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}