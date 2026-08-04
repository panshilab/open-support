import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  return (
    <section className="page-grid">
      <div className="intro-panel">
        <p className="eyebrow">Support portal foundation</p>
        <h1>Help customers find answers and open the right ticket.</h1>
        <p>
          This TanStack Start shell is wired into the Nx workspace and shared Zod schema package.
          The next step is connecting real API data from the NestJS backend.
        </p>
      </div>
      <div className="status-panel">
        <h2>Phase 1 Frontend</h2>
        <ul>
          <li>TanStack Start configured with Vite</li>
          <li>Shared schemas available from @open-support/schemas</li>
          <li>Initial customer, knowledge base, and admin routes</li>
        </ul>
      </div>
    </section>
  );
}
