import { describe, it, expect, vi, beforeEach } from "vitest";
import { createRequire } from "node:module";
import request from "supertest";
import express from "express";

vi.hoisted(() => {
  process.env.JWT_SECRET = "test-secret";
});

import jwt from "jsonwebtoken";
import logsRouter from "../routes/logs";

const requireCjs = createRequire(import.meta.url);
const pool = requireCjs("../db/db");

const app = express();
app.use(express.json());
app.use(logsRouter);

const authToken = jwt.sign(
  { id: 1, email: "admin@example.com", isAdmin: true },
  "test-secret",
);
const nonAdminToken = jwt.sign(
  { id: 2, email: "user@example.com", isAdmin: false },
  "test-secret",
);

describe("GET /logs", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns 200 and all logs", async () => {
    const logs = [
      {
        event_log_id: 2,
        category: "Users",
        event_actor: "admin@example.com",
        event_action: "DELETED",
        event_target: "old@user.com",
        created_at: "2026-11-18T23:59:59.000Z",
      },
      {
        event_log_id: 1,
        category: "Users",
        event_actor: "admin@example.com",
        event_action: "CREATED",
        event_target: "new@user.com",
        created_at: "2026-11-17T00:00:00.000Z",
      },
    ];
    const execute = vi.spyOn(pool, "execute").mockResolvedValue([logs]);

    const response = await request(app)
      .get("/logs")
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(logs);
    expect(execute).toHaveBeenCalledOnce();
    expect(execute).toHaveBeenCalledWith(
      "SELECT * FROM event_logs ORDER BY created_at DESC",
      [],
    );
  });

  it("returns 200 and all logs matching filters in the url query", async () => {
    const filters = {
      startDate: "2026-11-17T00:00:00.000Z",
      endDate: "2026-11-18T23:59:59.999Z",
      category: "Users",
      actor: "admin@example.com",
    };
    const logs = [
      {
        event_log_id: 2,
        category: "Users",
        event_actor: "admin@example.com",
        event_action: "DELETED",
        event_target: "old@user.com",
        created_at: "2026-11-18T23:59:59.000Z",
      },
    ];
    const execute = vi.spyOn(pool, "execute").mockResolvedValue([logs]);

    const response = await request(app)
      .get("/logs")
      .query(filters)
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(logs);
    expect(execute).toHaveBeenCalledOnce();
    expect(execute).toHaveBeenCalledWith(
      "SELECT * FROM event_logs WHERE created_at >= ? AND created_at <= ? AND category = ? AND event_actor = ? ORDER BY created_at DESC",
      [
        filters.startDate,
        filters.endDate,
        filters.category,
        filters.actor,
      ],
      );
  });
});

