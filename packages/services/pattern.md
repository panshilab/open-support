# `@onesource/services` package — structure & code style

## Folder structure

Group by domain, not by app. Root `index.ts` barrel-exports every domain folder.
Root also has `axios.ts` (re-export), `config.ts`, `query-client.ts`.

```
packages/services/src/
  <domain>/
    <feature>/
      get-all-x.ts
      get-x.ts
      update-x.ts
      create-x.ts
      delete-x.ts
      index.ts        (barrel for the feature folder, optional)
  common/
    axios/index.ts
  query-client.ts
  index.ts             (root barrel)
```

## File-per-hook convention

One query/mutation per file: `get-x.ts`, `get-all-x.ts`, `update-x.ts`, `create-x.ts`, `delete-x.ts`.
Each file self-contained: types + query-key fn + hook.

## Type sourcing rule

Always check `@onesource/schemas` first. Only define local interface/type if no schema exists there yet.

## Query pattern — get all / list

- Export `TXxxResponse`, `TXxxParams` types
- Export `useXxxQueryKey(params)` fn — reusable elsewhere for invalidation
- Export `useXxxQuery` hook — `useQuery<TResponse, TError>`, calls shared `axios` instance
- Common defaults: `staleTime`, `refetchOnMount: false`, `refetchOnWindowFocus: false`

```ts
// get-all-users.ts
import type { TError } from '@onesource/schemas';
import { useQuery } from '@tanstack/react-query';
import axios from '../../axios';

export interface TMembersUser {
  id: string;
  email: string;
  name: string;
}

export interface TMembersUsersResponse {
  data: TMembersUser[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    perPage: number;
  };
}

export interface TGetMembersUsersParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const useGetMembersUsersQueryKey = (params: TGetMembersUsersParams) => [
  'user-management',
  'admin',
  'users',
  params,
];

export const useGetMembersUsers = (params: TGetMembersUsersParams = {}) => {
  const { page = 1, limit = 30, search } = params;

  return useQuery<TMembersUsersResponse, TError>({
    queryKey: useGetMembersUsersQueryKey(params),
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      queryParams.set('page', String(page));
      queryParams.set('limit', String(limit));
      if (search) queryParams.set('search', search);

      const res = await axios.get<TMembersUsersResponse>(`/user-management/admin/users?${queryParams.toString()}`);
      return res.data;
    },
    staleTime: 2 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};
```

## Query pattern — get single

- Export a `getXxxQueryKey(id)` fn (not hook-prefixed — plain fn since it's reused by mutations for targeted invalidation)
- Hook takes id + optional `{ enabled }` to gate the fetch
- Reuse the response type from the list file instead of redefining

```ts
// get-user.ts
import type { TError } from '@onesource/schemas';
import { useQuery } from '@tanstack/react-query';
import axios from '../../axios';
import type { TMembersUser } from './get-all-users';

export const getAdminUserQueryKey = (userId: string) => ['user-management', 'admin', 'users', userId];

export const useGetUser = (userId: string, options?: { enabled?: boolean }) => {
  return useQuery<TMembersUser, TError>({
    queryKey: getAdminUserQueryKey(userId),
    queryFn: async () => {
      const res = await axios.get<TMembersUser>(`/user-management/admin/users/${userId}`);
      return res.data;
    },
    enabled: options?.enabled ?? !!userId,
    staleTime: 2 * 60 * 1000,
  });
};
```

## Mutation pattern

- `useXxxMutation` wraps `useMutation<TResponse, TError, TParams>`
- `onSuccess` invalidates related keys via `queryClient.invalidateQueries` — import sibling query's key fn for exact match + broader key for list refresh
- Alt declarative path: mutation `meta.invalidatesQuery` / `successMessage` / `errorMessage` — handled centrally by `MutationCache` (toast + auto-invalidate), skip manual `onSuccess` wiring when that's enough

```ts
// update-user.ts
import type { TError, TUpdateUser } from '@onesource/schemas';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../../axios';
import type { TMembersUser } from './get-all-users';
import { getAdminUserQueryKey } from './get-user';

export interface TUpdateUserResponse extends TMembersUser {}

export interface TUpdateUserParams {
  userId: string;
  data: TUpdateUser;
}

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<TUpdateUserResponse, TError, TUpdateUserParams>({
    mutationFn: async ({ userId, data }: TUpdateUserParams) => {
      const res = await axios.patch<TUpdateUserResponse>(`/user-management/admin/users/${userId}`, data);
      return res.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user-management', 'admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: getAdminUserQueryKey(variables.userId) });
    },
  });
};
```

## Axios layer (`common/axios/index.ts`)

- One shared instance, `baseURL` blank at creation — each consuming app sets `axiosServiceInstance.defaults.baseURL` at init
- Request interceptor: blocks calls w/o session except allowlisted public paths
- Response interceptor: 401 → refresh-token flow, dedups concurrent refreshes via subscriber queue, retries original request; refresh fail → logout + redirect
- Exports `setTokenToAxios`/`removeTokenFromAxios`, `subscribeRefreshState`

## query-client.ts

Single `QueryClient`, custom `MutationCache`:
- global `onSuccess`/`onError` toast via `mutation.meta.successMessage` / `errorMessage`
- `onSettled` auto-invalidate via `mutation.meta.invalidatesQuery` / `invalidatesQueries`

Declared once, shared across all consumers.

## Consumption rule

Never call axios/API paths directly in components — always go through exported hooks from the package barrel.
