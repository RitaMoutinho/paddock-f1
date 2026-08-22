"use client";

import { useState } from "react";
import Link from "next/link";
import type { DriverStanding, ConstructorStanding } from "@/lib/types";
import { matchTeamColour } from "@/lib/teamColors";

type Tab = "pilotos" | "construtores";

export default function StandingsTabs({
  driverStandings,
  constructorStandings,
  teamColourMap,
  driverNumberByCode,
  sessionKey,
}: {
  driverStandings: DriverStanding[];
  constructorStandings: ConstructorStanding[];
  teamColourMap: Map<string, string>;
  driverNumberByCode: Map<string, number>;
  sessionKey: number;
}) {
  const [tab, setTab] = useState<Tab>("pilotos");

  return (
    <div className="panel">
      <div className="flex justify-center gap-1 bg-black/30 rounded-full p-1 border border-white/5 mb-6 w-fit mx-auto">
        {(["pilotos", "construtores"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-5 py-2 rounded-full text-sm font-semibold uppercase tracking-wide transition-all"
            style={tab === t ? { backgroundColor: "var(--f1-red)", color: "#fff" } : { color: "#9a9aa6" }}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "pilotos" ? (
        <ul className="flex flex-col divide-y divide-white/5">
          {driverStandings.map((s) => {
            const color = `#${matchTeamColour(teamColourMap, s.Constructors[0]?.name ?? "")}`;
            const number = driverNumberByCode.get(s.Driver.code);
            const href = number ? `/piloto/${number}?session=${sessionKey}` : undefined;
            const rowClass = `flex items-center gap-4 py-3 px-2 rounded-lg ${href ? "hover:bg-white/5 transition-colors" : ""}`;
            const content = (
              <>
                <span className="font-mono font-bold tabular-nums w-8 text-right text-neutral-400">{s.position}</span>
                <span className="w-1 self-stretch rounded-full shrink-0" style={{ backgroundColor: color }} />
                <span className="flex-1 min-w-0">
                  <span className="font-semibold block truncate">
                    {s.Driver.givenName} {s.Driver.familyName}
                  </span>
                  <span className="text-xs text-neutral-500 truncate">{s.Constructors[0]?.name}</span>
                </span>
                <span className="text-xs text-neutral-500 font-mono tabular-nums hidden sm:inline">
                  {s.wins} {Number(s.wins) === 1 ? "vitória" : "vitórias"}
                </span>
                <span className="font-mono font-bold tabular-nums w-16 text-right">{s.points} pts</span>
              </>
            );
            return (
              <li key={s.Driver.driverId}>
                {href ? (
                  <Link href={href} className={rowClass}>
                    {content}
                  </Link>
                ) : (
                  <div className={rowClass}>{content}</div>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <ul className="flex flex-col divide-y divide-white/5">
          {constructorStandings.map((s) => {
            const color = `#${matchTeamColour(teamColourMap, s.Constructor.name)}`;
            return (
              <li key={s.Constructor.constructorId} className="flex items-center gap-4 py-3 px-2">
                <span className="font-mono font-bold tabular-nums w-8 text-right text-neutral-400">{s.position}</span>
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
      )}
    </div>
  );
}
