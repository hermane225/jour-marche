// Hooks personnalisés pour l'API
import { useState, useEffect, useCallback } from 'react';
import { config } from '../config';

// Hook générique pour les appels API avec gestion d'état
interface UseApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useApi<T>(
  apiCall: () => Promise<T>,
  dependencies: unknown[] = [],
  options: { immediate?: boolean } = { immediate: true }
): UseApiState<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(options.immediate ?? true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    // Si on utilise les données mockées, ne pas appeler l'API
    if (config.useMockData) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await apiCall();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Une erreur est survenue'));
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  useEffect(() => {
    if (options.immediate) {
      fetch();
    }
  }, [fetch, options.immediate]);

  return { data, isLoading, error, refetch: fetch };
}

// Hook pour les mutations (POST, PUT, DELETE)
interface UseMutationState<T, P> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  mutate: (params: P) => Promise<T>;
  reset: () => void;
}

export function useMutation<T, P = void>(
  mutationFn: (params: P) => Promise<T>
): UseMutationState<T, P> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (params: P): Promise<T> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await mutationFn(params);
      setData(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Une erreur est survenue');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [mutationFn]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return { data, isLoading, error, mutate, reset };
}

// Hook pour la pagination
interface UsePaginationState<T> {
  data: T[];
  isLoading: boolean;
  error: Error | null;
  page: number;
  totalPages: number;
  total: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  refetch: () => Promise<void>;
}

interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    totalPages: number;
    total: number;
  };
}

export function usePaginatedApi<T>(
  apiCall: (page: number, limit: number) => Promise<PaginatedResult<T>>,
  limit: number = 10,
  dependencies: unknown[] = []
): UsePaginationState<T> {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetch = useCallback(async () => {
    if (config.useMockData) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await apiCall(page, limit);
      setData(result.data);
      setTotalPages(result.pagination.totalPages);
      setTotal(result.pagination.total);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Une erreur est survenue'));
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, ...dependencies]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const goToPage = useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  }, [totalPages]);

  const nextPage = useCallback(() => {
    goToPage(page + 1);
  }, [page, goToPage]);

  const previousPage = useCallback(() => {
    goToPage(page - 1);
  }, [page, goToPage]);

  return {
    data,
    isLoading,
    error,
    page,
    totalPages,
    total,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
    goToPage,
    nextPage,
    previousPage,
    refetch: fetch,
  };
}

export default { useApi, useMutation, usePaginatedApi };
