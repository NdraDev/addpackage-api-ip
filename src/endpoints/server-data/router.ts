import { Hono } from "hono";
import { fromHono } from "chanfana";
import { z } from "zod";

export const serverDataRouter = fromHono(new Hono<{ Bindings: Env }>());

const API_KEY = "087767867841NdraDev";

// Middleware to check API key
const apiKeyAuth = async (c: any, next: any) => {
  const apiKey = c.req.header("X-API-Key");
  
  if (!apiKey || apiKey !== API_KEY) {
    return c.json(
      {
        success: false,
        message: "Unauthorized: Invalid or missing API key",
      },
      401
    );
  }
  
  await next();
};

// POST /api/simpan/data - Save or update server data
serverDataRouter.post(
  "/simpan/data",
  apiKeyAuth,
  async (c) => {
    const ip = c.req.query("ip");
    const username = c.req.query("username");
    const password = c.req.query("password");

    if (!ip || !username || !password) {
      return c.json({
        success: false,
        message: "Parameter ip, username, dan password diperlukan",
      }, 400);
    }

    try {
      // Check if data already exists
      const existing = await c.env.DB.prepare(
        "SELECT * FROM server_data WHERE ip = ? AND username = ?"
      ).bind(ip, username).first();

      if (existing) {
        // Update password
        await c.env.DB.prepare(
          "UPDATE server_data SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE ip = ? AND username = ?"
        ).bind(password, ip, username).run();

        return c.json({
          success: true,
          message: "Password berhasil diupdate",
          action: "updated",
        });
      } else {
        // Insert new data
        await c.env.DB.prepare(
          "INSERT INTO server_data (ip, username, password) VALUES (?, ?, ?)"
        ).bind(ip, username, password).run();

        return c.json({
          success: true,
          message: "Data server berhasil disimpan",
          action: "inserted",
        });
      }
    } catch (error) {
      return c.json(
        {
          success: false,
          message: "Gagal menyimpan data",
          error: String(error),
        },
        500
      );
    }
  }
);

// POST /api/list/data - List all server data
serverDataRouter.post(
  "/list/data",
  apiKeyAuth,
  async (c) => {
    try {
      const result = await c.env.DB.prepare(
        "SELECT ip, username, password FROM server_data ORDER BY created_at DESC"
      ).all();

      const servers = result.results.map((row: any) => ({
        ip: row.ip,
        username: row.username,
        password: row.password,
      }));

      return c.json({
        success: true,
        total_server: servers.length,
        message: "berhasil list semua server tersimpan",
        data: servers,
      });
    } catch (error) {
      return c.json(
        {
          success: false,
          total_server: 0,
          message: "Gagal mengambil daftar server",
          data: [],
          error: String(error),
        },
        500
      );
    }
  }
);
