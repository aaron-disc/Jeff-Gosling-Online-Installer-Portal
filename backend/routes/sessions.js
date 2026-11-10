const express = require("express");
const authenticateSessionToken = require("../middleware/authenticateSession");
const { endSession } = require("../services/sessionStore");

const router = express.Router();

const ALLOWED_END_REASONS = new Set(["logout", "timeout", "closed"]);

router.post("/session/end", authenticateSessionToken, async (req, res) => {
  const requestedReason = req.body?.reason;
  const reason =
    typeof requestedReason === "string" &&
    ALLOWED_END_REASONS.has(requestedReason)
      ? requestedReason
      : "unknown";

  try {
    const session = await endSession(
      req.session.id,
      reason,
      req.session.expiresAt,
    );

    if (!session) {
      return res.status(404).json({ error: "Session not found." });
    }

    return res.status(200).json(session);
  } catch (error) {
    console.error("Database error: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
