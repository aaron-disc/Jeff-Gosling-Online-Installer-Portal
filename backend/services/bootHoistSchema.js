const pool = require("../db/db");
const {
  BOOT_HOIST_COLUMNS,
  REQUIRED_COLUMNS_FALLBACK,
  typeFromDatabase,
} = require("../utils/csvUploadValidation");

/* Cached so the schema is only read once per server run */
let bootHoistSchema = null;

/* Reads the boot_hoists table so the upload can tell the user which values
   cannot be empty. Falls back to the built in column list when the schema
   cannot be read. */
const loadBootHoistSchema = async () => {
  if (bootHoistSchema) return bootHoistSchema;

  const fallback = {
    required: REQUIRED_COLUMNS_FALLBACK,
    columns: BOOT_HOIST_COLUMNS,
  };

  try {
    const [rows] = await pool.query(
      `SELECT COLUMN_NAME, IS_NULLABLE, DATA_TYPE, EXTRA
         FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'boot_hoists'`,
      [process.env.DB_NAME],
    );

    if (!rows.length) {
      console.warn(
        "boot_hoists columns not found, using the built in column list.",
      );
      bootHoistSchema = fallback;
      return bootHoistSchema;
    }

    const dbTypes = new Map(
      rows.map((row) => [
        String(row.COLUMN_NAME).toLowerCase(),
        String(row.DATA_TYPE).toLowerCase(),
      ]),
    );

    /* a column that is not nullable cannot be left blank */
    const required = rows
      .filter(
        (row) =>
          row.IS_NULLABLE === "NO" &&
          !String(row.EXTRA || "").includes("auto_increment"),
      )
      .map((row) => String(row.COLUMN_NAME).toLowerCase());

    const columns = BOOT_HOIST_COLUMNS.map(({ column, type }) => ({
      column,
      type: typeFromDatabase(dbTypes.get(column)) || type,
    }));

    bootHoistSchema = {
      required: required.length ? required : fallback.required,
      columns,
    };

    return bootHoistSchema;
  } catch (error) {
    console.warn(
      "Could not read the boot_hoists schema, using the built in column list:",
      error.message,
    );
    bootHoistSchema = fallback;
    return bootHoistSchema;
  }
};

module.exports = { loadBootHoistSchema };
