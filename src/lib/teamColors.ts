import type { Driver } from "./types";

const FALLBACK_COLOUR = "888888";

// Jolpica (standings) and OpenF1 (live session) name teams slightly differently
// ("Red Bull" vs "Red Bull Racing"), so match loosely instead of requiring an exact key.
export function buildTeamColourMap(drivers: Driver[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const d of drivers) {
    map.set(d.team_name.toLowerCase(), d.team_colour);
  }
  return map;
}

export function matchTeamColour(map: Map<string, string>, constructorName: string): string {
  const needle = constructorName.toLowerCase();
  if (map.has(needle)) return map.get(needle)!;

  for (const [teamName, colour] of map) {
    if (teamName.includes(needle) || needle.includes(teamName)) return colour;
  }
  return FALLBACK_COLOUR;
}
