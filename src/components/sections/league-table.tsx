"use client";

interface LeagueTableProps {
  title: string;
  columns: string[];
  rows: Array<{
    position: number;
    club: string;
    logo?: string | null;
    played: number;
    won: number;
    drawn: number;
    lost: number;
    goals_for: number;
    goals_against: number;
    points: number;
    form: string[];
  }>;
}

export function LeagueTable({ title, columns, rows }: LeagueTableProps) {
  return (
    <div className="bg-vibovy-surface border border-vibovy-border rounded-xl overflow-hidden">
      <div className="p-4 border-b border-vibovy-border">
        <h3 className="font-bold text-text-primary">{title}</h3>
      </div>
      <table className="data-table w-full text-left">
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
            <th className="text-center">Разн</th>
            <th className="text-center">О</th>
            <th>Форма</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.club} className={row.position <= 3 ? "bg-vibowy-primary/5" : ""}>
              <td className="font-bold text-vibowy-primary">{row.position}</td>
              <td className="flex items-center gap-2">
                {row.logo ? (
                  <img src={row.logo} alt={row.club} className="w-6 h-6 rounded" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-vibowy-primary/20 flex items-center justify-center text-vibowy-primary text-xs font-bold">
                    {row.club.charAt(0)}
                  </div>
                )}
                <span className="text-text-primary">{row.club}</span>
              </td>
              <td className="text-center text-text-secondary">{row.played}</td>
              <td className="text-center text-text-secondary">{row.won}</td>
              <td className="text-center text-text-secondary">{row.drawn}</td>
              <td className="text-center text-text-secondary">{row.lost}</td>
              <td className="text-center text-text-secondary">{row.goals_for}</td>
              <td className="text-center text-text-secondary">{row.goals_against}</td>
              <td className="text-center text-text-secondary">
                {row.goals_for - row.goals_against >= 0 ? "+" : ""}
                {row.goals_for - row.goals_against}
              </td>
              <td className="text-center font-bold text-text-primary">
                {row.points}
              </td>
              <td>
                <div className="flex gap-1">
                  {row.form.map((result) => (
                    <span
                      key={result}
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                        result === "W"
                          ? "bg-emerald-500 text-white"
                          : result === "D"
                          ? "bg-amber-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {result}
                    </span>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}