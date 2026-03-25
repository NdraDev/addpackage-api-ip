import { createRoute, z } from "chanfana";
import { Hono } from "hono";

export const serverDataRouter = new Hono<{ Bindings: Env }>();

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
  createRoute({
    method: "post",
    path: "/api/simpan/data",
    summary: "Save or update server data",
    request: {
      query: z.object({
        ip: z.string().describe("IP address"),
        username: z.string().describe("Username"),
        password: z.string().describe("Password"),
      }),
    },
    responses: {
      200: {
        description: "Data saved successfully",
        content: {
          "application/json": {
            schema: z.object({
              success: z.boolean(),
              message: z.string(),
              action: z.string(),
            }),
          },
        },
      },
    },
  }),
  async (c) => {
    const { ip, username, password } = c.req.valid("query");

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
  createRoute({
    method: "post",
    path: "/api/list/data",
    summary: "List all server data",
    responses: {
      200: {
        description: "List of all server data",
        content: {
          "application/json": {
            schema: z.object({
              success: z.boolean(),
              total_server: z.number(),
              message: z.string(),
              data: z.array(
                z.object({
                  ip: z.string(),
                  username: z.string(),
                  password: z.string(),
                })
              ),
            }),
          },
        },
      },
    },
  }),
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
