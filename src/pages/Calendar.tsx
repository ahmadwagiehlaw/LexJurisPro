import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Filter, 
  Clock, 
  MapPin, 
  Scale, 
  User,
  MoreVertical,
  Calendar as CalendarIcon,
  FileText,
  History,
  MessageSquare,
  Check,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { db, collection, onSnapshot, query, where, orderBy, handleFirestoreError, OperationType } from '../firebase';
import { useFirebase } from '../components/FirebaseProvider';

export function CalendarPage() {
  const { user } = useFirebase();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'sessions'), 
      where('uid', '==', user.uid),
      orderBy('time', 'asc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const sessionsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSessions(sessionsData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'sessions');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('ar-EG', options);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() + 1)))}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            <h2 className="text-3xl font-black text-gray-900">{formatDate(selectedDate)}</h2>
            <button 
              onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 1)))}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          </div>
          <div className="flex items-center gap-2 text-gray-500 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
            <CalendarIcon className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-bold">لديك {sessions.length} جلسات مجدولة لهذا اليوم.</span>
          </div>
        </div>
        <div className="flex gap-2 bg-white p-1 rounded-xl border border-gray-100 shadow-sm">
          <button className="px-6 py-2 rounded-lg text-sm font-bold bg-[#0F172A] text-white shadow-lg shadow-slate-900/10">الكل ({sessions.length})</button>
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {sessions.length > 0 ? sessions.map((session, i) => (
            <div key={i} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-all">
              <div className="p-8">
                <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-2xl font-black text-gray-900">{session.time?.split('T')[1]?.substring(0, 5) || '--:--'}</p>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">صباحاً</p>
                    </div>
                    <div className="h-12 w-[1px] bg-gray-100"></div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-[10px] text-gray-400 font-bold tracking-wider uppercase">CASE ID: #{session.caseId?.substring(0, 8)}</span>
                        <span className={cn(
                          "px-3 py-0.5 rounded-full text-[10px] font-bold",
                          session.status === 'نطق بالحكم' ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                        )}>
                          {session.status}
                        </span>
                      </div>
                      <h3 className="text-2xl font-black text-gray-900 group-hover:text-orange-500 transition-colors">{session.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-orange-600 font-bold mt-1">
                        <Clock className="w-3 h-3" />
                        <span>المحكمة: {session.court}</span>
                      </div>
                    </div>
                  </div>
                  <button className="p-2 text-gray-300 hover:text-gray-600">
                    <MoreVertical className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-8 mb-8">
                  <div className="space-y-1">
                    <p className="text-[10px] text-gray-400 uppercase flex items-center gap-1">
                      <Scale className="w-3 h-3" />
                      <span>المحكمة</span>
                    </p>
                    <p className="text-sm font-bold text-gray-700">{session.court}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-gray-400 uppercase flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>الدائرة</span>
                    </p>
                    <p className="text-sm font-bold text-gray-700">{session.chamber || 'غير محدد'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-gray-400 uppercase flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>الموكل</span>
                    </p>
                    <p className="text-sm font-bold text-gray-700">{session.client || 'غير محدد'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="text-[10px] text-gray-400 uppercase font-bold">الملاحظات الفنية والمرافعات</p>
                    <div className="bg-gray-50 rounded-2xl p-4 min-h-[100px] border border-gray-100">
                      <p className="text-xs text-gray-700">{session.notes || 'لا توجد ملاحظات حالياً...'}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] text-gray-400 uppercase font-bold">قرار الجلسة الحالي</p>
                    <div className="bg-gray-50 rounded-2xl p-4 min-h-[100px] border border-gray-100 flex items-center justify-center text-center">
                      <div className="space-y-2">
                        <Scale className="w-6 h-6 text-gray-300 mx-auto" />
                        <p className="text-xs text-gray-400 font-bold">{session.decision || 'بانتظار القرار...'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <div className="flex gap-4">
                  <button className="text-xs font-bold text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2">
                    <History className="w-4 h-4" />
                    <span>سجل الجلسات السابقة</span>
                  </button>
                </div>
                <div className="flex gap-3">
                  <button className="bg-white border border-gray-200 px-6 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all">أرشيف الجلسة</button>
                  <button className="bg-[#0F172A] text-white px-6 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">
                    <Check className="w-4 h-4 text-orange-500" />
                    <span>حفظ وتحديث الأجندة</span>
                  </button>
                </div>
              </div>
            </div>
          )) : (
            <div className="bg-white p-20 rounded-3xl border border-gray-100 shadow-sm text-center space-y-4">
              <CalendarIcon className="w-16 h-16 text-gray-200 mx-auto" />
              <h3 className="text-xl font-bold text-gray-900">لا توجد جلسات مجدولة</h3>
              <p className="text-gray-500">استمتع بيوم هادئ، لا توجد مواعيد مرافعة اليوم.</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-24 h-24 bg-orange-500/5 rounded-full -translate-x-12 -translate-y-12 blur-xl"></div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 shadow-sm">
                  <FileText className="w-6 h-6" />
                </div>
                <button className="text-xs font-bold text-orange-500 hover:underline">عرض الكل ←</button>
              </div>
              <h4 className="text-xl font-black text-gray-900 mb-2">المستندات المحملة</h4>
              <p className="text-xs text-gray-500 mb-6">تم تحميل الوثائق المتعلقة بجلسات اليوم.</p>
            </div>

            <div className="bg-[#0F172A] p-8 rounded-3xl shadow-xl shadow-slate-900/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full translate-x-16 -translate-y-16 blur-2xl"></div>
              <div className="relative z-10">
                <h4 className="text-xl font-black text-white mb-2">تجهيز المذكرة الجوابية</h4>
                <p className="text-xs text-gray-400 mb-6 leading-relaxed">يجب إيداع المذكرة قبل الجلسة القادمة بـ 48 ساعة كحد أقصى لتجنب الغرامات الإجرائية.</p>
                <button className="w-full bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all border border-white/10">
                  <Scale className="w-4 h-4 text-orange-500" />
                  <span>فتح المحرر القانوني</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-8">
          <div className="flex items-center justify-between">
            <h4 className="font-black text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-500" />
              <span>الجدول الزمني</span>
            </h4>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">GMT +3</span>
          </div>

          <div className="space-y-12 relative before:absolute before:right-[35px] before:top-4 before:bottom-4 before:w-[1px] before:bg-gray-100">
            {sessions.map((item, i) => (
              <div key={i} className="relative pr-16">
                <div className={cn(
                  "absolute right-[28px] top-1 w-4 h-4 rounded-full border-4 border-white shadow-sm z-10",
                  "bg-orange-500"
                )}></div>
                <div className="absolute right-0 top-0 text-right">
                  <p className="text-sm font-black text-gray-900">{item.time?.split('T')[1]?.substring(0, 5)}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm border-r-4 border-r-orange-500">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-gray-400 font-bold">الدائرة {item.chamber || 'غير محدد'}</span>
                    <span className="bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full text-[8px] font-bold uppercase">جلسة مرافعة</span>
                  </div>
                  <h5 className="text-xs font-bold text-gray-900 mb-1">{item.title}</h5>
                  <p className="text-[10px] text-gray-500">{item.court}</p>
                </div>
              </div>
            ))}
            {sessions.length === 0 && (
              <div className="text-center py-10">
                <p className="text-xs text-gray-400 font-bold italic">لا يوجد مواعيد</p>
              </div>
            )}
          </div>

          <div className="pt-8 border-t border-gray-100">
            <button className="w-full bg-gray-50 hover:bg-gray-100 text-gray-600 py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all">
              <MessageSquare className="w-5 h-5 text-orange-500" />
              <span>تنبيهات الفريق (0)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
