import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/tickets')({
  component: TicketsPage,
});

function TicketsPage() {
  return (
    <section className="narrow-page">
      <h1>Tickets</h1>
      <p>Customers will create and track support tickets here.</p>
    </section>
  );
}
