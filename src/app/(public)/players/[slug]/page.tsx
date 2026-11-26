import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, getPositionColor } from "@/lib/utils";
import Link from "next/link";
import { Mail, Calendar, MapPin, Shield, ArrowLeft, TrendingUp, TrendingDown } from "lucide-react";
export const dynamic = "force-dynamic"

export const metadata = {
  title: "Игрок — VIBOVYTM",
};

export default async function PlayerProfilePage({
  params,
}: {
  params: { slug: string };
}) {
  const supabase = await createClient();

  const { data: player, error } = await supabase
    .from("players")
    .select(`
      *,
      clubs(name, logo_url),
      player_club_history(
        *,
        clubs(name, logo_url)
      ),
      player_market_value_history(*)
    `)
    .eq("slug", params.slug)
    .eq("is_active", true)
    .single();

  if (error || !player) return notFound();

  const positionColor = getPositionColor(player.position);
  const marketHistory = (player.player_market_value_history || [])
    .sort((a: any, b: any) => new Date(a.changed_at).getTime() - new Date(b.changed_at).getTime());

  const clubHistory = (player.player_club_history || [])
    .filter((h: any) => h.is_current)
    .map((h: any) => h.clubs);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="h-64 w-full rounded-2xl overflow-hidden border border-vibovy-border bg-vibovy-surface">
            {player.image_url ? (
              <img src={player.image_url} alt={player.full_name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-vibovy-surface flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-vibowy-primary/20 flex items-center justify-center text-vibowy-primary font-bold text-4xl">
                  {player.full_name.charAt(0)}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex-grow">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-text-primary mb-1">{player.full_name}</h1>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className={positionColor}>
                  {player.position}
                </Badge>
                {player.age && (
                  <span className="text-text-muted text-sm">{player.age} лет</span>
                )}
              </div>
              <div className="flex items-center gap-1 text-text-secondary">
                <MapPin className="w-4 h-4" />
                <span>{player.nationality || "—"}</span>
              </div>
            </div>
            <Link href="/players" className="text-sm text-vibowy-primary hover:text-blue-400 flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Назад к списку
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card className="p-4">
              <p className="text-text-muted text-xs uppercase tracking-wider font-medium">Рыночная стоимость</p>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-2xl font-bold text-text-primary">
                  {formatCurrency(player.market_value || 0)}
                </span>
                <span className="text-emerald-400 font-medium text-xs">
                  <TrendingUp className="w-3 h-3" /> 0.0%
                </span>
              </div>
            </Card>
            <Card className="p-4">
              <p className="text-text-muted text-xs uppercase tracking-wider font-medium">Клуб</p>
              <p className="mt-2 font-bold text-text-primary">
                {player.clubs?.name || "Без клуба"}
              </p>
            </Card>
            <Card className="p-4">
              <p className="text-text-muted text-xs uppercase tracking-wider font-medium">Последнее обновление</p>
              <p className="mt-2 text-text-muted text-sm">Сегодня</p>
            </Card>
          </div>

          <div className="flex gap-4">
            <Button className="flex-1">Отслеживать игрока</Button>
            <Button variant="outline" className="flex-1">Сравнить</Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="col-span-1 lg:col-span-3">
          <div className="p-6 border-b border-vibovy-border">
            <h2 className="text-lg font-bold text-text-primary mb-4">Статистика сезона</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-text-primary">24</div>
                <div className="text-text-muted text-sm uppercase">Матчи</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-text-primary">12</div>
                <div className="text-text-muted text-sm uppercase">Голы</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-text-primary">8</div>
                <div className="text-text-muted text-sm uppercase">Ассисты</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-text-primary">2100'</div>
                <div className="text-text-muted text-sm uppercase">Минуты</div>
              </div>
            </div>
          </div>
          <div className="p-6">
            <h3 className="font-bold text-text-primary mb-4">Подробная статистика</h3>
            <div className="overflow-x-auto">
              <table className="data-table w-full">
                <thead>
                  <tr>
                    <th>Показатель</th>
                    <th className="text-center">Значение</th>
                    <th className="text-center">Среднее за матч</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Голы</td>
                    <td className="text-center font-bold text-text-primary">12</td>
                    <td className="text-center text-text-muted">0.67</td>
                  </tr>
                  <tr>
                    <td>Ассисты</td>
                    <td className="text-center font-bold text-text-primary">8</td>
                    <td className="text-center text-text-muted">0.44</td>
                  </tr>
                  <tr>
                    <td>Удары в створ</td>
                    <td className="text-center font-bold text-text-primary">45</td>
                    <td className="text-center text-text-muted">2.50</td>
                  </tr>
                  <tr>
                    <td>Точность передач, %</td>
                    <td className="text-center font-bold text-text-primary">82.4</td>
                    <td className="text-center text-text-muted">—</td>
                  </tr>
                  <tr>
                    <td>Дриблинги</td>
                    <td className="text-center font-bold text-text-primary">34</td>
                    <td className="text-center text-text-muted">1.89</td>
                  </tr>
                  <tr>
                    <td>Перехваты</td>
                    <td className="text-center font-bold text-text-primary">18</td>
                    <td className="text-center text-text-muted">1.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Card>

        <Card className="col-span-1 lg:col-span-1">
          <div className="p-6">
            <h2 className="text-lg font-bold text-text-primary mb-4">Достижения</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-vibovy-dark rounded-lg">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium text-text-primary">Чемпион Казахстана</p>
                  <p className="text-xs text-text-muted">2024</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-vibovy-dark rounded-lg">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium text-text-primary">Обладатель Кубка</p>
                  <p className="text-xs text-text-muted">2023</p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-6 border-t border-vibovy-border">
            <h3 className="font-bold text-text-primary mb-3">История рыночной стоимости</h3>
            <div className="space-y-2">
              {marketHistory.slice(-5).map((h: any) => (
                <div key={h.id} className="flex items-center justify-between py-1">
                  <span className="text-xs text-text-muted">
                    {new Date(h.changed_at).toLocaleDateString("ru-RU", { month: "short", year: "numeric" })}
                  </span>
                  <span className="text-xs font-mono text-text-primary">
                    €{(h.value / 1000000).toFixed(1)}M
                  </span>
                </div>
              ))}
              {marketHistory.length === 0 && (
                <p className="text-xs text-text-muted italic">История изменений недоступна</p>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Club History */}
      <Card>
        <div className="p-6 border-b border-vibovy-border">
          <h2 className="text-lg font-bold text-text-primary mb-4">История клубов</h2>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="data-table w-full">
              <thead>
                <tr>
                  <th>Клуб</th>
                  <th className="text-center">Период</th>
                  <th className="text-center">Стоимость перехода</th>
                  <th className="text-center">Статус</th>
                </tr>
              </thead>
              <tbody>
                {(player.player_club_history || []).map((h: any) => (
                  <tr key={h.id}>
                    <td className="flex items-center gap-2">
                      {h.clubs?.logo_url ? (
                        <img src={h.clubs.logo_url} alt={h.clubs.name} className="w-6 h-6 rounded" />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-vibowy-primary/20 flex items-center justify-center text-vibowy-primary text-xs font-bold">
                          {h.clubs?.name.charAt(0)}
                        </div>
                      )}
                      <span className="text-text-primary">{h.clubs?.name || "Неизвестный клуб"}</span>
                    </td>
                    <td className="text-center text-text-secondary">
                      {h.joined_at ? new Date(h.joined_at).toLocaleDateString("ru-RU", { year: "numeric" }) : "—"}
                      {h.left_at ? ` – ${new Date(h.left_at).toLocaleDateString("ru-RU", { year: "numeric" })}` : " — настоящее время"}
                    </td>
                    <td className="text-center text-text-secondary">
                      {h.transfer_fee ? formatCurrency(h.transfer_fee) : "—"}
                    </td>
                    <td className="text-center">
                      <Badge variant={h.is_current ? "success" : "outline"} className="text-xs">
                        {h.is_current ? "Текущий клуб" : "Бывший клуб"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
}
