import { useQuery } from '@tanstack/react-query';
import axios from '../axios';

export interface GoogleConfigResponse {
  enabled: boolean;
  clientId: string | null;
}

export const getGoogleConfigQueryKey = () => ['auth', 'google', 'config'];

export async function getGoogleConfig() {
  const res = await axios.get<GoogleConfigResponse>('/auth/google/config');
  return res.data;
}

export const useGetGoogleConfig = () => {
  return useQuery<GoogleConfigResponse, Error>({
    queryKey: getGoogleConfigQueryKey(),
    queryFn: getGoogleConfig,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};
