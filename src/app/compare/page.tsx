"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94d2h5dmJxZWd6b2pxZmFkcWZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTU3MDc1ODYsImV4cCI6MjExMTI4MzU4Nn0.FIbVEnVhSBWIMdXV8FpCLP6l7x3fb0xWU99j6G-ZFoU";

export const dynamic = "force-dynamic";

export default function ComparePage() {
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const url = new URL(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/players`);
        url.searchParams.set("select", "*");
        url.searchParams.set("is_active", "eq.true");
        url.searchParams.set("order", "full_name.asc");
        url.searchParams.set("limit", "100");

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
  }, []);

  const player1 = players.find((p: any) => p.full_name === p1);
  const player2 = players.find((p: any) => p.full_name === p2);

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-vibovy-primary flex items-center justify-center">
            <Search className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Сравнение игроков</h1>
            <p className="text-text-muted text-sm">Выберите двух футболистов для сравнения статистики и стоимости</p>
          </div>
        </div>
        <Button onClick={() => { setP1(""); setP2(""); }}>Сбросить</Button>
      </div>

      {loading && (
        <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vibowy-primary"></div>
          <p className="text-text-muted mt-4">Загрузка игроков…</p>
        </div>
      )}

      {!loading && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-4">
              <label className="text-sm font-medium text-text-secondary">Игрок 1</label>
              <Input
                placeholder="Выберите игрока…"
                value={p1}
                onChange={(e) => setP1(e.target.value)}
                list="players-list"
              />
              <datalist id="players-list">
                {players.map((p: any) => (
                  <option key={p.id} value={p.full_name} />
                ))}
              </datalist>
            </div>
            <div className="space-y-4">
              <label className="text-sm font-medium text-text-secondary">Игрок 2</label>
              <Input
                placeholder="Выберите игрока…"
                value={p2}
                onChange={(e) => setP2(e.target.value)}
                list="players-list-2"
              />
              <datalist id="players-list-2">
                {players.map((p: any) => (
                  <option key={p.id} value={p.full_name} />
                ))}
              </datalist>
            </div>
          </div>

          {(player1 || player2) && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card>
                <h3 className="font-bold text-text-primary mb-4 text-center">{player1?.full_name || "Выберите игрока 1"}</h3>
                {player1 && (
                  <>
                    <p className="text-text-secondary text-sm mb-2">{player1.position} · {player1.age} лет</p>
                    <p className="text-text-secondary text-sm mb-4">{player1.nationality || "—"} · {player1.clubs?.name || "—"}</p>
                    <div className="text-lg font-bold text-text-primary">{formatCurrency(player1.market_value || 0)}</div>
                  </>
                )}
              </Card>
              <Card className="lg:col-span-1 flex flex-col items-center justify-center">
                <div className="text-2xl font-bold text-vibovy-primary mb-2">VS</div>
              </Card>
              <Card>
                <h3 className="font-bold text-text-primary mb-4 text-center">{player2?.full_name || "Выберите игрока 2"}</h3>
                {player2 && (
                  <>
                    <p className="text-text-secondary text-sm mb-2">{player2.position} · {player2.age} лет</p>
                    <p className="text-text-secondary text-sm mb-4">{player2.nationality || "—"} · {player2.clubs?.name || "—"}</p>
                    <div className="text-lg font-bold text-text-primary">{formatCurrency(player2.market_value || 0)}</div>
                  </>
                )}
              </Card>
            </div>
          )}

          {!player1 && !player2 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-vibovy-surface flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-text-muted" />
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-2">Выберите игроков для сравнения</h3>
              <p className="text-text-muted max-w-xs">Начните вводить имена футболистов в полях поиска выше.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}