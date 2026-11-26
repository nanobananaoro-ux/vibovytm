"use client";

import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getPositionColor } from "@/lib/utils";

interface PlayerCardProps {
  player: {
    id: string;
    full_name: string;
    position: string;
    club_name?: string;
    market_value?: number;
    image_url?: string | null;
    age?: number;
    nationality?: string;
  };
}

export function PlayerCard({ player }: PlayerCardProps) {
  const positionColor = getPositionColor(player.position);

  return (
    <Card className="group cursor-pointer">
      <div className="relative h-48 overflow-hidden">
        {player.image_url ? (
          <img
            src={player.image_url}
            alt={player.full_name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-vibovy-surface flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-vibowy-primary/20 flex items-center justify-center text-vibowy-primary font-bold text-2xl">
              {player.full_name.charAt(0)}
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-text-primary">{player.full_name}</h3>
              <p className="text-xs text-text-secondary">
                {player.age} · {player.nationality || "—"}
              </p>
            </div>
            <Badge variant="outline" className={positionColor}>
              {player.position}
            </Badge>
          </div>
        </div>
      </div>
      <div className="p-4">
        {player.club_name && (
          <p className="text-sm text-text-secondary mb-3">{player.club_name}</p>
        )}
        <div className="flex items-center justify-between">
          {player.market_value !== undefined && (
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-text-primary">
                {formatCurrency(player.market_value)}
              </span>
              <span className="text-xs text-emerald-400 font-medium">
                ▲ 0.0%
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}