"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Users } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default function ClubsPage({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  const [clubs, setClubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const search = searchParams.search || "";

  useEffect(() => {
    const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94d2h5dmJxZWd6b2pxZmFkcWZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTU3MDc1ODYsImV4cCI6MjExMTI4MzU4Nn0.FIbVEnVhSBWIMdXV8FpCLP6l7x3fb0xWU99j6G-ZFoU";
    const fetchClubs = async () => {
      try {
        const url = new URL(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/clubs`);
        url.searchParams.set("select", "*");
        url.searchParams.set("is_active", "eq.true");
        url.searchParams.set("order", "average_market_value.desc");
        if (search) url.searchParams.set("name", `ilike.%${search}%`);

        const res = await fetch(url.toString(), {
          headers: {
            apikey: ANON_KEY,
            Authorization: `Bearer ${ANON_KEY}`,
          },
        });
        const data = await res.json();
        setClubs(data || []);
      } catch (e) {
        console.error("Fetch error:", e);
        setClubs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, [search]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-vibowy-primary flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Клубы</h1>
            <p className="text-text-muted text-sm">Футбольныеクラブы с составами и стоимостью</p>
          </div>
        </div>

        <form className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto" onSubmit={(e) => e.preventDefault()}>
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 w-4 h-4 text-text-muted" />
            <Input placeholder="Поиск клубов..." defaultValue={search} className="pl-10" />
          </div>
          <Button type="submit">Искать</Button>
        </form>
      </div>

      {loading && (
        <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vibowy-primary"></div>
          <p className="text-text-muted mt-4">Загрузка клубов…</p>
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map((club: any) => (
            <Card key={club.id} className="cursor-pointer group" onClick={() => {}}>
              <div className="h-32 overflow-hidden border-b border-vibovy-border">
                <div className="w-full h-full bg-vibowy-primary/10 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-vibowy-primary flex items-center justify-center text-white font-bold text-3xl">
                    {club.name.charAt(0)}
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-text-primary">{club.name}</h3>
                {club.short_name && <p className="text-xs text-text-secondary">{club.short_name}</p>}
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-sm text-text-muted">{club.city}, {club.country || "—"}</p>
                  {club.average_market_value !== undefined && (
                    <span className="text-sm font-bold text-text-primary">{formatCurrency(club.average_market_value)}</span>
                  )}
                </div>
              </div>
            </Card>
          ))}
          {clubs.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-vibovy-surface flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-text-muted" />
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-2">Клубы не найдены</h3>
            </div>
          )}
        </div>
      )}
    </div>
  );
}