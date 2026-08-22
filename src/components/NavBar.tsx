import Link from "next/link";

export default function NavBar({ active }: { active: "inicio" | "classificacao" }) {
  const links = [
    { href: "/", label: "Início", key: "inicio" as const },
    { href: "/classificacao", label: "Classificação", key: "classificacao" as const },
  ];

  return (
    <nav className="sticky top-0 z-20 border-b border-white/5 bg-[#0a0a0e]/80 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="w-2 h-6 bg-[var(--f1-red)] rounded-sm" />
          <span className="font-display text-xl tracking-wider">PADDOCK</span>
        </Link>

        <div className="flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.key}
              href={l.href}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                active === l.key ? "bg-white/10 text-white" : "text-neutral-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
