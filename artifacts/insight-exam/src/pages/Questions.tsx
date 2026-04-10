import { useState } from "react";
import { Link, useParams } from "wouter";
import {
  useGetCourse,
  useGetCourseQuestions,
  useAddQuestion,
  getGetCourseQuestionsQueryKey,
  getGetCoursesQueryKey,
  getGetDashboardSummaryQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PlusCircle, ChevronRight, Clock, CheckCircle2, XCircle, BookOpen, Send } from "lucide-react";

const typeOptions = [
  { value: "multiple_choice", label: "اختيار من متعدد" },
  { value: "true_false", label: "صح وخطأ" },
  { value: "essay", label: "مقالي" },
  { value: "fill_blank", label: "أكمل الفراغ" },
];

const difficultyOptions = [
  { value: "easy", label: "سهل" },
  { value: "medium", label: "متوسط" },
  { value: "hard", label: "صعب" },
];

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
const diffColor: Record<string, string> = {
  easy: "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  medium: "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  hard: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const emptyForm = {
  text: "",
  chapter: "",
  questionType: "multiple_choice",
  difficulty: "medium",
  examPeriod: "",
};

interface SessionQuestion {
  id: number;
  text: string;
  chapter: string;
  questionType: string;
  difficulty: string;
}

const statusConfig: Record<string, { icon: React.ReactNode; label: string; classes: string }> = {
  pending: {
    icon: <Clock className="h-3.5 w-3.5" />,
    label: "قيد المراجعة",
    classes: "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800",
  },
  approved: {
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    label: "تم القبول",
    classes: "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
  },
  rejected: {
    icon: <XCircle className="h-3.5 w-3.5" />,
    label: "مرفوض",
    classes: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
  },
};

export default function Questions() {
  const params = useParams<{ id: string }>();
  const courseId = parseInt(params.id);
  const queryClient = useQueryClient();
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sessionQuestions, setSessionQuestions] = useState<SessionQuestion[]>([]);

  const { data: course } = useGetCourse(courseId, { query: { enabled: !!courseId } });
  const { data: questions, refetch: refetchQuestions } = useGetCourseQuestions(courseId, { query: { enabled: !!courseId } });
  const addQuestion = useAddQuestion();

  const totalQuestions = questions?.length ?? 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitted(false);
    try {
      const result = await addQuestion.mutateAsync({
        id: courseId,
        data: {
          text: form.text,
          chapter: form.chapter,
          questionType: form.questionType as any,
          difficulty: form.difficulty as any,
          examPeriod: form.examPeriod,
        },
      });
      queryClient.invalidateQueries({ queryKey: getGetCourseQuestionsQueryKey(courseId) });
      queryClient.invalidateQueries({ queryKey: getGetCoursesQueryKey() });
      queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });

      setSessionQuestions(sq => [
        { id: result.id, text: form.text, chapter: form.chapter, questionType: form.questionType, difficulty: form.difficulty },
        ...sq,
      ]);
      setSubmitted(true);
      setForm(emptyForm);
    } catch (err: any) {
      setError(err?.data?.error ?? "فشل إضافة السؤال");
    }
  };

  // Compute live statuses for session questions from the latest questions list
  const sessionStatuses: Record<number, string> = {};
  if (questions) {
    for (const q of questions) {
      sessionStatuses[q.id] = (q as any).status ?? "pending";
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0f172a] transition-colors duration-300">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6">
          <Link href="/dashboard" className="hover:text-blue-600 transition-colors">لوحة التحكم</Link>
          <ChevronRight className="h-4 w-4 rotate-180" />
          {course && (
            <>
              <Link href={`/courses/${courseId}`} className="hover:text-blue-600 transition-colors">{course.name}</Link>
              <ChevronRight className="h-4 w-4 rotate-180" />
            </>
          )}
          <span className="text-slate-800 dark:text-slate-200">إضافة أسئلة</span>
        </div>

        {/* Counter */}
        <div className="bg-blue-600 text-white rounded-2xl p-6 mb-6 flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm mb-1">{course?.name}</p>
            <h1 className="text-2xl font-bold">إضافة أسئلة الاختبار</h1>
          </div>
          <div className="text-center">
            <p className="text-4xl font-black">{totalQuestions}</p>
            <p className="text-blue-100 text-sm">سؤال معتمد</p>
          </div>
        </div>

        <div className="grid md:grid-cols-5 gap-6">
          {/* Form */}
          <div className="md:col-span-3">
            <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 transition-colors duration-300">
              <h2 className="font-bold text-slate-800 dark:text-slate-100 mb-4">سؤال جديد</h2>

              {submitted && (
                <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 text-sm rounded-lg px-4 py-3 mb-4">
                  <Send className="h-4 w-4 flex-shrink-0" />
                  <span>تم إرسال السؤال وهو قيد المراجعة ✅</span>
                </div>
              )}

              {error && (
                <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm rounded-lg px-4 py-3 mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    نص السؤال <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={form.text}
                    onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
                    placeholder="اكتب نص السؤال هنا..."
                    required
                    rows={3}
                    className="w-full border border-slate-200 dark:border-slate-600 rounded-lg py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    الفصل / الموضوع <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.chapter}
                    onChange={e => setForm(f => ({ ...f, chapter: e.target.value }))}
                    placeholder="مثال: الفصل الثالث: الخوارزميات"
                    required
                    className="w-full border border-slate-200 dark:border-slate-600 rounded-lg py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">نوع السؤال</label>
                    <select
                      value={form.questionType}
                      onChange={e => setForm(f => ({ ...f, questionType: e.target.value }))}
                      className="w-full border border-slate-200 dark:border-slate-600 rounded-lg py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 dark:text-slate-100"
                    >
                      {typeOptions.map(o => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">مستوى الصعوبة</label>
                    <select
                      value={form.difficulty}
                      onChange={e => setForm(f => ({ ...f, difficulty: e.target.value }))}
                      className="w-full border border-slate-200 dark:border-slate-600 rounded-lg py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 dark:text-slate-100"
                    >
                      {difficultyOptions.map(o => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    السنة / الفصل الدراسي <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.examPeriod}
                    onChange={e => setForm(f => ({ ...f, examPeriod: e.target.value }))}
                    placeholder="مثال: 1445 هـ - الفصل الأول"
                    required
                    className="w-full border border-slate-200 dark:border-slate-600 rounded-lg py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-400"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={addQuestion.isPending}
                    className="flex items-center gap-2 flex-1 justify-center bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-60"
                  >
                    <PlusCircle className="h-4 w-4" />
                    {addQuestion.isPending ? "جاري الإرسال..." : "إرسال السؤال"}
                  </button>
                  <Link
                    href={`/courses/${courseId}`}
                    className="px-4 py-3 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm font-medium"
                  >
                    التحليلات
                  </Link>
                </div>
              </form>
            </div>

            {/* Session Questions Status Tracking */}
            {sessionQuestions.length > 0 && (
              <div className="mt-6 bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 transition-colors duration-300">
                <h2 className="font-bold text-slate-800 dark:text-slate-100 mb-4 text-sm flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-400" />
                  أسئلتك المرسلة ({sessionQuestions.length})
                </h2>
                <div className="space-y-3">
                  {sessionQuestions.map(sq => {
                    const status = sessionStatuses[sq.id] ?? "pending";
                    const cfg = statusConfig[status] ?? statusConfig.pending;
                    return (
                      <div key={sq.id} className="border border-slate-100 dark:border-slate-700 rounded-xl p-3">
                        <p className="text-xs text-slate-700 dark:text-slate-300 mb-2 leading-relaxed line-clamp-2">{sq.text}</p>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs text-slate-400 dark:text-slate-500">{sq.chapter.split(':')[0]}</span>
                          <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium ${cfg.classes}`}>
                            {cfg.icon}
                            {cfg.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <button
                  onClick={() => refetchQuestions()}
                  className="mt-3 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  تحديث الحالات
                </button>
              </div>
            )}
          </div>

          {/* Questions List */}
          <div className="md:col-span-2">
            <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-4 transition-colors duration-300">
              <h2 className="font-bold text-slate-800 dark:text-slate-100 mb-3 text-sm">الأسئلة المعتمدة ({totalQuestions})</h2>
              {!questions || questions.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="h-10 w-10 text-slate-200 dark:text-slate-600 mx-auto mb-2" />
                  <p className="text-slate-400 dark:text-slate-500 text-sm">لا توجد أسئلة معتمدة بعد</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {[...questions].filter((q: any) => q.status === "approved" || !q.status).reverse().map((q: any) => (
                    <div key={q.id} className="border border-slate-100 dark:border-slate-700 rounded-lg p-3">
                      <p className="text-xs text-slate-700 dark:text-slate-300 mb-2 leading-relaxed line-clamp-2">{q.text}</p>
                      <div className="flex items-center gap-1 flex-wrap">
                        <span className="text-xs text-slate-500 dark:text-slate-400">{q.chapter.split(':')[0]}</span>
                        <span className="text-slate-300 dark:text-slate-600">·</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${diffColor[q.difficulty] ?? 'bg-slate-50 text-slate-600'}`}>
                          {diffLabel[q.difficulty] ?? q.difficulty}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
