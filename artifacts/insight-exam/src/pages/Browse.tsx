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
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0f172a] transition-colors duration-300">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100 mb-1">
            استعرض التحليلات
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            ابحث عن مقررك واطّلع على الأنماط والتوصيات
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-slate-700 p-5 mb-6 space-y-4 shadow-sm">
          <div className="relative">
            <Search className="absolute top-1/2 -translate-y-1/2 right-3 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="ابحث باسم المقرر..."
              className="w-full border border-slate-200 dark:border-slate-600 rounded-xl py-2.5 pr-10 pl-4 text-sm bg-white dark:bg-slate-700 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">تصفية بالكلية</label>
            <div className="flex flex-wrap gap-2">
              {FACULTIES.slice(0, 6).map(f => (
                <button
                  key={f}
                  onClick={() => setFaculty(f)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    faculty === f
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {FACULTIES.slice(6).map(f => (
                <button
                  key={f}
                  onClick={() => setFaculty(f)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    faculty === f
                      ? "bg-blue-600 text-white"
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
              <div key={i} className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-slate-700 p-5 animate-pulse h-28" />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20 text-slate-400 dark:text-slate-500">
            <BookOpen className="h-14 w-14 mx-auto mb-3 opacity-30" />
            <p className="font-medium">لا توجد مقررات بهذه المواصفات</p>
            <p className="text-sm mt-1">جرّب تعديل الفلتر أو كن أول من يضيف أسئلة لهذا المقرر!</p>
            <Link href="/submit" className="inline-flex items-center gap-2 mt-4 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
              إضافة أسئلة
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              {courses.length} مقرر
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {courses.map(course => (
                <Link key={course.id} href={`/analytics/${course.id}`}>
                  <div className="group bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-slate-700 p-5 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all duration-200 cursor-pointer">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-800 dark:text-slate-100 truncate">{course.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{course.faculty}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{course.department}</p>
                      </div>
                      <ChevronLeft className="h-5 w-5 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 flex-shrink-0 mt-0.5 transition-colors" />
                    </div>
                    <div className="flex items-center gap-1.5 mt-4">
                      <BarChart2 className="h-3.5 w-3.5 text-blue-500" />
                      <span className="text-xs text-slate-600 dark:text-slate-400">
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
