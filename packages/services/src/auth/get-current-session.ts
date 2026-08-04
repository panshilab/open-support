import { useQuery } from '@tanstack/react-query';
import axios from '../axios';
import type { SessionResponse } from '../types';

export const getCurrentSessionQueryKey = () => ['auth', 'me'];

export async function getCurrentSession() {
  const res = await axios.get<SessionResponse>('/auth/me');
  return res.data;
}

export const useGetCurrentSession = (options?: { enabled?: boolean }) => {
  return useQuery<SessionResponse, Error>({
    queryKey: getCurrentSessionQueryKey(),
    queryFn: getCurrentSession,
    enabled: options?.enabled ?? true,
    staleTime: 2 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
  });
};
