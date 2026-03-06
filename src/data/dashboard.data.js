// ─── MOCK DATA ────────────────────────────────────────────────────────────────
export const STUDENT = {
  name: "Amara Wanjiku",
  grade: "Form 3",
  avatar: "🦁",
  streak: 14,
  xp: 3240,
  level: 12,
  nextLevelXp: 4000,
  badge: "Rising Star",
};

export const NOTES_STATS = {
  overall: { beginner_count: 8, intermediate_count: 5, expert_count: 2, marked_count: 12, commented_count: 9, total_submissions: 15, unmarked_count: 3 },
  per_subject: [
    { subject_name: "English", beginner_count: 4, intermediate_count: 2, expert_count: 1, marked_count: 6, commented_count: 5, total_submissions: 7 },
    { subject_name: "Mathematics", beginner_count: 2, intermediate_count: 2, expert_count: 1, marked_count: 4, commented_count: 3, total_submissions: 5 },
    { subject_name: "Chemistry", beginner_count: 2, intermediate_count: 1, expert_count: 0, marked_count: 2, commented_count: 1, total_submissions: 3 },
  ],
  per_topic: [
    { subject_name: "English", topic_name: "Pronouns", beginner_count: 2, intermediate_count: 1, expert_count: 0, marked_count: 3, commented_count: 2, total_submissions: 3 },
    { subject_name: "English", topic_name: "Essay Writing", beginner_count: 2, intermediate_count: 1, expert_count: 1, marked_count: 3, commented_count: 3, total_submissions: 4 },
    { subject_name: "Mathematics", topic_name: "Quadratic Equations", beginner_count: 1, intermediate_count: 2, expert_count: 1, marked_count: 4, commented_count: 2, total_submissions: 4 },
    { subject_name: "Chemistry", topic_name: "Organic Chemistry", beginner_count: 2, intermediate_count: 1, expert_count: 0, marked_count: 2, commented_count: 1, total_submissions: 3 },
  ],
};

export const EXAM_STATS = {
  overall: { total_submissions: 8, marked_submissions: 7, scout_count: 3, scout_avg_score: "62.5", explorer_count: 2, explorer_avg_score: "74.0", legend_count: 2, legend_avg_score: "81.5" },
  per_grade: [
    { grade: "Form 3", total_submissions: 5, overall_avg_score: "71.0", scout_count: 2, scout_avg_score: "61.0", explorer_count: 2, explorer_avg_score: "74.0", legend_count: 1, legend_avg_score: "82.0" },
    { grade: "Form 2", total_submissions: 3, overall_avg_score: "65.0", scout_count: 1, scout_avg_score: "65.0", explorer_count: 0, explorer_avg_score: null, legend_count: 1, legend_avg_score: "81.0" },
  ],
  per_subject: [
    { subject_name: "Mathematics", subject_tag_name: "Mathematics Paper 1", grade: "Form 3", total_submissions: 3, avg_score: "78.0", scout_count: 1, explorer_count: 1, legend_count: 1 },
    { subject_name: "English", subject_tag_name: "English Paper 2", grade: "Form 3", total_submissions: 2, avg_score: "64.0", scout_count: 1, explorer_count: 1, legend_count: 0 },
    { subject_name: "Chemistry", subject_tag_name: "Chemistry Paper 1", grade: "Form 2", total_submissions: 3, avg_score: "65.0", scout_count: 1, explorer_count: 0, legend_count: 1 },
  ],
};

export const GROUPS = [
  { id: 1, name: "Form 3 Mathematics", teacher: "Mr. Omondi", subject: "Mathematics", members: 28, color: "#E84A0C", icon: "📐", nextClass: "Tomorrow 10 AM" },
  { id: 2, name: "English Intensive", teacher: "Ms. Kamau", subject: "English", members: 22, color: "#1B7FC4", icon: "📚", nextClass: "Today 3 PM" },
  { id: 3, name: "Chemistry Elite", teacher: "Dr. Njoroge", subject: "Chemistry", members: 18, color: "#2E8B2A", icon: "🔬", nextClass: "Wed 9 AM" },
];

export const CLASSES = {
  upcoming: [
    { id: 1, title: "Quadratic Equations — Live", teacher: "Mr. Omondi", subject: "Mathematics", date: "Today", time: "3:00 PM", duration: "90 min", color: "#E84A0C", icon: "📐", countdown: "2h 15m" },
    { id: 2, title: "Essay Writing Workshop", teacher: "Ms. Kamau", subject: "English", date: "Tomorrow", time: "10:00 AM", duration: "60 min", color: "#1B7FC4", icon: "📚", countdown: "18h 30m" },
    { id: 3, title: "Organic Chemistry Deep Dive", teacher: "Dr. Njoroge", subject: "Chemistry", date: "Wed", time: "9:00 AM", duration: "75 min", color: "#2E8B2A", icon: "🔬", countdown: "2d" },
  ],
  past: [
    { id: 4, title: "Pronoun Mastery", teacher: "Ms. Kamau", subject: "English", date: "Yesterday", time: "2:00 PM", duration: "60 min", color: "#1B7FC4", icon: "📚", attended: true },
    { id: 5, title: "Algebraic Expressions", teacher: "Mr. Omondi", subject: "Mathematics", date: "Mon", time: "10:00 AM", duration: "90 min", color: "#E84A0C", icon: "📐", attended: true },
    { id: 6, title: "Acids & Bases", teacher: "Dr. Njoroge", subject: "Chemistry", date: "Sun", time: "11:00 AM", duration: "75 min", color: "#2E8B2A", icon: "🔬", attended: false },
  ],
};

export const PRICING = {
  current: "partial",
  expiry: "March 28, 2026",
  daysLeft: 23,
  plans: [
    { key: "free", name: "Preview", price: "Free", desc: "Browse topics & sample exercises", color: "#718096" },
    { key: "partial", name: "Partial", price: "KSh 800/mo", desc: "Selected subjects + exercises", color: "#2E8B2A", active: true },
    { key: "full", name: "Full Access", price: "KSh 1,500/mo", desc: "Everything unlocked. Best value.", color: "#E84A0C" },
  ],
};

// ─── NAV CONFIG ───────────────────────────────────────────────────────────────
export const NAV_ITEMS = [
  { key: "home",    icon: "🏠", label: "Home" },
  { key: "notes",   icon: "📝", label: "Notes" },
  { key: "exams",   icon: "🏆", label: "Exams" },
  { key: "classes", icon: "📡", label: "Classes" },
  { key: "groups",  icon: "👥", label: "Groups" },
  { key: "pricing", icon: "💳", label: "Pricing" },
  { key: "profile", icon: "⚙️", label: "Profile" },
];