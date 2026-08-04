import { STATUS_COLORS } from '../theme';

export interface TicketStatusMeta {
  label: string;
  bg: string;
  fg: string;
}

export const TICKET_STATUS_META: Record<string, TicketStatusMeta> = {
  open: { label: 'Open', ...STATUS_COLORS.open },
  customer_reply: { label: 'Customer reply', ...STATUS_COLORS.customer_reply },
  replied: { label: 'Replied', ...STATUS_COLORS.replied },
  resolved: { label: 'Resolved', ...STATUS_COLORS.resolved },
};
