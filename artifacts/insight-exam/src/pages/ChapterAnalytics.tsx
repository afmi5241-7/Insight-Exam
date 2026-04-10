import { Link, useParams } from "wouter";
import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import {
  ChevronRight, PlusCircle, Star, Repeat2, BookOpen, ExternalLink,
  AlertCircle, Lightbulb,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useDarkMode } from "@/lib/dark-mode";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const DIFF_COLORS = { "سهل": "#22C55E", "متوسط": "#F59E0B", "صعب": "#EF4444" } as Record<string, string>;
const DIFF_DARK_COLORS = { "سهل": "#4ade80", "متوسط": "#fbbf24", "صعب": "#f87171" } as Record<string, string>;

interface Question {
  id: number;
  text: string;
  imageUrl?: string;
  chapter: string;
  topic?: string;
  questionType: string;
  difficulty: string;
  year: string;
  examType: string;
  sourceLink?: string;
}

interface ChapterData {
  course: { id: number; faculty: string; department: string; name: string };
  chapter: string;
  totalQuestions: number;
  difficultyDistribution: { difficulty: string; label: string; count: number; percentage: number }[];
  frequencyByPeriod: { period: string; count: number }[];
  modelQuestion: Question | null;
  modelQuestionType: "repeated" | "common_topic" | "random";
  repeatCount: number;
  questions: Question[];
  sourceLinks: { link: string; topic?: string }[];
}

function CustomTooltip({ active, payload, label, dark }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className={`rounded-xl px-4 py-3 shadow-xl text-sm border ${dark ? "bg-[#1e293b] border-slate-700 text-slate-200" : "bg-white border-slate-100 text-slate-800"}`}>
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((p: any, i: number) => <p key={i} style={{ color: p.color }}>{p.name}: {p.value}</p>)}
    </div>
  );
}

function typeBadgeClass(type: string) {
  const map: Record<string, string> = {
    "اختيار من متعدد": "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300",
    "صح وخطأ": "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300",
    "أكمل الفراغ": "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300",
    "إجابة قصيرة": "bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300",
    "إجابة طويلة": "bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300",
    "مسائل رياضية / حسابية": "bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300",
  };
  return map[type] ?? "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300";
}

function diffBadgeClass(diff: string) {
  if (diff === "سهل" || diff === "easy") return "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400";
  if (diff === "صعب" || diff === "hard") return "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400";
  return "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400";
}

function getLinkIcon(link: string) {
  if (link.includes("youtube.com") || link.includes("youtu.be")) return "🎥";
  if (link.includes("t.me") || link.includes("telegram")) return "✈️";
  return "🔗";
}

function getLinkColor(link: string) {
  if (link.includes("youtube.com") || link.includes("youtu.be")) return "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10";
  if (link.includes("t.me") || link.includes("telegram")) return "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/10";
  return "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50";
}

export default function ChapterAnalytics() {
  const params = useParams<{ id: string; chapter: string }>();
  const courseId = parseInt(params.id);
  const chapter = decodeURIComponent(params.chapter ?? "");
  const { dark } = useDarkMode();

  const [data, setData] = useState<ChapterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isNaN(courseId) || !chapter) { setError("معرف غير صالح"); setLoading(false); return; }
    fetch(`${BASE}/api/courses/${courseId}/chapters/${encodeURIComponent(chapter)}`, { credentials: "include" })
      .then(r => r.ok ? r.json() : r.json().then(d => Promise.reject(d.error)))
      .then(setData)
      .catch(e => setError(typeof e === "string" ? e : "تعذّر تحميل بيانات الفصل"))
      .finally(() => setLoading(false));
  }, [courseId, chapter]);

  const gridStroke = dark ? "#1e293b" : "#f1f5f9";
  const tickColor = dark ? "#94a3b8" : "#64748b";

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-[#0f172a] transition-colors duration-300">
        <Navbar />
        <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-10">
          <div className="space-y-6 animate-pulse">
            {[1,2,3].map(i => <div key={i} className="bg-white dark:bg-[#1e293b] rounded-2xl h-64 border border-slate-100 dark:border-slate-700" />)}
          </div>
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
            <p className="text-red-500 dark:text-red-400 mb-4">{error || "الفصل غير موجود"}</p>
            <Link href={`/analytics/${courseId}`} className="text-[#3b82f6] hover:underline text-sm">← العودة للمقرر</Link>
          </div>
        </main>
      </div>
    );
  }

  const { course, totalQuestions, difficultyDistribution, frequencyByPeriod, modelQuestion, modelQuestionType, repeatCount, questions, sourceLinks } = data;

  const donutData = difficultyDistribution.map(d => ({
    name: d.label,
    value: d.count,
    color: (dark ? DIFF_DARK_COLORS : DIFF_COLORS)[d.difficulty] ?? "#94a3b8",
  }));

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-[#0f172a] transition-colors duration-300">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-10">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-400 dark:text-slate-500 mb-8 flex-wrap">
          <Link href="/analytics" className="hover:text-[#3b82f6] transition-colors font-medium">التحليلات</Link>
          <ChevronRight className="h-4 w-4 rotate-180" />
          <Link href={`/analytics/${courseId}`} className="hover:text-[#3b82f6] transition-colors font-medium truncate max-w-[140px]">{course.name}</Link>
          <ChevronRight className="h-4 w-4 rotate-180" />
          <span className="text-[#1e293b] dark:text-slate-200 font-medium">{chapter}</span>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-[#3b82f6] bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">{course.name}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0f172a] dark:text-white">{chapter}</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{totalQuestions} سؤال محلَّل</p>
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
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-16 text-center">
            <AlertCircle className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="font-bold text-slate-600 dark:text-slate-300 mb-2">لا توجد أسئلة محلَّلة لهذا الفصل بعد</p>
            <Link href="/submit" className="inline-flex items-center gap-2 mt-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:shadow-lg transition-all">
              <PlusCircle className="h-4 w-4" />أضف أسئلة الآن
            </Link>
          </div>
        ) : (
          <>
            {/* Charts Row */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Donut - Difficulty */}
              <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-6">
                <h3 className="font-bold text-[#0f172a] dark:text-white mb-5 text-sm">مستوى صعوبة الأسئلة في هذا الفصل</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={donutData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%" cy="50%"
                      innerRadius={55} outerRadius={85}
                      paddingAngle={3}
                      label={({ name, percent }) => `${name} ${Math.round((percent ?? 0) * 100)}%`}
                      labelLine={false}
                    >
                      {donutData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip formatter={(v: any, n: any) => [v, n]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 mt-2">
                  {donutData.map(d => (
                    <div key={d.name} className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="text-xs text-slate-500 dark:text-slate-400">{d.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bar - Frequency by period */}
              <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-6">
                <h3 className="font-bold text-[#0f172a] dark:text-white mb-5 text-sm">تكرار ظهور هذا الفصل في الاختبارات عبر السنوات</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={frequencyByPeriod} margin={{ top: 5, right: 20, bottom: 30, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                    <XAxis dataKey="period" tick={{ fontSize: 9, fill: tickColor }} angle={-35} textAnchor="end" interval={0} />
                    <YAxis tick={{ fontSize: 11, fill: tickColor }} allowDecimals={false} />
                    <Tooltip content={<CustomTooltip dark={dark} />} />
                    <Bar dataKey="count" name="عدد الأسئلة" radius={[6, 6, 0, 0]}>
                      {frequencyByPeriod.map((_, i) => (
                        <Cell key={i} fill={`hsl(${220 + i * 15}, 80%, ${dark ? 60 : 55}%)`} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Model Question */}
            {modelQuestion && (
              <div className="bg-white dark:bg-[#1e293b] rounded-2xl border-2 border-[#3b82f6]/30 dark:border-[#3b82f6]/40 shadow-lg shadow-blue-500/5 p-7 mb-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-sm">
                    <Star className="h-5 w-5 text-white fill-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0f172a] dark:text-white text-lg">السؤال النموذجي ⭐️</h3>
                    {modelQuestionType === "repeated" && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2.5 py-0.5 rounded-full mt-0.5">
                        <Repeat2 className="h-3 w-3" />
                        سؤال متكرر — يُنصح بالتركيز عليه 🔥 ({repeatCount} مرة)
                      </span>
                    )}
                    {modelQuestionType === "common_topic" && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2.5 py-0.5 rounded-full mt-0.5">
                        <Lightbulb className="h-3 w-3" />
                        من الموضوع الأكثر تكراراً
                      </span>
                    )}
                    {modelQuestionType === "random" && (
                      <span className="text-xs text-slate-500 dark:text-slate-400">سؤال نموذجي من هذا الفصل</span>
                    )}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-5 border border-blue-100 dark:border-blue-800">
                  {modelQuestion.text && (
                    <p className="text-[#1e293b] dark:text-slate-200 leading-relaxed text-sm font-medium">{modelQuestion.text}</p>
                  )}
                  {modelQuestion.imageUrl && (
                    <img src={modelQuestion.imageUrl} alt="question" className="max-h-48 rounded-lg mt-3 border border-slate-200 dark:border-slate-600" />
                  )}
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${typeBadgeClass(modelQuestion.questionType)}`}>
                      {modelQuestion.questionType}
                    </span>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${diffBadgeClass(modelQuestion.difficulty)}`}>
                      {modelQuestion.difficulty}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      {modelQuestion.year} - {modelQuestion.examType}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Questions List */}
            <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm mb-8 overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700">
                <h3 className="font-bold text-[#0f172a] dark:text-white text-lg">جميع الأسئلة في هذا الفصل</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">{questions.length} سؤال</p>
              </div>
              <div className="divide-y divide-slate-50 dark:divide-slate-700/50">
                {questions.map((q, i) => (
                  <div key={q.id} className="px-6 py-5">
                    <div className="flex items-start gap-3">
                      <span className="w-7 h-7 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-xs font-bold text-slate-500 dark:text-slate-400 flex-shrink-0 mt-0.5">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        {q.text && <p className="text-[#1e293b] dark:text-slate-200 text-sm leading-relaxed mb-3">{q.text}</p>}
                        {q.imageUrl && <img src={q.imageUrl} alt="question" className="max-h-40 rounded-lg border border-slate-200 dark:border-slate-600 mb-3 object-contain" />}
                        <div className="flex flex-wrap gap-2">
                          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${typeBadgeClass(q.questionType)}`}>{q.questionType}</span>
                          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${diffBadgeClass(q.difficulty)}`}>{q.difficulty}</span>
                          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">{q.year} - {q.examType}</span>
                          {q.topic && <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 font-medium">{q.topic}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Source Links */}
            <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center shadow-sm">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-bold text-[#0f172a] dark:text-white text-lg">مصادر لشرح هذا الفصل 📚</h3>
              </div>
              {sourceLinks.length === 0 ? (
                <div className="text-center py-8 text-slate-400 dark:text-slate-500">
                  <p className="text-sm">لا توجد مصادر حالياً. ساهم بإضافة رابط مفيد عند إدخال سؤال جديد! 💡</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-3">
                  {sourceLinks.map((src, i) => (
                    <div key={i} className={`flex items-center gap-3 p-4 rounded-xl border ${getLinkColor(src.link)}`}>
                      <span className="text-2xl">{getLinkIcon(src.link)}</span>
                      <div className="flex-1 min-w-0">
                        {src.topic && <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5 font-medium">{src.topic}</p>}
                        <p className="text-xs text-slate-600 dark:text-slate-400 truncate font-medium" dir="ltr">{src.link}</p>
                      </div>
                      <a href={src.link} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 bg-gradient-to-r from-[#3b82f6] to-[#6366f1] text-white text-xs font-semibold px-3 py-1.5 rounded-full hover:shadow-md transition-all whitespace-nowrap">
                        فتح المصدر
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
