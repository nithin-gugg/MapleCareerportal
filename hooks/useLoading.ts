import { useState, useCallback } from "react";

/**
 * useLoading — A reusable hook that wraps any async operation with:
 * - A `loading` boolean for UI feedback
 * - A `withLoading` wrapper that prevents concurrent calls (double-click protection)
 *
 * Usage:
 *   const { loading, withLoading } = useLoading();
 *   const handleClick = () => withLoading(async () => { await myApiCall(); });
 */
export function useLoading() {
  const [loading, setLoading] = useState(false);

  const withLoading = useCallback(
    async <T>(fn: () => Promise<T>): Promise<T | undefined> => {
      // Guard: prevent duplicate calls while already loading
      if (loading) return undefined;

      try {
        setLoading(true);
        return await fn();
      } catch (err) {
        // Re-throw so callers can handle errors (toast, etc.)
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [loading]
  );

  return { loading, withLoading };
}
