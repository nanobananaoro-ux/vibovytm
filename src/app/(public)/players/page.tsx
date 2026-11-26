import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Users } from "lucide-react";
import { formatCurrency, POSITIONS } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function PlayersPage({
  searchParams,
}: {
  searchParams: { search?: string; position?: string };
}) {
  const search = searchParams.search || "";
  const position = searchParams.position || "";

  const supabase = await createClient();
  let query = supabase
    .from("players")
    .select(`
      *,
      clubs(name, logo_url)
    `)
    .eq("is_active", true)
    .order("market_value", { ascending: false });

  if (search) {
    query = query.ilike("full_name", `%${search}%`);
  }
  if (position) {
    query = query.eq("position", position);
  }

  const { data: players } = await query;

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-vibowy-primary flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Игроки</h1>
            <p className="text-text-muted text-sm">Каталог футболистов с рыночными стоимостями</p>
          </div>
        </div>

        <form className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto" action="" method="get">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 w-4 h-4 text-text-muted" />
            <Input placeholder="Поиск игроков..." name="search" defaultValue={search} className="pl-10" />
          </div>
          <Select name="position" defaultValue={position || undefined} className="w-auto min-w-[200px]">
            <option value="">Все позиции</option>
            {POSITIONS.map((pos) => (
              <option key={pos.value} value={pos.value}>{pos.label}</option>
            ))}
          </Select>
          <Button type="submit">Применить</Button>
        </form>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {(players || []).map((player: any) => (
          <Card key={player.id} className="cursor-pointer group" onClick={() => {}}>
            <div className="relative h-48 overflow-hidden">
              <div className="w-full h-full bg-vibovy-surface flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-vibowy-primary/20 flex items-center justify-center text-vibowy-primary font-bold text-2xl">
                  {player.full_name.charAt(0)}
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-text-primary">{player.full_name}</h3>
                    <p className="text-xs text-text-secondary">{player.age} лет · {player.nationality || "—"}</p>
                  </div>
                  <span className="text-xs font-bold text-text-secondary bg-vibovy-surface border-vibovy-border px-2 py-0.5 rounded">
                    {player.position}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-4">
              <p className="text-sm text-text-secondary mb-3">{player.clubs?.name || "Без клуба"}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-text-primary">{formatCurrency(player.market_value || 0)}</span>
                <span className="text-xs text-emerald-400 font-medium">▲ 0.0%</span>
              </div>
            </div>
          </Card>
        ))}
        {(players?.length || 0) === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-vibovy-surface flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-text-muted" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">Игроки не найдены</h3>
            <p className="text-text-muted max-w-xs">Попробуйте изменить параметры поиска.</p>
          </div>
        )}
      </div>
    </div>
  );
}