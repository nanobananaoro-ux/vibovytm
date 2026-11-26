"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Edit } from "lucide-react";

export default function AdminNews() {
  const [news, setNews] = useState<any[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "", slug: "", excerpt: "", content: "", image_url: "", category: "news", is_published: true,
  });
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const { data } = await supabase.from("news").select("*").order("published_at", { ascending: false });
    setNews(data || []);
  }

  async function saveNews() {
    setLoading(true);
    const payload = { ...form, is_published: form.is_published };
    if (editing) {
      await supabase.from("news").update(payload).eq("id", editing);
    } else {
      await supabase.from("news").insert([payload]);
    }
    setEditing(null);
    setForm({ title: "", slug: "", excerpt: "", content: "", image_url: "", category: "news", is_published: true });
    await fetchData();
    setLoading(false);
  }

  async function deleteNews(id: string) {
    if (confirm("Удалить новость?")) {
      await supabase.from("news").delete().eq("id", id);
      await fetchData();
    }
  }

  const categories = [
    { value: "news", label: "Новость" },
    { value: "interview", label: "Интервью" },
    { value: "transfer", label: "Трансфер" },
    { value: "event", label: "Событие" },
    { value: "tournament", label: "Турнир" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Управление новостями</h1>
          <p className="text-text-secondary">Добавление, редактирование и удаление новостей</p>
        </div>
        <Button onClick={() => { setEditing(null); setForm({ title: "", slug: "", excerpt: "", content: "", image_url: "", category: "news", is_published: true }); }}>
          <Plus className="w-4 h-4 mr-2" /> Новая новость
        </Button>
      </div>

      {editing ? (
        <Card className="mt-4">
          <div className="p-6 border-b border-vibovy-border">
            <h2 className="text-lg font-bold text-text-primary">Редактирование новости</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Заголовок</label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Slug</label>
                <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-text-secondary mb-1">Категория</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="flex h-10 w-full rounded-lg border border-vibovy-border bg-vibovy-dark px-3 py-2 text-text-primary focus:outline-none focus:ring-1 focus:ring-vibowy-primary">
                  {categories.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Анонс</label>
              <Input value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Контент</label>
              <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="w-full h-32 rounded-lg border border-vibovy-border bg-vibovy-dark px-3 py-2 text-text-primary focus:outline-none focus:ring-1 focus:ring-vibowy-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">URL картинки</label>
              <Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} className="rounded bg-vibovy-dark border-vibovy-border text-vibowy-primary focus:ring-0" />
              <label className="text-text-secondary text-sm">Опубликовано</label>
            </div>
            <div className="flex gap-3">
              <Button onClick={saveNews} disabled={loading}>{loading ? "Сохранение..." : "Сохранить"}</Button>
              <Button variant="outline" onClick={() => { setEditing(null); setForm({ title: "", slug: "", excerpt: "", content: "", image_url: "", category: "news", is_published: true }); }}>Отмена</Button>
            </div>
          </div>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="data-table w-full">
            <thead>
              <tr>
                <th>Заголовок</th>
                <th className="text-center">Категория</th>
                <th className="text-center">Опубликовано</th>
                <th className="text-center">Дата</th>
                <th className="text-center">Действия</th>
              </tr>
            </thead>
            <tbody>
              {news.map((n) => (
                <tr key={n.id}>
                  <td className="font-medium text-text-primary">{n.title}</td>
                  <td className="text-center text-text-secondary">{n.category}</td>
                  <td className="text-center">
                    {n.is_published ? (
                      <span className="text-emerald-400 text-xs font-medium">Да</span>
                    ) : (
                      <span className="text-text-muted text-xs font-medium">Нет</span>
                    )}
                  </td>
                  <td className="text-center text-xs text-text-muted">{new Date(n.published_at).toLocaleDateString("ru-RU")}</td>
                  <td className="text-center">
                    <Button variant="ghost" size="sm" onClick={() => { setEditing(n.id); setForm({ title: n.title, slug: n.slug, excerpt: n.excerpt || "", content: n.content || "", image_url: n.image_url || "", category: n.category, is_published: n.is_published }); }}>
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteNews(n.id)} className="text-red-400 hover:text-red-300">
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