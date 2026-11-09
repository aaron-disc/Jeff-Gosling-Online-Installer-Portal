const fs = require("fs");
const multer = require("multer");
const path = require("path");

const UPLOADS_DIR = path.join(__dirname, "..", "uploads");

const ensureUploadsDir = (req, res, next) => {
  fs.mkdir(UPLOADS_DIR, { recursive: true }, (error) => {
    if (error) return next(error);
    next();
  });
};

const upload = multer({
  storage: multer.diskStorage({ destination: UPLOADS_DIR }),
});

module.exports = {
  UPLOADS_DIR,
  ensureUploadsDir,
  upload,
};
