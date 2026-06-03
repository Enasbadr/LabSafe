/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Shield, Sparkles, Microscope, Lock, RefreshCw, Star, Info, Sun, Moon, Laptop, Palette } from 'lucide-react';
import { UserState, ThemeMode } from '../types';

interface ProgressProps {
  user: UserState;
  isArabic: boolean;
  themeMode: ThemeMode;
  onThemeSelect: (theme: ThemeMode) => void;
  onStartRecommended: () => void;
}

export default function Progress({ user, isArabic, themeMode, onThemeSelect, onStartRecommended }: ProgressProps) {
  const [reviewItems, setReviewItems] = useState([
    { id: "review-1", title: isArabic ? "اختيار معدات الوقاية الشخصية" : "PPE Selection", isRefreshing: false },
    { id: "review-2", title: isArabic ? "عمليات غطاء محرك الدخان" : "Fume Hood Ops", isRefreshing: false }
  ]);

  const handleRefreshReview = (itemId: string) => {
    setReviewItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return { ...item, isRefreshing: true };
      }
      return item;
    }));

    setTimeout(() => {
      setReviewItems(prev => prev.map(item => {
        if (item.id === itemId) {
          return { ...item, isRefreshing: false };
        }
        return item;
      }));
    }, 800);
  };

  return (
    <div id="progress-tab-wrapper" className="flex flex-col gap-6 w-full animate-fadeIn">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold font-headline-lg text-slate-800 dark:text-white">
          {isArabic ? "مستوى تقدمك" : "Your Progress"}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          {isArabic ? "تابع رحلتك الأكاديمية لتحقيق شارة الباحث المعتمد لسلامة المختبرات." : "Track your journey to complete laboratory safety mastery."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Circle Progress Hero Banner (Level & XP) (Spans 2 cols) */}
        <div className="md:col-span-2 bg-surface-base rounded-2xl shadow-sm p-6 flex flex-col sm:flex-row items-center justify-between gap-6 border border-slate-200/50 dark:border-slate-800">
          <div className="flex-1 text-center sm:text-left">
            <span className="inline-flex items-center gap-1.5 bg-[#f0f3ff] dark:bg-slate-700 text-[#00478d] dark:text-blue-300 px-3.5 py-1 rounded-full text-[10px] font-extrabold uppercase mb-3">
              <Star className="w-3 h-3 text-[#00478d] fill-[#00478d]" />
              <span>{isArabic ? "الحالة الحالية" : "Current Status"}</span>
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-[#00478d] dark:text-blue-400">
              {isArabic ? `المستوى ١٤` : `Level ${user.level}`}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
              {isArabic ? "باحث سلامة أقدم" : "Senior Researcher"}
            </p>
          </div>

          {/* SVGs circle progression */}
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" className="stroke-slate-100 dark:stroke-slate-700" strokeWidth="6" />
              <circle 
                cx="50" 
                cy="50" 
                r="42" 
                fill="none" 
                className="stroke-teal-600 dark:stroke-teal-400" 
                strokeWidth="6" 
                strokeDasharray="263.8" 
                strokeDashoffset="39.5" // 85% XP progress
                strokeLinecap="round" 
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
              <span className="text-lg font-bold text-slate-800 dark:text-white">850</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">XP</span>
            </div>
          </div>
        </div>

        {/* Next Recommended Module (Spans 1 col) */}
        <div className="md:col-span-1 bg-[#00478d] dark:bg-[#003c78] text-white rounded-2xl shadow-sm p-6 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-28 h-28 bg-white/5 rounded-full blur-xl group-hover:opacity-10 transition-opacity"></div>
          
          <div>
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#79f4e5] mb-1 block">
              {isArabic ? "موصى به تالياً" : "Recommended Next"}
            </span>
            <h3 className="text-md font-bold mt-1">
              {isArabic ? "بروتوكول الانسكاب الكيميائي" : "Chemical Spill Protocol"}
            </h3>
            <p className="text-xs text-slate-200 mt-2 line-clamp-2 leading-relaxed">
              {isArabic ? "تعلم الخطوات الحرجة المعتمدة دولياً لاحتواء ومعادلة انسكابات السوائل الخطرة." : "Learn the critical steps for containing and neutralizing hazardous spills."}
            </p>
          </div>

          <button
            id="start-rec-from-progress-btn"
            onClick={onStartRecommended}
            className="mt-6 w-full bg-white hover:bg-slate-50 text-[#00478d] font-bold py-2.5 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>{isArabic ? "عرض السيناريو" : "Start Module"}</span>
          </button>
        </div>

        {/* Badges Section */}
        <div className="md:col-span-3 bg-surface-base rounded-2xl shadow-sm p-6 border border-slate-200/50 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">
            {isArabic ? "الشارات المكتسبة" : "Earned Badges"}
          </h3>
          <div className="flex overflow-x-auto gap-5 pb-1">
            {/* Badge 1 */}
            <div className="flex-shrink-0 w-24 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2 shadow-inner border border-amber-200/30">
                <Shield className="w-6 h-6 fill-amber-500" />
              </div>
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                {isArabic ? "بطل السلامة" : "Safety Hero"}
              </span>
              <span className="text-[9px] text-slate-400 mt-0.5">10 Modules</span>
            </div>

            {/* Badge 2 */}
            <div className="flex-shrink-0 w-24 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2 shadow-inner border border-emerald-250/30">
                <Sparkles className="w-6 h-6 fill-emerald-500" />
              </div>
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                {isArabic ? "المفكر السريع" : "Quick Thinker"}
              </span>
              <span className="text-[9px] text-slate-400 mt-0.5">Sub-1min Quiz</span>
            </div>

            {/* Badge 3 */}
            <div className="flex-shrink-0 w-24 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2 shadow-inner border border-blue-200/30">
                <Microscope className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                {isArabic ? "خبير الأحياء" : "Bio Master"}
              </span>
              <span className="text-[9px] text-slate-400 mt-0.5">Level 2</span>
            </div>

            {/* Locked placeholder */}
            <div className="flex-shrink-0 w-24 flex flex-col items-center text-center opacity-40">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 flex items-center justify-center mb-2">
                <Lock className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-slate-550 dark:text-slate-400">
                {isArabic ? "محترف المواد" : "Hazmat Pro"}
              </span>
              <span className="text-[9px] text-slate-400 mt-0.5">In Progress</span>
            </div>
          </div>
        </div>

        {/* Labs Completion rates progress columns */}
        <div className="md:col-span-2 bg-surface-base rounded-2xl shadow-sm p-6 border border-slate-200/50 dark:border-slate-800 flex flex-col gap-4">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-1">
            {isArabic ? "نسبة إتقان المهارات" : "Lab Mastery"}
          </h3>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-end mb-1">
                <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  {isArabic ? "قواعد السلامة العامة" : "General Safety Rules"}
                </span>
                <span className="text-xs font-bold text-teal-600 dark:text-teal-400">100%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-teal-500 w-full rounded-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-1">
                <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  {isArabic ? "المخاطر البيولوجية" : "Biological Hazards"}
                </span>
                <span className="text-xs font-bold text-teal-600 dark:text-teal-400">75%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-teal-500 w-[75%] rounded-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-1">
                <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  {isArabic ? "التعامل الكيميائي" : "Chemical Handling"}
                </span>
                <span className="text-xs font-bold text-teal-600 dark:text-teal-400">40%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-teal-500 w-[40%] rounded-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-1">
                <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  {isArabic ? "إجراءات مكافحة الحريق" : "Fire Procedures"}
                </span>
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500">0%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-teal-500 w-0 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Weak Areas of review list */}
        <div className="md:col-span-1 bg-red-500/[0.04] dark:bg-red-500/[0.02] rounded-2xl shadow-sm p-6 border border-rose-100 dark:border-rose-950 flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-4 h-4 text-rose-500" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-rose-400">
              {isArabic ? "مواضيع للمراجعة" : "Areas for Review"}
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
            {isArabic ? "بناء على استجاباتك ومجموع نقاطك السابقة." : "Based on your recent quiz performance."}
          </p>

          <div className="space-y-2 flex-grow">
            {reviewItems.map((item) => (
              <div key={item.id} className="bg-surface-base p-3 rounded-xl border border-slate-200/60 dark:border-slate-800 flex items-center justify-between shadow-sm">
                <span className="text-xs font-medium text-slate-750 dark:text-slate-200">{item.title}</span>
                <button 
                  type="button"
                  onClick={() => handleRefreshReview(item.id)}
                  aria-label="Refresh Item Review"
                  className="text-primary p-1.5 hover:bg-surface-subtle rounded-full transition-all cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${item.isRefreshing ? 'animate-spin' : ''}`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Theme settings picker widget (Bento component 6) */}
        <div className="md:col-span-3 bg-surface-base rounded-2xl shadow-sm p-6 border border-slate-200/50 dark:border-slate-800 transition-all hover:shadow-md">
          <div className="flex items-center gap-2.5 mb-5 border-b border-slate-200/50 dark:border-slate-800 pb-3">
            <Palette className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">
              {isArabic ? "إعدادات المظهر" : "Theme Settings"}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* Light Selection Mode */}
            <button
              id="light-theme-btn-select"
              type="button"
              onClick={() => onThemeSelect('light')}
              className={`flex items-center justify-between p-3.5 rounded-xl border-2 transition-all cursor-pointer ${
                themeMode === 'light' 
                  ? 'border-primary bg-primary/5 text-primary' 
                  : 'border-slate-200 dark:border-slate-800 bg-transparent text-slate-600 dark:text-slate-400'
              }`}
            >
              <div className="flex items-center gap-2 text-xs font-bold leading-none">
                <Sun className="w-4 h-4" />
                <span>{isArabic ? "مضيء" : "Light Mode"}</span>
              </div>
              {themeMode === 'light' && <CheckCircleIndicator />}
            </button>

            {/* Dark Selection Mode */}
            <button
              id="dark-theme-btn-select"
              type="button"
              onClick={() => onThemeSelect('dark')}
              className={`flex items-center justify-between p-3.5 rounded-xl border-2 transition-all cursor-pointer ${
                themeMode === 'dark' 
                  ? 'border-primary bg-primary/5 text-primary' 
                  : 'border-slate-200 dark:border-slate-800 bg-transparent text-slate-600 dark:text-slate-400'
              }`}
            >
              <div className="flex items-center gap-2 text-xs font-bold leading-none">
                <Moon className="w-4 h-4" />
                <span>{isArabic ? "مظلم" : "Dark Mode"}</span>
              </div>
              {themeMode === 'dark' && <CheckCircleIndicator />}
            </button>

            {/* System Default Selection Mode */}
            <button
              id="system-theme-btn-select"
              type="button"
              onClick={() => onThemeSelect('system')}
              className={`flex items-center justify-between p-3.5 rounded-xl border-2 transition-all cursor-pointer ${
                themeMode === 'system' 
                  ? 'border-primary bg-primary/5 text-primary' 
                  : 'border-slate-200 dark:border-slate-800 bg-transparent text-slate-600 dark:text-slate-400'
              }`}
            >
              <div className="flex items-center gap-2 text-xs font-bold leading-none">
                <Laptop className="w-4 h-4" />
                <span>{isArabic ? "افتراضي" : "System"}</span>
              </div>
              {themeMode === 'system' && <CheckCircleIndicator />}
            </button>

          </div>

          <p className="mt-4 text-[10px] text-slate-400 dark:text-slate-500 italic">
            {isArabic ? "أضف طابعك الشخصي المريح على عيونك وواجهتك العملية." : "Personalize your laboratory interface experience."}
          </p>
        </div>

      </div>

    </div>
  );
}

function CheckCircleIndicator() {
  return (
    <div className="w-2.5 h-2.5 rounded-full bg-teal-500"></div>
  );
}
