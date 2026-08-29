import type {
  AdminSetting,
  AuditLog,
  DashboardStats,
  StaffPresence,
} from '@open-support/schemas/dashboard';
import type { Ticket } from '@open-support/schemas/ticket';
import { useQuery } from '@tanstack/react-query';
import axios from '../axios';
import { toQueryString } from '../config';

export interface StaffStats {
  id: string;
  email: string;
  name: string | null;
  role: 'admin' | 'support_agent';
  replyCount: number;
}

export async function getDashboardStats() {
  return (await axios.get<DashboardStats>('/admin/dashboard/stats')).data;
}
export async function getRecentTickets() {
  return (await axios.get<Ticket[]>('/admin/dashboard/recent-tickets')).data;
}
export async function getStaffStats() {
  return (await axios.get<StaffStats[]>('/admin/staff/stats')).data;
}
export async function getStaffPresence() {
  return (await axios.get<StaffPresence[]>('/admin/staff/presence')).data;
}
export async function sendStaffHeartbeat(status: 'online' | 'away' = 'online') {
  return (await axios.post<StaffPresence>('/admin/staff/heartbeat', { status })).data;
}
export async function getAdminSettings() {
  return (await axios.get<AdminSetting[]>('/admin/settings')).data;
}
export async function upsertAdminSetting(data: { key: string; value: Record<string, unknown> }) {
  return (await axios.patch<AdminSetting>('/admin/settings', data)).data;
}
export async function getAuditLogs(
  params: { action?: string; limit?: number; page?: number } = {},
) {
  return (await axios.get<AuditLog[]>(`/admin/audit-logs${toQueryString(params)}`)).data;
}

export const useDashboardStatsQuery = () =>
  useQuery({ queryKey: ['admin', 'dashboard', 'stats'], queryFn: getDashboardStats });
export const useRecentTicketsQuery = () =>
  useQuery({ queryKey: ['admin', 'dashboard', 'recent-tickets'], queryFn: getRecentTickets });
export const useStaffStatsQuery = () =>
  useQuery({ queryKey: ['admin', 'staff', 'stats'], queryFn: getStaffStats });
export const useStaffPresenceQuery = () =>
  useQuery({ queryKey: ['admin', 'staff', 'presence'], queryFn: getStaffPresence });
export const useAdminSettingsQuery = () =>
  useQuery({ queryKey: ['admin', 'settings'], queryFn: getAdminSettings });
export const useAuditLogsQuery = (
  params: { action?: string; limit?: number; page?: number } = {},
) => useQuery({ queryKey: ['admin', 'audit-logs', params], queryFn: () => getAuditLogs(params) });
