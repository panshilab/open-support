import type { ChangePasswordForm } from '@open-support/schemas/auth';
import { useMutation } from '@tanstack/react-query';
import axios from '../axios';
import { getCurrentSessionQueryKey } from './get-current-session';
import type { SessionResponse } from '../types';

export async function changePassword(data: ChangePasswordForm) {
  const res = await axios.post<SessionResponse>('/auth/change-password', data);
  return res.data;
}

export const useChangePasswordMutation = () => {
  return useMutation<SessionResponse, Error, ChangePasswordForm>({
    mutationFn: changePassword,
    meta: {
      invalidatesQuery: getCurrentSessionQueryKey(),
      successMessage: 'Password updated',
    },
  });
};
