import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Clock, 
  TrendingUp, 
  Briefcase,
  ChevronLeft,
  MoreHorizontal,
  Calendar as CalendarIcon,
  Loader2
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { cn } from '@/lib/utils';
import { db, collection, onSnapshot, query, where, orderBy, limit, handleFirestoreError, OperationType } from '../firebase';
import { Link } from 'react-router-dom';
import { useFirebase } from '../components/FirebaseProvider';

export function Dashboard() {
  const { user } = useFirebase();
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { label: 'إجمالي القضايا', value: '0', change: '+0%', icon: Briefcase, color: 'bg-blue-500' },
    { label: 'قضايا عاجلة', value: '0', change: 'عاجل', icon: TrendingUp, color: 'bg-red-500' },
    { label: 'قيد النظر', value: '0', change: 'نشط', icon: Clock, color: 'bg-orange-500' },
    { label: 'الموكلين', value: '0', change: 'إجمالي', icon: Users, color: 'bg-purple-500' },
  ]);

  useEffect(() => {
    if (!user) return;
    
    const q = query(
      collection(db, 'cases'), 
      where('uid', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const casesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCases(casesData);
      
      // Calculate stats
      const total = casesData.length;
      const urgent = casesData.filter((c: any) => c.urgent).length;
      const pending = casesData.filter((c: any) => c.status === 'قيد النظر').length;
      const clients = new Set(casesData.map((c: any) => c.client)).size;

      setStats([
        { label: 'إجمالي القضايا', value: total.toString(), change: `+${total}%`, icon: Briefcase, color: 'bg-blue-500' },
        { label: 'قضايا عاجلة', value: urgent.toString(), change: 'عاجل', icon: TrendingUp, color: 'bg-red-500' },
        { label: 'قيد النظر', value: pending.toString(), change: 'نشط', icon: Clock, color: 'bg-orange-500' },
        { label: 'الموكلين', value: clients.toString(), change: 'إجمالي', icon: Users, color: 'bg-purple-500' },
      ]);

      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'cases');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const chartData = [
    { name: 'يناير', value: 400 },
    { name: 'فبراير', value: 300 },
    { name: 'مارس', value: 600 },
    { name: 'أبريل', value: 800 },
    { name: 'مايو', value: 500 },
  ];

  const pieData = [
    { name: 'مدني', value: 45, color: '#3B82F6' },
    { name: 'جنائي', value: 35, color: '#F59E0B' },
    { name: 'طعن واستئناف', value: 20, color: '#10B981' },
  ];

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
          <h2 className="text-2xl font-bold text-gray-900">إحصائيات وتقارير الأداء</h2>
          <p className="text-gray-500 text-sm">نظرة عامة شاملة على أداء المكتب والقضايا النشطة للفترة الحالية.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-50 transition-colors">
            <CalendarIcon className="w-4 h-4" />
            <span>مايو 2024</span>
          </button>
          <button className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-50 transition-colors">
            <span>تصدير التقرير</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-3 rounded-xl text-white", stat.color)}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className={cn(
                "text-xs font-bold px-2 py-1 rounded-full",
                stat.change.startsWith('+') ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"
              )}>
                {stat.change}
              </span>
            </div>
            <p className="text-gray-500 text-sm mb-1">{stat.label}</p>
            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-gray-900">حجم القضايا الشهري</h3>
            <div className="flex gap-4 text-xs font-medium">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                <span>2024</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <span className="w-3 h-3 rounded-full bg-gray-200"></span>
                <span>2023</span>
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: '#F8FAFC' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-8">توزيع القضايا حسب النوع</h3>
          <div className="h-[200px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold">{cases.length}</span>
              <span className="text-[10px] text-gray-400 uppercase">Total Cases</span>
            </div>
          </div>
          <div className="mt-8 space-y-4">
            {pieData.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="text-sm font-medium text-gray-600">{item.name}</span>
                </div>
                <span className="text-sm font-bold text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
          <h3 className="font-bold text-gray-900">آخر التحديثات</h3>
          <Link to="/cases" className="text-orange-500 text-sm font-bold flex items-center gap-1 hover:underline">
            <span>عرض الكل</span>
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">رقم القضية</th>
                <th className="px-6 py-4">اسم الموكل</th>
                <th className="px-6 py-4">المحكمة</th>
                <th className="px-6 py-4">الجلسة القادمة</th>
                <th className="px-6 py-4">الحالة</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {cases.slice(0, 5).map((item, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">
                    <Link to={`/cases/${item.id}`} className="hover:text-orange-500">
                      {item.id.substring(0, 8)}...
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.client}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.court}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.nextSession || '--'}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold",
                      item.status === 'تم الحجز للحكم' ? "bg-green-100 text-green-700" :
                      item.status === 'مؤجل' ? "bg-orange-100 text-orange-700" :
                      "bg-blue-100 text-blue-700"
                    )}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link to={`/cases/${item.id}`} className="p-2 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="w-5 h-5" />
                    </Link>
                  </td>
                </tr>
              ))}
              {cases.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                    لا توجد قضايا حديثة لعرضها
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
