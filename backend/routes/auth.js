const express = require("express");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const pool = require("../db/db");
const { JWT_SECRET, JWT_ACCESS_EXPIRES_IN } = require("../config/auth");
const { createSession, endSession } = require("../services/sessionStore");
const {
  issueRefreshToken,
  rotateRefreshToken,
  findRefreshTokenRecord,
  revokeAllSessionRefreshTokens,
  refreshLifetimeSeconds,
} = require("../services/refreshTokenStore");

const router = express.Router();

const REFRESH_COOKIE_NAME = "jgRefreshToken";

const REFRESH_COOKIE_BASE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.COOKIE_SECURE === "true",
  path: "/",
};

function setRefreshCookie(res, token) {
  res.cookie(REFRESH_COOKIE_NAME, token, {
    ...REFRESH_COOKIE_BASE_OPTIONS,
    maxAge: refreshLifetimeSeconds() * 1000,
  });
}

function clearRefreshCookie(res) {
  res.clearCookie(REFRESH_COOKIE_NAME, REFRESH_COOKIE_BASE_OPTIONS);
}

/* READ user to authenticate login */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const query = `
      SELECT id, email, password_hash, is_admin, created_at
      FROM users
      WHERE email = ?
    `;

    const [rows] = await pool.execute(query, [email]);
    const user = rows[0];

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const isPasswordValid = await argon2.verify(user.password_hash, password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    let session = null;

    try {
      session = await createSession(user.email);
    } catch (error) {
      console.warn("Unable to create session record:", error.message);
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        isAdmin: user.is_admin == true,
        ...(session ? { sid: session.userSessionsId } : {}),
      },
      JWT_SECRET,
      { expiresIn: JWT_ACCESS_EXPIRES_IN },
    );

    if (session) {
      try {
        const refreshToken = await issueRefreshToken(
          session.userSessionsId,
          user.id,
        );
        setRefreshCookie(res, refreshToken);
      } catch (error) {
        console.warn("Unable to issue refresh token:", error.message);
      }
    }

    return res.status(200).json({
      message: "Login successful.",
      token,
      session,
      user: {
        email: user.email,
        isAdmin: user.is_admin == true,
        createdAt: user.created_at,
        id: user.id,
      },
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

/* Exchange the refresh token cookie for a new access token */
router.post("/refresh", async (req, res) => {
  const rawToken = req.cookies ? req.cookies[REFRESH_COOKIE_NAME] : undefined;

  let rotated = null;

  try {
    rotated = await rotateRefreshToken(rawToken);
  } catch (error) {
    console.error("Error rotating refresh token:", error);
    return res.status(500).json({ error: "Internal server error." });
  }

  if (!rotated) {
    clearRefreshCookie(res);
    return res
      .status(401)
      .json({ error: "Session expired. Please sign in again." });
  }

  try {
    const [rows] = await pool.execute(
      "SELECT id, email, is_admin, created_at FROM users WHERE id = ?",
      [rotated.userId],
    );
    const user = rows[0];

    if (!user) {
      await revokeAllSessionRefreshTokens(rotated.sessionId);
      clearRefreshCookie(res);
      return res
        .status(401)
        .json({ error: "Session expired. Please sign in again." });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        isAdmin: user.is_admin == true,
        sid: rotated.sessionId,
      },
      JWT_SECRET,
      { expiresIn: JWT_ACCESS_EXPIRES_IN },
    );

    setRefreshCookie(res, rotated.refreshToken);

    return res.status(200).json({
      token,
      user: {
        email: user.email,
        isAdmin: user.is_admin == true,
        createdAt: user.created_at,
        id: user.id,
      },
    });
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

/* Revoke the refresh token, close the session record and clear the cookie */
router.post("/logout", async (req, res) => {
  const rawToken = req.cookies ? req.cookies[REFRESH_COOKIE_NAME] : undefined;

  if (typeof rawToken === "string" && rawToken !== "") {
    try {
      const record = await findRefreshTokenRecord(rawToken, {
        ignoreExpiration: true,
      });

      if (record) {
        await revokeAllSessionRefreshTokens(record.session_id);
        await endSession(record.session_id, "logout");
      }
    } catch (error) {
      console.warn("Unable to revoke refresh token on logout:", error.message);
    }
  }

  clearRefreshCookie(res);
  return res.status(200).json({ message: "Signed out." });
});

module.exports = router;
