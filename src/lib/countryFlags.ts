// Maps the FIA/broadcast-style 3-letter codes OpenF1 returns to ISO 3166-1 alpha-2,
// which is what the `country-flag-icons` SVG set is keyed by.
const ISO2: Record<string, string> = {
  NED: "NL",
  NLD: "NL",
  GBR: "GB",
  GB: "GB",
  MON: "MC",
  MCO: "MC",
  ESP: "ES",
  FRA: "FR",
  GER: "DE",
  DEU: "DE",
  ITA: "IT",
  AUS: "AU",
  CAN: "CA",
  MEX: "MX",
  BRA: "BR",
  JPN: "JP",
  THA: "TH",
  CHN: "CN",
  FIN: "FI",
  DEN: "DK",
  DNK: "DK",
  NZL: "NZ",
  ARG: "AR",
  USA: "US",
  RSA: "ZA",
  ZAF: "ZA",
  BEL: "BE",
  AUT: "AT",
  SUI: "CH",
  CHE: "CH",
  POL: "PL",
  IND: "IN",
};

export function toIso2(code: string | null): string | null {
  if (!code) return null;
  return ISO2[code.toUpperCase()] ?? null;
}
