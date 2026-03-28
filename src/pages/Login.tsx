import React from 'react';
import { loginWithGoogle } from '../firebase';
import { Scale } from 'lucide-react';

export function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 rtl">
      <div className="bg-white p-12 rounded-[40px] shadow-2xl border border-gray-100 max-w-md w-full text-center space-y-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full translate-x-16 -translate-y-16 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/5 rounded-full -translate-x-16 translate-y-16 blur-2xl"></div>
        
        <div className="relative z-10 space-y-6">
          <div className="w-24 h-24 bg-[#0F172A] text-orange-500 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-slate-900/20 rotate-3 hover:rotate-0 transition-transform duration-500">
            <Scale className="w-12 h-12" />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-gray-900">LawBase</h1>
            <p className="text-gray-500 font-bold">Lex Juris Pro</p>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">مرحباً بك في الأرشيف السيادي. يرجى تسجيل الدخول للوصول إلى ملفاتك القانونية.</p>
        </div>

        <button 
          onClick={loginWithGoogle}
          className="w-full bg-white border-2 border-gray-100 text-gray-700 py-4 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-gray-50 hover:border-orange-200 transition-all group relative z-10"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
          <span>تسجيل الدخول بواسطة جوجل</span>
        </button>

        <div className="relative z-10 pt-6 border-t border-gray-50">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">نظام الأرشفة القانونية الموحد</p>
        </div>
      </div>
    </div>
  );
}
