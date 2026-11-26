"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency, getPositionColor } from "@/lib/utils";
import { Search, Users, ArrowLeft } from "lucide-react";

export default function ComparePage() {
  const [player1, setPlayer1] = useState<any>(null);
  const [player2, setPlayer2] = useState<any>(null);
  const [search1, setSearch1] = useState("");
  const [search2, setSearch2] = useState("");
  const [results1, setResults1] = useState<any[]>([]);
  const [results2, setResults2] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const debounce = setTimeout(async () => {
      if (search1.length > 2) {
        const { data } = await supabase
          .from("players")
          .select("*, clubs(name)")
          .ilike("full_name", `%${search1}%`)
          .limit(5);
        setResults1(data || []);
      } else {
        setResults1([]);
      }
    }, 300);
    return () => clearTimeout(debounce);
  }, [search1]);

  useEffect(() => {
    const debounce = setTimeout(async () => {
      if (search2.length > 2) {
        const { data } = await supabase
          .from("players")
          .select("*, clubs(name)")
          .ilike("full_name", `%${search2}%`)
          .limit(5);
        setResults2(data || []);
      } else {
        setResults2([]);
      }
    }, 300);
    return () => clearTimeout(debounce);
  }, [search2]);

  const selectPlayer = (num: number, player: any) => {
    if (num === 1) {
      setPlayer1(player);
      setSearch1("");
      setResults1([]);
    } else {
      setPlayer2(player);
      setSearch2("");
      setResults2([]);
    }
  };

  const statRows = [
    { key: "market_value", label: "Рыночная стоимость", format: (v: number) => formatCurrency(v) },
    { key: "age", label: "Возраст", format: (v: number) => `${v} лет` },
    { key: "height_cm", label: "Рост", format: (v: number) => `${v} см` },
    { key: "weight_kg", label: "Вес", format: (v: number) => `${v} кг` },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-vibowy-primary flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Сравнение игроков</h1>
            <p className="text-text-muted text-sm">Выберите двух футболистов для сравнения статистики и стоимости</p>
          </div>
        </div>
        <Button onClick={() => { setPlayer1(null); setPlayer2(null); }} disabled={!player1 && !player2}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Сбросить
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <div className="mb-4">
            <label className="block text-sm font-medium text-text-secondary mb-2">Игрок 1</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-text-muted" />
              <Input placeholder="Поиск игрока 1..." value={search1} onChange={(e) => setSearch1(e.target.value)} className="pl-10" />
            </div>
            {results1.length > 0 && (
              <div className="absolute z-20 mt-1 w-full bg-vibovy-surface border border-vibovy-border rounded-lg shadow-xl max-h-48 overflow-y-auto">
                {results1.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => selectPlayer(1, p)}
                    className="w-full text-left px-4 py-2 hover:bg-vibovy-surface-hover transition-colors flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-vibowy-primary/20 flex items-center justify-center text-vibowy-primary text-xs font-bold">
                      {p.full_name.charAt(0)}
                    </div>
                    <span className="text-text-primary">{p.full_name}</span>
                    <span className="ml-auto text-xs text-text-muted">{p.clubs?.name || "—"}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex-1">
          <div className="mb-4">
            <label className="block text-sm font-medium text-text-secondary mb-2">Игрок 2</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-text-muted" />
              <Input placeholder="Поиск игрока 2..." value={search2} onChange={(e) => setSearch2(e.target.value)} className="pl-10" />
            </div>
            {results2.length > 0 && (
              <div className="absolute z-20 mt-1 w-full bg-vibovy-surface border border-vibovy-border rounded-lg shadow-xl max-h-48 overflow-y-auto">
                {results2.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => selectPlayer(2, p)}
                    className="w-full text-left px-4 py-2 hover:bg-vibovy-surface-hover transition-colors flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-vibowy-primary/20 flex items-center justify-center text-vibowy-primary text-xs font-bold">
                      {p.full_name.charAt(0)}
                    </div>
                    <span className="text-text-primary">{p.full_name}</span>
                    <span className="ml-auto text-xs text-text-muted">{p.clubs?.name || "—"}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {(player1 || player2) && (
        <Card>
          <div className="p-6 border-b border-vibovy-border">
            <h2 className="text-lg font-bold text-text-primary">Сравнение характеристик</h2>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="data-table w-full">
                <thead>
                  <tr>
                    <th>Показатель</th>
                    <th className="text-center">
                      {player1?.full_name || "Игрок 1"}
                      <span className="text-xs text-text-muted block">{player1?.clubs?.name || "—"}</span>
                    </th>
                    <th className="text-center">
                      {player2?.full_name || "Игрок 2"}
                      <span className="text-xs text-text-muted block">{player2?.clubs?.name || "—"}</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {statRows.map((row) => {
                    const v1 = player1?.[row.key];
                    const v2 = player2?.[row.key];
                    return (
                      <tr key={row.key}>
                        <td className="font-medium text-text-secondary">{row.label}</td>
                        <td className="text-center">
                          {v1 !== undefined && v1 !== null ? row.format(v1) : <span className="text-text-muted">—</span>}
                        </td>
                        <td className="text-center">
                          {v2 !== undefined && v2 !== null ? row.format(v2) : <span className="text-text-muted">—</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      )}

      {!player1 && !player2 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-vibovy-surface flex items-center justify-center mb-4">
            <Users className="w-10 h-10 text-text-muted" />
          </div>
          <h3 className="text-lg font-bold text-text-primary mb-2">Выберите игроков для сравнения</h3>
          <p className="text-text-muted max-w-xs">Начните вводить имена футболистов в полях поиска выше.</p>
        </div>
      )}
    </div>
  );
}