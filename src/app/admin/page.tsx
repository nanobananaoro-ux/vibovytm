import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { Users, Building2, FileText, TrendingUp, Shield } from "lucide-react";
export const dynamic = "force-dynamic"

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [playersCount, clubsCount, newsCount] = await Promise.all([
    supabase.from("players").select("id", { count: "exact", head: true }),
    supabase.from("clubs").select("id", { count: "exact", head: true }),
    supabase.from("news").select("id", { count: "exact", head: true }),
  ]);

  const { data: recentPlayers } = await supabase
    .from("players")
    .select("full_name, position, market_value, created_at, clubs(name)")
    .order("created_at", { ascending: false })
    .limit(5);

  const stats = [
    { label: "Игроков", value: playersCount.count || 0, icon: Users, color: "text-blue-400" },
    { label: "Клубов", value: clubsCount.count || 0, icon: Building2, color: "text-emerald-400" },
    { label: "Новостей", value: newsCount.count || 0, icon: FileText, color: "text-purple-400" },
    { label: "Рынок", value: "€42.5M", icon: TrendingUp, color: "text-amber-400" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Дашборд</h1>
          <p className="text-text-secondary">Обзор платформы VIBOVYTM</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm uppercase tracking-wider font-medium">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-vibovy-surface flex items-center justify-center text-lg">
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="p-6 border-b border-vibovy-border">
            <h2 className="text-lg font-bold text-text-primary mb-4">Последние добавленные игроки</h2>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="data-table w-full">
                <thead>
                  <tr>
                    <th>Игрок</th>
                    <th className="text-center">Позиция</th>
                    <th className="text-center">Клуб</th>
                    <th className="text-right">Стоимость</th>
                    <th className="text-center">Добавлен</th>
                  </tr>
                </thead>
                <tbody>
                  {(recentPlayers || []).map((p: any) => (
                    <tr key={p.full_name + p.created_at}>
                      <td className="font-medium text-text-primary">{p.full_name}</td>
                      <td className="text-center text-text-secondary">{p.position}</td>
                      <td className="text-center text-text-secondary">{p.clubs?.name || "—"}</td>
                      <td className="text-right font-mono text-text-primary">
                        {formatCurrency(p.market_value || 0)}
                      </td>
                      <td className="text-center text-xs text-text-muted">
                        {new Date(p.created_at).toLocaleDateString("ru-RU")}
                      </td>
                  </tr>
                  ))}
                  {(recentPlayers?.length || 0) === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center text-text-muted py-4">
                        Игроков пока нет. Добавьте первого через раздел "Игроки".
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6 border-b border-vibovy-border">
            <h2 className="text-lg font-bold text-text-primary mb-4">Быстрые действия</h2>
          </div>
          <div className="p-6 space-y-4">
            <a href="/admin/players" className="flex items-center gap-3 p-3 bg-vibovy-surface hover:bg-vibovy-surface-hover border border-vibovy-border rounded-lg transition-colors">
              <Users className="w-4 h-4 text-vibowy-primary" />
              <span className="text-text-primary">Управление игроками</span>
            </a>
            <a href="/admin/clubs" className="flex items-center gap-3 p-3 bg-vibovy-surface hover:bg-vibovy-surface-hover border border-vibovy-border rounded-lg transition-colors">
              <Building2 className="w-4 h-4 text-vibowy-primary" />
              <span className="text-text-primary">Управление клубами</span>
            </a>
            <a href="/admin/news" className="flex items-center gap-3 p-3 bg-vibovy-surface hover:bg-vibovy-surface-hover border border-vibovy-border rounded-lg transition-colors">
              <FileText className="w-4 h-4 text-vibowy-primary" />
              <span className="text-text-primary">Управление новостями</span>
            </a>
            <a href="/admin/market" className="flex items-center gap-3 p-3 bg-vibovy-surface hover:bg-vibovy-surface-hover border border-vibovy-border rounded-lg transition-colors">
              <TrendingUp className="w-4 h-4 text-vibowy-primary" />
              <span className="text-text-primary">Рыночные Kosten</span>
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}
