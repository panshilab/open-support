import { createFileRoute } from '@tanstack/react-router';
import type { UserRole } from '@open-support/schemas/user';

export const Route = createFileRoute('/admin')({
  component: AdminPage,
});

function AdminPage() {
  const allowedRoles: UserRole[] = ['admin', 'support_agent'];

  return (
    <section className="narrow-page">
      <h1>Admin</h1>
      <p>Admin and support agent tools will be protected by local roles.</p>
      <p className="muted">Allowed roles: {allowedRoles.join(', ')}</p>
    </section>
  );
}
