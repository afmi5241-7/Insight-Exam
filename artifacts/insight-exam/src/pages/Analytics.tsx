import { Link, useParams } from "wouter";
import {
  useGetCourse,
  useGetCourseAnalytics,
} from "@workspace/api-client-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from "recharts";
import { BookOpen, Target, HelpCircle, TrendingUp, PlusCircle, ChevronRight, Lightbulb } from "lucide-react";

const typeLabel: Record<string, string> = {
  multiple_choice: "اختيار من متعدد",
  true_false: "صح وخطأ",
  essay: "مقالي",
  fill_blank: "أكمل الفراغ",
};
const diffLabel: Record<string, string> = {
  easy: "سهل",
  medium: "متوسط",
  hard: "صعب",
};

const CHART_COLORS = ["#2563EB", "#22C55E", "#F59E0B", "#8B5CF6", "#EF4444", "#06B6D4"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-lg text-sm">
        <p className="font-medium text-slate-800 mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} className="text-slate-600">
            <span style={{ color: p.color }}>{p.name}:</span> {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  const params = useParams<{ id: string }>();
  const courseId = parseInt(params.id);

  const { data: course, isLoading: courseLoading } = useGetCourse(courseId, {
    query: { enabled: !!courseId },
  });
  const { data: analytics, isLoading: analyticsLoading } = useGetCourseAnalytics(courseId, {
    query: { enabled: !!courseId },
  });

  const isLoading = courseLoading || analyticsLoading;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link href="/dashboard" className="hover:text-blue-600 transition-colors">لوحة التحكم</Link>
          <ChevronRight className="h-4 w-4 rotate-180" />
          <span className="text-slate-800">{course?.name ?? "تحليلات المقرر"}</span>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            {isLoading ? (
              <div className="space-y-2">
                <div className="h-7 bg-slate-200 rounded w-48 animate-pulse" />
                <div className="h-4 bg-slate-100 rounded w-36 animate-pulse" />
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-slate-800">{course?.name}</h1>
                <p className="text-slate-500 text-sm mt-1">
                  {course?.code} · د. {course?.professor}
                </p>
              </>
            )}
          </div>
          <Link
            href={`/courses/${courseId}/questions`}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors w-fit"
          >
            <PlusCircle className="h-4 w-4" />
            إضافة أسئلة
          </Link>
        </div>

        {isLoading ? (
          <LoadingSkeleton />
        ) : analytics && analytics.totalQuestions > 0 ? (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <SummaryCard
                label="إجمالي الأسئلة"
                value={analytics.totalQuestions.toString()}
                icon={<BookOpen className="h-5 w-5 text-blue-600" />}
                bgColor="bg-blue-50"
              />
              <SummaryCard
                label="الموضوع الأكثر تكراراً"
                value={analytics.mostRepeatedChapter.split(':')[0] ?? analytics.mostRepeatedChapter}
                icon={<Target className="h-5 w-5 text-green-600" />}
                bgColor="bg-green-50"
                small
              />
              <SummaryCard
                label="نوع السؤال الأكثر شيوعاً"
                value={typeLabel[analytics.mostCommonType] ?? analytics.mostCommonType}
                icon={<HelpCircle className="h-5 w-5 text-purple-600" />}
                bgColor="bg-purple-50"
                small
              />
              <SummaryCard
                label="مستوى الصعوبة الغالب"
                value={diffLabel[analytics.dominantDifficulty] ?? analytics.dominantDifficulty}
                icon={<TrendingUp className="h-5 w-5 text-orange-600" />}
                bgColor="bg-orange-50"
                small
              />
            </div>

            {/* Charts Row 1 */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Chapter Frequency */}
              <ChartCard title="الموضوعات الأكثر تكراراً">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={analytics.chapterFrequency} layout="vertical" margin={{ right: 20, left: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis
                      dataKey="chapter"
                      type="category"
                      width={110}
                      tick={{ fontSize: 10 }}
                      tickFormatter={(v: string) => v.length > 15 ? v.slice(0, 15) + "..." : v}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" name="عدد الأسئلة" fill="#2563EB" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              {/* Question Type Distribution */}
              <ChartCard title="توزيع أنواع الأسئلة">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={analytics.typeDistribution.map(t => ({
                        ...t,
                        name: typeLabel[t.questionType] ?? t.questionType,
                      }))}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label={({ name, percentage }) => `${name} (${percentage}%)`}
                      labelLine={false}
                    >
                      {analytics.typeDistribution.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [value, name]} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            {/* Charts Row 2 */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Difficulty Distribution */}
              <ChartCard title="توزيع مستوى الصعوبة">
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart
                    data={analytics.difficultyDistribution.map(d => ({
                      ...d,
                      name: diffLabel[d.difficulty] ?? d.difficulty,
                    }))}
                    margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" name="عدد الأسئلة" radius={[4, 4, 0, 0]}>
                      {analytics.difficultyDistribution.map((d, i) => (
                        <Cell
                          key={i}
                          fill={d.difficulty === "easy" ? "#22C55E" : d.difficulty === "medium" ? "#F59E0B" : "#EF4444"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              {/* Yearly Frequency */}
              <ChartCard title="تكرار الأسئلة حسب السنة / الفصل">
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart
                    data={analytics.yearlyFrequency}
                    margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis
                      dataKey="examPeriod"
                      tick={{ fontSize: 9 }}
                      tickFormatter={(v: string) => v.length > 12 ? v.slice(0, 12) + ".." : v}
                    />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" name="عدد الأسئلة" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            {/* Smart Recommendations */}
            {analytics.recommendations.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-yellow-50 rounded-lg flex items-center justify-center">
                    <Lightbulb className="h-5 w-5 text-yellow-600" />
                  </div>
                  <h2 className="font-bold text-slate-800 text-lg">توصيات المراجعة</h2>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  {analytics.recommendations.map((rec, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100"
                    >
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <p className="text-slate-700 text-sm leading-relaxed">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <EmptyState courseId={courseId} />
        )}
      </main>
      <Footer />
    </div>
  );
}

function SummaryCard({ label, value, icon, bgColor, small }: {
  label: string;
  value: string;
  icon: React.ReactNode;
  bgColor: string;
  small?: boolean;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-3">
      <div className={`w-11 h-11 ${bgColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
      <div className="min-w-0">
        {small ? (
          <p className="font-bold text-slate-800 text-sm leading-tight truncate">{value}</p>
        ) : (
          <p className="text-3xl font-black text-slate-800">{value}</p>
        )}
        <p className="text-slate-500 text-xs mt-0.5 leading-tight">{label}</p>
      </div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <h3 className="font-bold text-slate-800 mb-4 text-sm">{title}</h3>
      {children}
    </div>
  );
}

function EmptyState({ courseId }: { courseId: number }) {
  return (
    <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-16 text-center">
      <TrendingUp className="h-16 w-16 text-slate-200 mx-auto mb-4" />
      <h3 className="font-bold text-slate-600 mb-2 text-xl">لا توجد بيانات للتحليل</h3>
      <p className="text-slate-400 text-sm mb-6">أضف أسئلة الاختبارات السابقة لرؤية التحليلات والتوصيات</p>
      <Link
        href={`/courses/${courseId}/questions`}
        className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
      >
        <PlusCircle className="h-4 w-4" />
        إضافة أسئلة الآن
      </Link>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 h-20" />
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {[1, 2].map(i => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 h-80" />
        ))}
      </div>
    </div>
  );
}
