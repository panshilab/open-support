import type { UpdateUserRoleInput, User } from '@open-support/schemas/user';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../../axios';

export async function updateStaffRole(userId: string, input: UpdateUserRoleInput) {
  return (await axios.patch<User>(`/users/${userId}/role`, input)).data;
}

export const useUpdateStaffRoleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: UpdateUserRoleInput['role'] }) =>
      updateStaffRole(userId, { role }),
    meta: { successMessage: 'Staff role updated' },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin'] }),
  });
};
