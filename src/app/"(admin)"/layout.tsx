"use client"
import { AdminGuard } from "@/components/admin/admin-guard";
import Link from "next/link";
import { useState } from "react";
import { LogOut, LayoutDashboard, Users, Building2, FileText, TrendingUp, Settings } from "lucide-react";

const ADMIN_NAV = [
  { href: "/admin", label: "Дашборд", icon: LayoutDashboard },
  { href: "/admin/players", label: "Игроки", icon: Users },
  { href: "/admin/clubs", label: "Клубы", icon: Building2 },
  { href: "/admin/news", label: "Новости", icon: FileText },
  { href: "/admin/market", label: "Рынок", icon: TrendingUp },
  { href: "/admin/settings", label: "Настройки", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <AdminGuard>
      <div className="flex h-screen bg-vibovy-dark">
        <aside
          className={`w-64 bg-vibovy-surface border-r border-vibovy-border flex flex-col transition-all duration-300 ${
            collapsed ? "w-16" : "w-64"
          }`}
        >
          <div className="h-16 border-b border-vibovy-border flex items-center justify-center px-4">
            <span className={`font-bold text-xl tracking-tight text-text-primary ${collapsed ? "hidden" : "block"}`}>
              VIBOVYTM
            </span>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 text-text-secondary hover:text-text-primary"
            >
              <span className={collapsed ? "text-right w-4 h-4" : "text-left w-4 h-4"}>
                {collapsed ? "»" : "«"}
              </span>
            </button>
          </div>
          <nav className="flex-1 py-4 space-y-1">
            {ADMIN_NAV.map((item) => {
              const isActive =
                typeof window !== "undefined" && window.location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                    collapsed ? "justify-center px-2" : ""
                  } ${isActive ? "bg-vibowy-primary text-white" : "text-text-secondary hover:text-text-primary hover:bg-vibovy-surface-hover"}`}
                >
                  <item.icon className={`w-5 h-5 ${collapsed ? "mx-auto" : ""}`} />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t border-vibovy-border">
            <button
              onClick={() => {
                localStorage.removeItem("vibovytm_admin_auth");
                window.location.href = "/admin/login";
              }}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                collapsed ? "justify-center px-2" : ""
              } text-red-400 hover:bg-red-900/20`}
            >
              <LogOut className={`w-5 h-5 ${collapsed ? "mx-auto" : ""}`} />
              {!collapsed && "Выйти"}
            </button>
          </div>
        </aside>

        <div className="flex-1 overflow-y-auto bg-vibovy-dark">
          <main className="p-8 lg:p-12">{children}</main>
        </div>
      </div>
    </AdminGuard>
  );
}