import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft, MapPin, Shield, Calendar } from "lucide-react";
import { PlayerCard } from "@/components/sections/player-card";
export const dynamic = "force-dynamic"

export const metadata = {
  title: "Клуб — VIBOVYTM",
};

export default async function ClubProfilePage({
  params,
}: {
  params: { slug: string };
}) {
  const supabase = await createClient();

  const { data: club, error } = await supabase
    .from("clubs")
    .select(`
      *,
      players(
        id, full_name, position, market_value, image_url, age, nationality
      )
    `)
    .eq("slug", params.slug)
    .eq("is_active", true)
    .single();

  if (error || !club) return notFound();

  const players = (club.players || []).sort(
    (a: any, b: any) => (b.market_value || 0) - (a.market_value || 0)
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="h-64 rounded-2xl overflow-hidden border border-vibovy-border bg-vibovy-surface">
            {club.logo_url ? (
              <img src={club.logo_url} alt={club.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-vibowy-primary/10 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-vibowy-primary flex items-center justify-center text-white font-bold text-4xl">
                  {club.name.charAt(0)}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex-grow">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-text-primary">{club.name}</h1>
              {club.short_name && (
                <span className="ml-2 text-xs font-bold text-vibowy-primary bg-vibowy-primary/10 px-2 py-0.5 rounded">
                  {club.short_name}
                </span>
              )}
              <div className="flex items-center gap-1 text-text-secondary mt-2">
                <MapPin className="w-4 h-4" />
                <span>{club.city}, {club.country || "—"}</span>
              </div>
            </div>
            <Link href="/clubs" className="text-sm text-vibowy-primary hover:text-blue-400 flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Назад к списку
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card className="p-4">
              <p className="text-text-muted text-xs uppercase tracking-wider font-medium">Средняя стоимость состава</p>
              <p className="mt-2 text-2xl font-bold text-text-primary">
                {formatCurrency(club.average_market_value || 0)}
              </p>
            </Card>
            <Card className="p-4">
              <p className="text-text-muted text-xs uppercase tracking-wider font-medium">Игроков в составе</p>
              <p className="mt-2 text-2xl font-bold text-text-primary">{players.length}</p>
            </Card>
            <Card className="p-4">
              <p className="text-text-muted text-xs uppercase tracking-wider font-medium">Основан</p>
              <p className="mt-2 text-2xl font-bold text-text-primary">
                {club.founded_year || "—"}
              </p>
            </Card>
          </div>

          {club.description && (
            <div className="mb-6">
              <p className="text-text-secondary leading-relaxed">{club.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Squad */}
      <Card>
        <div className="p-6 border-b border-vibovy-border flex items-center justify-between">
          <h2 className="text-lg font-bold text-text-primary">Состав ({players.length})</h2>
          <Button variant="outline" size="sm">Показать всех</Button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {players.slice(0, 9).map((player: any) => (
              <PlayerCard
                key={player.id}
                player={{
                  id: player.id,
                  full_name: player.full_name,
                  position: player.position,
                  club_name: club.name,
                  market_value: player.market_value || 0,
                  image_url: player.image_url || undefined,
                  age: player.age,
                  nationality: player.nationality,
                }}
              />
            ))}
            {players.length > 9 && (
              <div className="col-span-full text-center pt-4">
                <Button variant="outline" className="w-full">
                  Ещё {players.length - 9} игроков
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* History & Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="p-6 border-b border-vibovy-border">
            <h2 className="text-lg font-bold text-text-primary">История</h2>
          </div>
          <div className="p-6">
            {club.history ? (
              <p className="text-text-secondary leading-relaxed">{club.history}</p>
            ) : (
              <p className="text-text-muted italic">История клуба будет добавлена администратором.</p>
            )}
          </div>
        </Card>
        <Card>
          <div className="p-6 border-b border-vibovy-border">
            <h2 className="text-lg font-bold text-text-primary">Достижения</h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-vibovy-dark rounded-lg">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium text-text-primary">Чемпион лиги</p>
                  <p className="text-xs text-text-muted">2024</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-vibovy-dark rounded-lg">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium text-text-primary">Обладатель кубка</p>
                  <p className="text-xs text-text-muted">2023</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
