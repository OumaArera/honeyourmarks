import React, { useState } from "react";
import { NAV_ITEMS } from "../../data/dashboard.data";

export default function BottomNav({ active, onNav, onLogout }) {
  const [showMore, setShowMore] = useState(false);
  const primaryItems = NAV_ITEMS.slice(0, 4);
  const moreItems = NAV_ITEMS.slice(4);

  return (
    <>
      {showMore && (
        <>
          <div
            className="fixed inset-0 z-40 lg:hidden"
            onClick={() => setShowMore(false)}
          />
          <div
            className="fixed bottom-16 left-3 right-3 z-50 lg:hidden rounded-2xl overflow-hidden"
            style={{ background: "rgba(10,16,28,0.98)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(20px)" }}
          >
            {moreItems.map(({ key, icon, label }) => {
              const isActive = active === key;
              return (
                <button
                  key={key}
                  onClick={() => { onNav(key); setShowMore(false); }}
                  className="w-full flex items-center gap-4 px-5 py-4 transition-all duration-200"
                  style={{
                    background: isActive ? "rgba(232,74,12,0.12)" : "transparent",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    color: isActive ? "#E84A0C" : "rgba(255,255,255,0.7)",
                  }}
                >
                  <span className="text-base w-7 text-center">{icon}</span>
                  <span className="font-bold text-sm">{label}</span>
                  {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-500" />}
                </button>
              );
            })}
            <button
              onClick={() => { onLogout(); setShowMore(false); }}
              className="w-full flex items-center gap-4 px-5 py-4 transition-all duration-200"
              style={{ color: "rgba(255,100,100,0.7)" }}
            >
              <span className="text-base w-7 text-center">↩</span>
              <span className="font-bold text-sm">Logout</span>
            </button>
          </div>
        </>
      )}

      <nav
        className="fixed bottom-0 left-0 right-0 z-50 flex lg:hidden border-t overflow-hidden"
        style={{
          background: "rgba(10,16,28,0.97)",
          borderColor: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(16px)",
          width: "100vw",
          maxWidth: "100vw",
        }}
      >
        {primaryItems.map(({ key, icon, label }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              onClick={() => { onNav(key); setShowMore(false); }}
              className="flex-1 min-w-0 flex flex-col items-center justify-center gap-0.5 py-2 transition-all duration-200 relative"
              style={{ color: isActive ? "#E84A0C" : "rgba(255,255,255,0.35)" }}
            >
              <span className="text-base leading-none">{icon}</span>
              <span
                className="font-bold uppercase truncate w-full text-center px-0.5"
                style={{ fontSize: "8px", letterSpacing: "0.02em" }}
              >
                {label}
              </span>
              {isActive && <div className="absolute bottom-1 w-4 h-0.5 rounded-full bg-orange-500" />}
            </button>
          );
        })}

        <button
          onClick={() => setShowMore(v => !v)}
          className="flex-1 min-w-0 flex flex-col items-center justify-center gap-0.5 py-2 transition-all duration-200 relative"
          style={{ color: showMore ? "#E84A0C" : "rgba(255,255,255,0.35)" }}
        >
          <span className="text-base leading-none">{showMore ? "✕" : "•••"}</span>
          <span className="font-bold uppercase" style={{ fontSize: "8px", letterSpacing: "0.02em" }}>More</span>
          {moreItems.some(i => i.key === active) && !showMore && (
            <div className="absolute top-2 right-1/4 w-1.5 h-1.5 rounded-full bg-orange-500" />
          )}
        </button>
      </nav>
    </>
  );
}