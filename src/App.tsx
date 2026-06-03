/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  Home, 
  FlaskConical, 
  BookOpen, 
  User, 
  LogOut, 
  Globe, 
  Beaker, 
  Award,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Settings
} from 'lucide-react';

import Onboarding from './components/Onboarding';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Labs from './components/Labs';
import References from './components/References';
import Progress from './components/Progress';
import LessonPPE from './components/LessonPPE';
import ScenarioQuiz from './components/ScenarioQuiz';
import AssistantChat from './components/AssistantChat';
import { AppLogo } from './components/AppLogo';
import AdminDashboard from './components/AdminDashboard';

import { ActiveView, UserState, ThemeMode } from './types';
import { LAB_LESSONS_DATA, DetailedLesson } from './data';

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>('onboarding');
  const [isArabic, setIsArabic] = useState<boolean>(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  const [selectedLessonId, setSelectedLessonId] = useState<string>('chem-l1');
  const [activeScenarioId, setActiveScenarioId] = useState<string>('scen-chem-1');
  const [lessons, setLessons] = useState<DetailedLesson[]>([]);
  const [labs, setLabs] = useState<any[]>([]);
  const [references, setReferences] = useState<any[]>([]);

  // Refresh trigger to fetch lessons
  const loadWorkspaceLessons = () => {
    fetch('/api/lessons')
      .then(res => res.ok ? res.json() : Promise.reject('Off-fallback'))
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setLessons(data);
        }
      })
      .catch(err => {
        console.warn("Using offline / fallback client-side lessons data:", err);
      });
  };

  const loadWorkspaceLabs = () => {
    fetch('/api/labs')
      .then(res => res.ok ? res.json() : Promise.reject('Off-fallback'))
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setLabs(data);
        }
      })
      .catch(err => {
        console.warn("Using offline labs list:", err);
      });
  };

  const loadWorkspaceReferences = () => {
    fetch('/api/references')
      .then(res => res.ok ? res.json() : Promise.reject('Off-fallback'))
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setReferences(data);
        }
      })
      .catch(err => {
        console.warn("Using offline references system list:", err);
      });
  };

  useEffect(() => {
    loadWorkspaceLessons();
    loadWorkspaceLabs();
    loadWorkspaceReferences();
  }, []);

  // Initial scientific state of Ahmed Dr Safety
  const [user, setUser] = useState<UserState>({
    name: "Ahmed",
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
  });

  // Load theme handler
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (themeMode === 'dark') {
      root.classList.add('dark');
    } else if (themeMode === 'light') {
      root.classList.add('light');
    } else {
      // System Default
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    }
  }, [themeMode]);

  // Native URL Path routing fallback for direct /admin URL requests
  useEffect(() => {
    if (window.location.pathname === '/admin') {
      setActiveView('admin');
    }
  }, []);

  // Sync user status automatically to backend database recursive state changes
  useEffect(() => {
    if (user && user.email && user.email !== "researcher@lab.edu") {
      fetch('/api/user/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: user.email,
          progress: user
        })
      })
      .then(res => res.json())
      .catch(err => console.warn("Server dynamic background synchronization offline:", err));
    }
  }, [user]);

  const handleSignIn = (emailAddress: string) => {
    let nameChosen = "Ahmed";
    if (emailAddress.includes('guest')) {
      nameChosen = "Guest Scientific Peer";
    }

    // Attempt fullstack authentication & record loading
    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailAddress, name: nameChosen })
    })
    .then(res => res.ok ? res.json() : Promise.reject('Server OfflineFallback'))
    .then(serverUser => {
      setUser(serverUser);
    })
    .catch(err => {
      console.warn("Using offline / fallback client-side user state:", err);
      let avatar = "https://lh3.googleusercontent.com/aida-public/AB6AXuD6euUAWlt1RsMrfsRcQda9gz81u9sLRIg5XP2asY72Faa30V_7WqI63NP5ASbqTSUYI5IGTsM4rnjVk44lu3Jjqe_RW-0lLRGLC3M7h73UXLYnFyQP3hIYKHbl8dRmPx_3W9ZeWDRhDGLhQ7sSrX4OM9xQTJPjkbm36tt7eTY_CORPnnNGSDDTh-NS-iK3Zd6kupfngOvvkiS0N7DQ4hEkTzmJ4Xj7C3io3CYU6wT3jvBLhdxNlhrOIt6WWeYmKlpMIULJbFKVAjrF";
      if (emailAddress.includes('guest')) {
        avatar = "https://lh3.googleusercontent.com/aida-public/AB6AXuAls9rvpA_SW-RJyTOUKgXuDtBbcjXa3wS1rhWR-Ta98OurFIAK-KnBJ_HICXqyMcIjPdW3L54XKKxbuw0D-VjLOAMlZ9j9aMQNDfuqnb_PghryLAKoY9oHWCGXKfanITdF-os0y-MlEReXaf86RjsyvzOWTaqNaeXIqPsDvTkgYRh8XR1gp13tskOF_AHibg7YG_Xeg8Ri3oWfyGFC6N3BxrzS-bDBNgb3tXm6RodhdtYqIEeIAx5tDyIySeRady9Ua41xd4xZKoKs";
      }
      setUser(prev => ({
        ...prev,
        name: nameChosen,
        email: emailAddress,
        avatarUrl: avatar
      }));
    });

    setActiveView('dashboard');
  };

  const handleSignOut = () => {
    setActiveView('login');
  };

  // Switch wrapper views
  if (activeView === 'onboarding') {
    return (
      <Onboarding 
        onComplete={() => setActiveView('login')} 
        isArabic={isArabic} 
        setIsArabic={setIsArabic} 
      />
    );
  }

  if (activeView === 'login') {
    return (
      <Login 
        onSignIn={handleSignIn} 
        isArabic={isArabic} 
      />
    );
  }

  return (
    <div id="app-viewport-inner" className="min-h-screen bg-background text-on-background flex flex-col font-sans transition-colors duration-300">
      
      {/* Universal Desktop Top Header Bar Block */}
      <header className="h-16 border-b border-slate-200/80 dark:border-slate-800/80 bg-surface-base px-4 md:px-8 flex items-center justify-between sticky top-0 z-40 shadow-sm transition-colors">
        
        {/* Brand alignment */}
        <div className="flex items-center gap-3">
          <AppLogo size={42} />
          <div>
            <span className="font-headline-lg font-extrabold text-md md:text-lg text-[#00478d] dark:text-blue-450 tracking-tight block">
              {isArabic ? "لابسيف" : "LabSafe"}
            </span>
            <span className="text-[9px] text-[#00478d]/60 dark:text-slate-400 font-extrabold uppercase tracking-widest block -mt-1 select-none">
              {isArabic ? "منصة سلامة المختبرات" : "Lab Safety Platform"}
            </span>
          </div>
        </div>

        {/* Global actions row */}
        <div className="flex items-center gap-3">
          
          {/* Quick Arabic Language switch toggle */}
          <button
            id="header-lang-switch-btn"
            onClick={() => setIsArabic(!isArabic)}
            className="p-2 border border-slate-200 dark:border-slate-700 bg-transparent text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
          >
            <Globe className="w-4 h-4 text-[#00478d]" />
            <span className="hidden sm:inline">{isArabic ? "English" : "العربية"}</span>
          </button>

          {/* User profile capsule */}
          <div 
            onClick={() => setActiveView('progress')}
            className="flex items-center gap-2.5 px-3 py-1.5 border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800 rounded-xl transition-all cursor-pointer hover:bg-slate-100/50"
          >
            <img 
              src={user.avatarUrl} 
              alt="Logged in scientist avatar" 
              className="w-7 h-7 object-cover rounded-full shadow-sm"
              referrerPolicy="no-referrer"
            />
            <div className="hidden sm:flex flex-col text-left leading-none">
              <span className="text-xs font-bold text-slate-800 dark:text-white leading-none">{user.name}</span>
              <span className="text-[9px] text-teal-600 dark:text-teal-400 font-bold uppercase tracking-wider mt-0.5">Lv. {user.level}</span>
            </div>
          </div>

        </div>

      </header>

      {/* Main Body Area: Left Navigation panel Sidebar on desktop, Content on right */}
      <div className="flex-1 flex flex-col md:flex-row relative">
        
        {/* Left Side menu for desktop frame */}
        <aside className="hidden md:flex flex-col justify-between w-64 border-r border-slate-200/80 dark:border-slate-800/80 bg-surface-base p-6 sticky top-16 h-[calc(100vh-64px)] z-10 transition-colors">
          
          <div className="space-y-6">
            
            {/* Quick Level Card banner inside Sidebar */}
            <div className="bg-[#f0f3ff] dark:bg-slate-800/60 p-4 rounded-xl border border-[#00478d]/10 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-teal-500 flex items-center justify-center text-white shadow-sm font-bold text-xs">
                {user.level}
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">EXPERTISE</span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-205 mt-0.5">{isArabic ? "باحث معتمد" : "Certified Peer"}</span>
              </div>
            </div>

            {/* Menu Buttons Group */}
            <nav className="flex flex-col gap-1.5">
              
              <button
                id="sidebar-nav-tab-dashboard"
                onClick={() => setActiveView('dashboard')}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wide select-none transition-all cursor-pointer ${
                  activeView === 'dashboard'
                    ? 'bg-[#00478d] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Home className="w-4.5 h-4.5 shrink-0" />
                <span>{isArabic ? "لوحة القيادة" : "Dashboard"}</span>
              </button>

              <button
                id="sidebar-nav-tab-labs"
                onClick={() => setActiveView('labs')}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wide select-none transition-all cursor-pointer ${
                  activeView === 'labs' || activeView === 'lesson-ppe'
                    ? 'bg-[#00478d] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <FlaskConical className="w-4.5 h-4.5 shrink-0" />
                <span>{isArabic ? "اختر مختبر" : "Choose Lab"}</span>
              </button>

              <button
                id="sidebar-nav-tab-ref"
                onClick={() => setActiveView('ref')}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wide select-none transition-all cursor-pointer ${
                  activeView === 'ref'
                    ? 'bg-[#00478d] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <BookOpen className="w-4.5 h-4.5 shrink-0" />
                <span>{isArabic ? "المراجع والأدلة" : "References"}</span>
              </button>

              <button
                id="sidebar-nav-tab-progress"
                onClick={() => setActiveView('progress')}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wide select-none transition-all cursor-pointer ${
                  activeView === 'progress'
                    ? 'bg-[#00478d] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <User className="w-4.5 h-4.5 shrink-0" />
                <span>{isArabic ? "تقدّمك" : "My Progress"}</span>
              </button>

              <button
                id="sidebar-nav-tab-chat"
                onClick={() => setActiveView('chat')}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wide select-none transition-all cursor-pointer ${
                  activeView === 'chat'
                    ? 'bg-[#00478d] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Sparkles className="w-4.5 h-4.5 shrink-0 text-teal-600" />
                <span>{isArabic ? "مستشار الأمان" : "Dr. Safety AI"}</span>
              </button>

              <button
                id="sidebar-nav-tab-admin"
                onClick={() => setActiveView('admin')}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wide select-none transition-all cursor-pointer ${
                  activeView === 'admin'
                    ? 'bg-[#00478d] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Settings className="w-4.5 h-4.5 shrink-0 text-amber-500" />
                <span>{isArabic ? "إدارة المحتوى" : "Admin Panel"}</span>
              </button>

            </nav>

          </div>

          {/* Logout Action button */}
          <button
            id="sidebar-sign-out-btn"
            onClick={handleSignOut}
            className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wide text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/10 transition-all cursor-pointer mt-12"
          >
            <LogOut className="w-4.5 h-4.5 shrink-0 text-rose-500" />
            <span>{isArabic ? "تسجيل الخروج" : "Sign Out"}</span>
          </button>

        </aside>

        {/* Dynamic Inner Right Panel Frame Content */}
        <main className="flex-grow p-4 md:p-8 overflow-y-auto max-w-5xl mx-auto w-full">
          
          {activeView === 'dashboard' && (
            <Dashboard 
              user={user}
              isArabic={isArabic}
              lessons={lessons}
              onLaunchChallenge={() => setActiveView('drill-quiz')}
              onResumeLesson={() => setActiveView('lesson-ppe')}
              onNavigate={(view) => setActiveView(view)}
              onSelectLesson={(lessonId: string) => {
                setSelectedLessonId(lessonId);
                setActiveView('lesson-ppe');
              }}
            />
          )}

          {activeView === 'labs' && (
            <Labs 
              isArabic={isArabic}
              lessons={lessons}
              labs={labs}
              onSelectLesson={(lessonId: string) => {
                setSelectedLessonId(lessonId);
                setActiveView('lesson-ppe');
              }}
            />
          )}

          {activeView === 'ref' && (
            <References 
              isArabic={isArabic}
              references={references}
            />
          )}

          {activeView === 'progress' && (
            <Progress 
              user={user}
              isArabic={isArabic}
              themeMode={themeMode}
              onThemeSelect={(t) => setThemeMode(t)}
              onStartRecommended={() => {
                // Pick a random scenario or use current active scenario
                setActiveScenarioId('scen-chem-1');
                setActiveView('drill-quiz');
              }}
            />
          )}

          {activeView === 'lesson-ppe' && (
            <LessonPPE 
              isArabic={isArabic}
              lessonId={selectedLessonId}
              lessons={lessons}
              onBack={() => setActiveView('labs')}
              onContinueToScenario={(scenarioId: string) => {
                setActiveScenarioId(scenarioId);
                setActiveView('drill-quiz');
              }}
            />
          )}

          {activeView === 'drill-quiz' && (
            <ScenarioQuiz 
              isArabic={isArabic}
              initialScenarioId={activeScenarioId}
              scoreXP={user.xp}
              setScoreXP={(newXp: any) => {
                if (typeof newXp === 'function') {
                  setUser(prev => {
                    const nextXp = newXp(prev.xp);
                    return { ...prev, xp: nextXp };
                  });
                } else {
                  setUser(prev => ({ ...prev, xp: newXp }));
                }
              }}
              onExit={() => setActiveView('dashboard')}
              onGoToLesson={() => setActiveView('lesson-ppe')}
            />
          )}

          {activeView === 'chat' && (
            <AssistantChat 
              isArabic={isArabic}
              userEmail={user.email}
              onBack={() => setActiveView('dashboard')}
            />
          )}

          {activeView === 'admin' && (
            <AdminDashboard 
              isArabic={isArabic}
              onBack={() => setActiveView('dashboard')}
              onRefreshLessons={loadWorkspaceLessons}
              onRefreshLabs={loadWorkspaceLabs}
              onRefreshReferences={loadWorkspaceReferences}
              labs={labs}
              references={references}
            />
          )}

        </main>

      </div>

      {/* Mobile Bottom Navigation Bar (Visible only below md screens) */}
      <footer className="md:hidden h-16 border-t border-slate-200/85 dark:border-slate-800/80 bg-surface-base sticky bottom-0 z-40 flex items-center justify-around px-2 pb-safe shadow-md select-none transition-colors">
        
        <button
          id="mobile-nav-tab-dashboard"
          onClick={() => setActiveView('dashboard')}
          aria-label="Dashboard"
          className={`flex flex-col items-center justify-center gap-1 font-extrabold uppercase text-[9px] w-14 transition-colors cursor-pointer ${
            activeView === 'dashboard' ? 'text-[#00478d]' : 'text-slate-400'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>{isArabic ? "الرئيسية" : "Home"}</span>
        </button>

        <button
          id="mobile-nav-tab-labs"
          onClick={() => setActiveView('labs')}
          aria-label="Choose Lab"
          className={`flex flex-col items-center justify-center gap-1 font-extrabold uppercase text-[9px] w-14 transition-colors cursor-pointer ${
            activeView === 'labs' || activeView === 'lesson-ppe' ? 'text-[#00478d]' : 'text-slate-400'
          }`}
        >
          <FlaskConical className="w-5 h-5" />
          <span>{isArabic ? "مختبرات" : "Labs"}</span>
        </button>

        <button
          id="mobile-nav-tab-ref"
          onClick={() => setActiveView('ref')}
          aria-label="References"
          className={`flex flex-col items-center justify-center gap-1 font-extrabold uppercase text-[9px] w-14 transition-colors cursor-pointer ${
            activeView === 'ref' ? 'text-[#00478d]' : 'text-[#94a3b8]'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span>{isArabic ? "مراجع" : "Specs"}</span>
        </button>

        <button
          id="mobile-nav-tab-progress"
          onClick={() => setActiveView('progress')}
          aria-label="Progress Tracker"
          className={`flex flex-col items-center justify-center gap-1 font-extrabold uppercase text-[9px] w-14 transition-colors cursor-pointer ${
            activeView === 'progress' ? 'text-[#00478d]' : 'text-[#94a3b8]'
          }`}
        >
          <User className="w-5 h-5" />
          <span>{isArabic ? "تقدمك" : "Profile"}</span>
        </button>

        <button
          id="mobile-nav-tab-chat"
          onClick={() => setActiveView('chat')}
          aria-label="AI Safety Advisor"
          className={`flex flex-col items-center justify-center gap-1 font-extrabold uppercase text-[9px] w-14 transition-colors cursor-pointer ${
            activeView === 'chat' ? 'text-[#00478d]' : 'text-[#94a3b8]'
          }`}
        >
          <Sparkles className="w-5 h-5 text-teal-600" />
          <span>{isArabic ? "مستشار" : "Advisor"}</span>
        </button>

      </footer>

    </div>
  );
}
