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

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

/* READ users to authenticate login */
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  /*   const email = "a@b.com";
  const password = "test"; */

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const query = `
      SELECT id, email, password_hash, is_admin
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

  /* email + password validation  - 400 response */

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

/* READ boot hoist vehicle data -- has to be a better way */
app.get("/api/local-csv", (req, res) => {
  const results = [];

  const filePath = path.join(process.env.CSV_PATH);
  // check if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `File not found at ${filePath}` });
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
