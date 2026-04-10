import { Link, useParams } from "wouter";
import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import {
  BookOpen, Target, HelpCircle, TrendingUp, PlusCircle, ChevronRight,
  Lightbulb, ExternalLink, ChevronDown, ChevronLeft,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useDarkMode } from "@/lib/dark-mode";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const diffColors: Record<string, string> = {
  "سهل": "#22C55E", "easy": "#22C55E",
  "متوسط": "#F59E0B", "medium": "#F59E0B",
  "صعب": "#EF4444", "hard": "#EF4444",
};

interface ChapterOverview {
  chapter: string;
  count: number;
  percentage: number;
  dominantDifficulty: string;
  dominantDiffPct: number;
}

interface Analytics {
  course: { id: number; faculty: string; department: string; name: string };
  totalQuestions: number;
  chaptersCovered: number;
  mostCommonType: string;
  dominantDifficulty: string;
  finalsChapterFrequency: { chapter: string; count: number; percentage: number }[];
  midtermsChapterFrequency: { chapter: string; count: number; percentage: number }[];
  chapterFrequency: { chapter: string; count: number; percentage: number }[];
  typeDistribution: { questionType: string; label: string; count: number; percentage: number }[];
  difficultyDistribution: { difficulty: string; label: string; count: number; percentage: number }[];
  yearlyFrequency: { period: string; count: number }[];
  chaptersOverview: ChapterOverview[];
  sourceLinks: { link: string; chapter: string; topic?: string }[];
  recommendations: string[];
}

function CustomTooltip({ active, payload, label, dark }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className={`rounded-xl px-4 py-3 shadow-xl text-sm border ${dark ? "bg-[#1e293b] border-slate-700 text-slate-200" : "bg-white border-slate-100 text-slate-800"}`}>
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
}

function diffBadgeClass(diff: string) {
  if (diff === "سهل" || diff === "easy") return "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400";
  if (diff === "صعب" || diff === "hard") return "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400";
  return "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400";
}

export default function Analytics() {
  const params = useParams<{ id: string }>();
  const courseId = parseInt(params.id);
  const { dark } = useDarkMode();
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openChapter, setOpenChapter] = useState<string | null>(null);

  useEffect(() => {
    if (isNaN(courseId)) { setError("معرف غير صالح"); setLoading(false); return; }
    fetch(`${BASE}/api/courses/${courseId}/analytics`, { credentials: "include" })
      .then(r => r.ok ? r.json() : r.json().then(d => Promise.reject(d.error)))
      .then(setData)
      .catch(e => setError(typeof e === "string" ? e : "تعذّر تحميل التحليلات"))
      .finally(() => setLoading(false));
  }, [courseId]);

  const gridStroke = dark ? "#1e293b" : "#f1f5f9";
  const tickColor = dark ? "#94a3b8" : "#64748b";

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-[#0f172a] transition-colors duration-300">
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-10">
          <LoadingSkeleton />
        </main>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-[#0f172a] transition-colors duration-300">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <p className="text-red-500 dark:text-red-400 mb-4">{error || "مقرر غير موجود"}</p>
            <Link href="/analytics" className="text-[#3b82f6] hover:underline text-sm">← العودة للبحث</Link>
          </div>
        </main>
      </div>
    );
  }

  const {
    course, totalQuestions, chaptersCovered, mostCommonType, dominantDifficulty,
    finalsChapterFrequency, midtermsChapterFrequency, typeDistribution,
    difficultyDistribution, yearlyFrequency, chaptersOverview, sourceLinks, recommendations,
  } = data;

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-[#0f172a] transition-colors duration-300">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-400 dark:text-slate-500 mb-8">
          <Link href="/analytics" className="hover:text-[#3b82f6] transition-colors font-medium">التحليلات</Link>
          <ChevronRight className="h-4 w-4 rotate-180" />
          <span className="text-[#1e293b] dark:text-slate-200 font-medium truncate">{course.name}</span>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0f172a] dark:text-white">{course.name}</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5">{course.faculty} · {course.department}</p>
          </div>
          <Link
            href="/submit"
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:shadow-lg hover:shadow-green-500/25 hover:-translate-y-0.5 transition-all duration-200 w-fit"
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
              <SummaryCard label="إجمالي الأسئلة" value={totalQuestions.toString()} icon={<BookOpen className="h-5 w-5 text-white" />} gradient="from-blue-500 to-indigo-500" />
              <SummaryCard label="عدد الفصول المغطاة" value={chaptersCovered.toString()} icon={<Target className="h-5 w-5 text-white" />} gradient="from-emerald-500 to-green-500" />
              <SummaryCard label="نوع السؤال الأكثر شيوعاً" value={mostCommonType} icon={<HelpCircle className="h-5 w-5 text-white" />} gradient="from-purple-500 to-violet-500" small />
              <SummaryCard label="مستوى الصعوبة الغالب" value={dominantDifficulty} icon={<TrendingUp className="h-5 w-5 text-white" />} gradient="from-orange-500 to-amber-500" small />
            </div>

            {/* Finals Chart */}
            {finalsChapterFrequency.length > 0 && (
              <ChartCard title="تكرار الفصول في اختبارات الفاينل 📋" className="mb-6">
                <ResponsiveContainer width="100%" height={Math.max(220, finalsChapterFrequency.length * 42)}>
                  <BarChart data={finalsChapterFrequency} layout="vertical" margin={{ right: 30, left: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridStroke} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: tickColor }} />
                    <YAxis dataKey="chapter" type="category" width={110} tick={{ fontSize: 10, fill: tickColor }} tickFormatter={(v: string) => v.length > 16 ? v.slice(0, 16) + "…" : v} />
                    <Tooltip content={<CustomTooltip dark={dark} />} />
                    <Bar dataKey="count" name="عدد الأسئلة" radius={[0, 6, 6, 0]}>
                      {finalsChapterFrequency.map((_, i) => {
                        const maxCount = finalsChapterFrequency[0]?.count || 1;
                        const intensity = 0.4 + 0.6 * (finalsChapterFrequency[i]?.count / maxCount);
                        return <Cell key={i} fill={`rgba(59, 130, 246, ${intensity})`} />;
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            )}

            {/* Midterms Chart */}
            {midtermsChapterFrequency.length > 0 && (
              <ChartCard title="تكرار الفصول في اختبارات الميد 📝" className="mb-6">
                <ResponsiveContainer width="100%" height={Math.max(220, midtermsChapterFrequency.length * 42)}>
                  <BarChart data={midtermsChapterFrequency} layout="vertical" margin={{ right: 30, left: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridStroke} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: tickColor }} />
                    <YAxis dataKey="chapter" type="category" width={110} tick={{ fontSize: 10, fill: tickColor }} tickFormatter={(v: string) => v.length > 16 ? v.slice(0, 16) + "…" : v} />
                    <Tooltip content={<CustomTooltip dark={dark} />} />
                    <Bar dataKey="count" name="عدد الأسئلة" radius={[0, 6, 6, 0]}>
                      {midtermsChapterFrequency.map((_, i) => {
                        const maxCount = midtermsChapterFrequency[0]?.count || 1;
                        const intensity = 0.4 + 0.6 * (midtermsChapterFrequency[i]?.count / maxCount);
                        return <Cell key={i} fill={`rgba(139, 92, 246, ${intensity})`} />;
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            )}

            {/* Type + Difficulty charts */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {typeDistribution.length > 0 && (
                <ChartCard title="توزيع أنواع الأسئلة">
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={typeDistribution.map(t => ({ ...t, name: t.label }))}
                        dataKey="count" nameKey="name"
                        cx="50%" cy="50%" outerRadius={80}
                        label={({ name, percentage }: any) => `${name} ${percentage}%`}
                        labelLine={false}
                      >
                        {typeDistribution.map((_, i) => (
                          <Cell key={i} fill={["#3b82f6","#22C55E","#F59E0B","#8B5CF6","#EF4444","#06B6D4","#EC4899"][i % 7]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v: any, n: any) => [v, n]} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartCard>
              )}
              {difficultyDistribution.length > 0 && (
                <ChartCard title="توزيع مستوى الصعوبة">
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={difficultyDistribution.map(d => ({ ...d, name: d.label }))} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                      <XAxis dataKey="name" tick={{ fontSize: 12, fill: tickColor }} />
                      <YAxis tick={{ fontSize: 11, fill: tickColor }} />
                      <Tooltip content={<CustomTooltip dark={dark} />} />
                      <Bar dataKey="count" name="عدد الأسئلة" radius={[6, 6, 0, 0]}>
                        {difficultyDistribution.map((d, i) => (
                          <Cell key={i} fill={diffColors[d.difficulty] ?? "#3b82f6"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              )}
            </div>

            {/* Chapter List */}
            {chaptersOverview.length > 0 && (
              <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm mb-8 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700">
                  <h3 className="font-bold text-[#0f172a] dark:text-white text-lg">قائمة الفصول</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">انقر على أي فصل لعرض تحليلاته التفصيلية</p>
                </div>
                <div className="divide-y divide-slate-50 dark:divide-slate-700/50">
                  {chaptersOverview.map((ch) => (
                    <div key={ch.chapter}>
                      <Link href={`/analytics/${courseId}/chapter/${encodeURIComponent(ch.chapter)}`}>
                        <div className="group flex items-center gap-4 px-6 py-4 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors cursor-pointer">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className="font-semibold text-[#1e293b] dark:text-slate-200 text-sm">{ch.chapter}</span>
                              {ch.dominantDifficulty && (
                                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${diffBadgeClass(ch.dominantDifficulty)}`}>
                                  {ch.dominantDiffPct}% {ch.dominantDifficulty}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-4 flex-shrink-0">
                            <div className="text-right">
                              <p className="font-bold text-[#3b82f6] text-sm">{ch.count} سؤال</p>
                              <p className="text-xs text-slate-400">{ch.percentage}% من الإجمالي</p>
                            </div>
                            <ChevronLeft className="h-4 w-4 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 transition-colors" />
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {recommendations.length > 0 && (
              <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-7 mb-6 transition-colors duration-300">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-sm">
                    <Lightbulb className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="font-bold text-[#0f172a] dark:text-white text-lg">توصيات المراجعة</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {recommendations.map((rec, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                      <div className="w-6 h-6 bg-gradient-to-br from-[#3b82f6] to-[#6366f1] text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</div>
                      <p className="text-[#1e293b] dark:text-slate-300 text-sm leading-relaxed">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Source Links */}
            {sourceLinks.length > 0 && (
              <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-7 transition-colors duration-300">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center shadow-sm">
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-[#0f172a] dark:text-white text-lg">مصادر مفيدة 📚</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">شاركها زملاؤك</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {sourceLinks.map((src, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/10 dark:to-green-900/10 rounded-xl border border-emerald-100 dark:border-emerald-800">
                      <ExternalLink className="h-4 w-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 font-medium">{src.chapter}{src.topic ? ` · ${src.topic}` : ""}</p>
                        <a href={src.link} target="_blank" rel="noopener noreferrer" className="text-[#3b82f6] dark:text-blue-400 text-sm hover:underline break-all font-medium" dir="ltr">{src.link}</a>
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

function SummaryCard({ label, value, icon, gradient, small }: { label: string; value: string; icon: React.ReactNode; gradient: string; small?: boolean }) {
  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-100 dark:border-slate-700 p-5 flex items-center gap-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm`}>{icon}</div>
      <div className="min-w-0">
        {small
          ? <p className="font-bold text-[#0f172a] dark:text-white text-sm leading-tight truncate">{value || "—"}</p>
          : <p className="text-3xl font-black text-[#0f172a] dark:text-white">{value}</p>}
        <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5 leading-tight">{label}</p>
      </div>
    </div>
  );
}

function ChartCard({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-6 transition-colors duration-300 ${className}`}>
      <h3 className="font-bold text-[#0f172a] dark:text-white mb-5 text-sm">{title}</h3>
      {children}
    </div>
  );
}

function EmptyState({ courseId }: { courseId: number }) {
  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-20 text-center">
      <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
        <TrendingUp className="h-12 w-12 text-slate-300 dark:text-slate-600" />
      </div>
      <h3 className="font-bold text-[#1e293b] dark:text-slate-300 mb-3 text-xl">لا توجد بيانات للتحليل بعد</h3>
      <p className="text-slate-400 dark:text-slate-500 text-sm mb-8 leading-relaxed">الأسئلة المرفوعة قيد المراجعة — أو كن أول من يضيف أسئلة لهذا المقرر!</p>
      <Link href="/submit" className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-7 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-green-500/25 hover:-translate-y-0.5 transition-all duration-200">
        <PlusCircle className="h-4 w-4" />أضف أسئلة الآن
      </Link>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <div key={i} className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-100 dark:border-slate-700 p-5 h-24" />)}
      </div>
      <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-100 dark:border-slate-700 p-6 h-64" />
      <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-100 dark:border-slate-700 p-6 h-64" />
    </div>
  );
}
