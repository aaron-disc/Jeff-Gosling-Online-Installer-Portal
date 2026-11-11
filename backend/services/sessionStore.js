const pool = require("../db/db");
const { JWT_EXPIRES_IN } = require("../config/auth");

const SELECT_SESSION_SQL = `
  SELECT user_sessions_id, user_email, login_at, logout_at, duration_seconds, end_reason
  FROM user_sessions
  WHERE user_sessions_id = ?
`;

function durationToSeconds(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.max(0, Math.floor(value));
  }

  const match = String(value ?? "")
    .trim()
    .match(/^(\d+(?:\.\d+)?)\s*(s|m|h|d|w|y)?$/i);

  if (!match) return 7200;

  const multipliers = {
    s: 1,
    m: 60,
    h: 3600,
    d: 86400,
    w: 604800,
    y: 31536000,
  };
  const unit = (match[2] || "s").toLowerCase();

  return Math.max(0, Math.floor(Number(match[1]) * multipliers[unit]));
}

function toSessionObject(row) {
  if (!row) return null;

  return {
    userSessionsId: row.user_sessions_id,
    userEmail: row.user_email,
    loginAt: row.login_at,
    logoutAt: row.logout_at,
    durationSeconds: row.duration_seconds,
    endReason: row.end_reason,
  };
}

async function createSession(userEmail) {
  const expirySeconds = durationToSeconds(JWT_EXPIRES_IN);

  const [result] = await pool.execute(
    `INSERT INTO user_sessions (user_email, login_at, expires_at)
     VALUES (?, NOW(), TIMESTAMPADD(SECOND, ?, NOW()))`,
    [userEmail, expirySeconds],
  );

  const [rows] = await pool.execute(SELECT_SESSION_SQL, [result.insertId]);

  return toSessionObject(rows[0]);
}

async function endSession(userSessionsId, reason, expiresAtUnix) {
  if (reason === "timeout" && Number.isFinite(expiresAtUnix)) {
    await pool.execute(
      `UPDATE user_sessions
          SET logout_at = FROM_UNIXTIME(?),
              duration_seconds = GREATEST(
                TIMESTAMPDIFF(SECOND, login_at, FROM_UNIXTIME(?)),
                0
              ),
              end_reason = ?
        WHERE user_sessions_id = ? AND logout_at IS NULL`,
      [expiresAtUnix, expiresAtUnix, reason, userSessionsId],
    );
  } else {
    await pool.execute(
      `UPDATE user_sessions
          SET logout_at = NOW(),
              duration_seconds = GREATEST(
                TIMESTAMPDIFF(SECOND, login_at, NOW()),
                0
              ),
              end_reason = ?
        WHERE user_sessions_id = ? AND logout_at IS NULL`,
      [reason, userSessionsId],
    );
  }

  const [rows] = await pool.execute(SELECT_SESSION_SQL, [userSessionsId]);

  return toSessionObject(rows[0]);
}

async function closeExpiredSessions() {
  const [result] = await pool.execute(
    `UPDATE user_sessions
        SET logout_at = expires_at,
            duration_seconds = GREATEST(
              TIMESTAMPDIFF(SECOND, login_at, expires_at),
              0
            ),
            end_reason = 'timeout'
      WHERE logout_at IS NULL
        AND expires_at <= NOW()`,
  );

  return result.affectedRows;
}

module.exports = {
  createSession,
  endSession,
  closeExpiredSessions,
  durationToSeconds,
  toSessionObject,
};
