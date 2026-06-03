/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import process from 'process';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

// In-memory/File-based persistence for full-stack user profiles
const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const LESSONS_FILE = path.join(DATA_DIR, 'lessons.json');
const REFERENCES_FILE = path.join(DATA_DIR, 'references.json');
const LABS_FILE = path.join(DATA_DIR, 'labs.json');

const DEFAULT_USER_STATE = {
  name: "Enas",
  email: "researcher@lab.edu",
  avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuD6euUAWlt1RsMrfsRcQda9gz81u9sLRIg5XP2asY72Faa30V_7WqI63NP5ASbqTSUYI5IGTsM4rnjVk44lu3Jjqe_RW-0lLRGLC3M7h73UXLYnFyQP3hIYKHbl8dRmPx_3W9ZeWDRhDGLhQ7sSrX4OM9xQTJPjkbm36tt7eTY_CORPnnNGSDDTh-NS-iK3Zd6kupfngOvvkiS0N7DQ4hEkTzmJ4Xj7C3io3CYU6wT3jvBLhdxNlhrOIt6WWeYmKlpMIULJbFKVAjrF",
  level: 14,
  xp: 850,
  xpNextLevel: 1000,
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
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify({}), 'utf-8');
  }
}

function ensureLessonsFile() {
  ensureDataFile();
  if (!fs.existsSync(LESSONS_FILE)) {
    fs.writeFileSync(LESSONS_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

function loadLessons(): any[] {
  ensureLessonsFile();
  try {
    const data = fs.readFileSync(LESSONS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

function saveLessons(lessons: any[]) {
  ensureLessonsFile();
  const tempPath = `${LESSONS_FILE}.tmp`;
  try {
    fs.writeFileSync(tempPath, JSON.stringify(lessons, null, 2), 'utf-8');
    fs.renameSync(tempPath, LESSONS_FILE);
  } catch (err) {
    console.error("Critical failure when persisting lessons database:", err);
    if (fs.existsSync(tempPath)) {
      try { fs.unlinkSync(tempPath); } catch (_) {}
    }
  }
}

const DEFAULT_REFERENCES = [
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
    description: "Authorized CDC/IC guidelines defining wet saturated autoclave thermodynamic parameters, sterile steam exposures (121°C/15 PSI), and biological indicator spore controls.",
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

const DEFAULT_LABS = [
  {
    id: "chemistry",
    title: "Chemistry Lab",
    titleAr: "مختبر الكيمياء",
    desc: "Chemical interaction, emergency spill containment, and fume hood air calibration protocols.",
    descAr: "التعامل الكيميائي المعقد، والوقاية من الانسبابات، ومعايرة كبائن سحب الغازات السامة.",
    progress: 33,
    locked: false,
    logoColor: "text-blue-650 bg-blue-50 dark:bg-blue-900/20",
    icon: "FlaskConical"
  },
  {
    id: "microbiology",
    title: "Microbiology Lab",
    titleAr: "مختبر الأحياء الدقيقة",
    desc: "Biosafety barrier levels (BSL-1 to 4), pressure autoclave, and aseptic validation controls.",
    descAr: "مستويات الأمان الحيوي الأربعة، والتعقيم البخاري الموصد بالضغط والتحقق الميكروبي.",
    progress: 0,
    locked: false,
    logoColor: "text-teal-600 bg-teal-50 dark:bg-teal-900/20",
    icon: "Microscope"
  },
  {
    id: "petroleum",
    title: "Oil & Petroleum",
    titleAr: "النفط والغاز والبترول",
    desc: "Flammability hazards, toxic gas exposure, and rig safety.",
    descAr: "مخاطر الاحتراق، والغازات السامة، وقواعد السلامة في الحقول والمنصات النفطية.",
    progress: 0,
    locked: true,
    logoColor: "text-slate-400 bg-slate-100 dark:bg-slate-800 dark:text-slate-500",
    icon: "Fuel"
  },
  {
    id: "water",
    title: "Water Treatment",
    titleAr: "معالجة وتحلية المياه",
    desc: "Chlorine handling, confined spaces, and sample testing protocols.",
    descAr: "التعامل الآمن مع بروم الكلور، العمل في الأماكن المغلقة، ومعايير أخذ العينات.",
    progress: 0,
    locked: true,
    logoColor: "text-slate-400 bg-slate-100 dark:bg-slate-800 dark:text-slate-500",
    icon: "Droplet"
  },
  {
    id: "food",
    title: "Food Analysis",
    titleAr: "فحص وتحليل الأغذية",
    desc: "Cross-contamination prevention, pathogen testing, and hygiene.",
    descAr: "طرق منع التلوث المتبادل، اختبار مسببات الأمراض، والنظافة الصحية المعتمدة.",
    progress: 0,
    locked: true,
    logoColor: "text-slate-400 bg-slate-100 dark:bg-slate-800 dark:text-slate-500",
    icon: "Utensils"
  }
];

function ensureReferencesFile() {
  ensureDataFile();
  if (!fs.existsSync(REFERENCES_FILE)) {
    fs.writeFileSync(REFERENCES_FILE, JSON.stringify(DEFAULT_REFERENCES, null, 2), 'utf-8');
  }
}

function ensureLabsFile() {
  ensureDataFile();
  if (!fs.existsSync(LABS_FILE)) {
    fs.writeFileSync(LABS_FILE, JSON.stringify(DEFAULT_LABS, null, 2), 'utf-8');
  }
}

function loadReferences(): any[] {
  ensureReferencesFile();
  try {
    const data = fs.readFileSync(REFERENCES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    return DEFAULT_REFERENCES;
  }
}

function saveReferences(refs: any[]) {
  ensureReferencesFile();
  const tempPath = `${REFERENCES_FILE}.tmp`;
  try {
    fs.writeFileSync(tempPath, JSON.stringify(refs, null, 2), 'utf-8');
    fs.renameSync(tempPath, REFERENCES_FILE);
  } catch (err) {
    console.error("Critical failure during references write:", err);
    if (fs.existsSync(tempPath)) {
      try { fs.unlinkSync(tempPath); } catch (_) {}
    }
  }
}

function loadLabs(): any[] {
  ensureLabsFile();
  try {
    const data = fs.readFileSync(LABS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    return DEFAULT_LABS;
  }
}

function saveLabs(labs: any[]) {
  ensureLabsFile();
  const tempPath = `${LABS_FILE}.tmp`;
  try {
    fs.writeFileSync(tempPath, JSON.stringify(labs, null, 2), 'utf-8');
    fs.renameSync(tempPath, LABS_FILE);
  } catch (err) {
    console.error("Critical failure during labs write:", err);
    if (fs.existsSync(tempPath)) {
      try { fs.unlinkSync(tempPath); } catch (_) {}
    }
  }
}

function sanitizeReferencePayload(ref: any) {
  return {
    id: sanitizeString(ref.id) || `custom-ref-${Date.now()}`,
    title: sanitizeString(ref.title) || 'Untitled Reference',
    type: sanitizeString(ref.type) || 'SDS',
    description: sanitizeString(ref.description) || '',
    version: sanitizeString(ref.version) || 'v1.0',
    date: sanitizeString(ref.date) || '2026',
    internal: !!ref.internal,
    source: sanitizeString(ref.source) || 'Internal System',
    downloadable: !!ref.downloadable,
    url: sanitizeString(ref.url) || '',
    pdfUrl: sanitizeString(ref.pdfUrl) || ''
  };
}

function sanitizeLessonPayload(lesson: any) {
  return {
    id: sanitizeString(lesson.id) || `custom-l-${Date.now()}`,
    title: sanitizeString(lesson.title) || 'Untitled Lesson',
    titleAr: sanitizeString(lesson.titleAr) || 'درس غير معنون',
    labType: (lesson.labType === 'microbiology' ? 'microbiology' : 'chemistry'),
    duration: sanitizeString(lesson.duration) || '3 min',
    durationAr: sanitizeString(lesson.durationAr) || '٣ دقائق',
    category: sanitizeString(lesson.category) || 'General Safety',
    categoryAr: sanitizeString(lesson.categoryAr) || 'السلامة العامة',
    videoUrl: sanitizeString(lesson.videoUrl) || '',
    objectives: Array.isArray(lesson.objectives) ? lesson.objectives.map(sanitizeString) : ['Understand safety protocol'],
    objectivesAr: Array.isArray(lesson.objectivesAr) ? lesson.objectivesAr.map(sanitizeString) : ['فهم بروتوكول الأمان'],
    citation: sanitizeString(lesson.citation) || 'LabSafe Occupational Guidelines',
    citationAr: sanitizeString(lesson.citationAr) || 'لوائح السلامة من لابسيف',
    warning: {
      title: sanitizeString(lesson.warning?.title) || 'Precaution Required',
      titleAr: sanitizeString(lesson.warning?.titleAr) || 'تنبيه هام ومطلوب',
      text: sanitizeString(lesson.warning?.text) || 'Strictly wear protective gear.',
      textAr: sanitizeString(lesson.warning?.textAr) || 'يجب ارتداء سائر معدات الوقاية مسبقاً بفطنة.'
    },
    scenarioId: sanitizeString(lesson.scenarioId) || 'scen-chem-1',
    cards: Array.isArray(lesson.cards) ? lesson.cards.map((card: any) => ({
      title: sanitizeString(card.title) || 'Protective Measure',
      titleAr: sanitizeString(card.titleAr) || 'إجراء وقائي',
      desc: sanitizeString(card.desc) || 'Follow clinical instructions.',
      descAr: sanitizeString(card.descAr) || 'اتبع الإرشادات الطبية بدقة.',
      imageUrl: sanitizeString(card.imageUrl) || '',
      iconType: sanitizeString(card.iconType) || 'shield'
    })) : []
  };
}

function loadUsers(): Record<string, any> {
  ensureDataFile();
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    // Extra safety: block prototype pollution items on database loading
    if (parsed.__proto__ || parsed.constructor || parsed.prototype) {
      return {};
    }
    return parsed;
  } catch (e) {
    return {};
  }
}

function saveUsers(users: Record<string, any>) {
  ensureDataFile();
  
  // Safe atomic-replace algorithm using tmp staging file to prevent database file corruption on sudden drops or reboots
  const tempPath = `${USERS_FILE}.tmp`;
  try {
    // Explicitly strip prototype indicators to enforce storage hygiene
    const safePayload = Object.create(null);
    for (const [key, val] of Object.entries(users)) {
      if (key !== '__proto__' && key !== 'constructor' && key !== 'prototype') {
        safePayload[key] = val;
      }
    }
    fs.writeFileSync(tempPath, JSON.stringify(safePayload, null, 2), 'utf-8');
    fs.renameSync(tempPath, USERS_FILE);
  } catch (err) {
    console.error("Critical failure when persisting user database atomically:", err);
    if (fs.existsSync(tempPath)) {
      try { fs.unlinkSync(tempPath); } catch (_) {}
    }
  }
}

// 🛡️ SECURITY: Strict input sanitization and validations to protect memory, keys, and processes
function sanitizeString(val: any): string {
  if (typeof val !== 'string') return '';
  return val.trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Defend against simple XSS injections
    .substring(0, 500); // Guard memory buffer allocation limits
}

function isValidEmail(email: any): boolean {
  if (typeof email !== 'string') return false;
  const trimmed = email.toLowerCase().trim();
  if (trimmed.length > 80 || trimmed.length < 5) return false;
  
  // Anti-prototype-pollution & directory traversal safety bounds
  if (trimmed.includes('__proto__') || trimmed.includes('constructor') || trimmed.includes('prototype') || trimmed.includes('..') || trimmed.includes('/') || trimmed.includes('\\')) {
    return false;
  }
  
  // Standard strict regex matching student/researcher academic/institutional format
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(trimmed);
}

// Ensure inbound progress payloads maintain exact layout conformance
function validateProgressPayload(progress: any): boolean {
  if (!progress || typeof progress !== 'object' || Array.isArray(progress)) return false;
  
  // Exclusively map permitted properties, eliminating custom unwanted or huge keys
  const allowedKeys = [
    'name', 'email', 'avatarUrl', 'level', 'xp', 'xpNextLevel', 
    'streakDays', 'unlockedBadges', 'labProgress', 'masteryScores'
  ];
  
  for (const key of Object.keys(progress)) {
    if (!allowedKeys.includes(key)) return false;
  }
  
  // Enforce rigid standard types
  if (progress.level !== undefined && typeof progress.level !== 'number') return false;
  if (progress.xp !== undefined && typeof progress.xp !== 'number') return false;
  if (progress.xpNextLevel !== undefined && typeof progress.xpNextLevel !== 'number') return false;
  if (progress.streakDays !== undefined && typeof progress.streakDays !== 'number') return false;
  if (progress.name !== undefined && typeof progress.name !== 'string') return false;
  if (progress.avatarUrl !== undefined && typeof progress.avatarUrl !== 'string') return false;
  
  return true;
}

// 🛡️ SECURITY: In-memory Rate Limiter map and middleware to block brute force or DoS
const RATE_LIMIT_STORE = new Map<string, { count: number, resetTime: number }>();
const DEFAULT_WINDOW_MS = 60 * 1000; // 1 minute window

function createRateLimiter(maxRequests: number, windowMs: number = DEFAULT_WINDOW_MS) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // Collect client identity key safely
    const ip = (req.headers['x-forwarded-for'] as string) || req.ip || req.socket.remoteAddress || 'visitor';
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

// Lazy-loaded GenAI Client to prevent crashes on startup if GEMINI_API_KEY is not defined
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing on server-side setup");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // 🛡️ SECURITY: Disable signature header displaying underlying backend stack
  app.disable('x-powered-by');

  // 🛡️ SECURITY: Enforce solid security headers directly at the router level
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    // Content Security Policy permitting local fonts, local assets, and Gemini API services securely
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src * data: blob: android-webview-video-poster:; media-src * data: blob:; connect-src 'self' https://generativelanguage.googleapis.com; frame-src 'self';");
    next();
  });

  // 🛡️ SECURITY: Limit incoming JSON parse size to block body-parser buffer exhaust DoS attempts
  app.use(express.json({ limit: '30kb' }));

  // 🛡️ SECURITY: Assign distinct limit thresholds for different resource types
  const authLimiter = createRateLimiter(25); // max 25 logins/min
  const progressLimiter = createRateLimiter(30); // max 30 progress saves/min
  const chatLimiter = createRateLimiter(20); // max 20 chatbots/min to safeguard key costs

  // 1. Core API Endpoints
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', serverTime: new Date().toISOString() });
  });

  // 1.5 Lessons Database CRUD API Endpoints (Admin Controlled)
  app.get('/api/lessons', (req, res) => {
    const lessons = loadLessons();
    res.json(lessons);
  });

  app.post('/api/lessons', (req, res) => {
    const { password, lesson } = req.body;
    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(403).json({ error: 'Unauthorized access: Invalid admin authorization password supplied' });
    }
    if (!lesson) {
      return res.status(400).json({ error: 'Missing lesson content payload' });
    }

    const lessons = loadLessons();
    const cleanLesson = sanitizeLessonPayload(lesson);
    
    // De-duplicate if ID already exists
    const index = lessons.findIndex((l: any) => l.id === cleanLesson.id);
    if (index !== -1) {
      lessons[index] = cleanLesson;
    } else {
      lessons.push(cleanLesson);
    }

    saveLessons(lessons);
    res.json({ success: true, lesson: cleanLesson });
  });

  app.put('/api/lessons/:id', (req, res) => {
    const { id } = req.params;
    const { password, lesson } = req.body;
    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(403).json({ error: 'Unauthorized access: Invalid admin authorization password supplied' });
    }
    if (!lesson) {
      return res.status(400).json({ error: 'Missing lesson content payload' });
    }

    const lessons = loadLessons();
    const index = lessons.findIndex((l: any) => l.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Specified lesson ID was not found' });
    }

    const cleanLesson = sanitizeLessonPayload({ ...lesson, id });
    lessons[index] = cleanLesson;
    saveLessons(lessons);
    res.json({ success: true, lesson: cleanLesson });
  });

  app.delete('/api/lessons/:id', (req, res) => {
    const { id } = req.params;
    const { password } = req.body;
    const queryPass = req.query.password as string;
    
    if (password !== process.env.ADMIN_PASSWORD && queryPass !== process.env.ADMIN_PASSWORD) {
      return res.status(403).json({ error: 'Unauthorized access: Invalid admin authorization password supplied' });
    }

    let lessons = loadLessons();
    const initialLength = lessons.length;
    lessons = lessons.filter((l: any) => l.id !== id);

    if (lessons.length === initialLength) {
      return res.status(404).json({ error: 'Specified lesson ID was not found for removal' });
    }

    saveLessons(lessons);
    res.json({ success: true });
  });

  // 1.6 References Database CRUD API Endpoints (Admin Controlled)
  app.get('/api/references', (req, res) => {
    const refs = loadReferences();
    res.json(refs);
  });

  app.post('/api/references', (req, res) => {
    const { password, reference } = req.body;
    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(403).json({ error: 'Unauthorized access: Invalid admin authorization password supplied' });
    }
    if (!reference) {
      return res.status(400).json({ error: 'Missing reference content payload' });
    }

    const refs = loadReferences();
    const cleanRef = sanitizeReferencePayload(reference);
    
    // De-duplicate if ID already exists
    const index = refs.findIndex((r: any) => r.id === cleanRef.id);
    if (index !== -1) {
      refs[index] = cleanRef;
    } else {
      refs.push(cleanRef);
    }

    saveReferences(refs);
    res.json({ success: true, reference: cleanRef });
  });

  app.put('/api/references/:id', (req, res) => {
    const { id } = req.params;
    const { password, reference } = req.body;
    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(403).json({ error: 'Unauthorized access: Invalid admin authorization password supplied' });
    }
    if (!reference) {
      return res.status(400).json({ error: 'Missing reference content payload' });
    }

    const refs = loadReferences();
    const index = refs.findIndex((r: any) => r.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Specified reference ID was not found' });
    }

    const cleanRef = sanitizeReferencePayload({ ...reference, id });
    refs[index] = cleanRef;
    saveReferences(refs);
    res.json({ success: true, reference: cleanRef });
  });

  app.delete('/api/references/:id', (req, res) => {
    const { id } = req.params;
    const { password } = req.body;
    const queryPass = req.query.password as string;
    
    if (password !== process.env.ADMIN_PASSWORD && queryPass !== process.env.ADMIN_PASSWORD) {
      return res.status(403).json({ error: 'Unauthorized access: Invalid admin authorization password supplied' });
    }

    let refs = loadReferences();
    const initialLength = refs.length;
    refs = refs.filter((r: any) => r.id !== id);

    if (refs.length === initialLength) {
      return res.status(404).json({ error: 'Specified reference ID was not found for removal' });
    }

    saveReferences(refs);
    res.json({ success: true });
  });

  // 1.7 Labs Configuration API Endpoints
  app.get('/api/labs', (req, res) => {
    const labs = loadLabs();
    res.json(labs);
  });

  app.put('/api/labs/:id', (req, res) => {
    const { id } = req.params;
    const { password, lab } = req.body;
    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(403).json({ error: 'Unauthorized: Invalid admin password' });
    }
    if (!lab) {
      return res.status(400).json({ error: 'Missing lab payload' });
    }

    const labs = loadLabs();
    const index = labs.findIndex((l: any) => l.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Specified lab was not found' });
    }

    // Merge clean lab options carefully
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

  // User auth login / get synced profile state
  app.post('/api/auth/login', authLimiter, (req, res) => {
    const { email, name } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email parameter is required' });
    }

    // 🛡️ SECURITY: Enforce syntax patterns and block prototype keys
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid or format-violating institutional email provided' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const cleanName = sanitizeString(name);
    const users = loadUsers();

    if (!users[normalizedEmail]) {
      // Default name generation for visitors
      let isGuest = normalizedEmail.includes('guest') || normalizedEmail.startsWith('guest');
      let displayName = cleanName || (isGuest ? "Guest Scientific Peer" : "Ahmed");
      let avatarUrl = isGuest 
        ? "https://lh3.googleusercontent.com/aida-public/AB6AXuAls9rvpA_SW-RJyTOUKgXuDtBbcjXa3wS1rhWR-Ta98OurFIAK-KnBJ_HICXqyMcIjPdW3L54XKKxbuw0D-VjLOAMlZ9j9aMQNDfuqnb_PghryLAKoY9oHWCGXKfanITdF-os0y-MlEReXaf86RjsyvzOWTaqNaeXIqPsDvTkgYRh8XR1gp13tskOF_AHibg7YG_Xeg8Ri3oWfyGFC6N3BxrzS-bDBNgb3tXm6RodhdtYqIEeIAx5tDyIySeRady9Ua41xd4xZKoKs"
        : DEFAULT_USER_STATE.avatarUrl;

      users[normalizedEmail] = {
        ...DEFAULT_USER_STATE,
        email: normalizedEmail,
        name: displayName,
        avatarUrl: avatarUrl
      };
      saveUsers(users);
    }

    res.json(users[normalizedEmail]);
  });

  // Get profile state directly
  app.get('/api/user/profile', progressLimiter, (req, res) => {
    const email = req.query.email as string;
    if (!email) {
      return res.status(400).json({ error: 'Email parameter is required' });
    }

    // 🛡️ SECURITY: Prevent traversal or wild parameter searches
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid lookup parameter layout' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const users = loadUsers();
    
    if (users[normalizedEmail]) {
      res.json(users[normalizedEmail]);
    } else {
      res.status(404).json({ error: 'User profile not found' });
    }
  });

  // Save / Sync active profile state (Level, Streak, XP, Mastery scores, badging)
  app.post('/api/user/progress', progressLimiter, (req, res) => {
    const { email, progress } = req.body;
    if (!email || !progress) {
      return res.status(400).json({ error: 'Missing email or progress fields in payload' });
    }

    // 🛡️ SECURITY: Run payload syntax and schema structural validations
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid looking target format' });
    }
    if (!validateProgressPayload(progress)) {
      return res.status(400).json({ error: 'Progress metrics schema violated formatting boundaries' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const users = loadUsers();

    if (!users[normalizedEmail]) {
      return res.status(404).json({ error: 'No profile found for specified email, please login first' });
    }

    const cleanName = sanitizeString(progress.name || users[normalizedEmail].name);
    const cleanAvatar = sanitizeString(progress.avatarUrl || users[normalizedEmail].avatarUrl);

    // Merge safety metrics neatly
    users[normalizedEmail] = {
      ...users[normalizedEmail],
      ...progress,
      name: cleanName,
      avatarUrl: cleanAvatar,
      email: normalizedEmail // Keep email safe and verified
    };

    saveUsers(users);
    res.json({ success: true, user: users[normalizedEmail] });
  });

  // Proxy consult chatbot "Dr. Safety" via server-side Gemini API with multi-model fallback and local safety advisory backup
  app.post('/api/assistant/chat', chatLimiter, async (req, res) => {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message field is required' });
    }

    // 🛡️ SECURITY: Clean incoming messages and restrict sizes
    const cleanInput = sanitizeString(message);
    if (!cleanInput) {
      return res.status(400).json({ error: 'Safety query contains blacklisted characters or is empty' });
    }

    const queryText = cleanInput.toLowerCase().trim();
    const hasArabic = /[\u0600-\u06FF]/.test(cleanInput);

    const systemInstruction = `You are "Dr. Safety", the expert Clinical Safety Officer advising scientific peers on the LabSafe platform (منصة لابسيف للسلامة المختبرية والطبية).
Your expertise spans laboratory biosafety, proper Personal Protective Equipment (PPE) handling, hazardous acid spill controls, SDS evaluation, sterilisation processes, and clinical laboratory standards.
Provide clear, structured, and friendly instructions.
If the researcher asks in Arabic, reply in professional, helpful Arabic. If in English, reply in English.
Structure your answers beautifully using markdown lists, bold terms, and advice bullets where helpful. Avoid talking about code files or system configs. Stick purely to realistic scientific safety procedures.`;

    // Attempt Phase 1: Query gemini-3.5-flash
    try {
      const client = getAiClient();
      console.log("Dr. Safety: Dispatching payload to primary model gemini-3.5-flash...");
      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
          ...(history || []).slice(-10), // Limit history array slice to protect context window abuse
          { role: 'user', parts: [{ text: cleanInput }] }
        ],
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      return res.json({ text: response.text });
    } catch (primaryErr: any) {
      console.warn("Primary model 'gemini-3.5-flash' failed (possibly high demand/503). Retrying with backup 'gemini-3.1-flash-lite'...", primaryErr.message || primaryErr);
      
      // Attempt Phase 2: Fallback query to gemini-3.1-flash-lite
      try {
        if (!process.env.GEMINI_API_KEY) {
          throw new Error("No API key available");
        }
        const client = getAiClient();
        const responseBackup = await client.models.generateContent({
          model: "gemini-3.1-flash-lite",
          contents: [
            ...(history || []).slice(-10),
            { role: 'user', parts: [{ text: cleanInput }] }
          ],
          config: {
            systemInstruction,
            temperature: 0.7,
          }
        });

        console.log("Fallback succeeded using 'gemini-3.1-flash-lite'.");
        return res.json({ text: responseBackup.text });
      } catch (backupErr: any) {
        console.error("Backup model 'gemini-3.1-flash-lite' also failed or API key is missing. Serving high-fidelity local procedural safety advice.", backupErr.message || backupErr);
        
        let fallbackText = "";

        // Selection of beautiful fallback response matching the inquiry topic
        if (hasArabic) {
          if (queryText.includes("حمض") || queryText.includes("أحماض") || queryText.includes("هيدروكلوريك") || queryText.includes("acid")) {
            fallbackText = `**[إرشاد طوارئ د. لابسيف (وضع الاحتياطي)]**\n\nيواجه الملقّم ضغطاً مؤقتاً، ولكن إليك البروتوكول الصحيح والآمن للتعامل مع الأحماض القوية (مثل حمض الهيدروكلوريك HCl 37%):\n\n1. **أدوات الوقاية الشخصية (PPE)**:\n   - يجب ارتداء قفازات مقاومة للمواد الكيميائية (نوصي بـ قفازين مزدوجين لتقليل النفاذية كلياً).\n   - معطف مختبر (مريلة مقاومة للأكالة) ونظارات أمان مخصصة للأحماض.\n2. **الضوابط الهندسية**:\n   - **يجب دائماً** معالجة الأحماض المركزة داخل خزانة أبخرة معملية معتمدة (Fume Hood)؛ لا تقم بفتحها أبداً على منضدة مكشوفة لضمان عزل الأبخرة الكاوية.\n3. **القاعدة الذهبية لتخفيف الأحماض**:\n   - **أضف الحمض إلى الماء دائماً** (A&W - Always Add Acid to Water) وليس العكس! للحيلولة دون تفاعل إطلاق الحرارة المفاجئ وغليان وارتداد السائل الكيميائي الحارق.`;
          } else if (queryText.includes("بيولوجي") || queryText.includes("انسكاب") || queryText.includes("انسباك") || queryText.includes("bsl") || queryText.includes("spill")) {
            fallbackText = `**[إرشاد طوارئ د. لابسيف (وضع الاحتياطي)]**\n\nيواجه الملقّم ضغطاً مؤقتاً، ولكن إليك بروتوكول معالجة الانسكابات البيولوجية من المستوى الثاني BSL-2:\n\n1. **الإخلاء الفوري والترسيب**:\n   - قم بتنبيه جميع الزملاء في المعمل وإخلاء المكان فوراً وإغلاق الباب.\n   - انتظر من 20 إلى 30 دقيقة لوقف سيل الهواء وللسماح للرذاذ المعلق (Aerosols) بالاستقرار والترسيب الكامل.\n2. **الاستعداد والوقاية**:\n   - قبل العودة للتطهير، ارتدِ معطفاً نظيفاً وقماش أمان متطابق وقفازات مزدوجة مع نظارات واقية متقنة الإحكام.\n3. **التطهير والتنظيف**:\n   - غطّ منطقة الانسكاب بالكامل بمناشف ورقية كافية لامتصاص المادة المسكوبة.\n   - صبّ معقم مناسب (مثل الكلور المنزلي المخفف حديثاً بنسبة 10٪) بلطف حول وفوق المناشف الماصة لتفادي إثارة رذاذ جديد.\n   - اترك المعقم للتفاعل لمدة 20 دقيقة على الأقل.\n   - ضع مخلفات التنظيف في أكياس النفايات البيولوجية (Biohazard Bags) لتعقيمها بالبخار لاحقاً (Autoclave).`;
          } else if (queryText.includes("عين") || queryText.includes("وجه") || queryText.includes("درع") || queryText.includes("نظار") || queryText.includes("goggle") || queryText.includes("shield")) {
            fallbackText = `**[إرشاد طوارئ د. لابسيف (وضع الاحتياطي)]**\n\nيواجه الملقّم ضغطاً مؤقتاً، ولكن إليك الفروقات المعتمدة لحماية العين والوجه في المختبر:\n\n1. **نظارات الأمان المغلقة (Safety Goggles)**:\n   - توفر إحكاماً كاملاً بنسبة 360 درجة حول العينين لمنع وصول الرذاذ المتطاير أو الأبخرة الكيميائية النافذة، وتعتبر الفرض الأساسي أثناء التجارب.\n2. **درع الوجه الكامل (Full Face Shield)**:\n   - يحمي كامل ملامح الوجه والرقبة من الأجسام المتطايرة القوية أو الانسكابات الفورية الضخمة (مثل النيتروجين المخزن أو السوائل المغلوية).\n   - **تنبيه هام**: درع الوجه لا يغني عن نظارات السلامة بأي حال، بل يجب ارتداؤهما معاً لضمان عدم تسلل السوائل من الحواف الجانبية.`;
          } else {
            fallbackText = `**[استشارات الدكتور لابسيف (وضع الاحتياطي للأمان)]**\n\nيواجه خادم معالجة الذكاء الاصطناعي ضغطاً عالياً مؤقتاً. لمساعدتك المباشرة ببروتوكولات الأمان المختبرية الأهم:\n\n- **أدوات الوقاية**: تأكد دائماً من ارتداء معطف المختبر الأبيض، القفازات المناسبة، والحذاء المغلق تماماً قبل الدخول.\n- **علامات الطوارئ والإنقاذ**: حدد موقع دش الطوارئ ومحطة غسيل العيون الأقرب إليك.\n- **صحيفة بيانات السلامة (SDS)**: راجع دائماً الأقسام رقم 4 للإسعاف الأولي والقسم رقم 8 لمستويات التعرض والتحكم الكيميائي.\n\n*يرجى تحديد المادة أو الحالة المختبرية بدقة لمساعدتك بالبروتوكول المقنن فور عودة الخدمة بالكامل!*`;
          }
        } else {
          // English Fallbacks
          if (queryText.includes("acid") || queryText.includes("hydrochloric") || queryText.includes("hcl") || queryText.includes("chemical")) {
            fallbackText = `**[Dr. Safety Advisory (Backup Procedural Guidelines)]**\n\nThe main AI model is currently under high demand, but here is the official safety protocol for handling strong/concentrated acids (such as 37% Hydrochloric Acid):\n\n1. **Personal Protective Equipment (PPE)**:\n   - Must wear chemical-resistant nitrile or neoprene gloves (double-gloving recommended for concentrated HCl).\n   - Standard lab coat + splash safety goggles. If handling volumes > 1 Liter, a chemical apron and face-shield are required.\n2. **Engineering Controls**:\n   - **Always** handle concentrated acids inside a certified, fully functional laboratory fume hood. Never open them on an open bench.\n3. **Safe Practices**:\n   - **ADD ACID TO WATER** (A&W - Always Remember): Never add water to concentrated acid to prevent aggressive rapid boiling and violent splashing projection.`;
          } else if (queryText.includes("bsl") || queryText.includes("spill") || queryText.includes("bio") || queryText.includes("containment")) {
            fallbackText = `**[Dr. Safety Advisory (Backup Procedural Guidelines)]**\n\nThe main AI model is currently under high demand, but here is the standard protocol for containment and cleanup of a Biological Safety Level 2 (BSL-2) spill:\n\n1. **Immediate Action (Evacuation & Aeration)**:\n   - Alert all lab personnel in the area, evacuate the room immediately, and close the door.\n   - Allow aerosols to settle for at least 20 to 30 minutes before re-entering.\n2. **PPE Preparation**:\n   - Don a clean lab coat, protective gloves (double glove), and protective eyewear before returning.\n3. **Decontamination Protocol**:\n   - Cover the spill area with absorbent paper towels.\n   - Pour an appropriate disinfectant (e.g., 10% freshly prepared household sodium hypochlorite/bleach) gently around and over the towels.\n   - Leave the disinfectant in contact for at least 20 minutes.\n   - Gather the soaked materials into a biohazard autoclave bag. Wipe the area with fresh disinfectant, then rinse with water.`;
          } else if (queryText.includes("eye") || queryText.includes("goggle") || queryText.includes("shield") || queryText.includes("face")) {
            fallbackText = `**[Dr. Safety Advisory (Backup Procedural Guidelines)]**\n\nThe main AI model is currently under high demand, but here is the difference between goggles and full face-shields:\n\n1. **Safety Goggles**:\n   - Provide 360-degree seal around the eyes to protect against direct chemical splashes, dusts, and fine aerosols.\n   - Must be worn as a baseline whenever liquid chemical reagents or biological samples are active.\n2. **Full Face Shield**:\n   - Protects the entire face (forehead, eyes, nose, cheeks, mouth, and neck) from flying particles, cryogenic liquid splashes (e.g., liquid nitrogen), or highly pressurized splashes.\n   - **Crucial Warning**: Face shields *do not* replace safety goggles; they must be worn *together with* certified safety goggles to ensure lateral eye sealing.`;
          } else {
            fallbackText = `**[Dr. Safety Advisor (Backup Safety Mode)]**\n\nI am currently operating in Backup Safety Mode due to heavy load on Google's model servers. To assist you immediately, here are critical general safety protocols:\n\n- **PPE Enforcement**: Never enter active workspaces without wearing closed-toe shoes, lab coats, and protective gloves.\n- **Emergency Station Awareness**: Identify the nearest eyewash station, safety shower, and fire extinguisher before commencing operations.\n- **Safety Data Sheets (SDS)**: Review sections 4 (First-Aid), 6 (Accidental Release), and 8 (Exposure Control) of the specific substance with your university officer.\n\n*What specific scenario or substance were you inquiring about? Let me know so I can highlight the right safety protocols!*`;
          }
        }

        return res.json({ text: fallbackText, isFallbackBackup: true });
      }
    }
  });


  // 2. Client assets serving & Dev Vite alignment middleware
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting full-stack dev server in Vite-middleware integration mode.");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving static production assets from dist directory.");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`LabSafe Full-Stack Server listening at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("Critical failure during full-stack startup sequence:", err);
});
