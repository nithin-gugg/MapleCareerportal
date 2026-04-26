/**
 * safeFetch — A reusable API helper that:
 * - Sets loading state before the request
 * - Always clears loading state after (success or failure)
 * - Parses JSON and propagates errors cleanly
 *
 * Usage:
 *   const data = await safeFetch("/api/candidates", { method: "GET" }, setLoading);
 */
export async function safeFetch<T = unknown>(
  url: string,
  options: RequestInit = {},
  setLoading: (loading: boolean) => void
): Promise<T> {
  try {
    setLoading(true);
    const res = await fetch(url, options);

    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      throw new Error(
        errorBody?.error || errorBody?.message || `Request failed with status ${res.status}`
      );
    }

    return (await res.json()) as T;
  } catch (err) {
    // Re-throw for caller to handle (e.g., show toast)
    throw err;
  } finally {
    setLoading(false);
  }
}
