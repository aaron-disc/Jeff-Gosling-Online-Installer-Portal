const MAX_REPORTED_ISSUES = 20;

const BOOT_HOIST_COLUMNS = [
  { column: "manufacturer", type: "text" },
  { column: "model", type: "text" },
  { column: "hoist_vehicle_variant", type: "text" },
  { column: "min_start_date", type: "text" },
  { column: "max_end_date", type: "text" },
  { column: "hoist_status", type: "text" },
  { column: "measurement_e", type: "number" },
  { column: "measurement_o", type: "number" },
  { column: "max_vehicle_load", type: "text" },
  { column: "engine_ice", type: "text" },
  { column: "engine_full_ev", type: "text" },
  { column: "engine_hev", type: "text" },
  { column: "engine_mhev", type: "text" },
  { column: "engine_phev", type: "text" },
  { column: "hoist_side", type: "text" },
  { column: "a_frame", type: "text" },
  { column: "hinge_post_yoke", type: "text" },
  { column: "up_down_actuator_stroke", type: "number" },
  { column: "measurement_d", type: "number" },
  { column: "measurement_i", type: "number" },
  { column: "seat_notes", type: "text" },
  { column: "split_seats", type: "text" },
  { column: "measurement_k1", type: "number" },
  { column: "measurement_n", type: "number" },
  { column: "depth_with_seats_slid_forward", type: "number" },
  { column: "2nd_row_seats_folded_to_floor", type: "number" },
  { column: "measurement_k2", type: "number" },
  { column: "3rd_row_seats_folded_lip_to_floor", type: "number" },
  { column: "3rd_row_options", type: "text" },
  { column: "boot_floor_to_boot_lip", type: "number" },
  { column: "measurement_p", type: "number" },
  { column: "measurement_q", type: "number" },
  { column: "measurement_r", type: "number" },
  { column: "height_end_arm_to_ground", type: "number" },
  { column: "fitting_notes", type: "text" },
  { column: "false_floor_notes", type: "text" },
  { column: "hoist_fitting_pdf_filename", type: "text" },
];

/* Used when the database schema cannot be read */
const REQUIRED_COLUMNS_FALLBACK = [
  "manufacturer",
  "model",
  "hoist_vehicle_variant",
  "min_start_date",
  "max_end_date",
  "hoist_status",
  "measurement_e",
  "measurement_o",
  "max_vehicle_load",
];

const NUMBER_TYPES = [
  "tinyint",
  "smallint",
  "mediumint",
  "int",
  "integer",
  "bigint",
  "decimal",
  "numeric",
  "float",
  "double",
];

const DATE_TYPES = ["date", "datetime", "timestamp"];

/* Column names are matched loosely so "Measurement E", "measurement_e" and
   "measurement-e" all match to the same column */
const normaliseKey = (key) =>
  (key ?? "")
    .toString()
    .replace(/^\uFEFF/, "")
    .replace(/[`_\s-]/g, "")
    .toLowerCase();

const getCSVVal = (row, key) => {
  const target = normaliseKey(key);
  const match = Object.keys(row).find((k) => normaliseKey(k) === target);
  return match ? row[match] : null;
};

const isBlank = (value) =>
  value === null || value === undefined || String(value).trim() === "";

const isBlankRow = (row) => Object.values(row).every((value) => isBlank(value));

/* "measurement_e" -> "Measurement E" */
const labelFor = (column) =>
  column
    .split("_")
    .map((word) => {
      if (word.toLowerCase() === "pdf") return "PDF";
      if (/^\d/.test(word)) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");

const isNumericValue = (value) => {
  const cleaned = String(value).trim().replace(/,/g, "");
  if (cleaned === "") return false;
  return !Number.isNaN(Number(cleaned));
};

const isRealDate = (year, month, day) => {
  if (month < 1 || month > 12 || day < 1 || day > 31) return false;

  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
};

const isDateValue = (value) => {
  const cleaned = String(value).trim();
  if (cleaned === "") return false;

  const yearFirst = /^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/.exec(cleaned);
  if (yearFirst) {
    return isRealDate(
      Number(yearFirst[1]),
      Number(yearFirst[2]),
      Number(yearFirst[3]),
    );
  }

  const dayFirst = /^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/.exec(cleaned);
  if (dayFirst) {
    return isRealDate(
      Number(dayFirst[3]),
      Number(dayFirst[2]),
      Number(dayFirst[1]),
    );
  }

  return false;
};

const isMaxVehicleLoadValue = (value) => {
  console.log(value)

  const ACCEPTED_VALUES = ["100*", "150*", "100", "150"];
  if (!ACCEPTED_VALUES.includes(value)) {
    return false;
  }

  return true;
};

/* day first dates are converted so the database always stores yyyy-mm-dd */
/* const toIsoDate = (value) => {
  const cleaned = String(value).trim();

  const dayFirst = /^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/.exec(cleaned);
  if (dayFirst) {
    const [, day, month, year] = dayFirst;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  return cleaned;
}; */

const typeFromDatabase = (dataType) => {
  if (!dataType) return null;
  if (NUMBER_TYPES.includes(dataType)) return "number";
  if (DATE_TYPES.includes(dataType)) return "date";
  return "text";
};

/* Columns the csv has to contain, checked against the header row */
const validateHeaders = (headers, requiredColumns) => {
  const present = new Set((headers || []).map(normaliseKey));

  return requiredColumns
    .filter((column) => !present.has(normaliseKey(column)))
    .map(
      (column) => `The CSV is missing a required column: ${labelFor(column)}.`,
    );
};

/* Checks a single row, the row number is the line in the file so the user
   can find it in excel */
const validateRow = (row, rowNumber, schema) => {
  const issues = [];

  schema.required.forEach((column) => {
    if (isBlank(getCSVVal(row, column))) {
      issues.push(`Row ${rowNumber}: ${labelFor(column)} is empty.`);
    }
  });

  schema.columns.forEach(({ column, type }) => {
    const value = getCSVVal(row, column);
    if (isBlank(value)) return;

    const cleaned = String(value).trim();

    if (type === "number" && !isNumericValue(cleaned)) {
      issues.push(
        `Row ${rowNumber}: ${labelFor(column)} must be a number (found "${cleaned}").`,
      );
    }

    if (column === "max_vehicle_load" && !isMaxVehicleLoadValue(cleaned)) {
      issues.push(
        `Row ${rowNumber}: ${labelFor(column)} must be one of the following - 100, 100*, 150, 150* (found "${cleaned}").`,
      );
    }

    if (type === "date" && !isDateValue(cleaned)) {
      issues.push(
        `Row ${rowNumber}: ${labelFor(column)} is not a valid date (found "${cleaned}").`,
      );
    }
  });

  return issues;
};

/* Turns a csv cell into the value that is sent to the database */
const convertValue = (value, type) => {
  if (isBlank(value)) return null;

  const cleaned = String(value).trim();

  if (type === "number") {
    const parsed = Number(cleaned.replace(/,/g, ""));
    return Number.isNaN(parsed) ? null : parsed;
  }

  return cleaned;
};

const extractColumnName = (message) => {
  const quoted = /column [`']([^`']+)[`']/i.exec(message);
  return quoted ? quoted[1].toLowerCase() : null;
};

/* Turns error into message */
const describeDatabaseError = (error) => {
  const message = error?.sqlMessage || error?.message || "";
  const code = error?.code;
  const column = extractColumnName(message);

  if (code === "ER_BAD_NULL_ERROR" || /cannot be null/i.test(message)) {
    return {
      status: 400,
      error: column
        ? `${labelFor(column)} is empty and cannot be left blank.`
        : "A required value is empty and cannot be left blank.",
    };
  }

  if (code === "ER_DATA_TOO_LONG" || /data too long/i.test(message)) {
    return {
      status: 400,
      error: column
        ? `${labelFor(column)} is too long for the database. Shorten the value and try again.`
        : "One of the values is too long for the database. Shorten it and try again.",
    };
  }

  if (
    code === "ER_TRUNCATED_WRONG_VALUE" ||
    code === "ER_WARN_DATA_OUT_OF_RANGE" ||
    /incorrect .* value|out of range/i.test(message)
  ) {
    return {
      status: 400,
      error: column
        ? `${labelFor(column)} is not a value the database accepts.`
        : "One of the values is not a value the database accepts.",
    };
  }

  if (code === "ER_DUP_ENTRY") {
    return {
      status: 400,
      error: "The file contains a duplicate entry that is not allowed.",
    };
  }

  if (
    code === "ECONNREFUSED" ||
    code === "ETIMEDOUT" ||
    code === "PROTOCOL_CONNECTION_LOST" ||
    code === "ER_ACCESS_DENIED_ERROR"
  ) {
    return {
      status: 503,
      error:
        "The database could not be reached, so nothing was uploaded. Please try again.",
    };
  }

  return null;
};

module.exports = {
  BOOT_HOIST_COLUMNS,
  MAX_REPORTED_ISSUES,
  REQUIRED_COLUMNS_FALLBACK,
  convertValue,
  describeDatabaseError,
  getCSVVal,
  isBlankRow,
  labelFor,
  normaliseKey,
  typeFromDatabase,
  validateHeaders,
  validateRow,
};
