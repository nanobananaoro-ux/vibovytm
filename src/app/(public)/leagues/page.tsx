"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Trophy } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function LeaguesPage() {
  const [leagues, setLeagues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94d2h5dmJxZWd6b2pxZmFkcWZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTU3MDc1ODYsImV4cCI6MjExMTI4MzU4Nn0.FIbVEnVhSBWIMdXV8FpCLP6l7x3fb0xWU99j6G-ZFoU";
    const fetchLeagues = async () => {
      try {
        const url = new URL(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/leagues`);
        url.searchParams.set("select", "*");
        url.searchParams.set("is_active", "eq.true");
        url.searchParams.set("order", "tier.asc");

        const res = await fetch(url.toString(), {
          headers: {
            apikey: ANON_KEY,
            Authorization: `Bearer ${ANON_KEY}`,
          },
        });
        const data = await res.json();
        setLeagues(data || []);
      } catch (e) {
        console.error("Fetch error:", e);
        setLeagues([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeagues();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-vibowy-primary flex items-center justify-center">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Лиги</h1>
            <p className="text-text-muted text-sm">Турнирные таблицы, команды и статистика</p>
          </div>
        </div>
      </div>

      {loading && (
        <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vibowy-primary"></div>
          <p className="text-text-muted mt-4">Загрузка лиг…</p>
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {leagues.map((league: any) => (
            <Card key={league.id} className="cursor-pointer group" onClick={() => {}}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-vibowy-primary flex items-center justify-center text-white font-bold">
                      {league.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-text-primary">{league.name}</h3>
                      <p className="text-xs text-text-secondary">{league.country}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-vibowy-primary bg-vibowy-primary/10 px-2 py-0.5 rounded">
                    Уровень {league.tier}
                  </span>
                </div>
                <p className="text-text-secondary text-sm mb-4">{league.description || "Футбольная лига"}</p>
                <Link href={`/leagues/${league.slug}`} className="w-full">
                  <Button variant="outline" className="w-full">Открыть лигу</Button>
                </Link>
              </div>
            </Card>
          ))}
          {leagues.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-vibovy-surface flex items-center justify-center mb-4">
                <Trophy className="w-8 h-8 text-text-muted" />
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-2">Лиги не найдены</h3>
            </div>
          )}
        </div>
      )}
    </div>
  );
}