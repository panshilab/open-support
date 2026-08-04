import { axiosServiceInstance } from './axios';

export interface ServicesConfig {
  baseURL?: string;
}

export function configureServices(config: ServicesConfig) {
  axiosServiceInstance.defaults.baseURL = config.baseURL ?? '';
}

export function toQueryString<T extends object>(params: T) {
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') {
      search.set(key, String(value));
    }
  }

  const value = search.toString();
  return value ? `?${value}` : '';
}
