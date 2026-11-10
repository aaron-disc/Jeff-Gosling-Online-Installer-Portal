const express = require("express");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const pool = require("../db/db");
const { JWT_SECRET, JWT_EXPIRES_IN } = require("../config/auth");
const { createSession } = require("../services/sessionStore");

const router = express.Router();

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
      { expiresIn: JWT_EXPIRES_IN },
    );

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

module.exports = router;
