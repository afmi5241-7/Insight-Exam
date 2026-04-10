import { Link } from "wouter";
import { useAuth } from "@/lib/auth";
import { useLogout, getGetMeQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { PlusCircle, LogOut, Menu, X, BarChart2, Sun, Moon } from "lucide-react";
import { useState } from "react";
import logo from "@assets/insight_exam_logo_1775829320780.png";
import { useDarkMode } from "@/lib/dark-mode";

export default function Navbar() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const logout = useLogout();
  const [, navigate] = ([] as any[]).length > 0 ? [] : [null, (p: string) => { window.location.href = p; }];
  const { dark, toggle } = useDarkMode();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout.mutateAsync({});
    queryClient.setQueryData(getGetMeQueryKey(), null);
    queryClient.clear();
    window.location.href = "/";
  };

  if (!user) return null;

  return (
    <nav className="bg-white dark:bg-[#1e293b] border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/dashboard" className="flex items-center gap-2 text-blue-600 font-bold text-lg">
            <img src={logo} alt="Insight Exam" className="h-9 w-9 rounded-lg object-cover" />
            <span>Insight Exam</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/dashboard" className="flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm font-medium">
              <BarChart2 className="h-4 w-4" />
              لوحة التحكم
            </Link>
            <Link href="/courses/new" className="flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm font-medium">
              <PlusCircle className="h-4 w-4" />
              إضافة مقرر
            </Link>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <span className="text-slate-600 dark:text-slate-300 text-sm">مرحباً، {user.name}</span>
            <button
              onClick={toggle}
              className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              title={dark ? "الوضع المضيء" : "الوضع الليلي"}
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-red-600 transition-colors text-sm"
            >
              <LogOut className="h-4 w-4" />
              خروج
            </button>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggle}
              className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              className="text-slate-600 dark:text-slate-300"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden py-3 border-t border-slate-100 dark:border-slate-700 flex flex-col gap-3">
            <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="text-slate-600 dark:text-slate-300 hover:text-blue-600 text-sm font-medium py-1">
              لوحة التحكم
            </Link>
            <Link href="/courses/new" onClick={() => setMobileOpen(false)} className="text-slate-600 dark:text-slate-300 hover:text-blue-600 text-sm font-medium py-1">
              إضافة مقرر
            </Link>
            <button
              onClick={handleLogout}
              className="text-right text-red-500 text-sm py-1"
            >
              تسجيل الخروج
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
