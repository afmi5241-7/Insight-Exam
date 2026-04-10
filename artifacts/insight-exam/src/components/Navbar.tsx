import { Link } from "wouter";
import { PenLine, BarChart2, Sun, Moon, Menu, X } from "lucide-react";
import { useState } from "react";
import { useDarkMode } from "@/lib/dark-mode";

const logo = "/logo.png";

export default function Navbar() {
  const { dark, toggle } = useDarkMode();
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white dark:bg-[#1e293b] border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 text-blue-600 font-bold text-lg">
            <img src={logo} alt="Insight Exam" className="h-9 w-9" />
            <span className="hidden sm:inline">Insight Exam</span>
          </Link>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/submit"
              className="flex items-center gap-1.5 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
            >
              <PenLine className="h-4 w-4" />
              إدخال الأسئلة
            </Link>
            <Link
              href="/analytics"
              className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <BarChart2 className="h-4 w-4" />
              استعرض التحليلات
            </Link>
            <button
              onClick={toggle}
              className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              title={dark ? "الوضع المضيء" : "الوضع الليلي"}
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
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
              onClick={() => setOpen(!open)}
              className="text-slate-600 dark:text-slate-300 p-1"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden py-3 border-t border-slate-100 dark:border-slate-700 flex flex-col gap-2">
            <Link
              href="/submit"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium"
            >
              <PenLine className="h-4 w-4" />
              إدخال الأسئلة
            </Link>
            <Link
              href="/analytics"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium"
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
