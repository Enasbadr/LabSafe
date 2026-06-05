var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_process = __toESM(require("process"), 1);
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var DATA_DIR = import_path.default.join(import_process.default.cwd(), "data");
var USERS_FILE = import_path.default.join(DATA_DIR, "users.json");
var LESSONS_FILE = import_path.default.join(DATA_DIR, "lessons.json");
var REFERENCES_FILE = import_path.default.join(DATA_DIR, "references.json");
var LABS_FILE = import_path.default.join(DATA_DIR, "labs.json");
var DEFAULT_USER_STATE = {
  name: "Enas",
  email: "researcher@lab.edu",
  avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuD6euUAWlt1RsMrfsRcQda9gz81u9sLRIg5XP2asY72Faa30V_7WqI63NP5ASbqTSUYI5IGTsM4rnjVk44lu3Jjqe_RW-0lLRGLC3M7h73UXLYnFyQP3hIYKHbl8dRmPx_3W9ZeWDRhDGLhQ7sSrX4OM9xQTJPjkbm36tt7eTY_CORPnnNGSDDTh-NS-iK3Zd6kupfngOvvkiS0N7DQ4hEkTzmJ4Xj7C3io3CYU6wT3jvBLhdxNlhrOIt6WWeYmKlpMIULJbFKVAjrF",
  level: 14,
  xp: 850,
  xpNextLevel: 1e3,
  streakDays: 12,
  unlockedBadges: ["safety-hero", "quick-thinker", "bio-master"],
  labProgress: {
    chemistry: 45,
    microbiology: 12
  },
  masteryScores: {
    general: 100,
    biological: 75,
    chemical: 40,
    fire: 0
  }
};
function ensureDataFile() {
  if (!import_fs.default.existsSync(DATA_DIR)) {
    import_fs.default.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!import_fs.default.existsSync(USERS_FILE)) {
    import_fs.default.writeFileSync(USERS_FILE, JSON.stringify({}), "utf-8");
  }
}
function ensureLessonsFile() {
  ensureDataFile();
  if (!import_fs.default.existsSync(LESSONS_FILE)) {
    import_fs.default.writeFileSync(LESSONS_FILE, JSON.stringify([], null, 2), "utf-8");
  }
}
function loadLessons() {
  ensureLessonsFile();
  try {
    const data = import_fs.default.readFileSync(LESSONS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}
function saveLessons(lessons) {
  ensureLessonsFile();
  const tempPath = `${LESSONS_FILE}.tmp`;
  try {
    import_fs.default.writeFileSync(tempPath, JSON.stringify(lessons, null, 2), "utf-8");
    import_fs.default.renameSync(tempPath, LESSONS_FILE);
  } catch (err) {
    console.error("Critical failure when persisting lessons database:", err);
    if (import_fs.default.existsSync(tempPath)) {
      try {
        import_fs.default.unlinkSync(tempPath);
      } catch (_) {
      }
    }
  }
}
var DEFAULT_REFERENCES = [
  {
    id: "ref-1",
    title: "Hydrochloric Acid (HCl) 37%",
    type: "SDS",
    description: "Complete safety data sheet including safe handling parameters, temperature storage, toxic vapors, and specialized emergency response procedures for concentrated corrosive HCl.",
    version: "v2.4",
    date: "Oct 2023",
    internal: false,
    source: "Sigma-Aldrich SDS",
    downloadable: true,
    url: "https://www.sigmaaldrich.com/US/en/product/sigald/h1758",
    pdfUrl: "https://www.purdue.edu/ehps/rem/documents/msds/hcl.pdf"
  },
  {
    id: "ref-2",
    title: "Ultracentrifuge Operation & Maintenance",
    type: "SOP",
    description: "Standard operating procedure for the Beckman Coulter Optima XE high-velocity system. Deeply covers rotor inspection, balancing procedures, safe vacuum run set-up, and emergency shutdown protocols.",
    version: "v1.1",
    date: "Jan 2024",
    internal: true,
    source: "Beckman Coulter Optima Manual",
    downloadable: true,
    url: "https://www.beckman.com/centrifuges/ultracentrifuges/optima-xe",
    pdfUrl: "https://bme.wisc.edu/wp-content/uploads/sites/1183/2020/09/Beckman-Coulter-Ultracentrifuge-SOP.pdf"
  },
  {
    id: "ref-3",
    title: "Hazard Communication Standard",
    type: "OSHA",
    description: "Comprehensive regulatory guidelines aligning strictly with the Globally Harmonized System (GHS) for chemical labeling container requirements, OSHA sheets, and safety right-to-know.",
    version: "29 CFR 1910.1200",
    date: "Revised 2022",
    internal: false,
    source: "US Department of Labor",
    downloadable: true,
    url: "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.1200",
    pdfUrl: "https://www.osha.gov/sites/default/files/laws-regs/federalregister/2012-03-26.pdf"
  },
  {
    id: "ref-4",
    title: "Biosafety Level 2 (BSL-2) Practices",
    type: "CDC",
    description: "BMBL 6th Edition requirements and biological safety recommendations for safe handling of moderate-risk clinically infectious cell-lines, culture media, and sample isolation controls.",
    version: "BMBL v6",
    date: "Dec 2020",
    internal: false,
    source: "CDC / NIH Publication",
    downloadable: true,
    url: "https://www.cdc.gov/labs/bmbl/CDC_AAref_Val=https://www.cdc.gov/labs/bmbl.html",
    pdfUrl: "https://www.cdc.gov/labs/pdf/SF__19_307521-A_Book_BMBL_6th_Edition_CPC_QA_508_v2.pdf"
  },
  {
    id: "ref-5",
    title: "Chemical Fume Hood Calibration Manual",
    type: "MANUAL",
    description: "Manufacturer engineering benchmarks and step-by-step air velocity calibration controls for standard laboratory negative pressure glass cabinets. Includes visual baffle test standards.",
    version: "LabC-900",
    date: "Nov 2023",
    internal: false,
    source: "LabConco Engineering",
    downloadable: true,
    url: "https://www.labconco.com/category/chemical-fume-hoods",
    pdfUrl: "https://ehs.fiu.edu/_resources/docs/chemical-safety/laboratory-fume-hood-safety-guide.pdf"
  },
  {
    id: "ref-6",
    title: "Nitric Acid (HNO3) 70%",
    type: "SDS",
    description: "Official GHS Safety Data Sheet detailing concentrated Nitric Acid hazard warnings, reactive zero-cellulose limits, dermal contact safeguards, and vapor ventilation protocols.",
    version: "v4.1",
    date: "Jan 2024",
    internal: false,
    source: "Merck Millipore SDS",
    downloadable: true,
    url: "https://www.sigmaaldrich.com/US/en/product/sigald/438073",
    pdfUrl: "https://www.purdue.edu/ehps/rem/documents/msds/nitric.pdf"
  },
  {
    id: "ref-7",
    title: "Biosafety Cabinet Class II Operation",
    type: "SOP",
    description: "Standard operating procedures for Microbiological Containment Hoods. Covers laminar flow rates, HEPA filtration recirculations, physical sash clearance, and biological swipe protocols.",
    version: "v2.0",
    date: "Mar 2024",
    internal: true,
    source: "Labconco Purifier Manual",
    downloadable: true,
    url: "https://www.labconco.com/category/biosafety-cabinets",
    pdfUrl: "https://www.cuanschutz.edu/docs/librariesprovider124/default-document-library/biological-safety-cabinets-selection-use-and-installation.pdf"
  },
  {
    id: "ref-8",
    title: "Occupational Chemical Exposure Standard",
    type: "OSHA",
    description: "The classic general laboratory standard requiring chemical hygiene plans, workplace threshold monitor limits, secure splash PPE safety wear, and immediate hazardous release guides.",
    version: "29 CFR 1910.1450",
    date: "Revised 2023",
    internal: false,
    source: "US Department of Labor",
    downloadable: true,
    url: "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.1450",
    pdfUrl: "https://www.osha.gov/sites/default/files/publications/OSHA3404laboratory.pdf"
  },
  {
    id: "ref-9",
    title: "Disinfection & Biological Sterilization Guidelines",
    type: "CDC",
    description: "Authorized CDC/IC guidelines defining wet saturated autoclave thermodynamic parameters, sterile steam exposures (121\xB0C/15 PSI), and biological indicator spore controls.",
    version: "CDC-2008",
    date: "Updated May 2019",
    internal: false,
    source: "Centers for Disease Control",
    downloadable: true,
    url: "https://www.cdc.gov/infection-control/hcp/disinfection-and-sterilization/?CDC_AAref_Val=https://www.cdc.gov/infectioncontrol/guidelines/disinfection/",
    pdfUrl: "https://www.cdc.gov/infection-control/media/pdfs/guideline-disinfection-h.pdf?CDC_AAref_Val=https://www.cdc.gov/infectioncontrol/pdf/guidelines/disinfection-guidelines-H.pdf"
  },
  {
    id: "ref-10",
    title: "Tuttnauer Sterilizer Maintenance & Operations",
    type: "MANUAL",
    description: "Mechanical autoclave validation manual mapping pressure chamber safety locks, steam-run cycles, biological spore indicator testing, and rapid discharge boil-over prevention.",
    version: "EL-Chamber",
    date: "Dec 2023",
    internal: false,
    source: "Tuttnauer Engineering",
    downloadable: true,
    url: "https://tuttnauer.com/laboratory-autoclaves",
    pdfUrl: "https://ehs.cornell.edu/sites/default/files/autoclave_guidelines.pdf"
  }
];
var DEFAULT_LABS = [
  {
    id: "chemistry",
    title: "Chemistry Lab",
    titleAr: "\u0645\u062E\u062A\u0628\u0631 \u0627\u0644\u0643\u064A\u0645\u064A\u0627\u0621",
    desc: "Chemical interaction, emergency spill containment, and fume hood air calibration protocols.",
    descAr: "\u0627\u0644\u062A\u0639\u0627\u0645\u0644 \u0627\u0644\u0643\u064A\u0645\u064A\u0627\u0626\u064A \u0627\u0644\u0645\u0639\u0642\u062F\u060C \u0648\u0627\u0644\u0648\u0642\u0627\u064A\u0629 \u0645\u0646 \u0627\u0644\u0627\u0646\u0633\u0628\u0627\u0628\u0627\u062A\u060C \u0648\u0645\u0639\u0627\u064A\u0631\u0629 \u0643\u0628\u0627\u0626\u0646 \u0633\u062D\u0628 \u0627\u0644\u063A\u0627\u0632\u0627\u062A \u0627\u0644\u0633\u0627\u0645\u0629.",
    progress: 33,
    locked: false,
    logoColor: "text-blue-650 bg-blue-50 dark:bg-blue-900/20",
    icon: "FlaskConical"
  },
  {
    id: "microbiology",
    title: "Microbiology Lab",
    titleAr: "\u0645\u062E\u062A\u0628\u0631 \u0627\u0644\u0623\u062D\u064A\u0627\u0621 \u0627\u0644\u062F\u0642\u064A\u0642\u0629",
    desc: "Biosafety barrier levels (BSL-1 to 4), pressure autoclave, and aseptic validation controls.",
    descAr: "\u0645\u0633\u062A\u0648\u064A\u0627\u062A \u0627\u0644\u0623\u0645\u0627\u0646 \u0627\u0644\u062D\u064A\u0648\u064A \u0627\u0644\u0623\u0631\u0628\u0639\u0629\u060C \u0648\u0627\u0644\u062A\u0639\u0642\u064A\u0645 \u0627\u0644\u0628\u062E\u0627\u0631\u064A \u0627\u0644\u0645\u0648\u0635\u062F \u0628\u0627\u0644\u0636\u063A\u0637 \u0648\u0627\u0644\u062A\u062D\u0642\u0642 \u0627\u0644\u0645\u064A\u0643\u0631\u0648\u0628\u064A.",
    progress: 0,
    locked: false,
    logoColor: "text-teal-600 bg-teal-50 dark:bg-teal-900/20",
    icon: "Microscope"
  },
  {
    id: "petroleum",
    title: "Oil & Petroleum",
    titleAr: "\u0627\u0644\u0646\u0641\u0637 \u0648\u0627\u0644\u063A\u0627\u0632 \u0648\u0627\u0644\u0628\u062A\u0631\u0648\u0644",
    desc: "Flammability hazards, toxic gas exposure, and rig safety.",
    descAr: "\u0645\u062E\u0627\u0637\u0631 \u0627\u0644\u0627\u062D\u062A\u0631\u0627\u0642\u060C \u0648\u0627\u0644\u063A\u0627\u0632\u0627\u062A \u0627\u0644\u0633\u0627\u0645\u0629\u060C \u0648\u0642\u0648\u0627\u0639\u062F \u0627\u0644\u0633\u0644\u0627\u0645\u0629 \u0641\u064A \u0627\u0644\u062D\u0642\u0648\u0644 \u0648\u0627\u0644\u0645\u0646\u0635\u0627\u062A \u0627\u0644\u0646\u0641\u0637\u064A\u0629.",
    progress: 0,
    locked: true,
    logoColor: "text-slate-400 bg-slate-100 dark:bg-slate-800 dark:text-slate-500",
    icon: "Fuel"
  },
  {
    id: "water",
    title: "Water Treatment",
    titleAr: "\u0645\u0639\u0627\u0644\u062C\u0629 \u0648\u062A\u062D\u0644\u064A\u0629 \u0627\u0644\u0645\u064A\u0627\u0647",
    desc: "Chlorine handling, confined spaces, and sample testing protocols.",
    descAr: "\u0627\u0644\u062A\u0639\u0627\u0645\u0644 \u0627\u0644\u0622\u0645\u0646 \u0645\u0639 \u0628\u0631\u0648\u0645 \u0627\u0644\u0643\u0644\u0648\u0631\u060C \u0627\u0644\u0639\u0645\u0644 \u0641\u064A \u0627\u0644\u0623\u0645\u0627\u0643\u0646 \u0627\u0644\u0645\u063A\u0644\u0642\u0629\u060C \u0648\u0645\u0639\u0627\u064A\u064A\u0631 \u0623\u062E\u0630 \u0627\u0644\u0639\u064A\u0646\u0627\u062A.",
    progress: 0,
    locked: true,
    logoColor: "text-slate-400 bg-slate-100 dark:bg-slate-800 dark:text-slate-500",
    icon: "Droplet"
  },
  {
    id: "food",
    title: "Food Analysis",
    titleAr: "\u0641\u062D\u0635 \u0648\u062A\u062D\u0644\u064A\u0644 \u0627\u0644\u0623\u063A\u0630\u064A\u0629",
    desc: "Cross-contamination prevention, pathogen testing, and hygiene.",
    descAr: "\u0637\u0631\u0642 \u0645\u0646\u0639 \u0627\u0644\u062A\u0644\u0648\u062B \u0627\u0644\u0645\u062A\u0628\u0627\u062F\u0644\u060C \u0627\u062E\u062A\u0628\u0627\u0631 \u0645\u0633\u0628\u0628\u0627\u062A \u0627\u0644\u0623\u0645\u0631\u0627\u0636\u060C \u0648\u0627\u0644\u0646\u0638\u0627\u0641\u0629 \u0627\u0644\u0635\u062D\u064A\u0629 \u0627\u0644\u0645\u0639\u062A\u0645\u062F\u0629.",
    progress: 0,
    locked: true,
    logoColor: "text-slate-400 bg-slate-100 dark:bg-slate-800 dark:text-slate-500",
    icon: "Utensils"
  }
];
function ensureReferencesFile() {
  ensureDataFile();
  if (!import_fs.default.existsSync(REFERENCES_FILE)) {
    import_fs.default.writeFileSync(REFERENCES_FILE, JSON.stringify(DEFAULT_REFERENCES, null, 2), "utf-8");
  }
}
function ensureLabsFile() {
  ensureDataFile();
  if (!import_fs.default.existsSync(LABS_FILE)) {
    import_fs.default.writeFileSync(LABS_FILE, JSON.stringify(DEFAULT_LABS, null, 2), "utf-8");
  }
}
function loadReferences() {
  ensureReferencesFile();
  try {
    const data = import_fs.default.readFileSync(REFERENCES_FILE, "utf-8");
    return JSON.parse(data);
  } catch (e) {
    return DEFAULT_REFERENCES;
  }
}
function saveReferences(refs) {
  ensureReferencesFile();
  const tempPath = `${REFERENCES_FILE}.tmp`;
  try {
    import_fs.default.writeFileSync(tempPath, JSON.stringify(refs, null, 2), "utf-8");
    import_fs.default.renameSync(tempPath, REFERENCES_FILE);
  } catch (err) {
    console.error("Critical failure during references write:", err);
    if (import_fs.default.existsSync(tempPath)) {
      try {
        import_fs.default.unlinkSync(tempPath);
      } catch (_) {
      }
    }
  }
}
function loadLabs() {
  ensureLabsFile();
  try {
    const data = import_fs.default.readFileSync(LABS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (e) {
    return DEFAULT_LABS;
  }
}
function saveLabs(labs) {
  ensureLabsFile();
  const tempPath = `${LABS_FILE}.tmp`;
  try {
    import_fs.default.writeFileSync(tempPath, JSON.stringify(labs, null, 2), "utf-8");
    import_fs.default.renameSync(tempPath, LABS_FILE);
  } catch (err) {
    console.error("Critical failure during labs write:", err);
    if (import_fs.default.existsSync(tempPath)) {
      try {
        import_fs.default.unlinkSync(tempPath);
      } catch (_) {
      }
    }
  }
}
function sanitizeReferencePayload(ref) {
  return {
    id: sanitizeString(ref.id) || `custom-ref-${Date.now()}`,
    title: sanitizeString(ref.title) || "Untitled Reference",
    type: sanitizeString(ref.type) || "SDS",
    description: sanitizeString(ref.description) || "",
    version: sanitizeString(ref.version) || "v1.0",
    date: sanitizeString(ref.date) || "2026",
    internal: !!ref.internal,
    source: sanitizeString(ref.source) || "Internal System",
    downloadable: !!ref.downloadable,
    url: sanitizeString(ref.url) || "",
    pdfUrl: sanitizeString(ref.pdfUrl) || ""
  };
}
function sanitizeLessonPayload(lesson) {
  return {
    id: sanitizeString(lesson.id) || `custom-l-${Date.now()}`,
    title: sanitizeString(lesson.title) || "Untitled Lesson",
    titleAr: sanitizeString(lesson.titleAr) || "\u062F\u0631\u0633 \u063A\u064A\u0631 \u0645\u0639\u0646\u0648\u0646",
    labType: lesson.labType === "microbiology" ? "microbiology" : "chemistry",
    duration: sanitizeString(lesson.duration) || "3 min",
    durationAr: sanitizeString(lesson.durationAr) || "\u0663 \u062F\u0642\u0627\u0626\u0642",
    category: sanitizeString(lesson.category) || "General Safety",
    categoryAr: sanitizeString(lesson.categoryAr) || "\u0627\u0644\u0633\u0644\u0627\u0645\u0629 \u0627\u0644\u0639\u0627\u0645\u0629",
    videoUrl: sanitizeString(lesson.videoUrl) || "",
    objectives: Array.isArray(lesson.objectives) ? lesson.objectives.map(sanitizeString) : ["Understand safety protocol"],
    objectivesAr: Array.isArray(lesson.objectivesAr) ? lesson.objectivesAr.map(sanitizeString) : ["\u0641\u0647\u0645 \u0628\u0631\u0648\u062A\u0648\u0643\u0648\u0644 \u0627\u0644\u0623\u0645\u0627\u0646"],
    citation: sanitizeString(lesson.citation) || "LabSafe Occupational Guidelines",
    citationAr: sanitizeString(lesson.citationAr) || "\u0644\u0648\u0627\u0626\u062D \u0627\u0644\u0633\u0644\u0627\u0645\u0629 \u0645\u0646 \u0644\u0627\u0628\u0633\u064A\u0641",
    warning: {
      title: sanitizeString(lesson.warning?.title) || "Precaution Required",
      titleAr: sanitizeString(lesson.warning?.titleAr) || "\u062A\u0646\u0628\u064A\u0647 \u0647\u0627\u0645 \u0648\u0645\u0637\u0644\u0648\u0628",
      text: sanitizeString(lesson.warning?.text) || "Strictly wear protective gear.",
      textAr: sanitizeString(lesson.warning?.textAr) || "\u064A\u062C\u0628 \u0627\u0631\u062A\u062F\u0627\u0621 \u0633\u0627\u0626\u0631 \u0645\u0639\u062F\u0627\u062A \u0627\u0644\u0648\u0642\u0627\u064A\u0629 \u0645\u0633\u0628\u0642\u0627\u064B \u0628\u0641\u0637\u0646\u0629."
    },
    scenarioId: sanitizeString(lesson.scenarioId) || "scen-chem-1",
    cards: Array.isArray(lesson.cards) ? lesson.cards.map((card) => ({
      title: sanitizeString(card.title) || "Protective Measure",
      titleAr: sanitizeString(card.titleAr) || "\u0625\u062C\u0631\u0627\u0621 \u0648\u0642\u0627\u0626\u064A",
      desc: sanitizeString(card.desc) || "Follow clinical instructions.",
      descAr: sanitizeString(card.descAr) || "\u0627\u062A\u0628\u0639 \u0627\u0644\u0625\u0631\u0634\u0627\u062F\u0627\u062A \u0627\u0644\u0637\u0628\u064A\u0629 \u0628\u062F\u0642\u0629.",
      imageUrl: sanitizeString(card.imageUrl) || "",
      iconType: sanitizeString(card.iconType) || "shield"
    })) : []
  };
}
function loadUsers() {
  ensureDataFile();
  try {
    const data = import_fs.default.readFileSync(USERS_FILE, "utf-8");
    const parsed = JSON.parse(data);
    if (parsed.__proto__ || parsed.constructor || parsed.prototype) {
      return {};
    }
    return parsed;
  } catch (e) {
    return {};
  }
}
function saveUsers(users) {
  ensureDataFile();
  const tempPath = `${USERS_FILE}.tmp`;
  try {
    const safePayload = /* @__PURE__ */ Object.create(null);
    for (const [key, val] of Object.entries(users)) {
      if (key !== "__proto__" && key !== "constructor" && key !== "prototype") {
        safePayload[key] = val;
      }
    }
    import_fs.default.writeFileSync(tempPath, JSON.stringify(safePayload, null, 2), "utf-8");
    import_fs.default.renameSync(tempPath, USERS_FILE);
  } catch (err) {
    console.error("Critical failure when persisting user database atomically:", err);
    if (import_fs.default.existsSync(tempPath)) {
      try {
        import_fs.default.unlinkSync(tempPath);
      } catch (_) {
      }
    }
  }
}
function sanitizeString(val) {
  if (typeof val !== "string") return "";
  return val.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "").substring(0, 500);
}
function isValidEmail(email) {
  if (typeof email !== "string") return false;
  const trimmed = email.toLowerCase().trim();
  if (trimmed.length > 80 || trimmed.length < 5) return false;
  if (trimmed.includes("__proto__") || trimmed.includes("constructor") || trimmed.includes("prototype") || trimmed.includes("..") || trimmed.includes("/") || trimmed.includes("\\")) {
    return false;
  }
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(trimmed);
}
function validateProgressPayload(progress) {
  if (!progress || typeof progress !== "object" || Array.isArray(progress)) return false;
  const allowedKeys = [
    "name",
    "email",
    "avatarUrl",
    "level",
    "xp",
    "xpNextLevel",
    "streakDays",
    "unlockedBadges",
    "labProgress",
    "masteryScores"
  ];
  for (const key of Object.keys(progress)) {
    if (!allowedKeys.includes(key)) return false;
  }
  if (progress.level !== void 0 && typeof progress.level !== "number") return false;
  if (progress.xp !== void 0 && typeof progress.xp !== "number") return false;
  if (progress.xpNextLevel !== void 0 && typeof progress.xpNextLevel !== "number") return false;
  if (progress.streakDays !== void 0 && typeof progress.streakDays !== "number") return false;
  if (progress.name !== void 0 && typeof progress.name !== "string") return false;
  if (progress.avatarUrl !== void 0 && typeof progress.avatarUrl !== "string") return false;
  return true;
}
var RATE_LIMIT_STORE = /* @__PURE__ */ new Map();
var DEFAULT_WINDOW_MS = 60 * 1e3;
function createRateLimiter(maxRequests, windowMs = DEFAULT_WINDOW_MS) {
  return (req, res, next) => {
    const ip = req.headers["x-forwarded-for"] || req.ip || req.socket.remoteAddress || "visitor";
    const now = Date.now();
    const record = RATE_LIMIT_STORE.get(ip);
    if (!record || now > record.resetTime) {
      RATE_LIMIT_STORE.set(ip, { count: 1, resetTime: now + windowMs });
      return next();
    }
    if (record.count >= maxRequests) {
      return res.status(429).json({
        error: "Too many safety operations requested. Emergency rate limiting active. Please try again shortly."
      });
    }
    record.count++;
    next();
  };
}
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.disable("x-powered-by");
  app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src * data: blob: android-webview-video-poster:; media-src * data: blob:; connect-src 'self' https://generativelanguage.googleapis.com; frame-src 'self';");
    next();
  });
  app.use(import_express.default.json({ limit: "30kb" }));
  const authLimiter = createRateLimiter(25);
  const progressLimiter = createRateLimiter(30);
  const chatLimiter = createRateLimiter(20);
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", serverTime: (/* @__PURE__ */ new Date()).toISOString() });
  });
  app.get("/api/lessons", (req, res) => {
    const lessons = loadLessons();
    res.json(lessons);
  });
  app.post("/api/lessons", (req, res) => {
    const { password, lesson } = req.body;
    if (password !== import_process.default.env.ADMIN_PASSWORD) {
      return res.status(403).json({ error: "Unauthorized access: Invalid admin authorization password supplied" });
    }
    if (!lesson) {
      return res.status(400).json({ error: "Missing lesson content payload" });
    }
    const lessons = loadLessons();
    const cleanLesson = sanitizeLessonPayload(lesson);
    const index = lessons.findIndex((l) => l.id === cleanLesson.id);
    if (index !== -1) {
      lessons[index] = cleanLesson;
    } else {
      lessons.push(cleanLesson);
    }
    saveLessons(lessons);
    res.json({ success: true, lesson: cleanLesson });
  });
  app.put("/api/lessons/:id", (req, res) => {
    const { id } = req.params;
    const { password, lesson } = req.body;
    if (password !== import_process.default.env.ADMIN_PASSWORD) {
      return res.status(403).json({ error: "Unauthorized access: Invalid admin authorization password supplied" });
    }
    if (!lesson) {
      return res.status(400).json({ error: "Missing lesson content payload" });
    }
    const lessons = loadLessons();
    const index = lessons.findIndex((l) => l.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Specified lesson ID was not found" });
    }
    const cleanLesson = sanitizeLessonPayload({ ...lesson, id });
    lessons[index] = cleanLesson;
    saveLessons(lessons);
    res.json({ success: true, lesson: cleanLesson });
  });
  app.delete("/api/lessons/:id", (req, res) => {
    const { id } = req.params;
    const { password } = req.body;
    const queryPass = req.query.password;
    if (password !== import_process.default.env.ADMIN_PASSWORD && queryPass !== import_process.default.env.ADMIN_PASSWORD) {
      return res.status(403).json({ error: "Unauthorized access: Invalid admin authorization password supplied" });
    }
    let lessons = loadLessons();
    const initialLength = lessons.length;
    lessons = lessons.filter((l) => l.id !== id);
    if (lessons.length === initialLength) {
      return res.status(404).json({ error: "Specified lesson ID was not found for removal" });
    }
    saveLessons(lessons);
    res.json({ success: true });
  });
  app.get("/api/references", (req, res) => {
    const refs = loadReferences();
    res.json(refs);
  });
  app.post("/api/references", (req, res) => {
    const { password, reference } = req.body;
    if (password !== import_process.default.env.ADMIN_PASSWORD) {
      return res.status(403).json({ error: "Unauthorized access: Invalid admin authorization password supplied" });
    }
    if (!reference) {
      return res.status(400).json({ error: "Missing reference content payload" });
    }
    const refs = loadReferences();
    const cleanRef = sanitizeReferencePayload(reference);
    const index = refs.findIndex((r) => r.id === cleanRef.id);
    if (index !== -1) {
      refs[index] = cleanRef;
    } else {
      refs.push(cleanRef);
    }
    saveReferences(refs);
    res.json({ success: true, reference: cleanRef });
  });
  app.put("/api/references/:id", (req, res) => {
    const { id } = req.params;
    const { password, reference } = req.body;
    if (password !== import_process.default.env.ADMIN_PASSWORD) {
      return res.status(403).json({ error: "Unauthorized access: Invalid admin authorization password supplied" });
    }
    if (!reference) {
      return res.status(400).json({ error: "Missing reference content payload" });
    }
    const refs = loadReferences();
    const index = refs.findIndex((r) => r.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Specified reference ID was not found" });
    }
    const cleanRef = sanitizeReferencePayload({ ...reference, id });
    refs[index] = cleanRef;
    saveReferences(refs);
    res.json({ success: true, reference: cleanRef });
  });
  app.delete("/api/references/:id", (req, res) => {
    const { id } = req.params;
    const { password } = req.body;
    const queryPass = req.query.password;
    if (password !== import_process.default.env.ADMIN_PASSWORD && queryPass !== import_process.default.env.ADMIN_PASSWORD) {
      return res.status(403).json({ error: "Unauthorized access: Invalid admin authorization password supplied" });
    }
    let refs = loadReferences();
    const initialLength = refs.length;
    refs = refs.filter((r) => r.id !== id);
    if (refs.length === initialLength) {
      return res.status(404).json({ error: "Specified reference ID was not found for removal" });
    }
    saveReferences(refs);
    res.json({ success: true });
  });
  app.get("/api/labs", (req, res) => {
    const labs = loadLabs();
    res.json(labs);
  });
  app.put("/api/labs/:id", (req, res) => {
    const { id } = req.params;
    const { password, lab } = req.body;
    if (password !== import_process.default.env.ADMIN_PASSWORD) {
      return res.status(403).json({ error: "Unauthorized: Invalid admin password" });
    }
    if (!lab) {
      return res.status(400).json({ error: "Missing lab payload" });
    }
    const labs = loadLabs();
    const index = labs.findIndex((l) => l.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Specified lab was not found" });
    }
    labs[index] = {
      ...labs[index],
      title: sanitizeString(lab.title) || labs[index].title,
      titleAr: sanitizeString(lab.titleAr) || labs[index].titleAr,
      desc: sanitizeString(lab.desc) || labs[index].desc,
      descAr: sanitizeString(lab.descAr) || labs[index].descAr,
      locked: !!lab.locked
    };
    saveLabs(labs);
    res.json({ success: true, lab: labs[index] });
  });
  app.post("/api/auth/login", authLimiter, (req, res) => {
    const { email, name } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email parameter is required" });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Invalid or format-violating institutional email provided" });
    }
    const normalizedEmail = email.toLowerCase().trim();
    const cleanName = sanitizeString(name);
    const users = loadUsers();
    if (!users[normalizedEmail]) {
      let isGuest = normalizedEmail.includes("guest") || normalizedEmail.startsWith("guest");
      let displayName = cleanName || (isGuest ? "Guest Scientific Peer" : "Ahmed");
      let avatarUrl = isGuest ? "https://lh3.googleusercontent.com/aida-public/AB6AXuAls9rvpA_SW-RJyTOUKgXuDtBbcjXa3wS1rhWR-Ta98OurFIAK-KnBJ_HICXqyMcIjPdW3L54XKKxbuw0D-VjLOAMlZ9j9aMQNDfuqnb_PghryLAKoY9oHWCGXKfanITdF-os0y-MlEReXaf86RjsyvzOWTaqNaeXIqPsDvTkgYRh8XR1gp13tskOF_AHibg7YG_Xeg8Ri3oWfyGFC6N3BxrzS-bDBNgb3tXm6RodhdtYqIEeIAx5tDyIySeRady9Ua41xd4xZKoKs" : DEFAULT_USER_STATE.avatarUrl;
      users[normalizedEmail] = {
        ...DEFAULT_USER_STATE,
        email: normalizedEmail,
        name: displayName,
        avatarUrl
      };
      saveUsers(users);
    }
    res.json(users[normalizedEmail]);
  });
  app.get("/api/user/profile", progressLimiter, (req, res) => {
    const email = req.query.email;
    if (!email) {
      return res.status(400).json({ error: "Email parameter is required" });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Invalid lookup parameter layout" });
    }
    const normalizedEmail = email.toLowerCase().trim();
    const users = loadUsers();
    if (users[normalizedEmail]) {
      res.json(users[normalizedEmail]);
    } else {
      res.status(404).json({ error: "User profile not found" });
    }
  });
  app.post("/api/user/progress", progressLimiter, (req, res) => {
    const { email, progress } = req.body;
    if (!email || !progress) {
      return res.status(400).json({ error: "Missing email or progress fields in payload" });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Invalid looking target format" });
    }
    if (!validateProgressPayload(progress)) {
      return res.status(400).json({ error: "Progress metrics schema violated formatting boundaries" });
    }
    const normalizedEmail = email.toLowerCase().trim();
    const users = loadUsers();
    if (!users[normalizedEmail]) {
      return res.status(404).json({ error: "No profile found for specified email, please login first" });
    }
    const cleanName = sanitizeString(progress.name || users[normalizedEmail].name);
    const cleanAvatar = sanitizeString(progress.avatarUrl || users[normalizedEmail].avatarUrl);
    users[normalizedEmail] = {
      ...users[normalizedEmail],
      ...progress,
      name: cleanName,
      avatarUrl: cleanAvatar,
      email: normalizedEmail
      // Keep email safe and verified
    };
    saveUsers(users);
    res.json({ success: true, user: users[normalizedEmail] });
  });
  app.post("/api/assistant/chat", chatLimiter, async (req, res) => {
    const { message, history, apiKey } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message field is required" });
    }
    const cleanInput = sanitizeString(message);
    if (!cleanInput) {
      return res.status(400).json({ error: "Safety query contains blacklisted characters or is empty" });
    }
    const queryText = cleanInput.toLowerCase().trim();
    const hasArabic = /[\u0600-\u06FF]/.test(cleanInput);
    const systemInstruction = `You are "Dr. Safety", the expert Clinical Safety Officer advising scientific peers on the LabSafe platform (\u0645\u0646\u0635\u0629 \u0644\u0627\u0628\u0633\u064A\u0641 \u0644\u0644\u0633\u0644\u0627\u0645\u0629 \u0627\u0644\u0645\u062E\u062A\u0628\u0631\u064A\u0629 \u0648\u0627\u0644\u0637\u0628\u064A\u0629).
    Your expertise spans laboratory biosafety, proper Personal Protective Equipment (PPE) handling, hazardous acid spill controls, SDS evaluation, sterilisation processes, and clinical laboratory standards.
    Provide clear, structured, and friendly instructions.
    If the researcher asks in Arabic, reply in professional, helpful Arabic. If in English, reply in English.
    Structure your answers beautifully using markdown lists, bold terms, and advice bullets where helpful. Avoid talking about code files or system configs. Stick purely to realistic scientific safety procedures.`;
    const activeApiKey = apiKey || import_process.default.env.GEMINI_API_KEY;
    try {
      if (!activeApiKey) {
        throw new Error("No API key provided locally or globally");
      }
      const dynamicClient = new import_genai.GoogleGenAI({
        apiKey: activeApiKey,
        httpOptions: {
          headers: { "User-Agent": "aistudio-build" }
        }
      });
      console.log("Dr. Safety: Dispatching payload to primary model using active key...");
      const response = await dynamicClient.models.generateContent({
        model: "gemini-2.5-flash",
        // الموديل المستقر الفعال للـ SDK الجديدة
        contents: [
          ...(history || []).slice(-10).map((msg) => ({
            role: msg.role === "model" ? "model" : "user",
            parts: [{ text: msg.parts[0].text }]
          })),
          { role: "user", parts: [{ text: cleanInput }] }
        ],
        config: {
          systemInstruction,
          temperature: 0.7
        }
      });
      return res.json({ text: response.text });
    } catch (primaryErr) {
      console.warn("Primary AI call failed, trying backup routine or serving local procedural text...", primaryErr.message || primaryErr);
      let fallbackText = "";
      if (hasArabic) {
        if (queryText.includes("\u062D\u0645\u0636") || queryText.includes("\u0623\u062D\u0645\u0627\u0636") || queryText.includes("\u0647\u064A\u062F\u0631\u0648\u0643\u0644\u0648\u0631\u064A\u0643") || queryText.includes("acid")) {
          fallbackText = `**[\u0625\u0631\u0634\u0627\u062F \u0637\u0648\u0627\u0631\u0626 \u062F. \u0644\u0627\u0628\u0633\u064A\u0641 (\u0648\u0636\u0639 \u0627\u0644\u0627\u062D\u062A\u064A\u0627\u0637\u064A)]**

\u064A\u0648\u0627\u062C\u0647 \u0627\u0644\u0645\u0644\u0642\u0651\u0645 \u0636\u063A\u0637\u0627\u064B \u0645\u0624\u0642\u062A\u0627\u064B\u060C \u0648\u0644\u0643\u0646 \u0625\u0644\u064A\u0643 \u0627\u0644\u0628\u0631\u0648\u062A\u0648\u0643\u0648\u0644 \u0627\u0644\u0635\u062D\u064A\u062D \u0648\u0627\u0644\u0622\u0645\u0646 \u0644\u0644\u062A\u0639\u0627\u0645\u0644 \u0645\u0639 \u0627\u0644\u0623\u062D\u0645\u0627\u0636 \u0627\u0644\u0642\u0648\u064A\u0629 (\u0645\u062B\u0644 \u062D\u0645\u0636 \u0627\u0644\u0647\u064A\u062F\u0631\u0648\u0643\u0644\u0648\u0631\u064A\u0643 HCl 37%):

1. **\u0623\u062F\u0648\u0627\u062A \u0627\u0644\u0648\u0642\u0627\u064A\u0629 \u0627\u0644\u0634\u062E\u0635\u064A\u0629 (PPE)**:
   - \u064A\u062C\u0628 \u0627\u0631\u062A\u062F\u0627\u0621 \u0642\u0641\u0627\u0632\u0627\u062A \u0645\u0642\u0627\u0648\u0645\u0629 \u0644\u0644\u0645\u0648\u0627\u062F \u0627\u0644\u0643\u064A\u0645\u064A\u0627\u0626\u064A\u0629 (\u0646\u0648\u0635\u064A \u0628\u0640 \u0642\u0641\u0627\u0632\u064A\u0646 \u0645\u0632\u062F\u0648\u062C\u064A\u0646 \u0644\u062A\u0642\u0644\u064A\u0644 \u0627\u0644\u0646\u0641\u0627\u0630\u064A\u0629 \u0643\u0644\u064A\u0627\u064B).
   - \u0645\u0639\u0637\u0641 \u0645\u062E\u062A\u0628\u0631 (\u0645\u0631\u064A\u0644\u0629 \u0645\u0642\u0627\u0648\u0645\u0629 \u0644\u0644\u0623\u0643\u0627\u0644\u0629) \u0648\u0646\u0638\u0627\u0631\u0627\u062A \u0623\u0645\u0627\u0646 \u0645\u062E\u0635\u0635\u0629 \u0644\u0644\u0623\u062D\u0645\u0627\u0636.
2. **\u0627\u0644\u0636\u0648\u0627\u0628\u0637 \u0627\u0644\u0647\u0646\u062F\u0633\u064A\u0629**:
   - **\u064A\u062C\u0628 \u062F\u0627\u0626\u0645\u0627\u064B** \u0645\u0639\u0627\u0644\u062C\u0629 \u0627\u0644\u0623\u062D\u0645\u0627\u0636 \u0627\u0644\u0645\u0631\u0643\u0632\u0629 \u062F\u0627\u062E\u0644 \u062E\u0632\u0627\u0646\u0629 \u0623\u0628\u062E\u0631\u0629 \u0645\u0639\u0645\u0644\u064A\u0629 \u0645\u0639\u062A\u0645\u062F\u0629 (Fume Hood)\u061B \u0644\u0627 \u062A\u0642\u0645 \u0628\u0641\u062A\u062D\u0647\u0627 \u0623\u0628\u062F\u0627\u064B \u0639\u0644\u0649 \u0645\u0646\u0636\u062F\u0629 \u0645\u0643\u0634\u0648\u0641\u0629 \u0644\u0636\u0645\u0627\u0646 \u0639\u0632\u0644 \u0627\u0644\u0623\u0628\u062E\u0631\u0629 \u0627\u0644\u0643\u0627\u0648\u064A\u0629.
3. **\u0627\u0644\u0642\u0627\u0639\u062F\u0629 \u0627\u0644\u0630\u0647\u0628\u064A\u0629 \u0644\u062A\u062E\u0641\u064A\u0641 \u0627\u0644\u0623\u062D\u0645\u0627\u0636**:
   - **\u0623\u0636\u0641 \u0627\u0644\u062D\u0645\u0636 \u0625\u0644\u0649 \u0627\u0644\u0645\u0627\u0621 \u062F\u0627\u0626\u0645\u0627\u064B** (A&W - Always Add Acid to Water) \u0648\u0644\u064A\u0633 \u0627\u0644\u0639\u0643\u0633! \u0644\u0644\u062D\u064A\u0644\u0648\u0644\u0629 \u062F\u0648\u0646 \u062A\u0641\u0627\u0639\u0644 \u0625\u0637\u0644\u0627\u0642 \u0627\u0644\u062D\u0631\u0627\u0631\u0629 \u0627\u0644\u0645\u0641\u0627\u062C\u0626 \u0648\u063A\u0644\u064A\u0627\u0646 \u0648\u0627\u0631\u062A\u062F\u0627\u062F \u0627\u0644\u0633\u0627\u0626\u0644 \u0627\u0644\u0643\u064A\u0645\u064A\u0627\u0626\u064A \u0627\u0644\u062D\u0627\u0631\u0642.`;
        } else if (queryText.includes("\u0628\u064A\u0648\u0644\u0648\u062C\u064A") || queryText.includes("\u0627\u0646\u0633\u0643\u0627\u0628") || queryText.includes("\u0627\u0646\u0633\u0628\u0627\u0643") || queryText.includes("bsl") || queryText.includes("spill")) {
          fallbackText = `**[\u0625\u0631\u0634\u0627\u062F \u0637\u0648\u0627\u0631\u0626 \u062F. \u0644\u0627\u0628\u0633\u064A\u0641 (\u0648\u0636\u0639 \u0627\u0644\u0627\u062D\u062A\u064A\u0627\u0637\u064A)]**

\u064A\u0648\u0627\u062C\u0647 \u0627\u0644\u0645\u0644\u0642\u0651\u0645 \u0636\u063A\u0637\u0627\u064B \u0645\u0624\u0642\u062A\u0627\u064B\u060C \u0648\u0644\u0643\u0646 \u0625\u0644\u064A\u0643 \u0628\u0631\u0648\u062A\u0648\u0643\u0648\u0644 \u0645\u0639\u0627\u0644\u062C\u0629 \u0627\u0644\u0627\u0646\u0633\u0643\u0627\u0628\u0627\u062A \u0627\u0644\u0628\u064A\u0648\u0644\u0648\u062C\u064A\u0629 \u0645\u0646 \u0627\u0644\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u062B\u0627\u0646\u064A BSL-2:

1. **\u0627\u0644\u0625\u062E\u0644\u0627\u0621 \u0627\u0644\u0641\u0648\u0631\u064A \u0648\u0627\u0644\u062A\u0631\u0633\u064A\u0628**:
   - \u0642\u0645 \u0628\u062A\u0646\u0628\u064A\u0647 \u062C\u0645\u064A\u0639 \u0627\u0644\u0632\u0645\u0644\u0627\u0621 \u0641\u064A \u0627\u0644\u0645\u0639\u0645\u0644 \u0648\u0625\u062E\u0644\u0627\u0621 \u0627\u0644\u0645\u0643\u0627\u0646 \u0641\u0648\u0631\u0627\u064B \u0648\u0625\u063A\u0644\u0627\u0642 \u0627\u0644\u0628\u0627\u0628.
   - \u0627\u0646\u062A\u0638\u0631 \u0645\u0646 20 \u0625\u0644\u0649 30 \u062F\u0642\u064A\u0642\u0629 \u0644\u0648\u0642\u0641 \u0633\u064A\u0644 \u0627\u0644\u0647\u0648\u0627\u0621 \u0648\u0644\u0644\u0633\u0645\u0627\u062D \u0644\u0644\u0631\u0630\u0627\u0630 \u0627\u0644\u0645\u0639\u0644\u0642 (Aerosols) \u0628\u0627\u0644\u0627\u0633\u062A\u0642\u0631\u0627\u0631 \u0648\u0627\u0644\u062A\u0631\u0633\u064A\u0628 \u0627\u0644\u0643\u0627\u0645\u0644.
2. **\u0627\u0644\u0627\u0633\u062A\u0639\u062F\u0627\u062F \u0648\u0627\u0644\u0648\u0642\u0627\u064A\u0629**:
   - \u0642\u0628\u0644 \u0627\u0644\u0639\u0648\u062F\u0629 \u0644\u0644\u062A\u0637\u0647\u064A\u0631\u060C \u0627\u0631\u062A\u062F\u0650 \u0645\u0639\u0637\u0641\u0627\u064B \u0646\u0638\u064A\u0641\u0627\u064B \u0648\u0642\u0645\u0627\u0634 \u0623\u0645\u0627\u0646 \u0645\u062A\u0637\u0627\u0628\u0642\u0642\u0641\u0627\u0632\u0627\u062A \u0645\u0632\u062F\u0648\u062C\u0629 \u0645\u0639 \u0646\u0638\u0627\u0631\u0627\u062A \u0648\u0627\u0642\u064A\u0629 \u0645\u062A\u0642\u0646\u0629 \u0627\u0644\u0625\u062D\u0643\u0627\u0645.
3. **\u0627\u0644\u062A\u0637\u0647\u064A\u0631 \u0648\u0627\u0644\u062A\u0646\u0638\u064A\u0641**:
   - \u063A\u0637\u0651 \u0645\u0646\u0637\u0642\u0629 \u0627\u0644\u0627\u0646\u0633\u0643\u0627\u0628 \u0628\u0627\u0644\u0643\u0627\u0645\u0644 \u0628\u0645\u0646\u0627\u0634\u0641 \u0648\u0631\u0642\u064A\u0629 \u0643\u0627\u0641\u064A\u0629 \u0644\u0627\u0645\u062A\u0635\u0627\u0635 \u0627\u0644\u0645\u0627\u062F\u0629 \u0627\u0644\u0645\u0633\u0643\u0648\u0628\u0629.
   - \u0635\u0628\u0651 \u0645\u0639\u0642\u0645 \u0645\u0646\u0627\u0633\u0628 (\u0645\u062B\u0644 \u0627\u0644\u0643\u0644\u0648\u0631 \u0627\u0644\u0645\u0646\u0632\u0644\u064A \u0627\u0644\u0645\u062E\u0641\u0641 \u062D\u062F\u064A\u062B\u0627\u064B \u0628\u0646\u0633\u0628\u0629 10\u066A) \u0628\u0644\u0637\u0641 \u062D\u0648\u0644 \u0648\u0641\u0648\u0642 \u0627\u0644\u0645\u0646\u0627\u0634\u0641 \u0627\u0644\u0645\u0627\u0635\u0629 \u0644\u062A\u0641\u0627\u062F\u064A \u0625\u062B\u0627\u0631\u0629 \u0631\u0630\u0627\u0630 \u062C\u062F\u064A\u062F.
   - \u0627\u062A\u0631\u0643 \u0627\u0644\u0645\u0639\u0642\u0645 \u0644\u0644\u062A\u0641\u0627\u0639\u0644 \u0644\u0645\u062F\u0629 20 \u062F\u0642\u064A\u0642\u0629 \u0639\u0644\u0649 \u0627\u0644\u0623\u0642\u0644.
   - \u0636\u0639 \u0645\u062E\u0644\u0641\u0627\u062A \u0627\u0644\u062A\u0646\u0638\u064A\u0641 \u0641\u064A \u0623\u0643\u064A\u0627\u0633 \u0627\u0644\u0646\u0641\u0627\u064A\u0627\u062A \u0627\u0644\u0628\u064A\u0648\u0644\u0648\u062C\u064A\u0629 (Biohazard Bags) \u0644\u062A\u0639\u0642\u064A\u0645\u0647\u0627 \u0628\u0627\u0644\u0628\u062E\u0627\u0631 \u0644\u0627\u062D\u0642\u0627\u064B (Autoclave).`;
        } else if (queryText.includes("\u0639\u064A\u0646") || queryText.includes("\u0648\u062C\u0647") || queryText.includes("\u062F\u0631\u0639") || queryText.includes("\u0646\u0638\u0627\u0631") || queryText.includes("goggle") || queryText.includes("shield")) {
          fallbackText = `**[\u0625\u0631\u0634\u0627\u062F \u0637\u0648\u0627\u0631\u0626 \u062F. \u0644\u0627\u0628\u0633\u064A\u0641 (\u0648\u0636\u0639 \u0627\u0644\u0627\u062D\u062A\u064A\u0627\u0637\u064A)]**

\u064A\u0648\u0627\u062C\u0647 \u0627\u0644\u0645\u0644\u0642\u0651\u0645 \u0636\u063A\u0637\u0627\u064B \u0645\u0624\u0642\u062A\u0627\u064B\u060C \u0648\u0644\u0643\u0646 \u0625\u0644\u064A\u0643 \u0627\u0644\u0641\u0631\u0648\u0642\u0627\u062A \u0627\u0644\u0645\u0639\u062A\u0645\u062F\u0629 \u0644\u062D\u0645\u0627\u064A\u0629 \u0627\u0644\u0639\u064A\u0646 \u0648\u0627\u0644\u0648\u062C\u0647 \u0641\u064A \u0627\u0644\u0645\u062E\u062A\u0628\u0631:

1. **\u0646\u0638\u0627\u0631\u0627\u062A \u0627\u0644\u0623\u0645\u0627\u0646 \u0627\u0644\u0645\u063A\u0644\u0642\u0629 (Safety Goggles)**:
   - \u062A\u0648\u0641\u0631 \u0625\u062D\u0643\u0627\u0645\u0627\u064B \u0643\u0627\u0645\u0644\u0627\u064B \u0628\u0646\u0633\u0628\u0629 360 \u062F\u0631\u062C\u0629 \u062D\u0648\u0644 \u0627\u0644\u0639\u064A\u0646\u064A\u0646 \u0644\u0645\u0646\u0639 \u0648\u0635\u0648\u0644 \u0627\u0644\u0631\u0630\u0627\u0630 \u0627\u0644\u0645\u062A\u0637\u0627\u064A\u0631 \u0623\u0648 \u0627\u0644\u0623\u0628\u062E\u0631\u0629 \u0627\u0644\u0643\u064A\u0645\u064A\u0627\u0626\u064A\u0629 \u0627\u0644\u0646\u0627\u0641\u0630\u0629\u060C \u0648\u062A\u0639\u062A\u0628\u0631 \u0627\u0644\u0641\u0631\u0636 \u0627\u0644\u0623\u0633\u0627\u0633\u064A \u0623\u062B\u0646\u0627\u0621 \u0627\u0644\u062A\u062C\u0627\u0631\u0628.
2. **\u062F\u0631\u0639 \u0627\u0644\u0648\u062C\u0647 \u0627\u0644\u0643\u0627\u0645\u0644 (Full Face Shield)**:
   - \u064A\u062D\u0645\u064A \u0643\u0627\u0645\u0644 \u0645\u0644\u0627\u0645\u062D \u0627\u0644\u0648\u062C\u0647 \u0648\u0627\u0644\u0631\u0642\u0628\u0629 \u0645\u0646 \u0627\u0644\u0623\u062C\u0633\u0627\u0645 \u0627\u0644\u0645\u062A\u0637\u0627\u064A\u0631\u0629 \u0627\u0644\u0642\u0648\u064A\u0629 \u0623\u0648 \u0627\u0644\u0627\u0646\u0633\u0643\u0627\u0628\u0627\u062A \u0627\u0644\u0641\u0648\u0631\u064A\u0629 \u0627\u0644\u0636\u062E\u0645\u0629 (\u0645\u062B\u0644 \u0627\u0644\u0646\u064A\u062A\u0631\u0648\u062C\u064A\u0646 \u0627\u0644\u0645\u062E\u0632\u0646 \u0623\u0648 \u0627\u0644\u0633\u0648\u0627\u0626\u0644 \u0627\u0644\u0645\u063A\u0644\u0648\u064A\u0629).
   - **\u062A\u0646\u0628\u064A\u0647 \u0647\u0627\u0645**: \u062F\u0631\u0639 \u0627\u0644\u0648\u062C\u0647 \u0644\u0627 \u064A\u063A\u0646\u064A \u0639\u0646 \u0646\u0638\u0627\u0631\u0627\u062A \u0627\u0644\u0633\u0644\u0627\u0645\u0629 \u0628\u0623\u064A \u062D\u0627\u0644\u060C \u0628\u0644 \u064A\u062C\u0628 \u0627\u0631\u062A\u062F\u0627\u0624\u0647\u0645\u0627 \u0645\u0639\u0627\u064B \u0644\u0636\u0645\u0627\u0646 \u0639\u062F\u0645 \u062A\u0633\u0644\u0644 \u0627\u0644\u0633\u0648\u0627\u0626\u0644 \u0645\u0646 \u0627\u0644\u062D\u0648\u0627\u0641 \u0627\u0644\u062C\u0627\u0646\u0628\u064A\u0629.`;
        } else {
          fallbackText = `**[\u0627\u0633\u062A\u0634\u0627\u0631\u0627\u062A \u0627\u0644\u062F\u0643\u062A\u0648\u0631 \u0644\u0627\u0628\u0633\u064A\u0641 (\u0648\u0636\u0639 \u0627\u0644\u0627\u062D\u062A\u064A\u0627\u0637\u064A \u0644\u0644\u0623\u0645\u0627\u0646)]**

\u064A\u0648\u0627\u062C\u0647 \u062E\u0627\u062F\u0645 \u0645\u0639\u0627\u0644\u062C\u0629 \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A \u0636\u063A\u0637\u0627\u064B \u0639\u0627\u0644\u064A\u0627\u064B \u0645\u0624\u0642\u062A\u0627\u064B. \u0644\u0645\u0633\u0627\u0639\u062F\u062A\u0643 \u0627\u0644\u0645\u0628\u0627\u0634\u0631\u0629 \u0628\u0628\u0631\u0648\u062A\u0648\u0643\u0648\u0644\u0627\u062A \u0627\u0644\u0623\u0645\u0627\u0646 \u0627\u0644\u0645\u062E\u062A\u0628\u0631\u064A\u0629 \u0627\u0644\u0623\u0647\u0645:

- **\u0623\u062F\u0648\u0627\u062A \u0627\u0644\u0648\u0642\u0627\u064A\u0629**: \u062A\u0623\u0643\u062F \u062F\u0627\u0626\u0645\u0627\u064B \u0645\u0646 \u0627\u0631\u062A\u062F\u0627\u0621 \u0645\u0639\u0637\u0641 \u0627\u0644\u0645\u062E\u062A\u0628\u0631 \u0627\u0644\u0623\u0628\u064A\u0636\u060C \u0627\u0644\u0642\u0641\u0627\u0632\u0627\u062A \u0627\u0644\u0645\u0646\u0627\u0633\u0628\u0629\u060C \u0648\u0627\u0644\u062D\u0630\u0627\u0621 \u0627\u0644\u0645\u063A\u0644\u0642 \u062A\u0645\u0627\u0645\u0627\u064B \u0642\u0628\u0644 \u0627\u0644\u062F\u062E\u0648\u0644.
- **\u0639\u0644\u0627\u0645\u0627\u062A \u0627\u0644\u0637\u0648\u0627\u0631\u0626 \u0648\u0627\u0644\u0625\u0646\u0642\u0627\u0630**: \u062D\u062F\u062F \u0645\u0648\u0642\u0639 \u062F\u0634 \u0627\u0644\u0637\u0648\u0627\u0631\u0626 \u0648\u0645\u062D\u0637\u0629 \u063A\u0633\u064A\u0644 \u0627\u0644\u0639\u064A\u0648\u0646 \u0627\u0644\u0623\u0642\u0631\u0628 \u0625\u0644\u064A\u0643.
- **\u0635\u062D\u064A\u0641\u0629 \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0633\u0644\u0627\u0645\u0629 (SDS)**: \u0631\u0627\u062C\u0639 \u062F\u0627\u0626\u0645\u0627\u064B \u0627\u0644\u0623\u0642\u0633\u0627\u0645 \u0631\u0642\u0645 4 \u0644\u0644\u0625\u0633\u0639\u0627\u0641 \u0627\u0644\u0623\u0648\u0644\u064A \u0648\u0627\u0644\u0642\u0633\u0645 \u0631\u0642\u0645 8 \u0644\u0645\u0633\u062A\u0648\u064A\u0627\u062A \u0627\u0644\u062A\u0639\u0631\u0636 \u0648\u0627\u0644\u062A\u062D\u0643\u0645 \u0627\u0644\u0643\u064A\u0645\u064A\u0627\u0626\u064A.

*\u064A\u0631\u062C\u0649 \u062A\u062D\u062F\u064A\u062F \u0627\u0644\u0645\u0627\u062F\u0629 \u0623\u0648 \u0627\u0644\u062D\u0627\u0644\u0629 \u0627\u0644\u0645\u062E\u062A\u0628\u0631\u064A\u0629 \u0628\u062F\u0642\u0629 \u0644\u0645\u0633\u0627\u0639\u062F\u062A\u0643 \u0628\u0627\u0644\u0628\u0631\u0648\u062A\u0648\u0643\u0648\u0644 \u0627\u0644\u0645\u0642\u0646\u0646 \u0641\u0648\u0631 \u0639\u0648\u062F\u0629 \u0627\u0644\u062E\u062F\u0645\u0629 \u0628\u0627\u0644\u0643\u0627\u0645\u0644!*`;
        }
      } else {
        if (queryText.includes("acid") || queryText.includes("hydrochloric") || queryText.includes("hcl") || queryText.includes("chemical")) {
          fallbackText = `**[Dr. Safety Advisory (Backup Procedural Guidelines)]**

The main AI model is currently under high demand, but here is the official safety protocol for handling strong/concentrated acids (such as 37% Hydrochloric Acid):

1. **Personal Protective Equipment (PPE)**:
   - Must wear chemical-resistant nitrile or neoprene gloves (double-gloving recommended for concentrated HCl).
   - Standard lab coat + splash safety goggles.
2. **Engineering Controls**:
   - **Always** handle concentrated acids inside a certified, fully functional laboratory fume hood.
3. **Safe Practices**:
   - **ADD ACID TO WATER** (A&W - Always Remember): Never add water to concentrated acid to prevent violent splashing projection.`;
        } else if (queryText.includes("bsl") || queryText.includes("spill") || queryText.includes("bio") || queryText.includes("containment")) {
          fallbackText = `**[Dr. Safety Advisory (Backup Procedural Guidelines)]**

The main AI model is currently under high demand, but here is the standard protocol for containment and cleanup of a Biological Safety Level 2 (BSL-2) spill:

1. **Immediate Action**:
   - Alert all lab personnel in the area, evacuate the room immediately, and close the door.
2. **Decontamination Protocol**:
   - Cover the spill area with absorbent paper towels.
   - Pour 10% freshly prepared sodium hypochlorite/bleach gently over the towels and wait 20 minutes.
   - Gather materials into a bio-hazard autoclave bag.`;
        } else {
          fallbackText = `**[Dr. Safety Advisor (Backup Safety Mode)]**

I am currently operating in Backup Safety Mode due to heavy load on Google's model servers. To assist you immediately, here are critical general safety protocols:

- **PPE Enforcement**: Never enter active workspaces without wearing closed-toe shoes, lab coats, and protective gloves.
- **Emergency Station Awareness**: Identify the nearest eyewash station and safety shower.

*What specific scenario or substance were you inquiring about? Let me know so I can highlight the right safety protocols!*`;
        }
      }
      return res.json({ text: fallbackText, isFallbackBackup: true });
    }
  });
  if (import_process.default.env.NODE_ENV !== "production") {
    console.log("Starting full-stack dev server in Vite-middleware integration mode.");
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving static production assets from dist directory.");
    const distPath = import_path.default.join(import_process.default.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`LabSafe Full-Stack Server listening at http://0.0.0.0:${PORT}`);
  });
}
startServer().catch((err) => {
  console.error("Critical failure during full-stack startup sequence:", err);
});
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
//# sourceMappingURL=server.cjs.map
