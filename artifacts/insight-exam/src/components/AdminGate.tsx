import { useState, useEffect, type ReactNode } from "react";
import { Shield } from "lucide-react";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

interface AdminGateProps {
  children: ReactNode;
  title?: string;
}

export default function AdminGate({ children, title = "لوحة الإدارة" }: AdminGateProps) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${BASE}/api/admin/questions?status=pending`, { credentials: "include" })
      .then(r => setIsAdmin(r.ok))
      .catch(() => setIsAdmin(false));
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${BASE}/api/admin/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setIsAdmin(true);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "كلمة المرور غير صحيحة");
      }
    } finally {
      setLoading(false);
    }
  };

  if (isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0f6ff] dark:bg-[#0a1628]">
        <div className="text-[#0f2240] dark:text-slate-200 text-sm">جارٍ التحقق...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0f6ff] dark:bg-[#0a1628] px-4">
        <div className="bg-white dark:bg-[#0f2240] rounded-2xl shadow-xl p-8 max-w-sm w-full border border-slate-100 dark:border-[#1a3a6a]/40">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1a4b8c] to-[#2d6cc0] flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-[#0f2240] dark:text-white">{title}</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">يتطلب صلاحيات الإدارة</p>
            </div>
          </div>
          <form onSubmit={handleLogin} className="space-y-3">
            <input
              type="password"
              dir="ltr"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="كلمة مرور المسؤول"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-[#1a3a6a]/60 bg-white dark:bg-[#0a1628] text-[#0f2240] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2d6cc0]"
              required
            />
            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#1a4b8c] to-[#2d6cc0] text-white font-bold hover:shadow-lg transition disabled:opacity-50"
            >
              {loading ? "جارٍ التحقق..." : "تسجيل الدخول"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
