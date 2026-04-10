import { Link, useParams } from "wouter";
import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import { BookOpen, Target, HelpCircle, TrendingUp, PlusCircle, ChevronRight, Lightbulb, ExternalLink, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useDarkMode } from "@/lib/dark-mode";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const CHART_COLORS = ["#2563EB", "#22C55E", "#F59E0B", "#8B5CF6", "#EF4444", "#06B6D4", "#EC4899", "#84CC16", "#F97316"];

const diffColors: Record<string, string> = {
  "سهل": "#22C55E", "easy": "#22C55E",
  "متوسط": "#F59E0B", "medium": "#F59E0B",
  "صعب": "#EF4444", "hard": "#EF4444",
};

interface Analytics {
  course: { id: number; faculty: string; department: string; name: string };
  totalQuestions: number;
  mostRepeatedChapter: string;
  mostCommonType: string;
  dominantDifficulty: string;
  chapterFrequency: { chapter: string; count: number; percentage: number }[];
  typeDistribution: { questionType: string; label: string; count: number; percentage: number }[];
  difficultyDistribution: { difficulty: string; label: string; count: number; percentage: number }[];
  yearlyFrequency: { period: string; count: number }[];
  sourceLinks: { link: string; chapter: string; topic?: string }[];
  recommendations: string[];
}

function CustomTooltip({ active, payload, label, dark }: any) {
  if (active && payload && payload.length) {
    return (
      <div className={`border rounded-lg p-3 shadow-lg text-sm ${dark ? "bg-[#1e293b] border-slate-600 text-slate-200" : "bg-white border-slate-200 text-slate-800"}`}>
        <p className="font-medium mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }}>{p.name}: {p.value}</p>
        ))}
      </div>
    );
  }
  return null;
}

export default function Analytics() {
  const params = useParams<{ id: string }>();
  const courseId = parseInt(params.id);
  const { dark } = useDarkMode();
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isNaN(courseId)) { setError("معرف غير صالح"); setLoading(false); return; }
    fetch(`${BASE}/api/courses/${courseId}/analytics`, { credentials: "include" })
      .then(r => r.ok ? r.json() : r.json().then(d => Promise.reject(d.error)))
      .then(d => setData(d))
      .catch(e => setError(typeof e === "string" ? e : "تعذّر تحميل التحليلات"))
      .finally(() => setLoading(false));
  }, [courseId]);

  const gridStroke = dark ? "#334155" : "#f1f5f9";
  const tickColor = dark ? "#94a3b8" : "#64748b";

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0f172a] transition-colors duration-300">
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
          <LoadingSkeleton />
        </main>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0f172a] transition-colors duration-300">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <p className="text-red-500 dark:text-red-400 mb-4">{error || "مقرر غير موجود"}</p>
            <Link href="/analytics" className="text-blue-600 hover:underline text-sm">← العودة للبحث</Link>
          </div>
        </main>
      </div>
    );
  }

  const { course, totalQuestions, mostRepeatedChapter, mostCommonType, dominantDifficulty,
    chapterFrequency, typeDistribution, difficultyDistribution, yearlyFrequency,
    sourceLinks, recommendations } = data;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0f172a] transition-colors duration-300">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6">
          <Link href="/analytics" className="hover:text-blue-600 transition-colors">استعرض التحليلات</Link>
          <ChevronRight className="h-4 w-4 rotate-180" />
          <span className="text-slate-800 dark:text-slate-200">{course.name}</span>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{course.name}</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              {course.faculty} · {course.department}
            </p>
          </div>
          <Link
            href="/submit"
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors w-fit"
          >
            <PlusCircle className="h-4 w-4" />
            أضف سؤالاً
          </Link>
        </div>

        {totalQuestions === 0 ? (
          <EmptyState courseId={courseId} />
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <SummaryCard label="إجمالي الأسئلة" value={totalQuestions.toString()} icon={<BookOpen className="h-5 w-5 text-blue-600" />} bgColor="bg-blue-50 dark:bg-blue-900/30" />
              <SummaryCard label="الموضوع الأكثر تكراراً" value={mostRepeatedChapter} icon={<Target className="h-5 w-5 text-green-600" />} bgColor="bg-green-50 dark:bg-green-900/30" small />
              <SummaryCard label="نوع السؤال الأكثر شيوعاً" value={mostCommonType} icon={<HelpCircle className="h-5 w-5 text-purple-600" />} bgColor="bg-purple-50 dark:bg-purple-900/30" small />
              <SummaryCard label="مستوى الصعوبة الغالب" value={dominantDifficulty} icon={<TrendingUp className="h-5 w-5 text-orange-600" />} bgColor="bg-orange-50 dark:bg-orange-900/30" small />
            </div>

            {/* Charts Row 1 */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <ChartCard title="الفصول الأكثر تكراراً">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={chapterFrequency} layout="vertical" margin={{ right: 20, left: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridStroke} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: tickColor }} />
                    <YAxis dataKey="chapter" type="category" width={100} tick={{ fontSize: 10, fill: tickColor }} tickFormatter={(v: string) => v.length > 14 ? v.slice(0, 14) + "…" : v} />
                    <Tooltip content={<CustomTooltip dark={dark} />} />
                    <Bar dataKey="count" name="عدد الأسئلة" fill="#2563EB" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="توزيع أنواع الأسئلة">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={typeDistribution.map(t => ({ ...t, name: t.label }))}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={85}
                      label={({ name, percentage }: any) => `${name} (${percentage}%)`}
                      labelLine={false}
                    >
                      {typeDistribution.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: any, n: any) => [v, n]} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            {/* Charts Row 2 */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <ChartCard title="توزيع مستوى الصعوبة">
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={difficultyDistribution.map(d => ({ ...d, name: d.label }))} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: tickColor }} />
                    <YAxis tick={{ fontSize: 11, fill: tickColor }} />
                    <Tooltip content={<CustomTooltip dark={dark} />} />
                    <Bar dataKey="count" name="عدد الأسئلة" radius={[4, 4, 0, 0]}>
                      {difficultyDistribution.map((d, i) => (
                        <Cell key={i} fill={diffColors[d.difficulty] ?? CHART_COLORS[i]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="تكرار الأسئلة حسب السنة والاختبار">
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={yearlyFrequency} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                    <XAxis dataKey="period" tick={{ fontSize: 9, fill: tickColor }} tickFormatter={(v: string) => v.length > 12 ? v.slice(0, 12) + ".." : v} />
                    <YAxis tick={{ fontSize: 11, fill: tickColor }} />
                    <Tooltip content={<CustomTooltip dark={dark} />} />
                    <Bar dataKey="count" name="عدد الأسئلة" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            {/* Recommendations */}
            {recommendations.length > 0 && (
              <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 mb-6 transition-colors duration-300">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                    <Lightbulb className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <h2 className="font-bold text-slate-800 dark:text-slate-100 text-lg">توصيات المراجعة</h2>
                </div>
                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {recommendations.map((rec, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Source Links */}
            {sourceLinks.length > 0 && (
              <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 transition-colors duration-300">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-green-50 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="font-bold text-slate-800 dark:text-slate-100 text-lg">مصادر مفيدة 📚</h2>
                  <span className="text-xs text-slate-500 dark:text-slate-400">— شاركها زملاؤك</span>
                </div>
                <div className="space-y-3">
                  {sourceLinks.map((src, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-100 dark:border-green-800">
                      <ExternalLink className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">
                          {src.chapter}{src.topic ? ` · ${src.topic}` : ""}
                        </p>
                        <a
                          href={src.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 text-sm hover:underline break-all"
                          dir="ltr"
                        >
                          {src.link}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

function SummaryCard({ label, value, icon, bgColor, small }: { label: string; value: string; icon: React.ReactNode; bgColor: string; small?: boolean }) {
  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 p-5 flex items-center gap-3 transition-colors duration-300">
      <div className={`w-11 h-11 ${bgColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
      <div className="min-w-0">
        {small ? (
          <p className="font-bold text-slate-800 dark:text-slate-100 text-sm leading-tight truncate">{value || "—"}</p>
        ) : (
          <p className="text-3xl font-black text-slate-800 dark:text-slate-100">{value}</p>
        )}
        <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5 leading-tight">{label}</p>
      </div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 transition-colors duration-300">
      <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-4 text-sm">{title}</h3>
      {children}
    </div>
  );
}

function EmptyState({ courseId }: { courseId: number }) {
  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-dashed border-slate-300 dark:border-slate-600 p-16 text-center transition-colors duration-300">
      <TrendingUp className="h-16 w-16 text-slate-200 dark:text-slate-600 mx-auto mb-4" />
      <h3 className="font-bold text-slate-600 dark:text-slate-300 mb-2 text-xl">لا توجد بيانات للتحليل بعد</h3>
      <p className="text-slate-400 dark:text-slate-500 text-sm mb-6">الأسئلة المرفوعة قيد المراجعة — أو كن أول من يضيف أسئلة لهذا المقرر!</p>
      <Link href="/submit" className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors">
        <PlusCircle className="h-4 w-4" />
        أضف أسئلة الآن
      </Link>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => <div key={i} className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 p-5 h-20" />)}
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {[1, 2].map(i => <div key={i} className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-slate-700 p-6 h-72" />)}
      </div>
    </div>
  );
}
