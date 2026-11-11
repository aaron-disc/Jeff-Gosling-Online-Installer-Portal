const express = require("express");
const pool = require("../db/db");
const authenticateToken = require("../middleware/authenticate");

const router = express.Router();

/* READ logs */
router.get("/logs", authenticateToken, async (req, res) => {
  try {
    const query = "SELECT * FROM event_logs ORDER BY created_at DESC";
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

/* READ session logs */
router.get("/sessions", authenticateToken, async (req, res) => {
  try {
    const query = "SELECT * FROM user_sessions ORDER BY user_sessions_id DESC";
    const [result] = await pool.query(query);

    if (!result[0]) {
      return res
        .status(500)
        .json({ error: "Internal server error, failed to fetch" });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Database error: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* CREATE log */
router.post("/create-log", authenticateToken, async (req, res) => {
  const { category, actor, action, target } = req.body;

  try {
    const query =
      "INSERT INTO event_logs (category, event_actor, event_action, event_target) VALUES (?, ?, ?, ?)";

    await pool.execute(query, [category, actor, action, target]);

    res.status(201).json({ message: "Log created successfully." });
  } catch (error) {
    console.error("Database error: ", error);
    res.status(500).json({ error: "Interal server error" });
  }
});

module.exports = router;
