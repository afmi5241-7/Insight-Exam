export function customFetch(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  // 1. رابط السيرفر الصافي بدون أي زيادات
  const BASE_URL = "https://insight-exam.onrender.com";

  // 2. تنظيف الـ url القادم (نضمن إنه يبدأ بـ /api)
  const path = url.startsWith("/") ? url : `/${url}`;

  // 3. الدمج اليدوي الصريح
  const finalUrl = `${BASE_URL}${path}`;

  return fetch(finalUrl, {
    ...options,
    credentials: "include",
  });
}
