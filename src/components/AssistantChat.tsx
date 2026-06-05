/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, ShieldAlert, Sparkles, RotateCcw, ArrowLeft, Loader2, Key, Trash2, X, HelpCircle } from 'lucide-react';
import { AppLogo } from './AppLogo';

interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

interface AssistantChatProps {
  isArabic: boolean;
  userEmail: string;
  onBack: () => void;
}

export default function AssistantChat({ isArabic, userEmail, onBack }: AssistantChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      parts: [{ 
        text: isArabic 
          ? "مرحباً بك! أنا الدكتور لابسيف (Dr. Safety)، مستشارك الطبي والبيولوجي للسلامة والوقاية المختبرية. كيف يمكنني مساعدتك في بروتوكولات الأمان اليوم؟" 
          : "Hello scientific peer! I am Dr. Safety, your dedicated laboratory safety and biosafety advisor. How can I assist you with safety protocols, PPE standards, or chemical containment today?"
      }]
    },
    {
      role: 'model',
      parts: [{
        text: isArabic
          ? "💡 **ملاحظة لتجربة الشات الذكي:** لحماية خصوصية البيانات، إذا كنت ترغب في طرح أسئلة مخصصة وتلقي إجابات مباشرة من الذكاء الاصطناعي، ستحتاج إلى إدخال مفتاح الـ **Gemini API Key** الخاص بك. يمكنك الضغط على زر **'ربط المفتاح'** في الأعلى أو تفعيله عند محاولة إرسال رسالة."
          : "💡 **Notice for Live AI Chat:** To protect developer credentials, if you wish to ask custom questions and get instant AI responses, you will need to provide your own **Gemini API Key**. You can click **'Connect Key'** at the top or activate it when trying to send a message."
      }]
    }
  ]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('LABSAFE_USER_API_KEY') || '');
  const [inputApiKey, setInputApiKey] = useState<string>('');
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);

  const handleSaveKey = (e: FormEvent) => {
    e.preventDefault();
    if (!inputApiKey.trim()) return;
    localStorage.setItem('LABSAFE_USER_API_KEY', inputApiKey.trim());
    setApiKey(inputApiKey.trim());
    setShowKeyModal(false);
  };

  const handleClearKey = () => {
    localStorage.removeItem('LABSAFE_USER_API_KEY');
    setApiKey('');
    setInputApiKey('');
  };

  // Auto scroll to latest advice message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const starterPrompts = isArabic ? [
    { label: "بروتوكول التعامل مع الأحماض", prompt: "ما هي المتطلبات الصحيحة للتعامل مع حمض الهيدروكلوريك بتركيز ٣٧٪؟" },
    { label: "عزل وانسكابات بيولوجية", prompt: "كيف يتم التعامل مع انسكاب بيولوجي من المستوى الثاني BSL-2؟" },
    { label: "متطلبات درع العين والوجه", prompt: "ما هو الفرق بين نظارات السلامة العادية وجهاز حماية كامل الوجه؟" }
  ] : [
    { label: "Acid Handling Standards", prompt: "What are the proper safety protocols for handling 37% Hydrochloric Acid?" },
    { label: "BSL-2 Spill Containment", prompt: "How should I clean and contain a biological spill in a BSL-2 area?" },
    { label: "Eye & Face Shield Specs", prompt: "When is a full face-shield required versus standard safety goggles?" }
  ];

 const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    // فحص: هل السؤال جاي من الأزرار الجاهزة؟
    const isStarterPrompt = starterPrompts.some(btn => btn.prompt === text);

    // لو كتابة مخصصة ومفيش مفتاح، نفتح الـ Modal ونوقف
    if (!isStarterPrompt && !apiKey) {
      setShowKeyModal(true);
      return;
    }

    const newMessages: ChatMessage[] = [
      ...messages,
      { role: 'user', parts: [{ text }] }
    ];

    setInputValue('');
    setMessages(newMessages);
    setIsLoading(true);

    // لو السؤال جاي من الأزرار الجاهزة ومفيش مفتاح، نشغل الـ Backup من السيرفر علطول
    if (isStarterPrompt && !apiKey) {
      try {
        const response = await fetch('/api/assistant/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text, history: messages })
        });
        const data = await response.json();
        setMessages(prev => [...prev, { role: 'model', parts: [{ text: data.text }] }]);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // الـ Live Mode: لو فيه مفتاح، يكلم جوجل مباشرة من المتصفح (Frontend)!
    try {
      // استيراد المكتبة ديناميكياً لتفادي مشاكل الشاشة البيضاء
      const { GoogleGenAI } = await import('@google/genai');
      
      const ai = new GoogleGenAI({ apiKey: apiKey });
      
      const systemInstruction = `You are "Dr. Safety", the expert Clinical Safety Officer advising scientific peers on the LabSafe platform (منصة لابسيف للسلامة المختبرية والطبية).
Your expertise spans laboratory biosafety, proper Personal Protective Equipment (PPE) handling, hazardous acid spill controls, SDS evaluation, sterilisation processes, and clinical laboratory standards.
Provide clear, structured, and friendly instructions.
If the researcher asks in Arabic, reply in professional, helpful Arabic. If in English, reply in English.
Structure your answers beautifully using markdown lists, bold terms, and advice bullets where helpful. Avoid talking about code files or system configs. Stick purely to realistic scientific safety procedures.`;

      console.log("Dr. Safety: Fetching live AI response directly from client browser...");
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          ...(messages || []).slice(-10).map(msg => ({
            role: msg.role === 'model' ? 'model' : 'user',
            parts: [{ text: msg.parts[0].text }]
          })),
          { role: 'user', parts: [{ text }] }
        ],
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      setMessages(prev => [
        ...prev,
        { role: 'model', parts: [{ text: response.text || '' }] }
      ]);

    } catch (err: any) {
      console.error("Live Client AI Error:", err);
      setMessages(prev => [
        ...prev,
        { 
          role: 'model', 
          parts: [{ 
            text: isArabic 
              ? "عذراً، حدث خطأ أثناء الاتصال المباشر بالذكاء الاصطناعي. يرجى التحقق من صلاحية الـ API Key الخاص بك والمحاولة مجدداً." 
              : "Apologies, an error occurred during live AI fetch. Please verify your API Key and retry." 
          }] 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSend(inputValue);
  };

  const handleClear = () => {
    setMessages([
      {
        role: 'model',
        parts: [{ 
          text: isArabic 
            ? "مرحباً بك! أنا الدكتور لابسيف (Dr. Safety)، مستشارك الطبي والبيولوجي للسلامة والوقاية المختبرية. كيف يمكنني مساعدتك في بروتوكولات الأمان اليوم؟" 
            : "Hello scientific peer! I am Dr. Safety, your dedicated laboratory safety and biosafety advisor. How can I assist you with safety protocols, PPE standards, or chemical containment today?"
        }]
      },
      {
        role: 'model',
        parts: [{
          text: isArabic
            ? "💡 **ملاحظة لتجربة الشات الذكي:** لحماية خصوصية البيانات، إذا كنت ترغب في طرح أسئلة مخصصة وتلقي إجابات مباشرة من الذكاء الاصطناعي، ستحتاج إلى إدخال مفتاح الـ **Gemini API Key** الخاص بك. يمكنك الضغط على زر **'ربط المفتاح'** في الأعلى أو تفعيله عند محاولة إرسال رسالة."
            : "💡 **Notice for Live AI Chat:** To protect developer credentials, if you wish to ask custom questions and get instant AI responses, you will need to provide your own **Gemini API Key**. You can click **'Connect Key'** at the top or activate it when trying to send a message."
        }]
      }
    ]);
  };

  const parseBold = (textLine: string) => {
    const parts = textLine.split(/\*\*([\s\S]*?)\*\*/g);
    if (parts.length === 1) return textLine;
    return parts.map((part, idx) => {
      if (idx % 2 === 1) {
        return <strong key={idx} className="font-extrabold text-teal-700 dark:text-teal-355">{part}</strong>;
      }
      return part;
    });
  };

  const formatMarkdown = (inputText: string) => {
    const paragraphs = inputText.split('\n\n');
    return paragraphs.map((para, paraIdx) => {
      const lines = para.split('\n');
      
      const isList = lines.every(line => {
        const trimmed = line.trim();
        return trimmed.startsWith('- ') || trimmed.startsWith('* ') || /^\d+\.\s/.test(trimmed);
      });

      if (isList && para.trim().length > 0) {
        return (
          <ul key={paraIdx} className="list-disc pl-5 my-2.5 space-y-2 list-outside text-slate-800 dark:text-slate-100">
            {lines.map((line, lineIdx) => {
              const cleaned = line.trim().replace(/^[-*]\s+/, '').replace(/^\d+\.\s+/, '');
              return (
                <li key={lineIdx} className="text-xs sm:text-[13px] leading-relaxed">
                  {parseBold(cleaned)}
                </li>
              );
            })}
          </ul>
        );
      }

      return (
        <p key={paraIdx} className="mb-3 last:mb-0 leading-relaxed text-xs sm:text-[13px] text-slate-800 dark:text-slate-100 animate-slideUp">
          {lines.map((line, lineIdx) => {
            const trimmed = line.trim();
            
            if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
              return (
                <span key={lineIdx} className="block pl-4 relative my-2 text-xs sm:text-[13px] text-slate-850 dark:text-slate-100">
                  <span className="absolute left-0 top-1 text-teal-500">•</span>
                  {parseBold(trimmed.substring(2))}
                </span>
              );
            }
            if (/^\d+\.\s/.test(trimmed)) {
              const match = trimmed.match(/^(\d+\.)\s(.*)/);
              return (
                <span key={lineIdx} className="block pl-4 relative my-2 text-xs sm:text-[13px] text-slate-850 dark:text-slate-100">
                  <span className="absolute left-0 top-0.5 text-teal-600 dark:text-teal-400 font-bold font-mono text-[11px]">{match ? match[1] : ''}</span>
                  {parseBold(match ? match[2] : trimmed)}
                </span>
              );
            }

            if (trimmed.startsWith('###')) {
              return (
                <span key={lineIdx} className="block font-semibold text-xs sm:text-[13px] text-[#00478d] dark:text-blue-300 mt-4 mb-2 uppercase tracking-wide">
                  {parseBold(trimmed.replace(/^###\s*/, ''))}
                </span>
              );
            }
            if (trimmed.startsWith('##')) {
              return (
                <span key={lineIdx} className="block font-bold text-sm sm:text-[14px] text-[#00478d] dark:text-blue-350 mt-5 mb-2.5 border-b border-slate-100 dark:border-slate-800 pb-1">
                  {parseBold(trimmed.replace(/^##\s*/, ''))}
                </span>
              );
            }

            return (
              <span key={lineIdx} className="block mt-0.5 first:mt-0">
                {parseBold(line)}
              </span>
            );
          })}
        </p>
      );
    });
  };

  return (
    <div id="advisor-chat-viewport" className="flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-112px)] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden animate-fadeIn relative">
      
      {/* Top Advisor Header Panel */}
      <div className="px-5 py-4 bg-gradient-to-r from-teal-600 to-[#00478d] text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-1.5 hover:bg-white/10 rounded-lg text-white transition-colors cursor-pointer mr-2 flex items-center"
            title="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="relative">
            <AppLogo size={42} showShadow={false} />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-teal-400 border-2 border-slate-900 rounded-full z-10"></span>
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight">
              {isArabic ? "المستشار الذكي لسلامة المختبرات" : "AI Laboratory Safety Advisor"}
            </h2>
            <p className="text-[10px] text-teal-200 uppercase font-extrabold tracking-wider">
              {isArabic ? "د. لابسيف ● متاح دائمًا" : "Dr. Safety ● Live duty officer"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {apiKey ? (
            <button
              onClick={handleClearKey}
              className="flex items-center gap-1 text-xs text-red-200 hover:text-red-100 px-2.5 py-1.5 bg-red-950/20 hover:bg-red-900/30 rounded-lg transition-colors cursor-pointer border border-red-900/30"
              title={isArabic ? "حذف مفتاح الـ API" : "Delete saved API Key"}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isArabic ? "حذف المفتاح" : "Clear Key"}</span>
            </button>
          ) : (
            <button
              onClick={() => setShowKeyModal(true)}
              className="flex items-center gap-1 text-xs text-teal-200 hover:text-teal-100 px-2.5 py-1.5 bg-teal-950/20 hover:bg-teal-900/30 rounded-lg transition-colors cursor-pointer border border-teal-900/30"
              title={isArabic ? "إدخال مفتاح الـ API" : "Enter API Key"}
            >
              <Key className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isArabic ? "ربط المفتاح" : "Connect Key"}</span>
            </button>
          )}

          <button
            onClick={handleClear}
            className="flex items-center gap-1 text-xs text-white/80 hover:text-white px-2.5 py-1.5 bg-white/10 rounded-lg transition-colors cursor-pointer border border-white/10"
            title="Reset conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isArabic ? "البدء مجدداً" : "Reset"}</span>
          </button>
        </div>
      </div>

      {/* Main Messages & Advisory Feed */}
      <div className="flex-1 overflow-y-auto px-5 py-6 bg-slate-50/50 dark:bg-slate-950/20 space-y-4">
        
        {/* Short Safety Warning */}
        <div className="p-3.5 bg-[#fffbcb] dark:bg-amber-950/20 rounded-xl border border-[#f5eb9c] dark:border-amber-900/40 flex gap-3 text-slate-800 dark:text-amber-200">
          <ShieldAlert className="w-5 h-5 text-[#d48c00] shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed">
            <strong className="font-bold block mb-1">
              {isArabic ? "بروتوكول السلامة الإرشادي" : "Guideline Notice"}
            </strong>
            {isArabic 
              ? "ملاحظات وتوجيهات هذا المستشار تعتمد على معايير السلامة القياسية (OSHA, SDS, CDC). يرجى التنسيق دائماً مع مسؤول السلامة المؤسسي في جامعتك أو معملك."
              : "This AI advisor generates answers matching global chemical guidelines. Always align final workplace checks with your institutional safety officer."}
          </div>
        </div>

        {/* Dynamic Chats List */}
        <AnimatePresence initial={false}>
          {messages.map((msg, index) => {
            const isModel = msg.role === 'model';
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex ${isModel ? 'justify-start' : 'justify-end'} w-full`}
              >
                <div className={`flex items-start gap-2.5 max-w-[85%] ${isModel ? 'flex-row' : 'flex-row-reverse'}`}>
                  
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 text-white font-bold select-none text-xs border ${
                    isModel ? 'bg-teal-600 border-teal-500' : 'bg-[#00478d] border-blue-400'
                  }`}>
                    {isModel ? "Dr" : "U"}
                  </div>

                  <div className={`p-4 rounded-2xl shadow-sm border text-xs leading-relaxed ${
                    isModel 
                      ? 'bg-white text-slate-800 dark:bg-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700 rounded-tl-none' 
                      : 'bg-[#00478d] text-white border-blue-900 rounded-tr-none font-medium'
                  }`}>
                    <div className="leading-relaxed font-sans prose prose-sm dark:prose-invert">
                      {formatMarkdown(msg.parts[0].text)}
                    </div>
                  </div>

                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Loading Bubble */}
        {isLoading && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start w-full">
            <div className="flex items-start gap-2.5">
              <div className="h-8 w-8 rounded-full bg-teal-600 flex items-center justify-center shrink-0 border border-teal-500">
                <Loader2 className="w-4 h-4 text-white animate-spin" />
              </div>
              <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl rounded-tl-none border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-2 text-xs text-slate-500 dark:text-slate-300">
                <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 animate-pulse" />
                <span>{isArabic ? "الدكتور لابسيف يقوم بفحص المعايير..." : "Dr. Safety is reviewing chemical safety metrics..."}</span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Starter Prompts Deck Panel */}
      <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900 flex flex-wrap gap-2">
        {starterPrompts.map((btn, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(btn.prompt)}
            disabled={isLoading}
            className="text-[11px] font-medium px-3.5 py-2 bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-all cursor-pointer text-[#00478d] dark:text-teal-400 font-sans shadow-sm inline-flex items-center gap-1 hover:border-[#00478d]"
          >
            <Sparkles className="w-3 h-3 text-teal-600 dark:text-teal-400" />
            <span>{btn.label}</span>
          </button>
        ))}
      </div>

      {/* Bottom Message Composition Bar */}
      <form onSubmit={handleSubmit} className="p-4 bg-white dark:bg-slate-800 border-t border-slate-200/80 dark:border-slate-800 flex gap-3.5 items-center">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={isLoading}
          placeholder={isArabic ? "اسأل الدكتور لابسيف عن المواد الكيميائية والأمان..." : "Ask Dr. Safety about hazmats, eye protection, neutralizers..."}
          className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#00478d] transition-colors"
        />

        <button
          type="submit"
          disabled={!inputValue.trim() || isLoading}
          className="h-10 w-10 shrink-0 bg-[#00478d] hover:bg-[#005db6] disabled:bg-slate-200 disabled:dark:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-500 rounded-xl flex items-center justify-center text-white transition-all shadow-sm cursor-pointer disabled:transform-none"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* 🌟 نافذة طلب المفتاح المنبثقة والذكية بالكامل (Modal Overlay) 🌟 */}
      {showKeyModal && (
        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-5 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-xl relative text-center">
            
            {/* زر الإلغاء (X) */}
            <button 
              type="button"
              onClick={() => setShowKeyModal(false)} 
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-600 dark:text-teal-400 mx-auto mb-4 shadow-sm">
              <Key className="w-5 h-5" />
            </div>

            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-2">
              {isArabic ? "تفعيل المستشار الذكي (Gemini AI)" : "Activate Dr. Safety Advisor"}
            </h3>
            
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed px-2">
              {isArabic 
                ? "لحماية أمن معلومات المطور، يرجى تفعيل المساعد الذكي بمفتاح الـ API الخاص بك. يتم حفظه بأمان في متصفحك فقط."
                : "To ensure cyber safety, please activate the chat assistant using your own API Key. It is stored securely only in your browser."}
            </p>

            {/* رابط إرشادات الحصول على المفتاح */}
            <a 
              href="https://aistudio.google.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-600 dark:text-teal-400 hover:underline mb-5 bg-teal-50/50 dark:bg-teal-950/20 px-3 py-1.5 rounded-lg border border-teal-100 dark:border-teal-900/40"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{isArabic ? "كيف أحصل على مفتاح مجاني؟ (إرشادات)" : "How to get a free API key? (Guide)"}</span>
            </a>

            <form onSubmit={handleSaveKey} className="w-full flex flex-col gap-2.5">
              <input
                type="password"
                value={inputApiKey}
                onChange={(e) => setInputApiKey(e.target.value)}
                placeholder={isArabic ? "أدخل مفتاح الـ API هنا (AIza...)" : "Enter your API Key (AIza...)"}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500 text-slate-800 dark:text-slate-100 shadow-sm"
              />
              <div className="flex gap-2 w-full mt-1.5">
                <button 
                  type="button" 
                  onClick={() => setShowKeyModal(false)} 
                  className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  {isArabic ? "إلغاء وتصفح الشات" : "Cancel & Browse"}
                </button>
                <button 
                  type="submit" 
                  disabled={!inputApiKey.trim()} 
                  className="flex-1 bg-teal-600 hover:bg-teal-500 disabled:bg-slate-200 disabled:dark:bg-slate-800 text-white py-2 rounded-xl text-xs font-bold transition-colors disabled:cursor-not-allowed shadow-sm"
                >
                  {isArabic ? "تفعيل الحفظ" : "Activate & Save"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}