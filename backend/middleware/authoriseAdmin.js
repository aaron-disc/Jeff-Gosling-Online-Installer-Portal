function authoriseAdmin(req, res, next) {
  if (!req.user || req.user.isAdmin !== true) {
    return res.status(403).json({ error: "Administrator access required." });
  }

  return next();
}

module.exports = authoriseAdmin;
