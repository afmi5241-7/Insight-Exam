import { useState, useRef } from "react";
import { Link } from "wouter";
import { CheckCircle2, Upload, X, ArrowRight, ArrowLeft, Lightbulb } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const FACULTIES = [
  "كلية إدارة الأعمال",
  "كلية الهندسة",
  "كلية العلوم والدراسات الإنسانية",
  "كلية هندسة وعلوم الحاسب",
  "كلية التربية",
  "كلية الصيدلة",
  "كلية الطب",
  "كلية التمريض",
  "كلية طب الأسنان",
  "كلية العلوم الطبية التطبيقية",
  "أخرى",
];

const CHAPTERS = [
  ...Array.from({ length: 20 }, (_, i) => `الفصل ${i + 1}`),
  "أخرى",
];

const QUESTION_TYPES = [
  "اختيار من متعدد",
  "صح وخطأ",
  "أكمل الفراغ",
  "أسئلة التوصيل",
  "إجابة قصيرة",
  "إجابة طويلة",
  "مسائل رياضية / حسابية",
  "صحّح الخطأ",
  "نوع آخر",
];

const DIFFICULTIES = ["سهل", "متوسط", "صعب"];
const YEARS = ["2023", "2024", "2025", "2026"];
const EXAM_TYPES = ["ميد 1", "ميد 2", "فاينل"];

interface Step1 {
  faculty: string;
  department: string;
  courseName: string;
}

interface Step2 {
  text: string;
  imageUrl: string;
  chapter: string;
  topic: string;
  questionType: string;
  difficulty: string;
  year: string;
  examType: string;
  sourceLink: string;
}

const inputClass = "w-full border border-slate-200 dark:border-slate-600 rounded-xl py-3 px-4 text-sm bg-white dark:bg-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 placeholder:text-slate-400 transition-all";
const labelClass = "block text-sm font-semibold text-[#1e293b] dark:text-slate-300 mb-2";

function ProgressBar({ step }: { step: 1 | 2 }) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <div className="flex items-center gap-2.5 flex-1">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all shadow-sm ${step >= 1 ? "bg-gradient-to-br from-[#3b82f6] to-[#6366f1] text-white shadow-blue-500/30" : "bg-slate-100 dark:bg-slate-700 text-slate-500"}`}>
          {step > 1 ? <CheckCircle2 className="h-4 w-4" /> : "١"}
        </div>
        <span className={`text-sm font-semibold ${step >= 1 ? "text-[#3b82f6] dark:text-blue-400" : "text-slate-400"}`}>
          معلومات المقرر
        </span>
      </div>
      <div className={`h-0.5 flex-1 rounded-full transition-all ${step >= 2 ? "bg-gradient-to-r from-[#3b82f6] to-[#6366f1]" : "bg-slate-200 dark:bg-slate-700"}`} />
      <div className="flex items-center gap-2.5 flex-1 justify-end">
        <span className={`text-sm font-semibold ${step >= 2 ? "text-[#3b82f6] dark:text-blue-400" : "text-slate-400"}`}>
          تفاصيل السؤال
        </span>
        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all shadow-sm ${step >= 2 ? "bg-gradient-to-br from-[#3b82f6] to-[#6366f1] text-white shadow-blue-500/30" : "bg-slate-100 dark:bg-slate-700 text-slate-500"}`}>
          ٢
        </div>
      </div>
    </div>
  );
}

export default function SubmitQuestion() {
  const [step, setStep] = useState<1 | 2>(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [step1, setStep1] = useState<Step1>({ faculty: "", department: "", courseName: "" });
  const [step2, setStep2] = useState<Step2>({
    text: "", imageUrl: "", chapter: "", topic: "",
    questionType: "", difficulty: "", year: "", examType: "", sourceLink: "",
  });

  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      setError("حجم الصورة يجب أن يكون أقل من 3 ميجابايت");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setStep2(prev => ({ ...prev, imageUrl: ev.target?.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const validateStep1 = () => {
    if (!step1.faculty) return "يرجى اختيار الكلية";
    if (!step1.department.trim()) return "يرجى إدخال اسم القسم";
    if (!step1.courseName.trim()) return "يرجى إدخال اسم المقرر";
    return "";
  };

  const validateStep2 = () => {
    if (!step2.text.trim() && !step2.imageUrl) return "يرجى كتابة السؤال أو رفع صورة";
    if (!step2.chapter) return "يرجى اختيار الفصل";
    if (!step2.questionType) return "يرجى اختيار نوع السؤال";
    if (!step2.difficulty) return "يرجى اختيار مستوى الصعوبة";
    if (!step2.year) return "يرجى اختيار السنة";
    if (!step2.examType) return "يرجى اختيار نوع الاختبار";
    return "";
  };

  const goToStep2 = () => {
    const err = validateStep1();
    if (err) { setError(err); return; }
    setError("");
    setStep(2);
  };

  const handleSubmit = async () => {
    const err = validateStep2();
    if (err) { setError(err); return; }
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch(`${BASE}/api/questions/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          faculty: step1.faculty,
          department: step1.department.trim(),
          courseName: step1.courseName.trim(),
          text: step2.text.trim(),
          imageUrl: step2.imageUrl || undefined,
          chapter: step2.chapter,
          topic: step2.topic.trim() || undefined,
          questionType: step2.questionType,
          difficulty: step2.difficulty,
          year: step2.year,
          examType: step2.examType,
          sourceLink: step2.sourceLink.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "حدث خطأ. حاول مرة أخرى.");
        return;
      }
      setSubmitted(true);
    } catch {
      setError("تعذّر الاتصال بالخادم. تحقق من اتصالك بالإنترنت.");
    } finally {
      setSubmitting(false);
    }
  };

  const addAnother = () => {
    setStep2({ text: "", imageUrl: "", chapter: "", topic: "", questionType: "", difficulty: "", year: "", examType: "", sourceLink: "" });
    if (fileRef.current) fileRef.current.value = "";
    setSubmitted(false);
    setStep(2);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-[#0f172a] transition-colors duration-300">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="bg-white dark:bg-[#1e293b] rounded-3xl border border-slate-100 dark:border-slate-700 p-12 max-w-md w-full text-center shadow-xl">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/25">
              <CheckCircle2 className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-[#0f172a] dark:text-white mb-3">
              تم إرسال السؤال بنجاح!
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-5 leading-relaxed">
              سؤالك الآن قيد المراجعة وسيظهر في التحليلات بعد الموافقة عليه
            </p>
            <span className="inline-flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 px-4 py-2 rounded-full text-sm font-semibold mb-8">
              🟡 قيد المراجعة
            </span>
            <div className="flex flex-col gap-3">
              <button
                onClick={addAnother}
                className="bg-gradient-to-r from-[#3b82f6] to-[#6366f1] text-white px-6 py-3.5 rounded-full font-bold hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 transition-all duration-200"
              >
                أضف سؤال آخر للمقرر نفسه
              </button>
              <Link href="/" className="text-slate-400 hover:text-[#3b82f6] dark:hover:text-blue-400 text-sm transition-colors py-2">
                العودة للصفحة الرئيسية
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-[#0f172a] transition-colors duration-300">
      <Navbar />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0f172a] dark:text-white">إدخال سؤال جديد</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5">
            الخطوة {step} من ٢
          </p>
        </div>

        <ProgressBar step={step} />

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm rounded-xl px-5 py-3.5 mb-6 font-medium">
            {error}
          </div>
        )}

        {step === 1 && (
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-100 dark:border-slate-700 p-8 shadow-sm space-y-6">
            <h2 className="font-bold text-[#0f172a] dark:text-white text-xl">معلومات المقرر</h2>

            <div>
              <label className={labelClass}>
                اسم الكلية <span className="text-red-500">*</span>
              </label>
              <select
                value={step1.faculty}
                onChange={e => setStep1(p => ({ ...p, faculty: e.target.value }))}
                className={inputClass}
              >
                <option value="">اختر الكلية...</option>
                {FACULTIES.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>

            <div>
              <label className={labelClass}>
                القسم <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={step1.department}
                onChange={e => setStep1(p => ({ ...p, department: e.target.value }))}
                placeholder="مثال: قسم علوم الحاسب"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                اسم المقرر <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={step1.courseName}
                onChange={e => setStep1(p => ({ ...p, courseName: e.target.value }))}
                placeholder="مثال: هياكل البيانات"
                className={inputClass}
              />
            </div>

            <button
              onClick={goToStep2}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#3b82f6] to-[#6366f1] text-white py-3.5 rounded-full font-bold hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 transition-all duration-200 mt-2"
            >
              التالي
              <ArrowLeft className="h-4 w-4" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-100 dark:border-slate-700 p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-[#0f172a] dark:text-white text-xl">تفاصيل السؤال</h2>
              <button onClick={() => { setStep(1); setError(""); }} className="text-sm text-slate-400 hover:text-[#3b82f6] flex items-center gap-1.5 transition-colors">
                <ArrowRight className="h-3.5 w-3.5" />
                تعديل المقرر
              </button>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-800 rounded-xl px-5 py-3 text-sm">
              <span className="font-semibold text-blue-800 dark:text-blue-300">{step1.faculty}</span>
              <span className="text-blue-600 dark:text-blue-400"> · {step1.department} · {step1.courseName}</span>
            </div>

            {/* Question text */}
            <div>
              <label className={labelClass}>نص السؤال</label>
              <textarea
                value={step2.text}
                onChange={e => setStep2(p => ({ ...p, text: e.target.value }))}
                placeholder="اكتب نص السؤال هنا..."
                rows={4}
                className={`${inputClass} resize-none`}
              />
            </div>

            {/* Image upload */}
            <div>
              <label className={labelClass}>
                رفع صورة <span className="text-slate-400 dark:text-slate-500 font-normal">(اختياري)</span>
              </label>
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-3">
                إذا لا يمكنك كتابة السؤال، ارفع صورة له — يدعم: jpg, png, gif, webp
              </p>
              {step2.imageUrl ? (
                <div className="relative inline-block">
                  <img src={step2.imageUrl} alt="preview" className="max-h-40 rounded-xl border border-slate-200 dark:border-slate-600 object-contain" />
                  <button
                    onClick={() => { setStep2(p => ({ ...p, imageUrl: "" })); if (fileRef.current) fileRef.current.value = ""; }}
                    className="absolute -top-2 -left-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center gap-3 border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-xl p-8 cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all">
                  <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center">
                    <Upload className="h-6 w-6 text-slate-400" />
                  </div>
                  <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">انقر لرفع صورة</span>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Chapter + Topic */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>الفصل <span className="text-red-500">*</span></label>
                <select
                  value={step2.chapter}
                  onChange={e => setStep2(p => ({ ...p, chapter: e.target.value }))}
                  className={inputClass}
                >
                  <option value="">اختر...</option>
                  {CHAPTERS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>الموضوع <span className="text-slate-400 font-normal">(اختياري)</span></label>
                <input
                  type="text"
                  value={step2.topic}
                  onChange={e => setStep2(p => ({ ...p, topic: e.target.value }))}
                  placeholder="مثال: الخوارزميات..."
                  className={inputClass}
                />
              </div>
            </div>

            {/* Question type + Difficulty */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>نوع السؤال <span className="text-red-500">*</span></label>
                <select
                  value={step2.questionType}
                  onChange={e => setStep2(p => ({ ...p, questionType: e.target.value }))}
                  className={inputClass}
                >
                  <option value="">اختر...</option>
                  {QUESTION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>مستوى الصعوبة <span className="text-red-500">*</span></label>
                <select
                  value={step2.difficulty}
                  onChange={e => setStep2(p => ({ ...p, difficulty: e.target.value }))}
                  className={inputClass}
                >
                  <option value="">اختر...</option>
                  {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>

            {/* Year + Exam type */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>السنة <span className="text-red-500">*</span></label>
                <select
                  value={step2.year}
                  onChange={e => setStep2(p => ({ ...p, year: e.target.value }))}
                  className={inputClass}
                >
                  <option value="">اختر...</option>
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>نوع الاختبار <span className="text-red-500">*</span></label>
                <select
                  value={step2.examType}
                  onChange={e => setStep2(p => ({ ...p, examType: e.target.value }))}
                  className={inputClass}
                >
                  <option value="">اختر...</option>
                  {EXAM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            {/* Source link */}
            <div>
              <label className={labelClass}>
                رابط مصدر أو شرح <span className="text-slate-400 font-normal">(اختياري)</span>
              </label>
              <input
                type="url"
                value={step2.sourceLink}
                onChange={e => setStep2(p => ({ ...p, sourceLink: e.target.value }))}
                placeholder="https://youtube.com/..."
                dir="ltr"
                className={inputClass}
              />
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 flex items-center gap-1.5">
                <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
                شارك معرفتك مع زملائك! أضف رابط يوتيوب أو ملخص أو أي مصدر مجاني
              </p>
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white py-3.5 rounded-full font-bold hover:shadow-lg hover:shadow-green-500/25 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none mt-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  جاري الإرسال...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  إرسال السؤال
                </>
              )}
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
