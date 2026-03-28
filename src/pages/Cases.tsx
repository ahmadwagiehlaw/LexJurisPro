import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Calendar, 
  MapPin, 
  User,
  ArrowRight,
  Loader2,
  Scale
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { db, collection, query, where, onSnapshot, handleFirestoreError, OperationType } from '../firebase';
import { useFirebase } from '../components/FirebaseProvider';

export function Cases() {
  const { user } = useFirebase();
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const statusOptions = [
    { id: 'نشطة', label: 'نشطة' },
    { id: 'قيد الانتظار', label: 'قيد الانتظار' },
    { id: 'مغلقة', label: 'مغلقة' },
    { id: 'عاجلة', label: 'عاجلة' },
  ];

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'cases'),
      where('uid', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const casesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCases(casesData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'cases');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const filteredCases = cases.filter(c => {
    const matchesSearch = (c.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || 
                         (c.client?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedStatuses.length === 0 || selectedStatuses.includes(c.status);
    
    // Special case for "Urgent" if it's a boolean field
    const matchesUrgent = !selectedStatuses.includes('عاجلة') || c.urgent === true;

    return matchesSearch && matchesFilter && matchesUrgent;
  });

  const toggleStatus = (statusId: string) => {
    setSelectedStatuses(prev => 
      prev.includes(statusId) 
        ? prev.filter(s => s !== statusId) 
        : [...prev, statusId]
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">إدارة القضايا</h2>
          <p className="text-gray-500 text-sm">عرض وإدارة جميع القضايا القانونية والملفات النشطة.</p>
        </div>
        <Link to="/cases/new" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-bold transition-all shadow-lg shadow-orange-500/20">
          <Plus className="w-5 h-5" />
          <span>إضافة قضية جديدة</span>
        </Link>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="البحث برقم القضية، اسم الموكل، أو نوع القضية..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 pr-10 pl-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
          />
        </div>
        <div className="relative">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 flex items-center gap-2 min-w-[140px] justify-between"
          >
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <span>
                {selectedStatuses.length === 0 
                  ? 'كل الحالات' 
                  : `${selectedStatuses.length} مختارة`}
              </span>
            </div>
            <ArrowRight className={cn("w-4 h-4 transition-transform", isFilterOpen ? "rotate-90" : "rotate-0")} />
          </button>

          {isFilterOpen && (
            <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-xl z-50 p-2 space-y-1">
              {statusOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => toggleStatus(option.id)}
                  className={cn(
                    "w-full text-right px-3 py-2 rounded-lg text-sm flex items-center justify-between transition-colors",
                    selectedStatuses.includes(option.id) 
                      ? "bg-orange-50 text-orange-600 font-bold" 
                      : "hover:bg-gray-50 text-gray-600"
                  )}
                >
                  <span>{option.label}</span>
                  {selectedStatuses.includes(option.id) && <Plus className="w-4 h-4 rotate-45" />}
                </button>
              ))}
              {selectedStatuses.length > 0 && (
                <button
                  onClick={() => setSelectedStatuses([])}
                  className="w-full text-center py-2 text-xs text-gray-400 hover:text-orange-500 transition-colors border-t border-gray-50 mt-2 pt-2"
                >
                  مسح الفلاتر
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {filteredCases.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center space-y-4">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
            <Scale className="w-10 h-10" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">لا توجد قضايا حالياً</h3>
            <p className="text-gray-500">ابدأ بإضافة أول قضية لك في النظام.</p>
          </div>
          <Link 
            to="/cases/new"
            className="inline-flex bg-[#0F172A] text-white px-8 py-3 rounded-2xl font-bold gap-2 hover:bg-slate-800 transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>إضافة قضية</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCases.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex gap-2">
                    <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold", item.statusColor)}>
                      {item.status}
                    </span>
                    {item.urgent && (
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-[10px] font-bold animate-pulse">
                        عاجل !
                      </span>
                    )}
                  </div>
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-6">
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                    <span>مرجع: {item.id}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span>{item.type}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-500 transition-colors">
                    {item.title}
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase">الموكل</p>
                      <p className="text-xs font-bold text-gray-700">{item.client}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase">المحكمة</p>
                      <p className="text-xs font-bold text-gray-700">{item.court}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-orange-500 shadow-sm">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">الجلسة القادمة</p>
                      <p className="text-[10px] text-orange-600 font-medium">{item.nextSession || 'غير محدد'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-gray-900">{item.nextSession?.split('-')[2] || '--'}</p>
                    <p className="text-[10px] text-gray-500 uppercase">التاريخ</p>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <div className="flex gap-3">
                  <button className="text-xs font-bold text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1">
                    عرض الحكم
                  </button>
                  <button className="text-xs font-bold text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1">
                    تصدير السجل
                  </button>
                </div>
                <Link to={`/cases/${item.id}`} className="text-orange-500 text-xs font-bold flex items-center gap-1 hover:underline">
                  <span>عرض التفاصيل</span>
                  <ArrowRight className="w-4 h-4 rotate-180" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
