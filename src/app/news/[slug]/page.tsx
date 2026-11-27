"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94d2h5dmJxZWd6b2pxZmFkcWZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTU3MDc1ODYsImV4cCI6MjExMTI4MzU4Nn0.FIbVEnVhSBWIMdXV8FpCLP6l7x3fb0xWU99j6G-ZFoU";

export const dynamic = "force-dynamic";

export default function NewsDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const [news, setNews] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const url = new URL(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/news`
        );
        url.searchParams.set("select", "*");
        url.searchParams.set("slug", `eq.${params.slug}`);
        url.searchParams.set("is_published", "eq.true");
        url.searchParams.set("limit", "1");

        const res = await fetch(url.toString(), {
          headers: {
            apikey: ANON_KEY,
            Authorization: `Bearer ${ANON_KEY}`,
          },
        });
        const data = await res.json();

        if (data && data.length > 0) {
          setNews(data[0]);
        } else {
          setError("Новость не найдена");
        }
      } catch (e) {
        console.error("Fetch error:", e);
        setError("Ошибка загрузки новости");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vibowy-primary"></div>
        <p className="text-text-muted mt-4">Загрузка новости…</p>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Card className="p-8">
          <h2 className="text-xl font-bold text-text-primary mb-2">
            {error || "Новость не найдена"}
          </h2>
          <Link
            href="/news"
            className="text-vibovy-primary hover:text-vibowy-primary-hover font-medium"
          >
            ← Вернуться к новостям
          </Link>
        </Card>
      </div>
    );
  }

  const categoryLabels: Record<string, string> = {
    news: "Новость",
    interview: "Интервью",
    transfer: "Трансфер",
    event: "Событие",
    tournament: "Турнир",
  };

  return (
    <div className="space-y-8">
      <Link href="/news" className="text-sm text-vibovy-primary hover:text-vibowy-primary-hover font-medium flex items-center gap-1">
        ← Все новости
      </Link>

      <article>
        <Badge
          variant={
            news.category === "transfer"
              ? "success"
              : news.category === "interview"
              ? "outline"
              : "default"
          }
          className="text-xs mb-4"
        >
          {categoryLabels[news.category] || "Новость"}
        </Badge>
        <h1 className="text-3xl font-bold text-text-primary mb-6 leading-tight">
          {news.title}
        </h1>

        {news.image_url ? (
          <img
            src={news.image_url}
            alt={news.title}
            className="w-full h-64 object-cover rounded-xl mb-6"
          />
        ) : (
          <div className="h-64 bg-vibovy-surface border border-vibovy-border rounded-xl flex items-center justify-center mb-6">
            <span className="text-text-muted">Изображение новости</span>
          </div>
        )}

        <div className="prose prose-invert prose-lg max-w-none text-text-secondary">
          {news.content || news.excerpt || "Содержание новости отсутствует."}
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-vibovy-border">
          <span className="text-sm text-text-muted">
            {new Date(news.published_at).toLocaleDateString("ru-RU", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
          <Link
            href="/news"
            className="text-sm text-vibovy-primary hover:text-vibowy-primary-hover font-medium"
          >
            К списку новостей →
          </Link>
        </div>
      </article>
    </div>
  );
}