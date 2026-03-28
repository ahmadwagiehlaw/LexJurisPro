import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Bell, 
  Shield, 
  Globe, 
  Database, 
  Mail, 
  Lock, 
  Smartphone,
  ChevronLeft,
  Camera,
  LogOut,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFirebase } from '../components/FirebaseProvider';
import { signOutUser } from '../firebase';

const settingsSections = [
  { id: 'profile', label: 'الملف الشخصي', icon: UserIcon, active: true },
  { id: 'notifications', label: 'التنبيهات', icon: Bell },
  { id: 'security', label: 'الأمان والخصوصية', icon: Shield },
  { id: 'language', label: 'اللغة والمنطقة', icon: Globe },
  { id: 'storage', label: 'إدارة البيانات', icon: Database },
];

export function Settings() {
  const { user, profile, loading } = useFirebase();
  const [activeSection, setActiveSection] = useState('profile');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-gray-900">الإعدادات</h2>
        <p className="text-gray-500 text-sm mt-1 font-bold">تخصيص تجربة LawBase وإدارة حسابك القانوني.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm space-y-1">
            {settingsSections.map((section) => (
              <button 
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  "w-full text-right p-4 rounded-2xl text-sm font-bold flex items-center justify-between group transition-all",
                  activeSection === section.id ? "bg-orange-50 text-orange-600" : "hover:bg-gray-50 text-gray-500"
                )}
              >
                <div className="flex items-center gap-4">
                  <section.icon className={cn("w-5 h-5", activeSection === section.id ? "text-orange-500" : "text-gray-400 group-hover:text-gray-600")} />
                  <span>{section.label}</span>
                </div>
                {activeSection === section.id && <ChevronLeft className="w-4 h-4" />}
              </button>
            ))}
          </div>

          <button 
            onClick={() => signOutUser()}
            className="w-full text-right p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold flex items-center gap-4 hover:bg-red-100 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>تسجيل الخروج</span>
          </button>
        </div>

        <div className="lg:col-span-3 space-y-8">
          <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full translate-x-32 -translate-y-32 blur-3xl"></div>
            
            <div className="relative z-10 space-y-10">
              <div className="flex items-center gap-8">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-[40px] overflow-hidden border-4 border-white shadow-xl">
                    <img src={user?.photoURL || "https://picsum.photos/seed/lawyer/200/200"} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <button className="absolute bottom-0 left-0 bg-[#0F172A] text-white p-3 rounded-2xl shadow-lg hover:bg-slate-800 transition-all group-hover:scale-110">
                    <Camera className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-gray-900">{profile?.displayName || user?.displayName}</h3>
                  <p className="text-sm font-bold text-gray-400">{profile?.role === 'admin' ? 'مدير النظام' : 'محامي بالنقض والإدارية العليا'}</p>
                  <div className="flex gap-2">
                    <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Premium Account</span>
                    <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Verified</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <UserIcon className="w-3 h-3" />
                    <span>الاسم الكامل</span>
                  </label>
                  <input 
                    type="text" 
                    defaultValue={profile?.displayName || user?.displayName || ''} 
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Mail className="w-3 h-3" />
                    <span>البريد الإلكتروني</span>
                  </label>
                  <input 
                    type="email" 
                    defaultValue={user?.email || ''} 
                    disabled
                    className="w-full bg-gray-100 border-none rounded-2xl py-4 px-6 text-sm font-bold text-gray-400 focus:ring-0 cursor-not-allowed"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Smartphone className="w-3 h-3" />
                    <span>رقم الهاتف</span>
                  </label>
                  <input 
                    type="text" 
                    defaultValue={profile?.phoneNumber || "+966 50 123 4567"} 
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Shield className="w-3 h-3" />
                    <span>رقم القيد النقابي</span>
                  </label>
                  <input 
                    type="text" 
                    defaultValue={profile?.lawyerId || "LAW-88765-2023"} 
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
              </div>

              <div className="pt-8 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500">
                    <Lock className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="text-sm font-black text-gray-900">تغيير كلمة المرور</h5>
                    <p className="text-[10px] text-gray-400 font-bold">آخر تغيير كان منذ 3 أشهر</p>
                  </div>
                </div>
                <button className="bg-gray-50 hover:bg-gray-100 text-gray-600 px-6 py-2 rounded-xl text-xs font-bold transition-all">تحديث الأمان</button>
              </div>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm">
            <h3 className="text-xl font-black text-gray-900 mb-8">تفضيلات النظام</h3>
            <div className="space-y-6">
              {[
                { label: 'الوضع الليلي', desc: 'تفعيل المظهر الداكن لراحة العين في المساء', enabled: false },
                { label: 'تنبيهات البريد', desc: 'استلام ملخص يومي للجلسات والمواعيد القادمة', enabled: true },
                { label: 'المصادقة الثنائية', desc: 'إضافة طبقة حماية إضافية عند تسجيل الدخول', enabled: true },
              ].map((pref, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <h5 className="text-sm font-black text-gray-900">{pref.label}</h5>
                    <p className="text-xs text-gray-400 font-bold">{pref.desc}</p>
                  </div>
                  <button className={cn(
                    "w-12 h-6 rounded-full relative transition-all",
                    pref.enabled ? "bg-orange-500" : "bg-gray-200"
                  )}>
                    <div className={cn(
                      "absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm",
                      pref.enabled ? "left-1" : "right-1"
                    )}></div>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button className="px-8 py-3 rounded-2xl text-sm font-bold text-gray-400 hover:text-gray-600 transition-all">إلغاء التغييرات</button>
            <button className="bg-[#0F172A] text-white px-10 py-3 rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">حفظ الإعدادات</button>
          </div>
        </div>
      </div>
    </div>
  );
}
