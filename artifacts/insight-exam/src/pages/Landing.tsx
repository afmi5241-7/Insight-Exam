import { Link } from "wouter";
import { PenLine, BarChart2, Upload, TrendingUp, BookOpen, ChevronDown, ChevronUp, Mail, ArrowLeft, Shield, Users, Zap } from "lucide-react";
import Footer from "@/components/Footer";
import { useState } from "react";
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
      <section className="relative overflow-hidden bg-gradient-to-br from-[#6366f1] via-[#8b5cf6] to-[#a78bfa] dark:from-[#0f172a] dark:via-[#1e1b4b] dark:to-[#172554] text-white py-24 sm:py-32 transition-colors duration-500">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-300/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-3xl blur-xl scale-110" />
              <img src={logo} alt="Insight Exam" className="relative h-24 w-24 drop-shadow-2xl rounded-tl-[15px] rounded-tr-[15px] rounded-br-[15px] rounded-bl-[15px]" />
            </div>
          </div>
          <h1 className="text-5xl sm:text-7xl font-bold mb-5 leading-tight tracking-tight">
            Insight Exam
          </h1>
          <p className="text-2xl sm:text-3xl font-semibold text-blue-100 mb-5">
            حوّل مراجعتك من عشوائية إلى ذكية
          </p>
          <p className="text-blue-200 text-base sm:text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
            أدخل أسئلة الاختبارات السابقة واكتشف الأنماط المتكررة — ركّز وقتك على ما يهم فعلاً
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/submit"
              className="group flex items-center justify-center gap-2 bg-white text-[#3b82f6] px-8 py-4 rounded-full font-bold text-lg transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 hover:bg-blue-50"
            >
              <PenLine className="h-5 w-5 transition-transform group-hover:rotate-6" />
              إدخال الأسئلة
            </Link>
            <Link
              href="/analytics"
              className="group flex items-center justify-center gap-2 bg-white/15 backdrop-blur-sm border border-white/30 text-white hover:bg-white/25 px-8 py-4 rounded-full font-bold text-lg transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <BarChart2 className="h-5 w-5" />
              استعرض التحليلات
            </Link>
          </div>
        </div>

        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-16 sm:h-20">
            <path d="M0 80L48 70C96 60 192 40 288 33.3C384 27 480 33 576 43.3C672 53 768 67 864 66.7C960 67 1056 53 1152 43.3C1248 33 1344 27 1392 23.3L1440 20V80H0Z" className="fill-white dark:fill-[#0f172a]" />
          </svg>
        </div>
      </section>
      {/* How it works */}
      <section className="py-20 sm:py-24 bg-white dark:bg-[#0f172a]">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              كيف يعمل؟
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0f172a] dark:text-white mb-3">
              ثلاث خطوات بسيطة
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                num: "١",
                icon: <Upload className="h-7 w-7 text-white" />,
                gradient: "from-[#3b82f6] to-[#6366f1]",
                title: "أدخل الأسئلة",
                desc: "شارك أسئلة الاختبارات السابقة للمقررات الدراسية — اكتابةً أو بصورة",
              },
              {
                num: "٢",
                icon: <BookOpen className="h-7 w-7 text-white" />,
                gradient: "from-[#6366f1] to-[#8b5cf6]",
                title: "تُراجع الأسئلة",
                desc: "يراجع فريقنا كل سؤال للتحقق من جودته قبل إضافته للتحليلات",
              },
              {
                num: "٣",
                icon: <TrendingUp className="h-7 w-7 text-white" />,
                gradient: "from-[#8b5cf6] to-[#a855f7]",
                title: "احصل على التحليلات",
                desc: "اكتشف الفصول الأكثر تكراراً وأنواع الأسئلة والتوصيات الذكية للمراجعة",
              },
            ].map((step, i) => (
              <div key={i} className="group relative bg-white dark:bg-[#1e293b] rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-100 dark:border-slate-700">
                <div className="absolute top-5 left-5 text-7xl font-black text-slate-50 dark:text-slate-800 select-none leading-none">
                  {step.num}
                </div>
                <div className={`relative w-14 h-14 bg-gradient-to-br ${step.gradient} rounded-2xl flex items-center justify-center mb-5 shadow-lg`}>
                  {step.icon}
                </div>
                <h3 className="relative text-lg font-bold text-[#0f172a] dark:text-white mb-3">{step.title}</h3>
                <p className="relative text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* CTA cards */}
      <section className="py-20 sm:py-24 bg-[#f8fafc] dark:bg-[#1e293b]">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0f172a] dark:text-white">
              ماذا تريد أن تفعل؟
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            <Link href="/submit" className="group block">
              <div className="relative bg-white dark:bg-[#0f172a] rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-100 dark:border-slate-700 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-green-500" />
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-green-500/25">
                  <PenLine className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#0f172a] dark:text-white mb-3">إدخال الأسئلة</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-5">
                  ساعد زملاءك بمشاركة أسئلة الاختبارات السابقة. كلما أضفنا، كلما استفدنا جميعاً
                </p>
                <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold text-sm group-hover:gap-3 transition-all">
                  ابدأ الآن
                  <ArrowLeft className="h-4 w-4" />
                </span>
              </div>
            </Link>

            <Link href="/analytics" className="group block">
              <div className="relative bg-white dark:bg-[#0f172a] rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-100 dark:border-slate-700 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#3b82f6] to-[#6366f1]" />
                <div className="w-14 h-14 bg-gradient-to-br from-[#3b82f6] to-[#6366f1] rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-blue-500/25">
                  <BarChart2 className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#0f172a] dark:text-white mb-3">استعرض التحليلات</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-5">
                  اعرف أي الفصول والمواضيع الأكثر تكراراً في اختباراتك واستفد من توصيات المراجعة
                </p>
                <span className="inline-flex items-center gap-1.5 text-[#3b82f6] dark:text-blue-400 font-semibold text-sm group-hover:gap-3 transition-all">
                  اكتشف الآن
                  <ArrowLeft className="h-4 w-4" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>
      {/* About */}
      <section id="about" className="py-20 sm:py-24 bg-white dark:bg-[#0f172a]">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              عن المنصة
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0f172a] dark:text-white mb-4">
              ذكاء جماعي لصالح الجميع
            </h2>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-base sm:text-lg max-w-2xl mx-auto">
              Insight Exam منصة تعليمية جماعية للطلاب الجامعيين. عندما يشارك الطلاب أسئلة الاختبارات السابقة، تكتشف الخوارزميات الأنماط وتحدد المواضيع الأكثر تكراراً — مما يساعد الجميع على التركيز في مراجعتهم بدلاً من المراجعة العشوائية.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />, label: "مجهول تماماً", desc: "لا حسابات، لا بيانات شخصية", bg: "bg-blue-50 dark:bg-blue-900/20" },
              { icon: <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />, label: "ذكاء جماعي", desc: "كلما شارك الجميع، استفاد الجميع", bg: "bg-purple-50 dark:bg-purple-900/20" },
              { icon: <Zap className="h-6 w-6 text-amber-600 dark:text-amber-400" />, label: "تحليلات دقيقة", desc: "رسوم بيانية وتوصيات مخصصة", bg: "bg-amber-50 dark:bg-amber-900/20" },
            ].map((item, i) => (
              <div key={i} className="bg-white dark:bg-[#1e293b] rounded-2xl p-7 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-200">
                <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center mb-4`}>
                  {item.icon}
                </div>
                <p className="font-bold text-[#0f172a] dark:text-white mb-1.5">{item.label}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* FAQ */}
      <section id="faq" className="py-20 sm:py-24 bg-[#f8fafc] dark:bg-[#1e293b]">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              الأسئلة الشائعة
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0f172a] dark:text-white">
              هل لديك سؤال؟
            </h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className={`bg-white dark:bg-[#0f172a] rounded-2xl border transition-all duration-200 overflow-hidden ${openFaq === i ? "border-blue-200 dark:border-blue-700 shadow-sm" : "border-slate-100 dark:border-slate-800"}`}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-right hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <span className="font-semibold text-[#1e293b] dark:text-slate-100 text-sm">{faq.q}</span>
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mr-3 transition-colors ${openFaq === i ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400" : "bg-slate-100 dark:bg-slate-800 text-slate-400"}`}>
                    {openFaq === i ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5">
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Contact */}
      <section id="contact" className="py-20 bg-white dark:bg-[#0f172a]">
        <div className="max-w-xl mx-auto px-4 text-center">
          <div className="w-14 h-14 bg-gradient-to-br from-[#3b82f6] to-[#6366f1] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/25">
            <Mail className="h-7 w-7 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-[#0f172a] dark:text-white mb-3">تواصل معنا</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm leading-relaxed">
            هل لديك اقتراح أو مشكلة؟ نسعد بسماعك
          </p>
          <a
            href="mailto:admin@insightexam.com"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#3b82f6] to-[#6366f1] text-white px-8 py-3.5 rounded-full font-semibold hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 transition-all duration-200"
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
