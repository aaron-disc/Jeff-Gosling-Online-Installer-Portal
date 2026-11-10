require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { JWT_SECRET } = require("./config/auth");
const authRoutes = require("./routes/auth");
const sessionRoutes = require("./routes/sessions");
const userRoutes = require("./routes/users");
const logRoutes = require("./routes/logs");
const hoistRoutes = require("./routes/hoists");
const pdfRoutes = require("./routes/pdfs");
const { closeExpiredSessions } = require("./services/sessionStore");

if (!JWT_SECRET) {
  throw new Error(
    "JWT_SECRET is not set. Add it to your environment before starting the server.",
  );
}

const app = express();
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

app.use(authRoutes);
app.use(sessionRoutes);
app.use(userRoutes);
app.use(logRoutes);
app.use(hoistRoutes);
app.use(pdfRoutes);

/* JSON not found handler -- keeps every api reply parseable as json */
app.use((req, res) => {
  res.status(404).json({ error: "Not found." });
});

/* JSON error handler -- stops express from replying with an html error page
   that the api client cannot parse */
app.use((error, req, res, next) => {
  console.error("Unhandled Error:", error);
  if (res.headersSent) return next(error);

  const status = error.status || 500;
  const message = status < 500 ? error.message : "Internal server error.";

  res.status(status).json({ error: message });
});

const SESSION_SWEEP_INTERVAL_MS = 60 * 1000;

async function runSessionSweep() {
  try {
    await closeExpiredSessions();
  } catch (error) {
    console.warn("Session expiry sweep failed:", error.message);
  }
}

async function startSessionTracking() {
  await runSessionSweep();

  const timer = setInterval(runSessionSweep, SESSION_SWEEP_INTERVAL_MS);

  if (typeof timer.unref === "function") timer.unref();
}

startSessionTracking();

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`),
);
