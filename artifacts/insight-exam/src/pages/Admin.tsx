import { useState, useEffect } from "react";
import { Link } from "wouter";
import { CheckCircle2, XCircle, Clock, Shield, LogOut, RefreshCw, Sun, Moon, ExternalLink, Image } from "lucide-react";
const logo = "/logo.png";
import { useDarkMode } from "@/lib/dark-mode";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

type QuestionStatus = "pending" | "approved" | "rejected";

interface AdminQuestion {
  id: number;
  text: string;
  imageUrl: string | null;
  chapter: string;
  topic: string | null;
  questionType: string;
  difficulty: string;
  year: string;
  examType: string;
  sourceLink: string | null;
  status: string;
  createdAt: string;
  courseId: number;
  courseName: string | null;
  faculty: string | null;
  department: string | null;
}

const diffColor: Record<string, string> = {
  easy: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  hard: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  "سهل": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  "متوسط": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  "صعب": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function Admin() {
  const { dark, toggle } = useDarkMode();
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const [questions, setQuestions] = useState<AdminQuestion[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [filter, setFilter] = useState<QuestionStatus>("pending");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  const fetchQuestions = async (status: QuestionStatus) => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/api/admin/questions?status=${status}`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setQuestions(data.questions);
        setPendingCount(data.pendingCount);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");
    try {
      const res = await fetch(`${BASE}/api/admin/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setIsAdmin(true);
        fetchQuestions("pending");
      } else {
        const data = await res.json();
        setAuthError(data.error ?? "كلمة المرور غير صحيحة");
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch(`${BASE}/api/admin/logout`, { method: "POST", credentials: "include" });
    setIsAdmin(false);
    setPassword("");
  };

  const updateStatus = async (id: number, status: "approved" | "rejected") => {
    setActionLoading(id);
    try {
      await fetch(`${BASE}/api/admin/questions/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      });
      await fetchQuestions(filter);
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    if (isAdmin) fetchQuestions(filter);
  }, [filter, isAdmin]);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] flex items-center justify-center px-4 transition-colors duration-300">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 text-blue-600 font-bold text-xl mb-2">
              <img src={logo} alt="Insight Exam" className="h-10 w-10" />
              <span>Insight Exam</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-slate-700 dark:text-slate-300 mt-1">
              <Shield className="h-4 w-4" />
              <span className="text-sm font-medium">لوحة الإدارة</span>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-lg p-8 transition-colors duration-300">
            <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 text-center">دخول المسؤول</h1>

            {authError && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm rounded-lg px-4 py-3 mb-4">
                {authError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">كلمة المرور</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full border border-slate-200 dark:border-slate-600 rounded-lg py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 dark:text-slate-100"
                  dir="ltr"
                />
              </div>
              <button
                type="submit"
                disabled={authLoading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-60"
              >
                {authLoading ? "جاري الدخول..." : "دخول"}
              </button>
            </form>

            <div className="mt-4 text-center">
              <Link href="/" className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600">
                العودة للرئيسية
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] transition-colors duration-300">
      {/* Topbar */}
      <nav className="bg-white dark:bg-[#1e293b] border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-600 font-bold">
            <img src={logo} alt="Insight Exam" className="h-8 w-8" />
            <span className="text-sm">لوحة الإدارة</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggle} className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button onClick={handleLogout} className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 hover:text-red-600 transition-colors">
              <LogOut className="h-4 w-4" />
              خروج
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100">مراجعة الأسئلة</h1>
            {pendingCount > 0 && (
              <p className="text-sm text-amber-600 dark:text-amber-400 mt-1 font-medium">
                {pendingCount} سؤال بانتظار المراجعة
              </p>
            )}
          </div>
          <button onClick={() => fetchQuestions(filter)} className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors">
            <RefreshCw className="h-4 w-4" />
            تحديث
          </button>
        </div>

        <div className="flex gap-2 mb-6 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 rounded-xl p-1 w-fit transition-colors duration-300">
          {(["pending", "approved", "rejected"] as QuestionStatus[]).map(s => {
            const labels = { pending: "قيد المراجعة", approved: "مقبولة", rejected: "مرفوضة" };
            const active = filter === s;
            return (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${active ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"}`}
              >
                {labels[s]}
                {s === "pending" && pendingCount > 0 && (
                  <span className={`mr-1.5 px-1.5 py-0.5 rounded-full text-xs font-bold ${active ? "bg-white/20 text-white" : "bg-amber-100 text-amber-700"}`}>
                    {pendingCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center py-16 text-slate-400 dark:text-slate-500">
            <Clock className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>لا توجد أسئلة في هذه الحالة</p>
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map(q => (
              <div key={q.id} className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 rounded-2xl p-5 transition-colors duration-300">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {/* Course info */}
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
                        {q.courseName ?? "—"}
                      </span>
                      {q.faculty && <span className="text-xs text-slate-400 dark:text-slate-500">{q.faculty}</span>}
                      <span className="text-xs text-slate-500 dark:text-slate-400">{q.chapter}{q.topic ? ` · ${q.topic}` : ""}</span>
                    </div>

                    {/* Question text */}
                    {q.text && <p className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed mb-3">{q.text}</p>}

                    {/* Image */}
                    {q.imageUrl && (
                      <button onClick={() => setExpandedImage(q.imageUrl)} className="mb-3 block">
                        <img src={q.imageUrl} alt="question" className="max-h-32 rounded-lg border border-slate-200 dark:border-slate-600 object-contain hover:opacity-80 transition-opacity" />
                        <p className="text-xs text-blue-500 mt-1 flex items-center gap-1"><Image className="h-3 w-3" /> انقر لتكبير الصورة</p>
                      </button>
                    )}

                    {/* Tags */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full">{q.questionType}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${diffColor[q.difficulty] ?? "bg-slate-100 text-slate-600"}`}>{q.difficulty}</span>
                      <span className="text-xs text-slate-400 dark:text-slate-500">{q.year} · {q.examType}</span>
                    </div>

                    {/* Source link */}
                    {q.sourceLink && (
                      <a href={q.sourceLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-blue-500 hover:underline mt-2" dir="ltr">
                        <ExternalLink className="h-3 w-3" />
                        {q.sourceLink.length > 50 ? q.sourceLink.slice(0, 50) + "…" : q.sourceLink}
                      </a>
                    )}
                  </div>

                  {filter === "pending" && (
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <button onClick={() => updateStatus(q.id, "approved")} disabled={actionLoading === q.id} className="flex items-center gap-1 bg-green-600 text-white text-xs px-3 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 font-medium whitespace-nowrap">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        قبول ✅
                      </button>
                      <button onClick={() => updateStatus(q.id, "rejected")} disabled={actionLoading === q.id} className="flex items-center gap-1 bg-red-600 text-white text-xs px-3 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 font-medium whitespace-nowrap">
                        <XCircle className="h-3.5 w-3.5" />
                        رفض ❌
                      </button>
                    </div>
                  )}

                  {filter !== "pending" && (
                    <button onClick={() => updateStatus(q.id, "pending")} disabled={actionLoading === q.id} className="text-xs text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors border border-slate-200 dark:border-slate-600 px-2 py-1 rounded-lg flex-shrink-0">
                      إعادة للمراجعة
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Image lightbox */}
      {expandedImage && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setExpandedImage(null)}>
          <img src={expandedImage} alt="expanded" className="max-w-full max-h-full rounded-xl object-contain" />
        </div>
      )}
    </div>
  );
}
