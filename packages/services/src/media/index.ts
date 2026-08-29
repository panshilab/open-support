import type { MediaAsset, UploadMediaMetadataInput } from '@open-support/schemas/media';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from '../axios';
import { toQueryString } from '../config';

export const getMediaAssetsQueryKey = (params: { mimeType?: string; provider?: string } = {}) =>
  ['media', 'assets', params] as const;

export async function getMediaAssets(params: { mimeType?: string; provider?: string } = {}) {
  const response = await axios.get<MediaAsset[]>(`/media${toQueryString(params)}`);
  return response.data;
}

export function useGetMediaAssetsQuery(params: { mimeType?: string; provider?: string } = {}) {
  return useQuery({
    queryKey: getMediaAssetsQueryKey(params),
    queryFn: () => getMediaAssets(params),
  });
}

export async function uploadMedia(file: File, metadata: UploadMediaMetadataInput = {}) {
  const form = new FormData();
  form.append('file', file);
  if (metadata.altText) form.append('altText', metadata.altText);
  if (metadata.caption) form.append('caption', metadata.caption);
  const response = await axios.post<MediaAsset>('/media', form);
  return response.data;
}

export function useUploadMediaMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ file, metadata }: { file: File; metadata?: UploadMediaMetadataInput }) =>
      uploadMedia(file, metadata),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['media', 'assets'] }),
  });
}

export async function deleteMedia(mediaId: string) {
  await axios.delete(`/media/${mediaId}`);
}

export function useDeleteMediaMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMedia,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['media', 'assets'] }),
  });
}
