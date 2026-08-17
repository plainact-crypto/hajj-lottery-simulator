interface Env {
  hajj_lottery_db?: D1Database;
  DB?: D1Database;
}

interface EventPayload {
  eventName?: string;
  sessionId?: string;
  pagePath?: string;
  levelId?: string;
  marketingOptIn?: boolean;
  persistedRemotely?: boolean;
}

const ALLOWED_EVENTS = new Set([
  'simulator_started',
  'attempt_persisted',
  'attempt_local_fallback',
  'result_viewed',
  'retry_clicked',
]);

function getDb(env: Env): D1Database | null {
  return env.hajj_lottery_db || env.DB || null;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const db = getDb(context.env);
  if (!db) {
    return Response.json(
      { ok: false, databaseConfigured: false, funnelTableReady: false },
      { status: 503 },
    );
  }

  try {
    await db.prepare('SELECT 1 FROM funnel_events LIMIT 1').first();
    return Response.json({ ok: true, databaseConfigured: true, funnelTableReady: true });
  } catch {
    return Response.json(
      { ok: false, databaseConfigured: true, funnelTableReady: false },
      { status: 503 },
    );
  }
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const body = await context.request.json<EventPayload>().catch(() => ({}));
  const eventName = String(body.eventName || '');
  const sessionId = String(body.sessionId || '').slice(0, 80);
  const pagePath = String(body.pagePath || '/').slice(0, 200);
  const levelId = body.levelId ? String(body.levelId).slice(0, 80) : null;

  if (!ALLOWED_EVENTS.has(eventName) || !sessionId) {
    return Response.json({ error: 'invalid_event' }, { status: 400 });
  }

  const db = getDb(context.env);
  if (!db) return Response.json({ error: 'database_unavailable' }, { status: 503 });

  await db.prepare(`
    INSERT INTO funnel_events (
      event_name, session_id, page_path, level_id,
      marketing_opt_in, persisted_remotely, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
  `).bind(
    eventName,
    sessionId,
    pagePath,
    levelId,
    typeof body.marketingOptIn === 'boolean' ? (body.marketingOptIn ? 1 : 0) : null,
    typeof body.persistedRemotely === 'boolean' ? (body.persistedRemotely ? 1 : 0) : null,
  ).run();

  return Response.json({ ok: true });
};
