"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, AlertTriangle } from "lucide-react";

const ADMIN_ACCESS_CODE = "Hoks228";
const AUTH_KEY = "vibovytm_admin_auth";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem(AUTH_KEY);
    setIsAuthenticated(token === "authenticated");
  }, []);

  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-vibovy-dark">
        <Card className="w-full max-w-md p-8">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-6 h-6 text-vibowy-primary" />
            <h2 className="text-xl font-bold text-text-primary">Админ панель VIBOVYTM</h2>
          </div>
          <p className="text-text-secondary mb-6">Введите код доступа для входа</p>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const code = formData.get("code") as string;
            if (code === ADMIN_ACCESS_CODE) {
              localStorage.setItem(AUTH_KEY, "authenticated");
              setIsAuthenticated(true);
              setShowLogin(false);
              setError("");
              router.push("/admin");
            } else {
              setError("Неверный код доступа");
            }
          }}>
            <Input
              type="text"
              name="code"
              placeholder="Код доступа"
              className="mb-4"
            />
            {error && (
              <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-400 text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                {error}
              </div>
            )}
            <Button type="submit" className="w-full">
              Войти
            </Button>
          </form>
          <p className="mt-6 text-xs text-text-muted text-center">
            Код доступа: Hoks228
          </p>
        </Card>
      </div>
    );
  }

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-vibovy-dark">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vibowy-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-vibovy-surface border border-vibovy-border rounded-xl ${className}`}>
      {children}
    </div>
  );
}