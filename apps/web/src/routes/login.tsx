import { useCallback, useEffect, useRef, useState } from 'react';
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import GoogleIcon from '@mui/icons-material/Google';
import MailOutlineIcon from '@mui/icons-material/MailOutlineOutlined';
import PasswordIcon from '@mui/icons-material/PasswordOutlined';
import { Alert, Box, Button, Divider, Paper, Stack, TextField, Typography } from '@mui/material';
import {
  getCurrentSession,
  getGoogleConfig,
  googleLogin,
  usePasswordLoginMutation,
  useSendOtpMutation,
} from '@open-support/services';
import { useFormik, type FormikHelpers } from 'formik';
import type { PasswordLoginForm, SendOtpForm } from '@open-support/schemas/auth';

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (config: GoogleIdentityInitializeConfig) => void;
          renderButton: (element: HTMLElement, options: GoogleIdentityButtonOptions) => void;
        };
      };
    };
  }
}

interface GoogleIdentityInitializeConfig {
  client_id: string;
  callback: (response: { credential?: string }) => void;
}

interface GoogleIdentityButtonOptions {
  theme: 'outline' | 'filled_blue' | 'filled_black';
  size: 'large' | 'medium' | 'small';
  width?: string;
}

export const Route = createFileRoute('/login')({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === 'string' ? search.redirect : undefined,
  }),
  beforeLoad: async ({ search }) => {
    if (typeof window === 'undefined') {
      return;
    }

    const result = await getCurrentSession().catch(() => null);

    if (!result) {
      return;
    }

    throw redirect({
      href: result.user.mustChangePassword ? '/change-password' : (search.redirect ?? '/admin'),
    });
  },
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const googleButtonRef = useRef<HTMLDivElement | null>(null);
  const [googleStatus, setGoogleStatus] = useState<string | null>(null);
  const sendOtpMutation = useSendOtpMutation();
  const passwordLoginMutation = usePasswordLoginMutation();

  const handleOtpSubmit = useCallback(
    async (values: SendOtpForm, helpers: FormikHelpers<SendOtpForm>) => {
      helpers.setStatus(undefined);

      try {
        await sendOtpMutation.mutateAsync(values);
        await navigate({ to: '/verify', search: { email: values.email } });
      } catch {
        helpers.setStatus('Unable to send OTP');
      }
    },
    [navigate, sendOtpMutation],
  );

  const handlePasswordSubmit = useCallback(
    async (values: PasswordLoginForm, helpers: FormikHelpers<PasswordLoginForm>) => {
      helpers.setStatus(undefined);

      try {
        const result = await passwordLoginMutation.mutateAsync(values);
        await navigate({
          href: result.user.mustChangePassword ? '/change-password' : (search.redirect ?? '/admin'),
        });
      } catch {
        helpers.setStatus('Invalid email or password');
      }
    },
    [navigate, passwordLoginMutation, search.redirect],
  );

  const otpForm = useFormik<SendOtpForm>({
    initialValues: {
      email: '',
    },
    onSubmit: handleOtpSubmit,
  });
  const passwordForm = useFormik<PasswordLoginForm>({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: handlePasswordSubmit,
  });

  useEffect(() => {
    let cancelled = false;

    async function initializeGoogleLogin() {
      setGoogleStatus(null);
      const config = await getGoogleConfig().catch(() => null);

      if (!config) {
        setGoogleStatus('Unable to load Google login settings');
        return;
      }

      if (!config.enabled || !config.clientId) {
        setGoogleStatus('Google login is not configured');
        return;
      }

      await loadGoogleIdentityScript();

      if (cancelled || !googleButtonRef.current || !window.google?.accounts?.id) {
        return;
      }

      googleButtonRef.current.innerHTML = '';
      window.google.accounts.id.initialize({
        client_id: config.clientId,
        callback: async (credentialResponse) => {
          if (!credentialResponse.credential) {
            setGoogleStatus('Google did not return a login token');
            return;
          }

          const result = await googleLogin({ idToken: credentialResponse.credential }).catch(
            () => null,
          );

          if (!result) {
            setGoogleStatus('Google login failed');
            return;
          }

          await navigate({
            href: result.user.mustChangePassword
              ? '/change-password'
              : (search.redirect ?? '/admin'),
          });
        },
      });
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: 'outline',
        size: 'large',
        width: '100%',
      });
    }

    void initializeGoogleLogin();

    return () => {
      cancelled = true;
    };
  }, [navigate, search.redirect]);

  return (
    <Paper sx={{ maxWidth: 480, mx: 'auto', p: 3 }}>
      <Stack component="form" onSubmit={otpForm.handleSubmit} spacing={2}>
        <Typography variant="h1">Login</Typography>
        {otpForm.status ? <Alert severity="error">{otpForm.status}</Alert> : null}
        <TextField
          autoComplete="email"
          label="Email"
          name="email"
          onBlur={otpForm.handleBlur}
          onChange={otpForm.handleChange}
          type="email"
          value={otpForm.values.email}
        />
        <Button startIcon={<MailOutlineIcon />} type="submit" variant="contained">
          Send OTP
        </Button>
        <Box ref={googleButtonRef} sx={{ minHeight: 40 }} />
        {googleStatus ? (
          <Alert icon={<GoogleIcon />} severity="info">
            {googleStatus}
          </Alert>
        ) : null}
      </Stack>
      <Divider sx={{ my: 3 }} />
      <Stack component="form" onSubmit={passwordForm.handleSubmit} spacing={2}>
        <Typography variant="h2">Password login</Typography>
        {passwordForm.status ? <Alert severity="error">{passwordForm.status}</Alert> : null}
        <TextField
          autoComplete="email"
          label="Email"
          name="email"
          onBlur={passwordForm.handleBlur}
          onChange={passwordForm.handleChange}
          type="email"
          value={passwordForm.values.email}
        />
        <TextField
          autoComplete="current-password"
          label="Password"
          name="password"
          onBlur={passwordForm.handleBlur}
          onChange={passwordForm.handleChange}
          type="password"
          value={passwordForm.values.password}
        />
        <Button startIcon={<PasswordIcon />} type="submit" variant="outlined">
          Login with password
        </Button>
      </Stack>
    </Paper>
  );
}

function loadGoogleIdentityScript() {
  const scriptId = 'google-identity-services';
  const existingScript = document.getElementById(scriptId);

  if (existingScript) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.id = scriptId;
    script.async = true;
    script.defer = true;
    script.src = 'https://accounts.google.com/gsi/client';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google login'));
    document.head.appendChild(script);
  });
}
