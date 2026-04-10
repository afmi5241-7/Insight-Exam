import { Link } from "wouter";
import { Brain, Target, TrendingUp, ArrowLeft, Sun, Moon } from "lucide-react";
import Footer from "@/components/Footer";
import logo from "@assets/insight_exam_logo_1_1775630424807.png";
import { useDarkMode } from "@/lib/dark-mode";

export default function Landing() {
  const { dark, toggle } = useDarkMode();

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0f172a] transition-colors duration-300">
      {/* Navbar */}
      <nav className="bg-white dark:bg-[#1e293b] border-b border-slate-200 dark:border-slate-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 text-blue-600 font-bold text-xl">
              <img src={logo} alt="Insight Exam" className="h-10 w-10 rounded-lg object-cover" />
              <span>Insight Exam</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={toggle}
                className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <Link href="/login" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium text-sm transition-colors">
                تسجيل الدخول
              </Link>
              <Link
                href="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                إنشاء حساب
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500 bg-opacity-30 rounded-full px-4 py-2 text-sm mb-6">
            <Brain className="h-4 w-4" />
            منصة التحليل الذكي للاختبارات
          </div>
          <h1 className="text-4xl sm:text-5xl font-black mb-4 leading-tight">
            Insight Exam
          </h1>
          <p className="text-2xl sm:text-3xl font-bold text-blue-100 mb-4">
            حوّل مراجعتك من عشوائية إلى ذكية
          </p>
          <p className="text-blue-200 text-lg mb-8 max-w-2xl mx-auto">
            حلل أسئلة الاختبارات السابقة واكتشف الأنماط المتكررة لتركز مراجعتك على ما يهم فعلاً
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            ابدأ الآن
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 bg-white dark:bg-[#0f172a] transition-colors duration-300">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-slate-100 mb-12">
            كيف يعمل Insight Exam؟
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              icon={<Target className="h-8 w-8 text-blue-600" />}
              title="أضف الأسئلة"
              description="أدخل أسئلة الاختبارات السابقة لمقرراتك مع تحديد الفصل والنوع ومستوى الصعوبة"
            />
            <StepCard
              number="2"
              icon={<Brain className="h-8 w-8 text-blue-600" />}
              title="النظام يحلل"
              description="يقوم النظام تلقائياً بتحليل الأسئلة وإيجاد الأنماط والموضوعات الأكثر تكراراً"
            />
            <StepCard
              number="3"
              icon={<TrendingUp className="h-8 w-8 text-blue-600" />}
              title="شاهد النتائج"
              description="احصل على تقارير بيانية تفاعلية وتوصيات ذكية تساعدك على المراجعة الفعّالة"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-slate-50 dark:bg-[#1e293b] transition-colors duration-300">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-slate-100 mb-12">
            ما الذي ستحصل عليه؟
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: "تحليل الموضوعات", desc: "اعرف أي الفصول تتكرر أسئلتها أكثر في الاختبارات" },
              { title: "توزيع أنواع الأسئلة", desc: "اختيار من متعدد، صح وخطأ، مقالي، أكمل الفراغ" },
              { title: "مستوى الصعوبة", desc: "وزّع وقتك بين الأسئلة السهلة والمتوسطة والصعبة بذكاء" },
              { title: "توصيات مراجعة ذكية", desc: "اقتراحات مبنية على البيانات لتحسين أداؤك في الاختبار" },
            ].map((f) => (
              <div key={f.title} className="bg-white dark:bg-[#0f172a] p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors duration-300">
                <div className="w-2 h-2 rounded-full bg-blue-600 mb-3" />
                <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-2">{f.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-blue-600 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">جاهز تبدأ المراجعة الذكية؟</h2>
          <p className="text-blue-100 mb-8">انضم الآن وابدأ تحليل مقرراتك مجاناً</p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-colors"
          >
            إنشاء حساب مجاني
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function StepCard({ number, icon, title, description }: {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center p-6 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-600 hover:shadow-md transition-all dark:bg-[#1e293b]">
      <div className="relative inline-block mb-4">
        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto">
          {icon}
        </div>
        <span className="absolute -top-2 -left-2 w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
          {number}
        </span>
      </div>
      <h3 className="font-bold text-xl text-slate-800 dark:text-slate-100 mb-2">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
