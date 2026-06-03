/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, HelpCircle, Check, Loader2, Award, BookOpen, AlertTriangle, RefreshCw, ArrowRight, X } from 'lucide-react';
import { DRILL_SCENARIOS } from '../data';
import { ScenarioQuestion } from '../types';

interface ScenarioQuizProps {
  isArabic: boolean;
  scoreXP: number;
  setScoreXP: (xp: any) => void;
  onExit: () => void;
  onGoToLesson: () => void;
  initialScenarioId?: string;
}

export default function ScenarioQuiz({ isArabic, scoreXP, setScoreXP, onExit, onGoToLesson, initialScenarioId }: ScenarioQuizProps) {
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    if (initialScenarioId) {
      const idx = DRILL_SCENARIOS.findIndex(q => q.id === initialScenarioId);
      if (idx !== -1) {
        setCurrentIdx(idx);
      }
    }
  }, [initialScenarioId]);

  const activeQuestion: ScenarioQuestion = DRILL_SCENARIOS[currentIdx] || DRILL_SCENARIOS[0];

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [feedbackState, setFeedbackState] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [showHint, setShowHint] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);

  const progressPercent = Math.round(((currentIdx + 1) / DRILL_SCENARIOS.length) * 100);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedId) return;

    setIsVerifying(true);
    
    // Simulate high-fidelity clinical verification loading delay
    setTimeout(() => {
      setIsVerifying(false);
      if (selectedId === activeQuestion.correctOptionId) {
        setFeedbackState('correct');
        // Increase user XP
        setScoreXP((prev: number) => prev + 10);
      } else {
        setFeedbackState('incorrect');
      }
    }, 1100);
  };

  const handleRetry = () => {
    setSelectedId(null);
    setFeedbackState('idle');
  };

  const handleContinue = () => {
    // Reset state & load next question if exists, else trigger complete
    setSelectedId(null);
    setFeedbackState('idle');
    if (currentIdx < DRILL_SCENARIOS.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      // Completed drill, trigger custom congratulations popover
      setShowCongrats(true);
    }
  };

  return (
    <div id="quiz-scenario-outer" className="flex flex-col gap-6 w-full animate-fadeIn pb-12">
      
      {/* Top Navigation Back-Home/Help header */}
      <header className="w-full flex items-center justify-between px-2 py-1 sticky top-0 bg-[#f9f9ff] dark:bg-slate-900 z-30">
        <button 
          id="exit-quiz-btn"
          onClick={onExit} 
          className="text-slate-500 hover:text-slate-800 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex-1 px-5">
          <div className="flex justify-between items-center mb-1 select-none">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {isArabic ? `السيناريو ${currentIdx + 1} من ${DRILL_SCENARIOS.length}` : `Scenario ${currentIdx + 1} of ${DRILL_SCENARIOS.length}`}
            </span>
            <span className="text-xs text-[#00478d] dark:text-blue-400 font-extrabold">{progressPercent}%</span>
          </div>

          <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden w-full">
            <div 
              className="h-full bg-teal-600 dark:bg-teal-400 transition-all duration-500 ease-out rounded-full" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        <button 
          id="help-drill-trigger-btn"
          onClick={() => setShowHint(true)}
          className="text-slate-500 hover:text-slate-800 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center cursor-pointer"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
      </header>

      <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto flex flex-col gap-6">
        
        {/* Urgent Emergency Alert label */}
        <div className="bg-red-50 dark:bg-red-950/20 text-[#ba1a1a] dark:text-[#ffdad6] p-4 rounded-xl flex items-center gap-3 shadow-sm border border-red-200/40 dark:border-red-900/30">
          <ShieldAlert className="w-6 h-6 text-red-600 dark:text-rose-500 shrink-0 fill-red-100 dark:fill-red-950" />
          <h1 className="text-sm font-bold uppercase tracking-wide">
            {isArabic ? "حالة طارئة: انسكاب أحادي للمواد" : activeQuestion.title}
          </h1>
        </div>

        {/* Dynamic Image Illustration frame */}
        <div className="w-full aspect-[16/9] bg-[#e7eefe] dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm relative flex items-center justify-center border border-slate-200">
          <img
            src={activeQuestion.imageUrl}
            alt="Safety drill dynamic scene"
            className="w-full h-full object-cover opacity-90 mix-blend-multiply dark:mix-blend-normal"
            referrerPolicy="no-referrer"
          />

          {/* Pulse light overlay */}
          <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md px-3.5 py-1 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">
              {isArabic ? "بث حي ومباشر" : "Live Scenario"}
            </span>
          </div>
        </div>

        {/* Question scenario title */}
        <div>
          <p className="text-md sm:text-lg font-bold text-slate-800 dark:text-white leading-relaxed">
            {activeQuestion.scenarioText}
          </p>
        </div>

        {/* Options Selection radio grid list */}
        <div id="option-cards-container" className="flex flex-col gap-3">
          {activeQuestion.options.map((opt) => {
            const isSelected = selectedId === opt.id;
            
            return (
              <label
                key={opt.id}
                className={`relative flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer group shadow-sm select-none ${
                  isSelected 
                    ? 'border-[#00478d] bg-[#f0f3ff] dark:bg-[#00478d]/15 shadow-sm' 
                    : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 border-slate-200 dark:border-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="scenario_choice"
                  value={opt.id}
                  checked={isSelected}
                  onChange={() => {
                    if (feedbackState === 'idle') {
                       setSelectedId(opt.id);
                    }
                  }}
                  disabled={feedbackState !== 'idle' || isVerifying}
                  className="mt-1 w-4.5 h-4.5 text-[#00478d] border-slate-300 focus:ring-[#00478d] cursor-pointer"
                />

                <div className="flex-1 text-slate-900 dark:text-slate-100 font-sans">
                  <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white block mb-1">
                    {opt.text}
                  </span>
                  <span className="text-2xs sm:text-xs text-slate-500 dark:text-slate-300 block leading-normal">
                    {opt.explanation}
                  </span>
                </div>
              </label>
            );
          })}
        </div>

        {/* Trigger Submit block button */}
        {feedbackState === 'idle' && (
          <div className="mt-4">
            <button
              id="submit-drill-choice-btn"
              type="submit"
              disabled={!selectedId || isVerifying}
              className={`w-full h-14 font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wide cursor-pointer ${
                !selectedId || isVerifying
                  ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-none'
                  : 'bg-[#00478d] hover:bg-[#005db6] text-white active:scale-[0.98]'
              }`}
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>{isArabic ? "جاري التحقق العلمي..." : "Verifying..."}</span>
                </>
              ) : (
                <>
                  <span>{isArabic ? "طلب وتحقق" : "Submit Answer"}</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </>
              )}
            </button>
          </div>
        )}

      </form>

      {/* high fidelity modal for CORRECT / INCORRECT prompt overlays */}
      <AnimatePresence>
        {feedbackState === 'correct' && (
          <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-800 max-w-[550px] w-full rounded-2xl shadow-xl overflow-hidden border border-[#10B981] flex flex-col"
            >
              {/* Header Green Backdrop banner */}
              <div className="bg-[#10B981]/10 px-6 py-8 flex flex-col items-center justify-center text-center border-b border-[#10B981]/20">
                <div className="h-16 w-16 rounded-full bg-[#10B981] flex items-center justify-center mb-3 shadow">
                  <Check className="w-8 h-8 text-white stroke-[3px]" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold font-headline-lg text-[#10B981] mb-1">
                  {isArabic ? "صحيح وآمن!" : "Correct!"}
                </h2>
                
                <div className="inline-flex items-center gap-1 bg-white dark:bg-slate-700 px-3.5 py-1 rounded-full shadow-sm mt-2 text-xs font-bold text-teal-600 uppercase tracking-widest">
                  <span>+10 XP</span>
                </div>
              </div>

              {/* Explain panel details */}
              <div className="p-6 space-y-4 max-h-[300px] overflow-y-auto">
                <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-left">
                  <div className="flex items-center gap-1.5 text-[#00478d] dark:text-blue-400 mb-1">
                    <BookOpen className="w-4 h-4 text-[#00478d] dark:text-blue-400" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-100">{isArabic ? "لماذا هذا صحيح" : "Why it works"}</h4>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-200 leading-relaxed">
                    {activeQuestion.options.find(o => o.id === activeQuestion.correctOptionId)?.explanation}
                  </p>
                </div>

                {activeQuestion.dangerAlert && (
                  <div className="bg-rose-500/[0.04] border-l-4 border-rose-500 p-4 rounded-r-xl">
                    <h5 className="text-2xs font-extrabold uppercase text-rose-600 mb-1 tracking-wider">
                      {isArabic ? "خطورة الإهمال" : activeQuestion.dangerAlert.title}
                    </h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {activeQuestion.dangerAlert.text}
                    </p>
                  </div>
                )}

                {/* References scientific card */}
                <div className="bg-slate-100 dark:bg-slate-700 text-slate-500 text-2xs p-3.5 rounded-lg">
                  <p className="font-bold uppercase tracking-wider text-[#00478d] mb-1">Standard Reference</p>
                  <p>{activeQuestion.standardCitation}</p>
                </div>
              </div>

              {/* Bottom CTA to reset state or progress */}
              <div className="p-6 pt-0 mt-auto">
                <button
                  id="drill-proceed-correct-btn"
                  onClick={handleContinue}
                  className="w-full h-13 bg-[#00478d] hover:bg-[#005db6] text-white font-bold rounded-xl flex items-center justify-center gap-1 transition-all active:scale-[0.98] cursor-pointer text-xs uppercase"
                >
                  <span>{isArabic ? "المتابعة للفحص التالي" : "Continue"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </motion.div>
          </div>
        )}

        {feedbackState === 'incorrect' && (
          <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-800 max-w-[550px] w-full rounded-2xl shadow-xl overflow-hidden border border-[#ba1a1a] flex flex-col"
            >
              
              {/* Header Wrong alert panel details */}
              <div className="px-6 py-8 flex flex-col items-center justify-center text-center border-b border-rose-100 dark:border-rose-950/20">
                <div className="h-14 w-14 rounded-full bg-rose-100 dark:bg-rose-950/20 text-[#ba1a1a] flex items-center justify-center mb-3">
                  <span className="text-3xl">⚠️</span>
                </div>
                <h2 className="text-lg md:text-xl font-bold text-slate-800 dark:text-white">
                  {isArabic ? "غير آمن تماماً!" : "Not Quite Safe"}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1">
                  {isArabic 
                    ? "الماء يزيد انسكابات المواد المشتعلة تفتيتاً. استخدام مطافح فئة أ على كحول مذاب فئة ب يضاعف نطاق الخطر المعملي."
                    : "Water spreads chemical fires. Using a Class A water extinguisher on a Class B solvent fire rapidly expands the hazard area."}
                </p>
              </div>

              {/* Correct action guidance list */}
              <div className="p-6 space-y-4 max-h-[300px] overflow-y-auto select-none font-sans">
                <div className="bg-[#f0f3ff] dark:bg-slate-900/60 rounded-xl p-4 border border-[#00478d]/10 dark:border-slate-700 text-left">
                  <div className="flex items-center gap-1 text-[#00478d] dark:text-blue-400 mb-1">
                    <Check className="w-4 h-4 text-emerald-500 stroke-[3px]" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-100">{isArabic ? "الإجراء السليم الآمن" : "Correct Procedure"}</h4>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                    {isArabic 
                      ? "للحرائق المذيبة (فئة B)، افصل صمام الغاز المركزي فوراً واستخدم مطفأة غاز ثاني أكسيد الكربون CO2 أو المسحوق الجاف الجاف."
                      : "For solvent or chemical fires (Class B), immediately locate and deploy a CO2 or Dry Chemical fire extinguisher. If uncontrollable, hit the emergency gas shutoff and evacuate."}
                  </p>
                </div>

                <a 
                  href="#osha" 
                  onClick={(e) => { e.preventDefault(); onGoToLesson(); }} 
                  className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#00478d] dark:text-blue-300 uppercase hover:underline text-center cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>{isArabic ? "عرض معايير OSHA القياسية ١٩١٠.١٥٧" : "View OSHA Standard 1910.157"}</span>
                </a>
              </div>

              {/* Modal footer with retry options and Study slide redirect */}
              <div className="p-6 pt-0 mt-auto flex flex-col sm:flex-row gap-3">
                <button
                  id="drill-retry-scen-btn"
                  onClick={handleRetry}
                  className="flex-1 h-13 rounded-xl border-2 border-[#00478d] dark:border-blue-500/50 text-[#00478d] dark:text-blue-300 font-bold text-xs flex items-center justify-center gap-1 hover:bg-slate-50 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>{isArabic ? "إعادة المحاولة" : "Retry Scenario"}</span>
                </button>
                <button
                  id="drill-redirect-to-lesson-btn"
                  onClick={onGoToLesson}
                  className="flex-1 h-13 rounded-xl bg-[#00478d] hover:bg-[#005db6] text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>{isArabic ? "الرجوع للوحدة التعليمية" : "Continue to Lesson"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Dynamic Instruction Tooltip / Hint Modal */}
      <AnimatePresence>
        {showHint && (
          <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 animate-fadeIn" onClick={() => setShowHint(false)}>
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-700 text-center flex flex-col items-center gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 text-[#00478d] dark:text-blue-300 flex items-center justify-center">
                <HelpCircle className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-sm font-extrabold uppercase tracking-wide text-slate-800 dark:text-slate-200">
                {isArabic ? "تلميح وإرشاد السلامة" : "Laboratory Safety Tip"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans select-none">
                {isArabic 
                  ? "تلميح: اقرأ بعناية أوراق SDS ومراجع SOP لحساب موازنة كتل الأجهزة وسرعة السحب الصحيحة."
                  : "Tip: Consult standard SDS safety sheets, calibration guidelines, and centrifuge weight balancing rules to solve."}
              </p>
              <button
                type="button"
                onClick={() => setShowHint(false)}
                className="w-full h-11 bg-[#00478d] hover:bg-[#005db6] text-white rounded-xl font-bold text-xs select-none cursor-pointer"
              >
                {isArabic ? "موافق" : "Got It"}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* End of Drill Congrats Celebration Modal */}
      <AnimatePresence>
        {showCongrats && (
          <div className="fixed inset-0 bg-slate-900/70 z-50 flex items-center justify-center p-4 animate-fadeIn">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-800 rounded-2xl max-w-sm w-full p-8 shadow-2xl border border-teal-100 dark:border-teal-900/30 text-center flex flex-col items-center gap-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-16 h-16 rounded-full bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-1">
                <Award className="w-10 h-10 animate-bounce" />
              </div>
              <h3 className="text-xl font-black text-slate-800 dark:text-white font-headline-lg select-none">
                {isArabic ? "تهانينا! أكملت التدريب" : "Outstanding Progress!"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-300 leading-relaxed font-sans select-none">
                {isArabic 
                  ? "لقد نجحت في معالجة وحل جميع سيناريوهات محاكاة لابسيف لسلامة المختبرات الصارمة!"
                  : "Excellent job! You have completed all high-velocity drills and emergency scenarios successfully."}
              </p>
              
              <div className="bg-teal-50/60 dark:bg-teal-950/20 px-4 py-2.5 rounded-lg border border-teal-100/40 text-xs text-teal-700 dark:text-teal-400 font-extrabold flex items-center gap-1.5 select-none animate-pulse">
                <span>⭐ +100 XP REWARD</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowCongrats(false);
                  onExit();
                }}
                className="w-full h-12 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-xs cursor-pointer select-none"
              >
                {isArabic ? "الخروج للقائمة الرئيسية" : "Claim Reward & Return"}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
