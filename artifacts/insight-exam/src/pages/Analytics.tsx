import { Link, useParams } from "wouter";
import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LabelList,
} from "recharts";
import {
  BookOpen, Target, HelpCircle, TrendingUp, PlusCircle, ChevronRight,
  Lightbulb, ExternalLink, ChevronLeft,
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

const CHART_COLORS = ["#1a4b8c", "#2d6cc0", "#4a9eed", "#7ec8f0", "#22C55E", "#F59E0B", "#EF4444", "#a855f7", "#ec4899"];

// Distinct blue shade per bar — interpolated from dark to light blue.
function blueShade(index: number, total: number): string {
  if (total <= 1) return "#1d4ed8";
  const t = index / (total - 1);
  const r = Math.round(29 + (126 - 29) * t);
  const g = Math.round(78 + (200 - 78) * t);
  const b = Math.round(216 + (240 - 216) * t);
  return `rgb(${r}, ${g}, ${b})`;
}

function buildSubmitHref(course: { faculty: string; department: string; name: string }) {
  const qs = new URLSearchParams({
    faculty: course.faculty,
    department: course.department,
    courseName: course.name,
  }).toString();
  return `/submit?${qs}`;
}

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
  chapterDifficultyBreakdown: { chapter: string; easy: number; medium: number; hard: number; total: number }[];
  sourceLinks: { link: string; chapter: string; topic?: string }[];
  recommendations: string[];
}

function CustomTooltip({ active, payload, label, dark }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className={`rounded-xl px-4 py-3 shadow-xl text-sm border ${dark ? "bg-[#0f2240] border-[#1a3a6a]/60 text-slate-200" : "bg-white border-slate-100 text-slate-800"}`}>
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((p: any, i: number) => {
        const pct = p.payload?.percentage;
        return (
          <p key={i} style={{ color: p.color }}>
            {p.name}: {p.value}{pct !== undefined ? ` (${pct}%)` : ""}
          </p>
        );
      })}
    </div>
  );
}

function diffBadgeClass(diff: string) {
  if (diff === "سهل" || diff === "easy") return "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400";
  if (diff === "صعب" || diff === "hard") return "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400";
  return "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400";
}

const STAGES = [
  { id: 1, emoji: "🔍", label: "التشخيص", sub: "اكتشف الفصول والمواضيع الأكثر أهمية" },
  { id: 2, emoji: "📋", label: "السياق", sub: "تعرّف على نمط الأسئلة والأسئلة النموذجية" },
  { id: 3, emoji: "📚", label: "المعالجة", sub: "ابدأ مراجعتك بالمصادر المناسبة" },
];

function StageStepper({ stage, setStage }: { stage: number; setStage: (s: number) => void }) {
  return (
    <div className="bg-white dark:bg-[#0f2240] rounded-2xl border border-slate-100 dark:border-[#1a3a6a]/40 shadow-sm p-5 mb-8">
      <div className="flex items-center justify-between gap-2">
        {STAGES.map((s, i) => (
          <div key={s.id} className="flex items-center flex-1 min-w-0">
            <button
              onClick={() => setStage(s.id)}
              className={`flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 rounded-xl flex-1 text-center sm:text-right transition-all duration-200 ${
                stage === s.id
                  ? "bg-gradient-to-r from-[#2d6cc0] to-[#4a9eed] text-white shadow-md shadow-[#2d6cc0]/25"
                  : "hover:bg-[#f0f6ff] dark:hover:bg-[#0a1628] text-slate-500 dark:text-slate-400"
              }`}
            >
              <span className="text-xl flex-shrink-0">{s.emoji}</span>
              <div className="min-w-0">
                <p className={`font-bold text-sm leading-tight ${stage === s.id ? "text-white" : "text-[#0f2240] dark:text-slate-200"}`}>
                  {s.label}
                </p>
                <p className={`text-xs mt-0.5 leading-tight hidden sm:block truncate ${stage === s.id ? "text-white/80" : "text-slate-400 dark:text-slate-500"}`}>
                  {s.sub}
                </p>
              </div>
            </button>
            {i < STAGES.length - 1 && (
              <ChevronLeft className="h-4 w-4 text-slate-300 dark:text-[#1a3a6a] mx-1 flex-shrink-0 rotate-180" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Analytics() {
  const params = useParams<{ id: string }>();
  const courseId = parseInt(params.id);
  const { dark } = useDarkMode();
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stage, setStage] = useState(1);

  useEffect(() => {
    if (isNaN(courseId)) { setError("معرف غير صالح"); setLoading(false); return; }
    fetch(`${BASE}/api/courses/${courseId}/analytics`, { credentials: "include" })
      .then(r => r.ok ? r.json() : r.json().then(d => Promise.reject(d.error)))
      .then(setData)
      .catch(e => setError(typeof e === "string" ? e : "تعذّر تحميل التحليلات"))
      .finally(() => setLoading(false));
  }, [courseId]);

  const gridStroke = dark ? "#0f2240" : "#f0f6ff";
  const tickColor = dark ? "#94a3b8" : "#64748b";

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f0f6ff] dark:bg-[#0a1628] transition-colors duration-300">
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-10"><LoadingSkeleton /></main>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f0f6ff] dark:bg-[#0a1628] transition-colors duration-300">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <p className="text-red-500 dark:text-red-400 mb-4">{error || "مقرر غير موجود"}</p>
            <Link href="/analytics" className="text-[#2d6cc0] hover:underline text-sm">← العودة للبحث</Link>
          </div>
        </main>
      </div>
    );
  }

  const {
    course, totalQuestions, chaptersCovered, mostCommonType, dominantDifficulty,
    finalsChapterFrequency, midtermsChapterFrequency, typeDistribution,
    difficultyDistribution, chaptersOverview, chapterDifficultyBreakdown,
    sourceLinks, recommendations,
  } = data;

  const submitHref = buildSubmitHref(course);

  const finalsData = finalsChapterFrequency.map(c => ({ ...c, labelText: `${c.count} (${c.percentage}%)` }));
  const midtermsData = midtermsChapterFrequency.map(c => ({ ...c, labelText: `${c.count} (${c.percentage}%)` }));
  const difficultyData = difficultyDistribution.map(d => ({ ...d, name: d.label, labelText: `${d.count} (${d.percentage}%)` }));
  const breakdownData = (chapterDifficultyBreakdown ?? []).map(c => ({
    ...c,
    easyPct: c.total ? Math.round((c.easy / c.total) * 100) : 0,
    mediumPct: c.total ? Math.round((c.medium / c.total) * 100) : 0,
    hardPct: c.total ? Math.round((c.hard / c.total) * 100) : 0,
  }));

  const sourcesByChapter = sourceLinks.reduce<Record<string, { link: string; topic?: string }[]>>((acc, src) => {
    if (!acc[src.chapter]) acc[src.chapter] = [];
    acc[src.chapter].push({ link: src.link, topic: src.topic });
    return acc;
  }, {});

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f6ff] dark:bg-[#0a1628] transition-colors duration-300">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-400 dark:text-slate-500 mb-8">
          <Link href="/analytics" className="hover:text-[#2d6cc0] transition-colors font-medium">التحليلات</Link>
          <ChevronRight className="h-4 w-4 rotate-180" />
          <span className="text-[#0f2240] dark:text-slate-200 font-medium truncate">{course.name}</span>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0f2240] dark:text-white">{course.name}</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5">{course.faculty} · {course.department}</p>
          </div>
          <Link
            href={submitHref}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:shadow-lg hover:shadow-green-500/25 hover:-translate-y-0.5 transition-all duration-200 w-fit"
          >
            <PlusCircle className="h-4 w-4" />
            أضف سؤالاً
          </Link>
        </div>

        {totalQuestions === 0 ? (
          <EmptyState submitHref={submitHref} />
        ) : (
          <>
            {/* Stage Stepper */}
            <StageStepper stage={stage} setStage={setStage} />

            {/* Summary Cards — always visible */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <SummaryCard label="إجمالي الأسئلة" value={totalQuestions.toString()} icon={<BookOpen className="h-5 w-5 text-white" />} gradient="from-[#1a4b8c] to-[#2d6cc0]" />
              <SummaryCard label="عدد الفصول المغطاة" value={chaptersCovered.toString()} icon={<Target className="h-5 w-5 text-white" />} gradient="from-emerald-500 to-green-500" />
              <SummaryCard label="نوع السؤال الأكثر شيوعاً" value={mostCommonType} icon={<HelpCircle className="h-5 w-5 text-white" />} gradient="from-[#2d6cc0] to-[#4a9eed]" small />
              <SummaryCard label="مستوى الصعوبة الغالب" value={dominantDifficulty} icon={<TrendingUp className="h-5 w-5 text-white" />} gradient="from-orange-500 to-amber-500" small />
            </div>

            {/* ── Stage 1: التشخيص ── */}
            {stage === 1 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                {finalsData.length > 0 && (
                  <ChartCard title="تكرار الفصول في اختبارات الفاينل 📋">
                    <ResponsiveContainer width="100%" height={Math.max(260, finalsData.length * 56)}>
                      <BarChart data={finalsData} layout="vertical" margin={{ top: 8, right: 90, left: 8, bottom: 8 }} barCategoryGap="28%">
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridStroke} />
                        <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: tickColor }} />
                        <YAxis dataKey="chapter" type="category" width={170} tick={{ fontSize: 12, fill: tickColor }} interval={0} />
                        <Tooltip content={<CustomTooltip dark={dark} />} cursor={{ fill: dark ? "rgba(74,158,237,0.08)" : "rgba(45,108,192,0.06)" }} />
                        <Bar dataKey="count" name="عدد الأسئلة" radius={[0, 8, 8, 0]}>
                          {finalsData.map((_, i) => (
                            <Cell key={i} fill={blueShade(i, finalsData.length)} />
                          ))}
                          <LabelList dataKey="labelText" position="right" style={{ fontSize: 12, fontWeight: 600 }} fill={tickColor} />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartCard>
                )}

                {midtermsData.length > 0 && (
                  <ChartCard title="تكرار الفصول في اختبارات الميد 📝">
                    <ResponsiveContainer width="100%" height={Math.max(260, midtermsData.length * 56)}>
                      <BarChart data={midtermsData} layout="vertical" margin={{ top: 8, right: 90, left: 8, bottom: 8 }} barCategoryGap="28%">
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridStroke} />
                        <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: tickColor }} />
                        <YAxis dataKey="chapter" type="category" width={170} tick={{ fontSize: 12, fill: tickColor }} interval={0} />
                        <Tooltip content={<CustomTooltip dark={dark} />} cursor={{ fill: dark ? "rgba(74,158,237,0.08)" : "rgba(45,108,192,0.06)" }} />
                        <Bar dataKey="count" name="عدد الأسئلة" radius={[0, 8, 8, 0]}>
                          {midtermsData.map((_, i) => (
                            <Cell key={i} fill={blueShade(i, midtermsData.length)} />
                          ))}
                          <LabelList dataKey="labelText" position="right" style={{ fontSize: 12, fontWeight: 600 }} fill={tickColor} />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartCard>
                )}

                {difficultyData.length > 0 && (
                  <ChartCard title="توزيع مستوى الصعوبة">
                    <ResponsiveContainer width="100%" height={260}>
                      <BarChart data={difficultyData} margin={{ top: 28, right: 20, bottom: 8, left: 0 }} barCategoryGap="32%">
                        <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                        <XAxis dataKey="name" tick={{ fontSize: 13, fontWeight: 600, fill: tickColor }} />
                        <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: tickColor }} />
                        <Tooltip content={<CustomTooltip dark={dark} />} cursor={{ fill: dark ? "rgba(74,158,237,0.08)" : "rgba(45,108,192,0.06)" }} />
                        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                        <Bar dataKey="count" name="عدد الأسئلة" radius={[8, 8, 0, 0]}>
                          {difficultyData.map((d, i) => (
                            <Cell key={i} fill={diffColors[d.difficulty] ?? "#2d6cc0"} />
                          ))}
                          <LabelList dataKey="labelText" position="top" style={{ fontSize: 12, fontWeight: 600 }} fill={tickColor} />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartCard>
                )}

                {breakdownData.length > 0 && (
                  <ChartCard title="مستوى صعوبة الأسئلة في كل فصل">
                    <ResponsiveContainer width="100%" height={Math.max(280, breakdownData.length * 56)}>
                      <BarChart data={breakdownData} layout="vertical" margin={{ top: 8, right: 30, left: 8, bottom: 8 }} barCategoryGap="28%">
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridStroke} />
                        <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: tickColor }} />
                        <YAxis dataKey="chapter" type="category" width={170} tick={{ fontSize: 12, fill: tickColor }} interval={0} />
                        <Tooltip
                          contentStyle={{ borderRadius: 12, border: dark ? "1px solid rgba(26,58,106,0.6)" : "1px solid #f0f6ff", background: dark ? "#0f2240" : "#fff", color: dark ? "#e2e8f0" : "#1e293b" }}
                          formatter={(v: any, name: any, props: any) => {
                            const total = props?.payload?.total ?? 0;
                            const pct = total ? Math.round((v / total) * 100) : 0;
                            return [`${v} (${pct}%)`, name];
                          }}
                        />
                        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                        <Bar dataKey="easy" name="سهل" stackId="diff" fill={diffColors["سهل"]} radius={[0, 0, 0, 0]}>
                          <LabelList dataKey="easy" position="center" style={{ fontSize: 11, fontWeight: 700, fill: "#fff" }} formatter={(v: any) => (v && v > 0 ? v : "")} />
                        </Bar>
                        <Bar dataKey="medium" name="متوسط" stackId="diff" fill={diffColors["متوسط"]} radius={[0, 0, 0, 0]}>
                          <LabelList dataKey="medium" position="center" style={{ fontSize: 11, fontWeight: 700, fill: "#fff" }} formatter={(v: any) => (v && v > 0 ? v : "")} />
                        </Bar>
                        <Bar dataKey="hard" name="صعب" stackId="diff" fill={diffColors["صعب"]} radius={[0, 8, 8, 0]}>
                          <LabelList dataKey="hard" position="center" style={{ fontSize: 11, fontWeight: 700, fill: "#fff" }} formatter={(v: any) => (v && v > 0 ? v : "")} />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartCard>
                )}

                {chaptersOverview.length > 0 && (
                  <div className="bg-white dark:bg-[#0f2240] rounded-2xl border border-slate-100 dark:border-[#1a3a6a]/40 shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-100 dark:border-[#1a3a6a]/40">
                      <h3 className="font-bold text-[#0f2240] dark:text-white text-lg">أهمية الفصول</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">مرتبة حسب تكرارها في الاختبارات</p>
                    </div>
                    <div className="divide-y divide-slate-50 dark:divide-[#1a3a6a]/20">
                      {chaptersOverview.map((ch) => (
                        <div key={ch.chapter} className="flex items-center gap-4 px-6 py-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className="font-semibold text-[#0f2240] dark:text-slate-200 text-sm">{ch.chapter}</span>
                              {ch.dominantDifficulty && (
                                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${diffBadgeClass(ch.dominantDifficulty)}`}>
                                  {ch.dominantDiffPct}% {ch.dominantDifficulty}
                                </span>
                              )}
                            </div>
                            <div className="mt-2 h-1.5 bg-slate-100 dark:bg-[#0a1628] rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-[#2d6cc0] to-[#4a9eed] rounded-full" style={{ width: `${ch.percentage}%` }} />
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="font-bold text-[#2d6cc0] text-sm">{ch.count} ({ch.percentage}%)</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── Stage 2: السياق ── */}
            {stage === 2 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                {typeDistribution.length > 0 && (
                  <ChartCard title="توزيع أنواع الأسئلة">
                    <ResponsiveContainer width="100%" height={360}>
                      <PieChart margin={{ top: 10, right: 60, bottom: 10, left: 60 }}>
                        <Pie
                          data={typeDistribution.map(t => ({ ...t, name: t.label }))}
                          dataKey="count" nameKey="name"
                          cx="50%" cy="50%" outerRadius={100}
                          label={({ name, value, payload }: any) => `${name}: ${value} (${payload?.percentage ?? 0}%)`}
                          labelLine={true}
                          minAngle={4}
                        >
                          {typeDistribution.map((_, i) => (
                            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ borderRadius: 12, border: dark ? "1px solid rgba(26,58,106,0.6)" : "1px solid #f0f6ff", background: dark ? "#0f2240" : "#fff", color: dark ? "#e2e8f0" : "#1e293b" }}
                          formatter={(v: any, n: any, props: any) => [`${v} (${props.payload?.percentage ?? 0}%)`, n]}
                        />
                        <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartCard>
                )}

                {chaptersOverview.length > 0 && (
                  <div className="bg-white dark:bg-[#0f2240] rounded-2xl border border-slate-100 dark:border-[#1a3a6a]/40 shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-100 dark:border-[#1a3a6a]/40">
                      <h3 className="font-bold text-[#0f2240] dark:text-white text-lg">الأسئلة النموذجية بالفصل</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">انقر على أي فصل لعرض أسئلته النموذجية والتفصيلية</p>
                    </div>
                    <div className="divide-y divide-slate-50 dark:divide-[#1a3a6a]/20">
                      {chaptersOverview.map((ch) => (
                        <div key={ch.chapter}>
                          <Link href={`/analytics/${courseId}/chapter/${encodeURIComponent(ch.chapter)}`}>
                            <div className="group flex items-center gap-4 px-6 py-4 hover:bg-[#f0f6ff] dark:hover:bg-[#0a1628]/50 transition-colors cursor-pointer">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 flex-wrap">
                                  <span className="font-semibold text-[#0f2240] dark:text-slate-200 text-sm">{ch.chapter}</span>
                                  {ch.dominantDifficulty && (
                                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${diffBadgeClass(ch.dominantDifficulty)}`}>
                                      {ch.dominantDiffPct}% {ch.dominantDifficulty}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-4 flex-shrink-0">
                                <div className="text-right">
                                  <p className="font-bold text-[#2d6cc0] text-sm">{ch.count} سؤال ({ch.percentage}%)</p>
                                </div>
                                <ChevronLeft className="h-4 w-4 text-slate-300 dark:text-[#1a3a6a] group-hover:text-[#2d6cc0] transition-colors" />
                              </div>
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {recommendations.length > 0 && (
                  <div className="bg-white dark:bg-[#0f2240] rounded-2xl border border-slate-100 dark:border-[#1a3a6a]/40 shadow-sm p-7">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-sm">
                        <Lightbulb className="h-5 w-5 text-white" />
                      </div>
                      <h2 className="font-bold text-[#0f2240] dark:text-white text-lg">توصيات المراجعة</h2>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {recommendations.map((rec, i) => (
                        <div key={i} className="flex items-start gap-3 p-4 bg-[#f0f6ff] dark:bg-[#0a1628] rounded-xl border border-[#d0e4f8] dark:border-[#1a3a6a]/40">
                          <div className="w-6 h-6 bg-gradient-to-br from-[#2d6cc0] to-[#4a9eed] text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</div>
                          <p className="text-[#0f2240] dark:text-slate-300 text-sm leading-relaxed">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── Stage 3: المعالجة ── */}
            {stage === 3 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                {sourceLinks.length === 0 ? (
                  <div className="bg-white dark:bg-[#0f2240] rounded-2xl border-2 border-dashed border-slate-200 dark:border-[#1a3a6a]/40 p-16 text-center">
                    <div className="w-20 h-20 bg-[#f0f6ff] dark:bg-[#0a1628] rounded-full flex items-center justify-center mx-auto mb-5 text-4xl">📚</div>
                    <h3 className="font-bold text-[#0f2240] dark:text-slate-300 mb-2 text-lg">لا توجد مصادر حتى الآن</h3>
                    <p className="text-slate-400 dark:text-slate-500 text-sm mb-6 leading-relaxed">ساهم بإضافة روابط شرح مفيدة عند إدخال أسئلة جديدة</p>
                    <Link href={submitHref} className="inline-flex items-center gap-2 bg-gradient-to-r from-[#2d6cc0] to-[#4a9eed] text-white px-6 py-2.5 rounded-full font-semibold text-sm hover:shadow-lg transition-all">
                      <PlusCircle className="h-4 w-4" />أضف سؤالاً مع رابط
                    </Link>
                  </div>
                ) : Object.keys(sourcesByChapter).length > 0 ? (
                  Object.entries(sourcesByChapter).map(([chapterName, links]) => (
                    <div key={chapterName} className="bg-white dark:bg-[#0f2240] rounded-2xl border border-slate-100 dark:border-[#1a3a6a]/40 shadow-sm overflow-hidden">
                      <div className="px-6 py-4 border-b border-slate-100 dark:border-[#1a3a6a]/40 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-green-500 rounded-lg flex items-center justify-center shadow-sm">
                            <BookOpen className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <h3 className="font-bold text-[#0f2240] dark:text-white text-sm">{chapterName}</h3>
                            <p className="text-xs text-slate-400">{links.length} {links.length === 1 ? "مصدر" : "مصادر"}</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 grid sm:grid-cols-2 gap-3">
                        {links.map((src, i) => {
                          const isYT = src.link.includes("youtube.com") || src.link.includes("youtu.be");
                          const isTG = src.link.includes("t.me") || src.link.includes("telegram");
                          const icon = isYT ? "🎥" : isTG ? "✈️" : "🔗";
                          const border = isYT
                            ? "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10"
                            : isTG
                            ? "border-[#4a9eed]/30 dark:border-[#2d6cc0]/40 bg-[#f0f6ff] dark:bg-[#0a1e3d]"
                            : "border-slate-200 dark:border-[#1a3a6a]/40 bg-slate-50 dark:bg-[#0a1628]";
                          return (
                            <div key={i} className={`flex items-center gap-3 p-4 rounded-xl border ${border}`}>
                              <span className="text-2xl flex-shrink-0">{icon}</span>
                              <div className="flex-1 min-w-0">
                                {src.topic && <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5 font-medium">{src.topic}</p>}
                                <p className="text-xs text-slate-600 dark:text-slate-400 truncate font-medium" dir="ltr">{src.link}</p>
                              </div>
                              <a href={src.link} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 bg-gradient-to-r from-[#2d6cc0] to-[#4a9eed] text-white text-xs font-semibold px-3 py-1.5 rounded-full hover:shadow-md transition-all whitespace-nowrap">
                                فتح
                              </a>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white dark:bg-[#0f2240] rounded-2xl border border-slate-100 dark:border-[#1a3a6a]/40 shadow-sm p-7">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center shadow-sm">
                        <BookOpen className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h2 className="font-bold text-[#0f2240] dark:text-white text-lg">مصادر مفيدة 📚</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">شاركها زملاؤك</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {sourceLinks.map((src, i) => (
                        <div key={i} className="flex items-start gap-3 p-4 bg-[#f0f6ff] dark:bg-[#0a1628] rounded-xl border border-[#d0e4f8] dark:border-[#1a3a6a]/40">
                          <ExternalLink className="h-4 w-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 font-medium">{src.chapter}{src.topic ? ` · ${src.topic}` : ""}</p>
                            <a href={src.link} target="_blank" rel="noopener noreferrer" className="text-[#2d6cc0] dark:text-[#4a9eed] text-sm hover:underline break-all font-medium" dir="ltr">{src.link}</a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Navigation between stages */}
            <div className="flex justify-between mt-8">
              {stage > 1 ? (
                <button onClick={() => setStage(stage - 1)} className="flex items-center gap-2 text-sm font-semibold text-[#2d6cc0] dark:text-[#4a9eed] hover:gap-3 transition-all">
                  <ChevronRight className="h-4 w-4" />
                  {STAGES[stage - 2].emoji} {STAGES[stage - 2].label}
                </button>
              ) : <div />}
              {stage < 3 ? (
                <button onClick={() => setStage(stage + 1)} className="flex items-center gap-2 text-sm font-semibold text-[#2d6cc0] dark:text-[#4a9eed] hover:gap-3 transition-all">
                  {STAGES[stage].emoji} {STAGES[stage].label}
                  <ChevronLeft className="h-4 w-4" />
                </button>
              ) : <div />}
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

function SummaryCard({ label, value, icon, gradient, small }: { label: string; value: string; icon: React.ReactNode; gradient: string; small?: boolean }) {
  return (
    <div className="bg-white dark:bg-[#0f2240] rounded-2xl border border-slate-100 dark:border-[#1a3a6a]/40 p-5 flex items-center gap-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm`}>{icon}</div>
      <div className="min-w-0">
        {small
          ? <p className="font-bold text-[#0f2240] dark:text-white text-sm leading-tight truncate">{value || "—"}</p>
          : <p className="text-3xl font-black text-[#0f2240] dark:text-white">{value}</p>}
        <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5 leading-tight">{label}</p>
      </div>
    </div>
  );
}

function ChartCard({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white dark:bg-[#0f2240] rounded-2xl border border-slate-100 dark:border-[#1a3a6a]/40 shadow-sm p-6 transition-colors duration-300 ${className}`}>
      <h3 className="font-bold text-[#0f2240] dark:text-white mb-5 text-sm">{title}</h3>
      {children}
    </div>
  );
}

function EmptyState({ submitHref }: { submitHref: string }) {
  return (
    <div className="bg-white dark:bg-[#0f2240] rounded-2xl border-2 border-dashed border-slate-200 dark:border-[#1a3a6a]/40 p-20 text-center">
      <div className="w-24 h-24 bg-[#f0f6ff] dark:bg-[#0a1628] rounded-full flex items-center justify-center mx-auto mb-6">
        <TrendingUp className="h-12 w-12 text-slate-300 dark:text-[#1a3a6a]" />
      </div>
      <h3 className="font-bold text-[#0f2240] dark:text-slate-300 mb-3 text-xl">لا توجد بيانات للتحليل بعد</h3>
      <p className="text-slate-400 dark:text-slate-500 text-sm mb-8 leading-relaxed">الأسئلة المرفوعة قيد المراجعة — أو كن أول من يضيف أسئلة لهذا المقرر!</p>
      <Link href={submitHref} className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-7 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-green-500/25 hover:-translate-y-0.5 transition-all duration-200">
        <PlusCircle className="h-4 w-4" />أضف أسئلة الآن
      </Link>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <div key={i} className="bg-white dark:bg-[#0f2240] rounded-2xl border border-slate-100 dark:border-[#1a3a6a]/40 p-5 h-24" />)}
      </div>
      <div className="bg-white dark:bg-[#0f2240] rounded-2xl border border-slate-100 dark:border-[#1a3a6a]/40 p-6 h-16 rounded-2xl" />
      <div className="bg-white dark:bg-[#0f2240] rounded-2xl border border-slate-100 dark:border-[#1a3a6a]/40 p-6 h-64" />
      <div className="bg-white dark:bg-[#0f2240] rounded-2xl border border-slate-100 dark:border-[#1a3a6a]/40 p-6 h-64" />
    </div>
  );
}
