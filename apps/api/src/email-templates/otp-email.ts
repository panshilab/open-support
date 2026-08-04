import React from 'react';
import { Text } from '@react-email/components';
import { BaseEmail, textStyle } from './base-email';

export interface OtpEmailProps {
  appName: string;
  otp: string;
  expiresInMinutes: number;
}

export function OtpEmail({ appName, expiresInMinutes, otp }: OtpEmailProps) {
  return React.createElement(
    BaseEmail,
    {
      preview: `${appName} login code: ${otp}`,
      title: `${appName} login code`,
    },
    React.createElement(Text, { style: textStyle }, `Use this code to sign in: ${otp}`),
    React.createElement(
      Text,
      { style: textStyle },
      `This code expires in ${expiresInMinutes} minutes.`,
    ),
  );
}
