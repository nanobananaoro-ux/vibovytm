"use client";

import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface ClubCardProps {
  club: {
    id: string;
    name: string;
    short_name?: string;
    logo_url?: string | null;
    average_market_value?: number;
    city?: string;
    country?: string;
    player_count?: number;
  };
}

export function ClubCard({ club }: ClubCardProps) {
  return (
    <Card className="group cursor-pointer">
      <div className="h-32 overflow-hidden border-b border-vibovy-border">
        {club.logo_url ? (
          <img
            src={club.logo_url}
            alt={club.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-vibowy-primary/10 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-vibowy-primary flex items-center justify-center text-white font-bold text-3xl">
              {club.name.charAt(0)}
            </div>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-text-primary">{club.name}</h3>
        {club.short_name && (
          <p className="text-xs text-text-secondary">{club.short_name}</p>
        )}
        <div className="mt-2 flex items-center justify-between">
          <p className="text-sm text-text-muted">
            {club.city}, {club.country || "—"}
          </p>
          {club.average_market_value !== undefined && (
            <span className="text-sm font-bold text-text-primary">
              {formatCurrency(club.average_market_value)}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}