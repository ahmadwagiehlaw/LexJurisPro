import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Edit3, 
  Printer, 
  Users, 
  History, 
  FileText, 
  DollarSign, 
  Settings,
  Plus,
  Download,
  Eye,
  MoreVertical,
  Calendar,
  Clock,
  AlertCircle,
  Sparkles,
  Loader2,
  X,
  User,
  Scale
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useParams, Link } from 'react-router-dom';
import { GoogleGenAI } from "@google/genai";
import { db, doc, onSnapshot, handleFirestoreError, OperationType } from '../firebase';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const tabs = [
  { id: 'overview', label: 'نظرة عامة', icon: History },
  { id: 'parties', label: 'أطراف الخصومة', icon: Users },
  { id: 'timeline', label: 'سجل الجلسات', icon: Calendar },
  { id: 'documents', label: 'معرض المستندات', icon: FileText },
  { id: 'finance', label: 'الملخص المالي', icon: DollarSign },
  { id: 'settings', label: 'الإعدادات', icon: Settings },
];

export function CaseDetails() {
  const { id } = useParams();
  const [caseData, setCaseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const unsubscribe = onSnapshot(doc(db, 'cases', id), (docSnap) => {
      if (docSnap.exists()) {
        setCaseData({ id: docSnap.id, ...docSnap.data() });
      } else {
        setCaseData(null);
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `cases/${id}`);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [id]);

  const handleSummarize = async () => {
    if (!caseData) return;
    setIsSummarizing(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `قم بتلخيص هذه القضية القانونية بشكل احترافي للمحامي:
        العنوان: ${caseData.title}
        الموكل: ${caseData.client}
        الخصم: ${caseData.defendants || 'غير محدد'}
        المحكمة: ${caseData.court}
        الدائرة: ${caseData.chamber || 'غير محدد'}
        الحالة: ${caseData.status}
        الوصف: ${caseData.description || 'لا يوجد وصف'}
        
        ركز على النقاط الجوهرية والخطوات القادمة المطلوبة.`,
      });
      setSummary(response.text || 'لم يتمكن الذكاء الاصطناعي من توليد ملخص حالياً.');
    } catch (error) {
      console.error('AI Summary Error:', error);
      setSummary('حدث خطأ أثناء توليد الملخص.');
    } finally {
      setIsSummarizing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="text-center py-20 space-y-4">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
        <h2 className="text-2xl font-bold text-gray-900">القضية غير موجودة</h2>
        <Link to="/cases" className="text-orange-500 font-bold hover:underline">العودة لقائمة القضايا</Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/cases" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowRight className="w-6 h-6" />
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-1">
              {caseData.urgent && <span className="bg-red-500 text-white px-3 py-0.5 rounded-full text-[10px] font-bold">عاجل !</span>}
              <span className="text-xs text-gray-400">مرجع: {caseData.id}</span>
            </div>
            <h2 className="text-3xl font-black text-gray-900">{caseData.title}</h2>
            <p className="text-gray-500 text-sm">{caseData.description?.substring(0, 100)}...</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleSummarize}
            disabled={isSummarizing}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50"
          >
            {isSummarizing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>ملخص الذكاء الاصطناعي</span>
          </button>
          <button className="bg-white border border-gray-200 px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-gray-50 transition-all">
            <Printer className="w-4 h-4" />
            <span>طباعة التقرير</span>
          </button>
          <button className="bg-[#0F172A] text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">
            <Edit3 className="w-4 h-4" />
            <span>تعديل البيانات</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
          {summary && (
            <div className="bg-[#0F172A] p-8 rounded-3xl shadow-xl shadow-slate-900/20 relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full translate-x-16 -translate-y-16 blur-2xl"></div>
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xl font-black text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-orange-500" />
                    <span>ملخص القضية الذكي</span>
                  </h4>
                  <button onClick={() => setSummary(null)} className="text-gray-400 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {summary}
                </div>
              </div>
            </div>
          )}
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-[10px] text-gray-400 uppercase mb-1">نوع القضية</p>
              <h4 className="text-lg font-bold text-gray-900">{caseData.type}</h4>
              <p className="text-[10px] text-gray-500">{caseData.chamber || 'الدائرة غير محددة'}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-[10px] text-gray-400 uppercase mb-1">المحكمة</p>
              <h4 className="text-lg font-bold text-gray-900">{caseData.court}</h4>
              <p className="text-[10px] text-gray-500">الابتدائية - مدني</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-[10px] text-gray-400 uppercase mb-1">تاريخ الجلسة القادمة</p>
              <h4 className="text-lg font-bold text-gray-900">{caseData.nextSession || '--'}</h4>
              <p className="text-[10px] text-gray-500">موعد الجلسة المرتقبة</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex border-b border-gray-100">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold transition-all relative",
                    activeTab === tab.id ? "text-orange-500" : "text-gray-400 hover:text-gray-600"
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500 rounded-t-full"></div>
                  )}
                </button>
              ))}
            </div>
            <div className="p-8">
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-2 gap-12">
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h5 className="font-bold text-gray-900 flex items-center gap-2">
                          <Users className="w-5 h-5 text-orange-500" />
                          <span>أطراف الخصومة</span>
                        </h5>
                        <button className="text-xs text-orange-500 font-bold hover:underline">إدارة الخصوم</button>
                      </div>
                      <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-xl flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-400 shadow-sm">
                              <User className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-gray-900">{caseData.client}</p>
                              <p className="text-[10px] text-gray-500">المدعي الأصلي</p>
                            </div>
                          </div>
                          <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-400 shadow-sm">
                              <User className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-gray-900">{caseData.defendants || 'غير محدد'}</p>
                              <p className="text-[10px] text-gray-500">المدعى عليه</p>
                            </div>
                          </div>
                          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h5 className="font-bold text-gray-900 flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-orange-500" />
                          <span>سجل الجلسات والقرارات</span>
                        </h5>
                      </div>
                      <div className="relative pr-6 space-y-8 before:absolute before:right-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                        <div className="relative">
                          <div className="absolute -right-[22px] top-1 w-4 h-4 rounded-full bg-orange-500 border-4 border-white shadow-sm z-10"></div>
                          <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="bg-white px-3 py-1 rounded-full text-[10px] font-bold text-gray-900 shadow-sm">{caseData.nextSession || 'قريباً'}</span>
                                <h6 className="text-sm font-bold text-gray-900">الجلسة القادمة</h6>
                              </div>
                            </div>
                            <p className="text-[10px] text-gray-500">سيتم تحديث تفاصيل القاعة لاحقاً</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h5 className="font-bold text-gray-900 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-orange-500" />
                        <span>موضوع الدعوى</span>
                      </h5>
                    </div>
                    <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {caseData.description || 'لا يوجد وصف متاح لهذه القضية.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-[#0F172A] text-white p-6 rounded-2xl shadow-xl shadow-slate-900/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-orange-500/10 rounded-full -translate-x-16 -translate-y-16 blur-2xl"></div>
            <div className="relative z-10">
              <h5 className="text-orange-500 font-bold flex items-center gap-2 mb-6">
                <AlertCircle className="w-5 h-5" />
                <span>إجراءات سريعة</span>
              </h5>
              <div className="space-y-3">
                <button className="w-full bg-white/5 hover:bg-white/10 text-white py-3 px-4 rounded-xl text-sm font-bold flex items-center gap-3 transition-colors text-right">
                  <Plus className="w-5 h-5 text-orange-500" />
                  <span>إضافة ملاحظة فنية</span>
                </button>
                <button className="w-full bg-white/5 hover:bg-white/10 text-white py-3 px-4 rounded-xl text-sm font-bold flex items-center gap-3 transition-colors text-right">
                  <Calendar className="w-5 h-5 text-orange-500" />
                  <span>تسجيل قرار جلسة</span>
                </button>
                <button className="w-full bg-white/5 hover:bg-white/10 text-white py-3 px-4 rounded-xl text-sm font-bold flex items-center gap-3 transition-colors text-right">
                  <FileText className="w-5 h-5 text-orange-500" />
                  <span>رفع مستند جديد</span>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h5 className="font-bold text-gray-900 flex items-center gap-2 mb-6">
              <Edit3 className="w-5 h-5 text-orange-500" />
              <span>ملاحظات المحامي</span>
            </h5>
            <div className="space-y-4">
              <button className="w-full py-2 border-2 border-dashed border-gray-200 rounded-xl text-xs font-bold text-gray-400 hover:border-orange-200 hover:text-orange-500 transition-all">
                + إضافة ملاحظة جديدة
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h5 className="font-bold text-gray-900 flex items-center gap-2 mb-6">
              <Scale className="w-5 h-5 text-orange-500" />
              <span>إحصائيات الملف</span>
            </h5>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold text-gray-600">اكتمال المستندات</p>
                  <span className="text-xs font-bold text-gray-900">25%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BarChart3(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3v18h18" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </svg>
  )
}
