import React from 'react';
import { Button, Text } from '@react-email/components';
import { BaseEmail, textStyle } from './base-email';

export interface InvitationEmailProps {
  appName: string;
  invitationUrl: string;
  role: string;
  expiresAt: Date;
}

export function InvitationEmail({ appName, expiresAt, invitationUrl, role }: InvitationEmailProps) {
  return React.createElement(
    BaseEmail,
    {
      preview: `You have been invited to ${appName}`,
      title: `Join ${appName}`,
    },
    React.createElement(
      Text,
      { style: textStyle },
      `You have been invited as ${role.replace('_', ' ')}.`,
    ),
    React.createElement(
      Button,
      {
        href: invitationUrl,
        style: buttonStyle,
      },
      'Accept invitation',
    ),
    React.createElement(
      Text,
      { style: textStyle },
      `This invitation expires on ${expiresAt.toISOString()}.`,
    ),
  );
}

const buttonStyle = {
  backgroundColor: '#2563eb',
  borderRadius: '6px',
  color: '#ffffff',
  display: 'inline-block',
  fontFamily: 'Arial, sans-serif',
  fontSize: '15px',
  fontWeight: 700,
  padding: '12px 18px',
  textDecoration: 'none',
};
