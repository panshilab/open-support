import { useMutation } from '@tanstack/react-query';
import axios from '../axios';
import { getCurrentSessionQueryKey } from './get-current-session';
import type { SessionResponse } from '../types';

export interface GoogleLoginParams {
  idToken: string;
}

export async function googleLogin(data: GoogleLoginParams) {
  const res = await axios.post<SessionResponse>('/auth/google', data);
  return res.data;
}

export const useGoogleLoginMutation = () => {
  return useMutation<SessionResponse, Error, GoogleLoginParams>({
    mutationFn: googleLogin,
    meta: {
      invalidatesQuery: getCurrentSessionQueryKey(),
    },
  });
};
