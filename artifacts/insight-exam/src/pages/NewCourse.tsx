import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useCreateCourse, getGetCoursesQueryKey, getGetDashboardSummaryQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BookOpen, ChevronRight } from "lucide-react";

export default function NewCourse() {
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const createCourse = useCreateCourse();
  const [form, setForm] = useState({ name: "", code: "", professor: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const course = await createCourse.mutateAsync({ data: form });
      queryClient.invalidateQueries({ queryKey: getGetCoursesQueryKey() });
      queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
      navigate(`/courses/${course.id}/questions`);
    } catch (err: any) {
      setError(err?.data?.error ?? "فشل إنشاء المقرر، حاول مرة أخرى");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link href="/dashboard" className="hover:text-blue-600 transition-colors">لوحة التحكم</Link>
          <ChevronRight className="h-4 w-4 rotate-180" />
          <span className="text-slate-800">إضافة مقرر جديد</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">إضافة مقرر جديد</h1>
              <p className="text-slate-500 text-sm">أدخل بيانات المقرر الدراسي</p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                اسم المقرر <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="مثال: هياكل البيانات والخوارزميات"
                required
                className="w-full border border-slate-200 rounded-lg py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                رمز المقرر <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.code}
                onChange={e => setForm(f => ({ ...f, code: e.target.value }))}
                placeholder="مثال: CS301"
                required
                className="w-full border border-slate-200 rounded-lg py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                اسم الأستاذ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.professor}
                onChange={e => setForm(f => ({ ...f, professor: e.target.value }))}
                placeholder="مثال: د. محمد الشهراني"
                required
                className="w-full border border-slate-200 rounded-lg py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={createCourse.isPending}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-60"
              >
                {createCourse.isPending ? "جاري الإنشاء..." : "إنشاء المقرر"}
              </button>
              <Link
                href="/dashboard"
                className="px-6 py-3 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium"
              >
                إلغاء
              </Link>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
