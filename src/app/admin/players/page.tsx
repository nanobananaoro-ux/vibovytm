"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, POSITIONS } from "@/lib/utils";
import { Plus, Trash2, Edit, Save, Search } from "lucide-react";

export default function AdminPlayers() {
  const [players, setPlayers] = useState<any[]>([]);
  const [clubs, setClubs] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({
    full_name: "",
    position: "ST",
    club_id: "",
    market_value: "",
    age: "",
    nationality: "",
    image_url: "",
    date_of_birth: "",
  });
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const [pRes, cRes] = await Promise.all([
      supabase.from("players").select("*, clubs(name)").order("market_value", { ascending: false }),
      supabase.from("clubs").select("id, name").order("name"),
    ]);
    setPlayers(pRes.data || []);
    setClubs(cRes.data || []);
  }

  const filteredPlayers = players.filter((p) =>
    p.full_name.toLowerCase().includes(search.toLowerCase())
  );

  async function savePlayer() {
    setLoading(true);
    if (editing) {
      await supabase.from("players").update(form).eq("id", editing);
    } else {
      await supabase.from("players").insert([form]);
    }
    setEditing(null);
    setForm({
      full_name: "", position: "ST", club_id: "", market_value: "", age: "",
      nationality: "", image_url: "", date_of_birth: "",
    });
    await fetchData();
    setLoading(false);
  }

  async function deletePlayer(id: string) {
    if (confirm("Удалить игрока?")) {
      await supabase.from("players").delete().eq("id", id);
      await fetchData();
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Управление игроками</h1>
          <p className="text-text-secondary">Добавление, редактирование и удаление футболистов</p>
        </div>
        <Button onClick={() => { setEditing(null); setForm({ full_name: "", position: "ST", club_id: "", market_value: "", age: "", nationality: "", image_url: "", date_of_birth: "" }); }}>
          <Plus className="w-4 h-4 mr-2" /> Новый игрок
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-3 w-4 h-4 text-text-muted" />
          <Input
            placeholder="Поиск игроков..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {editing ? (
        <Card className="mt-4">
          <div className="p-6 border-b border-vibovy-border">
            <h2 className="text-lg font-bold text-text-primary">Редактирование игрока</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Имя</label>
                <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Позиция</label>
                <Select value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })}>
                  {POSITIONS.map((pos) => (
                    <option key={pos.value} value={pos.value}>{pos.label}</option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Клуб</label>
                <Select value={form.club_id} onChange={(e) => setForm({ ...form, club_id: e.target.value })}>
                  <option value="">Без клуба</option>
                  {clubs.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Рыночная стоимость (€)</label>
                <Input type="number" value={form.market_value} onChange={(e) => setForm({ ...form, market_value: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Возраст</label>
                <Input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Гражданство</label>
                <Input value={form.nationality} onChange={(e) => setForm({ ...form, nationality: e.target.value })} />
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={savePlayer} disabled={loading}>{loading ? "Сохранение..." : "Сохранить"}</Button>
              <Button variant="outline" onClick={() => { setEditing(null); setForm({ full_name: "", position: "ST", club_id: "", market_value: "", age: "", nationality: "", image_url: "", date_of_birth: "" }); }}>Отмена</Button>
            </div>
          </div>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="data-table w-full">
            <thead>
              <tr>
                <th>Игрок</th>
                <th className="text-center">Позиция</th>
                <th className="text-center">Клуб</th>
                <th className="text-right">Стоимость</th>
                <th className="text-center">Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredPlayers.map((p) => (
                <tr key={p.id}>
                  <td className="font-medium text-text-primary">{p.full_name}</td>
                  <td className="text-center text-text-secondary">{p.position}</td>
                  <td className="text-center text-text-secondary">{p.clubs?.name || "—"}</td>
                  <td className="text-right font-mono text-text-primary">{formatCurrency(p.market_value || 0)}</td>
                  <td className="text-center">
                    <Button variant="ghost" size="sm" onClick={() => { setEditing(p.id); setForm({ full_name: p.full_name, position: p.position, club_id: p.club_id || "", market_value: String(p.market_value || 0), age: String(p.age || ""), nationality: p.nationality || "", image_url: p.image_url || "", date_of_birth: p.date_of_birth || "" }); }}>
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => deletePlayer(p.id)} className="text-red-400 hover:text-red-300">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}