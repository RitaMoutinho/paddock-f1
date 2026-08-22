// Distinguishes "the API returned successfully and there's genuinely nothing here" from
// "the request itself failed" (most commonly OpenF1's free-tier rate limit). Callers use
// `failed` to show a distinct "couldn't load, try reloading" message instead of a plain
// empty state — silently treating a failed request as empty data hides real problems.
export interface FetchResult<T> {
  data: T;
  failed: boolean;
}

export async function safeFetch<T>(promise: Promise<T>, fallback: T): Promise<FetchResult<T>> {
  try {
    const data = await promise;
    return { data, failed: false };
  } catch {
    return { data: fallback, failed: true };
  }
}
