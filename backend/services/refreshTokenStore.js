const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const pool = require("../db/db");
const {
  JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRES_IN,
} = require("../config/auth");
const { durationToSeconds } = require("./sessionStore");

const REFRESH_REUSE_GRACE_SECONDS = 30;

function refreshLifetimeSeconds() {
  return Math.max(durationToSeconds(JWT_REFRESH_EXPIRES_IN), 60);
}

async function issueRefreshToken(sessionId, userId) {
  const jti = crypto.randomUUID();
  const lifetimeSeconds = refreshLifetimeSeconds();

  await pool.execute(
    `INSERT INTO refresh_tokens (jti, session_id, user_id, expires_at)
     VALUES (?, ?, ?, TIMESTAMPADD(SECOND, ?, NOW()))`,
    [jti, sessionId, userId, lifetimeSeconds],
  );

  return jwt.sign(
    { id: userId, sid: sessionId, jti },
    JWT_REFRESH_SECRET,
    { expiresIn: lifetimeSeconds },
  );
}

async function findRefreshTokenRecord(
  rawToken,
  { ignoreExpiration = false } = {},
) {
  if (typeof rawToken !== "string" || rawToken === "") {
    return null;
  }

  let payload;
  try {
    payload = jwt.verify(rawToken, JWT_REFRESH_SECRET, { ignoreExpiration });
  } catch {
    return null;
  }

  if (!payload || typeof payload.jti !== "string") {
    return null;
  }

  const [rows] = await pool.execute(
    `SELECT jti, session_id, user_id, expires_at, revoked_at
       FROM refresh_tokens
      WHERE jti = ?`,
    [payload.jti],
  );

  const record = rows[0] || null;

  if (
    record &&
    !ignoreExpiration &&
    new Date(record.expires_at).getTime() <= Date.now()
  ) {
    return null;
  }

  return record;
}

async function revokeAllSessionRefreshTokens(sessionId) {
  await pool.execute(
    `UPDATE refresh_tokens
        SET revoked_at = NOW()
      WHERE session_id = ? AND revoked_at IS NULL`,
    [sessionId],
  );
}

async function revokeAllUserRefreshTokens(userId) {
  await pool.execute(
    `UPDATE refresh_tokens
        SET revoked_at = NOW()
      WHERE user_id = ? AND revoked_at IS NULL`,
    [userId],
  );
}

async function rotateRefreshToken(rawToken) {
  const record = await findRefreshTokenRecord(rawToken);

  if (!record) {
    return null;
  }

  if (record.revoked_at !== null) {
    const revokedMs = new Date(record.revoked_at).getTime();
    const withinGrace =
      Date.now() - revokedMs <= REFRESH_REUSE_GRACE_SECONDS * 1000;

    if (!withinGrace) {
      await revokeAllSessionRefreshTokens(record.session_id);
      return null;
    }
  }

  await pool.execute(
    `UPDATE refresh_tokens
        SET revoked_at = NOW()
      WHERE jti = ? AND revoked_at IS NULL`,
    [record.jti],
  );

  const refreshToken = await issueRefreshToken(
    record.session_id,
    record.user_id,
  );

  return {
    refreshToken,
    sessionId: record.session_id,
    userId: record.user_id,
  };
}

async function deleteExpiredRefreshTokens() {
  const [result] = await pool.execute(
    `DELETE FROM refresh_tokens
      WHERE expires_at < NOW() - INTERVAL 1 DAY`,
  );

  return result.affectedRows;
}

module.exports = {
  refreshLifetimeSeconds,
  issueRefreshToken,
  findRefreshTokenRecord,
  rotateRefreshToken,
  revokeAllSessionRefreshTokens,
  revokeAllUserRefreshTokens,
  deleteExpiredRefreshTokens,
};
