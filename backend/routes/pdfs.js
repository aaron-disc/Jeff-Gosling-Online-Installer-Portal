const express = require("express");
const fs = require("fs");
const path = require("path");
const authenticateToken = require("../middleware/authenticate");

const router = express.Router();

/* READ installation guide pdf from the pdf folder by file name */
router.get("/api/pdf", authenticateToken, (req, res) => {
  const { pdfFileName } = req.query;

  if (typeof pdfFileName !== "string" || pdfFileName.trim() === "") {
    return res.status(400).json({ error: "pdfFileName is required." });
  }

  const pdfsDir = path.resolve(__dirname, "..", "data", "pdfs");
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

module.exports = router;
