import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/login')({
  component: LoginPage,
});

function LoginPage() {
  return (
    <section className="narrow-page">
      <h1>Email login</h1>
      <p>OTP and Google login forms will connect here once the auth API is implemented.</p>
      <form className="stack-form">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" placeholder="you@example.com" />
        <button type="button">Send OTP</button>
      </form>
    </section>
  );
}
