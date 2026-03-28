import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Upload, 
  Folder, 
  FileText, 
  MoreVertical, 
  Download, 
  Trash2, 
  Share2, 
  Clock,
  HardDrive,
  Star,
  Shield,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { db, collection, onSnapshot, query, where, orderBy, handleFirestoreError, OperationType } from '../firebase';
import { useFirebase } from '../components/FirebaseProvider';

export function Documents() {
  const { user } = useFirebase();
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'documents'), 
      where('uid', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDocuments(docs);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'documents');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredDocs = documents.filter(doc => 
    doc.name?.toLowerCase().includes(searchQuery.toLowerCase())
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
          <h2 className="text-3xl font-black text-gray-900">إدارة المستندات</h2>
          <p className="text-gray-500 text-sm mt-1 font-bold">تصفح وإدارة جميع الوثائق القانونية والأرشيف الرقمي.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-gray-200 px-6 py-3 rounded-2xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm">
            <Folder className="w-5 h-5 text-orange-500" />
            <span>مجلد جديد</span>
          </button>
          <button className="bg-[#0F172A] text-white px-8 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">
            <Upload className="w-5 h-5 text-orange-500" />
            <span>رفع ملفات</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
            <button className="w-full text-right p-3 bg-orange-50 text-orange-600 rounded-xl text-sm font-bold flex items-center gap-3">
              <HardDrive className="w-5 h-5" />
              <span>مساحة التخزين</span>
            </button>
            <button className="w-full text-right p-3 hover:bg-gray-50 text-gray-600 rounded-xl text-sm font-bold flex items-center gap-3 transition-all">
              <Star className="w-5 h-5" />
              <span>المفضلة</span>
            </button>
            <button className="w-full text-right p-3 hover:bg-gray-50 text-gray-600 rounded-xl text-sm font-bold flex items-center gap-3 transition-all">
              <Clock className="w-5 h-5" />
              <span>الأخيرة</span>
            </button>
            <button className="w-full text-right p-3 hover:bg-gray-50 text-gray-600 rounded-xl text-sm font-bold flex items-center gap-3 transition-all">
              <Trash2 className="w-5 h-5" />
              <span>سلة المحذوفات</span>
            </button>
            <div className="pt-6 mt-4 border-t border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase">سعة التخزين</span>
                <span className="text-[10px] font-bold text-gray-900">75% مستخدم</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 w-[75%]"></div>
              </div>
              <p className="text-[10px] text-gray-400 mt-2">15.2 GB من 20 GB</p>
            </div>
          </div>

          <div className="bg-[#0F172A] p-8 rounded-3xl shadow-xl shadow-slate-900/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full translate-x-12 -translate-y-12 blur-xl"></div>
            <div className="relative z-10 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-orange-500 border border-white/10">
                <Shield className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-black text-white">التشفير السيادي</h4>
              <p className="text-xs text-gray-400 leading-relaxed">جميع ملفاتك مشفرة بتقنية AES-256 لضمان أقصى درجات الخصوصية القانونية.</p>
              <button className="text-xs font-bold text-orange-500 hover:underline">إعدادات الأمان ←</button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-8">
          <div className="grid grid-cols-4 gap-6">
            {[
              { name: 'القضايا التجارية', count: '124 ملف', color: 'bg-orange-50 text-orange-500' },
              { name: 'الاستشارات القانونية', count: '45 ملف', color: 'bg-blue-50 text-blue-500' },
              { name: 'العقود والاتفاقيات', count: '89 ملف', color: 'bg-purple-50 text-purple-500' },
              { name: 'أرشيف 2023', count: '512 ملف', color: 'bg-green-50 text-green-500' },
            ].map((folder, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group cursor-pointer">
                <div className="flex items-start justify-between mb-6">
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform", folder.color)}>
                    <Folder className="w-6 h-6" />
                  </div>
                  <button className="p-1 text-gray-300 hover:text-gray-600">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
                <h4 className="text-sm font-black text-gray-900 mb-1">{folder.name}</h4>
                <p className="text-[10px] text-gray-400 font-bold">{folder.count}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
              <h3 className="text-lg font-black text-gray-900">الملفات الأخيرة</h3>
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="بحث في الملفات..." 
                  className="bg-gray-50 border-none rounded-xl py-2 pr-10 pl-4 text-xs focus:ring-2 focus:ring-orange-500/20 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <table className="w-full text-right">
              <thead>
                <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                  <th className="px-8 py-4">اسم الملف</th>
                  <th className="px-8 py-4">الحجم</th>
                  <th className="px-8 py-4">تاريخ الرفع</th>
                  <th className="px-8 py-4">المالك</th>
                  <th className="px-8 py-4">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredDocs.map((file, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm",
                          file.type === 'PDF' ? "bg-red-500" : file.type === 'DOCX' ? "bg-blue-500" : "bg-orange-500"
                        )}>
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{file.name}</p>
                          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">{file.type || 'PDF'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-xs text-gray-500 font-bold">{file.size || '1.2 MB'}</td>
                    <td className="px-8 py-6 text-xs text-gray-500">{file.createdAt?.split('T')[0] || '2023-10-15'}</td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-100 overflow-hidden">
                          <img src={`https://picsum.photos/seed/${file.owner || 'user'}/24/24`} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <span className="text-xs text-gray-600 font-bold">{file.owner || 'أحمد وجيه'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all">
                          <Share2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredDocs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-8 py-12 text-center text-gray-400 italic">
                      لا توجد ملفات حالياً...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="p-6 bg-gray-50/50 border-t border-gray-50 text-center">
              <button className="text-xs font-bold text-gray-500 hover:text-orange-500 transition-colors flex items-center gap-2 mx-auto">
                <span>عرض جميع الملفات</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
