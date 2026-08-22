import Link from "next/link";
import Image from "next/image";
import type { Driver } from "@/lib/types";
import CountryFlag from "@/components/CountryFlag";
import { highResHeadshot } from "@/lib/format";

export default function DriverCard({ driver, sessionKey }: { driver: Driver; sessionKey: number }) {
  const color = `#${driver.team_colour}`;

  return (
    <Link
      href={`/piloto/${driver.driver_number}?session=${sessionKey}`}
      className="group relative flex flex-col h-60 overflow-hidden rounded-xl border border-white/8 transition-all hover:-translate-y-1 hover:border-white/20"
      style={{ backgroundColor: "#15151e", boxShadow: "0 12px 28px -12px rgba(0,0,0,0.55)" }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: `radial-gradient(120% 90% at 100% 0%, ${color}2e 0%, transparent 60%)` }}
      />

      {driver.headshot_url && (
        <div className="absolute inset-x-0 bottom-0 top-6 flex items-end justify-center">
          <Image
            src={highResHeadshot(driver.headshot_url, "6col")!}
            alt={driver.full_name}
            width={200}
            height={200}
            className="h-full w-auto object-contain object-bottom opacity-95 transition-transform group-hover:scale-105"
            unoptimized
          />
        </div>
      )}

      <div className="relative flex items-center justify-between px-3 pt-3">
        <span
          className="font-mono font-bold tabular-nums text-xs px-2 py-1 rounded-md"
          style={{ backgroundColor: `${color}cc`, color: "#0a0a0d" }}
        >
          #{driver.driver_number}
        </span>
        {driver.country_code && (
          <CountryFlag code={driver.country_code} className="w-5 h-auto rounded-[2px] shadow-sm" />
        )}
      </div>

      <div
        className="relative mt-auto px-4 py-3"
        style={{ background: "linear-gradient(180deg, transparent, rgba(10,10,13,0.75) 40%, rgba(10,10,13,0.92))" }}
      >
        <p className="font-semibold leading-tight text-white truncate">{driver.full_name}</p>
        <p className="text-sm truncate" style={{ color }}>
          {driver.team_name}
        </p>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-[3px]" style={{ backgroundColor: color }} />
    </Link>
  );
}
