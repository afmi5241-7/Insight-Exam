import { useState } from "react";
import { Link } from "wouter";
import { Download, ArrowLeft, Database, CheckCircle2, AlertCircle } from "lucide-react";
import AdminGate from "@/components/AdminGate";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

interface ExportSummary {
  filename: string;
  bytes: number;
  counts: { users: number; courses: number; questions: number };
}

function ExportInner() {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<ExportSummary | null>(null);
  const [error, setError] = useState("");

  const handleExport = async () => {
    setLoading(true);
    setError("");
    setSummary(null);
    try {
      const res = await fetch(`${BASE}/api/admin/export`, { credentials: "include" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `فشل التصدير (${res.status})`);
      }

      const blob = await res.blob();
      const text = await blob.text();
      const data = JSON.parse(text);

      const cd = res.headers.get("Content-Disposition") ?? "";
      const match = cd.match(/filename="?([^"]+)"?/);
      const filename = match?.[1] ?? `insight-exam-backup-${new Date().toISOString()}.json`;

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      setSummary({
        filename,
        bytes: blob.size,
        counts: data.counts ?? { users: 0, courses: 0, questions: 0 },
      });
    } catch (e: any) {
      setError(e.message ?? "حدث خطأ أثناء التصدير");
    } finally {
      setLoading(false);
    }
  };

  const formatBytes = (b: number) =>
    b < 1024 ? `${b} B` : b < 1024 * 1024 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1024 / 1024).toFixed(2)} MB`;

  return (
    <div className="min-h-screen bg-[#f0f6ff] dark:bg-[#0a1628] transition-colors duration-300">
      <header className="bg-white dark:bg-[#0f2240] border-b border-slate-100 dark:border-[#1a3a6a]/40">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2 text-[#2d6cc0] dark:text-[#4a9eed] hover:underline text-sm font-semibold">
            <ArrowLeft className="w-4 h-4" />
            العودة إلى الإدارة
          </Link>
          <h1 className="font-bold text-[#0f2240] dark:text-white">تصدير البيانات</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-white dark:bg-[#0f2240] rounded-2xl border border-slate-100 dark:border-[#1a3a6a]/40 shadow-sm p-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1a4b8c] to-[#2d6cc0] flex items-center justify-center">
              <Database className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#0f2240] dark:text-white">نسخة احتياطية كاملة</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                يتم تنزيل جميع المستخدمين والمقررات والأسئلة كملف JSON واحد
              </p>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-[#0a1628] rounded-xl p-5 mb-6 border border-slate-100 dark:border-[#1a3a6a]/40">
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              يحتوي الملف على نسخة كاملة من قاعدة البيانات. احفظه في مكان آمن — يمكنك استخدامه لاحقاً عبر صفحة الاستيراد لاستعادة كل بياناتك على نسخة جديدة من المشروع.
            </p>
          </div>

          <button
            onClick={handleExport}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-gradient-to-r from-[#1a4b8c] to-[#2d6cc0] text-white font-bold hover:shadow-lg transition disabled:opacity-50"
          >
            <Download className="w-5 h-5" />
            {loading ? "جارٍ تجهيز الملف..." : "تصدير وتنزيل النسخة الاحتياطية"}
          </button>

          {error && (
            <div className="mt-6 flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-300">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {summary && (
            <div className="mt-6 p-5 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/40">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                <p className="font-bold text-green-800 dark:text-green-300">تم التصدير بنجاح</p>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-4 text-center">
                <Stat label="المستخدمون" value={summary.counts.users} />
                <Stat label="المقررات" value={summary.counts.courses} />
                <Stat label="الأسئلة" value={summary.counts.questions} />
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-4 text-center" dir="ltr">
                {summary.filename} • {formatBytes(summary.bytes)}
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link href="/admin/import" className="text-sm text-[#2d6cc0] dark:text-[#4a9eed] hover:underline font-semibold">
            للاستيراد من ملف نسخة احتياطية ←
          </Link>
        </div>
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white dark:bg-[#0f2240] rounded-lg p-3 border border-green-100 dark:border-green-900/40">
      <div className="text-2xl font-bold text-[#0f2240] dark:text-white">{value}</div>
      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{label}</div>
    </div>
  );
}

export default function AdminExport() {
  return (
    <AdminGate title="تصدير البيانات">
      <ExportInner />
    </AdminGate>
  );
}
