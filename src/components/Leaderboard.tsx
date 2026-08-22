import Link from "next/link";
import { Trophy } from "lucide-react";
import type { Driver } from "@/lib/types";
import CountryFlag from "@/components/CountryFlag";
import EmptyState from "@/components/EmptyState";

export interface LeaderboardRow {
  driver: Driver;
  position: number;
  compound: string | null;
}

export default function Leaderboard({
  rows,
  sessionKey,
  highlightDriverNumber,
  eyebrow,
  title = "Classificação da sessão",
  failed,
}: {
  rows: LeaderboardRow[];
  sessionKey: number;
  highlightDriverNumber?: number;
  eyebrow?: string;
  title?: string;
  failed?: boolean;
}) {
  const heading = eyebrow ? (
    <div className="mb-4">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--f1-red)] mb-1">{eyebrow}</p>
      <h2 className="font-display text-2xl">{title}</h2>
    </div>
  ) : (
    <h2 className="font-display text-lg mb-4 text-center flex items-center justify-center gap-2">
      <Trophy size={18} />
      {title}
    </h2>
  );

  if (rows.length === 0) {
    return (
      <section className="panel">
        {heading}
        <EmptyState failed={failed} message="Sem dados de posição ainda." />
      </section>
    );
  }

  const sorted = [...rows].sort((a, b) => a.position - b.position);

  return (
    <section className="panel">
      {heading}
      <ul className="flex flex-col divide-y divide-white/5">
        {sorted.map(({ driver, position, compound }) => {
          const isCurrent = driver.driver_number === highlightDriverNumber;
          const color = `#${driver.team_colour}`;
          return (
            <li key={driver.driver_number}>
              <Link
                href={`/piloto/${driver.driver_number}?session=${sessionKey}`}
                className="flex items-center gap-3 py-2.5 px-2 rounded-lg transition-colors hover:bg-white/5"
                style={isCurrent ? { backgroundColor: `${color}1a` } : undefined}
              >
                <span className="font-mono font-bold tabular-nums w-7 text-right text-neutral-400">{position}</span>
                <span className="w-1 self-stretch rounded-full" style={{ backgroundColor: color }} />
                <CountryFlag code={driver.country_code} className="w-5 h-auto rounded-[2px] shrink-0" />
                <span className={`font-semibold flex-1 truncate ${isCurrent ? "text-white" : "text-neutral-200"}`}>
                  {driver.full_name}
                </span>
                {compound && (
                  <span className="text-[11px] font-mono uppercase text-neutral-400 w-16 text-right shrink-0">
                    {compound}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
