import { Link } from "wouter";
import { PenLine, BarChart2, Sun, Moon, Menu, X } from "lucide-react";
import { useState } from "react";
import { useDarkMode } from "@/lib/dark-mode";

const logo = "/logo.png";

export default function Navbar() {
  const { dark, toggle } = useDarkMode();
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-700/60 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5 group">
            <img src={logo} alt="Insight Exam" className="h-9 w-9 transition-transform duration-200 group-hover:scale-105" />
            <span className="hidden sm:inline font-bold text-[#0f172a] dark:text-white text-lg tracking-tight">Insight Exam</span>
          </Link>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/submit"
              className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-5 py-2 rounded-full text-sm font-semibold hover:shadow-lg hover:shadow-green-500/25 hover:-translate-y-0.5 transition-all duration-200"
            >
              <PenLine className="h-3.5 w-3.5" />
              إدخال الأسئلة
            </Link>
            <Link
              href="/analytics"
              className="flex items-center gap-1.5 bg-gradient-to-r from-[#3b82f6] to-[#6366f1] text-white px-5 py-2 rounded-full text-sm font-semibold hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 transition-all duration-200"
            >
              <BarChart2 className="h-3.5 w-3.5" />
              استعرض التحليلات
            </Link>
            <button
              onClick={toggle}
              className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={dark ? "الوضع المضيء" : "الوضع الليلي"}
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggle}
              className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setOpen(!open)}
              className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden py-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2 pb-4">
            <Link
              href="/submit"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-5 py-2.5 rounded-full text-sm font-semibold justify-center"
            >
              <PenLine className="h-4 w-4" />
              إدخال الأسئلة
            </Link>
            <Link
              href="/analytics"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 bg-gradient-to-r from-[#3b82f6] to-[#6366f1] text-white px-5 py-2.5 rounded-full text-sm font-semibold justify-center"
            >
              <BarChart2 className="h-4 w-4" />
              استعرض التحليلات
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
