import type { DriverStanding, ConstructorStanding, NextRace } from "./types";

const BASE_URL = "https://api.jolpi.ca/ergast/f1";

// Jolpica-F1 is the free community successor to the (now shut down) Ergast API.
// No key required. Standings only change after a session finishes, so cache longer
// than the OpenF1 calls.
const REVALIDATE_SECONDS = 900;

async function fetchJolpica<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, { next: { revalidate: REVALIDATE_SECONDS } });
  if (!res.ok) {
    throw new Error(`Jolpica request failed (${res.status}): ${path}`);
  }
  return res.json() as Promise<T>;
}

interface DriverStandingsResponse {
  MRData: { StandingsTable: { StandingsLists: { DriverStandings: DriverStanding[] }[] } };
}

interface ConstructorStandingsResponse {
  MRData: { StandingsTable: { StandingsLists: { ConstructorStandings: ConstructorStanding[] }[] } };
}

interface NextRaceResponse {
  MRData: { RaceTable: { Races: NextRace[] } };
}

export async function getDriverStandings(): Promise<DriverStanding[]> {
  const data = await fetchJolpica<DriverStandingsResponse>("/current/driverStandings.json");
  return data.MRData.StandingsTable.StandingsLists[0]?.DriverStandings ?? [];
}

export async function getConstructorStandings(): Promise<ConstructorStanding[]> {
  const data = await fetchJolpica<ConstructorStandingsResponse>("/current/constructorStandings.json");
  return data.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings ?? [];
}

export async function getNextRace(): Promise<NextRace | null> {
  const data = await fetchJolpica<NextRaceResponse>("/current/next.json");
  return data.MRData.RaceTable.Races[0] ?? null;
}
