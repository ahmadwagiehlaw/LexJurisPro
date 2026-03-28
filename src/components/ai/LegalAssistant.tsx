import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  Scale, 
  Shield, 
  Zap,
  Loader2,
  ChevronDown,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function LegalAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'مرحباً بك في مساعد LawBase الذكي. أنا هنا لمساعدتك في صياغة المذكرات، البحث عن السوابق القضائية، أو الإجابة على استفساراتك القانونية. كيف يمكنني مساعدتك اليوم؟' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userMessage,
        config: {
          systemInstruction: `أنت مساعد قانوني ذكي في تطبيق LawBase. 
          مهمتك هي مساعدة المحامين والقضاة في عملهم اليومي.
          يجب أن تكون إجاباتك دقيقة، مهنية، وتعتمد على الأنظمة والقوانين المعمول بها (خاصة في المملكة العربية السعودية ومصر).
          استخدم لغة قانونية رصينة وواضحة.
          إذا لم تكن متأكداً من معلومة، وضح ذلك وانصح بالرجوع للمصادر الرسمية.
          تحدث باللغة العربية دائماً.`,
        },
      });

      const aiResponse = response.text || 'عذراً، لم أتمكن من معالجة طلبك حالياً.';
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      console.error('AI Error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'حدث خطأ أثناء التواصل مع المساعد الذكي. يرجى المحاولة مرة أخرى.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 left-8 w-16 h-16 bg-[#0F172A] text-white rounded-[24px] shadow-2xl shadow-slate-900/40 flex items-center justify-center hover:scale-110 hover:bg-slate-800 transition-all z-50 group"
      >
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full animate-ping"></div>
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full border-2 border-white"></div>
        <Sparkles className="w-8 h-8 text-orange-500 group-hover:rotate-12 transition-transform" />
      </button>
    );
  }

  return (
    <div className={cn(
      "fixed bottom-8 left-8 bg-white rounded-[40px] shadow-2xl shadow-slate-900/20 border border-gray-100 flex flex-col z-50 transition-all duration-500 overflow-hidden",
      isMinimized ? "w-80 h-20" : "w-[450px] h-[650px]"
    )}>
      <div className="bg-[#0F172A] p-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-orange-500/20 flex items-center justify-center text-orange-500 border border-white/10">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-white font-black text-sm">المساعد القانوني الذكي</h4>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Powered by Gemini AI</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
            {messages.map((msg, i) => (
              <div key={i} className={cn(
                "flex",
                msg.role === 'user' ? "justify-start" : "justify-end"
              )}>
                <div className={cn(
                  "max-w-[85%] p-4 rounded-3xl text-sm leading-relaxed shadow-sm",
                  msg.role === 'user' 
                    ? "bg-white border border-gray-100 text-gray-700 rounded-tr-none" 
                    : "bg-[#0F172A] text-white rounded-tl-none"
                )}>
                  <div className="markdown-body">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-end">
                <div className="bg-[#0F172A] text-white p-4 rounded-3xl rounded-tl-none shadow-sm flex items-center gap-3">
                  <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                  <span className="text-xs font-bold">جاري التفكير...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-6 bg-white border-t border-gray-100 shrink-0">
            <div className="flex gap-3 mb-4">
              <button 
                onClick={() => setInput('صياغة مذكرة دفاع في قضية تجارية')}
                className="bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-full text-[10px] font-bold text-gray-500 transition-all"
              >
                صياغة مذكرة
              </button>
              <button 
                onClick={() => setInput('ابحث عن سابقة قضائية في بطلان عقد')}
                className="bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-full text-[10px] font-bold text-gray-500 transition-all"
              >
                بحث سوابق
              </button>
            </div>
            <div className="relative">
              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="اسأل المساعد القانوني..." 
                className="w-full bg-gray-50 border-none rounded-2xl py-4 pr-6 pl-16 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-orange-500/20 resize-none"
                rows={1}
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-orange-500 text-white rounded-xl flex items-center justify-center hover:bg-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/20"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
