import { Link } from "wouter";
import { PenLine, BarChart2, Upload, TrendingUp, BookOpen, ChevronDown, ChevronUp, Mail, ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";
import { useState } from "react";
import { useDarkMode } from "@/lib/dark-mode";
import Navbar from "@/components/Navbar";

const logo = "/logo.png";

const FAQS = [
  { q: "هل المنصة مجانية؟", a: "نعم، Insight Exam مجانية بالكامل لجميع الطلاب. نهدف إلى تسهيل المراجعة للجميع دون أي تكلفة." },
  { q: "كيف تتم مراجعة الأسئلة؟", a: "كل سؤال يُرسل يمر بمراجعة بشرية قبل ظهوره في التحليلات، لضمان جودة المحتوى ودقته." },
  { q: "هل بياناتي آمنة؟", a: "نعم، لا نجمع أي بيانات شخصية. الأسئلة تُرسل بشكل مجهول تماماً." },
  { q: "كم من الوقت تستغرق مراجعة السؤال؟", a: "عادةً تتم المراجعة خلال 24-48 ساعة. بعدها يظهر السؤال في التحليلات." },
  { q: "هل يمكنني رفع صورة بدلاً من كتابة السؤال؟", a: "نعم! إذا كان السؤال يحتوي على رسوم أو معادلات يصعب كتابتها، يمكنك رفع صورة له." },
];

export default function Landing() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0f172a] transition-colors duration-300">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <img src={logo} alt="Insight Exam" className="h-24 w-24 drop-shadow-2xl" />
          </div>
          <h1 className="text-4xl sm:text-6xl font-black mb-4 leading-tight">
            Insight Exam
          </h1>
          <p className="text-2xl sm:text-3xl font-bold text-blue-100 mb-4">
            حوّل مراجعتك من عشوائية إلى ذكية
          </p>
          <p className="text-blue-200 text-base sm:text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            أدخل أسئلة الاختبارات السابقة واكتشف الأنماط المتكررة — ركّز وقتك على ما يهم فعلاً
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/submit"
              className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <PenLine className="h-5 w-5" />
              إدخال الأسئلة
            </Link>
            <Link
              href="/analytics"
              className="flex items-center justify-center gap-2 bg-white text-blue-700 hover:bg-blue-50 px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <BarChart2 className="h-5 w-5" />
              استعرض التحليلات
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 sm:py-20 bg-slate-50 dark:bg-[#0f172a]">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-black text-center text-slate-800 dark:text-slate-100 mb-3">
            كيف يعمل؟
          </h2>
          <p className="text-center text-slate-500 dark:text-slate-400 mb-12">ثلاث خطوات بسيطة</p>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                num: "١",
                icon: <Upload className="h-7 w-7 text-blue-600" />,
                title: "أدخل الأسئلة",
                desc: "شارك أسئلة الاختبارات السابقة للمقررات الدراسية — اكتابةً أو بصورة",
                color: "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800",
              },
              {
                num: "٢",
                icon: <BookOpen className="h-7 w-7 text-purple-600" />,
                title: "تُراجع الأسئلة",
                desc: "يراجع فريقنا كل سؤال للتحقق من جودته قبل إضافته للتحليلات",
                color: "bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800",
              },
              {
                num: "٣",
                icon: <TrendingUp className="h-7 w-7 text-green-600" />,
                title: "احصل على التحليلات",
                desc: "اكتشف الفصول الأكثر تكراراً وأنواع الأسئلة والتوصيات الذكية للمراجعة",
                color: "bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800",
              },
            ].map((step, i) => (
              <div key={i} className={`rounded-2xl border p-6 ${step.color} transition-colors duration-300`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-sm">
                    {step.icon}
                  </div>
                  <span className="text-2xl font-black text-slate-300 dark:text-slate-600">{step.num}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">{step.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA cards */}
      <section className="py-16 sm:py-20 bg-white dark:bg-[#1e293b]">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-black text-center text-slate-800 dark:text-slate-100 mb-12">
            ماذا تريد أن تفعل؟
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <Link href="/submit" className="group block">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800 rounded-2xl p-8 hover:border-green-400 dark:hover:border-green-600 hover:shadow-lg transition-all duration-200">
                <div className="w-14 h-14 bg-green-100 dark:bg-green-900/40 rounded-2xl flex items-center justify-center mb-4">
                  <PenLine className="h-7 w-7 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">إدخال الأسئلة</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                  ساعد زملاءك بمشاركة أسئلة الاختبارات السابقة. كلما أضفنا، كلما استفدنا جميعاً
                </p>
                <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-medium text-sm group-hover:gap-2 transition-all">
                  ابدأ الآن
                  <ArrowLeft className="h-4 w-4" />
                </span>
              </div>
            </Link>

            <Link href="/analytics" className="group block">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-8 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-lg transition-all duration-200">
                <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/40 rounded-2xl flex items-center justify-center mb-4">
                  <BarChart2 className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">استعرض التحليلات</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                  اعرف أي الفصول والمواضيع الأكثر تكراراً في اختباراتك واستفد من توصيات المراجعة
                </p>
                <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium text-sm group-hover:gap-2 transition-all">
                  اكتشف الآن
                  <ArrowLeft className="h-4 w-4" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-16 sm:py-20 bg-slate-50 dark:bg-[#0f172a]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100 mb-4">عن المنصة</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-base sm:text-lg mb-6">
            Insight Exam منصة تعليمية جماعية للطلاب الجامعيين. فكرتها بسيطة: عندما يشارك الطلاب أسئلة الاختبارات السابقة، تستطيع الخوارزميات اكتشاف الأنماط وتحديد المواضيع الأكثر تكراراً — مما يساعد الجميع على التركيز في مراجعتهم بدلاً من المراجعة العشوائية.
          </p>
          <div className="grid sm:grid-cols-3 gap-4 text-center">
            {[
              { label: "مجهول تماماً", desc: "لا حسابات، لا بيانات شخصية" },
              { label: "ذكاء جماعي", desc: "كلما شارك الجميع، استفاد الجميع" },
              { label: "تحليلات دقيقة", desc: "رسوم بيانية وتوصيات مخصصة" },
            ].map((item, i) => (
              <div key={i} className="bg-white dark:bg-[#1e293b] rounded-xl p-5 border border-slate-200 dark:border-slate-700">
                <p className="font-bold text-slate-800 dark:text-slate-100 mb-1">{item.label}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 sm:py-20 bg-white dark:bg-[#1e293b]">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-black text-center text-slate-800 dark:text-slate-100 mb-10">
            الأسئلة الشائعة
          </h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden transition-colors duration-300">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-right bg-white dark:bg-[#1e293b] hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <span className="font-medium text-slate-800 dark:text-slate-100 text-sm">{faq.q}</span>
                  {openFaq === i ? (
                    <ChevronUp className="h-4 w-4 text-slate-400 flex-shrink-0 mr-3" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-400 flex-shrink-0 mr-3" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 bg-slate-50 dark:bg-slate-800/50">
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-16 bg-slate-50 dark:bg-[#0f172a]">
        <div className="max-w-xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-3">تواصل معنا</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">
            هل لديك اقتراح أو مشكلة؟ نسعد بسماعك
          </p>
          <a
            href="mailto:admin@insightexam.com"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            <Mail className="h-4 w-4" />
            admin@insightexam.com
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
