import { MutationCache, QueryClient, type QueryKey } from '@tanstack/react-query';

interface MutationNotifier {
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}

interface ServicesMutationMeta extends Record<string, unknown> {
  errorMessage?: string;
  invalidatesQueries?: QueryKey[];
  invalidatesQuery?: QueryKey;
  successMessage?: string;
}

let notifier: MutationNotifier = {};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    },
  },
  mutationCache: new MutationCache({
    onError: (_error, _variables, _context, mutation) => {
      const meta = mutation.meta as ServicesMutationMeta | undefined;
      if (meta?.errorMessage) {
        notifier.onError?.(meta.errorMessage);
      }
    },
    onSuccess: (_data, _variables, _context, mutation) => {
      const meta = mutation.meta as ServicesMutationMeta | undefined;
      if (meta?.successMessage) {
        notifier.onSuccess?.(meta.successMessage);
      }
    },
    onSettled: (_data, _error, _variables, _context, mutation) => {
      const meta = mutation.meta as ServicesMutationMeta | undefined;
      const queryKeys = [
        ...(meta?.invalidatesQuery ? [meta.invalidatesQuery] : []),
        ...(meta?.invalidatesQueries ?? []),
      ];

      for (const queryKey of queryKeys) {
        void queryClient.invalidateQueries({ queryKey });
      }
    },
  }),
});

export function setServicesMutationNotifier(nextNotifier: MutationNotifier) {
  notifier = nextNotifier;
}

export function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Request failed';
}
