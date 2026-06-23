require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const { toCamelCase } = require("./utils/camelCaseParser");

const app = express();
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

//READ boot hoist vehicle data - (http://localhost:5000/api/local-csv)
app.get("/api/local-csv", (req, res) => {
  const results = [];

  const filePath = path.join(process.env.CSV_PATH);
  // check if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `File not found at ${filePath}` });
  }

  // stream the file and pipe it into the CSV parser
  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", () => {

      const formattedResults = results.map((row) => {
        const newRow = {};
        Object.keys(row).forEach((key) => {
          newRow[toCamelCase(key)] = row[key];
        });
        return newRow;
      });

      res.json({
        ...formattedResults,
      });
    })
    .on("error", (error) => {
      res
        .status(500)
        .json({ error: "Failed to parse local CSV", details: error.message });
    });
});

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`),
);
