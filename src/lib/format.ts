export function formatLapTime(seconds: number | null): string {
  if (seconds === null || Number.isNaN(seconds)) return "—";
  const minutes = Math.floor(seconds / 60);
  const rest = (seconds - minutes * 60).toFixed(3).padStart(6, "0");
  return `${minutes}:${rest}`;
}

export function formatDuration(seconds: number | null): string {
  if (seconds === null || Number.isNaN(seconds)) return "—";
  return `${seconds.toFixed(3)}s`;
}

export function formatClock(iso: string): string {
  return new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

// OpenF1 serves driver headshots via F1's AEM image transform pipeline, defaulting to a
// heavily compressed "1col" thumbnail. Swapping the transform segment gets the same
// photo at a sharper preset — "6col" for small thumbnails, "9col-retina" for hero shots.
export function highResHeadshot(url: string | null, size: "6col" | "9col-retina" = "9col-retina"): string | null {
  if (!url) return null;
  return url.replace(/\.transform\/[^/]+\/image\.png$/, `.transform/${size}/image.png`);
}

// No licensed source for the real team logos, so teams get a monogram instead:
// initials for multi-word names ("Red Bull Racing" -> "RBR"), first letters otherwise.
export function teamInitials(teamName: string): string {
  const words = teamName.split(" ").filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 3).toUpperCase();
  return words
    .map((w) => w[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
}
