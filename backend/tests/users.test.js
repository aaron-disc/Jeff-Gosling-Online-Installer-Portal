import { describe, it, expect, vi, beforeEach } from "vitest";
import { createRequire } from "node:module";
import request from "supertest";
import express from "express";

vi.hoisted(() => {
  process.env.JWT_SECRET = "test-secret";
});

import jwt from "jsonwebtoken";
import usersRouter from "../routes/users";

const requireCjs = createRequire(import.meta.url);
const pool = requireCjs("../db/db");
const { MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH } =
  requireCjs("../config/auth");
const argon2 = requireCjs("argon2");

const app = express();
app.use(express.json());
app.use(usersRouter);

const authToken = jwt.sign(
  { id: 1, email: "admin@example.com", isAdmin: true },
  "test-secret",
);

describe("GET /users", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns 200 with the list of users", async () => {
    const users = [
      {
        id: 1,
        email: "admin@example.com",
        is_admin: 1,
        created_at: "2026-01-01T00:00:00.000Z",
      },
      {
        id: 2,
        email: "user@example.com",
        is_admin: 0,
        created_at: "2026-01-02T00:00:00.000Z",
      },
    ];
    const query = vi.spyOn(pool, "query").mockResolvedValue([users]);

    const response = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(users);
    expect(query).toHaveBeenCalledOnce();
    expect(query).toHaveBeenCalledWith(
      "SELECT email, is_admin, created_at, id FROM users",
    );
  });

  it("returns 500 when the database query fails", async () => {
    vi.spyOn(pool, "query").mockRejectedValue(
      new Error("database unavailable"),
    );

    const response = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Interal server error" });
  });

  it("returns 401 when no authentication token is provided", async () => {
    const query = vi.spyOn(pool, "query");

    const response = await request(app).get("/users");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: "Authentication required." });
    expect(query).not.toHaveBeenCalled();
  });
});

describe("POST /create-user", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns 201 after creating the user", async () => {
    const execute = vi
      .spyOn(pool, "execute")
      .mockResolvedValueOnce([[{ count: 0 }]]) // exmail doesn't exist
      .mockResolvedValueOnce([{ affectedRows: 1 }]); // user created successfully
    const hash = vi.spyOn(argon2, "hash").mockResolvedValue("hashed-password");

    const response = await request(app)
      .post("/create-user")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        email: "new@user.com",
        password: "newuserpassword",
        isAdmin: 0,
      });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: "User created successfully",
    });
    expect(execute).toHaveBeenNthCalledWith(
      1,
      "SELECT COUNT(*) as count FROM users WHERE email = ?",
      ["new@user.com"],
    );
    expect(hash).toHaveBeenCalledOnce();
    expect(hash).toHaveBeenCalledWith("newuserpassword", {
      type: argon2.argon2id,
    });
    expect(execute).toHaveBeenNthCalledWith(
      2,
      "INSERT INTO users (email, password_hash, is_admin) VALUES (?, ?, ?)",
      ["new@user.com", "hashed-password", 0],
    );
    expect(execute).toHaveBeenCalledTimes(2);
  });

  it("returns 400 if email and password are empty", async () => {
    const query = vi.spyOn(pool, "query");

    const response = await request(app)
      .post("/create-user")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ email: "", password: "", isAdmin: 0 });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "Email and password are required.",
    });
    expect(query).not.toHaveBeenCalled();
  });

  it("returns 400 if the email isn't a valid email", async () => {
    const query = vi.spyOn(pool, "query");

    const response = await request(app)
      .post("/create-user")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ email: "missingatsymbol.com", password: "password", isAdmin: 0 });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "Email must be a valid address.",
    });
    expect(query).not.toHaveBeenCalled();
  });

  it("returns 400 if the password is too long", async () => {
    const query = vi.spyOn(pool, "query");

    const response = await request(app)
      .post("/create-user")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        email: "new@user.com",
        password: "p".repeat(MAX_PASSWORD_LENGTH + 1),
        isAdmin: 0,
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: `Password must be at most ${MAX_PASSWORD_LENGTH} characters.`,
    });
    expect(query).not.toHaveBeenCalled();
  });

  it("returns 400 if the password is too short", async () => {
    const query = vi.spyOn(pool, "query");

    const response = await request(app)
      .post("/create-user")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        email: "new@user.com",
        password: "p".repeat(MIN_PASSWORD_LENGTH - 1),
        isAdmin: 0,
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
    });
    expect(query).not.toHaveBeenCalled();
  });

  it("returns 400 if the chosen email is already in use", async () => {
    const execute = vi
      .spyOn(pool, "execute")
      .mockResolvedValue([[{ count: 1 }]]); // email already exists
    const hash = vi.spyOn(argon2, "hash");

    const response = await request(app)
      .post("/create-user")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        email: "existing@email.com",
        password: "password",
        isAdmin: 0,
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "Email already in use.",
    });
    expect(execute).toHaveBeenCalledOnce();
    expect(execute).toHaveBeenCalledWith(
      "SELECT COUNT(*) as count FROM users WHERE email = ?",
      ["existing@email.com"],
    );
    expect(hash).not.toHaveBeenCalled();
  });

  it("returns 401 when no authentication token is provided", async () => {
    const execute = vi.spyOn(pool, "execute");

    const response = await request(app).post("/create-user");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: "Authentication required." });
    expect(execute).not.toHaveBeenCalled();
  });
});

describe("DELETE /delete-user/:id", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns 200 after deleting the user", async () => {
    const execute = vi
      .spyOn(pool, "execute")
      .mockResolvedValue([{ affectedRows: 1 }]);

    const response = await request(app)
      .delete("/delete-user/1")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        id: 1,
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: "User deleted successfully.",
    });
    expect(execute).toHaveBeenCalledOnce();
    expect(execute).toHaveBeenCalledWith("DELETE FROM users WHERE id = ?", ["1"]);
  });

  it("returns 500 if the id doesn't match a user", async () => {
    const execute = vi
      .spyOn(pool, "execute")
      .mockResolvedValue([{ affectedRows: 0 }]); // user doesn't exist

    const response = await request(app)
      .delete("/delete-user/1000")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ id: 1000 });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      success: false,
      message: "Failed to find user",
    });
    expect(execute).toHaveBeenCalledOnce();
    expect(execute).toHaveBeenCalledWith("DELETE FROM users WHERE id = ?", [
      "1000",
    ]);
  });

  it("returns 401 when no authentication token is provided", async () => {
    const execute = vi.spyOn(pool, "execute");

    const response = await request(app).delete("/delete-user/1").send({ id: 1 });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: "Authentication required." });
    expect(execute).not.toHaveBeenCalled();
  });
});

describe("PATCH /change-password", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns 200 after changing the password", async () => {
    const execute = vi
      .spyOn(pool, "execute")
      .mockResolvedValueOnce([[{ password_hash: "currentpasswordhash" }]])
      .mockResolvedValueOnce([{ affectedRows: 1 }]);
    const verify = vi
      .spyOn(argon2, "verify")
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false);
    const hash = vi
      .spyOn(argon2, "hash")
      .mockResolvedValue("newhashedpassword");

    const response = await request(app)
      .patch("/change-password")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        currentPassword: "currentpassword",
        newPassword: "newpassword",
        confirmPassword: "newpassword",
        id: 1,
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: "Password changed successfully.",
    });
    expect(execute).toHaveBeenNthCalledWith(
      1,
      "SELECT password_hash FROM users WHERE id = ?",
      [1],
    );
    expect(verify).toHaveBeenNthCalledWith(
      1,
      "currentpasswordhash",
      "currentpassword",
    );
    expect(verify).toHaveBeenNthCalledWith(
      2,
      "currentpasswordhash",
      "newpassword",
    );
    expect(hash).toHaveBeenCalledOnce();
    expect(hash).toHaveBeenCalledWith("newpassword", {
      type: argon2.argon2id,
    });
    expect(execute).toHaveBeenNthCalledWith(
      2,
      "UPDATE users SET password_hash = ? WHERE id = ?",
      ["newhashedpassword", 1],
    );
    expect(execute).toHaveBeenNthCalledWith(
      3,
      `UPDATE refresh_tokens
        SET revoked_at = NOW()
      WHERE user_id = ? AND revoked_at IS NULL`,
      [1],
    );
    expect(verify).toHaveBeenCalledTimes(2);
    expect(execute).toHaveBeenCalledTimes(3);
  });

  it("returns 400 if new, current or confirm password is empty", async () => {
    const execute = vi.spyOn(pool, "execute");

    const response = await request(app)
      .patch("/change-password")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        id: 1,
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error:
        "Current password, new password and confirmation password are all required.",
    });
    expect(execute).not.toHaveBeenCalled();
  });

  it("returns 400 if the request id is invalid", async () => {
    const execute = vi.spyOn(pool, "execute");

    const response = await request(app)
      .patch("/change-password")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        currentPassword: "currentpassword",
        newPassword: "newpassword",
        confirmPassword: "newpassword",
        id: -1,
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "A valid user id is required.",
    });
    expect(execute).not.toHaveBeenCalled();
  });

  it("returns 400 if the new password is too short", async () => {
    const execute = vi.spyOn(pool, "execute");

    const response = await request(app)
      .patch("/change-password")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        currentPassword: "currentpassword",
        newPassword: "p".repeat(MIN_PASSWORD_LENGTH - 1),
        confirmPassword: "p".repeat(MIN_PASSWORD_LENGTH - 1),
        id: 1,
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: `New password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
    });
    expect(execute).not.toHaveBeenCalled();
  });

  it("returns 400 if the new password is too long", async () => {
    const execute = vi.spyOn(pool, "execute");

    const response = await request(app)
      .patch("/change-password")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        currentPassword: "currentpassword",
        newPassword: "p".repeat(MAX_PASSWORD_LENGTH + 1),
        confirmPassword: "p".repeat(MAX_PASSWORD_LENGTH + 1),
        id: 1,
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: `New password must be at most ${MAX_PASSWORD_LENGTH} characters.`,
    });
    expect(execute).not.toHaveBeenCalled();
  });

  it("returns 400 if the new and confirmation passwords don't match", async () => {
    const execute = vi.spyOn(pool, "execute");

    const response = await request(app)
      .patch("/change-password")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        currentPassword: "currentpassword",
        newPassword: "newpassword",
        confirmPassword: "differenttonewpassword",
        id: 1,
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "New and confirmation passwords do not match.",
    });
    expect(execute).not.toHaveBeenCalled();
  });

  it("returns 400 if the user doesn't exist by id", async () => {
    const execute = vi
      .spyOn(pool, "execute")
      .mockResolvedValue([{ affectedRows: 0 }]);

    const response = await request(app)
      .patch("/change-password")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        currentPassword: "currentpassword",
        newPassword: "newpassword",
        confirmPassword: "newpassword",
        id: 1000,
      });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: "Failed to get user information.",
    });
    expect(execute).toHaveBeenCalledOnce();
    expect(execute).toHaveBeenCalledWith(
      "SELECT password_hash FROM users WHERE id = ?",
      [1000],
    );
  });

  it("returns 400 if the current password is incorrect", async () => {
    const execute = vi
      .spyOn(pool, "execute")
      .mockResolvedValue([[{ password_hash: "currentpasswordhash" }]]);
    const verify = vi.spyOn(argon2, "verify").mockResolvedValue(false);

    const response = await request(app)
      .patch("/change-password")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        currentPassword: "currentpassword",
        newPassword: "newpassword",
        confirmPassword: "newpassword",
        id: 1,
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "Current password is incorrect.",
    });
    expect(execute).toHaveBeenCalledOnce();
    expect(execute).toHaveBeenCalledWith(
      "SELECT password_hash FROM users WHERE id = ?",
      [1],
    );
    expect(verify).toHaveBeenCalledOnce();
    expect(verify).toHaveBeenCalledWith(
      "currentpasswordhash",
      "currentpassword",
    );
  });

  it("returns 400 if the new password is the same as the users current password", async () => {
    const execute = vi
      .spyOn(pool, "execute")
      .mockResolvedValue([[{ password_hash: "samepasswordashash" }]]);
    const verify = vi
      .spyOn(argon2, "verify")
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(true);

    const response = await request(app)
      .patch("/change-password")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        currentPassword: "currentpassword",
        newPassword: "samepasswordashash",
        confirmPassword: "samepasswordashash",
        id: 1,
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "New password cannot be the same as the current password.",
    });
    expect(execute).toHaveBeenCalledOnce();
    expect(execute).toHaveBeenCalledWith(
      "SELECT password_hash FROM users WHERE id = ?",
      [1],
    );
    expect(verify).toHaveBeenNthCalledWith(
      1,
      "samepasswordashash",
      "currentpassword",
    );
    expect(verify).toHaveBeenNthCalledWith(
      2,
      "samepasswordashash",
      "samepasswordashash",
    );
    expect(verify).toHaveBeenCalledTimes(2);
  });

  it("returns 500 if the database failed to update the password", async () => {
    const execute = vi
      .spyOn(pool, "execute")
      .mockResolvedValueOnce([[{ password_hash: "currentpasswordhash" }]])
      .mockResolvedValueOnce([{ affectedRows: 0 }]);
    const verify = vi
      .spyOn(argon2, "verify")
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false);
    const hash = vi
      .spyOn(argon2, "hash")
      .mockResolvedValue("newhashedpassword");

    const response = await request(app)
      .patch("/change-password")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        currentPassword: "currentpassword",
        newPassword: "newpassword",
        confirmPassword: "newpassword",
        id: 1,
      });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      success: false,
      error: "Failed to update password.",
    });
    expect(execute).toHaveBeenNthCalledWith(
      1,
      "SELECT password_hash FROM users WHERE id = ?",
      [1],
    );
    expect(verify).toHaveBeenNthCalledWith(
      1,
      "currentpasswordhash",
      "currentpassword",
    );
    expect(verify).toHaveBeenNthCalledWith(
      2,
      "currentpasswordhash",
      "newpassword",
    );
    expect(hash).toHaveBeenCalledOnce();
    expect(hash).toHaveBeenCalledWith("newpassword", { type: argon2.argon2id });
    expect(execute).toHaveBeenNthCalledWith(
      2,
      "UPDATE users SET password_hash = ? WHERE id = ?",
      ["newhashedpassword", 1],
    );
    expect(verify).toHaveBeenCalledTimes(2);
    expect(execute).toHaveBeenCalledTimes(2);
  });

  it("returns 401 when no authentication token is provided", async () => {
    const execute = vi.spyOn(pool, "execute");
    const verify = vi.spyOn(argon2, "verify");
    const hash = vi.spyOn(argon2, "hash");

    const response = await request(app).patch("/change-password").send({
      currentPassword: "currentpassword",
      newPassword: "newpassword",
      confirmPassword: "newpassword",
      id: 1,
    });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: "Authentication required." });
    expect(execute).not.toHaveBeenCalled();
    expect(verify).not.toHaveBeenCalled();
    expect(hash).not.toHaveBeenCalled();
  });
});
