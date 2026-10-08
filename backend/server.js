require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const { toCamelCase } = require("./utils/camelCaseParser");

const pool = require("./db/db");
const argon2 = require("argon2");

const app = express();
app.use(express.json());
app.use(cors());

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

/* READ users */
app.get("/users", async (req, res) => {
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
    res.status(500).json({ error: "Interal server error..." });
  }
});

/* READ user to authenticate login */
app.post("/login", async (req, res) => {
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

    return res.status(200).json({
      message: "Login successful.",
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

/* CREATE new user */
app.post("/create-user", async (req, res) => {
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
    const passwordHash = await argon2.hash(password, {
      type: argon2.argon2id,
    });
    const query =
      "INSERT INTO users (email, password_hash, is_admin) VALUES (?, ?, ?)";

    await pool.execute(query, [email, passwordHash, isAdmin]);
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Database error: ", error);
    res.status(500).json({ error: "Interal server error.." });
  }
});

/* DELETE user by id */
app.delete("/delete-user/:id", async (req, res) => {
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
app.patch("/change-password", async (req, res) => {
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
      return res.status(401).json({ error: "Current password is incorrect." });
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

/* ---------------------------- */

/* CREATE test user -- dont use */
app.get("/api/test-register", async (req, res) => {
  /* const { email, password, is_admin = 0 } = req.body; */

  const email = "a@b.com";
  const password = "test";
  const is_admin = 1;

  /* create proper email + password reqs  -- express validator perchance?? */
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const passwordHash = await argon2.hash(password, {
      type: argon2.argon2id,
    });
    const query =
      "INSERT INTO users (email, password_hash, is_admin) VALUES (?, ?, ?)";
    const [result] = await pool.execute(query, [email, passwordHash, is_admin]);

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Database error: ", error);
    res.status(500).json({ error: "Interal server error.." });
  }
});

/* READ boot hoist vehicle data from local csv*/
app.get("/api/local-csv", (req, res) => {
  const results = [];

  const filePath = path.join(__dirname, "qryDISCHoistExport.csv");

  // check if file exists
  if (!fs.existsSync(filePath)) {
    return res
      .status(404)
      .json({
        error: `File path not found: attempted to find file at ${filePath}`,
      });
  }

  // stream the file and pipe it into the CSV parser
  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", () => {
      const formattedResults = results.map((row) => {
        const newRow = {};
        Object.keys(row).forEach((key) => {
          newRow[toCamelCase(key)] = row[key];
        });
        return newRow;
      });

      res.json(formattedResults);
    })
    .on("error", (error) => {
      res
        .status(500)
        .json({ error: "Failed to parse local CSV", details: error.message });
    });
});

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`),
);
