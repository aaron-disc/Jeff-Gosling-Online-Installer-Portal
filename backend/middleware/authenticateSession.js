const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/auth");

function authenticateSessionToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authentication required." });
  }

  const token = authHeader.slice(7).trim();

  if (!token) {
    return res.status(401).json({ error: "Authentication required." });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET, { ignoreExpiration: true });

    if (payload.sid === undefined || payload.sid === null) {
      return res
        .status(400)
        .json({ error: "Session identifier missing from authentication token." });
    }

    req.session = {
      id: payload.sid,
      userId: payload.id,
      expiresAt: payload.exp,
    };

    return next();
  } catch {
    return res.status(401).json({ error: "Invalid authentication token." });
  }
}

module.exports = authenticateSessionToken;
