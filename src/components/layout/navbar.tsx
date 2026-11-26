"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Menu,
  Search,
  Users,
  Trophy,
  TrendingUp,
  LogIn,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { href: "/", label: "Главная", icon: LayoutDashboard },
  { href: "/players", label: "Игроки", icon: Users },
  { href: "/clubs", label: "Клубы", icon: Users },
  { href: "/leagues", label: "Лиги", icon: Trophy },
  { href: "/compare", label: "Сравнение", icon: TrendingUp },
  { href: "/market", label: "Рыночные Kosten", icon: TrendingUp },
  { href: "/news", label: "Медиа", icon: TrendingUp },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-vibovy-border bg-vibovy-dark/95 backdrop-blur-md">
      <div className="flex items-center justify-between h-16 px-4 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="VIBOVYTM"
              className="w-9 h-9 rounded-lg object-contain"
            />
            <span className="font-bold text-xl tracking-tight text-text-primary">
              VIBOVYTM
            </span>
          </Link>
        </div>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-8 text-sm font-medium">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-2 text-text-secondary hover:text-vibovy-primary transition-colors"
            >
              <link.icon className="w-4 h-4" />
              {link.label}
            </Link>
          ))}
          <Link
            href="/admin/login"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-text-secondary hover:bg-vibovy-surface hover:text-vibowy-primary transition-colors border border-transparent hover:border-vibovy-primary/50"
          >
            <LogIn className="w-4 h-4" />
            Админ
          </Link>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-3 lg:hidden">
          <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-vibovy-border bg-vibovy-dark/95 backdrop-blur-md">
          <div className="px-4 py-4 space-y-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 text-text-secondary hover:bg-vibovy-surface hover:text-vibowy-primary rounded-lg transition-colors"
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-vibovy-border">
              <Link
                href="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 text-text-secondary hover:bg-vibovy-surface hover:text-vibowy-primary rounded-lg transition-colors border border-transparent hover:border-vibovy-primary/50"
              >
                <LogIn className="w-5 h-5" />
                Админ панель
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}