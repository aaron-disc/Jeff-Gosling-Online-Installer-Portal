const express = require("express");
const fs = require("fs");
const csv = require("csv-parser");
const pool = require("../db/db");
const authenticateToken = require("../middleware/authenticate");
const { ensureUploadsDir, upload } = require("../middleware/upload");
const { loadBootHoistSchema } = require("../services/bootHoistSchema");
const {
  BOOT_HOIST_COLUMNS,
  MAX_REPORTED_ISSUES,
  convertValue,
  describeDatabaseError,
  getCSVVal,
  isBlankRow,
  validateHeaders,
  validateRow,
} = require("../utils/csvUploadValidation");

const router = express.Router();

router.post(
  "/upload-hoists",
  authenticateToken,
  ensureUploadsDir,
  upload.single("file"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "Please upload a CSV file." });
    }

    const filePath = req.file.path;
    const results = [];
    const issues = [];
    let headerIssues = [];
    let totalIssues = 0;
    let lineNumber = 1; /* the header is line 1 */

    const schema = await loadBootHoistSchema();

    const source = fs.createReadStream(filePath);
    const parser = csv();

    /* release the read handle so the file is not locked on windows */
    const closeSource = () =>
      new Promise((resolve) => {
        if (source.closed) {
          resolve();
          return;
        }
        source.once("close", resolve);
        source.destroy();
      });

    /* multer stages the upload on disk -- always remove it once handled */
    const removeTempFile = () =>
      new Promise((resolve) => {
        fs.unlink(filePath, (error) => {
          if (error && error.code !== "ENOENT") {
            console.error("Failed to remove uploaded file:", error);
          }
          resolve();
        });
      });

    const cleanup = async () => {
      await closeSource();
      await removeTempFile();
    };

    source
      .pipe(parser)
      .on("headers", (headers) => {
        headerIssues = validateHeaders(headers, schema.required);
      })
      .on("data", (data) => {
        lineNumber += 1;

        if (isBlankRow(data)) return;

        results.push(data);

        const rowIssues = validateRow(data, lineNumber, schema);
        totalIssues += rowIssues.length;

        if (issues.length < MAX_REPORTED_ISSUES) {
          issues.push(
            ...rowIssues.slice(0, MAX_REPORTED_ISSUES - issues.length),
          );
        }
      })
      .on("end", async () => {
        if (results.length === 0) {
          await cleanup();
          return res
            .status(400)
            .json({ error: "The uploaded CSV file is empty." });
        }

        if (headerIssues.length > 0) {
          await cleanup();
          return res.status(400).json({
            error:
              "The CSV could not be uploaded because it does not have the expected columns.",
            errors: headerIssues,
            totalErrors: headerIssues.length,
          });
        }

        if (totalIssues > 0) {
          await cleanup();
          return res.status(400).json({
            error:
              "The CSV could not be uploaded because some values are not valid.",
            errors: issues.slice(0, MAX_REPORTED_ISSUES),
            totalErrors: totalIssues,
          });
        }

        let connection;
        try {
          connection = await pool.getConnection(); // single connection
          await connection.beginTransaction();

          await connection.query("DELETE FROM boot_hoists");

          const columnNames = BOOT_HOIST_COLUMNS.map(({ column }) =>
            /^\d/.test(column) ? `\`${column}\`` : column,
          ).join(", ");

          const sql = `
                    INSERT INTO boot_hoists (
                        ${columnNames}
                    ) VALUES ?
                `;

          const values = results.map((row) =>
            BOOT_HOIST_COLUMNS.map(({ column, type }) =>
              convertValue(getCSVVal(row, column), type),
            ),
          );

          const [response] = await connection.query(sql, [values]);

          //commit changes only if both truncate and insert succeed
          await connection.commit();

          await cleanup();

          res.status(200).json({
            message: "Boot hoists data successfully imported.",
            insertedRows: response.affectedRows,
          });
        } catch (error) {
          console.error("Database Error:", error);

          if (connection) {
            try {
              await connection.rollback();
            } catch (rollbackError) {
              console.error("Rollback Error:", rollbackError);
            }
          }

          await cleanup();

          const described = describeDatabaseError(error);

          res.status(described ? described.status : 500).json({
            error: described
              ? described.error
              : "Failed to insert hoist data into the database. Please try again.",
          });
        } finally {
          if (connection) connection.release();
        }
      })
      .on("error", async (error) => {
        console.error("CSV Parsing Error:", error);
        await cleanup();
        if (!res.headersSent) {
          res.status(500).json({ error: "Failed to parse the CSV file." });
        }
      });

    source.on("error", async (error) => {
      console.error("CSV Read Error:", error);
      await cleanup();
      if (!res.headersSent) {
        res.status(500).json({ error: "Failed to parse the CSV file." });
      }
    });
  },
);

/* READ boot hoist list data */
router.get("/hoists-list", authenticateToken, async (req, res) => {
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
router.get("/hoist/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const query = "SELECT * FROM boot_hoists WHERE boot_hoist_id = ?";
    const [result] = await pool.query(query, [id]);

    if (!result[0]) {
      return res.status(500).json({ error: "Vehicle does not exist." });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Database error: ", error);
    res.status(500).json({ error: "Interal server error" });
  }
});

module.exports = router;
