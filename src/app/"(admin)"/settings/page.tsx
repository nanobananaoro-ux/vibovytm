"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Shield, Mail, Globe } from "lucide-react";

export default function AdminSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    const { data } = await supabase.from("settings").select("key, value");
    const map: Record<string, string> = {};
    (data || []).forEach((s) => { map[s.key] = s.value; });
    setSettings(map);
  }

  async function saveSettings() {
    setSaving(true);
    for (const [key, value] of Object.entries(settings)) {
      await supabase.from("settings").upsert({ key, value, updated_at: new Date().toISOString() });
    }
    setSaving(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Настройки сайта</h1>
          <p className="text-text-secondary">Общая конфигурация платформы VIBOVYTM</p>
        </div>
      </div>

      <Card>
        <div className="p-6 border-b border-vibovy-border">
          <h2 className="text-lg font-bold text-text-primary">Основные настройки</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Название сайта</label>
              <Input
                value={settings.site_name || "VIBOVYTM"}
                onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Валюта</label>
              <Input
                value={settings.site_currency || "EUR"}
                onChange={(e) => setSettings({ ...settings, site_currency: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text-secondary mb-1">Описание сайта</label>
              <Input
                value={settings.site_description || ""}
                onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Код доступа к админке</label>
              <Input
                value={settings.access_code || "Hoks228"}
                onChange={(e) => setSettings({ ...settings, access_code: e.target.value })}
              />
              <p className="text-xs text-text-muted mt-1">Используется для входа в админ панель</p>
            </div>
          </div>
          <Button onClick={saveSettings} disabled={saving}>
            <Save className="w-4 h-4 mr-2" /> {saving ? "Сохранение..." : "Сохранить настройки"}
          </Button>
        </div>
      </Card>

      <Card>
        <div className="p-6 border-b border-vibovy-border">
          <h2 className="text-lg font-bold text-text-primary">Режим обслуживания</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-text-primary">Технические работы</p>
              <p className="text-sm text-text-muted">Включите, чтобы временно ограничить доступ к сайту</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.maintenance_mode === "true"}
                onChange={(e) => setSettings({ ...settings, maintenance_mode: e.target.checked ? "true" : "false" })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-vibovy-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-vibowy-primary"></div>
            </label>
          </div>
          <Button onClick={saveSettings} disabled={saving}>
            <Save className="w-4 h-4 mr-2" /> Сохранить
          </Button>
        </div>
      </Card>
    </div>
  );
}