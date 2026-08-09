interface Env {
  DB: D1Database;
}

interface Payload {
  email?: string;
  marketingOptIn?: boolean;
}

const MAX_ATTEMPTS = 3;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const body = await context.request.json<Payload>().catch(() => ({}));
  const email = String(body.email || '').trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return Response.json({ error: 'invalid_email' }, { status: 400 });
  }

  const write = await context.env.DB.prepare(`
    INSERT INTO leads (email, attempt_count, marketing_opt_in, created_at, updated_at)
    VALUES (?, 1, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    ON CONFLICT(email) DO UPDATE SET
      attempt_count = leads.attempt_count + 1,
      marketing_opt_in = CASE WHEN excluded.marketing_opt_in = 1 THEN 1 ELSE leads.marketing_opt_in END,
      updated_at = CURRENT_TIMESTAMP
    WHERE leads.attempt_count < ?
  `).bind(email, body.marketingOptIn ? 1 : 0, MAX_ATTEMPTS).run();

  const current = await context.env.DB.prepare('SELECT attempt_count FROM leads WHERE email = ?').bind(email).first<{ attempt_count: number }>();
  const used = Number(current?.attempt_count || 0);
  if (!write.meta.changes) {
    return Response.json({ allowed: false, used, remaining: 0 }, { status: 429 });
  }

  return Response.json({ allowed: true, used, remaining: Math.max(0, MAX_ATTEMPTS - used) });
};
