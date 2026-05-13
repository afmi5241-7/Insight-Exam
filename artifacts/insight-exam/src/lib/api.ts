export function customFetch(url: string, options: RequestInit = {}): Promise<Response> {
  // الرابط الأساسي للسيرفر (تأكد من وجود الشرطة في النهاية)
  const BASE_URL = "https://insight-exam.onrender.com/";

  // تنظيف المسار المطلوب: إذا كان يبدأ بـ /api نمسحها عشان ما تتكرر، أو ندمجها يدوياً
  const cleanUrl = url.startsWith('/') ? url.slice(1) : url;
  const finalUrl = `${BASE_URL}${cleanUrl}`;

  console.log("Fetching from:", finalUrl); // هذا السطر بيساعدنا نتأكد في الـ Console

  return fetch(finalUrl, {
    ...options,
    credentials: "include",
  });
}