import type { ReactNode } from 'react';
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router';
import '../styles.css';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Open Support',
      },
      {
        name: 'description',
        content: 'Customer support portal with tickets, knowledge base, and live chat.',
      },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Shell />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function Shell() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/" className="brand">
          Open Support
        </Link>
        <nav className="nav-links" aria-label="Main navigation">
          <Link to="/knowledgebase">Knowledge Base</Link>
          <Link to="/tickets">Tickets</Link>
          <Link to="/admin">Admin</Link>
          <Link to="/login" className="login-link">
            Login
          </Link>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
