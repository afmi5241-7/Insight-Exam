import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useRegister, getGetMeQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Mail, Lock, User, Sun, Moon } from "lucide-react";
const logo = "/logo.png";
import { useDarkMode } from "@/lib/dark-mode";

export default function Register() {
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const registerMutation = useRegister();
  const { dark, toggle } = useDarkMode();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await registerMutation.mutateAsync({ data: form });
      queryClient.setQueryData(getGetMeQueryKey(), res.user);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.data?.error ?? "فشل إنشاء الحساب، حاول مرة أخرى");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 dark:from-[#0f172a] dark:to-[#1e293b] flex items-center justify-center px-4 transition-colors duration-300">
      <button
        onClick={toggle}
        className="fixed top-4 left-4 p-2 rounded-lg bg-white dark:bg-slate-700 shadow text-slate-500 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
      >
        {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-blue-600 font-bold text-2xl mb-2">
            <img src={logo} alt="Insight Exam" className="h-11 w-11" />
            Insight Exam
          </div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">إنشاء حساب جديد</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">ابدأ رحلتك نحو المراجعة الذكية</p>
        </div>

        <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-lg p-8 transition-colors duration-300">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm rounded-lg px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">الاسم الكامل</label>
              <div className="relative">
                <User className="absolute top-1/2 -translate-y-1/2 right-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="أدخل اسمك الكامل"
                  required
                  minLength={2}
                  className="w-full border border-slate-200 dark:border-slate-600 rounded-lg py-3 pr-10 pl-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">البريد الإلكتروني</label>
              <div className="relative">
                <Mail className="absolute top-1/2 -translate-y-1/2 right-3 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="example@email.com"
                  required
                  className="w-full border border-slate-200 dark:border-slate-600 rounded-lg py-3 pr-10 pl-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-400"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute top-1/2 -translate-y-1/2 right-3 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="6 أحرف على الأقل"
                  required
                  minLength={6}
                  className="w-full border border-slate-200 dark:border-slate-600 rounded-lg py-3 pr-10 pl-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 dark:text-slate-100"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-60"
            >
              {registerMutation.isPending ? "جاري الإنشاء..." : "إنشاء الحساب"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            لديك حساب بالفعل؟{" "}
            <Link href="/login" className="text-blue-600 font-medium hover:underline">
              تسجيل الدخول
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
