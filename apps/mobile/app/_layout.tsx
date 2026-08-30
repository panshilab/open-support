import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { configureServices } from '@open-support/services';
import { restoreMobileToken } from '../src/mobile-session';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

if (!apiUrl) {
  throw new Error('EXPO_PUBLIC_API_URL is required, for example http://192.168.1.10:7001');
}

configureServices({ baseURL: apiUrl });

export default function RootLayout() {
  useEffect(() => {
    void restoreMobileToken();
  }, []);

  return <Stack />;
}
