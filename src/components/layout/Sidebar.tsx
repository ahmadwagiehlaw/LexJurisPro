import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { NAV_ITEMS, SECONDARY_NAV_ITEMS } from '@/constants';
import { LogOut, PlusCircle } from 'lucide-react';

export function Sidebar() {
  return (
    <aside className="w-64 bg-[#0F172A] text-white flex flex-col h-screen sticky top-0 border-l border-white/10" dir="rtl">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
          <span className="text-2xl font-bold">L</span>
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Lex Juris Pro</h1>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest">Sovereign Archive</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
              isActive 
                ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" 
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium text-sm">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-6 space-y-4">
        <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-colors shadow-lg shadow-orange-500/20">
          <PlusCircle className="w-5 h-5" />
          <span>قضية جديدة</span>
        </button>

        <div className="pt-4 border-t border-white/10 space-y-1">
          {SECONDARY_NAV_ITEMS.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-gray-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium text-sm">{item.label}</span>
            </NavLink>
          ))}
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-gray-400 hover:bg-white/5 hover:text-white">
            <LogOut className="w-5 h-5" />
            <span className="font-medium text-sm">تسجيل الخروج</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
