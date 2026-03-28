import { 
  LayoutDashboard, 
  Briefcase, 
  Calendar, 
  FileText, 
  Search, 
  Settings, 
  Archive, 
  BarChart3, 
  Users, 
  LogOut, 
  HelpCircle,
  PlusCircle
} from "lucide-react";

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard, path: '/' },
  { id: 'cases', label: 'القضايا', icon: Briefcase, path: '/cases' },
  { id: 'calendar', label: 'التقويم', icon: Calendar, path: '/calendar' },
  { id: 'documents', label: 'المستندات', icon: FileText, path: '/documents' },
  { id: 'research', label: 'البحث القانوني', icon: Search, path: '/research' },
  { id: 'analytics', label: 'الإحصائيات', icon: BarChart3, path: '/analytics' },
  { id: 'archive', label: 'الأرشيف', icon: Archive, path: '/archive' },
];

export const SECONDARY_NAV_ITEMS = [
  { id: 'settings', label: 'الإعدادات', icon: Settings, path: '/settings' },
  { id: 'support', label: 'الدعم الفني', icon: HelpCircle, path: '/support' },
];
