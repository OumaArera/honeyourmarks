// ─── Mock user ─────────────────────────────────────────────────────────────
export const mockUser = {
  first_name: "Amani",
  last_name: "Wanjiku",
  admission_number: "HYM-808P-2026",
  school_name: "Nairobi High School",
  county: "Nairobi",
  current_school_level: "Grade 10",
  phone_number: "+254712345678",
  subjects: ["English", "Mathematics", "Biology"],
};

// ─── Exercise stats ─────────────────────────────────────────────────────────
export const mockExerciseStats = {
  overall: {
    beginner_count: 14,
    intermediate_count: 8,
    expert_count: 3,
    marked_count: 21,
    commented_count: 18,
    total_submissions: 25,
    unmarked_count: 4,
  },
  per_subject: [
    { subject_name: "English",     beginner_count: 7,  intermediate_count: 4, expert_count: 2, marked_count: 11, commented_count: 10, total_submissions: 13 },
    { subject_name: "Mathematics", beginner_count: 5,  intermediate_count: 3, expert_count: 1, marked_count:  8, commented_count:  6, total_submissions: 9  },
    { subject_name: "Biology",     beginner_count: 2,  intermediate_count: 1, expert_count: 0, marked_count:  2, commented_count:  2, total_submissions: 3  },
  ],
  per_topic: [
    { subject_name: "English",     topic_name: "Pronouns",    beginner_count: 4, intermediate_count: 2, expert_count: 1, marked_count: 6,  commented_count: 5, total_submissions: 7  },
    { subject_name: "English",     topic_name: "Tenses",      beginner_count: 3, intermediate_count: 2, expert_count: 1, marked_count: 5,  commented_count: 5, total_submissions: 6  },
    { subject_name: "Mathematics", topic_name: "Algebra",     beginner_count: 3, intermediate_count: 2, expert_count: 1, marked_count: 5,  commented_count: 3, total_submissions: 6  },
    { subject_name: "Mathematics", topic_name: "Geometry",    beginner_count: 2, intermediate_count: 1, expert_count: 0, marked_count: 3,  commented_count: 3, total_submissions: 3  },
    { subject_name: "Biology",     topic_name: "Cell Biology", beginner_count: 2, intermediate_count: 1, expert_count: 0, marked_count: 2, commented_count: 2, total_submissions: 3  },
  ],
};

// ─── Exam stats ─────────────────────────────────────────────────────────────
export const mockExamStats = {
  overall: {
    total_submissions: 12,
    marked_submissions: 10,
    scout_count: 5,
    scout_avg_score: "61.40",
    explorer_count: 3,
    explorer_avg_score: "54.00",
    legend_count: 4,
    legend_avg_score: "47.50",
  },
  per_grade: [
    { grade: "Grade 10", total_submissions: 7, overall_avg_score: "55.00", scout_count: 3, scout_avg_score: "62.00", explorer_count: 2, explorer_avg_score: "54.00", legend_count: 2, legend_avg_score: "48.00" },
    { grade: "Grade 9",  total_submissions: 5, overall_avg_score: "51.00", scout_count: 2, scout_avg_score: "60.00", explorer_count: 1, explorer_avg_score: "54.00", legend_count: 2, legend_avg_score: "47.00" },
  ],
  per_subject: [
    { subject_name: "Mathematics", subject_tag_name: "Mathematics Paper 1", grade: "Grade 10", total_submissions: 4, avg_score: "53.00", scout_count: 2, explorer_count: 1, legend_count: 1 },
    { subject_name: "English",     subject_tag_name: "English Paper 2",     grade: "Grade 10", total_submissions: 3, avg_score: "58.00", scout_count: 1, explorer_count: 1, legend_count: 1 },
    { subject_name: "Biology",     subject_tag_name: "Biology Paper 1",     grade: "Grade 9",  total_submissions: 5, avg_score: "51.00", scout_count: 2, explorer_count: 1, legend_count: 2 },
  ],
};

// ─── Groups ─────────────────────────────────────────────────────────────────
export const mockGroups = [
  { id: 1, name: "Maths Legends 🔥", teacher: "Mr. Odhiambo", subject: "Mathematics", members: 24, color: "#FF6B6B" },
  { id: 2, name: "Grammar Gurus ✍️",  teacher: "Ms. Achieng",  subject: "English",     members: 18, color: "#4ECDC4" },
  { id: 3, name: "Bio Squad 🧬",      teacher: "Mr. Kamau",    subject: "Biology",     members: 20, color: "#45B7D1" },
];

// ─── Virtual classes ────────────────────────────────────────────────────────
export const mockClasses = [
  { id: 1, subject: "Mathematics",  topic: "Quadratic Equations", teacher: "Mr. Odhiambo", date: "2026-03-06", time: "09:00", duration: 60,  status: "upcoming" },
  { id: 2, subject: "English",      topic: "Essay Writing",       teacher: "Ms. Achieng",  date: "2026-03-06", time: "11:00", duration: 45,  status: "upcoming" },
  { id: 3, subject: "Biology",      topic: "Cell Division",       teacher: "Mr. Kamau",    date: "2026-03-05", time: "14:00", duration: 60,  status: "past"     },
  { id: 4, subject: "Mathematics",  topic: "Trigonometry",        teacher: "Mr. Odhiambo", date: "2026-03-04", time: "09:00", duration: 60,  status: "past"     },
  { id: 5, subject: "English",      topic: "Comprehension",       teacher: "Ms. Achieng",  date: "2026-03-07", time: "10:00", duration: 45,  status: "upcoming" },
];

// ─── Pricing ─────────────────────────────────────────────────────────────────
export const mockPlans = [
  {
    id: "basic", name: "Basic", price: "KES 500", period: "/month",
    color: "#4ECDC4", emoji: "🌱",
    features: ["3 Subjects", "Beginner exercises", "Scout exams", "2 Groups"],
  },
  {
    id: "pro", name: "Pro", price: "KES 1,200", period: "/month",
    color: "#FF6B6B", emoji: "🚀", popular: true,
    features: ["All Subjects", "All exercise levels", "All exam levels", "Unlimited Groups", "Virtual Classes"],
  },
  {
    id: "elite", name: "Elite", price: "KES 2,500", period: "/term",
    color: "#FFD93D", emoji: "👑",
    features: ["Everything in Pro", "Priority marking", "1-on-1 sessions", "Progress reports"],
  },
];

// ─── Notes / subjects ───────────────────────────────────────────────────────
export const mockSubjects = [
  {
    id: 1, name: "English", emoji: "📖", color: "#4ECDC4",
    topics: [
      { id: 1, name: "Pronouns",  notes: 4, exercises: { beginner: 6, intermediate: 4, expert: 2 } },
      { id: 2, name: "Tenses",    notes: 3, exercises: { beginner: 5, intermediate: 3, expert: 1 } },
      { id: 3, name: "Comprehension", notes: 2, exercises: { beginner: 4, intermediate: 2, expert: 1 } },
    ],
  },
  {
    id: 2, name: "Mathematics", emoji: "📐", color: "#FF6B6B",
    topics: [
      { id: 4, name: "Algebra",   notes: 5, exercises: { beginner: 8, intermediate: 5, expert: 3 } },
      { id: 5, name: "Geometry",  notes: 3, exercises: { beginner: 6, intermediate: 3, expert: 2 } },
      { id: 6, name: "Statistics", notes: 2, exercises: { beginner: 4, intermediate: 2, expert: 1 } },
    ],
  },
  {
    id: 3, name: "Biology", emoji: "🧬", color: "#45B7D1",
    topics: [
      { id: 7, name: "Cell Biology", notes: 4, exercises: { beginner: 5, intermediate: 3, expert: 2 } },
      { id: 8, name: "Genetics",     notes: 3, exercises: { beginner: 4, intermediate: 2, expert: 1 } },
    ],
  },
];