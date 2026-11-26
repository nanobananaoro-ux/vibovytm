"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Shield } from "lucide-react";

const ADMIN_ACCESS_CODE = "Hoks228";
const AUTH_KEY = "vibovytm_admin_auth";

export default function AdminLoginPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simple check - in production this would be validated against Supabase
    if (code === ADMIN_ACCESS_CODE) {
      localStorage.setItem(AUTH_KEY, "authenticated");
      setTimeout(() => {
        router.push("/admin");
      }, 500);
    } else {
      setError("Неверный код доступа. Попробуйте: Hoks228");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-vibovy-dark py-12 px-4">
      <Card className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="w-6 h-6 text-vibowy-primary" />
          <h2 className="text-xl font-bold text-text-primary">Вход в админ панель</h2>
        </div>
        <p className="text-text-secondary mb-6">
          Введите код доступа для управления платформой VIBOVYTM
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">Код доступа</label>
            <Input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Hoks228"
              disabled={loading}
            />
          </div>
          {error && (
            <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-400 text-sm flex items-center gap-2">
              {error}
            </div>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Вход..." : "Войти"}
          </Button>
        </form>
        <div className="mt-6 pt-6 border-t border-vibovy-border">
          <p className="text-xs text-text-muted text-center">
            Код доступа: <span className="font-mono text-vibowy-primary">Hoks228</span>
          </p>
        </div>
      </Card>
    </div>
  );
}