import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Search, BookOpen, BarChart2, ChevronLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const FACULTIES = [
  "الكل",
  "كلية إدارة الأعمال",
  "كلية الهندسة",
  "كلية العلوم والدراسات الإنسانية",
  "كلية هندسة وعلوم الحاسب",
  "كلية التربية",
  "كلية الصيدلة",
  "كلية الطب",
  "كلية التمريض",
  "كلية طب الأسنان",
  "كلية العلوم الطبية التطبيقية",
  "أخرى",
];

interface Course {
  id: number;
  faculty: string;
  department: string;
  name: string;
  questionCount: number | string;
}

export default function Browse() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [faculty, setFaculty] = useState("الكل");
  const [search, setSearch] = useState("");
  const [debSearch, setDebSearch] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (faculty && faculty !== "الكل") params.set("faculty", faculty);
    if (debSearch) params.set("name", debSearch);
    fetch(`${BASE}/api/courses?${params}`, { credentials: "include" })
      .then(r => r.json())
      .then(data => setCourses(Array.isArray(data) ? data : []))
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, [faculty, debSearch]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-[#0f172a] transition-colors duration-300">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-10">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0f172a] dark:text-white mb-2">
            استعرض التحليلات
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            ابحث عن مقررك واطّلع على الأنماط والتوصيات
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-100 dark:border-slate-700 p-6 mb-6 space-y-5 shadow-sm">
          <div className="relative">
            <Search className="absolute top-1/2 -translate-y-1/2 right-4 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="ابحث باسم المقرر..."
              className="w-full border border-slate-200 dark:border-slate-600 rounded-xl py-3 pr-11 pl-4 text-sm bg-white dark:bg-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 placeholder:text-slate-400 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 mb-3 uppercase tracking-wide">تصفية بالكلية</label>
            <div className="flex flex-wrap gap-2">
              {FACULTIES.map(f => (
                <button
                  key={f}
                  onClick={() => setFaculty(f)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                    faculty === f
                      ? "bg-gradient-to-r from-[#3b82f6] to-[#6366f1] text-white shadow-sm shadow-blue-500/25"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-100 dark:border-slate-700 p-6 animate-pulse h-32" />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-24 text-slate-400 dark:text-slate-500">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-10 w-10 opacity-40" />
            </div>
            <p className="font-semibold text-slate-600 dark:text-slate-400 mb-1">لا توجد مقررات بهذه المواصفات</p>
            <p className="text-sm mb-6">جرّب تعديل الفلتر أو كن أول من يضيف أسئلة لهذا المقرر!</p>
            <Link href="/submit" className="inline-flex items-center gap-2 bg-gradient-to-r from-[#3b82f6] to-[#6366f1] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all">
              إضافة أسئلة
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 font-medium">
              {courses.length} مقرر
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {courses.map(course => (
                <Link key={course.id} href={`/analytics/${course.id}`}>
                  <div className="group bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-100 dark:border-slate-700 p-6 hover:border-blue-200 dark:hover:border-blue-600 hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[#0f172a] dark:text-white truncate text-base">{course.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">{course.faculty}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{course.department}</p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 flex items-center justify-center flex-shrink-0 transition-colors">
                        <ChevronLeft className="h-4 w-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 mt-5 pt-4 border-t border-slate-50 dark:border-slate-700/50">
                      <BarChart2 className="h-3.5 w-3.5 text-blue-500" />
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {Number(course.questionCount) > 0
                          ? `${course.questionCount} سؤال محلَّل`
                          : "لا توجد أسئلة محلَّلة بعد"}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
