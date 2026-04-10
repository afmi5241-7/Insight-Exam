import React, { useState } from "react";
import { 
  BookOpen, 
  BarChart3, 
  Search, 
  ArrowLeft, 
  FileText, 
  HelpCircle,
  Mail,
  CheckCircle2,
  ChevronDown,
  ChevronUp
} from "lucide-react";

export function PolishedCoherent() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 dark:bg-slate-950 font-['Tajawal',sans-serif] text-slate-900 dark:text-slate-100 overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 lg:pt-32 lg:pb-40 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-white blur-3xl mix-blend-overlay"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 rounded-full bg-blue-300 blur-3xl mix-blend-overlay"></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
              أذكى طريقة للتحضير لاختباراتك الجامعية
            </h1>
            <p className="text-lg md:text-xl text-blue-100 leading-relaxed max-w-2xl mx-auto">
              منصة Insight Exam تساعدك على تحليل أسئلة السنوات السابقة، اكتشاف أنماط الاختبارات، والتركيز على ما يهم فعلاً في دراستك.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button className="w-full sm:w-auto px-8 py-3.5 bg-white text-blue-700 font-bold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2">
                <span>تصفح الأسئلة</span>
                <Search className="w-5 h-5" />
              </button>
              <button className="w-full sm:w-auto px-8 py-3.5 bg-blue-800/50 hover:bg-blue-800 text-white font-bold rounded-lg backdrop-blur-sm border border-blue-400/30 transition-all duration-200 flex items-center justify-center gap-2">
                <span>أضف سؤالاً</span>
                <FileText className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Wave Separator */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-0 rotate-180">
          <svg className="relative block w-full h-[60px] md:h-[100px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-slate-50 dark:fill-slate-950"></path>
          </svg>
        </div>
      </section>

      {/* How it works Section */}
      <section className="py-20 md:py-24 relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">كيف تعمل المنصة؟</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
              خطوات بسيطة تفصلك عن دراسة أكثر ذكاءً وفعالية
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                num: "١",
                icon: <Search className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
                title: "ابحث عن مادتك",
                desc: "تصفح قاعدة بيانات واسعة من الأسئلة السابقة مصنفة حسب الجامعة والكلية والمادة.",
                color: "bg-blue-100 dark:bg-blue-900/30"
              },
              {
                num: "٢",
                icon: <BarChart3 className="w-8 h-8 text-purple-600 dark:text-purple-400" />,
                title: "حلل الأنماط",
                desc: "اكتشف الفصول الأكثر تكراراً في الاختبارات السابقة وركز جهدك على ما يهم.",
                color: "bg-purple-100 dark:bg-purple-900/30"
              },
              {
                num: "٣",
                icon: <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />,
                title: "تفوق باختبارك",
                desc: "ادخل اختبارك بثقة عالية بعد التحضير الذكي المبني على بيانات حقيقية.",
                color: "bg-emerald-100 dark:bg-emerald-900/30"
              }
            ].map((step, idx) => (
              <div key={idx} className="relative p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow group overflow-hidden">
                <div className="absolute -left-4 -top-8 text-[120px] font-black text-slate-50 dark:text-slate-800/50 leading-none select-none z-0 transition-transform group-hover:scale-110 duration-500">
                  {step.num}
                </div>
                <div className="relative z-10 space-y-6">
                  <div className={`w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center mb-4`}>
                    {step.icon}
                  </div>
                  <h3 className="text-2xl font-bold">{step.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Cards Section */}
      <section className="py-20 md:py-24 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            <div className="relative p-10 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden group hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-blue-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              <div className="space-y-6">
                <div className="w-14 h-14 bg-white dark:bg-slate-700 shadow-sm rounded-xl flex items-center justify-center">
                  <Search className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3">هل تبحث عن أسئلة؟</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                    تصفح آلاف الأسئلة السابقة، واكتشف تحليلات ذكية تساعدك على معرفة المواضيع الأكثر أهمية لاختبارك القادم.
                  </p>
                </div>
                <button className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-lg hover:gap-3 transition-all">
                  <span>تصفح المواد الآن</span>
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="relative p-10 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden group hover:border-purple-300 dark:hover:border-purple-700 transition-colors">
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-purple-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              <div className="space-y-6">
                <div className="w-14 h-14 bg-white dark:bg-slate-700 shadow-sm rounded-xl flex items-center justify-center">
                  <FileText className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3">هل لديك أسئلة سابقة؟</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                    ساهم في مساعدة زملائك من خلال إضافة أسئلة الاختبارات التي تتذكرها. كل مساهمة تصنع فرقاً.
                  </p>
                </div>
                <button className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-lg hover:gap-3 transition-all">
                  <span>أضف سؤالاً جديداً</span>
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* About / Features Section */}
      <section className="py-20 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">لماذا Insight Exam؟</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
              صممت المنصة خصيصاً لتلبية احتياجات الطالب الجامعي العربي
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {[
              {
                icon: <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
                title: "مجانية ومفتوحة",
                desc: "منصة مبنية على التعاون الطلابي، لا تتطلب تسجيل الدخول أو دفع رسوم للوصول للأسئلة.",
                color: "bg-indigo-100 dark:bg-indigo-900/40"
              },
              {
                icon: <BarChart3 className="w-6 h-6 text-rose-600 dark:text-rose-400" />,
                title: "تحليلات دقيقة",
                desc: "رسوم بيانية توضح توزيع الأسئلة حسب الفصول الدراسية ودرجة الصعوبة المتوقعة.",
                color: "bg-rose-100 dark:bg-rose-900/40"
              },
              {
                icon: <CheckCircle2 className="w-6 h-6 text-teal-600 dark:text-teal-400" />,
                title: "جودة المحتوى",
                desc: "نظام تقييم مجتمعي يضمن دقة الأسئلة المطروحة وجودة الإجابات المقترحة.",
                color: "bg-teal-100 dark:bg-teal-900/40"
              }
            ].map((feature, idx) => (
              <div key={idx} className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl hover:bg-white dark:hover:bg-slate-900 transition-colors">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${feature.color} shadow-inner`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-24 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row gap-12 lg:gap-24 max-w-6xl mx-auto">
            
            <div className="md:w-1/3 space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">الأسئلة الشائعة</h2>
              <div className="w-16 h-1 bg-blue-600 rounded-full"></div>
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                كل ما تحتاج معرفته عن كيفية استخدام المنصة والمساهمة فيها.
              </p>
              <div className="pt-4 hidden md:block">
                <HelpCircle className="w-32 h-32 text-slate-100 dark:text-slate-800" />
              </div>
            </div>

            <div className="md:w-2/3 space-y-4">
              {[
                {
                  q: "هل أحتاج إلى إنشاء حساب لاستخدام المنصة؟",
                  a: "لا، المنصة مفتوحة بالكامل ويمكنك تصفح الأسئلة والتحليلات أو إضافة أسئلة جديدة دون الحاجة لإنشاء حساب."
                },
                {
                  q: "كيف أضمن صحة الأسئلة الموجودة؟",
                  a: "تعتمد المنصة على المساهمة المجتمعية. يمكن للطلاب تقييم الأسئلة والإجابات، والأسئلة ذات التقييم العالي تظهر أولاً، مما يضمن جودة المحتوى بمرور الوقت."
                },
                {
                  q: "هل المنصة تدعم جميع الجامعات العربية؟",
                  a: "نعم، المنصة مصممة لتكون شاملة، ويمكن لأي طالب إضافة جامعته وكليته إذا لم تكن موجودة في القائمة."
                },
                {
                  q: "كيف تساعدني التحليلات في الدراسة؟",
                  a: "تقوم المنصة بتحليل الأسئلة السابقة واستخراج الأنماط، لتعرض لك الفصول التي تتكرر فيها الأسئلة بكثرة، ومستوى الصعوبة المعتاد، مما يساعدك على توجيه جهدك بذكاء."
                }
              ].map((faq, idx) => (
                <div 
                  key={idx} 
                  className={`border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden transition-all duration-300 ${
                    openFaq === idx ? 'border-r-4 border-r-blue-600 shadow-md bg-slate-50 dark:bg-slate-800/50' : 'hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-900'
                  }`}
                >
                  <button 
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between p-6 text-right font-bold text-lg"
                  >
                    <span>{faq.q}</span>
                    {openFaq === idx ? (
                      <ChevronUp className="w-5 h-5 text-blue-600 shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                    )}
                  </button>
                  <div 
                    className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                      openFaq === idx ? 'max-h-48 pb-6 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Minimal Footer / Contact */}
      <footer className="bg-slate-950 text-slate-300 py-12 md:py-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600"></div>
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg">
                IE
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">Insight Exam</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 text-sm">
              <a href="#" className="hover:text-white transition-colors">عن المنصة</a>
              <a href="#" className="hover:text-white transition-colors">شروط الاستخدام</a>
              <a href="#" className="hover:text-white transition-colors">الخصوصية</a>
              <a href="#" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors bg-blue-900/30 px-4 py-2 rounded-full">
                <Mail className="w-4 h-4" />
                <span>تواصل معنا</span>
              </a>
            </div>

          </div>
          <div className="mt-12 pt-8 border-t border-slate-800 text-center text-sm text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p>© {new Date().getFullYear()} Insight Exam. منصة طلابية مفتوحة.</p>
            <p dir="ltr" className="font-mono text-xs">Built with ❤️ for Arab Students</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
