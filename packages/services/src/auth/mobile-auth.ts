import type { VerifyOtpForm, PasswordLoginForm } from '@open-support/schemas/auth';
import axios from '../axios';
import type { MobileSessionResponse } from '../types';

export async function mobileVerifyOtp(data: VerifyOtpForm) {
  return (await axios.post<MobileSessionResponse>('/auth/mobile/verify-otp', data)).data;
}

export async function mobilePasswordLogin(data: PasswordLoginForm) {
  return (await axios.post<MobileSessionResponse>('/auth/mobile/password', data)).data;
}
