import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Users } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ClubsPage({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  const search = searchParams.search || "";

  const supabase = await createClient();
  let query = supabase
    .from("clubs")
    .select("*")
    .eq("is_active", true)
    .order("average_market_value", { ascending: false });

  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  const { data: clubs } = await query;

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

        <form className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto" action="" method="get">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 w-4 h-4 text-text-muted" />
            <Input placeholder="Поиск клубов..." name="search" defaultValue={search} className="pl-10" />
          </div>
          <Button type="submit">Искать</Button>
        </form>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {(clubs || []).map((club: any) => (
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
        {(clubs?.length || 0) === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-vibovy-surface flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-text-muted" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">Клубы не найдены</h3>
          </div>
        )}
      </div>
    </div>
  );
}