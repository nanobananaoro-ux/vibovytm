import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Search, TrendingUp, TrendingDown } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MarketPage({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  const search = searchParams.search || "";

  const supabase = await createClient();
  let query = supabase
    .from("players")
    .select(`
      *,
      clubs(name),
      player_market_value_history(value, changed_at)
    `)
    .eq("is_active", true)
    .order("market_value", { ascending: false })
    .limit(50);

  if (search) {
    query = query.ilike("full_name", `%${search}%`);
  }

  const { data: players } = await query;

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-vibowy-primary flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Рыночные Kosten</h1>
            <p className="text-text-muted text-sm">История изменений и динамика стоимости игроков</p>
          </div>
        </div>

        <form className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto" action="" method="get">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 w-4 h-4 text-text-muted" />
            <Input placeholder="Поиск игрока..." name="search" defaultValue={search} className="pl-10" />
          </div>
          <Button type="submit">Искать</Button>
        </form>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="data-table w-full">
            <thead>
              <tr>
                <th>Игрок</th>
                <th className="text-center">Клуб</th>
                <th className="text-center">Позиция</th>
                <th className="text-right">Стоимость</th>
                <th className="text-right">Изменение</th>
                <th className="text-center">Обновлено</th>
              </tr>
            </thead>
            <tbody>
              {(players || []).map((player: any) => {
                const history = player.player_market_value_history || [];
                const latest = history.length > 0 ? history[history.length - 1] : null;
                const change = latest && player.market_value ? ((player.market_value - latest.value) / latest.value) * 100 : 0;
                return (
                  <tr key={player.id}>
                    <td className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-vibovy-surface flex items-center justify-center text-xs font-bold text-text-secondary overflow-hidden">
                        {player.full_name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-text-primary font-medium">{player.full_name}</p>
                        <p className="text-xs text-text-muted">{player.clubs?.name || "—"}</p>
                      </div>
                    </td>
                    <td className="text-center text-text-secondary">{player.position}</td>
                    <td className="text-right font-mono text-text-primary">{formatCurrency(player.market_value || 0)}</td>
                    <td className="text-right">
                      <span className={`font-medium text-xs ${change > 0 ? "text-emerald-400" : change < 0 ? "text-red-400" : "text-text-muted"}`}>
                        {change > 0 ? "+" : ""}{change.toFixed(1)}%
                      </span>
                    </td>
                    <td className="text-center text-xs text-text-muted">
                      {latest ? new Date(latest.changed_at).toLocaleDateString("ru-RU") : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}