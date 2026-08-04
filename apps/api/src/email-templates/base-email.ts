import React from 'react';
import { Body, Container, Head, Heading, Html, Preview, Section } from '@react-email/components';

export interface BaseEmailProps {
  preview: string;
  title: string;
  children?: React.ReactNode;
}

export function BaseEmail({ children, preview, title }: BaseEmailProps) {
  return React.createElement(
    Html,
    null,
    React.createElement(Head),
    React.createElement(Preview, null, preview),
    React.createElement(
      Body,
      { style: bodyStyle },
      React.createElement(
        Container,
        { style: containerStyle },
        React.createElement(Heading, { style: headingStyle }, title),
        React.createElement(Section, null, children),
      ),
    ),
  );
}

export const textStyle = {
  color: '#1f2937',
  fontFamily: 'Arial, sans-serif',
  fontSize: '16px',
  lineHeight: '24px',
};

const bodyStyle = {
  backgroundColor: '#f6f8fb',
  margin: 0,
  padding: '24px',
};

const containerStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  margin: '0 auto',
  maxWidth: '560px',
  padding: '28px',
};

const headingStyle = {
  color: '#111827',
  fontFamily: 'Arial, sans-serif',
  fontSize: '24px',
  lineHeight: '32px',
  margin: '0 0 20px',
};
