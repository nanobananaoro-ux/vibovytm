"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import { Plus, Trash2, Edit } from "lucide-react";

export default function AdminClubs() {
  const [clubs, setClubs] = useState<any[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "", short_name: "", logo_url: "", founded_year: "",
    stadium: "", city: "", country: "", description: "", history: "", league_id: "",
  });
  const [leagues, setLeagues] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const [cRes, lRes] = await Promise.all([
      supabase.from("clubs").select("*, leagues(name)").order("name"),
      supabase.from("leagues").select("id, name").order("name"),
    ]);
    setClubs(cRes.data || []);
    setLeagues(lRes.data || []);
  }

  async function saveClub() {
    setLoading(true);
    if (editing) {
      await supabase.from("clubs").update(form).eq("id", editing);
    } else {
      await supabase.from("clubs").insert([form]);
    }
    setEditing(null);
    setForm({ name: "", short_name: "", logo_url: "", founded_year: "", stadium: "", city: "", country: "", description: "", history: "", league_id: "" });
    await fetchData();
    setLoading(false);
  }

  async function deleteClub(id: string) {
    if (confirm("Удалить клуб?")) {
      await supabase.from("clubs").delete().eq("id", id);
      await fetchData();
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Управление клубами</h1>
          <p className="text-text-secondary">Добавление, редактирование и удаление клубов</p>
        </div>
        <Button onClick={() => { setEditing(null); setForm({ name: "", short_name: "", logo_url: "", founded_year: "", stadium: "", city: "", country: "", description: "", history: "", league_id: "" }); }}>
          <Plus className="w-4 h-4 mr-2" /> Новый клуб
        </Button>
      </div>

      {editing ? (
        <Card className="mt-4">
          <div className="p-6 border-b border-vibovy-border">
            <h2 className="text-lg font-bold text-text-primary">Редактирование клуба</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Название</label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Короткое имя</label>
                <Input value={form.short_name} onChange={(e) => setForm({ ...form, short_name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Лига</label>
                <SelectAdmin value={form.league_id} onChange={(v) => setForm({ ...form, league_id: v })}>
                  <option value="">Без лиги</option>
                  {leagues.map((l) => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                  ))}
                </SelectAdmin>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Город</label>
                <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Год основания</label>
                <Input type="number" value={form.founded_year} onChange={(e) => setForm({ ...form, founded_year: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Стадион</label>
                <Input value={form.stadium} onChange={(e) => setForm({ ...form, stadium: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Страна</label>
              <Input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Логотип (URL)</label>
              <Input value={form.logo_url} onChange={(e) => setForm({ ...form, logo_url: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Описание</label>
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">История</label>
              <Input value={form.history} onChange={(e) => setForm({ ...form, history: e.target.value })} />
            </div>
            <div className="flex gap-3">
              <Button onClick={saveClub} disabled={loading}>{loading ? "Сохранение..." : "Сохранить"}</Button>
              <Button variant="outline" onClick={() => { setEditing(null); setForm({ name: "", short_name: "", logo_url: "", founded_year: "", stadium: "", city: "", country: "", description: "", history: "", league_id: "" }); }}>Отмена</Button>
            </div>
          </div>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="data-table w-full">
            <thead>
              <tr>
                <th>Клуб</th>
                <th className="text-center">Лига</th>
                <th className="text-center">Город</th>
                <th className="text-right">Стоимость состава</th>
                <th className="text-center">Действия</th>
              </tr>
            </thead>
            <tbody>
              {clubs.map((c) => (
                <tr key={c.id}>
                  <td className="font-medium text-text-primary">{c.name}</td>
                  <td className="text-center text-text-secondary">{c.leagues?.name || "—"}</td>
                  <td className="text-center text-text-secondary">{c.city || "—"}</td>
                  <td className="text-right font-mono text-text-primary">{formatCurrency(c.average_market_value || 0)}</td>
                  <td className="text-center">
                    <Button variant="ghost" size="sm" onClick={() => { setEditing(c.id); setForm({ name: c.name, short_name: c.short_name || "", logo_url: c.logo_url || "", founded_year: String(c.founded_year || ""), stadium: c.stadium || "", city: c.city || "", country: c.country || "", description: c.description || "", history: c.history || "", league_id: c.league_id || "" }); }}>
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteClub(c.id)} className="text-red-400 hover:text-red-300">
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

function SelectAdmin({ value, onChange, children }: { value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="flex h-10 w-full rounded-lg border border-vibovy-border bg-vibovy-dark px-3 py-2 text-text-primary focus:outline-none focus:ring-1 focus:ring-vibowy-primary">
      {children}
    </select>
  );
}