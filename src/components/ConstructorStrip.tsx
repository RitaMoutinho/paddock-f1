import Link from "next/link";
import type { ConstructorStanding } from "@/lib/types";
import { matchTeamColour } from "@/lib/teamColors";
import EmptyState from "@/components/EmptyState";

export default function ConstructorStrip({
  standings,
  teamColourMap,
  failed,
}: {
  standings: ConstructorStanding[];
  teamColourMap: Map<string, string>;
  failed?: boolean;
}) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--f1-red)] mb-1">Equipes</p>
          <h2 className="font-display text-2xl">Campeonato de Construtores</h2>
        </div>
        <Link href="/classificacao" className="text-sm text-neutral-400 hover:text-white transition-colors">
          Ver completa →
        </Link>
      </div>
      {standings.length === 0 ? (
        <div className="panel">
          <EmptyState failed={failed} message="Classificação indisponível no momento." />
        </div>
      ) : (
      <div className="panel !p-0 overflow-hidden">
        <ul className="divide-y divide-white/5">
          {standings.map((s) => {
            const color = `#${matchTeamColour(teamColourMap, s.Constructor.name)}`;
            return (
              <li key={s.Constructor.constructorId} className="flex items-center gap-3 px-4 py-3">
                <span className="font-mono font-bold tabular-nums w-6 text-right text-neutral-400">{s.position}</span>
                <span className="w-1 self-stretch rounded-full shrink-0" style={{ backgroundColor: color }} />
                <span className="flex-1 font-semibold truncate">{s.Constructor.name}</span>
                <span className="text-xs text-neutral-500 font-mono tabular-nums hidden sm:inline">
                  {s.wins} {Number(s.wins) === 1 ? "vitória" : "vitórias"}
                </span>
                <span className="font-mono font-bold tabular-nums w-16 text-right">{s.points} pts</span>
              </li>
            );
          })}
        </ul>
      </div>
      )}
    </section>
  );
}
