import Link from "next/link";

const FOOTER_LINKS = [
  { label: "О нас", href: "/" },
  { label: "Игроки", href: "/players" },
  { label: "Клубы", href: "/clubs" },
  { label: "Лиги", href: "/leagues" },
  { label: "Рынок", href: "/market" },
  { label: "Новости", href: "/news" },
  { label: "Админ", href: "/admin/login" },
];

export function Footer() {
  return (
    <footer className="border-t border-vibovy-border bg-vibovy-dark mt-auto">
      <div className="px-4 py-8 lg:px-12">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-vibowy-primary flex items-center justify-center shadow-lg shadow-blue-500/40">
              <span className="text-xs font-bold">V</span>
            </div>
            <span className="font-bold text-lg tracking-tight text-text-primary">
              VIBOVYTM
            </span>
          </div>
          <p className="text-xs text-text-muted">
            Футбольная аналитическая платформа для сообществ ФТКЛ и ИРФФ.
          </p>
          <div className="flex gap-4 text-sm">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-text-secondary hover:text-text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-vibovy-border">
          <p className="text-xs text-text-muted">
            VIBOVYTM &trade; 2026. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
}