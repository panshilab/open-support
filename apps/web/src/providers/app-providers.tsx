import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  type UseMutationOptions,
} from '@tanstack/react-query';
import { Alert, Snackbar } from '@mui/material';

interface SnackbarState {
  message: string;
  severity: 'success' | 'error';
}

interface SnackbarContextValue {
  notifySuccess: (message: string) => void;
  notifyError: (message: string) => void;
}

const SnackbarContext = createContext<SnackbarContextValue | null>(null);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    },
  },
});

export function AppProviders({ children }: Readonly<{ children: ReactNode }>) {
  const [snackbar, setSnackbar] = useState<SnackbarState | null>(null);

  const notifySuccess = useCallback((message: string) => {
    setSnackbar({ message, severity: 'success' });
  }, []);

  const notifyError = useCallback((message: string) => {
    setSnackbar({ message, severity: 'error' });
  }, []);

  const handleClose = useCallback(() => {
    setSnackbar(null);
  }, []);

  const value = useMemo(
    () => ({
      notifySuccess,
      notifyError,
    }),
    [notifyError, notifySuccess],
  );

  return (
    <QueryClientProvider client={queryClient}>
      <SnackbarContext.Provider value={value}>
        {children}
        <Snackbar
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          autoHideDuration={4000}
          onClose={handleClose}
          open={Boolean(snackbar)}
        >
          {snackbar ? (
            <Alert onClose={handleClose} severity={snackbar.severity} variant="filled">
              {snackbar.message}
            </Alert>
          ) : undefined}
        </Snackbar>
      </SnackbarContext.Provider>
    </QueryClientProvider>
  );
}

export function useSnackbar() {
  const context = useContext(SnackbarContext);

  if (!context) {
    throw new Error('useSnackbar must be used within AppProviders');
  }

  return context;
}

export function useSnackbarMutation<TData, TError, TVariables, TContext>(
  options: UseMutationOptions<TData, TError, TVariables, TContext> & {
    successMessage?: string;
    errorMessage?: string;
  },
) {
  const { notifyError, notifySuccess } = useSnackbar();
  const { errorMessage, onError, onSuccess, successMessage, ...mutationOptions } = options;

  return useMutation({
    ...mutationOptions,
    onError: (error, variables, onMutateResult, context) => {
      notifyError(errorMessage ?? getErrorMessage(error));
      onError?.(error, variables, onMutateResult, context);
    },
    onSuccess: (data, variables, onMutateResult, context) => {
      if (successMessage) {
        notifySuccess(successMessage);
      }
      onSuccess?.(data, variables, onMutateResult, context);
    },
  });
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Request failed';
}
