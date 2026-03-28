import React from 'react';
import { 
  MessageSquare, 
  Phone, 
  Mail, 
  FileQuestion, 
  Book, 
  ChevronLeft, 
  Send,
  LifeBuoy,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

const faqs = [
  { q: 'كيف يمكنني إضافة قضية جديدة؟', a: 'يمكنك إضافة قضية جديدة بالضغط على زر "قضية جديدة" في القائمة الجانبية أو من خلال صفحة القضايا.' },
  { q: 'هل بياناتي مشفرة وآمنة؟', a: 'نعم، نستخدم تقنيات تشفير AES-256 المتطورة لحماية جميع البيانات والوثائق القانونية الخاصة بك.' },
  { q: 'كيف يمكنني تصدير التقارير المالية؟', a: 'من خلال صفحة الإحصائيات، يمكنك اختيار الفترة الزمنية والضغط على زر "تصدير التقرير" بصيغة PDF أو Excel.' },
  { q: 'هل يدعم النظام الربط مع بوابة ناجز؟', a: 'نعمل حالياً على توفير ميزة الربط المباشر مع بوابة ناجز لتحديث الجلسات تلقائياً.' },
];

export function Support() {
  return (
    <div className="space-y-8">
      <div className="relative bg-[#0F172A] rounded-[40px] p-12 overflow-hidden shadow-2xl shadow-slate-900/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full translate-x-32 -translate-y-32 blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="space-y-6 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-orange-500/10 text-orange-500 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest">
              <LifeBuoy className="w-4 h-4" />
              <span>مركز المساعدة والدعم</span>
            </div>
            <h2 className="text-5xl font-black text-white leading-tight">كيف يمكننا مساعدتك اليوم؟</h2>
            <p className="text-gray-400 text-lg">فريق الدعم الفني متواجد على مدار الساعة لضمان سير عملك القانوني دون أي عوائق.</p>
            <div className="flex gap-4">
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-2xl font-black text-sm transition-all shadow-lg shadow-orange-500/20">تحدث مع الدعم الآن</button>
              <button className="bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-2xl font-black text-sm transition-all border border-white/10">مركز المعرفة</button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full lg:w-auto">
            <div className="bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-xl space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/20 flex items-center justify-center text-orange-500">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-white font-bold">حماية البيانات</h4>
              <p className="text-xs text-gray-500">نلتزم بأعلى معايير الخصوصية.</p>
            </div>
            <div className="bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-xl space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-500">
                <Zap className="w-6 h-6" />
              </div>
              <h4 className="text-white font-bold">استجابة سريعة</h4>
              <p className="text-xs text-gray-500">متوسط الرد أقل من 5 دقائق.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm">
            <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
              <FileQuestion className="w-7 h-7 text-orange-500" />
              <span>الأسئلة الشائعة</span>
            </h3>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="border border-gray-100 rounded-2xl overflow-hidden group">
                  <button className="w-full text-right p-6 flex items-center justify-between hover:bg-gray-50 transition-all">
                    <span className="font-bold text-gray-700">{faq.q}</span>
                    <ChevronLeft className="w-5 h-5 text-gray-300 group-hover:text-orange-500 transition-all" />
                  </button>
                  <div className="px-6 pb-6 text-sm text-gray-500 leading-relaxed">
                    {faq.a}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm">
            <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
              <MessageSquare className="w-7 h-7 text-orange-500" />
              <span>أرسل لنا رسالة</span>
            </h3>
            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">الموضوع</label>
                  <input type="text" placeholder="مثلاً: مشكلة في تسجيل الدخول" className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-orange-500/20" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">نوع الطلب</label>
                  <select className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-orange-500/20">
                    <option>دعم فني</option>
                    <option>استفسار مالي</option>
                    <option>اقتراح تطوير</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">الرسالة</label>
                <textarea rows={5} placeholder="اشرح لنا بالتفصيل كيف يمكننا مساعدتك..." className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-orange-500/20 resize-none"></textarea>
              </div>
              <button className="bg-[#0F172A] text-white px-10 py-4 rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">
                <Send className="w-5 h-5 text-orange-500" />
                <span>إرسال الطلب</span>
              </button>
            </form>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h4 className="font-black text-gray-900 mb-8">قنوات التواصل</h4>
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-all cursor-pointer group">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">اتصل بنا</p>
                  <p className="text-sm font-black text-gray-900">+966 800 123 4567</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-all cursor-pointer group">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">البريد الإلكتروني</p>
                  <p className="text-sm font-black text-gray-900">support@lawbase.sa</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-all cursor-pointer group">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
                  <Book className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">دليل المستخدم</p>
                  <p className="text-sm font-black text-gray-900">docs.lawbase.sa</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#0F172A] p-8 rounded-3xl shadow-xl shadow-slate-900/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-orange-500/10 rounded-full -translate-x-16 -translate-y-16 blur-2xl"></div>
            <div className="relative z-10 space-y-6">
              <h4 className="text-xl font-black text-white">حالة النظام</h4>
              <div className="space-y-4">
                {[
                  { label: 'قاعدة البيانات', status: 'يعمل بكفاءة', color: 'bg-green-500' },
                  { label: 'خوادم الملفات', status: 'يعمل بكفاءة', color: 'bg-green-500' },
                  { label: 'بوابة الدفع', status: 'صيانة مجدولة', color: 'bg-orange-500' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 font-bold">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-white font-bold">{item.status}</span>
                      <div className={cn("w-2 h-2 rounded-full animate-pulse", item.color)}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
