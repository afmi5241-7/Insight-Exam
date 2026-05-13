export function customFetch(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  // 1. نضع رابط سيرفرك السحابي كقاعدة أساسية
  const BASE_URL = "https://insight-exam.onrender.com";

  // 2. ندمج الرابط الأساسي مع المسار المطلوب بشكل آمن وذكي
  const finalUrl = new URL(url, BASE_URL).toString();

  // 3. نرسل الطلب للسيرفر الجديد
  return fetch(finalUrl, {
    ...options,
    credentials: "include",
  });
}
