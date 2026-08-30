import * as SecureStore from 'expo-secure-store';
import { removeTokenFromAxios, setTokenToAxios } from '@open-support/services';

const TOKEN_KEY = 'open_support_mobile_token';

export async function restoreMobileToken() {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  if (token) setTokenToAxios(token);
  return token;
}

export async function saveMobileToken(token: string) {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
  setTokenToAxios(token);
}

export async function clearMobileToken() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  removeTokenFromAxios();
}
