import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/knowledgebase')({
  component: KnowledgeBasePage,
});

function KnowledgeBasePage() {
  return (
    <section className="narrow-page">
      <h1>Knowledge Base</h1>
      <p>Articles, FAQs, semantic search, and category navigation will live here.</p>
    </section>
  );
}
