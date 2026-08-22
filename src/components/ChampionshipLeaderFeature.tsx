import Image from "next/image";
import Link from "next/link";
import type { DriverStanding, Driver } from "@/lib/types";
import { highResHeadshot } from "@/lib/format";
import { matchTeamColour } from "@/lib/teamColors";
import EmptyState from "@/components/EmptyState";

export default function ChampionshipLeaderFeature({
  standings,
  leaderDriver,
  teamColourMap,
  sessionKey,
  failed,
}: {
  standings: DriverStanding[];
  leaderDriver: Driver | null;
  teamColourMap: Map<string, string>;
  sessionKey: number;
  failed?: boolean;
}) {
  if (standings.length === 0) {
    return (
      <section className="panel">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--f1-red)] mb-4">Campeonato de Pilotos</p>
        <EmptyState failed={failed} message="Classificação indisponível no momento." />
      </section>
    );
  }
  const [leader, second, third] = standings;
  const color = `#${matchTeamColour(teamColourMap, leader.Constructors[0]?.name ?? "")}`;

  return (
    <section className="panel relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: color }} />

      {leaderDriver?.headshot_url && (
        <div
          className="hidden sm:block absolute inset-y-0 right-0 w-[38%]"
          style={{
            maskImage: "linear-gradient(to right, transparent, black 30%, black 92%, transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 30%, black 92%, transparent)",
          }}
        >
          <Image
            src={highResHeadshot(leaderDriver.headshot_url)!}
            alt={leaderDriver.full_name}
            fill
            className="object-contain object-bottom"
            unoptimized
          />
        </div>
      )}

      <div className="relative">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--f1-red)] text-center sm:text-left">
          Campeonato de Pilotos
        </p>
        <p className="text-sm text-neutral-400 mt-1 text-center sm:text-left">
          Acompanhe a disputa pelo título da temporada.
        </p>

        {leaderDriver?.headshot_url && (
          <div
            className="sm:hidden mx-auto mt-4 w-28 h-28 rounded-full overflow-hidden border-2"
            style={{ borderColor: color, backgroundColor: "#0d0d12" }}
          >
            <Image
              src={highResHeadshot(leaderDriver.headshot_url, "6col")!}
              alt={leaderDriver.full_name}
              width={112}
              height={112}
              className="w-full h-full object-cover object-top"
              unoptimized
            />
          </div>
        )}

        <div className="mt-6 flex items-end gap-3 justify-center sm:justify-start text-center sm:text-left">
          <span className="font-display text-5xl leading-none" style={{ color }}>
            P1
          </span>
          <div>
            <h3 className="font-display text-2xl sm:text-3xl leading-tight">
              {leader.Driver.givenName} {leader.Driver.familyName}
            </h3>
            <p className="text-neutral-400 text-sm">{leader.Constructors[0]?.name}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center sm:justify-start gap-x-8 gap-y-3">
          <div>
            <p className="font-mono font-bold text-2xl tabular-nums">{leader.points}</p>
            <p className="text-[11px] text-neutral-400 uppercase tracking-wide">Pontos</p>
          </div>
          <div>
            <p className="font-mono font-bold text-2xl tabular-nums">{leader.wins}</p>
            <p className="text-[11px] text-neutral-400 uppercase tracking-wide">Vitórias</p>
          </div>
          {second && (
            <div className="text-sm text-neutral-400">
              <span className="text-neutral-500">P2</span> {second.Driver.familyName}{" "}
              <span className="font-mono tabular-nums">({second.points} pts)</span>
            </div>
          )}
          {third && (
            <div className="text-sm text-neutral-400">
              <span className="text-neutral-500">P3</span> {third.Driver.familyName}{" "}
              <span className="font-mono tabular-nums">({third.points} pts)</span>
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-wrap justify-center sm:justify-start gap-3">
          {leaderDriver && (
            <Link
              href={`/piloto/${leaderDriver.driver_number}?session=${sessionKey}`}
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:opacity-90"
              style={{ backgroundColor: color }}
            >
              Ver perfil do piloto
            </Link>
          )}
          <Link
            href="/classificacao"
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold border border-white/15 hover:bg-white/5 transition-colors"
          >
            Ver classificação completa
          </Link>
        </div>
      </div>
    </section>
  );
}
