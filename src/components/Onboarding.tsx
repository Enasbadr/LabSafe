/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Bolt, Sparkles, BookOpen, Clock, AlertTriangle, ArrowRight, CheckCircle, Globe } from 'lucide-react';
import { ARABIC_DICTIONARY } from '../data';

interface OnboardingProps {
  onComplete: () => void;
  isArabic: boolean;
  setIsArabic: (val: boolean) => void;
}

export default function Onboarding({ onComplete, isArabic, setIsArabic }: OnboardingProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const dict = isArabic ? ARABIC_DICTIONARY : {
    appName: "LabSafe",
    tagline: "Learn lab safety through real scenarios",
    skip: "Skip",
    continue: "Continue",
    welcomeTitle: "Welcome to LabSafe",
    welcomeSub: "A guided safety learning experience for laboratories.",
    learnTitle: "Learn by Doing",
    learnSub: "Engage with mini-lessons, realistic lab scenarios, and get instant feedback based on scientific standards.",
    miniLessons: "Mini Lessons",
    interScen: "Interactive Scenarios",
    instFeed: "Instant Feedback",
    masterTitle: "Master Lab Safety",
    masterSub: "Earn XP, unlock specialized badges, and build your profile as a certified safety expert.",
    initializing: "Initializing",
    getStarted: "Get Started"
  };

  const handleNext = () => {
    if (step === 1) setStep(2);
    else if (step === 2) setStep(3);
    else onComplete();
  };

  return (
    <div id="onboarding-container" className="min-h-screen bg-[#f9f9ff] text-[#151c27] flex flex-col items-center justify-between relative overflow-hidden px-4 py-8">
      
      {/* Decorative Blur Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-[#005eb8]/10 rounded-full blur-3xl pointer-events-none animate-pulse duration-3000"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-[#79f4e5]/10 rounded-full blur-3xl pointer-events-none animate-pulse duration-[4000ms]"></div>

      {/* Language Switch Top Corner */}
      <div className="w-full max-w-md flex justify-between items-center z-10">
        <button
          id="lang-toggle-btn"
          onClick={() => setIsArabic(!isArabic)}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-200 bg-white text-[#00478d] font-semibold text-xs hover:bg-[#f0f3ff] transition-all shadow-sm cursor-pointer z-20"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>{isArabic ? "English" : "العربية"}</span>
        </button>

        {step < 3 && (
          <button
            id="skip-onboarding-btn"
            onClick={onComplete}
            className="text-xs font-semibold text-slate-500 hover:text-[#00478d] transition-colors py-1.5 px-4 rounded-full hover:bg-slate-100 cursor-pointer"
          >
            {dict.skip}
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="onboard-1"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-sm flex flex-col items-center flex-grow justify-center py-6 text-center z-10"
          >
            {/* Aspect Square Image Frame */}
            <div className="w-full aspect-square max-w-[300px] rounded-2xl bg-white shadow-md border border-slate-100 p-6 flex items-center justify-center relative overflow-hidden group mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-[#005eb8]/5 to-transparent transition-opacity duration-500"></div>
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBCubHeBTudmShg1Szw6wPPdcFArmOyRdRJ4TG3n9Q-yHZx8sgVnZHOsZw6JHIynoqMQCJWm7mk8zlLC-DIXgs2ZHkDYcI4FGmJytIX6usGoznHkd7gLUiUDty-FyQcYicdOfNUJipwnbFJwquaecEfYVoq8pplLpXkrPWpKmvMXJ_qyIRZvH95uM9p9e2DBkIVJnBQu-jcRC4b-us5bwEUoGCA0vcLdwnAfbswjL9adpBDonIqvGIIZhZMwh6S_KmYoBygaM-McCIb"
                alt="Professional lab safety"
                className="w-full h-full object-cover rounded-xl shadow-sm z-10"
                referrerPolicy="no-referrer"
              />
            </div>

            <h1 className="text-2xl md:text-3xl font-bold font-headline-lg text-[#00478d] mb-3 tracking-tight">
              {dict.welcomeTitle}
            </h1>
            <p className="text-slate-600 max-w-[280px] text-sm leading-relaxed">
              {dict.welcomeSub}
            </p>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="onboard-2"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-sm flex flex-col items-center flex-grow justify-center py-6 text-center z-10"
          >
            {/* Split Screen Simulated Card Frame */}
            <div className="w-full max-w-[290px] aspect-[4/5] bg-white rounded-xl shadow-md border border-slate-200 flex flex-col overflow-hidden mb-8 relative">
              {/* Top Half: Mini Lesson Mockup */}
              <div className="flex-1 bg-[#f0f3ff] p-4 flex flex-col gap-2 border-b border-slate-100 text-left relative overflow-hidden">
                <div className="flex items-center gap-1.5 text-[#00478d] font-bold text-[10px] tracking-wider uppercase">
                  <BookOpen className="w-3 h-3 text-[#00478d]" />
                  <span>LESSON 1.2</span>
                </div>
                {/* Simulated blocks */}
                <div className="h-3.5 w-3/4 bg-slate-300 rounded mt-1 animate-pulse"></div>
                <div className="h-2 w-full bg-slate-200 rounded mt-2"></div>
                <div className="h-2 w-5/6 bg-slate-200 rounded"></div>
                <div className="h-2 w-2/3 bg-slate-200 rounded"></div>
              </div>

              {/* Bottom Half: Scenarios Mockup with selection */}
              <div className="flex-1 bg-white p-4 flex flex-col gap-2 text-left relative overflow-hidden justify-between">
                <div className="flex items-center gap-1.5 text-amber-600 font-bold text-[10px] tracking-wider uppercase">
                  <AlertTriangle className="w-3 h-3 text-amber-500" />
                  <span>Chemical Spill</span>
                </div>
                <div className="h-2.5 w-full bg-slate-200 rounded"></div>

                <div className="flex flex-col gap-1.5 w-full mt-2">
                  <div className="w-full h-8 border border-slate-200 rounded-lg flex items-center px-2.5 gap-2 bg-[#f9f9ff]">
                    <div className="w-3.5 h-3.5 rounded-full border border-slate-300 flex-shrink-0"></div>
                    <div className="h-1.5 w-1/2 bg-slate-300 rounded"></div>
                  </div>
                  {/* Active selected state with badge */}
                  <div className="w-full h-8 border border-[#10B981] rounded-lg flex items-center px-2.5 gap-2 bg-[#10B981]/5 relative">
                    <CheckCircle className="w-3.5 h-3.5 text-[#10B981] flex-shrink-0" />
                    <div className="h-1.5 w-1/2 bg-[#10B981]/60 rounded"></div>
                    <span className="absolute right-2 text-[8px] font-bold text-[#10B981] tracking-wide">+10 XP</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Badges Flow */}
            <div className="flex flex-wrap justify-center gap-1.5 mb-5 max-w-[320px]">
              <span className="bg-[#79f4e5]/20 text-[#006f66] text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                <Bolt className="w-3 h-3" />
                {dict.miniLessons}
              </span>
              <span className="bg-[#d6e3ff] text-[#00468c] text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                <Shield className="w-3 h-3" />
                {dict.interScen}
              </span>
              <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3 h-3" />
                {dict.instFeed}
              </span>
            </div>

            <h1 className="text-2xl font-bold text-[#00478d] mb-2 tracking-tight">
              {dict.learnTitle}
            </h1>
            <p className="text-slate-600 max-w-[280px] text-xs leading-relaxed">
              {dict.learnSub}
            </p>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="onboard-3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-sm flex flex-col items-center flex-grow justify-center py-6 text-center z-10"
          >
            {/* Progressive ring level loader */}
            <div className="relative w-40 h-40 mb-6 flex items-center justify-center">
              {/* Backing Track Ring */}
              <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="transparent" className="stroke-slate-200" strokeWidth="8" />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  className="stroke-[#00478d]"
                  strokeWidth="8"
                  strokeDasharray="251.2"
                  initial={{ strokeDashoffset: 251.2 }}
                  animate={{ strokeDashoffset: 62.8 }} // 75% complete
                  transition={{ duration: 1, ease: "easeOut" }}
                  strokeLinecap="round"
                />
              </svg>

              {/* Center level indicator */}
              <div className="flex flex-col items-center justify-center text-center z-10 bg-white shadow-md rounded-full w-24 h-24 border border-slate-100">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">LEVEL</span>
                <span className="text-3xl font-bold text-[#00478d]">1</span>
              </div>

              {/* Floating badges */}
              <div className="absolute top-[-5px] right-[-5px] bg-white shadow-md rounded-xl p-2.5 border border-slate-100 transform rotate-12">
                <div className="w-8 h-8 rounded-full bg-[#79f4e5]/20 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-[#006f66]" />
                </div>
              </div>
              <div className="absolute bottom-5 -left-4 bg-white shadow-md rounded-xl p-2.5 border border-slate-100 transform -rotate-12">
                <div className="w-8 h-8 rounded-full bg-[#ffdbcb] flex items-center justify-center">
                  <Clock className="w-4 h-4 text-amber-700" />
                </div>
              </div>
            </div>

            {/* Bento Grid layout panels */}
            <div className="grid grid-cols-2 gap-3 w-full px-4 mb-6">
              <div className="bg-white rounded-xl p-3 shadow-sm border border-slate-200/60 flex items-start gap-2 text-left">
                <span className="p-1 px-1.5 rounded-lg bg-teal-50 text-teal-600 text-xs font-bold font-headline-lg">🏆</span>
                <div>
                  <p className="text-xs font-bold text-slate-800">Badges</p>
                  <p className="text-[10px] text-slate-400">Unlockable</p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-3 shadow-sm border border-slate-200/60 flex items-start gap-2 text-left">
                <span className="p-1 px-1.5 rounded-lg bg-blue-50 text-[#00478d] text-xs font-bold">⚡</span>
                <div>
                  <p className="text-xs font-bold text-slate-800">XP System</p>
                  <p className="text-[10px] text-slate-400">Track Growth</p>
                </div>
              </div>
            </div>

            <h1 className="text-2xl font-bold text-[#00478d] mb-2 tracking-tight">
              {dict.masterTitle}
            </h1>
            <p className="text-slate-600 max-w-[280px] text-xs leading-relaxed">
              {dict.masterSub}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stepper Dots & Primary Continue Action Button */}
      <div className="w-full max-w-sm flex flex-col items-center gap-4 z-10">
        
        {/* Step dots */}
        <div className="flex items-center gap-1.5">
          <div className={`h-2 rounded-full transition-all duration-300 ${step === 1 ? 'w-6 bg-[#00478d]' : 'w-2 bg-slate-300'}`}></div>
          <div className={`h-2 rounded-full transition-all duration-300 ${step === 2 ? 'w-6 bg-[#00478d]' : 'w-2 bg-slate-300'}`}></div>
          <div className={`h-2 rounded-full transition-all duration-300 ${step === 3 ? 'w-6 bg-[#00478d]' : 'w-2 bg-slate-300'}`}></div>
        </div>

        {/* CTA continue trigger */}
        <button
          id={`onboarding-continue-step-${step}`}
          onClick={handleNext}
          className="w-full h-13 bg-[#00478d] hover:bg-[#005db6] text-white font-semibold rounded-xl shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
        >
          <span>{step === 3 ? dict.getStarted : dict.continue}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
