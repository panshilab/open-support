import type { AskAssistantForm, AssistantResponse } from '@open-support/schemas/assistant';
import { useMutation } from '@tanstack/react-query';
import axios from '../axios';

export async function askAssistant(data: AskAssistantForm): Promise<AssistantResponse> {
  const res = await axios.post<AssistantResponse>('/assistant/message', data);
  return res.data;
}

export const useAskAssistantMutation = () =>
  useMutation<AssistantResponse, Error, AskAssistantForm>({
    mutationFn: askAssistant,
  });
