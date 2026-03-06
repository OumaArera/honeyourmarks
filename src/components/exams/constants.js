// ─────────────────────────────────────────────────────────────────────────────
// ── Shared Exam Constants
// ─────────────────────────────────────────────────────────────────────────────

export const GRADE_OPTIONS = [
  { value: "grade_1",  label: "Grade 1"  },
  { value: "grade_2",  label: "Grade 2"  },
  { value: "grade_3",  label: "Grade 3"  },
  { value: "grade_4",  label: "Grade 4"  },
  { value: "grade_5",  label: "Grade 5"  },
  { value: "grade_6",  label: "Grade 6"  },
  { value: "grade_7",  label: "Grade 7"  },
  { value: "grade_8",  label: "Grade 8"  },
  { value: "grade_9",  label: "Grade 9"  },
  { value: "grade_10", label: "Grade 10" },
  { value: "grade_11", label: "Grade 11" },
  { value: "grade_12", label: "Grade 12" },
];

export const LEVEL_OPTIONS = [
  { value: "scout",    label: "Scout"    },
  { value: "explorer", label: "Explorer" },
  { value: "legend",   label: "Legend"   },
];

export const LEVEL_META = {
  scout:    { label: "Scout",    color: "#34D399", bg: "rgba(52,211,153,0.12)",  border: "rgba(52,211,153,0.25)"  },
  explorer: { label: "Explorer", color: "#F59E0B", bg: "rgba(245,158,11,0.12)",  border: "rgba(245,158,11,0.25)"  },
  legend:   { label: "Legend",   color: "#F87171", bg: "rgba(248,113,113,0.12)", border: "rgba(248,113,113,0.25)" },
};

export const GRADE_LABEL = Object.fromEntries(
  GRADE_OPTIONS.map((g) => [g.value, g.label])
);

export const selectStyle = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "12px",
  color: "rgba(255,255,255,0.85)",
  fontSize: "0.875rem",
  padding: "10px 36px 10px 14px",
  width: "100%",
  outline: "none",
  appearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='rgba(255,255,255,0.3)' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 12px center",
};

export const inputStyle = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "12px",
  color: "rgba(255,255,255,0.85)",
  fontSize: "0.875rem",
  padding: "10px 14px",
  width: "100%",
  outline: "none",
};

export const inputCls = "transition-all duration-150 focus:ring-2 focus:ring-blue-700/40 focus:border-blue-700/60 placeholder:text-white/20";