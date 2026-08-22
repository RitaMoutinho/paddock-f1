import Image from "next/image";
import {
  getLatestSession,
  getDrivers,
  getMeeting,
  getSessionPositions,
  getSessionStints,
  getSessionRaceControl,
  getSessionTeamRadio,
} from "@/lib/openf1";
import { getDriverStandings, getConstructorStandings, getNextRace } from "@/lib/jolpica";
import { buildTeamColourMap } from "@/lib/teamColors";
import { highResHeadshot } from "@/lib/format";
import { safeFetch } from "@/lib/safeFetch";
import NavBar from "@/components/NavBar";
import DriverCard from "@/components/DriverCard";
import Leaderboard, { type LeaderboardRow } from "@/components/Leaderboard";
import ChampionshipLeaderFeature from "@/components/ChampionshipLeaderFeature";
import ConstructorStrip from "@/components/ConstructorStrip";
import NextRaceBanner from "@/components/NextRaceBanner";
import RaceControlList from "@/components/RaceControlList";
import LiveRadioFeed from "@/components/LiveRadioFeed";

// Rendered per-request rather than prerendered at build time: this page depends entirely
// on live OpenF1/Jolpica data, and a transient rate-limit during `next build` would
// otherwise fail the whole build.
export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await getLatestSession();

  const [
    drivers,
    meeting,
    driverStandingsResult,
    constructorStandingsResult,
    nextRaceResult,
    allPositionsResult,
    allStintsResult,
    raceControlResult,
    radioResult,
  ] = await Promise.all([
    getDrivers(session.session_key),
    getMeeting(session.meeting_key),
    safeFetch(getDriverStandings(), []),
    safeFetch(getConstructorStandings(), []),
    safeFetch(getNextRace(), null),
    safeFetch(getSessionPositions(session.session_key), []),
    safeFetch(getSessionStints(session.session_key), []),
    safeFetch(getSessionRaceControl(session.session_key), []),
    safeFetch(getSessionTeamRadio(session.session_key), []),
  ]);

  const raceControl = raceControlResult.data;
  const sessionRadios = radioResult.data;

  const driverStandings = driverStandingsResult.data;
  const constructorStandings = constructorStandingsResult.data;
  const nextRace = nextRaceResult.data;
  const allPositions = allPositionsResult.data;
  const allStints = allStintsResult.data;
  const leaderboardFailed = allPositionsResult.failed || allStintsResult.failed;

  const sorted = [...drivers].sort((a, b) => a.driver_number - b.driver_number);

  const latestByDriver = <T extends { driver_number: number }>(items: T[]) => {
    const map = new Map<number, T>();
    for (const item of items) map.set(item.driver_number, item);
    return map;
  };
  const latestPositionByDriver = latestByDriver(allPositions);
  const latestStintByDriver = latestByDriver(allStints);

  const leaderboardRows: LeaderboardRow[] = drivers
    .map((d) => {
      const pos = latestPositionByDriver.get(d.driver_number)?.position;
      if (!pos) return null;
      return { driver: d, position: pos, compound: latestStintByDriver.get(d.driver_number)?.compound ?? null };
    })
    .filter((row): row is LeaderboardRow => row !== null)
    .sort((a, b) => a.position - b.position);

  const teamColourMap = buildTeamColourMap(drivers);
  const driverByAcronym = new Map(drivers.map((d) => [d.name_acronym, d]));
  const championshipLeaderDriver = driverStandings[0] ? driverByAcronym.get(driverStandings[0].Driver.code) ?? null : null;

  // eslint-disable-next-line react-hooks/purity -- server component, evaluated per request, not re-rendered client-side
  const now = Date.now();
  const isLive = now >= new Date(session.date_start).getTime() && now <= new Date(session.date_end).getTime();
  const top3 = leaderboardRows.slice(0, 3);
  const sessionLeader = top3[0]?.driver ?? null;
  const heroColor = sessionLeader ? `#${sessionLeader.team_colour}` : "var(--f1-red)";

  return (
    <div className="track-illustration-bg">
      <NavBar active="inicio" />

      <header
        className="relative overflow-hidden border-b border-white/5"
        style={{ background: `linear-gradient(115deg, ${heroColor}30 0%, #08080b 65%)` }}
      >
        <div className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: heroColor }} />
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{ background: `radial-gradient(ellipse 800px 450px at 85% 15%, ${heroColor}33, transparent 70%)` }}
        />

        {sessionLeader?.headshot_url && (
          <div
            className="hidden md:block absolute inset-y-0 right-0 w-[40%]"
            style={{
              maskImage: "linear-gradient(to right, transparent, black 30%, black 92%, transparent)",
              WebkitMaskImage: "linear-gradient(to right, transparent, black 30%, black 92%, transparent)",
            }}
          >
            <Image
              src={highResHeadshot(sessionLeader.headshot_url)!}
              alt={sessionLeader.full_name}
              fill
              className="object-contain object-bottom"
              unoptimized
            />
          </div>
        )}

        <div className="relative max-w-6xl mx-auto px-4 py-12 sm:py-16">
          {sessionLeader?.headshot_url && (
            <div
              className="md:hidden mx-auto mb-5 w-32 h-32 rounded-full overflow-hidden border-2"
              style={{ borderColor: heroColor, backgroundColor: "#0d0d12" }}
            >
              <Image
                src={highResHeadshot(sessionLeader.headshot_url, "6col")!}
                alt={sessionLeader.full_name}
                width={128}
                height={128}
                className="w-full h-full object-cover object-top"
                unoptimized
              />
            </div>
          )}

          {isLive && (
            <div className="flex items-center gap-2 mb-3 justify-center md:justify-start">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--f1-red)] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--f1-red)]" />
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--f1-red)]">Ao vivo</span>
            </div>
          )}
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--f1-red)] font-semibold text-center md:text-left">
            Sessão em destaque
          </p>
          <h1 className="font-display text-4xl sm:text-6xl mt-2 leading-tight text-center md:text-left">
            {meeting.meeting_name}
          </h1>
          <p className="text-neutral-400 mt-2 text-center md:text-left">
            {session.session_name} · {session.circuit_short_name}, {session.country_name} · {session.year}
          </p>

          {top3.length > 0 && (
            <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-6 border-t border-white/10 pt-6 max-w-md mx-auto md:mx-0">
              {top3.map(({ driver, position }) => (
                <div key={driver.driver_number}>
                  <p className="font-mono font-bold text-2xl tabular-nums" style={{ color: `#${driver.team_colour}` }}>
                    P{position}
                  </p>
                  <p className="text-sm text-neutral-300 whitespace-nowrap">{driver.full_name}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12 flex flex-col gap-16">
        <ChampionshipLeaderFeature
          standings={driverStandings}
          leaderDriver={championshipLeaderDriver}
          teamColourMap={teamColourMap}
          sessionKey={session.session_key}
          failed={driverStandingsResult.failed}
        />

        <div className="border-t border-white/5 pt-12">
          <ConstructorStrip
            standings={constructorStandings}
            teamColourMap={teamColourMap}
            failed={constructorStandingsResult.failed}
          />
        </div>

        <div className="border-t border-white/5 pt-12">
          <Leaderboard
            rows={leaderboardRows}
            sessionKey={session.session_key}
            eyebrow="Ao vivo"
            title="Classificação da corrida"
            failed={leaderboardFailed}
          />
        </div>

        <div className="border-t border-white/5 pt-12">
          <LiveRadioFeed
            radios={sessionRadios}
            drivers={drivers}
            sessionKey={session.session_key}
            failed={radioResult.failed}
          />
        </div>

        <div className="border-t border-white/5 pt-12">
          <NextRaceBanner race={nextRace} failed={nextRaceResult.failed} />
        </div>

        <div className="border-t border-white/5 pt-12">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--f1-red)] mb-1">Grid completo</p>
          <h2 className="font-display text-2xl sm:text-3xl mb-6">Todos os pilotos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {sorted.map((driver) => (
              <DriverCard key={driver.driver_number} driver={driver} sessionKey={session.session_key} />
            ))}
          </div>
        </div>

        <div className="border-t border-white/5 pt-12">
          <RaceControlList messages={raceControl} failed={raceControlResult.failed} />
        </div>
      </main>
    </div>
  );
}
