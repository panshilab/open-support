import type { SendOtpForm } from '@open-support/schemas/auth';
import { useMutation } from '@tanstack/react-query';
import axios from '../axios';

export interface SendOtpResponse {
  ok: boolean;
}

export async function sendOtp(data: SendOtpForm) {
  const res = await axios.post<SendOtpResponse>('/auth/send-otp', data);
  return res.data;
}

export const useSendOtpMutation = () => {
  return useMutation<SendOtpResponse, Error, SendOtpForm>({
    mutationFn: sendOtp,
  });
};
