import type { InviteStaffInput } from '@open-support/schemas/dashboard';
import type { StaffInvitation } from '@open-support/schemas/dashboard';
import { useMutation } from '@tanstack/react-query';
import axios from '../../axios';

export type TCreateStaffInvitationResponse = StaffInvitation;
export type TCreateStaffInvitationParams = InviteStaffInput;

export const getStaffInvitationsQueryKey = () => ['admin', 'staff', 'invitations'];

export async function createStaffInvitation(data: TCreateStaffInvitationParams) {
  const res = await axios.post<TCreateStaffInvitationResponse>('/admin/staff/invitations', data);
  return res.data;
}

export const useCreateStaffInvitationMutation = () => {
  return useMutation<TCreateStaffInvitationResponse, Error, TCreateStaffInvitationParams>({
    mutationFn: createStaffInvitation,
    meta: {
      invalidatesQuery: getStaffInvitationsQueryKey(),
      successMessage: 'Invitation sent',
    },
  });
};
