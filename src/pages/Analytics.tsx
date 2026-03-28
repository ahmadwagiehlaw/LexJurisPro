import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Scale, 
  Clock, 
  DollarSign,
  Filter,
  Download,
  Calendar,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { db, collection, onSnapshot, query, where, handleFirestoreError, OperationType } from '../firebase';
import { useFirebase } from '../components/FirebaseProvider';

export function Analytics() {
  const { user } = useFirebase();
  const [stats, setStats] = useState({
    totalCases: 0,
    successRate: 0,
    avgDuration: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'cases'), where('uid', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const cases = snapshot.docs.map(doc => doc.data());
      const total = cases.length;
      const won = cases.filter(c => c.status === 'won').length;
      const rate = total > 0 ? (won / total) * 100 : 0;
      
      setStats({
        totalCases: total,
        successRate: rate,
        avgDuration: 142, // Mock for now
        revenue: total * 1500 // Mock calculation
      });
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'cases');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
      </div>
    );
  }

  const performanceData = [
    { month: 'يناير', cases: 45, won: 38, lost: 7 },
    { month: 'فبراير', cases: 52, won: 42, lost: 10 },
    { month: 'مارس', cases: 48, won: 40, lost: 8 },
    { month: 'أبريل', cases: 61, won: 55, lost: 6 },
    { month: 'مايو', cases: 55, won: 48, lost: 7 },
    { month: 'يونيو', cases: 67, won: 60, lost: 7 },
  ];

  const revenueData = [
    { name: 'أسبوع 1', value: 45000 },
    { name: 'أسبوع 2', value: 52000 },
    { name: 'أسبوع 3', value: 48000 },
    { name: 'أسبوع 4', value: 61000 },
    { name: 'أسبوع 5', value: 55000 },
    { name: 'أسبوع 6', value: 67000 },
  ];

  const COLORS = ['#F97316', '#0F172A', '#94A3B8', '#E2E8F0'];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-gray-900">إحصائيات الأداء</h2>
          <p className="text-gray-500 text-sm mt-1 font-bold">تحليل شامل لنتائج القضايا، الإيرادات، وكفاءة الفريق القانوني.</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
            <Calendar className="w-4 h-4 text-orange-500" />
            <select className="bg-transparent border-none text-xs font-bold text-gray-600 focus:ring-0">
              <option>آخر 6 أشهر</option>
              <option>آخر سنة</option>
              <option>الربع الحالي</option>
            </select>
          </div>
          <button className="bg-[#0F172A] text-white px-6 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">
            <Download className="w-4 h-4 text-orange-500" />
            <span>تصدير التقرير</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-8">
        {[
          { label: 'إجمالي القضايا', value: stats.totalCases.toString(), change: '+12%', trend: 'up', icon: Scale },
          { label: 'نسبة النجاح', value: `${stats.successRate.toFixed(1)}%`, change: '+2.1%', trend: 'up', icon: TrendingUp },
          { label: 'متوسط مدة التقاضي', value: `${stats.avgDuration} يوم`, change: '-8%', trend: 'up', icon: Clock },
          { label: 'الإيرادات الشهرية', value: `${stats.revenue.toLocaleString()} ر.س`, change: '+15%', trend: 'up', icon: DollarSign },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full translate-x-12 -translate-y-12 blur-xl"></div>
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 shadow-sm">
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full",
                stat.trend === 'up' ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
              )}>
                {stat.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span>{stat.change}</span>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">{stat.label}</p>
            <h4 className="text-2xl font-black text-gray-900">{stat.value}</h4>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-gray-900">معدل النجاح الشهري</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="text-[10px] font-bold text-gray-500">قضايا رابحة</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                <span className="text-[10px] font-bold text-gray-500">قضايا خاسرة</span>
              </div>
            </div>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="won" fill="#F97316" radius={[6, 6, 0, 0]} barSize={30} />
                <Bar dataKey="lost" fill="#E2E8F0" radius={[6, 6, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-xl font-black text-gray-900 mb-8">توزيع القضايا حسب النوع</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'تجاري', value: 40 },
                    { name: 'مدني', value: 30 },
                    { name: 'جنائي', value: 20 },
                    { name: 'أحوال شخصية', value: 10 },
                  ]}
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {COLORS.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4 mt-8">
            {[
              { label: 'تجاري', value: '40%', color: 'bg-orange-500' },
              { label: 'مدني', value: '30%', color: 'bg-slate-900' },
              { label: 'جنائي', value: '20%', color: 'bg-slate-400' },
              { label: 'أحوال شخصية', value: '10%', color: 'bg-slate-200' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn("w-2 h-2 rounded-full", item.color)}></div>
                  <span className="text-xs font-bold text-gray-600">{item.label}</span>
                </div>
                <span className="text-xs font-black text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-[#0F172A] p-8 rounded-3xl shadow-xl shadow-slate-900/20 lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-white">نمو الإيرادات</h3>
            <span className="text-[10px] font-bold text-orange-500 bg-orange-500/10 px-3 py-1 rounded-full uppercase tracking-widest">Live Updates</span>
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F97316" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#64748b' }} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '16px', border: 'none', color: '#fff' }}
                />
                <Area type="monotone" dataKey="value" stroke="#F97316" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-xl font-black text-gray-900 mb-8">أداء الفريق</h3>
          <div className="space-y-8">
            {[
              { name: 'أحمد علي', role: 'محامي أول', cases: 24, success: '92%', avatar: 'https://picsum.photos/seed/lawyer1/40/40' },
              { name: 'سارة الخالد', role: 'مستشار قانوني', cases: 18, success: '85%', avatar: 'https://picsum.photos/seed/lawyer2/40/40' },
              { name: 'محمد فهد', role: 'محامي استئناف', cases: 15, success: '80%', avatar: 'https://picsum.photos/seed/lawyer3/40/40' },
            ].map((lawyer, i) => (
              <div key={i} className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-sm group-hover:scale-110 transition-transform">
                    <img src={lawyer.avatar} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <h5 className="text-sm font-black text-gray-900">{lawyer.name}</h5>
                    <p className="text-[10px] text-gray-400 font-bold">{lawyer.role}</p>
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-sm font-black text-orange-500">{lawyer.success}</p>
                  <p className="text-[10px] text-gray-400 font-bold">{lawyer.cases} قضية</p>
                </div>
              </div>
            ))}
            <button className="w-full py-4 bg-gray-50 hover:bg-gray-100 rounded-2xl text-xs font-bold text-gray-600 transition-all">
              عرض تقرير الفريق الكامل
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
