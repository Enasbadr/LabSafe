/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, ShieldAlert, Sparkles, CornerDownLeft, Beaker, RotateCcw, AlertTriangle, ArrowLeft, Loader2 } from 'lucide-react';
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
    }
  ]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const bottomRef = useRef<HTMLDivElement>(null);

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

    const newMessages: ChatMessage[] = [
      ...messages,
      { role: 'user', parts: [{ text }] }
    ];

    setInputValue('');
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: text,
          history: messages
        })
      });

      if (!response.ok) {
        throw new Error('Failed to reach Dr. Safety Advisor');
      }

      const data = await response.json();
      setMessages(prev => [
        ...prev,
        { role: 'model', parts: [{ text: data.text }] }
      ]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        { 
          role: 'model', 
          parts: [{ 
            text: isArabic 
              ? "عذراً، واجهت مشكلة في الاتصال بالملقّم الاستشاري. يُرجى التحقق من اتصالك والمحاولة لاحقاً." 
              : "Apologies, I encountered an issue connecting to the advisory server. Please check your net connection or retry in a moment." 
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
            ? "تم إعادة تعيين جلسة الاستشارات الطبية. تفضل في طرح أي استسفار حول السلامة الكيميائية أو المعقمات." 
            : "Advisory session restarted. Feel free to ask any query about chemical hazards, SOPs, or safety shields."
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
                <span key={lineIdx} className="block font-bold text-sm sm:text-[14px] text-[#00478d] dark:text-blue-350 mt-5 mb-2.5 border-b border-slate-100 dark:border-slate-800 pb-1 pb-1">
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
    <div id="advisor-chat-viewport" className="flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-112px)] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden animate-fadeIn">
      
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

        <button
          onClick={handleClear}
          className="flex items-center gap-1 text-xs text-white/80 hover:text-white px-2.5 py-1.5 bg-white/10 rounded-lg transition-colors cursor-pointer border border-white/10"
          title="Reset conversation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{isArabic ? "البدء مجدداً" : "Reset"}</span>
        </button>
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
                  
                  {/* Persona Icon or Avatar Indicator */}
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 text-white font-bold select-none text-xs border ${
                    isModel 
                      ? 'bg-teal-600 border-teal-500' 
                      : 'bg-[#00478d] border-blue-400'
                  }`}>
                    {isModel ? "Dr" : "U"}
                  </div>

                  {/* Speech Bubble Card */}
                  <div className={`p-4 rounded-2xl shadow-sm border text-xs leading-relaxed ${
                    isModel 
                      ? 'bg-white text-slate-800 dark:bg-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700 rounded-tl-none' 
                      : 'bg-[#00478d] text-white border-blue-900 rounded-tr-none font-medium'
                  }`}>
                    <div className="leading-relaxed font-sans prose prose-sm dark:prose-invert">
                      {isModel ? formatMarkdown(msg.parts[0].text) : <div className="text-xs sm:text-[13px]">{msg.parts[0].text}</div>}
                    </div>
                  </div>

                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Loading Bubble */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start w-full"
          >
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
          className="h-10 w-10 shrink-0 bg-[#00478d] hover:bg-[#005db6] disabled:bg-slate-200 disabled:dark:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-500 rounded-xl flex items-center justify-center text-white transition-all shadow-sm cursor-pointer disabled:cursor-not-allowed disabled:transform-none"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
}
