require("dotenv").config();
const express = require("express");
//const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

app.get("/test", async (req, res) => {
  return res.json({ key: "value" })
});

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`),
);
