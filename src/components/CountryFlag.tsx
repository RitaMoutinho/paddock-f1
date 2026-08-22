import {
  NL,
  GB,
  MC,
  ES,
  FR,
  DE,
  IT,
  AU,
  CA,
  MX,
  BR,
  JP,
  TH,
  CN,
  FI,
  DK,
  NZ,
  AR,
  US,
  ZA,
  BE,
  AT,
  CH,
  PL,
  IN,
} from "country-flag-icons/react/3x2";
import { Flag } from "lucide-react";
import { toIso2 } from "@/lib/countryFlags";

const FLAG_COMPONENTS: Record<string, React.ElementType> = {
  NL,
  GB,
  MC,
  ES,
  FR,
  DE,
  IT,
  AU,
  CA,
  MX,
  BR,
  JP,
  TH,
  CN,
  FI,
  DK,
  NZ,
  AR,
  US,
  ZA,
  BE,
  AT,
  CH,
  PL,
  IN,
};

export default function CountryFlag({ code, className }: { code: string | null; className?: string }) {
  const iso2 = toIso2(code);
  const FlagComponent = iso2 ? FLAG_COMPONENTS[iso2] : null;

  if (!FlagComponent) {
    return <Flag className={className} strokeWidth={1.5} />;
  }

  return <FlagComponent className={className} />;
}
