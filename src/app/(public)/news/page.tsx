"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const MailIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" strokeLinejoin="round" strokeWidth={2} />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
  </svg>
);

const TrendingUpIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const TrophyIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a4 4 0 004 4h12a4 4 0 004-4v-6" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-2a2 2 0 00-2-2H5a2 2 0 00-2 2v2a4 4 0 004 4h12a4 4 0 004-4v2" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a4 4 0 004 4h12a4 4 0 004-4v-6" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13l3-3-1-1-3 3" />
  </svg>
);

const categoryIcons: Record<string, any> = {
  news: MailIcon,
  interview: UsersIcon,
  transfer: TrendingUpIcon,
  event: TrophyIcon,
  tournament: ShieldIcon,
};

export const dynamic = "force-dynamic";

export default function NewsPage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string };
}) {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const category = searchParams.category || "";
  const search = searchParams.search || "";

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const url = new URL(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/news`);
        url.searchParams.set("select", "*");
        url.searchParams.set("is_published", "eq.true");
        url.searchParams.set("order", "published_at.desc");
        if (category) url.searchParams.set("category", `eq.${category}`);
        if (search) url.searchParams.set("title", `ilike.%${search}%`);

        const res = await fetch(url.toString(), {
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
          },
        });
        const data = await res.json();
        setNews(data || []);
      } catch (e) {
        console.error("Fetch error:", e);
        setNews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [category, search]);

  const categories = [
    { value: "", label: "Все категории" },
    { value: "news", label: "Новости" },
    { value: "interview", label: "Интервью" },
    { value: "transfer", label: "Трансферы" },
    { value: "event", label: "События" },
    { value: "tournament", label: "Турниры" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-vibowy-primary flex items-center justify-center">
            <MailIcon />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Медиа</h1>
            <p className="text-text-muted text-sm">Новости, интервью, трансферы и события</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 lg:w-64">
          <div className="space-y-2">
            <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Категории</p>
            {categories.map((cat) => (
              <Button
                key={cat.value}
                variant={category === cat.value ? "primary" : "ghost"}
                className="w-full text-left justify-start text-sm"
                onClick={() => {}}
              >
                {cat.label}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex-1">
          <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <Input placeholder="Поиск новостей..." defaultValue={search} className="flex-1" />
            <Button type="submit">Искать</Button>
          </form>
        </div>
      </div>

      {loading && (
        <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vibowy-primary"></div>
          <p className="text-text-muted mt-4">Загрузка новостей…</p>
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item: any) => {
            const Icon = categoryIcons[item.category] || MailIcon;
            return (
              <Card key={item.id} className="cursor-pointer group">
                <div className="h-40 overflow-hidden mb-4">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full bg-vibowy-primary/10 flex items-center justify-center">
                      <Icon className="w-8 h-8 text-vibowy-primary/30" />
                    </div>
                  )}
                </div>
                <Badge
                  variant={item.category === "transfer" ? "success" : item.category === "interview" ? "outline" : "default"}
                  className="text-xs mb-3"
                >
                  {item.category === "transfer" ? "Трансфер" : item.category === "interview" ? "Интервью" : item.category === "event" ? "Событие" : item.category === "tournament" ? "Турнир" : "Новость"}
                </Badge>
                <h3 className="font-bold text-text-primary mb-2 group-hover:text-vibowy-primary transition-colors">{item.title}</h3>
                <p className="text-text-secondary text-sm mb-3">{item.excerpt || item.content?.slice(0, 150) + "..."}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-muted">
                    {new Date(item.published_at).toLocaleDateString("ru-RU", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                  <Link href={`/news/${item.slug}`} className="text-xs text-vibowy-primary font-medium hover:underline">
                    Читать →
                  </Link>
                </div>
              </Card>
            );
          })}
          {news.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-vibovy-surface flex items-center justify-center mb-4">
                <MailIcon />
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-2">Новостей не найдено</h3>
            </div>
          )}
        </div>
      )}
    </div>
  );
}