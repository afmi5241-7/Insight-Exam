import React, { useState } from 'react';
import { Button } from '../../ui/button';
import { 
  Search, 
  UploadCloud, 
  BarChart3, 
  ShieldCheck, 
  Users, 
  LineChart,
  ChevronDown,
  Mail,
  ArrowLeft
} from 'lucide-react';

export function DeepRich() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      question: "هل أحتاج إلى التسجيل لاستخدام الموقع؟",
      answer: "لا، يمكنك البحث عن الأسئلة وعرض التحليلات بدون الحاجة لإنشاء حساب. نحن نؤمن بسهولة الوصول للمعلومة."
    },
    {
      question: "كيف يتم التحقق من صحة الأسئلة المضافة؟",
      answer: "نعتمد على ذكاء المجتمع الطلابي؛ يمكن للطلاب الإبلاغ عن الأسئلة غير الدقيقة، ويقوم فريقنا بمراجعتها دورياً للحفاظ على جودة المحتوى."
    },
    {
      question: "هل المنصة مجانية بالكامل؟",
      answer: "نعم، Insight Exam مجانية بالكامل وستظل كذلك. هدفنا هو مساعدة الطلاب على الاستعداد للاختبارات بأفضل شكل ممكن."
    }
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-[#0a0f1e] text-slate-200 font-sans" style={{ fontFamily: 'Tajawal, sans-serif' }}>
      
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-600/10 blur-[100px] rounded-full mix-blend-screen" />
      </div>

      <div className="relative z-10">
        {/* Navbar */}
        <nav className="border-b border-white/5 bg-[#0a0f1e]/80 backdrop-blur-md sticky top-0 z-50">
          <div className="container mx-auto px-4 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 flex items-center justify-center bg-blue-600 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.5)]">
                <BarChart3 className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-bold text-white tracking-wide">Insight<span className="text-blue-400">Exam</span></span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
              <a href="#" className="hover:text-white transition-colors">الرئيسية</a>
              <a href="#" className="hover:text-white transition-colors">كيف نعمل</a>
              <a href="#" className="hover:text-white transition-colors">المميزات</a>
              <a href="#" className="hover:text-white transition-colors">الأسئلة الشائعة</a>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-500 text-white border-0 shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all hover:shadow-[0_0_25px_rgba(37,99,235,0.6)] rounded-full px-6">
              ابدأ الآن
            </Button>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 text-center relative overflow-hidden">
          <div className="container mx-auto max-w-5xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-900/30 border border-blue-500/30 text-blue-300 text-sm mb-8 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              منصة التحليلات الطلابية الأولى
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-8 leading-[1.2]">
              استعد لاختباراتك <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-blue-400 to-cyan-300">بذكاء وتحليل دقيق</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              اكتشف أنماط الأسئلة، وتعرف على المواضيع الأكثر تكراراً، وشارك مع زملائك في بناء أكبر قاعدة بيانات للأسئلة الجامعية.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="h-14 px-8 text-lg bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] transition-all w-full sm:w-auto flex items-center gap-2 group">
                تصفح الأسئلة
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-white/10 hover:bg-white/5 text-white bg-white/5 backdrop-blur-sm rounded-full w-full sm:w-auto">
                شارك سؤالاً
              </Button>
            </div>
          </div>
        </section>

        {/* About / Stats Bar */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#0d152a]/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-cyan-500/5"></div>
              
              <div className="relative flex flex-col items-center text-center gap-3 p-4">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 mb-2 shadow-[0_0_15px_rgba(37,99,235,0.2)]">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">مجهول تماماً</h3>
                <p className="text-sm text-slate-400">لا نطلب تسجيل دخول، هويتك محمية دائماً</p>
              </div>
              
              <div className="relative flex flex-col items-center text-center gap-3 p-4 md:border-r md:border-white/5">
                <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-2 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">ذكاء جماعي</h3>
                <p className="text-sm text-slate-400">محتوى مبني بالكامل من قبل الطلاب وللطلاب</p>
              </div>
              
              <div className="relative flex flex-col items-center text-center gap-3 p-4 md:border-r md:border-white/5">
                <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-2 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                  <LineChart className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">تحليلات دقيقة</h3>
                <p className="text-sm text-slate-400">بيانات واضحة عن تكرار الأسئلة والمواضيع</p>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="py-24 px-4 relative">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">كيف تعمل المنصة؟</h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">ثلاث خطوات بسيطة تفصلك عن الاستعداد الأمثل لاختباراتك القادمة</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connection Line */}
              <div className="hidden md:block absolute top-24 right-[15%] left-[15%] h-[2px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
              
              <div className="relative group">
                <div className="bg-[#121b33]/60 backdrop-blur-md border border-white/5 hover:border-blue-500/30 rounded-3xl p-8 pt-12 text-center transition-all duration-300 hover:shadow-[0_0_30px_rgba(37,99,235,0.15)] overflow-hidden h-full">
                  <div className="absolute -top-10 -right-4 text-9xl font-black text-blue-500/5 select-none transition-transform group-hover:scale-110">1</div>
                  <div className="w-20 h-20 mx-auto bg-blue-900/40 border border-blue-500/30 rounded-2xl flex items-center justify-center text-blue-400 mb-6 shadow-[0_0_20px_rgba(37,99,235,0.2)] relative z-10 rotate-3 group-hover:rotate-0 transition-transform">
                    <Search className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 relative z-10">ابحث عن المادة</h3>
                  <p className="text-slate-400 relative z-10">استخدم شريط البحث للعثور على المادة التي تريد دراستها بسهولة وسرعة.</p>
                </div>
              </div>
              
              <div className="relative group mt-0 md:mt-12">
                <div className="bg-[#121b33]/60 backdrop-blur-md border border-white/5 hover:border-cyan-500/30 rounded-3xl p-8 pt-12 text-center transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] overflow-hidden h-full">
                  <div className="absolute -top-10 -right-4 text-9xl font-black text-cyan-500/5 select-none transition-transform group-hover:scale-110">2</div>
                  <div className="w-20 h-20 mx-auto bg-cyan-900/40 border border-cyan-500/30 rounded-2xl flex items-center justify-center text-cyan-400 mb-6 shadow-[0_0_20px_rgba(6,182,212,0.2)] relative z-10 -rotate-3 group-hover:rotate-0 transition-transform">
                    <BarChart3 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 relative z-10">حلل البيانات</h3>
                  <p className="text-slate-400 relative z-10">اطلع على الرسوم البيانية لمعرفة الأسئلة والمواضيع الأكثر تكراراً في السنوات السابقة.</p>
                </div>
              </div>
              
              <div className="relative group mt-0 md:mt-24">
                <div className="bg-[#121b33]/60 backdrop-blur-md border border-white/5 hover:border-indigo-500/30 rounded-3xl p-8 pt-12 text-center transition-all duration-300 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] overflow-hidden h-full">
                  <div className="absolute -top-10 -right-4 text-9xl font-black text-indigo-500/5 select-none transition-transform group-hover:scale-110">3</div>
                  <div className="w-20 h-20 mx-auto bg-indigo-900/40 border border-indigo-500/30 rounded-2xl flex items-center justify-center text-indigo-400 mb-6 shadow-[0_0_20px_rgba(99,102,241,0.2)] relative z-10 rotate-3 group-hover:rotate-0 transition-transform">
                    <UploadCloud className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 relative z-10">شارك المعرفة</h3>
                  <p className="text-slate-400 relative z-10">أضف أسئلة جديدة من اختباراتك لمساعدة زملائك في الدفعات القادمة.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Cards */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
            <div 
              className="group p-1 rounded-3xl bg-gradient-to-br from-blue-600/30 to-transparent overflow-hidden transition-all duration-500 hover:shadow-[0_0_40px_rgba(37,99,235,0.3)] cursor-pointer"
            >
              <div className="bg-[#0f172a] h-full rounded-[23px] p-8 md:p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl group-hover:bg-blue-600/20 transition-colors"></div>
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <div className="w-14 h-14 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 mb-6">
                      <Search className="w-7 h-7" />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-4">هل لديك اختبار قريب؟</h3>
                    <p className="text-slate-400 text-lg mb-8">
                      ابحث في قاعدة بياناتنا الواسعة عن أسئلة السنوات السابقة واستعد بناءً على تحليلات دقيقة.
                    </p>
                  </div>
                  <Button className="w-fit bg-blue-600 hover:bg-blue-500 text-white rounded-full px-8 py-6 text-lg shadow-[0_0_15px_rgba(37,99,235,0.4)]">
                    تصفح بنك الأسئلة
                  </Button>
                </div>
              </div>
            </div>

            <div 
              className="group p-1 rounded-3xl bg-gradient-to-br from-cyan-600/30 to-transparent overflow-hidden transition-all duration-500 hover:shadow-[0_0_40px_rgba(6,182,212,0.3)] cursor-pointer"
            >
              <div className="bg-[#0f172a] h-full rounded-[23px] p-8 md:p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-600/10 rounded-full blur-3xl group-hover:bg-cyan-600/20 transition-colors"></div>
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <div className="w-14 h-14 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 mb-6">
                      <UploadCloud className="w-7 h-7" />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-4">هل أنهيت اختبارك للتو؟</h3>
                    <p className="text-slate-400 text-lg mb-8">
                      ساهم في مساعدة زملائك من خلال إضافة الأسئلة التي تذكرتها من اختبارك الأخير.
                    </p>
                  </div>
                  <Button className="w-fit bg-cyan-600 hover:bg-cyan-500 text-white rounded-full px-8 py-6 text-lg shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                    أضف سؤالاً جديداً
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 px-4">
          <div className="container mx-auto max-w-3xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">الأسئلة الشائعة</h2>
              <p className="text-slate-400 text-lg">كل ما تحتاج معرفته عن منصة Insight Exam</p>
            </div>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div 
                  key={index}
                  className={`bg-[#121b33]/40 border ${openFaq === index ? 'border-blue-500/50' : 'border-white/5'} rounded-2xl overflow-hidden transition-all duration-300`}
                >
                  <button 
                    className="w-full text-right px-6 py-5 flex items-center justify-between focus:outline-none"
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  >
                    <span className="font-bold text-lg text-white">{faq.question}</span>
                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${openFaq === index ? 'rotate-180 text-blue-400' : ''}`} />
                  </button>
                  
                  <div 
                    className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openFaq === index ? 'max-h-48 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                    <div className="border-r-2 border-blue-500 pr-4 py-1 text-slate-300">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact/Footer Section */}
        <section className="py-20 px-4 border-t border-white/5 bg-[#0a0f1e]/50 relative">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
          <div className="container mx-auto text-center max-w-2xl">
            <div className="w-16 h-16 mx-auto bg-blue-900/30 rounded-full flex items-center justify-center text-blue-400 mb-6 shadow-[0_0_30px_rgba(37,99,235,0.15)]">
              <Mail className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">هل لديك استفسار أو اقتراح؟</h2>
            <p className="text-slate-400 text-lg mb-8">
              نحن دائماً نستمع للطلاب لكي نحسن من تجربتهم ونجعل المنصة أفضل.
            </p>
            <Button size="lg" className="bg-[#121b33] border border-white/10 hover:border-blue-500/50 hover:bg-[#1a264a] text-white rounded-full px-8 shadow-[0_0_15px_rgba(37,99,235,0.1)] hover:shadow-[0_0_25px_rgba(37,99,235,0.25)] transition-all flex items-center gap-2 mx-auto">
              <Mail className="w-4 h-4" />
              تواصل معنا
            </Button>
            
            <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-slate-500 text-sm gap-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-500" />
                <span className="font-bold text-slate-300">Insight<span className="text-blue-500">Exam</span></span>
                <span>© 2024 جميع الحقوق محفوظة</span>
              </div>
              <div className="flex gap-4">
                <a href="#" className="hover:text-white transition-colors">شروط الاستخدام</a>
                <a href="#" className="hover:text-white transition-colors">سياسة الخصوصية</a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
