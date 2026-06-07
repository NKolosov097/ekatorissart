export default function AdminLogin() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-bone p-6">
      <form
        action="/api/admin/login"
        method="POST"
        className="w-full max-w-sm border border-line p-8"
      >
        <div className="eyebrow mb-2">Studio</div>
        <h1 className="font-serif text-2xl mb-6">Sign in</h1>
        <label className="block text-xs uppercase tracking-widest text-muted mb-2">
          Password
        </label>
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          className="w-full border border-line bg-bone px-3 py-2 text-sm focus:outline-none focus:border-ink"
        />
        <button type="submit" className="btn-primary w-full mt-6">
          Enter studio
        </button>
        <p className="mt-4 text-xs text-muted">
          Set <code className="text-ink">ADMIN_PASSWORD</code> in .env to enable
          the studio panel.
        </p>
      </form>
    </section>
  );
}
