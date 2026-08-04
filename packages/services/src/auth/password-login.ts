import type { PasswordLoginForm } from '@open-support/schemas/auth';
import { useMutation } from '@tanstack/react-query';
import axios from '../axios';
import { getCurrentSessionQueryKey } from './get-current-session';
import type { SessionResponse } from '../types';

export async function passwordLogin(data: PasswordLoginForm) {
  const res = await axios.post<SessionResponse>('/auth/password', data);
  return res.data;
}

export const usePasswordLoginMutation = () => {
  return useMutation<SessionResponse, Error, PasswordLoginForm>({
    mutationFn: passwordLogin,
    meta: {
      invalidatesQuery: getCurrentSessionQueryKey(),
    },
  });
};
