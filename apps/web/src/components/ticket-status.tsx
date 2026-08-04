export interface TicketStatusMeta {
  label: string;
  bg: string;
  fg: string;
}

export const TICKET_STATUS_META: Record<string, TicketStatusMeta> = {
  open: { label: 'Open', bg: 'rgba(217, 119, 6, 0.14)', fg: '#92400e' },
  customer_reply: { label: 'Customer reply', bg: 'rgba(37, 99, 235, 0.14)', fg: '#1e40af' },
  replied: { label: 'Replied', bg: 'rgba(15, 118, 110, 0.14)', fg: '#0d5f59' },
  resolved: { label: 'Resolved', bg: 'rgba(20, 83, 45, 0.14)', fg: '#14532d' },
};
