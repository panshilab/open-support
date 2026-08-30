export interface PageResponse<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  nextPage: number | null;
}

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  role: 'admin' | 'support_agent' | 'user';
  mustChangePassword: boolean;
}

export interface SessionResponse {
  user: SessionUser;
}

export interface MobileSessionResponse extends SessionResponse {
  token: string;
}
