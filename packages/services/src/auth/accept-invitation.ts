import type { AcceptInvitationForm } from '@open-support/schemas/auth';
import { useMutation } from '@tanstack/react-query';
import axios from '../axios';
import { getCurrentSessionQueryKey } from './get-current-session';
import type { SessionResponse } from '../types';

export async function acceptInvitation(data: AcceptInvitationForm) {
  const { confirmPassword: _confirmPassword, ...input } = data;
  const res = await axios.post<SessionResponse>('/invitations/accept', input);
  return res.data;
}

export const useAcceptInvitationMutation = () => {
  return useMutation<SessionResponse, Error, AcceptInvitationForm>({
    mutationFn: acceptInvitation,
    meta: {
      invalidatesQuery: getCurrentSessionQueryKey(),
    },
  });
};
