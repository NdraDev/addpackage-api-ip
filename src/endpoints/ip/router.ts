import { createRoute, z } from "chanfana";
import { Hono } from "hono";

export const ipRouter = new Hono<{ Bindings: Env }>();

// GET /api/add/ip - Add IP to database
ipRouter.get(
  "/add/ip",
  createRoute({
    method: "get",
    path: "/api/add/ip",
    summary: "Add IP address to database",
    request: {
      query: z.object({
        ip: z.string().describe("IP address to add"),
      }),
    },
    responses: {
      200: {
        description: "IP added successfully",
        content: {
          "application/json": {
            schema: z.object({
              success: z.boolean(),
              message: z.string(),
              ip: z.string(),
            }),
          },
        },
      },
    },
  }),
  async (c) => {
    const { ip } = c.req.valid("query");

    try {
      await c.env.DB.prepare(
        "INSERT OR IGNORE INTO ip_addresses (ip) VALUES (?)"
      ).bind(ip).run();

      return c.json({
        success: true,
        message: "IP berhasil ditambahkan",
        ip: ip,
      });
    } catch (error) {
      return c.json(
        {
          success: false,
          message: "Gagal menambahkan IP",
          error: String(error),
        },
        500
      );
    }
  }
);

// GET /api/list/ip - List all IPs
ipRouter.get(
  "/list/ip",
  createRoute({
    method: "get",
    path: "/api/list/ip",
    summary: "List all IP addresses",
    responses: {
      200: {
        description: "List of all IP addresses",
        content: {
          "application/json": {
            schema: z.object({
              success: z.boolean(),
              total: z.number(),
              message: z.string(),
              data: z.array(z.string()),
            }),
          },
        },
      },
    },
  }),
  async (c) => {
    try {
      const result = await c.env.DB.prepare(
        "SELECT ip FROM ip_addresses ORDER BY created_at DESC"
      ).all();

      const ips = result.results.map((row: any) => row.ip);

      return c.json({
        success: true,
        total: ips.length,
        message: "berhasil list keseluruhan ip",
        data: ips,
      });
    } catch (error) {
      return c.json(
        {
          success: false,
          total: 0,
          message: "Gagal mengambil daftar IP",
          data: [],
          error: String(error),
        },
        500
      );
    }
  }
);

// GET /api/check/ip - Check if IP is registered
ipRouter.get(
  "/check/ip",
  createRoute({
    method: "get",
    path: "/api/check/ip",
    summary: "Check if IP address is registered",
    request: {
      query: z.object({
        ip: z.string().describe("IP address to check"),
      }),
    },
    responses: {
      200: {
        description: "IP check result",
        content: {
          "application/json": {
            schema: z.object({
              success: z.boolean(),
              ip: z.string(),
              message: z.string(),
              tools: z.string().optional(),
              register: z.string().optional(),
            }),
          },
        },
      },
    },
  }),
  async (c) => {
    const { ip } = c.req.valid("query");

    try {
      const result = await c.env.DB.prepare(
        "SELECT ip FROM ip_addresses WHERE ip = ?"
      ).bind(ip).first();

      if (result) {
        return c.json({
          success: true,
          ip: ip,
          message: "ip valid terdaftar",
          tools: "https://addpackage.dev",
        });
      } else {
        return c.json({
          success: false,
          ip: ip,
          message: "ip tidak terdaftar",
          register: "https://register.addpackage.dev",
        });
      }
    } catch (error) {
      return c.json(
        {
          success: false,
          ip: ip,
          message: "Terjadi kesalahan saat mengecek IP",
          error: String(error),
        },
        500
      );
    }
  }
);
