
export const NAV_LINKS = ["Features", "How It Works", "Pricing"];

export const STATS = [
  { value: "10000+", label: "Students Enrolled" },
  { value: "500+", label: "Library Resources" },
  { value: "4",    label: "Exam Levels Covered" },
  { value: "98%",  label: "Student Satisfaction" },
];

export const FEATURES = [
  { icon: "📖", title: "Topical Notes",          accent: "#E84A0C", desc: "Structured, curriculum-aligned notes broken down by topic — crafted by experienced Kenyan teachers." },
  { icon: "🎮", title: "Gamified Exercises",     accent: "#2E8B2A", desc: "Earn points, unlock badges and climb leaderboards as you practice. Learning that keeps you coming back." },
  { icon: "✍️", title: "Active Exam Revision",   accent: "#E84A0C", desc: "Teacher-marked past papers and targeted revision sets with real feedback — not just answer keys." },
  { icon: "▶️", title: "YouTube Lessons",        accent: "#2E8B2A", desc: "Curated and original video lessons from top teachers, mapped directly to your notes and topics." },
  { icon: "🎥", title: "Live Virtual Classes",   accent: "#E84A0C", desc: "Join real-time Google Meet classes scheduled by your teacher. Learn live, ask questions, grow faster." },
  { icon: "💬", title: "Group Discussions",      accent: "#2E8B2A", desc: "Collaborate with peers in subject-specific discussion forums moderated by teachers." },
  { icon: "📚", title: "Huge E-Library",         accent: "#E84A0C", desc: "Thousands of resources — notes, revision sets, reference materials — all downloadable as PDFs." },
  { icon: "🏆", title: "Practical Exam Mastery", accent: "#2E8B2A", desc: "Step-by-step exam strategy guides designed specifically for Kenya's national exams." },
];

export const EXAMS = [
  { label: "Grade 6",  exam: "KPSEA", color: "#2E8B2A", form: "Grade 6",  desc: "Primary School Exit — nail the foundational transition" },
  { label: "Grade 9",  exam: "KJSEA", color: "#E84A0C", form: "Grade 9",  desc: "Junior Secondary Exit — master every subject with confidence" },
  { label: "Grade 12", exam: "KCBE",  color: "#1B2F4E", form: "Grade 12", desc: "Senior Secondary — unlock university pathways" },
  { label: "Form 4",   exam: "KCSE",  color: "#E84A0C", form: "Form 4",   desc: "The big one — intensive prep to dominate KCSE" },
];

export const EXAM_BULLETS = [
  "Curated topical notes aligned to the syllabus",
  "Past paper revision with teacher marking",
  "Video explanations for hard topics",
  "Gamified practice to track your progress",
  "Live classes during school holidays",
];

export const HOW_STEPS = [
  { n: "01", icon: "🎓", title: "Register in Minutes",  desc: "Your admission number is auto-generated. No emails needed — your DOB is your first password." },
  { n: "02", icon: "📗", title: "Access Your Content",  desc: "Browse subject notes, watch video lessons, and download resources for offline studying." },
  { n: "03", icon: "💻", title: "Join Live Classes",     desc: "Attend teacher-led Google Meet sessions. Real classes, real teachers, real growth." },
  { n: "04", icon: "🚀", title: "Revise & Level Up",     desc: "Complete assignments, get marked feedback, climb the leaderboard, and ace your exams." },
];

export const TEACHER_CARDS = [
  { icon: "🧑‍🏫", title: "Experienced & Vetted", desc: "All teachers are manually reviewed by our admin team before they can publish content." },
  { icon: "✏️",  title: "Real Feedback",         desc: "Assignments are personally marked. Students get written comments, not just a score." },
  { icon: "📅",  title: "Holiday Classes",        desc: "Teachers schedule live Google Meet classes specifically designed for holiday windows." },
  { icon: "📊",  title: "Progress Tracking",      desc: "Teachers track each student's performance and adapt their teaching accordingly." },
];

export const TESTIMONIALS = [
  { name: "Amina Wanjiru", form: "Form 4, Nairobi",  avatar: "AW", color: "#E84A0C", quote: "I went from a C to an A in Mathematics. The live classes and gamified exercises kept me going even during holidays." },
  { name: "Brian Otieno",  form: "Form 3, Kisumu",   avatar: "BO", color: "#2E8B2A", quote: "The e-library alone is worth it. I downloaded notes for every subject and studied offline whenever my data ran out." },
  { name: "Faith Chebet",  form: "Grade 9, Eldoret", avatar: "FC", color: "#1B2F4E", quote: "My teacher gave actual feedback on my essays. That personal touch is something you don't get anywhere else." },
];

// Free tier features
export const FREE_FEATURES = [
  "Browse all content previews",
  "See class schedules",
  "View your performance records",
  "Submit tuition requests",
];

// Paid tier access flags (maps to model's access control booleans)
export const ACCESS_FLAGS = [
  { key: "notes_access",           label: "Notes & study materials" },
  { key: "exercises_access",       label: "Exercises & practice sets" },
  { key: "exams_access",           label: "Past papers & exam prep" },
  { key: "virtual_classes_access", label: "Live Google Meet classes" },
];

// Partial tier — subject/topic-scoped access
export const PARTIAL_FEATURES = [
  "Notes & exercises for chosen subjects",
  "Targeted exam prep per topic",
  "Performance tracking per subject",
  "Upgrade to Full Access anytime",
];

// Full tier — unrestricted access
export const FULL_FEATURES = [
  "All notes, exercises & past papers",
  "Live virtual classes (all subjects)",
  "Teacher-marked assignments",
  "PDF downloads for offline study",
  "Personal tuition requests",
  "Full performance tracking & feedback",
];

// Duration options — mirrors model's Duration.TextChoices
export const DURATIONS = [
  { key: "weekly",  label: "Weekly",  multiplier: 1   },
  { key: "monthly", label: "Monthly", multiplier: 3.5 },
  { key: "annual",  label: "Annual",  multiplier: 40  },
];

// Base prices in KSh (weekly baseline × multiplier = approx price)
// Adjust these to your real pricing
export const PRICES = {
  partial: { weekly: 300,   monthly: 900,   annual: 8000  },
  full:    { weekly: 500,   monthly: 1500,  annual: 14000 },
};

export const FOOTER_COLS = [
  {
    title: "Platform",
    links: [
      { label: "E-Library",    to: "/library"     },
      { label: "Live Classes", to: "/classes"      },
      { label: "Exercises",    to: "/exercises"    },
      { label: "Assignments",  to: "/assignments"  },
    ],
  },
  {
    title: "Exams",
    links: [
      { label: "KCSE (Form 4)",   to: "/exams/kcse"  },
      { label: "KCBE (Grade 12)", to: "/exams/kcbe"  },
      { label: "KJSEA (Grade 9)", to: "/exams/kjsea" },
      { label: "KPSEA (Grade 6)", to: "/exams/kpsea" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "For Students",  to: "/support/students" },
      { label: "For Teachers",  to: "/support/teachers" },
      { label: "FAQs",          to: "/faqs"             },
      { label: "Contact Us",    to: "/contact"          },
    ],
  },
];

export const POLICY_LINKS = [
  { label: "Privacy Policy", to: "/privacy-policy" },
  { label: "Terms of Use",   to: "/terms"           },
  // { label: "Cookie Policy",  to: "/cookies"         },
];