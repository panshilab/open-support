export interface AxiosResponse<T> {
  data: T;
  status: number;
  headers: Headers;
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface AxiosDefaults {
  baseURL: string;
  headers: Record<string, string>;
}

interface RequestConfig {
  headers?: HeadersInit;
  signal?: AbortSignal;
}

interface RequestWithBodyConfig extends RequestConfig {
  body?: unknown;
}

type RefreshStateSubscriber = (refreshing: boolean) => void;

const refreshSubscribers = new Set<RefreshStateSubscriber>();
let bearerToken: string | null = null;

export const PUBLIC_PATHS = [
  '/auth/send-otp',
  '/auth/verify-otp',
  '/auth/password',
  '/auth/google',
  '/auth/google/config',
  '/invitations/accept',
  '/knowledgebase',
  '/assistant',
];

function isPublicPath(path: string) {
  return PUBLIC_PATHS.some((publicPath) => path.startsWith(publicPath));
}

function createUrl(path: string, baseURL: string) {
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const apiPath = normalizedPath.startsWith('/api/') ? normalizedPath : `/api${normalizedPath}`;
  return `${baseURL}${apiPath}`;
}

async function request<T>(
  method: string,
  path: string,
  config: RequestWithBodyConfig = {},
): Promise<AxiosResponse<T>> {
  if (!bearerToken && typeof document !== 'undefined' && !isPublicPath(path)) {
    // Cookie-backed sessions are still sent below. This guard mainly protects future bearer-token apps.
  }

  const headers = new Headers(axiosServiceInstance.defaults.headers);
  const isFormData = typeof FormData !== 'undefined' && config.body instanceof FormData;
  if (config.body !== undefined && !isFormData) {
    headers.set('Content-Type', 'application/json');
  }
  if (bearerToken) {
    headers.set('Authorization', `Bearer ${bearerToken}`);
  }
  new Headers(config.headers).forEach((value, key) => headers.set(key, value));

  const response = await fetch(createUrl(path, axiosServiceInstance.defaults.baseURL), {
    body:
      config.body === undefined
        ? undefined
        : isFormData
          ? (config.body as FormData)
          : JSON.stringify(config.body),
    credentials: 'include',
    headers,
    method,
    signal: config.signal,
  });

  if (!response.ok) {
    throw new ApiError(await readErrorMessage(response), response.status);
  }

  return {
    data: await readResponseBody<T>(response),
    headers: response.headers,
    status: response.status,
  };
}

async function readResponseBody<T>(response: Response) {
  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

async function readErrorMessage(response: Response) {
  const fallback = `Request failed with status ${response.status}`;

  try {
    const payload = (await response.json()) as { message?: string | string[] };
    if (Array.isArray(payload.message)) {
      return payload.message.join(', ');
    }
    return payload.message ?? fallback;
  } catch {
    return fallback;
  }
}

export const axiosServiceInstance = {
  defaults: {
    baseURL: '',
    headers: {},
  } satisfies AxiosDefaults,
  get<T>(path: string, config?: RequestConfig) {
    return request<T>('GET', path, config);
  },
  post<T>(path: string, body?: unknown, config?: RequestConfig) {
    return request<T>('POST', path, { ...config, body });
  },
  patch<T>(path: string, body?: unknown, config?: RequestConfig) {
    return request<T>('PATCH', path, { ...config, body });
  },
  delete<T>(path: string, config?: RequestConfig) {
    return request<T>('DELETE', path, config);
  },
};

export function setTokenToAxios(token: string) {
  bearerToken = token;
}

export function removeTokenFromAxios() {
  bearerToken = null;
}

export function subscribeRefreshState(subscriber: RefreshStateSubscriber) {
  refreshSubscribers.add(subscriber);
  return () => refreshSubscribers.delete(subscriber);
}

export function notifyRefreshState(refreshing: boolean) {
  refreshSubscribers.forEach((subscriber) => subscriber(refreshing));
}

export default axiosServiceInstance;
