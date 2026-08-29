import type { User } from '@open-support/schemas/user';
import { useQuery } from '@tanstack/react-query';
import axios from '../../axios';

export async function getStaff() {
  return (await axios.get<User[]>('/users/staff')).data;
}

export const useStaffQuery = () => useQuery({ queryKey: ['admin', 'staff'], queryFn: getStaff });
