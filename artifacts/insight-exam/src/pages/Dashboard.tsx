import { Link, useLocation } from "wouter";
import { useGetCourses, useGetDashboardSummary, useDeleteCourse, getGetCoursesQueryKey, getGetDashboardSummaryQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BookOpen, PlusCircle, BarChart2, Trash2, ArrowLeft } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: summary, isLoading: summaryLoading } = useGetDashboardSummary();
  const { data: courses, isLoading: coursesLoading } = useGetCourses();
  const queryClient = useQueryClient();
  const deleteMutation = useDeleteCourse();
  const [, navigate] = useLocation();

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`هل تريد حذف مقرر "${name}"؟ سيتم حذف جميع أسئلته.`)) return;
    await deleteMutation.mutateAsync({ id });
    queryClient.invalidateQueries({ queryKey: getGetCoursesQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">لوحة التحكم</h1>
            <p className="text-slate-500 text-sm mt-1">مرحباً {user?.name}، هذه مقرراتك</p>
          </div>
          <Link
            href="/courses/new"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <PlusCircle className="h-4 w-4" />
            إضافة مقرر
          </Link>
        </div>

        {/* Summary Cards */}
        {!summaryLoading && summary && (
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-8">
            <SummaryCard
              label="إجمالي المقررات"
              value={summary.totalCourses}
              icon={<BookOpen className="h-5 w-5 text-blue-600" />}
              color="blue"
            />
            <SummaryCard
              label="إجمالي الأسئلة"
              value={summary.totalQuestions}
              icon={<BarChart2 className="h-5 w-5 text-green-600" />}
              color="green"
            />
          </div>
        )}

        {/* Courses */}
        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-4">مقرراتي</h2>

          {coursesLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-xl p-6 border border-slate-200 animate-pulse">
                  <div className="h-5 bg-slate-200 rounded w-3/4 mb-3" />
                  <div className="h-4 bg-slate-100 rounded w-1/2 mb-2" />
                  <div className="h-4 bg-slate-100 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : courses && courses.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map(course => (
                <div
                  key={course.id}
                  className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-all hover:border-blue-200 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-800 text-base leading-tight mb-1 group-hover:text-blue-600 transition-colors">
                        {course.name}
                      </h3>
                      <p className="text-xs text-slate-400">{course.code}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(course.id, course.name)}
                      className="text-slate-300 hover:text-red-500 transition-colors mr-2 flex-shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="text-sm text-slate-500 mb-4">
                    <p>د. {course.professor}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full font-medium">
                      {course.questionCount} سؤال
                    </span>
                    <div className="flex gap-2">
                      <Link
                        href={`/courses/${course.id}/questions`}
                        className="text-xs text-slate-500 hover:text-blue-600 transition-colors"
                      >
                        إضافة أسئلة
                      </Link>
                      <Link
                        href={`/courses/${course.id}`}
                        className="flex items-center gap-1 text-xs bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        التحليلات
                        <ArrowLeft className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
              <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="font-bold text-slate-600 mb-2">لا توجد مقررات بعد</h3>
              <p className="text-slate-400 text-sm mb-4">أضف مقررك الأول وابدأ تحليل أسئلته</p>
              <Link
                href="/courses/new"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <PlusCircle className="h-4 w-4" />
                إضافة مقرر جديد
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function SummaryCard({ label, value, icon, color }: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: "blue" | "green";
}) {
  const bg = color === "blue" ? "bg-blue-50" : "bg-green-50";
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4">
      <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-black text-slate-800">{value}</p>
        <p className="text-slate-500 text-sm">{label}</p>
      </div>
    </div>
  );
}
