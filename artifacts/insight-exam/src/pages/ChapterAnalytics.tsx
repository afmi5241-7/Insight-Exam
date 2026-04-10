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
    <div className={`rounded-xl px-4 py-3 shadow-xl text-sm border ${dark ? "bg-[#0f2240] border-[#1a3a6a]/60 text-slate-200" : "bg-white border-slate-100 text-slate-800"}`}>
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((p: any, i: number) => <p key={i} style={{ color: p.color }}>{p.name}: {p.value}</p>)}
    </div>
  );
}

function typeBadgeClass(type: string) {
  const map: Record<string, string> = {
    "اختيار من متعدد": "bg-[#f0f6ff] dark:bg-[#0a1e3d] text-[#2d6cc0] dark:text-[#4a9eed]",
    "صح وخطأ": "bg-[#e8f0fb] dark:bg-[#0f2240] text-[#1a4b8c] dark:text-[#7ec8f0]",
    "أكمل الفراغ": "bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300",
    "إجابة قصيرة": "bg-[#f0f6ff] dark:bg-[#0a1628] text-[#2d6cc0] dark:text-[#4a9eed]",
    "إجابة طويلة": "bg-[#e0eeff] dark:bg-[#0f2240] text-[#1a4b8c] dark:text-[#7ec8f0]",
    "مسائل رياضية / حسابية": "bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300",
  };
  return map[type] ?? "bg-slate-100 dark:bg-[#0f2240] text-slate-600 dark:text-slate-300";
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

function getLinkBorder(link: string) {
  if (link.includes("youtube.com") || link.includes("youtu.be")) return "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10";
  if (link.includes("t.me") || link.includes("telegram")) return "border-[#4a9eed]/30 dark:border-[#2d6cc0]/40 bg-[#f0f6ff] dark:bg-[#0a1e3d]";
  return "border-slate-200 dark:border-[#1a3a6a]/40 bg-slate-50 dark:bg-[#0f2240]";
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

  const gridStroke = dark ? "#0f2240" : "#f0f6ff";
  const tickColor = dark ? "#94a3b8" : "#64748b";

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f0f6ff] dark:bg-[#0a1628] transition-colors duration-300">
        <Navbar />
        <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-10">
          <div className="space-y-6 animate-pulse">
            {[1,2,3].map(i => <div key={i} className="bg-white dark:bg-[#0f2240] rounded-2xl h-64 border border-slate-100 dark:border-[#1a3a6a]/40" />)}
          </div>
        </main>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f0f6ff] dark:bg-[#0a1628] transition-colors duration-300">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <p className="text-red-500 dark:text-red-400 mb-4">{error || "الفصل غير موجود"}</p>
            <Link href={`/analytics/${courseId}`} className="text-[#2d6cc0] hover:underline text-sm">← العودة للمقرر</Link>
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
    <div className="min-h-screen flex flex-col bg-[#f0f6ff] dark:bg-[#0a1628] transition-colors duration-300">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-10">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-400 dark:text-slate-500 mb-8 flex-wrap">
          <Link href="/analytics" className="hover:text-[#2d6cc0] transition-colors font-medium">التحليلات</Link>
          <ChevronRight className="h-4 w-4 rotate-180" />
          <Link href={`/analytics/${courseId}`} className="hover:text-[#2d6cc0] transition-colors font-medium truncate max-w-[140px]">{course.name}</Link>
          <ChevronRight className="h-4 w-4 rotate-180" />
          <span className="text-[#0f2240] dark:text-slate-200 font-medium">{chapter}</span>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-[#2d6cc0] bg-[#f0f6ff] dark:bg-[#0f2240] px-3 py-1 rounded-full border border-[#d0e4f8] dark:border-[#1a3a6a]/40">{course.name}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0f2240] dark:text-white">{chapter}</h1>
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
          <div className="bg-white dark:bg-[#0f2240] rounded-2xl border-2 border-dashed border-slate-200 dark:border-[#1a3a6a]/40 p-16 text-center">
            <AlertCircle className="h-12 w-12 text-slate-300 dark:text-[#1a3a6a] mx-auto mb-4" />
            <p className="font-bold text-slate-600 dark:text-slate-300 mb-2">لا توجد أسئلة محلَّلة لهذا الفصل بعد</p>
            <Link href="/submit" className="inline-flex items-center gap-2 mt-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:shadow-lg transition-all">
              <PlusCircle className="h-4 w-4" />أضف أسئلة الآن
            </Link>
          </div>
        ) : (
          <>
            {/* Charts Row */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Donut */}
              <div className="bg-white dark:bg-[#0f2240] rounded-2xl border border-slate-100 dark:border-[#1a3a6a]/40 shadow-sm p-6">
                <h3 className="font-bold text-[#0f2240] dark:text-white mb-5 text-sm">مستوى صعوبة الأسئلة في هذا الفصل</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={donutData}
                      dataKey="value" nameKey="name"
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

              {/* Frequency Bar */}
              <div className="bg-white dark:bg-[#0f2240] rounded-2xl border border-slate-100 dark:border-[#1a3a6a]/40 shadow-sm p-6">
                <h3 className="font-bold text-[#0f2240] dark:text-white mb-5 text-sm">تكرار ظهور هذا الفصل في الاختبارات عبر السنوات</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={frequencyByPeriod} margin={{ top: 5, right: 20, bottom: 30, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                    <XAxis dataKey="period" tick={{ fontSize: 9, fill: tickColor }} angle={-35} textAnchor="end" interval={0} />
                    <YAxis tick={{ fontSize: 11, fill: tickColor }} allowDecimals={false} />
                    <Tooltip content={<CustomTooltip dark={dark} />} />
                    <Bar dataKey="count" name="عدد الأسئلة" radius={[6, 6, 0, 0]}>
                      {frequencyByPeriod.map((_, i) => {
                        const blues = ["#1a4b8c","#2d6cc0","#4a9eed","#7ec8f0"];
                        return <Cell key={i} fill={blues[i % blues.length]} />;
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Model Question */}
            {modelQuestion && (
              <div className="bg-white dark:bg-[#0f2240] rounded-2xl border-2 border-[#2d6cc0]/25 dark:border-[#2d6cc0]/30 shadow-lg shadow-[#2d6cc0]/5 p-7 mb-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-sm">
                    <Star className="h-5 w-5 text-white fill-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0f2240] dark:text-white text-lg">السؤال النموذجي ⭐️</h3>
                    {modelQuestionType === "repeated" && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2.5 py-0.5 rounded-full mt-0.5">
                        <Repeat2 className="h-3 w-3" />
                        سؤال متكرر — يُنصح بالتركيز عليه 🔥 ({repeatCount} مرة)
                      </span>
                    )}
                    {modelQuestionType === "common_topic" && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#2d6cc0] dark:text-[#4a9eed] bg-[#f0f6ff] dark:bg-[#0a1628] px-2.5 py-0.5 rounded-full mt-0.5">
                        <Lightbulb className="h-3 w-3" />
                        من الموضوع الأكثر تكراراً
                      </span>
                    )}
                    {modelQuestionType === "random" && (
                      <span className="text-xs text-slate-500 dark:text-slate-400">سؤال نموذجي من هذا الفصل</span>
                    )}
                  </div>
                </div>
                <div className="bg-[#f0f6ff] dark:bg-[#0a1628] rounded-xl p-5 border border-[#d0e4f8] dark:border-[#1a3a6a]/40">
                  {modelQuestion.text && (
                    <p className="text-[#0f2240] dark:text-slate-200 leading-relaxed text-sm font-medium">{modelQuestion.text}</p>
                  )}
                  {modelQuestion.imageUrl && (
                    <img src={modelQuestion.imageUrl} alt="question" className="max-h-48 rounded-lg mt-3 border border-slate-200 dark:border-[#1a3a6a]/40" />
                  )}
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${typeBadgeClass(modelQuestion.questionType)}`}>
                      {modelQuestion.questionType}
                    </span>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${diffBadgeClass(modelQuestion.difficulty)}`}>
                      {modelQuestion.difficulty}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-[#0f2240] text-slate-600 dark:text-slate-300">
                      {modelQuestion.year} - {modelQuestion.examType}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Questions List */}
            <div className="bg-white dark:bg-[#0f2240] rounded-2xl border border-slate-100 dark:border-[#1a3a6a]/40 shadow-sm mb-8 overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 dark:border-[#1a3a6a]/40">
                <h3 className="font-bold text-[#0f2240] dark:text-white text-lg">جميع الأسئلة في هذا الفصل</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">{questions.length} سؤال</p>
              </div>
              <div className="divide-y divide-slate-50 dark:divide-[#1a3a6a]/20">
                {questions.map((q, i) => (
                  <div key={q.id} className="px-6 py-5">
                    <div className="flex items-start gap-3">
                      <span className="w-7 h-7 bg-[#f0f6ff] dark:bg-[#0a1628] rounded-full flex items-center justify-center text-xs font-bold text-[#2d6cc0] dark:text-[#4a9eed] flex-shrink-0 mt-0.5">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        {q.text && <p className="text-[#0f2240] dark:text-slate-200 text-sm leading-relaxed mb-3">{q.text}</p>}
                        {q.imageUrl && <img src={q.imageUrl} alt="question" className="max-h-40 rounded-lg border border-slate-200 dark:border-[#1a3a6a]/40 mb-3 object-contain" />}
                        <div className="flex flex-wrap gap-2">
                          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${typeBadgeClass(q.questionType)}`}>{q.questionType}</span>
                          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${diffBadgeClass(q.difficulty)}`}>{q.difficulty}</span>
                          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-[#0a1628] text-slate-500 dark:text-slate-400">{q.year} - {q.examType}</span>
                          {q.topic && <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#f0f6ff] dark:bg-[#0a1e3d] text-[#2d6cc0] dark:text-[#4a9eed] font-medium">{q.topic}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Source Links */}
            <div className="bg-white dark:bg-[#0f2240] rounded-2xl border border-slate-100 dark:border-[#1a3a6a]/40 shadow-sm p-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center shadow-sm">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-bold text-[#0f2240] dark:text-white text-lg">مصادر لشرح هذا الفصل 📚</h3>
              </div>
              {sourceLinks.length === 0 ? (
                <div className="text-center py-8 text-slate-400 dark:text-slate-500">
                  <p className="text-sm">لا توجد مصادر حالياً. ساهم بإضافة رابط مفيد عند إدخال سؤال جديد! 💡</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-3">
                  {sourceLinks.map((src, i) => (
                    <div key={i} className={`flex items-center gap-3 p-4 rounded-xl border ${getLinkBorder(src.link)}`}>
                      <span className="text-2xl">{getLinkIcon(src.link)}</span>
                      <div className="flex-1 min-w-0">
                        {src.topic && <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5 font-medium">{src.topic}</p>}
                        <p className="text-xs text-slate-600 dark:text-slate-400 truncate font-medium" dir="ltr">{src.link}</p>
                      </div>
                      <a href={src.link} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 bg-gradient-to-r from-[#2d6cc0] to-[#4a9eed] text-white text-xs font-semibold px-3 py-1.5 rounded-full hover:shadow-md transition-all whitespace-nowrap">
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
