/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FlaskConical, 
  Microscope, 
  Fuel, 
  Droplet, 
  Utensils, 
  Lock, 
  ArrowLeft, 
  Clock, 
  BookOpen, 
  ChevronRight, 
  CheckCircle2, 
  Award,
  ShieldCheck
} from 'lucide-react';
import { LAB_LESSONS_DATA, DetailedLesson } from '../data';

interface LabsProps {
  isArabic: boolean;
  onSelectLesson: (lessonId: string) => void;
  lessons?: DetailedLesson[];
  labs?: any[];
}

const ICON_MAP = {
  FlaskConical: FlaskConical,
  Microscope: Microscope,
  Fuel: Fuel,
  Droplet: Droplet,
  Utensils: Utensils
};

export default function Labs({ isArabic, onSelectLesson, lessons = LAB_LESSONS_DATA, labs }: LabsProps) {
  const [selectedLab, setSelectedLab] = useState<'chemistry' | 'microbiology' | null>(null);
  
  const defaultLabsList = [
    {
      id: "chemistry",
      title: "Chemistry Lab",
      titleAr: "مختبر الكيمياء",
      desc: "Chemical interaction, emergency spill containment, and fume hood air calibration protocols.",
      descAr: "التعامل الكيميائي المعقد، والوقاية من الانسكابات، ومعايرة كبائن سحب الغازات السامة.",
      locked: false,
      logoColor: "text-blue-600 bg-blue-50 dark:bg-blue-900/20",
      icon: "FlaskConical"
    },
    {
      id: "microbiology",
      title: "Microbiology Lab",
      titleAr: "مختبر الأحياء الدقيقة",
      desc: "Biosafety barrier levels (BSL-1 to 4), pressure autoclave, and aseptic validation controls.",
      descAr: "مستويات الأمان الحيوي الأربعة، والتعقيم البخاري الموصد بالضغط والتحقق الميكروبي.",
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
      locked: true,
      logoColor: "text-slate-400 bg-slate-100 dark:bg-slate-800 dark:text-slate-500",
      icon: "Utensils"
    }
  ];

  const activeLabs = labs && labs.length > 0 ? labs : defaultLabsList;

  const labCards = activeLabs.map(lab => {
    const count = lessons.filter(l => l.labType === lab.id).length;
    const modulesText = isArabic 
      ? `${count} ${count >= 3 && count <= 10 ? 'مناهج' : 'منهج'}`
      : `${count} ${count === 1 ? 'MODULE' : 'MODULES'}`;

    return {
      id: lab.id,
      title: isArabic ? (lab.titleAr || lab.title) : lab.title,
      desc: isArabic ? (lab.descAr || lab.desc) : lab.desc,
      modulesCount: modulesText,
      progress: lab.id === 'chemistry' ? 33 : 0,
      locked: lab.locked,
      logoColor: lab.logoColor || (lab.locked ? "text-slate-400 bg-slate-100 dark:bg-slate-800 dark:text-slate-500" : "text-blue-600 bg-blue-50 dark:bg-blue-900/20"),
      icon: ICON_MAP[lab.icon as keyof typeof ICON_MAP] || FlaskConical
    };
  });

  // Render Lab Category Select Grid
  if (selectedLab === null) {
    return (
      <div id="labs-view-container" className="flex flex-col gap-6 w-full animate-fadeIn">
        
        {/* Selection Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-headline-lg text-[#00478d] dark:text-blue-405">
            {isArabic ? "مختبرات الأمان والتدريب" : "Choose your lab"}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            {isArabic ? "حدد المختبر المناسب للوصول إلى المناهج التفاعلية والسيناريوهات المعتمدة دولياً." : "Select the lab type you work in to explore authorized safety lessons and emergency drills."}
          </p>
        </div>

        {/* Grid of Labs Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {labCards.map((lab) => {
            const IconComp = lab.icon;
            
            if (lab.locked) {
              return (
                <div 
                  key={lab.id} 
                  className="bg-[#fcfcff] dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 relative opacity-70 cursor-not-allowed select-none"
                >
                  {/* Locked glass layer */}
                  <div className="absolute inset-0 bg-[#f9f9ff]/45 dark:bg-slate-900/40 z-10 rounded-2xl flex items-center justify-center backdrop-blur-[0.5px]">
                    <div className="bg-white rounded-full px-4 py-1.5 shadow-sm flex items-center gap-2 border border-slate-200">
                      <Lock className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        {isArabic ? "قريباً" : "Locked"}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <IconComp className="w-6 h-6 text-slate-400" />
                    </div>
                  </div>

                  <h3 className="text-md font-bold text-slate-400 dark:text-slate-500 mb-1.5">{lab.title}</h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mb-6 h-10 overflow-hidden leading-relaxed">{lab.desc}</p>
                  
                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-1">
                      <span>{isArabic ? "التقدم الحالي" : "Progress"}</span>
                      <span>0%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full"></div>
                  </div>
                </div>
              );
            }

            return (
              <div 
                key={lab.id}
                id={`lab-card-select-${lab.id}`}
                onClick={() => setSelectedLab(lab.id as 'chemistry' | 'microbiology')}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 hover:shadow-md transition-all cursor-pointer relative overflow-hidden group border-b-2 hover:border-b-blue-500 hover:-translate-y-0.5"
              >
                {/* Top abstract shape tint */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 dark:bg-blue-300/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className={`w-12 h-12 rounded-lg ${lab.logoColor} flex items-center justify-center`}>
                    <IconComp className="w-6 h-6" />
                  </div>
                  <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[9px] font-extrabold uppercase px-2 py-1 rounded">
                    {lab.modulesCount}
                  </span>
                </div>

                <h3 className="text-md font-bold text-slate-800 dark:text-white mb-1.5 relative z-10 group-hover:text-[#00478d] transition-colors">{lab.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 h-10 overflow-hidden leading-relaxed relative z-10">{lab.desc}</p>
                
                <div className="relative z-10">
                  <div className="flex justify-between text-[10px] font-bold text-slate-500 dark:text-slate-300 mb-1">
                    <span>{isArabic ? "التقدم الحالي" : "Progress"}</span>
                    <span>{lab.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-500 rounded-full" style={{ width: `${lab.progress}%` }}></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Render Lessons available inside the Selected Lab Category!
  const activeLessons = lessons && lessons.length > 0 ? lessons : LAB_LESSONS_DATA;
  const filteredLessons = activeLessons.filter(lesson => lesson.labType === selectedLab);
  const currentLabTitle = selectedLab === 'chemistry' 
    ? (isArabic ? "مناهج مختبر الكيمياء" : "Chemistry Lab Curriculum")
    : (isArabic ? "مناهج مختبر الأحياء الدقيقة" : "Microbiology Lab Curriculum");

  const currentLabSub = selectedLab === 'chemistry'
    ? (isArabic ? "٣ دروس تفاعلية مبنية على معايير إدارة السلامة الأمريكية (OSHA) والجمعية الوطنية للحماية من الحرائق (NFPA)." : "3 modules covering specialized gaseous containment, corrosives handling, and NFPA thermal safety standards.")
    : (isArabic ? "درسان متقدمان مبنيان على تصنيفات CDC/NIH وإرشادات التطهير والتعقيم الحيوية الصارمة." : "2 detailed biohazard safety modules built on CDC/NIH guidelines and sterile autoclaving loops.");

  return (
    <div id="lab-modules-container" className="flex flex-col gap-6 w-full animate-fadeIn pb-12">
      
      {/* Back to Lab selective view header button */}
      <button 
        onClick={() => setSelectedLab(null)}
        className="self-start flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{isArabic ? "العودة إلى أنواع المختبرات" : "Back to Lab Selection"}</span>
      </button>

      {/* Lab Header banner */}
      <header className="bg-gradient-to-r from-blue-50/50 to-[#edf4fc] dark:from-slate-800/40 dark:to-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700 p-6 shadow-sm">
        <h2 className="text-xl md:text-2xl font-bold font-headline-lg text-[#00478d] dark:text-blue-400">
          {currentLabTitle}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
          {currentLabSub}
        </p>
      </header>

      {/* Vertical Lessons Checklist modules block */}
      <div className="flex flex-col gap-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-450 select-none">
          {isArabic ? "المقررات التعليمية المتوفرة" : "Available Lessons"}
        </h3>

        <div className="grid grid-cols-1 gap-4">
          {filteredLessons.map((lesson, index) => {
            const lessonTitle = isArabic ? lesson.titleAr : lesson.title;
            const lessonCategory = isArabic ? lesson.categoryAr : lesson.category;
            const lessonDuration = isArabic ? lesson.durationAr : lesson.duration;
            const lessonObjectives = isArabic ? lesson.objectivesAr : lesson.objectives;

            return (
              <div 
                key={lesson.id}
                id={`lesson-row-card-${lesson.id}`}
                className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 md:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md hover:border-slate-350 dark:hover:border-slate-600 transition-all duration-300"
              >
                
                {/* Left Lesson Info column */}
                <div className="flex-1 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-50 dark:bg-blue-950/40 text-[#00478d] dark:text-blue-300 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded border border-[#00478d]/10 dark:border-blue-500/20">
                      {lessonCategory}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 font-bold">
                      <Clock className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                      <span>{lessonDuration}</span>
                    </span>
                  </div>

                  <h4 className="text-md font-bold text-slate-800 dark:text-white mt-1 group-hover:text-[#00478d] dark:group-hover:text-blue-350">
                    {lessonTitle}
                  </h4>

                  {/* Syllabus objective highlights list */}
                  <div className="mt-3 bg-slate-50/80 dark:bg-slate-900/40 p-3.5 rounded-xl border border-slate-100 dark:border-slate-700/60">
                    <span className="text-[10px] font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-300 block mb-1.5">
                      {isArabic ? "محاور السيرة العلمية للدرس" : "Syllabus Objectives"}
                    </span>
                    <ul className="text-xs text-slate-600 dark:text-slate-200 space-y-1.5 font-medium">
                      {lessonObjectives.map((obj, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                          <span className="leading-tight">{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Right Lesson Action button column */}
                <div className="flex shrink-0 md:flex-col md:items-end justify-between items-center gap-3">
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold bg-emerald-50 dark:bg-emerald-950/20 px-2.5 py-1 rounded-full border border-emerald-100 dark:border-emerald-900/40 font-mono">
                    {isArabic ? "مفعل ومتاح" : "100% Core"}
                  </span>

                  <button 
                    onClick={() => onSelectLesson(lesson.id)}
                    className="h-10 px-5 bg-[#00478d] hover:bg-[#005db6] text-white font-bold rounded-xl shadow-xs hover:shadow-sm flex items-center justify-center gap-1.5 transition-all active:scale-98 cursor-pointer text-xs"
                  >
                    <span>{isArabic ? "بدء دراسة البروتوكول" : "Start Learning"}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>
      
    </div>
  );
}
