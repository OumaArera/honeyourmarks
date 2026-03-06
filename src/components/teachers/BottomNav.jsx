import { useState } from "react";
import {  NAV_ITEMS } from "../../data/teacher.dashboard.data";


export default function BottomNav({ active, onNav, onLogout }) {
  const [showMore, setShowMore] = useState(false);

  const allPrimary = NAV_ITEMS.slice(0, 5);
  const allMore = NAV_ITEMS.slice(5);

  // If active tab is in "more", swap it into the last primary slot so the bar always reflects current location
  const activeIsInMore = allMore.some(i => i.key === active);
  const primary = activeIsInMore
    ? [...allPrimary.slice(0, 4), NAV_ITEMS.find(i => i.key === active)]
    : allPrimary;
  const more = NAV_ITEMS.filter(i => !primary.includes(i));

  return (
    <>
      {showMore && (
        <>
          <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setShowMore(false)} />
          <div
            className="fixed bottom-16 left-3 right-3 z-50 lg:hidden rounded-2xl overflow-hidden"
            style={{ background: "rgba(8,14,26,0.98)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(20px)" }}
          >
            {more.map(({ key, icon, label }) => {
              const isActive = active === key;
              return (
                <button
                  key={key}
                  onClick={() => { onNav(key); setShowMore(false); }}
                  className="w-full flex items-center gap-4 px-5 py-4 transition-all"
                  style={{ background: isActive ? "rgba(13,148,136,0.12)" : "transparent", borderBottom: "1px solid rgba(255,255,255,0.05)", color: isActive ? "#2DD4BF" : "rgba(255,255,255,0.6)" }}
                >
                  <span className="text-xl w-7 text-center font-black">{icon}</span>
                  <span className="font-bold text-sm">{label}</span>
                  {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-400" />}
                </button>
              );
            })}
            <button
              onClick={() => { onLogout(); setShowMore(false); }}
              className="w-full flex items-center gap-4 px-5 py-4"
              style={{ color: "rgba(248,113,113,0.8)" }}
            >
              <span className="text-xl w-7 text-center">↩</span>
              <span className="font-bold text-sm">Logout</span>
            </button>
          </div>
        </>
      )}

      <nav
        className="fixed bottom-0 left-0 right-0 z-50 flex lg:hidden border-t"
        style={{ background: "rgba(8,14,26,0.97)", borderColor: "rgba(255,255,255,0.07)", backdropFilter: "blur(16px)" }}
      >
        {primary.map(({ key, icon, label }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              onClick={() => { onNav(key); setShowMore(false); }}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 py-3 relative transition-all"
              style={{ color: isActive ? "#0D9488" : "rgba(255,255,255,0.3)" }}
            >
              <span className="text-xl leading-none font-black">{icon}</span>
              <span className="text-[9px] font-black tracking-wider uppercase">{label}</span>
              {isActive && <div className="absolute bottom-1 w-4 h-0.5 rounded-full bg-teal-500" />}
            </button>
          );
        })}

        {/* More button — hidden when active tab was swapped into primary */}
        <button
          onClick={() => setShowMore(v => !v)}
          className="flex-1 flex flex-col items-center justify-center gap-0.5 py-3 relative"
          style={{ color: showMore ? "#0D9488" : "rgba(255,255,255,0.3)" }}
        >
          <span className="text-xl leading-none">{showMore ? "✕" : "•••"}</span>
          <span className="text-[9px] font-black tracking-wider uppercase">More</span>
        </button>
      </nav>
    </>
  );
}