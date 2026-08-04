import type { VerifyOtpForm } from '@open-support/schemas/auth';
import { useMutation } from '@tanstack/react-query';
import axios from '../axios';
import { getCurrentSessionQueryKey } from './get-current-session';
import type { SessionResponse } from '../types';

export async function verifyOtp(data: VerifyOtpForm) {
  const res = await axios.post<SessionResponse>('/auth/verify-otp', data);
  return res.data;
}

export const useVerifyOtpMutation = () => {
  return useMutation<SessionResponse, Error, VerifyOtpForm>({
    mutationFn: verifyOtp,
    meta: {
      invalidatesQuery: getCurrentSessionQueryKey(),
    },
  });
};
