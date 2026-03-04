// ─── Auth modes ───────────────────────────────────────────────────────────────
export const MODES = {
  LOGIN:    "login",
  REGISTER: "register",  // student-only multi-step
  FORGOT:   "forgot",
};

// ─── Registration steps ───────────────────────────────────────────────────────
export const REG_STEPS = {
  PARENT:  0,
  STUDENT: 1,
  CONFIRM: 2,
};

// ─── Kenyan counties ──────────────────────────────────────────────────────────
export const KE_COUNTIES = [
  "Baringo","Bomet","Bungoma","Busia","Elgeyo-Marakwet","Embu","Garissa",
  "Homa Bay","Isiolo","Kajiado","Kakamega","Kericho","Kiambu","Kilifi",
  "Kirinyaga","Kisii","Kisumu","Kitui","Kwale","Laikipia","Lamu","Machakos",
  "Makueni","Mandera","Marsabit","Meru","Migori","Mombasa","Murang'a",
  "Nairobi","Nakuru","Nandi","Narok","Nyamira","Nyandarua","Nyeri",
  "Samburu","Siaya","Taita-Taveta","Tana River","Tharaka-Nithi","Trans Nzoia",
  "Turkana","Uasin Gishu","Vihiga","Wajir","West Pokot",
];

// ─── School levels ────────────────────────────────────────────────────────────
export const SCHOOL_LEVELS = [
  "Grade 1","Grade 2","Grade 3","Grade 4","Grade 5","Grade 6",
  "Grade 7 (JSS 1)","Grade 8 (JSS 2)","Grade 9 (JSS 3)",
  "Form 1","Form 2","Form 3","Form 4",
];