/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Flame, Play, Clock, ArrowRight, Award } from 'lucide-react';
import { UserState } from '../types';
import { LAB_LESSONS_DATA, DetailedLesson } from '../data';

interface DashboardProps {
  user: UserState;
  isArabic: boolean;
  onLaunchChallenge: () => void;
  onResumeLesson: () => void;
  onNavigate: (view: any) => void;
  onSelectLesson: (id: string) => void;
  lessons?: DetailedLesson[];
}

export default function Dashboard({ user, isArabic, onLaunchChallenge, onResumeLesson, onNavigate, onSelectLesson, lessons = LAB_LESSONS_DATA }: DashboardProps) {
  
  const activeLessons = lessons && lessons.length > 0 ? lessons : LAB_LESSONS_DATA;

  // Pick specific items from real lessons dataset for recommendations
  const recommendedItems = [
    {
      lessonId: "chem-l1",
      emoji: "🥽",
      lessonObj: activeLessons.find(l => l.id === "chem-l1") || activeLessons[0]
    },
    {
      lessonId: "micro-l1",
      emoji: "☣️",
      lessonObj: activeLessons.find(l => l.id === "micro-l1") || activeLessons[2] || activeLessons[0]
    },
    {
      lessonId: "chem-l2",
      emoji: "🧪",
      lessonObj: activeLessons.find(l => l.id === "chem-l2") || activeLessons[1] || activeLessons[0]
    }
  ];

  return (
    <div id="dashboard-view-main" className="flex flex-col gap-6 w-full animate-fadeIn text-slate-900 dark:text-slate-100">
      
      {/* Top Welcome Title & Streak */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-headline-lg text-slate-900 dark:text-white">
            {isArabic ? `صباح الخير، أحمد` : `Good morning, Ahmed`}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
            {isArabic ? "جاهز لفحوصات السلامة اليوم؟" : "Ready for today's safety checks?"}
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
          <Flame className="w-5 h-5 text-amber-500 fill-amber-500 animate-pulse" />
          <span className="text-sm font-bold text-slate-800 dark:text-slate-300">
            {isArabic ? "١٢ يوم متتالي" : `${user.streakDays} Day Streak`}
          </span>
        </div>
      </div>

      {/* Grid: Stats Progress + Daily Challenge */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        
        {/* Progress summary card (8 cols on desktop) */}
        <div className="md:col-span-8 bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md transition-all p-6 flex flex-col justify-between relative overflow-hidden group border border-slate-100 dark:border-slate-700">
          {/* Decorative Blur Blob */}
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#005eb8]/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500"></div>

          <div className="flex justify-between items-start relative z-10">
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                {isArabic ? "مستوى باحث ١٤" : `Level ${user.level} Researcher`}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {isArabic ? "بروتوكول السحب المتقدم للماصات بيبتنج" : "Advanced Pipetting Protocol"}
              </p>
            </div>
            
            <div className="bg-[#f0f3ff] dark:bg-slate-700 rounded-full px-3.5 py-1.5 border border-[#005eb8]/20 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#00478d] dark:text-blue-300" />
              <span className="text-xs font-bold text-[#00478d] dark:text-blue-200">
                {user.xp} / {user.xpNextLevel} XP
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 relative z-10 mt-8">
            <div className="flex justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              <span>{isArabic ? "التقدم للمستوى التالي ١٥" : "Progress to Level 15"}</span>
              <span>85%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-teal-600 dark:bg-teal-500 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>
        </div>

        {/* Daily Challenge launcher (4 cols) */}
        <div className="md:col-span-4 bg-[#00478d] dark:bg-blue-950/80 rounded-xl shadow-md p-6 flex flex-col text-white border border-[#00478d]/20 dark:border-blue-800/40 relative overflow-hidden">
          <div className="absolute top-2 right-2 opacity-15">
            <Flame className="w-24 h-24 stroke-[1]" />
          </div>

          <div className="z-10 flex-1">
            <span className="text-[9px] font-extrabold uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-md inline-block mb-1">
              {isArabic ? "التحدي اليومي" : "Daily Challenge"}
            </span>
            <h3 className="text-md font-bold mt-1 text-white">
              {isArabic ? "الاستجابة للانسكابات الكيميائية" : "Chemical Spill Response"}
            </h3>
            <p className="text-xs text-slate-200 mt-1.5 line-clamp-2 leading-relaxed">
              {isArabic ? "اختبر سرعة تفاعلك في سيناريو مصمم حول انسكابات الحوامض." : "Test your reaction time in a simulated acid spill scenario."}
            </p>
          </div>

          <button
            id="start-challenge-dashboard-btn"
            onClick={onLaunchChallenge}
            className="mt-6 bg-white hover:bg-slate-50 text-[#00478d] font-bold py-2.5 px-4 rounded-lg shadow-sm transition-colors text-xs text-center cursor-pointer w-full z-10"
          >
            {isArabic ? "ابدأ التحدي (+٥٠)" : "Start Challenge (+50 XP)"}
          </button>
        </div>

      </div>

      {/* Primary In-Progress Module Section */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row overflow-hidden border border-slate-200 dark:border-slate-700 group">
        
        {/* Frame Thumbnail */}
        <div className="md:w-1/3 h-44 md:h-auto relative overflow-hidden">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-oMrDxrHNLiNtYKrNMqXQ0-oXt1fGafqA69BHcwjw3vER9M4VbeTLjv9td1vWQLciJmyyggMvFcQ4nfN9ir_Byx1gjZJ0DQ9VEkxVzwRZ0ZJnyvtlHCt8rLigey6vtd2pdFAVi-4Yve9z9QOo7zmvR-bIkhrBGBl3Q2nriuusVDHKWmsE6nDWR2_t5DvBpbsDyuPheI_y_NX9_uSnYZl6wGLSSEbMpTcZhPWp_5GJ-DoZ7rU0FZx0A_AD6g5dQTVuHad61ZGIfKgQ"
            alt="Lab centrifuge equipment"
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4 md:hidden">
            <span className="bg-white text-slate-800 px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide">
              {isArabic ? "مستمر" : "In Progress"}
            </span>
          </div>
        </div>

        {/* Content detail */}
        <div className="p-6 md:p-8 flex flex-col justify-between flex-1 gap-2">
          
          <div className="hidden md:flex items-center gap-2">
            <span className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-2.5 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wide">
              {isArabic ? "مستمر" : "In Progress"}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {isArabic ? "تبقّى ١٢ دقيقة" : "12 mins left"}
            </span>
          </div>

          <div className="flex-1 mt-2 md:mt-0">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              {isArabic ? "التعامل مع المواد الأكالة والأحماض" : "Handling Corrosive Materials"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 md:max-w-xl">
              {isArabic 
                ? "الوحدة الثالثة: التدرب على الاختيار الصحيح لمعدات الحماية الشخصية وسبل عزل وتخزين أحماض البيئة المعملية." 
                : "Module 3: Proper PPE selection and disposal procedures for highly acidic compounds."}
            </p>
          </div>

          {/* Action Row */}
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex-1 w-full mr-4 hidden md:block">
              <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-[#00478d] rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>

            <button
              id="resume-lesson-dashboard-btn"
              onClick={onResumeLesson}
              className="bg-[#00478d] hover:bg-[#005db6] text-white px-6 py-3 rounded-lg font-bold transition-all text-xs w-full md:w-auto flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] cursor-pointer"
            >
              <span>{isArabic ? "استئناف الفحص" : "Resume Lesson"}</span>
              <Play className="w-3.5 h-3.5 fill-white" />
            </button>
          </div>

        </div>

      </div>

      {/* Recommended Lessons Section */}
      <section className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-md font-bold text-slate-800 dark:text-white">
            {isArabic ? "دروس مقترحة لك" : "Recommended Lessons"}
          </h2>
          <button 
            id="view-all-recommended-btn"
            onClick={() => onNavigate('labs')}
            className="text-[#00478d] dark:text-blue-400 text-xs font-bold hover:underline cursor-pointer"
          >
            {isArabic ? "عرض الكل" : "View All"}
          </button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
          
          {recommendedItems.map((item) => {
            const lessonObj = item.lessonObj;
            const title = isArabic ? lessonObj.titleAr : lessonObj.title;
            const duration = isArabic ? lessonObj.durationAr : lessonObj.duration;
            const category = isArabic ? lessonObj.categoryAr : lessonObj.category;

            return (
              <div
                key={lessonObj.id}
                id={`recommended-card-${lessonObj.id}`}
                className="min-w-[250px] bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col overflow-hidden shrink-0 p-4 hover:shadow-md transition-all group cursor-pointer border-b-2 hover:border-b-[#00478d] dark:hover:border-b-blue-400"
                onClick={() => onSelectLesson(lessonObj.id)}
              >
                <div className="h-28 bg-[#f5f8ff] dark:bg-slate-900/50 rounded-lg flex items-center justify-center relative select-none">
                  <span className="text-4xl">{item.emoji}</span>
                  <span className="absolute bottom-2 right-2 bg-white/95 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 px-2 py-0.5 rounded text-[10px] font-bold">
                    {duration}
                  </span>
                </div>

                <div className="flex-1 flex flex-col gap-1.5 mt-3">
                  <span className="text-[10px] font-extrabold text-teal-600 dark:text-teal-400 uppercase tracking-widest">
                    {category}
                  </span>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight line-clamp-2 group-hover:text-[#00478d] dark:group-hover:text-blue-300 transition-colors">
                    {title}
                  </h4>
                  
                  <button className="mt-auto text-[#00478d] dark:text-blue-300 text-[10px] font-bold flex items-center gap-1 hover:underline cursor-pointer w-max pt-2">
                    <span>{isArabic ? "ابدأ الدرس" : "Start Core Lesson"}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}

        </div>
      </section>

    </div>
  );
}
