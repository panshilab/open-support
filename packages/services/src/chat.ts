import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  Chat,
  ChatMessage,
  SendChatMessageForm,
  StartChatForm,
} from '@open-support/schemas/chat';
import axios from './axios';

export interface ChatResponse {
  chat: Chat & { messages: ChatMessage[] };
  token: string;
}

export async function startChat(input: StartChatForm) {
  return (await axios.post<ChatResponse>('/chats', input)).data;
}

export async function getVisitorChat(chatId: string, token: string) {
  return (
    await axios.get<Chat & { messages: ChatMessage[] }>(
      `/chats/visitor/${chatId}?token=${encodeURIComponent(token)}`,
    )
  ).data;
}

export async function sendChatMessage(input: SendChatMessageForm & { token: string }) {
  return (await axios.post<ChatMessage>('/chats/messages', input)).data;
}

export const useStartChatMutation = () => useMutation({ mutationFn: startChat });

export const useVisitorChatQuery = (chatId: string | null, token: string | null) =>
  useQuery({
    queryKey: ['chat', chatId],
    queryFn: () => getVisitorChat(chatId!, token!),
    enabled: Boolean(chatId && token),
    refetchInterval: 5000,
  });

export const useSendChatMessageMutation = (chatId: string | null, token: string | null) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: SendChatMessageForm) => sendChatMessage({ ...input, token: token! }),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['chat', chatId] }),
  });
};
