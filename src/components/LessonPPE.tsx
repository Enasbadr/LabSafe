/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  ShieldCheck, 
  Eye, 
  Flame, 
  Shield, 
  Award, 
  Thermometer, 
  AlertTriangle, 
  Biohazard, 
  CheckCircle2,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Languages,
  RotateCcw,
  Sparkles,
  ChevronRight,
  MonitorPlay,
  CheckCircle
} from 'lucide-react';
import { LAB_LESSONS_DATA, DetailedLesson } from '../data';

interface LessonPPEProps {
  isArabic: boolean;
  lessonId: string;
  onBack: () => void;
  onContinueToScenario: (scenarioId: string) => void;
  lessons?: DetailedLesson[];
}

// Custom technical SVG diagram renderer to replace broken plain photos with correct schematics!
const SchematicDiagram = ({ iconType, isArabic }: { iconType: string, isArabic: boolean }) => {
  switch (iconType) {
    case 'eye':
      return (
        <svg viewBox="0 0 400 180" className="w-full h-full bg-slate-50 dark:bg-slate-900/40 p-3 select-none transition-colors">
          {/* Outer Grid */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-slate-200 dark:text-slate-800" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Goggles Frame */}
          <path d="M 60 90 Q 75 40 140 45 Q 200 48 200 90 Q 200 48 260 45 Q 325 40 340 90 Q 325 140 260 135 Q 200 132 200 90 Q 200 132 140 135 Q 75 140 60 90 Z" 
                fill="none" stroke="currentColor" strokeWidth="4" className="text-blue-600 dark:text-blue-500" />
          
          {/* Lenses glass effect */}
          <path d="M 75 90 Q 85 55 135 60 Q 185 65 185 90 Q 185 115 135 120 Q 85 123 75 90 Z" 
                fill="rgba(59, 130, 246, 0.15)" stroke="currentColor" strokeWidth="1.5" className="text-blue-400" />
          <path d="M 325 90 Q 315 55 265 60 Q 215 65 215 90 Q 215 115 265 120 Q 315 123 325 90 Z" 
                fill="rgba(59, 130, 246, 0.15)" stroke="currentColor" strokeWidth="1.5" className="text-blue-400" />
          
          {/* Structural Highlights */}
          <circle cx="100" cy="90" r="2" className="fill-teal-500 animate-pulse" />
          <text x="108" y="93" className="fill-slate-500 dark:fill-slate-400 text-[9px] font-mono">Polycarbonate Coat</text>
          
          <rect x="180" y="80" width="40" height="20" rx="3" fill="currentColor" className="text-slate-200 dark:text-slate-800" stroke="#00478d" strokeWidth="0.5" />
          <text x="200" y="92" textAnchor="middle" className="fill-slate-700 dark:fill-slate-300 text-[7px] font-extrabold font-headline-lg">
            {isArabic ? "مستوى الغاز ٢" : "GAS-TIGHT"}
          </text>

          <circle cx="280" cy="110" r="2" className="fill-teal-500 animate-pulse" />
          <text x="288" y="113" className="fill-slate-500 dark:fill-slate-400 text-[9px] font-mono">Anti-fog seal</text>

          <text x="50%" y="25" textAnchor="middle" className="fill-slate-400 text-[9px] font-extrabold tracking-widest uppercase font-mono">
            {isArabic ? "مخطط الأمان البصري الهيكلي" : "OCULAR SHIELD GRAPHICAL REPORT"}
          </text>
        </svg>
      );
    case 'hand':
      return (
        <svg viewBox="0 0 400 180" className="w-full h-full bg-slate-50 dark:bg-slate-900/40 p-3 select-none transition-colors">
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Barrier breakdown graph */}
          <line x1="40" y1="130" x2="360" y2="130" stroke="currentColor" strokeWidth="1.5" className="text-slate-400" />
          <line x1="50" y1="20" x2="50" y2="140" stroke="currentColor" strokeWidth="1.5" className="text-slate-400" />
          
          {/* Axis Labels */}
          <text x="360" y="145" textAnchor="end" className="fill-slate-400 text-[8px] font-mono">Breakthrough (Min)</text>
          <text x="45" y="18" className="fill-slate-400 text-[8px] font-mono">Acid Molarity</text>
          
          {/* Curve 1: Thin Nitrile */}
          <path d="M 50 120 Q 150 115 200 40" fill="none" stroke="#ef4444" strokeWidth="2.5" />
          {/* Curve 2: Thick Neoprene */}
          <path d="M 50 125 Q 180 120 330 35" fill="none" stroke="#10b981" strokeWidth="2.5" />
          
          {/* Legend */}
          <rect x="230" y="80" width="115" height="42" rx="4" fill="rgba(15, 19, 26, 0.82)" className="stroke-slate-700" strokeWidth="1" />
          <circle cx="242" cy="94" r="3.5" fill="#ef4444" />
          <text x="252" y="97" className="fill-white text-[8px] font-sans font-bold">Nitrile (Splash Only)</text>
          
          <circle cx="242" cy="110" r="3.5" fill="#10b981" />
          <text x="252" y="113" className="fill-white text-[8px] font-sans font-bold">Neoprene (Heavy Acid)</text>
          
          <text x="50%" y="25" textAnchor="middle" className="fill-slate-400 text-[9px] font-extrabold tracking-widest uppercase font-mono">
            {isArabic ? "كفاءة حاجز حماية اليدين" : "DERMAL PERMEABILITY COMPRESSED DATA"}
          </text>
        </svg>
      );
    case 'coat':
      return (
        <svg viewBox="0 0 400 180" className="w-full h-full bg-slate-50 dark:bg-slate-900/40 p-3 select-none transition-colors">
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Cotton lattice micro structure vs synthetic */}
          <line x1="200" y1="20" x2="200" y2="160" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="text-slate-300 dark:text-slate-700" />
          
          {/* Left panel: Cotton */}
          <g transform="translate(0, 0)">
            {/* Cotton fiber drawing */}
            <circle cx="100" cy="90" r="30" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="3 3" />
            <path d="M 85 90 C 85 60 115 60 115 90 C 115 120 85 120 85 90" fill="none" stroke="#10b981" strokeWidth="1.5" />
            <path d="M 100 75 C 70 75 70 105 100 105 C 130 105 130 75 100 75" fill="none" stroke="#10b981" strokeWidth="1.5" />
            <text x="100" y="145" textAnchor="middle" className="fill-slate-600 dark:fill-slate-300 text-[10px] font-extrabold">
              {isArabic ? "قطن ١٠٠٪ (يتفحم ولا ينصهر)" : "100% COTTON (CHAR COAT)"}
            </text>
            <span className="text-emerald-500 block"></span>
          </g>
          
          {/* Right panel: Polyester polymer */}
          <g transform="translate(200, 0)">
            <circle cx="100" cy="90" r="30" fill="none" stroke="#ef4444" strokeWidth="2" />
            {/* Melting droplets */}
            <circle cx="90" cy="85" r="4.5" fill="#ef4444" />
            <circle cx="110" cy="95" r="3" fill="#ef4444" />
            <circle cx="100" cy="115" r="6" fill="#ef4444" className="animate-bounce" />
            
            <text x="100" y="145" textAnchor="middle" className="fill-slate-600 dark:fill-slate-300 text-[10px] font-extrabold">
              {isArabic ? "البوليمر الاصطناعي (يذوب ويلتصق)" : "POLYESTER BLENDS (MELT RISK)"}
            </text>
          </g>
          
          <text x="50%" y="25" textAnchor="middle" className="fill-slate-400 text-[9px] font-extrabold tracking-widest uppercase font-mono">
            {isArabic ? "كيمياء ألياف المنسوجات في النيران" : "TORSO COATING THERMAL SHIELD PROFILE"}
          </text>
        </svg>
      );
    case 'shield':
      return (
        <svg viewBox="0 0 400 180" className="w-full h-full bg-slate-50 dark:bg-slate-900/40 p-3 select-none transition-colors">
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Concentric safety zones circles */}
          <circle cx="200" cy="90" r="70" fill="rgba(239, 68, 68, 0.04)" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="6 4" />
          <circle cx="200" cy="90" r="45" fill="rgba(245, 158, 11, 0.05)" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 3" />
          <circle cx="200" cy="90" r="18" fill="rgba(59, 130, 246, 0.2)" stroke="#3b82f6" strokeWidth="2" />
          
          {/* Spill source point */}
          <line x1="200" y1="50" x2="200" y2="130" stroke="#ef4444" strokeWidth="0.5" />
          <line x1="160" y1="90" x2="240" y2="90" stroke="#ef4444" strokeWidth="0.5" />
          
          {/* Coordinate callouts */}
          <text x="200" y="93" textAnchor="middle" className="fill-blue-700 dark:fill-blue-300 font-bold text-[8px] font-mono">Spill Core</text>
          <text x="250" y="65" className="fill-amber-600 dark:fill-amber-400 text-[8px] font-extrabold">1M Perimeter</text>
          <text x="280" y="45" className="fill-rose-600 dark:fill-rose-400 text-[8px] font-extrabold">3M Isolation Perimeter</text>
          
          <text x="50%" y="25" textAnchor="middle" className="fill-slate-400 text-[9px] font-extrabold tracking-widest uppercase font-mono">
            {isArabic ? "بروتوكول احتواء الحدود الهندسية" : "SPILL SPAN CONTAINMENT BOUNDARIES"}
          </text>
        </svg>
      );
    case 'beaker':
      return (
        <svg viewBox="0 0 400 180" className="w-full h-full bg-slate-50 dark:bg-slate-900/40 p-3 select-none transition-colors">
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Reaction vial */}
          <rect x="175" y="45" width="50" height="90" rx="3" fill="rgba(59, 130, 246, 0.05)" stroke="currentColor" strokeWidth="2.5" className="text-slate-500 dark:text-slate-600" />
          
          {/* Acid Neutralizing solution */}
          <path d="M 176 100 Q 200 102 224 100 L 224 133 Q 200 134 176 133 Z" fill="rgba(16, 185, 129, 0.3)" />
          
          {/* Gas bubbling bubbles */}
          <circle cx="188" cy="85" r="3" fill="none" stroke="#10b981" strokeWidth="1" className="animate-ping" />
          <circle cx="212" cy="74" r="4.5" fill="none" stroke="#10b981" strokeWidth="1" />
          <circle cx="201" cy="65" r="2.5" fill="none" stroke="#10b981" strokeWidth="1" />
          
          {/* Chemical equation overlay banner */}
          <rect x="80" y="145" width="240" height="20" rx="3" fill="rgba(15, 19, 26, 0.85)" />
          <text x="200" y="158" textAnchor="middle" className="fill-emerald-400 font-mono text-[8px] font-extrabold">
            H2SO4(liq) + 2NaHCO3(dry) → Na2SO4 + 2H2O + 2CO2↑ (Safe gas)
          </text>
          
          <text x="50%" y="25" textAnchor="middle" className="fill-slate-400 text-[9px] font-extrabold tracking-widest uppercase font-mono">
            {isArabic ? "معادلة ومساق التحييد بالأملاح" : "NaHCO3 LIQUID-PHASE DRY BUFFER REACTION"}
          </text>
        </svg>
      );
    case 'flame':
      return (
        <svg viewBox="0 0 400 180" className="w-full h-full bg-slate-50 dark:bg-slate-900/40 p-3 select-none transition-colors">
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Fire triangle representation */}
          <polygon points="200,45 140,135 260,135" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-slate-600 dark:text-slate-500" />
          
          {/* Flames graphic inside */}
          <path d="M 185 125 Q 200 80 200 70 Q 205 85 215 125 Z" fill="#ef4444" className="animate-pulse" />
          <path d="M 191 125 Q 200 95 200 90 Q 203 100 209 125 Z" fill="#f59e0b" />
          
          {/* Active Triangle sides labels */}
          <text x="148" y="90" textAnchor="end" className="fill-red-500 font-headline-lg font-extrabold text-[9px]">SOLVENT FUEL</text>
          <text x="252" y="90" textAnchor="start" className="fill-blue-500 font-headline-lg font-extrabold text-[9px]">ATM OXYGEN</text>
          <text x="200" y="147" textAnchor="middle" className="fill-amber-600 font-headline-lg font-extrabold text-[9px]">{isArabic ? "سخونة مفرطة" : "HOT SURFACE"}</text>
          
          <text x="50%" y="25" textAnchor="middle" className="fill-slate-400 text-[9px] font-extrabold tracking-widest uppercase font-mono">
            {isArabic ? "بروتوكول تفكيك تفاعل الحريق" : "CLASS B ORGANIC INCINERATION DYNAMICS"}
          </text>
        </svg>
      );
    case 'bio':
      return (
        <svg viewBox="0 0 400 180" className="w-full h-full bg-slate-50 dark:bg-slate-900/40 p-3 select-none transition-colors">
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Biosafety barriers flow */}
          <rect x="50" y="45" width="300" height="90" rx="6" fill="rgba(15, 23, 42, 0.02)" stroke="currentColor" strokeWidth="1" className="text-slate-300 dark:text-slate-700" />
          
          {/* BSC air pathways vectors lines */}
          <path d="M 70 120 L 70 80 Q 70 60 120 60 L 280 60 Q 330 60 330 80 L 330 120" fill="none" stroke="#22d3ee" strokeWidth="2" strokeDasharray="5 5" className="animate-running" />
          
          {/* Visual Filters meshes */}
          <rect x="135" y="75" width="130" height="15" rx="2" fill="#e2e8f0" stroke="#0891b2" strokeWidth="1.5" />
          <text x="200" y="86" textAnchor="middle" className="fill-slate-800 dark:fill-slate-200 font-bold text-[7px] font-mono">99.97% EFFICIENCY HEPA</text>
          
          {/* text */}
          <rect x="135" y="110" width="130" height="15" rx="2" fill="#e2e8f0" stroke="#0891b2" strokeWidth="1.5" />
          <text x="200" y="121" textAnchor="middle" className="fill-slate-800 dark:fill-slate-200 font-bold text-[7px] font-mono">STERILE RECIRCULATION</text>
          
          <text x="50%" y="25" textAnchor="middle" className="fill-slate-400 text-[9px] font-extrabold tracking-widest uppercase font-mono">
            {isArabic ? "منظومة سحب فلتر البكتيريا" : "HEPA RECIRCULATION & BARRIER BIO-SCHEMATIC"}
          </text>
        </svg>
      );
    case 'temp':
      return (
        <svg viewBox="0 0 400 180" className="w-full h-full bg-slate-50 dark:bg-slate-900/40 p-3 select-none transition-colors">
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Autoclave chamber */}
          <rect x="90" y="50" width="220" height="80" rx="8" fill="rgba(15, 23, 42, 0.05)" stroke="currentColor" strokeWidth="3" className="text-slate-650 dark:text-slate-600" />
          
          {/* Inward pressure steam valves */}
          <path d="M 120,53 L 120,65 L 125,65" stroke="#ec4899" strokeWidth="2" fill="none" />
          <path d="M 280,53 L 280,65 L 275,65" stroke="#ec4899" strokeWidth="2" fill="none" />
          
          <text x="120" y="44" textAnchor="middle" className="fill-rose-500 font-mono text-[8px] font-extrabold">STEAM VALVE</text>
          <text x="280" y="44" textAnchor="middle" className="fill-rose-500 font-mono text-[8px] font-extrabold">EXHAUST</text>
          
          {/* Pressure meters gauge */}
          <circle cx="200" cy="90" r="22" fill="none" stroke="#2563eb" strokeWidth="2" />
          <line x1="200" y1="90" x2="212" y2="78" stroke="#ef4444" strokeWidth="2" />
          
          <text x="200" y="121" textAnchor="middle" className="fill-slate-500 font-mono font-extrabold text-[8px]">
            {isArabic ? "مؤشر الضغط ١٥ PSI" : "15 PSI TARGET VENT"}
          </text>
          
          <text x="50%" y="25" textAnchor="middle" className="fill-slate-400 text-[9px] font-extrabold tracking-widest uppercase font-mono">
            {isArabic ? "ديناميكا غازات التعقيم البخارية" : "AUTOCLAVE THERMODYNAMIC PROFILE"}
          </text>
        </svg>
      );
    case 'warning':
    default:
      return (
        <svg viewBox="0 0 400 180" className="w-full h-full bg-slate-50 dark:bg-slate-900/40 p-3 select-none transition-colors">
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Alert sign */}
          <polygon points="200,45 130,135 270,135" fill="none" stroke="#f59e0b" strokeWidth="3" />
          <text x="200" y="112" textAnchor="middle" className="fill-amber-500 font-mono font-black text-2xl">!</text>
          
          {/* Secondary alerts anchors */}
          <line x1="50" y1="90" x2="110" y2="90" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" className="text-slate-400" />
          <line x1="290" y1="90" x2="350" y2="90" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" className="text-slate-400" />
          
          <text x="80" y="105" textAnchor="middle" className="fill-slate-400 text-[8px] font-mono">Engineering Boundary</text>
          <text x="320" y="105" textAnchor="middle" className="fill-slate-400 text-[8px] font-mono">Work Safely</text>
          
          <text x="50%" y="25" textAnchor="middle" className="fill-slate-400 text-[9px] font-extrabold tracking-widest uppercase font-mono">
            {isArabic ? "موجز لوحة التنبيه الهندسي" : "CRITICAL RISK HAZARD SPECIFICATION"}
          </text>
        </svg>
      );
  }
};

export default function LessonPPE({ isArabic, lessonId, onBack, onContinueToScenario, lessons = LAB_LESSONS_DATA }: LessonPPEProps) {
  const activeLessons = lessons && lessons.length > 0 ? lessons : LAB_LESSONS_DATA;
  const lesson = activeLessons.find(l => l.id === lessonId) || activeLessons[0];

  const titleText = isArabic ? lesson.titleAr : lesson.title;
  const durationText = isArabic ? lesson.durationAr : lesson.duration;
  const categoryText = isArabic ? lesson.categoryAr : lesson.category;
  const objectivesList = isArabic ? lesson.objectivesAr : lesson.objectives;
  const citationText = isArabic ? lesson.citationAr : lesson.citation;
  const warningTitle = isArabic ? lesson.warning.titleAr : lesson.warning.title;
  const warningText = isArabic ? lesson.warning.textAr : lesson.warning.text;

  // Custom Video Player state & real HTML5 video link controls
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentProgress, setCurrentProgress] = useState<number>(0);
  const [activeSegmentIndex, setActiveSegmentIndex] = useState<number>(0);
  const [videoUrl, setVideoUrl] = useState<string>('');

  useEffect(() => {
    // Map lesson topic to beautiful public scientific loops on mixkit
    if (lesson.videoUrl) {
      setVideoUrl(lesson.videoUrl);
    } else if (lessonId.startsWith('chem')) {
      setVideoUrl('https://assets.mixkit.co/videos/preview/mixkit-chemical-pouring-in-a-laboratory-analytical-experiment-40227-large.mp4');
    } else {
      setVideoUrl('https://assets.mixkit.co/videos/preview/mixkit-scientist-working-with-a-microscope-40225-large.mp4');
    }
  }, [lessonId, lesson.videoUrl]);

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(err => {
          console.log("Play failed, resetting: ", err);
          setIsPlaying(false);
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, videoUrl]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const duration = videoRef.current.duration || 1;
      const percent = (current / duration) * 100;
      setCurrentProgress(Math.min(Math.round(percent), 100));

      if (percent < 35) {
        setActiveSegmentIndex(0);
      } else if (percent < 70) {
        setActiveSegmentIndex(1);
      } else {
        setActiveSegmentIndex(2);
      }
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    setCurrentProgress(0);
    setActiveSegmentIndex(0);
    if (videoRef.current) videoRef.current.currentTime = 0;
  };

  const videoSegmentsAr = [
    { title: "المقدمة واللوائح المعتمدة", time: "0:00 - 1:00", transcript: "أهلاً بك زميلي الباحث. اليوم سنستعرض البروتوكولات واللوائح المعتمدة للأمان المعملي قبل البدء بدراستنا للخطوات." },
    { title: "التطبيق العملي وحسابات حواجز الحماية", time: "1:00 - 2:00", transcript: "الخطوة الاستراتيجية الأكثر أهمية تكمن في ضبط الضغط التفاضلي السلبي أو تحييد البقعة باستخدام المواد الصلبة الجافة المحفزة." },
    { title: "التصرف السليم أثناء الطوارئ الكبرى", time: "2:00 - النهاية", transcript: "في حال حدوث حريق مذيبات Class B، اسحب الزجاج الزاحِف sash كليًا لأسفل لتدشين عازل انفجاري واقٍ ثم انشر ثاني أكسيد الكربون." }
  ];

  const videoSegmentsEn = [
    { title: "Regulatory Context & Setup Guidelines", time: "0:00 - 1:00", transcript: "Welcome to the training pipeline, researcher. Today we will explore active regulatory boundaries as certified under safety boards." },
    { title: "Interactive Containment Calculations & PPE Checks", time: "1:00 - 2:00", transcript: "The primary technical goal is isolating spills starting precisely from the margins inward or calibrating negative atmospheric flows." },
    { title: "Emergency Incineration Suppression SOP", time: "2:00 - End", transcript: "During an organic Class B explosion, slide the physical sash down fully as your shield prior to deploying CO2 canisters." }
  ];

  const activeTranscript = isArabic 
    ? videoSegmentsAr[activeSegmentIndex].transcript 
    : videoSegmentsEn[activeSegmentIndex].transcript;

  const activeSegmentTitle = isArabic
    ? videoSegmentsAr[activeSegmentIndex].title
    : videoSegmentsEn[activeSegmentIndex].title;

  return (
    <div id={`lesson-player-container-${lesson.id}`} className="flex flex-col gap-6 w-full animate-fadeIn pb-24 relative text-slate-900 dark:text-slate-100">
      
      {/* Back button header */}
      <header className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-3 sticky top-0 bg-background dark:bg-slate-900 z-30 transition-colors">
        <button 
          onClick={onBack}
          aria-label="Go back to lessons"
          className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 transition-colors flex items-center justify-center cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 text-slate-700 dark:text-slate-200" />
        </button>
        <div>
          <span className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block">
            {isArabic ? "مناهج مختبر لابسيف" : "LabSafe Curriculum Platform"}
          </span>
          <span className="text-sm font-bold text-[#00478d] dark:text-blue-400">
            {isArabic ? "تفاصيل الدرس والخطوات العلمية" : "Interactive Lesson Player"}
          </span>
        </div>
      </header>

      {/* Hero Header Section */}
      <section className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-[#00478d] text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
            {durationText}
          </span>
          <span className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
            {categoryText}
          </span>
          <span className="bg-slate-100 dark:bg-slate-800 text-teal-600 dark:text-teal-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {lesson.labType === 'chemistry' 
              ? (isArabic ? 'كيمياء كبائن' : 'Chemistry Lab') 
              : lesson.labType === 'microbiology'
              ? (isArabic ? 'أحياء دقيقة حيوية' : 'Microbiology Lab')
              : lesson.labType === 'water'
              ? (isArabic ? 'معالجة وتحلية المياه' : 'Water Treatment Lab')
              : lesson.labType === 'petroleum'
              ? (isArabic ? 'النفط والغاز والبترول' : 'Oil & Petroleum Lab')
              : (isArabic ? 'مختبر مخصص' : 'Custom Lab')}
          </span>
        </div>

        <h2 className="text-2xl md:text-3xl font-extrabold font-headline-lg text-[#00478d] dark:text-blue-400 leading-tight">
          {titleText}
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed max-w-2xl">
          {isArabic 
            ? "يرجى دراسة المعايير والبروتوكولات الفنية التالية بدقة، ومشاهدة مقطع الأمان الموجه، لتطبيق تصرف حذر وقرار هندسي سليم قبل خوض الاختبار التفاعلي للمهمة."
            : "Study the analytical parameters, warning indicators, and safety videos below to ensure precise safety decision-making during the upcoming emergency drill."}
        </p>
      </section>

      {/* FIXED AND ADDED CORRECTLY: Interactive Safety Seminar Educational Video Player */}
      <section className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl overflow-hidden shadow-sm p-4 md:p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse"></div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-305 flex items-center gap-1.5">
              <MonitorPlay className="w-4 h-4 text-[#00478d] dark:text-blue-400" />
              {isArabic ? "دورة الفيديو التدريبية المصورة" : "Simulated Audio/Video Briefing Module"}
            </span>
          </div>

          <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500">
            {isArabic ? "دقة عالية HD" : "HD STANDARDS"}
          </span>
        </div>

        {/* Video Player Display Screen Frame */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          
          {/* Main Monitor Display screen (8 cols) */}
          <div className="lg:col-span-8 bg-black border border-slate-950 rounded-xl relative overflow-hidden flex flex-col justify-between items-center h-64 md:h-80 select-none">
            
            {/* Real HTML5 Video element */}
            {videoUrl && (
              <video
                ref={videoRef}
                src={videoUrl}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleVideoEnded}
                playsInline
                loop
                muted={isMuted}
                className="absolute inset-0 w-full h-full object-cover opacity-75 pointer-events-none"
              />
            )}

            {/* Ambient Background Simulation */}
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/40 via-transparent to-slate-950/50 pointer-events-none"></div>
            
            {/* Video content display overlay */}
            <div className="absolute inset-0 z-10 p-6 flex flex-col justify-between pointer-events-none">
              
              {/* Audio/Video Indicator */}
              <div className="flex justify-between items-center pointer-events-auto">
                <span className="bg-black/60 text-cyan-300 font-mono text-[9px] font-extrabold px-2 py-0.5 rounded-md border border-cyan-400/20 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-cyan-300 animate-spin" strokeWidth={2.5} />
                  <span>{isArabic ? "بث عرض تدريبي" : "TRAINING STREAM ENABLED"}</span>
                </span>
                
                <span className="text-white text-[10px] font-mono font-semibold bg-black/60 px-2 py-0.5 rounded-md">
                  {videoRef.current 
                    ? `${Math.floor(videoRef.current.currentTime / 60)}:${Math.floor(videoRef.current.currentTime % 60).toString().padStart(2, '0')}` 
                    : '0:00'} / {videoRef.current && !isNaN(videoRef.current.duration) ? `${Math.floor(videoRef.current.duration / 60)}:${Math.floor(videoRef.current.duration % 60).toString().padStart(2, '0')}` : '2:00'}
                </span>
              </div>

              {/* Play Button Overlay when paused */}
              {!isPlaying && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex flex-col items-center justify-center gap-2 z-20 transition-all pointer-events-auto">
                  <button 
                    id="video-play-layer-btn"
                    onClick={() => setIsPlaying(true)}
                    className="w-16 h-16 rounded-full bg-white/20 hover:bg-white/35 hover:scale-105 active:scale-95 transition-all flex items-center justify-center text-white border border-white/40 cursor-pointer shadow-lg"
                  >
                    <Play className="w-8 h-8 fill-white translate-x-1" />
                  </button>
                  <span className="text-slate-100 font-bold text-xs mt-1 drop-shadow-sm">
                    {isArabic ? "انقر للتشغيل والمشاهدة التوضيحية" : "Click to view laboratory demonstration"}
                  </span>
                  <span className="text-[10px] text-teal-400 font-bold uppercase tracking-widest font-mono">
                    {isArabic ? "لقطات حية معتمدة" : "REAL DEMO MATCHED"}
                  </span>
                </div>
              )}

              <div className="flex-1 pointer-events-none"></div>

              {/* Overlay Subtitle Transcript inside the screen */}
              <div className="bg-black/65 border border-slate-800 rounded-lg p-2.5 text-center backdrop-blur-xs max-w-lg mx-auto pointer-events-auto">
                <p className="text-xs font-semibold text-teal-300 dark:text-teal-200 leading-relaxed">
                  {activeTranscript}
                </p>
              </div>

            </div>

            {/* Simulated Video Scanline filter */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]"></div>
          </div>

          {/* Video Metadata & Interactive Transcript Navigation (4 cols) */}
          <div className="lg:col-span-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl p-4 border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest block select-none">
                {isArabic ? "فصول ومحاور المقطع" : "Interactive Lecture Segments"}
              </span>

              <div className="space-y-2">
                {(isArabic ? videoSegmentsAr : videoSegmentsEn).map((seg, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveSegmentIndex(idx);
                      if (videoRef.current) {
                        videoRef.current.currentTime = idx === 0 ? 0 : idx === 1 ? 40 : 80;
                      }
                      setIsPlaying(true);
                    }}
                    className={`w-full text-left p-2.5 rounded-lg border text-xs flex justify-between items-center transition-all cursor-pointer ${
                      activeSegmentIndex === idx
                        ? "bg-white dark:bg-slate-800 border-[#00478d]/30 text-[#00478d] dark:text-blue-300 shadow-sm font-bold"
                        : "bg-transparent border-transparent text-slate-600 dark:text-slate-450 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${activeSegmentIndex === idx ? "bg-teal-500 animate-pulse" : "bg-slate-350"}`}></span>
                      <span className="line-clamp-1">{seg.title}</span>
                    </div>
                    <span className="font-mono text-[9px] text-slate-400">{seg.time}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Live Controller Dashboard Row */}
            <div className="mt-6 border-t border-slate-200 dark:border-slate-700/60 pt-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                
                {/* Play controls toggle */}
                <div className="flex items-center gap-2">
                  <button
                    id="video-play-control-bar-btn"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-2 bg-[#00478d] hover:bg-[#005db6] text-white rounded-lg cursor-pointer transition-colors flex items-center justify-center"
                    title={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                  </button>

                  <button
                    id="video-reset-btn"
                    onClick={() => {
                      if (videoRef.current) {
                        videoRef.current.currentTime = 0;
                      }
                      setCurrentProgress(0);
                      setActiveSegmentIndex(0);
                    }}
                    className="p-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
                    title="Retry"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                  </button>
                </div>

                {/* Speed indicator */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">SPEED</span>
                  <button
                    id="video-speed-btn"
                    onClick={() => setPlaybackSpeed(s => s === 1 ? 1.5 : s === 1.5 ? 2 : 1)}
                    className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[10px] font-extrabold font-mono text-slate-600 dark:text-slate-300"
                  >
                    {playbackSpeed}x
                  </button>
                </div>

                {/* Mute button */}
                <button
                  id="video-mute-btn"
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1.5 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-colors flex items-center justify-center"
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-slate-500" />}
                </button>

              </div>

              {/* Interactive Audio Progress Slider */}
              <div className="flex items-center gap-2 select-none">
                <span className="text-[9px] font-mono text-slate-400">0%</span>
                <div 
                  id="video-track-slider-bar"
                  className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden relative cursor-pointer" 
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickedPercent = (e.clientX - rect.left) / rect.width;
                    if (videoRef.current && !isNaN(videoRef.current.duration)) {
                      videoRef.current.currentTime = clickedPercent * videoRef.current.duration;
                    }
                  }}
                >
                  <div className="h-full bg-teal-500" style={{ width: `${currentProgress}%` }}></div>
                </div>
                <span className="text-[9px] font-mono text-slate-400">100%</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Learning Objectives Panel */}
      <section className="bg-white dark:bg-slate-800 border-l-4 border-teal-500 dark:border-teal-500 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 relative overflow-hidden transition-colors">
        <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 mb-3">
          <ShieldCheck className="w-5 h-5 text-teal-500" />
          <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider">
            {isArabic ? "أهداف التعلم المستهدفة والتقييم" : "Learning Objectives & Performance Metrics"}
          </h3>
        </div>
        <ul className="list-disc list-inside text-xs sm:text-sm text-slate-650 dark:text-slate-300 space-y-2 marker:text-teal-500 ml-1 leading-relaxed">
          {objectivesList.map((obj, index) => (
            <li key={index}>{obj}</li>
          ))}
        </ul>
      </section>

      {/* Grid of Materials cards WITH FIXED IMAGES INSTEAD OF PLACEHOLDERS */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lesson.cards.map((card, index) => {
          const cardTitle = isArabic ? card.titleAr : card.title;
          const cardDesc = isArabic ? card.descAr : card.desc;

          return (
            <article 
              key={index} 
              className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col group hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
            >
              {/* RESTORED BEAUTIFUL ORIGINAL REAL PHOTOGRAPH IMAGES */}
              <div className="h-44 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 relative overflow-hidden flex items-center justify-center">
                {card.imageUrl ? (
                  <img 
                    src={card.imageUrl} 
                    alt={cardTitle} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <SchematicDiagram iconType={card.iconType} isArabic={isArabic} />
                )}
                {/* Subtle overlay for light/dark blending readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none"></div>
              </div>

              {/* Info section below diagram */}
              <div className="p-5 flex flex-col gap-1.5 flex-grow">
                <h4 className="text-sm font-black text-[#00478d] dark:text-blue-300 group-hover:text-blue-500 transition-colors font-headline-lg">{cardTitle}</h4>
                <p className="text-xs text-slate-650 dark:text-slate-100 leading-relaxed font-medium mt-1">
                  {cardDesc}
                </p>
              </div>
            </article>
          );
        })}
      </section>

      {/* Warning Callout Box */}
      <section className="bg-rose-50/40 dark:bg-red-950/10 rounded-xl p-5 border-l-4 border-rose-500 shadow-sm flex flex-col sm:flex-row gap-4 items-start border border-rose-200/40 dark:border-red-900/25">
        <div className="bg-rose-100 dark:bg-rose-950/30 rounded-full p-2.5 flex-shrink-0">
          <AlertTriangle className="w-5 h-5 text-rose-500 fill-rose-100 dark:fill-rose-950/20" />
        </div>
        <div className="flex flex-col gap-1">
          <h4 className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-rose-400 font-headline-lg">
            {warningTitle}
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {warningText}
          </p>
        </div>
      </section>

      {/* Scientific Citation info block */}
      <section className="pt-4 border-t border-slate-200 dark:border-slate-800 mt-4 text-slate-400 dark:text-slate-500">
        <h5 className="text-[10px] font-extrabold uppercase tracking-widest mb-1.5 text-slate-400">
          {isArabic ? "المرجع الفني واللوائح المعتمدة" : "Authorized Technical Guideline"}
        </h5>
        <p className="text-xs leading-relaxed max-w-2xl text-slate-500 dark:text-slate-400">
          {isArabic ? "اللوائح الفنية والمرجعية للفحص:" : "This curriculum aligns strictly with authorized regulatory norms:"}
          <span className="block font-semibold mt-1 text-[#00478d] dark:text-blue-400">{citationText}</span>
        </p>
      </section>

      {/* Dynamic CTA Footer action bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-4 pb-safe flex justify-center z-30 transition-colors">
        <div className="w-full max-w-2xl">
          <button 
            id={`continue-to-scen-${lesson.id}`}
            onClick={() => onContinueToScenario(lesson.scenarioId)}
            className="w-full h-12 bg-[#00478d] hover:bg-[#005db6] text-white font-bold rounded-xl shadow-md hover:shadow-lg flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer text-xs uppercase tracking-wider font-headline-lg"
          >
            <span>{isArabic ? "ابدأ التدريب والاختبار التفاعلي للسيناريو" : "Begin Interactive Drill Simulation"}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
