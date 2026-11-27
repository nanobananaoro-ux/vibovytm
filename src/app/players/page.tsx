"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Users } from "lucide-react";
import { formatCurrency, POSITIONS } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default function PlayersPage({
  searchParams,
}: {
  searchParams: { search?: string; position?: string };
}) {
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const search = searchParams.search || "";
  const position = searchParams.position || "";

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94d2h5dmJxZWd6b2pxZmFkcWZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTU3MDc1ODYsImV4cCI6MjExMTI4MzU4Nn0.FIbVEnVhSBWIMdXV8FpCLP6l7x3fb0xWU99j6G-ZFoU";
        const url = new URL(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/players`);
        url.searchParams.set("select", "*,clubs(name, logo_url)");
        url.searchParams.set("is_active", "eq.true");
        url.searchParams.set("order", "market_value.desc");
        if (search) url.searchParams.set("full_name", `ilike.%${search}%`);
        if (position) url.searchParams.set("position", `eq.${position}`);

        const res = await fetch(url.toString(), {
          headers: {
            apikey: ANON_KEY,
            Authorization: `Bearer ${ANON_KEY}`,
          },
        });
        const data = await res.json();
        setPlayers(data || []);
      } catch (e) {
        console.error("Fetch error:", e);
        setPlayers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, [search, position]);

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

        <form className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto" onSubmit={(e) => e.preventDefault()}>
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 w-4 h-4 text-text-muted" />
            <Input placeholder="Поиск игроков..." defaultValue={search} className="pl-10" />
          </div>
          <Select defaultValue={position || undefined} className="w-auto min-w-[200px]">
            <option value="">Все позиции</option>
            {POSITIONS.map((pos) => (
              <option key={pos.value} value={pos.value}>{pos.label}</option>
            ))}
          </Select>
          <Button type="submit">Применить</Button>
        </form>
      </div>

      {loading && (
        <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vibowy-primary"></div>
          <p className="text-text-muted mt-4">Загрузка игроков…</p>
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {players.map((player: any) => (
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
          {players.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-vibovy-surface flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-text-muted" />
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-2">Игроки не найдены</h3>
              <p className="text-text-muted max-w-xs">Попробуйте изменить параметры поиска.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}