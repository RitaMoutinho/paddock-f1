import type {
  Session,
  Meeting,
  Driver,
  Lap,
  Position,
  PitStop,
  Stint,
  TeamRadio,
  RaceControlMessage,
  Weather,
} from "./types";

const BASE_URL = "https://api.openf1.org/v1";

// OpenF1 free tier allows 3 req/s. Cache each unique request for a minute so
// browsing between driver pages doesn't hammer the API.
const REVALIDATE_SECONDS = 60;

async function fetchOpenF1<T>(path: string, params: Record<string, string | number | undefined>): Promise<T> {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) query.set(key, String(value));
  }
  const url = `${BASE_URL}${path}?${query.toString()}`;
  const res = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });
  if (!res.ok) {
    throw new Error(`OpenF1 request failed (${res.status}): ${url}`);
  }
  return res.json() as Promise<T>;
}

export function getLatestSession() {
  return fetchOpenF1<Session[]>("/sessions", { session_key: "latest" }).then((s) => s[0]);
}

export function getSession(sessionKey: number) {
  return fetchOpenF1<Session[]>("/sessions", { session_key: sessionKey }).then((s) => s[0]);
}

export function getMeeting(meetingKey: number) {
  return fetchOpenF1<Meeting[]>("/meetings", { meeting_key: meetingKey }).then((m) => m[0]);
}

export function getRecentSessions(year: number) {
  return fetchOpenF1<Session[]>("/sessions", { year, session_type: "Race" });
}

export function getDrivers(sessionKey: number) {
  return fetchOpenF1<Driver[]>("/drivers", { session_key: sessionKey });
}

export function getDriver(sessionKey: number, driverNumber: number) {
  return fetchOpenF1<Driver[]>("/drivers", { session_key: sessionKey, driver_number: driverNumber }).then(
    (d) => d[0],
  );
}

export function getLaps(sessionKey: number, driverNumber: number) {
  return fetchOpenF1<Lap[]>("/laps", { session_key: sessionKey, driver_number: driverNumber });
}

export function getPositions(sessionKey: number, driverNumber: number) {
  return fetchOpenF1<Position[]>("/position", { session_key: sessionKey, driver_number: driverNumber });
}

export function getPitStops(sessionKey: number, driverNumber: number) {
  return fetchOpenF1<PitStop[]>("/pit", { session_key: sessionKey, driver_number: driverNumber });
}

export function getStints(sessionKey: number, driverNumber: number) {
  return fetchOpenF1<Stint[]>("/stints", { session_key: sessionKey, driver_number: driverNumber });
}

export function getTeamRadio(sessionKey: number, driverNumber: number) {
  return fetchOpenF1<TeamRadio[]>("/team_radio", { session_key: sessionKey, driver_number: driverNumber });
}

export function getSessionTeamRadio(sessionKey: number) {
  return fetchOpenF1<TeamRadio[]>("/team_radio", { session_key: sessionKey });
}

export function getSessionRaceControl(sessionKey: number) {
  return fetchOpenF1<RaceControlMessage[]>("/race_control", { session_key: sessionKey });
}

export function getLatestWeather(sessionKey: number) {
  return fetchOpenF1<Weather[]>("/weather", { session_key: sessionKey }).then((w) => w.at(-1) ?? null);
}

export function getSessionLapCount(sessionKey: number) {
  return fetchOpenF1<Lap[]>("/laps", { session_key: sessionKey }).then((laps) =>
    laps.reduce((max, l) => Math.max(max, l.lap_number), 0),
  );
}

export function getSessionPositions(sessionKey: number) {
  return fetchOpenF1<Position[]>("/position", { session_key: sessionKey });
}

export function getSessionStints(sessionKey: number) {
  return fetchOpenF1<Stint[]>("/stints", { session_key: sessionKey });
}
