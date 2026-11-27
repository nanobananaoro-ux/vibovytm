"use client";

import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default function MarketPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94d2h5dmJxZWd6b2pxZmFkcWZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTU3MDc1ODYsImV4cCI6MjExMTI4MzU4Nn0.FIbVEnVhSBWIMdXV8FpCLP6l7x3fb0xWU99j6G-ZFoU";
    const fetchMarket = async () => {
      try {
        const url = new URL(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/players`);
        url.searchParams.set("select", "full_name,position,market_value,clubs(name)");
        url.searchParams.set("is_active", "eq.true");
        url.searchParams.set("order", "market_value.desc");
        url.searchParams.set("limit", "50");

        const res = await fetch(url.toString(), {
          headers: {
            apikey: ANON_KEY,
            Authorization: `Bearer ${ANON_KEY}`,
          },
        });
        const data = await res.json();
        setRows((data || []).map((p: any) => ({
          player: p.full_name,
          club: p.clubs?.name || "—",
          position: p.position,
          value: formatCurrency(p.market_value || 0),
        })));
      } catch (e) {
        console.error("Fetch error:", e);
        setRows([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMarket();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-vibowy-primary flex items-center justify-center">
            <span className="w-5 h-5 text-white">💰</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Рыночные Kosten</h1>
            <p className="text-text-muted text-sm">История изменений и динамика стоимости игроков</p>
          </div>
        </div>
        <div className="relative flex-grow lg:w-96">
          <input type="text" placeholder="Искать" className="w-full pl-10 pr-4 py-2 bg-vibovy-surface border border-vibovy-border rounded-lg text-sm focus:outline-none focus:border-vibowy-primary" />
        </div>
      </div>

      {loading && (
        <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vibowy-primary"></div>
          <p className="text-text-muted mt-4">Загрузка данных…</p>
        </div>
      )}

      {!loading && (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-vibovy-border">
                <th className="pb-3 text-text-secondary text-sm font-medium">Игрок</th>
                <th className="pb-3 text-text-secondary text-sm font-medium">Клуб</th>
                <th className="pb-3 text-text-secondary text-sm font-medium">Позиция</th>
                <th className="pb-3 text-text-secondary text-sm font-medium">Стоимость</th>
                <th className="pb-3 text-text-secondary text-sm font-medium">Изменение</th>
                <th className="pb-3 text-text-secondary text-sm font-medium">Обновлено</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-b border-vibovy-border/50">
                  <td className="py-3 text-text-primary">{r.player}</td>
                  <td className="py-3 text-text-secondary">{r.club}</td>
                  <td className="py-3 text-text-secondary">{r.position}</td>
                  <td className="py-3 text-text-primary font-mono">{r.value}</td>
                  <td className="py-3 text-emerald-400 font-medium">▲ 0.0%</td>
                  <td className="py-3 text-text-secondary">Сегодня</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-text-secondary">Данных нет</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}