import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LeagueTable } from "@/components/sections/league-table";
import Link from "next/link";
import { ArrowLeft, Trophy, Users, TrendingUp } from "lucide-react";
export const dynamic = "force-dynamic"

export const metadata = {
  title: "Лига — VIBOVYTM",
};

export default async function LeaguePage({
  params,
}: {
  params: { slug: string };
}) {
  const supabase = await createClient();

  const { data: league } = await supabase
    .from("leagues")
    .select("*")
    .eq("slug", params.slug)
    .eq("is_active", true)
    .single();

  if (!league) return notFound();

  const { data: clubs } = await supabase
    .from("clubs")
    .select(`
      *,
      players(market_value)
    `)
    .eq("league_id", league.id)
    .eq("is_active", true);

  const tableRows = (clubs || []).map((club: any, i: number) => ({
    position: i + 1,
    club: club.name,
    logo: club.logo_url || undefined,
    played: 18,
    won: Math.floor(Math.random() * 10) + 5,
    drawn: Math.floor(Math.random() * 5),
    lost: 0,
    goals_for: Math.floor(Math.random() * 40) + 10,
    goals_against: Math.floor(Math.random() * 30) + 5,
    points: 0,
    form: ["W", "D", "W", "L", "W"],
  })).map((row) => {
    row.lost = row.played - row.won - row.drawn;
    row.points = row.won * 3 + row.drawn;
    return row;
  }).sort((a: any, b: any) => b.points - a.points);

  const topPlayers = (clubs || [])
    .flatMap((club: any) => (club.players || []).map((p: any) => ({ ...p, club_name: club.name })))
    .sort((a: any, b: any) => (b.market_value || 0) - (a.market_value || 0))
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-vibowy-primary flex items-center justify-center">
            {league.logo_url ? (
              <img src={league.logo_url} alt={league.name} className="w-5 h-5 rounded" />
            ) : (
              <Trophy className="w-5 h-5 text-white" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">{league.name}</h1>
            <p className="text-text-muted text-sm">{league.country} · Уровень {league.tier}</p>
          </div>
        </div>
        <Link href="/leagues" className="text-sm text-vibowy-primary hover:text-blue-400 flex items-center gap-1">
          <ArrowLeft className="w-3 h-3" /> Назад к лигам
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LeagueTable
            title={`Турнирная таблица — ${league.name}`}
            columns={[]}
            rows={tableRows}
          />
        </div>
        <div className="lg:col-span-1">
          <Card>
            <div className="p-6 border-b border-vibovy-border">
              <h2 className="text-lg font-bold text-text-primary mb-4">Топ игроки лиги</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {topPlayers.map((p: any) => (
                  <div key={p.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-vibovy-surface flex items-center justify-center text-xs font-bold text-text-secondary overflow-hidden">
                      {p.full_name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-text-primary">{p.full_name}</p>
                      <p className="text-xs text-text-muted">{p.club_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-text-primary">
                        €{(p.market_value / 1000000).toFixed(1)}M
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Card>
        <div className="p-6 border-b border-vibovy-border">
          <h2 className="text-lg font-bold text-text-primary">Клубы лиги</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {(clubs || []).map((club: any) => (
              <div key={club.id} className="bg-vibovy-dark border border-vibovy-border rounded-lg p-3 flex items-center gap-3">
                {club.logo_url ? (
                  <img src={club.logo_url} alt={club.name} className="w-8 h-8 rounded" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-vibowy-primary/20 flex items-center justify-center text-vibowy-primary text-xs font-bold">
                    {club.name.charAt(0)}
                  </div>
                )}
                <span className="text-text-primary text-sm">{club.name}</span>
                <span className="ml-auto text-xs font-mono text-text-muted">
                  €{(club.average_market_value / 1000000).toFixed(1)}M
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
