import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Archive as ArchiveIcon, 
  History, 
  FileText, 
  Download, 
  Trash2, 
  Eye,
  MoreVertical,
  Calendar,
  Scale,
  Users,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { db, collection, onSnapshot, query, where, orderBy, handleFirestoreError, OperationType } from '../firebase';
import { useFirebase } from '../components/FirebaseProvider';

export function Archive() {
  const { user } = useFirebase();
  const [archivedCases, setArchivedCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'cases'), 
      where('uid', '==', user.uid),
      where('status', '==', 'closed'),
      orderBy('updatedAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const cases = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setArchivedCases(cases);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'cases');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredCases = archivedCases.filter(item => 
    item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.id?.toLowerCase().includes(searchQuery.toLowerCase())
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-gray-900">الأرشيف القانوني</h2>
          <p className="text-gray-500 text-sm mt-1 font-bold">استرجاع وإدارة القضايا المغلقة والوثائق التاريخية.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="بحث في الأرشيف..." 
              className="bg-white border border-gray-100 rounded-2xl py-3 pr-12 pl-6 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 w-80 shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="bg-white border border-gray-200 p-3 rounded-2xl text-gray-600 hover:bg-gray-50 transition-all shadow-sm">
            <Filter className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-8">
        {[
          { label: 'إجمالي الأرشيف', value: archivedCases.length.toString(), icon: ArchiveIcon, color: 'bg-orange-50 text-orange-500' },
          { label: 'قضايا تجارية', value: archivedCases.filter(c => c.type === 'تجاري').length.toString(), icon: Scale, color: 'bg-blue-50 text-blue-500' },
          { label: 'أحوال شخصية', value: archivedCases.filter(c => c.type === 'أحوال شخصية').length.toString(), icon: Users, color: 'bg-purple-50 text-purple-500' },
          { label: 'وثائق تاريخية', value: '5,240', icon: FileText, color: 'bg-green-50 text-green-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm group hover:shadow-md transition-all">
            <div className="flex items-center gap-4">
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform", stat.color)}>
                <stat.icon className="w-7 h-7" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">{stat.label}</p>
                <h4 className="text-2xl font-black text-gray-900">{stat.value}</h4>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
          <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
            <History className="w-6 h-6 text-orange-500" />
            <span>سجل القضايا المؤرشفة</span>
          </h3>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-xl text-xs font-bold bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all">تصدير الأرشيف</button>
            <button className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0F172A] text-white hover:bg-slate-800 transition-all">تنظيف الأرشيف القديم</button>
          </div>
        </div>
        <table className="w-full text-right">
          <thead>
            <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-bold uppercase tracking-wider">
              <th className="px-8 py-4">رقم القضية</th>
              <th className="px-8 py-4">عنوان القضية</th>
              <th className="px-8 py-4">الموكل</th>
              <th className="px-8 py-4">النوع</th>
              <th className="px-8 py-4">تاريخ الإغلاق</th>
              <th className="px-8 py-4">النتيجة النهائية</th>
              <th className="px-8 py-4">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredCases.map((item, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors group">
                <td className="px-8 py-6">
                  <span className="text-xs font-black text-gray-900 bg-gray-100 px-3 py-1 rounded-full">{item.id}</span>
                </td>
                <td className="px-8 py-6">
                  <p className="text-sm font-bold text-gray-900">{item.title}</p>
                </td>
                <td className="px-8 py-6 text-xs text-gray-600 font-bold">{item.clientName || item.client}</td>
                <td className="px-8 py-6">
                  <span className="text-[10px] font-bold text-gray-500 bg-gray-50 px-3 py-1 rounded-full">{item.type}</span>
                </td>
                <td className="px-8 py-6 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-gray-300" />
                    <span>{item.updatedAt?.split('T')[0] || item.date}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold",
                    item.result?.includes('لصالح') ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-600"
                  )}>
                    {item.result || 'حكم نهائي'}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-300 hover:text-gray-600">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredCases.length === 0 && (
              <tr>
                <td colSpan={7} className="px-8 py-12 text-center text-gray-400 italic">
                  لا توجد قضايا مؤرشفة حالياً...
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="p-8 bg-gray-50/30 border-t border-gray-50 flex items-center justify-between">
          <p className="text-xs text-gray-400 font-bold">عرض {filteredCases.length} من أصل {archivedCases.length} قضية مؤرشفة</p>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-white transition-all">1</button>
            <button className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-white transition-all">2</button>
            <button className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-white transition-all">3</button>
            <span className="px-2 flex items-center text-gray-300">...</span>
            <button className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-white transition-all">145</button>
          </div>
        </div>
      </div>
    </div>
  );
}
