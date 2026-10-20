require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const csv = require("csv-parser");
const { toCamelCase } = require("./utils/camelCaseParser");

const pool = require("./db/db");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const authenticateToken = require("./middleware/authenticate");

const upload = multer({ dest: "uploads/" });

const app = express();
app.use(express.json());
app.use(cors());

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "2h";

if (!JWT_SECRET) {
  throw new Error(
    "JWT_SECRET is not set. Add it to your environment before starting the server.",
  );
}

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

app.post(
  "/api/upload-hoists",
  authenticateToken,
  upload.single("file"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "Please upload a CSV file." });
    }

    const normalizeKey = (str) => {
      if (!str) return "";
      return str
        .toString()
        .replace(/[`_\s-]/g, "") // backticks/underscores/spaces/hyphens
        .toLowerCase();
    };

    const getCSVVal = (rowObject, targetKey) => {
      const cleanTarget = normalizeKey(targetKey);
      const actualKey = Object.keys(rowObject).find(
        (k) => normalizeKey(k) === cleanTarget,
      );
      return actualKey ? rowObject[actualKey] : null;
    };

    const parseStr = (row, key) => {
      const val = getCSVVal(row, key);
      if (val === undefined || val === null || val.trim() === "") return null;
      return val.trim();
    };

    const parseNum = (row, key) => {
      const val = getCSVVal(row, key);
      if (val === undefined || val === null || val.trim() === "") return null;
      const parsed = parseInt(val, 10);
      return isNaN(parsed) ? null : parsed;
    };

    const filePath = req.file.path;
    const results = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => {
        results.push([
          parseStr(data, "manufacturer"),
          parseStr(data, "model"),
          parseStr(data, "hoist_vehicle_variant"),
          parseStr(data, "min_start_date"),
          parseStr(data, "max_end_date"),
          parseStr(data, "hoist_status"),
          parseNum(data, "measurement_e"),
          parseNum(data, "measurement_o"),
          parseNum(data, "max_vehicle_load"),
          parseStr(data, "engine_ice"),
          parseStr(data, "engine_full_ev"),
          parseStr(data, "engine_hev"),
          parseStr(data, "engine_mhev"),
          parseStr(data, "engine_phev"),
          parseStr(data, "hoist_side"),
          parseStr(data, "a_frame"),
          parseStr(data, "hinge_post_yoke"),
          parseNum(data, "up_down_actuator_stroke"),
          parseNum(data, "measurement_d"),
          parseNum(data, "measurement_i"),
          parseStr(data, "seat_notes"),
          parseStr(data, "split_seats"),
          parseNum(data, "measurement_k1"),
          parseNum(data, "measurement_n"),
          parseNum(data, "depth_with_seats_slid_forward"),
          parseNum(data, "2nd_row_seats_folded_to_floor"),
          parseNum(data, "measurement_k2"),
          parseNum(data, "3rd_row_seats_folded_lip_to_floor"),
          parseStr(data, "3rd_row_options"),
          parseNum(data, "boot_floor_to_boot_lip"),
          parseNum(data, "measurement_p"),
          parseNum(data, "measurement_q"),
          parseNum(data, "measurement_r"),
          parseNum(data, "height_end_arm_to_ground"),
          parseStr(data, "fitting_notes"),
          parseStr(data, "false_floor_notes"),
          parseStr(data, "hoist_fitting_pdf_filename"),
        ]);
      })
      .on("end", async () => {
        if (results.length === 0) {
          fs.unlinkSync(filePath);
          return res
            .status(400)
            .json({ error: "The uploaded CSV file is empty." });
        }

        const connection = await pool.getConnection(); // single connection
        try {
          await connection.beginTransaction();

          await connection.query("TRUNCATE TABLE boot_hoists");

          const sql = `
                    INSERT INTO boot_hoists (
                        manufacturer, model, hoist_vehicle_variant, min_start_date, max_end_date, 
                        hoist_status, measurement_e, measurement_o, max_vehicle_load, engine_ice, 
                        engine_full_ev, engine_hev, engine_mhev, engine_phev, hoist_side, 
                        a_frame, hinge_post_yoke, up_down_actuator_stroke, measurement_d, measurement_i, 
                        seat_notes, split_seats, measurement_k1, measurement_n, depth_with_seats_slid_forward, 
                        \`2nd_row_seats_folded_to_floor\`, measurement_k2, \`3rd_row_seats_folded_lip_to_floor\`, 
                        \`3rd_row_options\`, boot_floor_to_boot_lip, measurement_p, measurement_q, measurement_r, 
                        height_end_arm_to_ground, fitting_notes, false_floor_notes, hoist_fitting_pdf_filename
                    ) VALUES ?
                `;

          const [response] = await connection.query(sql, [results]);

          //commit changes only if both truncate and insert succeed
          await connection.commit();

          fs.unlinkSync(filePath);

          res.status(200).json({
            message: "Boot hoists data successfully imported.",
            insertedRows: response.affectedRows,
          });
        } catch (error) {
          console.error("Database Error:", error);
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
          res
            .status(500)
            .json({ error: "Failed to insert hoist data into the database." });
        }
      })
      .on("error", (error) => {
        console.error("CSV Parsing Error:", error);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        res.status(500).json({ error: "Failed to parse the CSV file." });
      });
  },
);

/* READ boot hoist list data */
app.get("/hoists-list", authenticateToken, async (req, res) => {
  try {
    const query =
      "SELECT boot_hoist_id, manufacturer, model, hoist_vehicle_variant, min_start_date, max_end_date, hoist_status, measurement_e, measurement_o, max_vehicle_load FROM boot_hoists";
    const [result] = await pool.query(query);

    if (!result[0]) {
      return res
        .status(500)
        .json({ error: "Internal server error, failed to fetch" });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Database error: ", error);
    res.status(500).json({ error: "Interal server error..." });
  }
});

/* READ individual boot hoist data */
app.get("/hoist/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const query = "SELECT * FROM boot_hoists WHERE boot_hoist_id = ?";
    const [result] = await pool.query(query, [id]);

    if (!result[0]) {
      return res
        .status(500)
        .json({ error: "Internal server error, failed to fetch" });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Database error: ", error);
    res.status(500).json({ error: "Interal server error..." });
  }
});

/* READ users */
app.get("/users", authenticateToken, async (req, res) => {
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

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        isAdmin: user.is_admin == true,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    );

    return res.status(200).json({
      message: "Login successful.",
      token,
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
app.post("/create-user", authenticateToken, async (req, res) => {
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
app.delete("/delete-user/:id", authenticateToken, async (req, res) => {
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
app.patch("/change-password", authenticateToken, async (req, res) => {
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
/* app.get("/api/test-register", authenticateToken, async (req, res) => {
  // const { email, password, is_admin = 0 } = req.body;

  const email = "a@b.com";
  const password = "test";
  const is_admin = 1;

  // create proper email + password reqs  -- express validator perchance?? 
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
}); */

/* READ installation guide pdf from the pdf folder by file name */
app.get("/api/pdf", authenticateToken, (req, res) => {
  const { pdfFileName } = req.query;

  if (typeof pdfFileName !== "string" || pdfFileName.trim() === "") {
    return res.status(400).json({ error: "pdfFileName is required." });
  }

  const pdfsDir = path.resolve(__dirname, "data", "pdfs");
  const filePath = path.resolve(pdfsDir, path.basename(pdfFileName.trim()));

  // guard against path traversal + only serve pdf files
  if (
    !filePath.startsWith(pdfsDir + path.sep) ||
    path.extname(filePath).toLowerCase() !== ".pdf"
  ) {
    return res.status(400).json({ error: "Invalid pdf file name." });
  }

  if (!fs.existsSync(filePath)) {
    return res
      .status(404)
      .json({ error: `PDF not found: ${path.basename(filePath)}` });
  }

  res.sendFile(filePath);
});

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`),
);
