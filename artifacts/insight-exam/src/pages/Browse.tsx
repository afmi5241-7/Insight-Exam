import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { Search, BookOpen, BarChart2, ChevronLeft, ChevronDown, Building2, GraduationCap, FileQuestion, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

interface Stats {
  totalQuestions: number;
  totalCourses: number;
  totalColleges: number;
  totalSubmissions: number;
}

interface Course {
  id: number;
  faculty: string;
  department: string;
  name: string;
  questionCount: number | string;
}

function useCountUp(target: number, duration = 1500) {
  const [count, setCount] = useState(0);
  const startedRef = useRef(false);
  useEffect(() => {
    if (target === 0 || startedRef.current) return;
    startedRef.current = true;
    const startTime = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(eased * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return count;
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  const count = useCountUp(value);
  return (
    <div className={`${color} rounded-2xl p-5 flex flex-col items-center gap-2 text-center`}>
      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
        {icon}
      </div>
      <p className="text-3xl font-black text-white">{count.toLocaleString()}</p>
      <p className="text-white/85 text-sm font-medium">{label}</p>
    </div>
  );
}

const selectClass = "w-full border border-slate-200 dark:border-[#1a3a6a]/60 rounded-xl py-3 px-4 text-sm bg-white dark:bg-[#0a1628] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#2d6cc0]/40 focus:border-[#4a9eed] transition-all appearance-none cursor-pointer";

export default function Browse() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [faculties, setFaculties] = useState<string[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  const [faculty, setFaculty] = useState("");
  const [department, setDepartment] = useState("");
  const [search, setSearch] = useState("");
  const [debSearch, setDebSearch] = useState("");

  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingFaculties, setLoadingFaculties] = useState(true);
  const [loadingDepts, setLoadingDepts] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(false);

  useEffect(() => {
    fetch(`${BASE}/api/stats`, { credentials: "include" })
      .then(r => r.json()).then(setStats).catch(() => {}).finally(() => setLoadingStats(false));
  }, []);

  useEffect(() => {
    fetch(`${BASE}/api/faculties`, { credentials: "include" })
      .then(r => r.json()).then(data => setFaculties(Array.isArray(data) ? data : [])).catch(() => setFaculties([])).finally(() => setLoadingFaculties(false));
  }, []);

  useEffect(() => {
    if (!faculty) { setDepartments([]); setDepartment(""); setCourses([]); return; }
    setLoadingDepts(true);
    setDepartment("");
    setCourses([]);
    fetch(`${BASE}/api/departments?faculty=${encodeURIComponent(faculty)}`, { credentials: "include" })
      .then(r => r.json()).then(data => setDepartments(Array.isArray(data) ? data : [])).catch(() => setDepartments([])).finally(() => setLoadingDepts(false));
  }, [faculty]);

  useEffect(() => {
    const t = setTimeout(() => setDebSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    if (!faculty || !department) { setCourses([]); return; }
    setLoadingCourses(true);
    const params = new URLSearchParams({ faculty, department });
    fetch(`${BASE}/api/courses?${params}`, { credentials: "include" })
      .then(r => r.json()).then(data => setCourses(Array.isArray(data) ? data : [])).catch(() => setCourses([])).finally(() => setLoadingCourses(false));
  }, [faculty, department]);

  const filteredCourses = courses.filter(c =>
    !debSearch || c.name.toLowerCase().includes(debSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f6ff] dark:bg-[#0a1628] transition-colors duration-300">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-10">

        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0f2240] dark:text-white mb-2">
            استعرض التحليلات
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            اختر كليتك وقسمك لاستعراض تحليلات المقررات
          </p>
        </div>

        {/* Global Stats Banner */}
        {!loadingStats && stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            <StatCard
              icon={<FileQuestion className="h-6 w-6 text-white" />}
              label="إجمالي الأسئلة المُحللة"
              value={stats.totalQuestions}
              color="bg-gradient-to-br from-[#1a4b8c] to-[#2d6cc0]"
            />
            <StatCard
              icon={<BookOpen className="h-6 w-6 text-white" />}
              label="عدد المقررات"
              value={stats.totalCourses}
              color="bg-gradient-to-br from-[#2d6cc0] to-[#4a9eed]"
            />
            <StatCard
              icon={<Building2 className="h-6 w-6 text-white" />}
              label="عدد الكليات المشاركة"
              value={stats.totalColleges}
              color="bg-gradient-to-br from-[#4a9eed] to-[#7ec8f0]"
            />
            <StatCard
              icon={<Users className="h-6 w-6 text-white" />}
              label="إجمالي المساهمات"
              value={stats.totalSubmissions}
              color="bg-gradient-to-br from-emerald-500 to-green-500"
            />
          </div>
        )}
        {loadingStats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10 animate-pulse">
            {[1,2,3,4].map(i => <div key={i} className="bg-slate-200 dark:bg-[#0f2240] rounded-2xl h-32" />)}
          </div>
        )}

        {/* Course Finder */}
        <div className="bg-white dark:bg-[#0f2240] rounded-2xl border border-slate-100 dark:border-[#1a3a6a]/40 p-6 mb-8 space-y-5 shadow-sm">
          <h2 className="font-bold text-[#0f2240] dark:text-white text-lg mb-1">ابحث عن مقررك</h2>

          <div>
            <div className="relative">
              <GraduationCap className="absolute top-1/2 -translate-y-1/2 right-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
              <select
                value={faculty}
                onChange={e => setFaculty(e.target.value)}
                className={`${selectClass} pr-10`}
                disabled={loadingFaculties}
              >
                <option value="">اختر الكلية...</option>
                {faculties.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
              <ChevronDown className="absolute top-1/2 -translate-y-1/2 left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {faculty && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="relative">
                <Building2 className="absolute top-1/2 -translate-y-1/2 right-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                <select
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  className={`${selectClass} pr-10`}
                  disabled={loadingDepts}
                >
                  <option value="">{loadingDepts ? "جارٍ التحميل..." : "اختر القسم..."}</option>
                  {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <ChevronDown className="absolute top-1/2 -translate-y-1/2 left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          )}
        </div>

        {/* Course Results */}
        {department && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="relative mb-5">
              <Search className="absolute top-1/2 -translate-y-1/2 right-4 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="ابحث باسم المقرر..."
                className="w-full border border-slate-200 dark:border-[#1a3a6a]/60 rounded-xl py-3 pr-11 pl-4 text-sm bg-white dark:bg-[#0f2240] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#2d6cc0]/40 focus:border-[#4a9eed] placeholder:text-slate-400 transition-all shadow-sm"
              />
            </div>

            {loadingCourses ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="bg-white dark:bg-[#0f2240] rounded-2xl border border-slate-100 dark:border-[#1a3a6a]/40 p-6 animate-pulse h-32" />
                ))}
              </div>
            ) : filteredCourses.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-[#f0f6ff] dark:bg-[#0f2240] rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-10 w-10 text-slate-300 dark:text-[#1a3a6a]" />
                </div>
                <p className="font-semibold text-slate-600 dark:text-slate-300 mb-2">
                  {courses.length === 0
                    ? "لا توجد مقررات مُدخلة حالياً في هذا القسم. كن أول من يساهم! 🎯"
                    : "لا توجد مقررات تطابق بحثك"}
                </p>
                <Link
                  href="/submit"
                  className="inline-flex items-center gap-2 mt-4 bg-gradient-to-r from-[#2d6cc0] to-[#4a9eed] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:shadow-lg hover:shadow-[#2d6cc0]/25 transition-all"
                >
                  إضافة أسئلة لهذا القسم
                </Link>
              </div>
            ) : (
              <>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 font-medium">
                  {filteredCourses.length} مقرر
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {filteredCourses.map(course => (
                    <Link key={course.id} href={`/analytics/${course.id}`}>
                      <div className="group bg-white dark:bg-[#0f2240] rounded-2xl border border-slate-100 dark:border-[#1a3a6a]/40 p-6 hover:border-[#4a9eed]/50 dark:hover:border-[#2d6cc0]/60 hover:shadow-lg hover:shadow-[#2d6cc0]/5 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-[#0f2240] dark:text-white truncate text-base">{course.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">{course.faculty}</p>
                            <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{course.department}</p>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-[#f0f6ff] dark:bg-[#0a1628] group-hover:bg-[#e0eeff] dark:group-hover:bg-[#0f2240] flex items-center justify-center flex-shrink-0 transition-colors">
                            <ChevronLeft className="h-4 w-4 text-slate-400 group-hover:text-[#2d6cc0] transition-colors" />
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 mt-5 pt-4 border-t border-slate-50 dark:border-[#1a3a6a]/30">
                          <BarChart2 className="h-3.5 w-3.5 text-[#2d6cc0]" />
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
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
