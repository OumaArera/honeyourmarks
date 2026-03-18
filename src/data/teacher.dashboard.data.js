export const TEACHER = {
  name: "Mr. Daniel Omondi",
  title: "Senior Mathematics Teacher",
  avatar: "🦅",
  school: "Nairobi Academy",
  subjects: ["Mathematics", "Physics"],
  totalStudents: 94,
  activeGroups: 4,
};

export const STATS = {
  pendingMarking: 18,
  totalExercises: 142,
  totalExams: 36,
  activeStudents: 94,
  classesThisWeek: 6,
  avgScore: "74.2",
};

export const GROUPS = [
  { id: 1, name: "Form 3 Mathematics", subject: "Mathematics", grade: "Form 3", members: 28, color: "#0D9488", nextClass: "Today 3 PM", exercises: 42, pending: 7 },
  { id: 2, name: "Form 4 Mathematics", subject: "Mathematics", grade: "Form 4", members: 24, color: "#0891B2", nextClass: "Tomorrow 10 AM", exercises: 38, pending: 5 },
  { id: 3, name: "Form 2 Physics", subject: "Physics", grade: "Form 2", members: 22, color: "#7C3AED", nextClass: "Wed 9 AM", exercises: 31, pending: 4 },
  { id: 4, name: "Form 1 Mathematics", subject: "Mathematics", grade: "Form 1", members: 20, color: "#B45309", nextClass: "Thu 11 AM", exercises: 31, pending: 2 },
];

export const STUDENTS = [
  { id: 1, name: "Amara Wanjiku", grade: "Form 3", group: "Form 3 Mathematics", avatar: "🦁", streak: 14, level: 12, submissions: 15, avgScore: "78", status: "active" },
  { id: 2, name: "Kofi Mensah", grade: "Form 3", group: "Form 3 Mathematics", avatar: "🐆", streak: 9, level: 8, submissions: 11, avgScore: "65", status: "active" },
  { id: 3, name: "Zara Otieno", grade: "Form 4", group: "Form 4 Mathematics", avatar: "🦊", streak: 21, level: 15, submissions: 20, avgScore: "88", status: "active" },
  { id: 4, name: "Jabari Kamau", grade: "Form 2", group: "Form 2 Physics", avatar: "🐘", streak: 3, level: 4, submissions: 6, avgScore: "58", status: "warning" },
  { id: 5, name: "Nia Njoroge", grade: "Form 3", group: "Form 3 Mathematics", avatar: "🦋", streak: 0, level: 6, submissions: 8, avgScore: "61", status: "inactive" },
  { id: 6, name: "Emeka Abubakar", grade: "Form 4", group: "Form 4 Mathematics", avatar: "🦅", streak: 17, level: 14, submissions: 18, avgScore: "83", status: "active" },
];

export const EXERCISES = [
  { id: 1, title: "Quadratic Equations — Set A", subject: "Mathematics", grade: "Form 3", level: "intermediate", submissions: 22, marked: 15, dueDate: "Today", color: "#0D9488" },
  { id: 2, title: "Trigonometry Basics", subject: "Mathematics", grade: "Form 4", level: "beginner", submissions: 18, marked: 18, dueDate: "Done", color: "#0891B2" },
  { id: 3, title: "Newton's Laws — Problem Set", subject: "Physics", grade: "Form 2", level: "expert", submissions: 14, marked: 9, dueDate: "Tomorrow", color: "#7C3AED" },
  { id: 4, title: "Algebraic Fractions", subject: "Mathematics", grade: "Form 1", level: "beginner", submissions: 20, marked: 20, dueDate: "Done", color: "#B45309" },
  { id: 5, title: "Quadratic Equations — Set B", subject: "Mathematics", grade: "Form 3", level: "expert", submissions: 10, marked: 3, dueDate: "Overdue", color: "#0D9488" },
];

export const EXAMS = [
  { id: 1, title: "Mathematics Paper 1", subject: "Mathematics", grade: "Form 3", level: "scout", attempts: 25, avgScore: "71", published: true, color: "#0D9488" },
  { id: 2, title: "Mathematics Paper 2", subject: "Mathematics", grade: "Form 4", level: "legend", attempts: 20, avgScore: "68", published: true, color: "#0891B2" },
  { id: 3, title: "Physics Mid-Term", subject: "Physics", grade: "Form 2", level: "explorer", attempts: 14, avgScore: "62", published: false, color: "#7C3AED" },
];

export const CLASSES = [
  { id: 1, title: "Quadratic Equations — Live Session", subject: "Mathematics", grade: "Form 3", date: "Today", time: "3:00 PM", duration: "90 min", enrolled: 28, color: "#0D9488", upcoming: true },
  { id: 2, title: "Vectors & Scalars", subject: "Physics", grade: "Form 2", date: "Tomorrow", time: "9:00 AM", duration: "60 min", enrolled: 22, color: "#7C3AED", upcoming: true },
  { id: 3, title: "Indices & Logarithms", subject: "Mathematics", grade: "Form 4", date: "Wed", time: "10:00 AM", duration: "75 min", enrolled: 24, color: "#0891B2", upcoming: true },
  { id: 4, title: "Simultaneous Equations", subject: "Mathematics", grade: "Form 3", date: "Yesterday", time: "3:00 PM", duration: "90 min", enrolled: 26, attended: 22, color: "#0D9488", upcoming: false },
];

export const PENDING_MARKS = [
  { id: 1, student: "Amara Wanjiku", exercise: "Quadratic Equations — Set A", subject: "Mathematics", submitted: "2h ago", avatar: "🦁" },
  { id: 2, student: "Kofi Mensah", exercise: "Quadratic Equations — Set A", subject: "Mathematics", submitted: "3h ago", avatar: "🐆" },
  { id: 3, student: "Jabari Kamau", exercise: "Newton's Laws — Problem Set", subject: "Physics", submitted: "5h ago", avatar: "🐘" },
  { id: 4, student: "Nia Njoroge", exercise: "Quadratic Equations — Set B", subject: "Mathematics", submitted: "1d ago", avatar: "🦋" },
  { id: 5, student: "Emeka Abubakar", exercise: "Quadratic Equations — Set B", subject: "Mathematics", submitted: "1d ago", avatar: "🦅" },
];

export const NAV_ITEMS = [
  { key: "overview",   icon: "⬡",  label: "Overview" },
  { key: "admin",   icon: "🛡️",  label: "Admin" },
  { key: "groups",     icon: "◈",  label: "Groups" },
  { key: "students",   icon: "◉",  label: "Students" },
  { key: "notes",  icon: "◧",  label: "Notes" },
  { key: "exams",      icon: "◈",  label: "Exams" },
  { key: "classes",    icon: "◎",  label: "Classes" },
  { key: "challenges", icon: "🏆",  label: "Challenges" },
  { key: "pricing", icon: "💳", label: "Pricing" },
  { key: "profile", icon: "⚙️", label: "Profile" },
];