import { getLatestSession, getDrivers } from "@/lib/openf1";
import { getDriverStandings, getConstructorStandings } from "@/lib/jolpica";
import { buildTeamColourMap } from "@/lib/teamColors";
import NavBar from "@/components/NavBar";
import StandingsTabs from "@/components/StandingsTabs";

export const dynamic = "force-dynamic";

export default async function ClassificacaoPage() {
  const [driverStandings, constructorStandings, session] = await Promise.all([
    getDriverStandings().catch(() => []),
    getConstructorStandings().catch(() => []),
    getLatestSession().catch(() => null),
  ]);

  const drivers = session ? await getDrivers(session.session_key).catch(() => []) : [];

  const teamColourMap = buildTeamColourMap(drivers);
  const driverNumberByCode = new Map(drivers.map((d) => [d.name_acronym, d.driver_number]));

  return (
    <>
      <NavBar active="classificacao" />
      <main className="max-w-3xl mx-auto px-4 py-10 flex flex-col gap-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--f1-red)] mb-1">Temporada {session?.year ?? ""}</p>
          <h1 className="font-display text-3xl sm:text-4xl">Classificação do Campeonato</h1>
        </div>

        <StandingsTabs
          driverStandings={driverStandings}
          constructorStandings={constructorStandings}
          teamColourMap={teamColourMap}
          driverNumberByCode={driverNumberByCode}
          sessionKey={session?.session_key ?? 0}
        />
      </main>
    </>
  );
}
