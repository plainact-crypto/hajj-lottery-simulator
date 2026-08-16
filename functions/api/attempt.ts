interface Env {
  /** Preferred binding name used by the current deployment. */
  hajj_lottery_db?: D1Database;
  /** Backward-compatible binding name documented in earlier setup notes. */
  DB?: D1Database;
}

interface Payload {
  email?: string;
  marketingOptIn?: boolean;
  won?: boolean;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getDb(env: Env): D1Database | null {
  return env.hajj_lottery_db || env.DB || null;
}

function databaseUnavailable() {
  return Response.json({ error: 'database_unavailable' }, { status: 503 });
}

async function readStats(db: D1Database, email: string) {
  const current = await db.prepare(`
    SELECT attempt_count, win_count, loss_count
    FROM leads
    WHERE email = ?
  `).bind(email).first<{
    attempt_count: number;
    win_count: number;
    loss_count: number;
  }>();

  return {
    attempts: Number(current?.attempt_count || 0),
    wins: Number(current?.win_count || 0),
    losses: Number(current?.loss_count || 0),
  };
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const email = String(url.searchParams.get('email') || '').trim().toLowerCase();

  if (!EMAIL_RE.test(email)) {
    return Response.json({ error: 'invalid_email' }, { status: 400 });
  }

  const db = getDb(context.env);
  if (!db) return databaseUnavailable();

  return Response.json(await readStats(db, email));
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const body = await context.request.json<Payload>().catch(() => ({}));
  const email = String(body.email || '').trim().toLowerCase();

  if (!EMAIL_RE.test(email)) {
    return Response.json({ error: 'invalid_email' }, { status: 400 });
  }

  if (typeof body.won !== 'boolean') {
    return Response.json({ error: 'invalid_result' }, { status: 400 });
  }

  const db = getDb(context.env);
  if (!db) return databaseUnavailable();

  const won = body.won ? 1 : 0;
  const lost = body.won ? 0 : 1;

  await db.prepare(`
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

  return Response.json({
    ...(await readStats(db, email)),
    persistedRemotely: true,
  });
};
