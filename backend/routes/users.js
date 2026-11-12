const express = require("express");
const argon2 = require("argon2");
const pool = require("../db/db");
const authenticateToken = require("../middleware/authenticate");
const { revokeAllUserRefreshTokens } = require("../services/refreshTokenStore");
const {
  MIN_PASSWORD_LENGTH,
  MAX_PASSWORD_LENGTH,
  EMAIL_PATTERN,
} = require("../config/auth");

const router = express.Router();

/* READ users */
router.get("/users", authenticateToken, async (req, res) => {
  try {
    const query = "SELECT email, is_admin, created_at, id FROM users";
    const [result] = await pool.query(query);

    if (!result[0]) {
      return res
        .status(500)
        .json({ error: "Interal server error, failed to fetch" });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Database error: ", error);
    res.status(500).json({ error: "Interal server error" });
  }
});

/* CREATE new user */
router.post("/create-user", authenticateToken, async (req, res) => {
  const { email, password, isAdmin } = req.body;

  /* email + password validation - 400 response */
  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    email === "" ||
    password === ""
  ) {
    return res.status(400).json({
      error: "Email and password are required.",
    });
  }

  if (!EMAIL_PATTERN.test(email.trim())) {
    return res.status(400).json({
      error: "Email must be a valid address.",
    });
  }

  if (password.length > MAX_PASSWORD_LENGTH) {
    return res.status(400).json({
      error: `Password must be at most ${MAX_PASSWORD_LENGTH} characters.`,
    });
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return res.status(400).json({
      error: `Password must at least ${MIN_PASSWORD_LENGTH} characters.`,
    });
  }

  try {
    const emailExistsQuery =
      "SELECT COUNT(*) as count FROM users WHERE email = ?";
    const [rows] = await pool.execute(emailExistsQuery, [email]);

    if (rows[0].count > 0) {
      return res.status(400).json({
        error: "Email already in use.",
      });
    }

    const passwordHash = await argon2.hash(password, {
      type: argon2.argon2id,
    });
    const createUserQuery =
      "INSERT INTO users (email, password_hash, is_admin) VALUES (?, ?, ?)";

    await pool.execute(createUserQuery, [email, passwordHash, isAdmin]);
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Database error: ", error);
    res.status(500).json({ error: "Interal server error.." });
  }
});

/* DELETE user by id */
router.delete("/delete-user/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const query = "DELETE FROM users WHERE id = ?";

    const [result] = await pool.execute(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(500).json({
        success: false,
        message: "Failed to find user",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    console.error("Database Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error occurred.",
    });
  }
});

/* UPDATE user passowrd */
router.patch("/change-password", authenticateToken, async (req, res) => {
  const { currentPassword, newPassword, confirmPassword, id } = req.body ?? {};

  /* type + exists validation -- 400 response */
  if (
    typeof currentPassword !== "string" ||
    typeof newPassword !== "string" ||
    typeof confirmPassword !== "string" ||
    currentPassword === "" ||
    newPassword === "" ||
    confirmPassword === ""
  ) {
    return res.status(400).json({
      error:
        "Current password, new password and confirmation password are all required.",
    });
  }

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "A valid user id is required." });
  }

  /* password strength validation */
  if (newPassword.length < MIN_PASSWORD_LENGTH) {
    return res.status(400).json({
      error: `New password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
    });
  }

  if (newPassword.length > MAX_PASSWORD_LENGTH) {
    return res.status(400).json({
      error: `New password must be at most ${MAX_PASSWORD_LENGTH} characters.`,
    });
  }

  if (currentPassword.length > MAX_PASSWORD_LENGTH) {
    return res.status(400).json({
      error: "Current password is too long.",
    });
  }

  if (newPassword !== confirmPassword) {
    return res
      .status(400)
      .json({ error: "New and confirmation passwords do not match." });
  }

  try {
    const selectQuery = "SELECT password_hash FROM users WHERE id = ?";
    const updateQuery = "UPDATE users SET password_hash = ? WHERE id = ?";

    const [selectRows] = await pool.execute(selectQuery, [id]);
    const selectPassword = selectRows[0];

    if (!selectPassword) {
      return res.status(404).json({ error: "Failed to get user information." });
    }

    const isPasswordValid = await argon2.verify(
      selectPassword.password_hash,
      currentPassword,
    );

    if (!isPasswordValid) {
      return res.status(400).json({ error: "Current password is incorrect." });
    }

    const isSamePassword = await argon2.verify(
      selectPassword.password_hash,
      newPassword,
    );

    if (isSamePassword) {
      return res.status(400).json({
        error: "New password cannot be the same as the current password.",
      });
    }

    const passwordHash = await argon2.hash(newPassword, {
      type: argon2.argon2id,
    });

    const [result] = await pool.execute(updateQuery, [passwordHash, id]);

    if (result.affectedRows === 0) {
      return res.status(500).json({
        success: false,
        error: "Failed to update password.",
      });
    }

    try {
      await revokeAllUserRefreshTokens(id);
    } catch (error) {
      console.warn(
        "Unable to revoke refresh tokens after password change:",
        error.message,
      );
    }

    return res.status(200).json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    console.error("Error changing password:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error occurred.",
    });
  }
});

module.exports = router;
