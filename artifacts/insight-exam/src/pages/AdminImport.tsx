import { useState, useRef } from "react";
import { Link } from "wouter";
import { Upload, ArrowLeft, Database, CheckCircle2, AlertCircle, FileJson } from "lucide-react";
import AdminGate from "@/components/AdminGate";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

interface ImportResult {
  imported: { users: number; courses: number; questions: number };
}

interface FilePreview {
  name: string;
  size: number;
  counts: { users: number; courses: number; questions: number };
  payload: any;
}

function ImportInner() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<FilePreview | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const handleFile = async (file: File) => {
    setError("");
    setResult(null);
    setPreview(null);
    setConfirmed(false);
    try {
      const text = await file.text();
      const payload = JSON.parse(text);
      if (!payload || typeof payload !== "object") throw new Error("صيغة الملف غير صالحة");
      const counts = {
        users: Array.isArray(payload.users) ? payload.users.length : 0,
        courses: Array.isArray(payload.courses) ? payload.courses.length : 0,
        questions: Array.isArray(payload.questions) ? payload.questions.length : 0,
      };
      if (counts.users + counts.courses + counts.questions === 0) {
        throw new Error("الملف لا يحتوي على أي بيانات");
      }
      setPreview({ name: file.name, size: file.size, counts, payload });
    } catch (e: any) {
      setError(e.message ?? "تعذّر قراءة الملف");
    }
  };

  const handleImport = async () => {
    if (!preview) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(`${BASE}/api/admin/import`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(preview.payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? `فشل الاستيراد (${res.status})`);
      setResult(data);
      setPreview(null);
      setConfirmed(false);
      if (inputRef.current) inputRef.current.value = "";
    } catch (e: any) {
      setError(e.message ?? "حدث خطأ أثناء الاستيراد");
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
          <h1 className="font-bold text-[#0f2240] dark:text-white">استيراد البيانات</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-white dark:bg-[#0f2240] rounded-2xl border border-slate-100 dark:border-[#1a3a6a]/40 shadow-sm p-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1a4b8c] to-[#2d6cc0] flex items-center justify-center">
              <Database className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#0f2240] dark:text-white">استعادة من نسخة احتياطية</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                ارفع ملف JSON تم تصديره مسبقاً لاستعادة كل البيانات
              </p>
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/40 rounded-xl p-5 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
                <p className="font-bold mb-1">تحذير: عملية حذف وإعادة كتابة كاملة</p>
                <p>سيتم حذف جميع المستخدمين والمقررات والأسئلة الحالية واستبدالها بمحتوى الملف. لا يمكن التراجع.</p>
              </div>
            </div>
          </div>

          <label
            htmlFor="backup-file"
            className="block border-2 border-dashed border-slate-300 dark:border-[#1a3a6a]/60 rounded-xl p-10 text-center cursor-pointer hover:border-[#2d6cc0] dark:hover:border-[#4a9eed] transition"
          >
            <FileJson className="w-12 h-12 mx-auto text-slate-400 dark:text-slate-500 mb-3" />
            <p className="font-semibold text-[#0f2240] dark:text-white">
              {preview ? preview.name : "اختر ملف النسخة الاحتياطية"}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {preview ? formatBytes(preview.size) : "JSON فقط"}
            </p>
            <input
              ref={inputRef}
              id="backup-file"
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={e => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
          </label>

          {preview && (
            <div className="mt-6 p-5 rounded-xl bg-slate-50 dark:bg-[#0a1628] border border-slate-100 dark:border-[#1a3a6a]/40">
              <p className="text-sm font-bold text-[#0f2240] dark:text-white mb-3">معاينة محتوى الملف:</p>
              <div className="grid grid-cols-3 gap-3 text-center">
                <Stat label="المستخدمون" value={preview.counts.users} />
                <Stat label="المقررات" value={preview.counts.courses} />
                <Stat label="الأسئلة" value={preview.counts.questions} />
              </div>

              <label className="flex items-start gap-3 mt-5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={e => setConfirmed(e.target.checked)}
                  className="mt-1 w-4 h-4 accent-[#2d6cc0]"
                />
                <span className="text-sm text-[#0f2240] dark:text-slate-200">
                  أؤكد أنني أريد حذف كل البيانات الحالية واستبدالها بمحتوى هذا الملف
                </span>
              </label>

              <button
                onClick={handleImport}
                disabled={loading || !confirmed}
                className="w-full mt-5 flex items-center justify-center gap-3 py-4 rounded-xl bg-gradient-to-r from-[#1a4b8c] to-[#2d6cc0] text-white font-bold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload className="w-5 h-5" />
                {loading ? "جارٍ الاستيراد..." : "استيراد واستبدال البيانات"}
              </button>
            </div>
          )}

          {error && (
            <div className="mt-6 flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-300">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {result && (
            <div className="mt-6 p-5 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/40">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                <p className="font-bold text-green-800 dark:text-green-300">تم الاستيراد بنجاح</p>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-4 text-center">
                <Stat label="مستخدم" value={result.imported.users} />
                <Stat label="مقرر" value={result.imported.courses} />
                <Stat label="سؤال" value={result.imported.questions} />
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link href="/admin/export" className="text-sm text-[#2d6cc0] dark:text-[#4a9eed] hover:underline font-semibold">
            ← لإنشاء نسخة احتياطية جديدة
          </Link>
        </div>
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white dark:bg-[#0f2240] rounded-lg p-3 border border-slate-100 dark:border-[#1a3a6a]/40">
      <div className="text-2xl font-bold text-[#0f2240] dark:text-white">{value}</div>
      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{label}</div>
    </div>
  );
}

export default function AdminImport() {
  return (
    <AdminGate title="استيراد البيانات">
      <ImportInner />
    </AdminGate>
  );
}
