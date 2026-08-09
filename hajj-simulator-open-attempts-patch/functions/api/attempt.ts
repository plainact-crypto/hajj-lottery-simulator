interface Env {
  hajj_lottery_db: D1Database;
}

interface Payload {
  email?: string;
  marketingOptIn?: boolean;
  won?: boolean;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const body = await context.request.json<Payload>().catch(() => ({}));
  const email = String(body.email || '').trim().toLowerCase();

  if (!EMAIL_RE.test(email)) {
    return Response.json({ error: 'invalid_email' }, { status: 400 });
  }

  if (typeof body.won !== 'boolean') {
    return Response.json({ error: 'invalid_result' }, { status: 400 });
  }

  const won = body.won ? 1 : 0;
  const lost = body.won ? 0 : 1;

  await context.env.hajj_lottery_db.prepare(`
    INSERT INTO leads (
      email,
      attempt_count,
      win_count,
      loss_count,
      marketing_opt_in,
      created_at,
      updated_at
    )
    VALUES (?, 1, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    ON CONFLICT(email) DO UPDATE SET
      attempt_count = leads.attempt_count + 1,
      win_count = leads.win_count + excluded.win_count,
      loss_count = leads.loss_count + excluded.loss_count,
      marketing_opt_in = CASE
        WHEN excluded.marketing_opt_in = 1 THEN 1
        ELSE leads.marketing_opt_in
      END,
      updated_at = CURRENT_TIMESTAMP
  `).bind(email, won, lost, body.marketingOptIn ? 1 : 0).run();

  const current = await context.env.hajj_lottery_db.prepare(`
    SELECT attempt_count, win_count, loss_count
    FROM leads
    WHERE email = ?
  `).bind(email).first<{
    attempt_count: number;
    win_count: number;
    loss_count: number;
  }>();

  return Response.json({
    attempts: Number(current?.attempt_count || 0),
    wins: Number(current?.win_count || 0),
    losses: Number(current?.loss_count || 0),
    persistedRemotely: true,
  });
};
