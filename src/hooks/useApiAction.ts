import { useCallback, useState } from 'react';
import { toApiError } from '../api/http';
import type { ApiErrorDto } from '../dtos/api';

export function useApiAction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiErrorDto | null>(null);

  const run = useCallback(async <T,>(action: () => Promise<T>) => {
    setLoading(true);
    setError(null);

    try {
      return await action();
    } catch (caughtError) {
      const apiError = toApiError(caughtError);
      setError(apiError);
      throw apiError;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    setError,
    run,
  };
}
