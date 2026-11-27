"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, TrendingDown, Save } from "lucide-react";

export default function AdminMarket() {
  const [players, setPlayers] = useState<any[]>([]);
  const [editingValues, setEditingValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const { data } = await supabase
      .from("players")
      .select("id, full_name, market_value, clubs(name)")
      .order("market_value", { ascending: false })
      .limit(100);
    setPlayers(data || []);
  }

  async function updateValue(playerId: string, newValue: string) {
    const numericValue = parseFloat(newValue) || 0;
    setSaving({ ...saving, [playerId]: true });
    await supabase.from("players").update({ market_value: numericValue }).eq("id", playerId);
    await supabase.from("player_market_value_history").insert([{
      player_id: playerId,
      value: numericValue,
      changed_at: new Date().toISOString(),
      source: "admin",
    }]);
    setSaving({ ...saving, [playerId]: false });
    await fetchData();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Рыночные Kosten</h1>
          <p className="text-text-secondary">Редактирование рыночных стоимостей игроков с сохранением истории</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="data-table w-full">
          <thead>
            <tr>
              <th>Игрок</th>
              <th className="text-center">Клуб</th>
              <th className="text-right">Текущая стоимость</th>
              <th className="text-center">Новая стоимость (€)</th>
              <th className="text-center">Действие</th>
            </tr>
          </thead>
          <tbody>
            {players.map((p) => (
              <tr key={p.id}>
                <td className="font-medium text-text-primary">{p.full_name}</td>
                <td className="text-center text-text-secondary">{p.clubs?.name || "—"}</td>
                <td className="text-right font-mono text-text-primary">{formatCurrency(p.market_value || 0)}</td>
                <td className="text-center">
                  <Input
                    type="number"
                    value={editingValues[p.id] || ""}
                    onChange={(e) => setEditingValues({ ...editingValues, [p.id]: e.target.value })}
                    className="w-full text-center"
                  />
                </td>
                <td className="text-center">
                  {saving[p.id] ? (
                    <Save className="w-4 h-4 animate-spin" />
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateValue(p.id, editingValues[p.id] || "0")}
                      disabled={!editingValues[p.id]}
                    >
                      Сохранить
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 p-6 bg-vibovy-surface border border-vibovy-border rounded-lg">
        <h3 className="font-bold text-text-primary mb-3">Как работает редактирование:</h3>
        <ul className="text-text-secondary text-sm space-y-2 list-disc pl-5">
          <li>Изменяйте стоимость в поле "Новая стоимость" и нажмите "Сохранить"</li>
          <li>Все изменения записываются в историю рыночной стоимости игрока</li>
          <li>История доступна на профиле игрока для отслеживания динамики</li>
        </ul>
      </div>
    </div>
  );
}