import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Book, 
  Scale, 
  Users, 
  Building2, 
  Gavel, 
  Bookmark, 
  Eye, 
  Download,
  ChevronLeft,
  BookOpen,
  Library as LibraryIcon,
  History as HistoryIcon,
  Sparkles,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { db, collection, onSnapshot, query, where, orderBy, handleFirestoreError, OperationType } from '../firebase';
import { useFirebase } from '../components/FirebaseProvider';

export function Research() {
  const { user } = useFirebase();
  const [researchItems, setResearchItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'research'), 
      where('uid', '==', user.uid),
      orderBy('date', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setResearchItems(items);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'research');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredItems = researchItems.filter(item => 
    item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.summary?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="relative bg-[#0F172A] rounded-[40px] p-12 overflow-hidden shadow-2xl shadow-slate-900/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full translate-x-32 -translate-y-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full -translate-x-32 translate-y-32 blur-3xl"></div>
        
        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-5xl font-black text-white leading-tight">المكتبة القانونية والبحوث</h2>
            <p className="text-gray-400 text-lg">ابحث في آلاف القوانين، أحكام النقض، واللوائح التنظيمية بدقة متناهية من الأرشيف السيادي.</p>
          </div>

          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
              <input 
                type="text" 
                placeholder="ابحث بالكلمة المفتاحية، رقم المادة، أو رقم الحكم..." 
                className="w-full bg-white/10 border border-white/20 rounded-2xl py-5 pr-14 pl-6 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 backdrop-blur-xl transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-10 rounded-2xl font-black flex items-center gap-2 transition-all shadow-lg shadow-orange-500/20">
              <Filter className="w-5 h-5" />
              <span>بحث متقدم</span>
            </button>
          </div>

          <div className="flex items-center justify-center gap-4 text-xs font-bold text-gray-500">
            <span>عمليات بحث شائعة:</span>
            <button className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10 text-gray-300 transition-colors">أحكام النقض الحديثة</button>
            <button className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10 text-gray-300 transition-colors">قانون العمل الجديد</button>
            <button className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10 text-gray-300 transition-colors">تعديلات قانون العقوبات</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                <LibraryIcon className="w-7 h-7 text-orange-500" />
                <span>التصنيفات القانونية</span>
              </h3>
              <button className="text-orange-500 text-sm font-bold hover:underline">عرض الكل ←</button>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[
                { id: 'civil', label: 'القانون المدني', icon: Building2, count: '1,240 مادة', color: 'bg-orange-50 text-orange-500' },
                { id: 'criminal', label: 'القانون الجنائي', icon: Gavel, count: '850 مادة', color: 'bg-blue-50 text-blue-500' },
                { id: 'personal', label: 'الأحوال الشخصية', icon: Users, count: '310 مادة', color: 'bg-purple-50 text-purple-500' },
                { id: 'admin', label: 'القانون الإداري', icon: Building2, count: '520 مادة', color: 'bg-green-50 text-green-500' },
              ].map((cat) => (
                <div key={cat.id} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group cursor-pointer">
                  <div className="flex items-start justify-between mb-8">
                    <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform", cat.color)}>
                      <cat.icon className="w-8 h-8" />
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full">{cat.count}</span>
                  </div>
                  <h4 className="text-xl font-black text-gray-900 mb-2">{cat.label}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">العقود، الالتزامات، الحقوق العينية، والتعويضات المدنية المتصلة بالمعاملات المالية.</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                <Scale className="w-7 h-7 text-orange-500" />
                <span>أحدث الأحكام والقرارات</span>
              </h3>
              <button className="text-orange-500 text-sm font-bold hover:underline">عرض الكل ←</button>
            </div>
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-right">
                <thead>
                  <tr className="bg-gray-50 text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                    <th className="px-8 py-4">رقم الطعن / الحكم</th>
                    <th className="px-8 py-4">الموضوع</th>
                    <th className="px-8 py-4">التاريخ</th>
                    <th className="px-8 py-4">الإجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredItems.map((item, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-8 py-6">
                        <p className="text-sm font-black text-gray-900">{item.id}</p>
                        <p className="text-[10px] text-gray-400">{item.court}</p>
                      </td>
                      <td className="px-8 py-6 text-sm font-bold text-gray-700">{item.title}</td>
                      <td className="px-8 py-6 text-xs text-gray-500">{item.date}</td>
                      <td className="px-8 py-6">
                        <button className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg transition-colors">
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredItems.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-8 py-12 text-center text-gray-400 italic">
                        لا توجد نتائج بحث حالياً...
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                <BookOpen className="w-7 h-7 text-orange-500" />
                <span>المكتبة الرقمية</span>
              </h3>
              <button className="bg-[#0F172A] text-white px-6 py-2 rounded-xl text-xs font-bold hover:bg-slate-800 transition-all">تصفح جميع الكتب والمراجع السيادية</button>
            </div>
            <div className="grid grid-cols-3 gap-8">
              {[
                { title: 'موسوعة التعليق على قانون العقوبات', author: 'المستشار حامد الشريف', cover: 'https://picsum.photos/seed/book1/200/300' },
                { title: 'الوسيط في شرح القانون المدني', author: 'د. عبد الرزاق السنهوري', cover: 'https://picsum.photos/seed/book2/200/300' },
                { title: 'شرح قانون الإجراءات الجنائية', author: 'د. محمود نجيب حسني', cover: 'https://picsum.photos/seed/book3/200/300' },
              ].map((book, i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all mb-4 relative">
                    <img src={book.cover} alt={book.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                      <button className="w-full bg-white text-gray-900 py-3 rounded-xl font-bold text-xs">قراءة الكتاب</button>
                    </div>
                  </div>
                  <h5 className="font-black text-gray-900 text-sm mb-1 group-hover:text-orange-500 transition-colors">{book.title}</h5>
                  <p className="text-xs text-gray-500">{book.author}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h4 className="font-black text-gray-900 flex items-center gap-2 mb-8">
              <Bookmark className="w-5 h-5 text-orange-500" />
              <span>الإشارات المرجعية</span>
            </h4>
            <div className="space-y-6">
              <div className="text-center py-8 text-gray-400 italic text-xs">
                لا توجد إشارات مرجعية حالياً...
              </div>
              <button className="w-full py-4 border-2 border-dashed border-gray-100 rounded-2xl text-xs font-bold text-gray-400 hover:border-orange-200 hover:text-orange-500 transition-all">
                تنظيم مجلدات الأرشيف
              </button>
            </div>
          </div>

          <div className="bg-[#0F172A] p-8 rounded-3xl shadow-xl shadow-slate-900/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-orange-500/10 rounded-full -translate-x-16 -translate-y-16 blur-2xl"></div>
            <div className="relative z-10 text-center space-y-6">
              <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto border border-white/10 shadow-inner">
                <Scale className="w-10 h-10 text-orange-500" />
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-black text-white">المساعد القانوني الذكي</h4>
                <p className="text-xs text-gray-400 leading-relaxed">هل تحتاج لمساعدة في صياغة مذكرة أو البحث عن سابقة قضائية معينة؟</p>
              </div>
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl font-black text-sm transition-all shadow-lg shadow-orange-500/20">
                ابدأ المحادثة الآن
              </button>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h4 className="font-black text-gray-900 flex items-center gap-2 mb-6">
              <HistoryIcon className="w-5 h-5 text-orange-500" />
              <span>آخر الأبحاث</span>
            </h4>
            <div className="space-y-4">
              {filteredItems.slice(0, 4).map((item, i) => (
                <button key={i} className="w-full text-right p-3 hover:bg-gray-50 rounded-xl text-xs font-bold text-gray-600 flex items-center justify-between group transition-all">
                  <span>{item.title}</span>
                  <ChevronLeft className="w-4 h-4 text-gray-300 group-hover:text-orange-500 transition-colors" />
                </button>
              ))}
              {filteredItems.length === 0 && (
                <div className="text-center py-4 text-gray-400 italic text-xs">
                  لا توجد أبحاث سابقة...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
