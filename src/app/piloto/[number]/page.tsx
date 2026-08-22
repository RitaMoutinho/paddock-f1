import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CircleDot, Radio as RadioIcon, ListOrdered } from "lucide-react";
import {
  getLatestSession,
  getSession,
  getMeeting,
  getDriver,
  getLaps,
  getPositions,
  getPitStops,
  getStints,
  getTeamRadio,
  getLatestWeather,
  getSessionLapCount,
  getDrivers,
  getSessionPositions,
  getSessionStints,
} from "@/lib/openf1";
import { formatLapTime, formatDuration, highResHeadshot, teamInitials } from "@/lib/format";
import { safeFetch } from "@/lib/safeFetch";
import CountryFlag from "@/components/CountryFlag";
import EmptyState from "@/components/EmptyState";
import Leaderboard, { type LeaderboardRow } from "@/components/Leaderboard";
import SessionInfoCard from "@/components/SessionInfoCard";
import PerformanceCard from "@/components/PerformanceCard";
import RadioList from "@/components/RadioList";
import TireStints from "@/components/TireStints";

export const revalidate = 60;

export default async function DriverPage({
  params,
  searchParams,
}: {
  params: Promise<{ number: string }>;
  searchParams: Promise<{ session?: string }>;
}) {
  const { number } = await params;
  const { session: sessionParam } = await searchParams;
  const driverNumber = Number(number);

  const session = sessionParam ? await getSession(Number(sessionParam)) : await getLatestSession();
  if (!session) notFound();

  const driver = await getDriver(session.session_key, driverNumber);
  if (!driver) notFound();

  const [
    meeting,
    lapsResult,
    positionsResult,
    pitStopsResult,
    stintsResult,
    radiosResult,
    weatherResult,
    sessionLapCountResult,
    allDriversResult,
    allPositionsResult,
    allStintsResult,
  ] = await Promise.all([
    getMeeting(session.meeting_key),
    safeFetch(getLaps(session.session_key, driverNumber), []),
    safeFetch(getPositions(session.session_key, driverNumber), []),
    safeFetch(getPitStops(session.session_key, driverNumber), []),
    safeFetch(getStints(session.session_key, driverNumber), []),
    safeFetch(getTeamRadio(session.session_key, driverNumber), []),
    safeFetch(getLatestWeather(session.session_key), null),
    safeFetch(getSessionLapCount(session.session_key), 0),
    safeFetch(getDrivers(session.session_key), []),
    safeFetch(getSessionPositions(session.session_key), []),
    safeFetch(getSessionStints(session.session_key), []),
  ]);

  const laps = lapsResult.data;
  const positions = positionsResult.data;
  const pitStops = pitStopsResult.data;
  const stints = stintsResult.data;
  const radios = radiosResult.data;
  const weather = weatherResult.data;
  const sessionLapCount = sessionLapCountResult.data;
  const allDrivers = allDriversResult.data;
  const allPositions = allPositionsResult.data;
  const allStints = allStintsResult.data;

  const performanceFailed = lapsResult.failed || positionsResult.failed;
  const tiresFailed = stintsResult.failed;
  const pitStopsFailed = pitStopsResult.failed;
  const radioFailed = radiosResult.failed;
  const leaderboardFailed = allDriversResult.failed || allPositionsResult.failed || allStintsResult.failed;
  const sessionInfoFailed = weatherResult.failed || sessionLapCountResult.failed;

  const latestByDriver = <T extends { driver_number: number }>(items: T[]) => {
    const map = new Map<number, T>();
    for (const item of items) map.set(item.driver_number, item);
    return map;
  };
  const latestPositionByDriver = latestByDriver(allPositions);
  const latestStintByDriver = latestByDriver(allStints);

  const leaderboardRows: LeaderboardRow[] = allDrivers
    .map((d) => {
      const pos = latestPositionByDriver.get(d.driver_number)?.position;
      if (!pos) return null;
      return { driver: d, position: pos, compound: latestStintByDriver.get(d.driver_number)?.compound ?? null };
    })
    .filter((row): row is LeaderboardRow => row !== null);

  const validLaps = laps.filter((l) => l.lap_duration !== null);
  const bestLap = validLaps.reduce<typeof validLaps[number] | null>((best, l) => {
    if (!best || (l.lap_duration ?? Infinity) < (best.lap_duration ?? Infinity)) return l;
    return best;
  }, null);
  const lastLap = validLaps.at(-1) ?? null;
  const lastStint = stints.at(-1) ?? null;
  const currentPosition = positions.at(-1)?.position ?? null;
  const lapsCompleted = laps.at(-1)?.lap_number ?? 0;

  const bestSector1 = Math.min(...laps.map((l) => l.duration_sector_1).filter((v): v is number => v !== null));
  const bestSector2 = Math.min(...laps.map((l) => l.duration_sector_2).filter((v): v is number => v !== null));
  const bestSector3 = Math.min(...laps.map((l) => l.duration_sector_3).filter((v): v is number => v !== null));

  // eslint-disable-next-line react-hooks/purity -- server component, evaluated per request, not re-rendered client-side
  const now = Date.now();
  const isLive = now >= new Date(session.date_start).getTime() && now <= new Date(session.date_end).getTime();

  const [firstName, ...restName] = driver.full_name.split(" ");
  const lastName = restName.join(" ");
  const color = `#${driver.team_colour}`;

  const stats: { label: string; value: string }[] = [];
  if (currentPosition) stats.push({ label: "Posição", value: `P${currentPosition}` });
  if (lapsCompleted) stats.push({ label: "Voltas completas", value: String(lapsCompleted) });
  if (lastLap) stats.push({ label: "Última volta", value: formatLapTime(lastLap.lap_duration) });
  if (bestLap) stats.push({ label: "Melhor volta", value: formatLapTime(bestLap.lap_duration) });
  if (lastStint) stats.push({ label: "Pneu atual", value: lastStint.compound });

  return (
    <div className="track-bg">
      <div
        className="relative overflow-hidden border-b border-white/5"
        style={{ background: `linear-gradient(115deg, ${color}40 0%, #08080b 60%)` }}
      >
        <div className="absolute inset-x-0 top-0 h-1 z-10" style={{ backgroundColor: color }} />
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background: `radial-gradient(ellipse 700px 400px at 85% 20%, ${color}33, transparent 70%)`,
          }}
        />

        <div
          className="hidden sm:flex absolute inset-y-0 left-0 w-[38%] items-center justify-start pl-4 select-none"
          style={{
            maskImage: "linear-gradient(to left, transparent, black 30%, black 85%, transparent)",
            WebkitMaskImage: "linear-gradient(to left, transparent, black 30%, black 85%, transparent)",
          }}
        >
          <span className="font-display text-[9rem] leading-none tracking-tighter" style={{ color, opacity: 0.16 }}>
            {teamInitials(driver.team_name)}
          </span>
        </div>

        {driver.headshot_url && (
          <div
            className="hidden sm:block absolute inset-y-0 right-0 w-[46%]"
            style={{
              maskImage: "linear-gradient(to right, transparent, black 30%, black 92%, transparent)",
              WebkitMaskImage: "linear-gradient(to right, transparent, black 30%, black 92%, transparent)",
            }}
          >
            <Image
              src={highResHeadshot(driver.headshot_url)!}
              alt={driver.full_name}
              fill
              className="object-contain object-bottom"
              unoptimized
            />
          </div>
        )}

        <div className="relative z-10 max-w-7xl mx-auto px-4 pt-8 pb-10">
          <Link
            href={`/?session=${session.session_key}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-neutral-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors rounded-full pl-3 pr-4 py-1.5"
          >
            <ArrowLeft size={16} />
            Todos os pilotos
          </Link>

          <div className="mt-8 text-center sm:text-left">
            {driver.headshot_url && (
              <div
                className="sm:hidden mx-auto mb-4 w-32 h-32 rounded-full overflow-hidden border-2"
                style={{ borderColor: color, backgroundColor: "#0d0d12" }}
              >
                <Image
                  src={highResHeadshot(driver.headshot_url, "6col")!}
                  alt={driver.full_name}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover object-top"
                  unoptimized
                />
              </div>
            )}

            {isLive && (
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-3">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--f1-red)] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--f1-red)]" />
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-[var(--f1-red)]">Ao vivo</span>
              </div>
            )}
            <span
              className="inline-block text-xs font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full mb-3"
              style={{ backgroundColor: `${color}22`, color }}
            >
              {driver.team_name}
            </span>
            <h1 className="font-display text-5xl sm:text-7xl leading-[0.95]">
              <span className="text-white">{firstName}</span>
              <br />
              <span style={{ color }}>{lastName}</span>
            </h1>
            <div className="mt-4 flex items-center justify-center sm:justify-start gap-3 text-sm text-neutral-300">
              <CountryFlag code={driver.country_code} className="w-6 h-auto rounded-[3px] shadow-sm" />
              <span className="font-mono tracking-wide">{driver.country_code}</span>
              <span className="px-2 py-0.5 rounded bg-white/10 font-mono text-xs">#{driver.driver_number}</span>
            </div>
            <p className="mt-4 text-sm text-neutral-400">
              {meeting.meeting_name} · {session.session_name}
            </p>
          </div>

          {stats.length > 0 && (
            <div className="panel mt-8 grid grid-cols-2 sm:grid-cols-5 gap-4 !py-5">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="font-mono font-semibold tabular-nums text-2xl sm:text-3xl">{s.value}</p>
                  <p className="text-[11px] text-neutral-400 uppercase tracking-wide mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 min-w-0 flex flex-col gap-6">
          <PerformanceCard laps={laps} positions={positions} teamColour={driver.team_colour} failed={performanceFailed} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <section className="panel">
              <h2 className="font-display text-lg mb-4 flex items-center gap-2">
                <CircleDot size={18} style={{ color }} />
                Estratégia de pneus
              </h2>
              <TireStints stints={stints} failed={tiresFailed} />
            </section>

            <section className="panel">
              <h2 className="font-display text-lg mb-4 flex items-center gap-2">
                <CircleDot size={18} style={{ color }} />
                Pit stops
              </h2>
              {pitStops.length > 0 ? (
                <ul className="flex flex-col gap-2">
                  {pitStops.map((p, i) => (
                    <li key={i} className="flex justify-between bg-black/25 rounded-lg px-4 py-2.5 text-sm">
                      <span>Volta {p.lap_number}</span>
                      <span className="text-neutral-400 font-mono tabular-nums">{formatDuration(p.pit_duration)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyState failed={pitStopsFailed} message="Nenhum pit stop registrado nesta sessão." />
              )}
            </section>
          </div>

          <section className="panel">
            <h2 className="font-display text-lg mb-4 flex items-center gap-2">
              <RadioIcon size={18} style={{ color }} />
              Rádio da equipe
            </h2>
            <RadioList radios={radios} teamColour={driver.team_colour} failed={radioFailed} />
          </section>

          <section className="panel">
            <h2 className="font-display text-lg mb-4 flex items-center gap-2">
              <ListOrdered size={18} style={{ color }} />
              Todas as voltas
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-neutral-500 text-left">
                  <tr>
                    <th className="py-2 pr-4">Volta</th>
                    <th className="py-2 pr-4 text-right">S1</th>
                    <th className="py-2 pr-4 text-right">S2</th>
                    <th className="py-2 pr-4 text-right">S3</th>
                    <th className="py-2 pr-4 text-right">Tempo</th>
                    <th className="py-2 pr-4 text-right">Vel. trap</th>
                  </tr>
                </thead>
                <tbody>
                  {laps.map((l, i) => (
                    <tr
                      key={l.lap_number}
                      className={i % 2 === 1 ? "bg-white/[0.025]" : ""}
                      style={l.lap_number === bestLap?.lap_number ? { backgroundColor: `${color}14` } : undefined}
                    >
                      <td className="py-2 pr-4 font-mono font-medium tabular-nums">{l.lap_number}</td>
                      <td
                        className="py-2 pr-4 text-right font-mono tabular-nums"
                        style={l.duration_sector_1 === bestSector1 ? { color: "#3ddc73" } : undefined}
                      >
                        {formatDuration(l.duration_sector_1)}
                      </td>
                      <td
                        className="py-2 pr-4 text-right font-mono tabular-nums"
                        style={l.duration_sector_2 === bestSector2 ? { color: "#3ddc73" } : undefined}
                      >
                        {formatDuration(l.duration_sector_2)}
                      </td>
                      <td
                        className="py-2 pr-4 text-right font-mono tabular-nums"
                        style={l.duration_sector_3 === bestSector3 ? { color: "#3ddc73" } : undefined}
                      >
                        {formatDuration(l.duration_sector_3)}
                      </td>
                      <td className="py-2 pr-4 text-right font-mono font-semibold tabular-nums">{formatLapTime(l.lap_duration)}</td>
                      <td className="py-2 pr-4 text-right font-mono text-neutral-400 tabular-nums">
                        {l.st_speed ? `${l.st_speed} km/h` : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-6">
          <Leaderboard
            rows={leaderboardRows}
            sessionKey={session.session_key}
            highlightDriverNumber={driver.driver_number}
            failed={leaderboardFailed}
          />
          <SessionInfoCard
            weather={weather}
            lapCount={sessionLapCount}
            teamColour={driver.team_colour}
            failed={sessionInfoFailed}
          />
        </div>
      </main>
    </div>
  );
}
