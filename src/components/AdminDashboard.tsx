/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Trash2, 
  Edit, 
  Plus, 
  Check, 
  ArrowLeft, 
  Settings, 
  Video, 
  Image as ImageIcon, 
  Save, 
  AlertTriangle,
  Sparkles,
  RefreshCw,
  FolderOpen,
  BookOpen,
  FlaskConical,
  Eye,
  FileText,
  Unlock
} from 'lucide-react';

interface LessonCard {
  title: string;
  titleAr: string;
  desc: string;
  descAr: string;
  imageUrl: string;
  iconType: string;
}

interface DetailedLesson {
  id: string;
  title: string;
  titleAr: string;
  labType: string;
  duration: string;
  durationAr: string;
  category: string;
  categoryAr: string;
  videoUrl?: string;
  objectives: string[];
  objectivesAr: string[];
  citation: string;
  citationAr: string;
  cards: LessonCard[];
  warning: {
    title: string;
    titleAr: string;
    text: string;
    textAr: string;
  };
  scenarioId: string;
}

interface ReferenceDoc {
  id: string;
  title: string;
  type: string;
  description: string;
  version: string;
  date: string;
  internal: boolean;
  source: string;
  downloadable: boolean;
  url: string;
  pdfUrl: string;
}

interface LabConfig {
  id: string;
  title: string;
  titleAr: string;
  desc: string;
  descAr: string;
  locked: boolean;
  progress?: number;
  logoColor?: string;
  icon?: string;
}

interface AdminDashboardProps {
  isArabic: boolean;
  onBack: () => void;
  onRefreshLessons?: () => void;
  onRefreshLabs?: () => void;
  onRefreshReferences?: () => void;
  labs?: LabConfig[];
  references?: ReferenceDoc[];
}

export default function AdminDashboard({ 
  isArabic, 
  onBack, 
  onRefreshLessons, 
  onRefreshLabs, 
  onRefreshReferences,
  labs = [],
  references = []
}: AdminDashboardProps) {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  
  // Dashboard Tabs: 'lessons' | 'references' | 'labs'
  const [activeTab, setActiveTab] = useState<'lessons' | 'references' | 'labs'>('lessons');

  // Datasets loaded from backend
  const [localLessons, setLocalLessons] = useState<DetailedLesson[]>([]);
  const [localReferences, setLocalReferences] = useState<ReferenceDoc[]>([]);
  const [localLabs, setLocalLabs] = useState<LabConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Lesson Form states for creating & editing
  const [isEditingLesson, setIsEditingLesson] = useState(false);
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  
  const [formTitle, setFormTitle] = useState('');
  const [formTitleAr, setFormTitleAr] = useState('');
  const [formLabType, setFormLabType] = useState('chemistry');
  const [formDuration, setFormDuration] = useState('3 min');
  const [formDurationAr, setFormDurationAr] = useState('٣ دقائق');
  const [formCategory, setFormCategory] = useState('General Safety');
  const [formCategoryAr, setFormCategoryAr] = useState('السلامة العامة');
  const [formVideoUrl, setFormVideoUrl] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=600');
  const [uploadProgress, setUploadProgress] = useState<string>('');

  // Lesson Subcards nested array state
  const [subCards, setSubCards] = useState<LessonCard[]>([
    {
      title: "First Critical Safe Step",
      titleAr: "الخطوة الوقائية الأولى",
      desc: "Always check personal protection systems and ensure standard barrier guidelines are fully followed before action.",
      descAr: "قم بفحص أنظمة الدعم والوقاية الشخصية والتأكد من تطبيق سائر إرشادات حواجز السلامة المعتمدة.",
      imageUrl: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=600",
      iconType: "shield"
    }
  ]);

  // Reference Form states for creating & editing
  const [isEditingRef, setIsEditingRef] = useState(false);
  const [editingRefId, setEditingRefId] = useState<string | null>(null);

  const [refTitle, setRefTitle] = useState('');
  const [refType, setRefType] = useState('SDS');
  const [refDescription, setRefDescription] = useState('');
  const [refVersion, setRefVersion] = useState('v1.0');
  const [refDate, setRefDate] = useState('25 May 2026');
  const [refInternal, setRefInternal] = useState(false);
  const [refSource, setRefSource] = useState('');
  const [refUrl, setRefUrl] = useState('');
  const [refPdfUrl, setRefPdfUrl] = useState('');

  // Labs form/toggle editing states
  const [isEditingLab, setIsEditingLab] = useState(false);
  const [editingLabId, setEditingLabId] = useState<string | null>(null);
  const [labTitle, setLabTitle] = useState('');
  const [labTitleAr, setLabTitleAr] = useState('');
  const [labDesc, setLabDesc] = useState('');
  const [labDescAr, setLabDescAr] = useState('');
  const [labLocked, setLabLocked] = useState(true);

  // Authenticate session storage sync
  useEffect(() => {
    const isAuth = sessionStorage.getItem('is_admin_auth') === 'true';
    if (isAuth) {
      setIsAuthenticated(true);
    }
  }, []);

  // Sync state data from REST endpoints
  useEffect(() => {
    if (!isAuthenticated) return;
    setLoading(true);

    const loadAllData = async () => {
      try {
        const [lessRes, refRes, labRes] = await Promise.all([
          fetch('/api/lessons'),
          fetch('/api/references'),
          fetch('/api/labs')
        ]);
        
        if (lessRes.ok) {
          const lessData = await lessRes.json();
          setLocalLessons(lessData);
        }
        if (refRes.ok) {
          const refData = await refRes.json();
          setLocalReferences(refData);
        }
        if (labRes.ok) {
          const labData = await labRes.json();
          setLocalLabs(labData);
        }
      } catch (err) {
        console.error("Error retrieving admin database parameters:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, [isAuthenticated, refreshTrigger]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
      sessionStorage.setItem('is_admin_auth', 'true');
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError(isArabic ? 'كلمة المرور خاطئة. يرجى المحاولة مرة أخرى.' : 'Incorrect password. Please try again.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('is_admin_auth');
    setIsAuthenticated(false);
    setPassword('');
  };

  // NATIVE base64 file reader to render and persist lessons image custom uploads
  const handleFeaturedImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 800 * 1024) {
      alert(isArabic ? "حجم الصورة كبير جداً" : "Image size is too large (max 800KB)");
      return;
    }

    setUploadProgress(isArabic ? 'جاري تحويل الصورة...' : 'Processing...');
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setFormImageUrl(reader.result);
        setUploadProgress(isArabic ? '✓ تم الرفع بنجاح!' : '✓ Loaded!');
      }
    };
    reader.readAsDataURL(file);
  };

  // Slide specific base64 file readers for granular control of EACH card image
  const handleSubCardImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 500 * 1024) {
      alert(isArabic ? "حجم صورة الشريحة كبير" : "Slide image is too large (max 500KB)");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        handleSubCardChange(index, 'imageUrl', reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddSubCard = () => {
    setSubCards(prev => [
      ...prev,
      {
        title: "New Procedure Slide",
        titleAr: "عنوان إجراء أمان جديد",
        desc: "Implement protective parameters and ensure containment borders are observed.",
        descAr: "تطبيق معايير الوقاية المتقدمة والتأكد من توافق حواجز العزل في منطقة التشغيل.",
        imageUrl: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=600",
        iconType: "shield"
      }
    ]);
  };

  const handleRemoveSubCard = (index: number) => {
    if (subCards.length <= 1) {
      alert(isArabic ? "يجب أن يحتوي الدرس على شريحة واحدة على الأقل" : "A lesson must contain at least one slide.");
      return;
    }
    setSubCards(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubCardChange = (index: number, key: keyof LessonCard, value: string) => {
    setSubCards(prev => prev.map((c, i) => i === index ? { ...c, [key]: value } : c));
  };

  const resetLessonForm = () => {
    setFormTitle('');
    setFormTitleAr('');
    setFormLabType('chemistry');
    setFormDuration('3 min');
    setFormDurationAr('٣ دقائق');
    setFormCategory('General Safety');
    setFormCategoryAr('السلامة العامة');
    setFormVideoUrl('');
    setFormImageUrl('https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=600');
    setSubCards([
      {
        title: "First Critical Safe Step",
        titleAr: "الخطوة الوقائية الأولى",
        desc: "Always check personal protection systems and ensure standard barrier guidelines are fully followed before action.",
        descAr: "قم بفحص أنظمة الدعم والوقاية الشخصية والتأكد من تطبيق سائر إرشادات حواجز السلامة المعتمدة.",
        imageUrl: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=600",
        iconType: "shield"
      }
    ]);
    setIsEditingLesson(false);
    setEditingLessonId(null);
    setUploadProgress('');
  };

  const handleSaveLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formTitleAr) {
      alert(isArabic ? 'يرجى إدخال العنوان باللغتين' : 'Please enter the title in both languages.');
      return;
    }

    const payload: Partial<DetailedLesson> = {
      id: editingLessonId || `custom-lesson-${Date.now()}`,
      title: formTitle,
      titleAr: formTitleAr,
      labType: formLabType,
      duration: formDuration,
      durationAr: formDurationAr,
      category: formCategory,
      categoryAr: formCategoryAr,
      videoUrl: formVideoUrl,
      objectives: [
        `Understand ${formTitle} safety protocols.`,
        `Recall proper occupational hazard containment for ${formCategory}.`
      ],
      objectivesAr: [
        `فهم بروتوكول الأمان لـ ${formTitleAr}.`,
        `استرجاع وتطبيق موانع الخطر لـ ${formCategoryAr}.`
      ],
      citation: "LabSafe Authorized Clinical Guidelines Code",
      citationAr: "الكود القياسي للوائح الطبية المعتمدة لسلامة الباحثين",
      warning: {
        title: "Standard Operational Safeguard Required",
        titleAr: "الاحتياطات القياسية للسلامة المهنية مطلوبة",
        text: `PPE behaves purely as a barrier. You must prioritize engineering controls before relying solely on physical assets while practicing ${formTitle}.`,
        textAr: `تعتبر معدات السلامة دائماً حاجزاً وقائياً أخيراً. لذلك، يجب عزل مصادر الخطر أولاً وتوجيه كواشف الأمان قبل بدء العمل في ${formTitleAr}.`
      },
      scenarioId: formLabType === 'chemistry' ? 'scen-chem-1' : 'scen-micro-1',
      cards: subCards.map(c => ({
        ...c,
        imageUrl: c.imageUrl || formImageUrl
      }))
    };

    try {
      const endpoint = isEditingLesson ? `/api/lessons/${editingLessonId}` : '/api/lessons';
      const method = isEditingLesson ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: import.meta.env.VITE_ADMIN_PASSWORD,
          lesson: payload
        })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Server error saving content');

      if (onRefreshLessons) onRefreshLessons();
      resetLessonForm();
      setRefreshTrigger(prev => prev + 1);
      alert(isArabic ? '✓ تم حفظ الدرس وتحديث البيانات بنجاح!' : '✓ Lesson published successfully!');
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleEditLessonInit = (lesson: DetailedLesson) => {
    setIsEditingLesson(true);
    setEditingLessonId(lesson.id);
    setFormTitle(lesson.title);
    setFormTitleAr(lesson.titleAr);
    setFormLabType(lesson.labType);
    setFormDuration(lesson.duration);
    setFormDurationAr(lesson.durationAr);
    setFormCategory(lesson.category);
    setFormCategoryAr(lesson.categoryAr);
    setFormVideoUrl(lesson.videoUrl || '');
    if (lesson.cards && lesson.cards.length > 0) {
      setFormImageUrl(lesson.cards[0].imageUrl);
      setSubCards(lesson.cards);
    } else {
      setFormImageUrl('https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=600');
      setSubCards([]);
    }
  };

  const handleDeleteLesson = async (id: string) => {
    if (!window.confirm(isArabic ? 'هل أنت متأكد من حذف هذا الدرس؟' : 'Are you sure you want to delete this lesson?')) return;

    try {
      const response = await fetch(`/api/lessons/${id}?password=${import.meta.env.VITE_ADMIN_PASSWORD}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const res = await response.json();
        throw new Error(res.error || 'Failed deletion');
      }

      if (onRefreshLessons) onRefreshLessons();
      setRefreshTrigger(prev => prev + 1);
      alert(isArabic ? '✕ تم حذف الدرس بنجاح!' : '✕ Lesson deleted successfully!');
    } catch (err: any) {
      alert(`Failed: ${err.message}`);
    }
  };

  // --- Reference Controllers ---
  const resetRefForm = () => {
    setRefTitle('');
    setRefType('SDS');
    setRefDescription('');
    setRefVersion('v1.0');
    setRefDate('May 2026');
    setRefInternal(false);
    setRefSource('');
    setRefUrl('');
    setRefPdfUrl('');
    setIsEditingRef(false);
    setEditingRefId(null);
  };

  const handleSaveReference = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refTitle || !refDescription) {
      alert(isArabic ? 'الرجاء ملء عنوان المستند والوصف' : 'Please fill the document title and description.');
      return;
    }

    const payload: Partial<ReferenceDoc> = {
      id: editingRefId || `custom-ref-${Date.now()}`,
      title: refTitle,
      type: refType,
      description: refDescription,
      version: refVersion,
      date: refDate,
      internal: refInternal,
      source: refSource || 'LabSafe Authorized',
      downloadable: true,
      url: refUrl,
      pdfUrl: refPdfUrl
    };

    try {
      const endpoint = isEditingRef ? `/api/references/${editingRefId}` : '/api/references';
      const method = isEditingRef ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: import.meta.env.VITE_ADMIN_PASSWORD,
          reference: payload
        })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Error saving reference');

      if (onRefreshReferences) onRefreshReferences();
      resetRefForm();
      setRefreshTrigger(prev => prev + 1);
      alert(isArabic ? '✓ تم حفظ المرجع العلمي وتحديث القائمة بنجاح!' : '✓ Safety Reference saved successfully!');
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleEditRefInit = (ref: ReferenceDoc) => {
    setIsEditingRef(true);
    setEditingRefId(ref.id);
    setRefTitle(ref.title);
    setRefType(ref.type);
    setRefDescription(ref.description);
    setRefVersion(ref.version);
    setRefDate(ref.date);
    setRefInternal(ref.internal);
    setRefSource(ref.source);
    setRefUrl(ref.url);
    setRefPdfUrl(ref.pdfUrl);
  };

  const handleDeleteRef = async (id: string) => {
    if (!window.confirm(isArabic ? 'هل تريد حذف هذا المستند المرجعي؟' : 'Are you sure you want to delete this reference document?')) return;

    try {
      const response = await fetch(`/api/references/${id}?password=${import.meta.env.VITE_ADMIN_PASSWORD}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const res = await response.json();
        throw new Error(res.error || 'Failed deletion');
      }

      if (onRefreshReferences) onRefreshReferences();
      setRefreshTrigger(prev => prev + 1);
      alert(isArabic ? '✕ تم حذف المرجع بنجاح!' : '✕ Reference deleted successfully!');
    } catch (err: any) {
      alert(`Failed: ${err.message}`);
    }
  };

  // --- Lab Management Controllers ---
  const handleToggleLabLock = async (lab: LabConfig) => {
    const updatedLocked = !lab.locked;
    try {
      const response = await fetch(`/api/labs/${lab.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: import.meta.env.VITE_ADMIN_PASSWORD,
          lab: { locked: updatedLocked }
        })
      });

      if (!response.ok) {
        const r = await response.json();
        throw new Error(r.error || 'Failed to toggle lab status');
      }

      if (onRefreshLabs) onRefreshLabs();
      setRefreshTrigger(prev => prev + 1);
      alert(isArabic 
        ? `تم ${updatedLocked ? 'قفل' : 'تنشيط وإتاحة'} مختبر ${lab.titleAr || lab.title} بنجاح!` 
        : `Successfully ${updatedLocked ? 'locked' : 'unlocked / activated'} lab ${lab.title}!`);
    } catch (err: any) {
      alert(`Failed: ${err.message}`);
    }
  };

  const handleEditLabInit = (lab: LabConfig) => {
    setIsEditingLab(true);
    setEditingLabId(lab.id);
    setLabTitle(lab.title);
    setLabTitleAr(lab.titleAr || '');
    setLabDesc(lab.desc);
    setLabDescAr(lab.descAr || '');
    setLabLocked(lab.locked);
  };

  const handleSaveLabDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLabId) return;

    try {
      const response = await fetch(`/api/labs/${editingLabId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: import.meta.env.VITE_ADMIN_PASSWORD,
          lab: {
            title: labTitle,
            titleAr: labTitleAr,
            desc: labDesc,
            descAr: labDescAr,
            locked: labLocked
          }
        })
      });

      if (!response.ok) {
        const r = await response.json();
        throw new Error(r.error || 'Failed to save lab configurations');
      }

      if (onRefreshLabs) onRefreshLabs();
      setIsEditingLab(false);
      setEditingLabId(null);
      setRefreshTrigger(prev => prev + 1);
      alert(isArabic ? '✓ تم تحديث مواصفات المختبر بكفاءة!' : '✓ Lab parameters synchronized successfully!');
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  // Auth screen if not logged in
  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <form 
          onSubmit={handleLoginSubmit} 
          className="bg-white dark:bg-slate-950 p-8 rounded-3xl border border-slate-205 dark:border-slate-800 shadow-xl max-w-md w-full flex flex-col gap-6 animate-fadeIn"
        >
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="bg-blue-50 dark:bg-blue-950/40 p-4 rounded-full border border-[#00478d]/10">
              <Lock className="w-8 h-8 text-[#00478d] dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-bold font-headline-lg text-slate-800 dark:text-white">
              {isArabic ? "بوابة لوحة تحكم الإدارة" : "Admin Dashboard Portal"}
            </h2>
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
              {isArabic 
                ? "هذه الصفحة محمية وخاصة بمسؤولي النظام والمدراء لتعديل وإدارة محتوى لابسيف بدقة." 
                : "This gateway is strictly reserved for authorized safety officers to manage LabSafe curriculum content."}
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-350 uppercase tracking-widest">
              {isArabic ? "كلمة المرور الثابتة" : "Authorized Admin Password"}
            </label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="•••••••••••••••••"
              className="h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 bg-slate-50/50 dark:bg-slate-900 focus:outline-none focus:border-blue-500 font-mono text-center tracking-widest text-sm transition-all"
              required
            />
          </div>

          {authError && (
            <div className="bg-red-50 dark:bg-red-950/10 p-3.5 rounded-xl border border-red-200 dark:border-red-900/30 flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <span className="text-xs text-red-700 dark:text-red-400 font-medium">
                {authError}
              </span>
            </div>
          )}

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 h-11 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer"
            >
              {isArabic ? "الخلف لموقع لابسيف" : "Cancel & Go Back"}
            </button>
            <button
              type="submit"
              className="flex-1 h-11 bg-[#00478d] hover:bg-blue-600 text-white rounded-xl font-bold text-xs shadow-sm shadow-[#00478d]/20 transition-all active:scale-98 cursor-pointer"
            >
              {isArabic ? "تفعيل الدخول" : "Verify Password"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 w-full animate-fadeIn pb-24">
      
      {/* Header controls */}
      <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-gradient-to-r from-[#00478d]/5 to-teal-500/5 dark:from-slate-800/40 dark:to-slate-800/80 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2.5 rounded-full border border-slate-200 dark:border-slate-705 hover:bg-white dark:hover:bg-slate-900 text-slate-500 hover:text-slate-800 dark:text-slate-400 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-teal-600" />
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#00478d] dark:text-blue-400">
                {isArabic ? "لوحة الإدارة والمحتوى" : "Lighthouse Content Management"}
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white font-headline-lg mt-0.5">
              {isArabic ? "إدارة نظام المحاكاة والأجهزة" : "Safety System Administrator Control Desk"}
            </h1>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="self-start sm:self-center h-10 px-4 border border-rose-200 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/10 rounded-xl font-extrabold text-xs uppercase tracking-wide transition-all cursor-pointer"
        >
          {isArabic ? "تسجيل الخروج للمسؤول" : "Sign Out Admin"}
        </button>
      </header>

      {/* Tabs navigation */}
      <div className="flex gap-2 border-b border-slate-200/60 dark:border-slate-800 pb-1">
        <button
          onClick={() => { setActiveTab('lessons'); }}
          className={`px-5 py-3 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'lessons'
              ? 'bg-[#00478d] text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
          }`}
        >
          <FolderOpen className="w-4 h-4" />
          <span>{isArabic ? "شرح الدروس والبطاقات" : "Active Safety Lessons"}</span>
        </button>

        <button
          onClick={() => { setActiveTab('references'); }}
          className={`px-5 py-3 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'references'
              ? 'bg-[#00478d] text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>{isArabic ? "تحكم في المراجع العلمية" : "Technical Safety Specs"}</span>
        </button>

        <button
          onClick={() => { setActiveTab('labs'); }}
          className={`px-5 py-3 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'labs'
              ? 'bg-[#00478d] text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
          }`}
        >
          <FlaskConical className="w-4 h-4" />
          <span>{isArabic ? "تحكم في المعامل المتاحة" : "Available Lab Modules"}</span>
        </button>
      </div>

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center text-slate-400 gap-3">
          <RefreshCw className="w-8 h-8 animate-spin text-[#00478d]" />
          <span className="text-xs font-bold">{isArabic ? "جاري الاستعلام عن قاعدة البيانات ومزامنة الملفات..." : "Loading database and syncing assets..."}</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* TAB 1: LESSONS CONTROLLER */}
          {activeTab === 'lessons' && (
            <>
              {/* Left Column: Lesson Form (5 Cols) */}
              <section className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 rounded-3xl shadow-sm flex flex-col gap-6">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h2 className="text-md font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <Plus className="w-5 h-5 text-teal-600 shrink-0" />
                    <span>
                      {isEditingLesson 
                        ? (isArabic ? "تعديل درس السلامة الحالي" : "Edit Simulation Module Card") 
                        : (isArabic ? "إضافة شريحة درس جديدة" : "Install New Standard Module")}
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    {isArabic 
                      ? "أدخل معطيات المحاكاة والشرائح للتشغيل التلقائي عبر المنظومة." 
                      : "Describe critical safeguards, videos, and dynamic slides."}
                  </p>
                </div>

                <form onSubmit={handleSaveLesson} className="flex flex-col gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-350">
                      {isArabic ? "تكامل في أي مختبر" : "Target Laboratory Category"}
                    </label>
                    <div className="grid grid-cols-2 gap-3 mt-1">
                      <button
                        type="button"
                        onClick={() => setFormLabType('chemistry')}
                        className={`h-11 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                          formLabType === 'chemistry'
                            ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-550 text-[#00478d] dark:text-blue-300 shadow-xs'
                            : 'border-slate-250 dark:border-slate-800 text-slate-500'
                        }`}
                      >
                        {isArabic ? "مختبر الكيمياء" : "Chemistry Lab"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormLabType('microbiology')}
                        className={`h-11 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                          formLabType === 'microbiology'
                            ? 'bg-teal-50 dark:bg-teal-950/20 border-teal-550 text-teal-600 dark:text-teal-300 shadow-xs'
                            : 'border-slate-250 dark:border-slate-800 text-slate-500'
                        }`}
                      >
                        {isArabic ? "مختبر الأحياء الدقيقة" : "Microbiology Lab"}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-350">
                        {isArabic ? "التصنيف (English)" : "Category (English)"}
                      </label>
                      <input 
                        type="text"
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value)}
                        placeholder="e.g. Fume Hood Safety"
                        className="h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 bg-slate-50/50 dark:bg-slate-950"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-350">
                        {isArabic ? "التصنيف (عربي)" : "Category (Arabic)"}
                      </label>
                      <input 
                        type="text"
                        value={formCategoryAr}
                        onChange={(e) => setFormCategoryAr(e.target.value)}
                        placeholder="مثال: كبائن السحب الآمن"
                        className="h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 bg-slate-50/50 dark:bg-slate-950 text-right"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-350">
                      {isArabic ? "عنوان الدرس / البطاقة (English)" : "Module Title (English)"}
                    </label>
                    <input 
                      type="text"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="e.g. Fume Hood Air Filtration"
                      className="h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 bg-slate-50/50 dark:bg-slate-950"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-350">
                      {isArabic ? "عنوان الدرس / البطاقة (عربي)" : "Module Title (Arabic)"}
                    </label>
                    <input 
                      type="text"
                      value={formTitleAr}
                      onChange={(e) => setFormTitleAr(e.target.value)}
                      placeholder="مثال: معايرة كفاءة هوايات الغازات"
                      className="h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 bg-slate-50/50 dark:bg-slate-950 text-right"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-350 flex items-center gap-1.5">
                      <Video className="w-3.5 h-3.5 text-blue-550" />
                      <span>{isArabic ? "رابط فيديو الشرح العلمي" : "Scientific Explanation Video link"}</span>
                    </label>
                    <input 
                      type="url"
                      value={formVideoUrl}
                      onChange={(e) => setFormVideoUrl(e.target.value)}
                      placeholder="https://assets.mixkit.co/videos/preview/..."
                      className="h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 bg-slate-50/50 dark:bg-slate-950 font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-350">
                        {isArabic ? "المدة المقدرة (English)" : "Est Duration (En)"}
                      </label>
                      <input 
                        type="text"
                        value={formDuration}
                        onChange={(e) => setFormDuration(e.target.value)}
                        placeholder="3 min"
                        className="h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-205 bg-slate-50/50"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-350">
                        {isArabic ? "المدة المقدرة (عربي)" : "Est Duration (Ar)"}
                      </label>
                      <input 
                        type="text"
                        value={formDurationAr}
                        onChange={(e) => setFormDurationAr(e.target.value)}
                        placeholder="٣ دقائق"
                        className="h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-205 bg-slate-50/50 text-right"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-150 dark:border-slate-850">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-350 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{isArabic ? "رفع الصورة الرئيسية للدرس" : "Featured Cover Image"}</span>
                      </span>
                      {uploadProgress && <span className="text-[9px] text-teal-600 font-bold">{uploadProgress}</span>}
                    </label>
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={handleFeaturedImageUpload}
                      className="file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 text-[10px] text-slate-500 cursor-pointer"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-slate-400">{isArabic ? "أو الرابط:" : "Or URL:"}</span>
                      <input 
                        type="url"
                        value={formImageUrl}
                        onChange={(e) => setFormImageUrl(e.target.value)}
                        className="flex-grow h-8 px-2 rounded-lg border border-slate-200 text-[10px] font-mono bg-white text-slate-900"
                      />
                    </div>
                  </div>

                  {/* GRANULAR SUB-SLIDES AND INDIVIDUAL IMAGES CONTROL */}
                  <div className="flex flex-col gap-2.5 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-150 dark:border-slate-850">
                    <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-2">
                      <span className="text-[10px] font-black text-slate-650 dark:text-slate-350 uppercase tracking-wider flex items-center gap-1">
                        <FolderOpen className="w-3.5 h-3.5 text-blue-500" />
                        <span>{isArabic ? "البطاقات التعليمية والشرائح" : "Detailed Slides Control"} ({subCards.length})</span>
                      </span>
                      <button
                        type="button"
                        onClick={handleAddSubCard}
                        className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 px-2 py-1 rounded-lg text-[9px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Plus className="w-3 h-3 text-[#00478d]" />
                        <span>{isArabic ? "إضافة رغبة / شريحة" : "Add Slide"}</span>
                      </button>
                    </div>

                    <div className="max-h-[350px] overflow-y-auto space-y-4 pr-1">
                      {subCards.map((card, index) => (
                        <div key={index} className="bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 p-3.5 rounded-xl flex flex-col gap-3 relative">
                          <button
                            type="button"
                            onClick={() => handleRemoveSubCard(index)}
                            className="absolute top-2.5 right-2.5 text-rose-550 hover:text-rose-700 cursor-pointer p-1 rounded hover:bg-rose-50"
                            title="Remove Slide"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          <span className="text-[10px] font-extrabold text-[#00478d] font-mono">SLIDE #{index + 1}</span>

                          <div className="grid grid-cols-2 gap-2">
                            <input 
                              type="text"
                              value={card.title}
                              onChange={(e) => handleSubCardChange(index, 'title', e.target.value)}
                              placeholder="Slide Title (En)"
                              className="h-8 px-2 rounded-lg border border-slate-200 text-[10px] text-slate-900 bg-white"
                              required
                            />
                            <input 
                              type="text"
                              value={card.titleAr || ''}
                              onChange={(e) => handleSubCardChange(index, 'titleAr', e.target.value)}
                              placeholder="عنوان الشريحة (عربي)"
                              className="h-8 px-2 rounded-lg border border-slate-200 text-[10px] text-right text-slate-900 bg-white"
                              required
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <textarea 
                              value={card.desc}
                              onChange={(e) => handleSubCardChange(index, 'desc', e.target.value)}
                              placeholder="Description (En)"
                              className="min-h-12 p-1.5 rounded-lg border border-slate-200 text-[9px] leading-tight text-slate-900 bg-white"
                              required
                            />
                            <textarea 
                              value={card.descAr || ''}
                              onChange={(e) => handleSubCardChange(index, 'descAr', e.target.value)}
                              placeholder="الشرح والتنبيه بالكامل (عربي)"
                              className="min-h-12 p-1.5 rounded-lg border border-slate-200 text-[9px] text-right leading-tight text-slate-900 bg-white"
                              required
                            />
                          </div>

                          {/* Image control for individual slide */}
                          <div className="flex flex-col gap-1.5 bg-slate-50 dark:bg-slate-950 p-2 rounded-lg border border-slate-205">
                            <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{isArabic ? "صورة هذه الشريحة" : "Slide Specific Image"}</label>
                            <input 
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleSubCardImageUpload(index, e)}
                              className="text-[8px] text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-blue-50 file:text-blue-750 cursor-pointer"
                            />
                            <input 
                              type="url"
                              value={card.imageUrl}
                              onChange={(e) => handleSubCardChange(index, 'imageUrl', e.target.value)}
                              placeholder="https://..."
                              className="h-6 px-1.5 rounded border border-slate-200 text-[9px] font-mono bg-white text-slate-900"
                            />
                            {card.imageUrl && (
                              <div className="h-10 w-24 rounded border overflow-hidden mt-1 self-start">
                                <img src={card.imageUrl} alt="preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              </div>
                            )}
                          </div>

                          {/* Alert symbol protection icon selector */}
                          <div className="flex flex-col gap-1">
                            <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{isArabic ? "أيقونة التنبيه السلوكي" : "Safeguard Aspect Icon"}</label>
                            <select
                              value={card.iconType}
                              onChange={(e) => handleSubCardChange(index, 'iconType', e.target.value)}
                              className="h-7 px-1.5 rounded border border-slate-200 text-[9px] bg-white text-slate-900"
                            >
                              <option value="shield">{isArabic ? "🛡️ درع سلامة" : "🛡️ Protective Shield"}</option>
                              <option value="eye">{isArabic ? "👁️ غسيل عيون" : "👁️ Washout Stations"}</option>
                              <option value="hand">{isArabic ? "🖐️ واقي يدين" : "🖐️ Hand Protection Wear"}</option>
                              <option value="coat">{isArabic ? "🥼 معطف مختبر" : "🥼 Clean Lab Coat"}</option>
                              <option value="beaker">{isArabic ? "🧪 تفاعلات كيميائية" : "🧪 Reactive Beaker"}</option>
                              <option value="flame">{isArabic ? "🔥 خطر الاحتراق" : "🔥 High Temperature / Burn"}</option>
                              <option value="bio">{isArabic ? "☣️ ملوثات حيوية" : "☣️ Microbiological Biological"}</option>
                              <option value="temp">{isArabic ? "🌡️ درجة الحرارة" : "🌡️ Storage Temperature"}</option>
                              <option value="warning">{isArabic ? "⚠️ تحذير عام" : "⚠️ Urgent Hazard Warning"}</option>
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 mt-3">
                    {isEditingLesson && (
                      <button
                        type="button"
                        onClick={resetLessonForm}
                        className="flex-1 h-11 border border-slate-250 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-50 cursor-pointer"
                      >
                        {isArabic ? "إلغاء التعديل" : "Cancel Edit"}
                      </button>
                    )}
                    <button
                      type="submit"
                      className="flex-grow h-11 bg-teal-650 hover:bg-teal-700 text-white rounded-xl font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isEditingLesson ? (isArabic ? 'حفظ درس المعدل' : 'Save Modified Lesson') : (isArabic ? 'نشر الدرس الآن' : 'Publish New Lesson')}</span>
                    </button>
                  </div>
                </form>
              </section>

              {/* Right Column: Existing dynamic lessons (7 cols) */}
              <section className="lg:col-span-7 flex flex-col gap-4">
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <h2 className="text-md font-bold text-slate-800 dark:text-white flex items-center gap-2">
                      <Settings className="w-5 h-5 text-[#00478d]" />
                      <span>{isArabic ? "قائمة المقررات والبطاقات الحالية" : "Active Safety Board Modules"}</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {isArabic ? "تعديل وحذف المحاضرات والبطاقات المخزنة بقاعدة بيانات النظام." : "All dynamic indices configured globally are indexed dynamically below."}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-1">
                  {localLessons.map(lesson => (
                    <article key={lesson.id} className="bg-white dark:bg-slate-950 p-4.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 min-w-0">
                        {lesson.cards && lesson.cards.length > 0 && (
                          <div className="w-12 h-12 rounded-xl border border-slate-100 overflow-hidden shrink-0">
                            <img src={lesson.cards[0].imageUrl} alt="lesson" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <span className={`text-[8px] font-bold px-2 py-0.5 rounded border ${
                            lesson.labType === 'chemistry' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-teal-50 text-teal-700 border-teal-200'
                          }`}>
                            {lesson.labType === 'chemistry' ? (isArabic ? 'كيمياء' : 'Chemistry') : (isArabic ? 'أحياء دقيقة' : 'Microbiology')}
                          </span>
                          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-205 truncate mt-1">
                            {isArabic ? lesson.titleAr : lesson.title}
                          </h3>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button onClick={() => handleEditLessonInit(lesson)} className="h-8 px-3 border border-slate-200 rounded-lg text-xs font-bold text-[#00478d] hover:bg-slate-50 cursor-pointer">
                          {isArabic ? "تعديل" : "Edit"}
                        </button>
                        <button onClick={() => handleDeleteLesson(lesson.id)} className="h-8 px-3 border border-rose-200 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 cursor-pointer">
                          {isArabic ? "حذف" : "Delete"}
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </>
          )}

          {/* TAB 2: TECHNICAL SAFETY REFERENCES CRUD */}
          {activeTab === 'references' && (
            <>
              {/* Left Column: Create Reference Document */}
              <section className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 rounded-3xl shadow-sm flex flex-col gap-6">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h2 className="text-md font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-teal-600 shrink-0" />
                    <span>
                      {isEditingRef 
                        ? (isArabic ? "تعديل المرجع العلمي الحالي" : "Edit Operational Technical Spec") 
                        : (isArabic ? "إدراج مستند مرجعي جديد" : "Register Technical Safety Document")}
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    {isArabic ? "إضافة وثائق أمان GHS أو لوائح صحة مهنية OSHA مقروءة للباحثين." : "Specify custom SDS sheets, SOP protocols, official OSHA standards, or CDC guides."}
                  </p>
                </div>

                <form onSubmit={handleSaveReference} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black uppercase text-slate-500">{isArabic ? "عنوان مرجع الأمان (English)" : "Safety Document Title"}</label>
                    <input 
                      type="text"
                      value={refTitle}
                      onChange={(e) => setRefTitle(e.target.value)}
                      placeholder="e.g. Concentrated Nitric Acid 70% SDS"
                      className="h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 bg-white"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-black uppercase text-slate-500">{isArabic ? "تصنيف المستند" : "Document Classification"}</label>
                      <select 
                        value={refType}
                        onChange={(e) => setRefType(e.target.value)}
                        className="h-10 px-3 rounded-xl border border-slate-202 text-xs text-slate-900 bg-white shadow-xs"
                      >
                        <option value="SDS">SDS (Safety Data Sheets)</option>
                        <option value="SOP">SOP (Standard Operations)</option>
                        <option value="OSHA">OSHA Standard Regulations</option>
                        <option value="CDC">CDC Protocols & BMBL6</option>
                        <option value="MANUAL">Equipment Calib Guidelines</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-black uppercase text-slate-500">{isArabic ? "نسخة الإصدار" : "Version Specifier"}</label>
                      <input 
                        type="text"
                        value={refVersion}
                        onChange={(e) => setRefVersion(e.target.value)}
                        placeholder="v1.4 / 29 CFR"
                        className="h-10 px-3 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase">{isArabic ? "وصف ومستخلص الأمان بالإنقليزية" : "Reference Summary Description (En)"}</label>
                    <textarea 
                      value={refDescription}
                      onChange={(e) => setRefDescription(e.target.value)}
                      placeholder="Enter safety notes, chemical warning parameters, emergency response directives..."
                      className="min-h-20 p-3 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white leading-relaxed"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-black uppercase text-slate-500">{isArabic ? "تاريخ النشر" : "Date of Statement"}</label>
                      <input 
                        type="text"
                        value={refDate}
                        onChange={(e) => setRefDate(e.target.value)}
                        placeholder="e.g. October 2026"
                        className="h-10 px-3 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-black uppercase text-slate-500">{isArabic ? "مصدر جهة الإصدار" : "Issuer Source Authority"}</label>
                      <input 
                        type="text"
                        value={refSource}
                        onChange={(e) => setRefSource(e.target.value)}
                        placeholder="Sigma SDS / LabConco"
                        className="h-10 px-3 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black uppercase text-slate-500">{isArabic ? "رابط المعلومات الرسمي" : "Official Reference Info Website Link"}</label>
                    <input 
                      type="url"
                      value={refUrl}
                      onChange={(e) => setRefUrl(e.target.value)}
                      placeholder="https://www.laboratory-safety.org/..."
                      className="h-10 px-3 rounded-xl border border-slate-200 text-xs text-slate-905 bg-white font-mono"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black uppercase text-slate-500">{isArabic ? "رابط المرفق المباشر PDF" : "Direct PDF Document link"}</label>
                    <input 
                      type="url"
                      value={refPdfUrl}
                      onChange={(e) => setRefPdfUrl(e.target.value)}
                      placeholder="https://www.osha.gov/publications/sheet.pdf"
                      className="h-10 px-3 rounded-xl border border-slate-200 text-xs text-slate-905 bg-white font-mono"
                    />
                  </div>

                  <div className="flex items-center gap-2 py-1 select-none">
                    <input 
                      type="checkbox"
                      id="refInternalCheck"
                      checked={refInternal}
                      onChange={(e) => setRefInternal(e.target.checked)}
                      className="w-4 h-4 rounded text-[#00478d]"
                    />
                    <label htmlFor="refInternalCheck" className="text-xs text-slate-700 dark:text-slate-300 font-bold cursor-pointer">
                      {isArabic ? "مستند داخلي خاص بالمؤسسة (Internal Reference)" : "Mark as Private Institutional Internal Guide"}
                    </label>
                  </div>

                  <div className="flex gap-3 mt-2">
                    {isEditingRef && (
                      <button
                        type="button"
                        onClick={resetRefForm}
                        className="flex-grow h-11 border border-slate-200 text-slate-650 rounded-xl font-bold text-xs hover:bg-slate-50 cursor-pointer"
                      >
                        {isArabic ? "إلغاء التعديل" : "Cancel Edit"}
                      </button>
                    )}
                    <button
                      type="submit"
                      className="flex-grow h-11 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isEditingRef ? (isArabic ? 'تأكيد وحفظ التعديلات' : 'Save Modified Spec') : (isArabic ? 'حفظ وإتاحة المستند' : 'Publish Reference')}</span>
                    </button>
                  </div>
                </form>
              </section>

              {/* Right Column: References List with Edit/Delete */}
              <section className="lg:col-span-7 flex flex-col gap-4">
                <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div>
                    <h2 className="text-md font-bold text-slate-800 dark:text-white flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-[#00478d]" />
                      <span>{isArabic ? "مستندات اللوائح والمراجع الحالية" : "Indexed Reference Database Store"}</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      {isArabic ? "أدناه كافة مراجع الأمان المنشورة في لوائح لابسيف الرقمية." : "Safety specialists can seamlessly update or omit active referenced datasheets below."}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-1">
                  {localReferences.map(doc => (
                    <article key={doc.id} className="bg-white dark:bg-slate-950 p-4.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 shadow-xs flex flex-col gap-3">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="bg-amber-50 text-amber-700 text-[8px] font-black px-1.5 py-0.5 rounded border border-amber-200">
                              {doc.type}
                            </span>
                            <span className="text-[10px] text-slate-405 font-mono">
                              ID: {doc.id} • Version {doc.version}
                            </span>
                          </div>
                          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-205 mt-1">
                            {doc.title}
                          </h3>
                        </div>
                        <div className="flex gap-2.5">
                          <button onClick={() => handleEditRefInit(doc)} className="p-1 px-2.5 border rounded text-xs font-bold text-teal-600 bg-teal-50/20 hover:bg-teal-50 cursor-pointer">
                            {isArabic ? "تعديل" : "Edit"}
                          </button>
                          <button onClick={() => handleDeleteRef(doc.id)} className="p-1 px-2.5 border rounded text-xs font-bold text-rose-600 bg-rose-50/20 hover:bg-rose-50 cursor-pointer">
                            {isArabic ? "حذف" : "Delete"}
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 leading-relaxed overflow-hidden text-ellipsis line-clamp-3">
                        {doc.description}
                      </p>

                      <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium">
                        <span>Issuer Authority: {doc.source}</span>
                        {doc.internal && <span className="bg-rose-50 text-rose-700 dark:bg-rose-950/25 px-1.5 py-0.5 rounded font-black border border-rose-200/10">INTERNAL</span>}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </>
          )}

          {/* TAB 3: DYNAMIC LABS LOCKS CONTROL & METADATA */}
          {activeTab === 'labs' && (
            <>
              {/* Left Column: Edit Lab Details if Selected */}
              <section className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-6 md:p-8 rounded-3xl shadow-sm flex flex-col gap-6">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h2 className="text-md font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <FlaskConical className="w-5 h-5 text-teal-605" />
                    <span>
                      {isEditingLab 
                        ? (isArabic ? "تعديل مواصفات المختبر الحالي" : "Tweak Laboratory Metadata")
                        : (isArabic ? "تخصيص تصنيفات المختبرات" : "Laboratory Configuration Desk")}
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    {isArabic 
                      ? "حدد أحد المختبرات من الجدول الجانبي لإتمام صياغة لافتات الأمان ومستويات القفل." 
                      : "Choose a lab on the catalog list to edit display labels and description blocks."}
                  </p>
                </div>

                {isEditingLab ? (
                  <form onSubmit={handleSaveLabDetails} className="flex flex-col gap-4">
                    <div className="text-xs font-bold text-[#00478d]">ID: {editingLabId}</div>
                    
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-black uppercase text-slate-500">{isArabic ? "اسم المختبر (English)" : "Lab Display Title (English)"}</label>
                      <input 
                        type="text"
                        value={labTitle}
                        onChange={(e) => setLabTitle(e.target.value)}
                        className="h-10 px-3 rounded-xl border border-slate-220 text-xs text-slate-900 bg-white"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-black uppercase text-slate-500">{isArabic ? "اسم المختبر بالعربية" : "Lab Display Title (Arabic)"}</label>
                      <input 
                        type="text"
                        value={labTitleAr}
                        onChange={(e) => setLabTitleAr(e.target.value)}
                        className="h-10 px-3 rounded-xl border border-slate-220 text-xs text-slate-900 bg-white text-right font-medium"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-black uppercase text-slate-500">{isArabic ? "شرح ومجالات التدريب" : "Educational Context (English)"}</label>
                      <textarea 
                        value={labDesc}
                        onChange={(e) => setLabDesc(e.target.value)}
                        className="min-h-16 p-2 rounded-xl border border-slate-205 text-xs text-slate-900 bg-white leading-relaxed"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-black uppercase text-slate-500">{isArabic ? "شرح ومجالات التدريب بالعربية" : "Educational Context (Arabic)"}</label>
                      <textarea 
                        value={labDescAr}
                        onChange={(e) => setLabDescAr(e.target.value)}
                        className="min-h-16 p-2 rounded-xl border border-slate-205 text-xs text-slate-900 bg-white text-right font-medium leading-relaxed"
                        required
                      />
                    </div>

                    <div className="flex items-center gap-2 select-none py-1">
                      <input 
                        type="checkbox"
                        id="labLockStatusCheck"
                        checked={labLocked}
                        onChange={(e) => setLabLocked(e.target.checked)}
                        className="w-4 h-4 rounded text-teal-605"
                      />
                      <label htmlFor="labLockStatusCheck" className="text-xs text-rose-600 font-bold cursor-pointer">
                        {isArabic ? "قفل وتجميد هذا المختبر مؤقتاً بالواجهة" : "Lock / Restrict access dynamically"}
                      </label>
                    </div>

                    <div className="flex gap-3.5 mt-2">
                      <button 
                        type="button" 
                        onClick={() => { setIsEditingLab(false); setEditingLabId(null); }}
                        className="flex-1 h-11 border border-slate-250 text-slate-550 text-xs font-bold rounded-xl hover:bg-slate-50"
                      >
                        {isArabic ? "إلغاء الإجراء" : "Discard"}
                      </button>
                      <button 
                        type="submit"
                        className="flex-1 h-11 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
                      >
                        <Save className="w-4 h-4" />
                        <span>{isArabic ? "مزامنة تفصيلات المعمل" : "Sync Options"}</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-200/60 text-center flex flex-col items-center gap-3">
                    <FlaskConical className="w-10 h-10 text-slate-400" />
                    <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                      {isArabic ? "يرجى تحديد مختبر من القائمة الجانبية لتخصيص نصوص التعريف واللوحات الإرشادية الخاصة به." : "Click any lab on the list to begin editing its displayed curriculum context parameters."}
                    </p>
                  </div>
                )}
              </section>

              {/* Right Column: Labs Active Catalog List with direct Toggle Lock & Edit */}
              <section className="lg:col-span-7 flex flex-col gap-4">
                <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div>
                    <h2 className="text-md font-bold text-slate-800 dark:text-white flex items-center gap-2">
                      <FlaskConical className="w-5 h-5 text-blue-600" />
                      <span>{isArabic ? "مستويات ومناهج المعامل المتاحة" : "Dynamic Laboratories & System Locks"}</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      {isArabic ? "تفعيل أو قفل المعامل مباشرة بالمنظومة لجميع الطلاب والباحثين." : "Directly unlock or lock lab training halls. Changes are active instantly."}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-1">
                  {localLabs.map(lab => (
                    <article key={lab.id} className="bg-white dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-5 hover:border-slate-300">
                      <div className="flex items-start gap-4 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-150 flex items-center justify-center text-[#00478d]">
                          {lab.locked ? <Lock className="w-5 h-5 text-rose-500" /> : <Unlock className="w-5 h-5 text-emerald-650" />}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-black text-slate-850 dark:text-slate-105">
                              {isArabic ? (lab.titleAr || lab.title) : lab.title}
                            </h3>
                            <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border ${
                              lab.locked ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200/50'
                            }`}>
                              {lab.locked ? (isArabic ? 'مغلق (Locked)' : 'LOCKED') : (isArabic ? 'متاح ونشط' : 'ACTIVATED')}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 truncate mt-1">
                            {isArabic ? (lab.descAr || lab.desc) : lab.desc}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 shrink-0">
                        {/* Instant Quick lock toggler */}
                        <button
                          onClick={() => handleToggleLabLock(lab)}
                          className={`h-9 px-3.5 border rounded-xl text-xs font-bold cursor-pointer transition-all ${
                            lab.locked 
                              ? 'bg-emerald-50 hover:bg-emerald-100 border-emerald-300 text-emerald-700' 
                              : 'bg-rose-50 hover:bg-rose-100 border-rose-200 text-rose-600'
                          }`}
                        >
                          {lab.locked ? (isArabic ? 'فك القفل' : 'Unlock') : (isArabic ? 'قفل' : 'Lock')}
                        </button>

                        {/* Edit display details */}
                        <button
                          onClick={() => handleEditLabInit(lab)}
                          className="h-9 px-3.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-705 bg-white hover:bg-slate-50 cursor-pointer"
                        >
                          {isArabic ? "تهيئة" : "Customize"}
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </>
          )}

        </div>
      )}

    </div>
  );
}
