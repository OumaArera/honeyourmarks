import React, { useRef, useState } from "react";
import { Search, ChevronDown, X } from "lucide-react";

// ─── Reusable select dropdown ─────────────────────────────────────────────────

function FilterSelect({ label, value, options, onChange, loading, placeholder }) {
  return (
    <div className="relative flex-1 min-w-0">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={loading}
        className="w-full appearance-none text-sm font-semibold rounded-xl pl-3 pr-8 py-2.5 outline-none transition-colors"
        style={{
          background: value ? "rgba(232,74,12,0.1)" : "rgba(255,255,255,0.05)",
          border: `1px solid ${value ? "rgba(232,74,12,0.35)" : "rgba(255,255,255,0.09)"}`,
          color: value ? "#fff" : "rgba(255,255,255,0.38)",
          cursor: loading ? "wait" : "pointer",
        }}
      >
        <option value="">{loading ? "Loading…" : placeholder}</option>
        {options.map(opt => (
          <option
            key={opt.value}
            value={opt.value}
            style={{ background: "#0D1520", color: "#fff" }}
          >
            {opt.label}
          </option>
        ))}
      </select>

      {/* Chevron icon */}
      <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2">
        <ChevronDown size={13} color="rgba(255,255,255,0.35)" />
      </div>

      {/* Clear button — shown only when a value is selected */}
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-6 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-70"
          aria-label={`Clear ${label} filter`}
        >
          <X size={11} color="rgba(255,255,255,0.45)" />
        </button>
      )}
    </div>
  );
}

// ─── NotesFilter ──────────────────────────────────────────────────────────────

export default function NotesFilter({ filters, subjects, teachers, loading, onChange }) {
  const [showFilters, setShowFilters] = useState(false);
  const inputRef = useRef(null);

  const subjectOptions = subjects.map(s => ({ value: s.id, label: s.name }));
  const teacherOptions = teachers.map(t => ({
    value: t.id,
    label: `${t.first_name} ${t.last_name}`,
  }));

  const activeFilterCount = [filters.subject, filters.author].filter(Boolean).length;

  const clearAll = () => {
    onChange("search", "");
    onChange("subject", "");
    onChange("author", "");
  };

  const anyActive = filters.search || filters.subject || filters.author;

  return (
    <div className="space-y-2">

      {/* ── Search bar row ── */}
      <div className="flex items-center gap-2">
        {/* Search input */}
        <div
          className="flex-1 flex items-center gap-2 rounded-xl px-3 py-2.5"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: `1px solid ${filters.search ? "rgba(232,74,12,0.35)" : "rgba(255,255,255,0.09)"}`,
          }}
        >
          <Search size={15} color="rgba(255,255,255,0.35)" className="shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={filters.search}
            onChange={e => onChange("search", e.target.value)}
            placeholder="Search notes by title or description…"
            className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-white/30 min-w-0"
          />
          {filters.search && (
            <button onClick={() => onChange("search", "")} aria-label="Clear search">
              <X size={13} color="rgba(255,255,255,0.35)" />
            </button>
          )}
        </div>

        {/* Filter toggle button */}
        <button
          onClick={() => setShowFilters(p => !p)}
          className="relative flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-black shrink-0 transition-all"
          style={{
            background: showFilters || activeFilterCount > 0
              ? "rgba(232,74,12,0.15)"
              : "rgba(255,255,255,0.05)",
            border: `1px solid ${showFilters || activeFilterCount > 0
              ? "rgba(232,74,12,0.35)"
              : "rgba(255,255,255,0.09)"}`,
            color: showFilters || activeFilterCount > 0
              ? "#E84A0C"
              : "rgba(255,255,255,0.45)",
          }}
          aria-label="Toggle filters"
        >
          {/* Filter icon */}
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <path d="M2 4h12M5 8h6M7 12h2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <span className="hidden xs:inline">Filters</span>
          {activeFilterCount > 0 && (
            <span
              className="w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center"
              style={{ background: "#E84A0C", color: "#fff" }}
            >
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* ── Expandable filter row ── */}
      {showFilters && (
        <div
          className="rounded-2xl p-3 space-y-2"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-bold" style={{ color: "rgba(255,255,255,0.4)" }}>
              Filter by
            </p>
            {anyActive && (
              <button
                onClick={clearAll}
                className="text-[11px] font-black transition-opacity hover:opacity-70"
                style={{ color: "#E84A0C" }}
              >
                Clear all
              </button>
            )}
          </div>

          {/* Dropdowns — stack on xs, row on sm+ */}
          <div className="flex flex-col sm:flex-row gap-2">
            <FilterSelect
              label="Subject"
              value={filters.subject}
              options={subjectOptions}
              onChange={v => onChange("subject", v)}
              loading={loading}
              placeholder="All subjects"
            />
            <FilterSelect
              label="Author"
              value={filters.author}
              options={teacherOptions}
              onChange={v => onChange("author", v)}
              loading={loading}
              placeholder="All teachers"
            />
          </div>
        </div>
      )}
    </div>
  );
}