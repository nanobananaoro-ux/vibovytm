"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Users, Trophy, TrendingUp, Mail } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const topPlayers = [
  { id: "1", full_name: "Александр Каратаев", position: "ST", club_name: "ФК Актобе", market_value: 4500000, age: 24, nationality: "Казахстан" },
  { id: "2", full_name: "Максим Федин", position: "CAM", club_name: "ФК Ордабасы", market_value: 3800000, age: 26, nationality: "Казахстан" },
  { id: "3", full_name: "Бауыржан Исламхан", position: "CM", club_name: "ФК Астана", market_value: 3200000, age: 29, nationality: "Казахстан" },
  { id: "4", full_name: "Самат Смаков", position: "CB", club_name: "ФК Тобол", market_value: 2800000, age: 23, nationality: "Казахстан" },
];

const topClubs = [
  { id: "1", name: "ФК Астана", short_name: "АСТ", average_market_value: 18500000, city: "Астана", country: "Казахстан" },
  { id: "2", name: "ФК Ордабасы", short_name: "ОРД", average_market_value: 15200000, city: "Шымкент", country: "Казахстан" },
  { id: "3", name: "ФК Актобе", short_name: "АКТ", average_market_value: 12800000, city: "Актобе", country: "Казахстан" },
];

export default function HomePage() {
  return (
    <div className="space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative h-64 rounded-2xl bg-vibowy-primary/10 border border-vibowy-primary/20 overflow-hidden flex items-center justify-between p-8 lg:p-12 mb-4"
      >
        <div className="z-10">
          <h1 className="text-3xl lg:text-5xl font-bold text-text-primary tracking-tight mb-4">
            Футбольная аналитика<br />
            <span className="text-vibowy-primary">ФТКЛ и ИРФФ</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-md">
            Профессиональная платформа для анализа игроков, клубов, лиг и рыночных стоимостей.
          </p>
          <div className="flex gap-3 mt-6">
            <Button size="lg">Игроки</Button>
            <a href="/clubs"><Button variant="outline" size="lg">Клубы</Button></a>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-vibovy-surface border border-vibovy-border rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-muted text-sm uppercase tracking-wider font-medium">Игроков в базе</p>
              <p className="text-2xl font-bold text-text-primary">1,247</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-900/30 flex items-center justify-center text-blue-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-vibovy-surface border border-vibovy-border rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-muted text-sm uppercase tracking-wider font-medium">Клубов</p>
              <p className="text-2xl font-bold text-text-primary">56</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-900/30 flex items-center justify-center text-emerald-400">
              <Trophy className="w-5 h-5" />
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-vibovy-surface border border-vibovy-border rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-muted text-sm uppercase tracking-wider font-medium">Лиг</p>
              <p className="text-2xl font-bold text-text-primary">4</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-purple-900/30 flex items-center justify-center text-purple-400">
              <Mail className="w-5 h-5" />
            </div>
          </div>
        </motion.div>
      </div>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-text-primary">Самые дорогие игроки</h2>
          <Link href="/players" className="text-sm text-vibowy-primary hover:text-blue-400 font-medium flex items-center gap-1">
            Все игроки <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {topPlayers.map((player) => (
            <Card key={player.id} className="cursor-pointer group" onClick={() => {}}>
              <div className="relative h-48 overflow-hidden">
                <div className="w-full h-full bg-vibovy-surface flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-vibowy-primary/20 flex items-center justify-center text-vibowy-primary font-bold text-2xl">
                    {player.full_name.charAt(0)}
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-text-primary">{player.full_name}</h3>
                      <p className="text-xs text-text-secondary">{player.age} · {player.nationality}</p>
                    </div>
                    <Badge variant="outline" className="text-xs font-bold text-text-secondary bg-vibovy-surface border-vibovy-border">
                      {player.position}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-text-secondary mb-3">{player.club_name}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold text-text-primary">{formatCurrency(player.market_value)}</span>
                  <span className="text-xs text-emerald-400 font-medium">▲ 0.0%</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-0">
          <div className="p-4 border-b border-vibovy-border flex items-center justify-between">
            <h2 className="font-bold text-text-primary">Изменения стоимости</h2>
            <div className="flex gap-1">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <TrendingUp className="w-4 h-4 text-red-400" />
            </div>
          </div>
          <div className="p-4">
            {[4500000, 3200000, 1900000].map((v, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-vibovy-border last:border-0">
                <div>
                  <p className="text-text-primary font-medium">Игрок {i + 1}</p>
                  <p className="text-xs text-text-muted">Клуб {i + 1}</p>
                </div>
                <div className="text-right">
                  <p className="text-text-primary font-mono">{formatCurrency(v)}</p>
                  <p className="text-xs text-emerald-400 font-medium">▲ {10 + i}%</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-0">
          <div className="p-4 border-b border-vibovy-border">
            <h2 className="font-bold text-text-primary">Популярные клубы</h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {topClubs.map((club) => (
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
                    <p className="text-xs text-text-secondary">{club.short_name}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-sm text-text-muted">{club.city}, {club.country}</p>
                      <span className="text-sm font-bold text-text-primary">{formatCurrency(club.average_market_value)}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </Card>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-text-primary">Турнирная таблица</h2>
          <Link href="/leagues" className="text-sm text-vibowy-primary hover:text-blue-400 font-medium flex items-center gap-1">
            Все лиги <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <Card>
          <div className="overflow-x-auto">
            <table className="data-table w-full">
              <thead>
                <tr>
                  <th className="w-10">#</th>
                  <th>Клуб</th>
                  <th className="text-center">И</th>
                  <th className="text-center">В</th>
                  <th className="text-center">Н</th>
                  <th className="text-center">П</th>
                  <th className="text-center">МЗ</th>
                  <th className="text-center">МП</th>
                  <th className="text-center">О</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className={i <= 3 ? "bg-vibowy-primary/5" : ""}>
                    <td className="font-bold text-vibowy-primary">{i}</td>
                    <td className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-vibowy-primary/20 flex items-center justify-center text-vibowy-primary text-xs font-bold">
                        {String.fromCharCode(65 + i)}
                      </div>
                      <span className="text-text-primary">Клуб {i}</span>
                    </td>
                    <td className="text-center text-text-secondary">18</td>
                    <td className="text-center text-text-secondary">{12 - i}</td>
                    <td className="text-center text-text-secondary">{4 - i}</td>
                    <td className="text-center text-text-secondary">{2 + i}</td>
                    <td className="text-center text-text-secondary">{34 - i * 2}</td>
                    <td className="text-center text-text-secondary">{12 - i}</td>
                    <td className="text-center font-bold text-text-primary">{40 - i * 2}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-text-primary">Главные новости</h2>
          <Link href="/news" className="text-sm text-vibowy-primary hover:text-blue-400 font-medium flex items-center gap-1">
            Все новости <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="cursor-pointer group" onClick={() => {}}>
              <div className="h-40 overflow-hidden mb-4">
                <div className="w-full h-full bg-vibowy-primary/10 flex items-center justify-center">
                  <Mail className="w-12 h-12 text-vibowy-primary/30" />
                </div>
              </div>
              <Badge variant="outline" className="text-xs mb-3">
                {i === 1 ? "Трансфер" : i === 2 ? "Новость" : "Интервью"}
              </Badge>
              <h3 className="font-bold text-text-primary mb-2">Новость #{i} VIBOVYTM</h3>
              <p className="text-text-secondary text-sm mb-3">Описание новости о футбольном событии в лиге ФТКЛ или ИРФФ.</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-muted">25 нояб. 2026</span>
                <Link href={`/news/${i}`} className="text-xs text-vibowy-primary font-medium hover:underline">
                  Читать
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}