import React, { useState } from 'react';
import { 
  Check, 
  Upload, 
  Trash2, 
  Eye, 
  ArrowRight, 
  Info,
  FileText,
  User,
  Scale,
  Paperclip,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { db, collection, addDoc, Timestamp, handleFirestoreError, OperationType } from '../firebase';
import { useFirebase } from '../components/FirebaseProvider';

const steps = [
  { id: 1, label: 'البيانات الأساسية', icon: Info },
  { id: 2, label: 'أطراف الدعوى', icon: User },
  { id: 3, label: 'التفاصيل القانونية', icon: Scale },
  { id: 4, label: 'المستندات', icon: Paperclip },
];

export function NewCase() {
  const navigate = useNavigate();
  const { user } = useFirebase();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    client: '',
    court: '',
    type: 'مدني - كلي',
    id: '',
    nextSession: '',
    urgent: false,
    description: '',
    plaintiffs: '',
    defendants: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async () => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      const caseData = {
        ...formData,
        uid: user.uid,
        status: 'نشطة',
        statusColor: 'bg-green-100 text-green-700',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };
      
      await addDoc(collection(db, 'cases'), caseData);
      navigate('/cases');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'cases');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-black text-gray-900">إضافة قضية جديدة</h2>
        <p className="text-gray-500">يرجى استكمال كافة المراحل لتوثيق ملف القضية في الأرشيف السيادي.</p>
      </div>

      <div className="relative flex justify-between items-center px-12">
        <div className="absolute top-1/2 left-12 right-12 h-0.5 bg-gray-100 -translate-y-1/2 z-0"></div>
        {steps.map((step) => (
          <div key={step.id} className="relative z-10 flex flex-col items-center gap-3">
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-500",
              currentStep > step.id 
                ? "bg-orange-500 border-orange-100 text-white" 
                : currentStep === step.id 
                  ? "bg-[#0F172A] border-slate-100 text-white shadow-xl shadow-slate-900/20" 
                  : "bg-white border-gray-50 text-gray-300"
            )}>
              {currentStep > step.id ? <Check className="w-6 h-6" /> : <span className="text-lg font-bold">{step.id}</span>}
            </div>
            <span className={cn(
              "text-xs font-bold transition-colors",
              currentStep >= step.id ? "text-gray-900" : "text-gray-300"
            )}>
              {step.label}
            </span>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {currentStep === 1 && (
          <div className="p-8 space-y-6">
            <h3 className="text-xl font-bold text-gray-900">البيانات الأساسية</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">عنوان القضية</label>
                <input 
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="مثلاً: نزاع عقاري - قصر النيل"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">رقم المرجع (اختياري)</label>
                <input 
                  name="id"
                  value={formData.id}
                  onChange={handleChange}
                  placeholder="مثلاً: 13574/2024"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">المحكمة</label>
                <input 
                  name="court"
                  value={formData.court}
                  onChange={handleChange}
                  placeholder="مثلاً: محكمة جنوب القاهرة"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">نوع القضية</label>
                <select 
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                >
                  <option>مدني - كلي</option>
                  <option>مدني - عقاري</option>
                  <option>تجاري</option>
                  <option>جنائي</option>
                  <option>أحوال شخصية</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="p-8 space-y-6">
            <h3 className="text-xl font-bold text-gray-900">أطراف الدعوى</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">اسم الموكل</label>
                <input 
                  name="client"
                  value={formData.client}
                  onChange={handleChange}
                  placeholder="الاسم الكامل للموكل"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">المدعون</label>
                  <textarea 
                    name="plaintiffs"
                    value={formData.plaintiffs}
                    onChange={handleChange}
                    placeholder="أسماء المدعين (واحد في كل سطر)"
                    rows={4}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">المدعى عليهم</label>
                  <textarea 
                    name="defendants"
                    value={formData.defendants}
                    onChange={handleChange}
                    placeholder="أسماء المدعى عليهم (واحد في كل سطر)"
                    rows={4}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="p-8 space-y-6">
            <h3 className="text-xl font-bold text-gray-900">التفاصيل القانونية</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">تاريخ الجلسة القادمة</label>
                  <input 
                    name="nextSession"
                    type="date"
                    value={formData.nextSession}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
                <div className="flex items-center gap-3 pt-8">
                  <input 
                    name="urgent"
                    type="checkbox"
                    checked={formData.urgent}
                    onChange={handleChange}
                    id="urgent"
                    className="w-5 h-5 accent-orange-500"
                  />
                  <label htmlFor="urgent" className="text-sm font-bold text-red-600">قضية عاجلة</label>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">وصف القضية / ملاحظات</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="اكتب هنا تفاصيل إضافية عن القضية..."
                  rows={6}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">المستندات المرفقة</h3>
              <span className="bg-gray-50 px-4 py-1.5 rounded-full text-[10px] font-bold text-gray-500 border border-gray-100">سيتم تفعيل رفع الملفات قريباً</span>
            </div>
            
            <div className="border-2 border-dashed border-gray-200 rounded-3xl p-12 flex flex-col items-center justify-center text-center space-y-4 opacity-50 grayscale">
              <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400">
                <Upload className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">رفع المستندات</h4>
                <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">هذه الميزة ستكون متاحة في التحديث القادم.</p>
              </div>
            </div>
          </div>
        )}

        <div className="p-8 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <button 
            onClick={prevStep}
            disabled={currentStep === 1}
            className={cn(
              "bg-white border border-gray-200 px-10 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 hover:bg-gray-50 transition-all",
              currentStep === 1 && "opacity-50 cursor-not-allowed"
            )}
          >
            <ArrowRight className="w-5 h-5" />
            <span>السابق</span>
          </button>
          
          <div className="flex gap-4">
            {currentStep < 4 ? (
              <button 
                onClick={nextStep}
                className="bg-[#0F172A] text-white px-10 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20"
              >
                <span>التالي</span>
                <ArrowRight className="w-5 h-5 rotate-180" />
              </button>
            ) : (
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-orange-500 text-white px-10 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                <span>إتمام وإضافة القضية</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
