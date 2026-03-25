import { Hono } from "hono";
import { fromHono } from "chanfana";

export const ipRouter = fromHono(new Hono<{ Bindings: Env }>());

// GET /api/add/ip - Add IP to database
ipRouter.get("/add/ip", async (c) => {
  const ip = c.req.query("ip");

  if (!ip) {
    return c.json({
      success: false,
      message: "Parameter ip diperlukan",
    }, 400);
  }

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
});

// GET /api/list/ip - List all IPs
ipRouter.get("/list/ip", async (c) => {
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
});

// GET /api/check/ip - Check if IP is registered
ipRouter.get("/check/ip", async (c) => {
  const ip = c.req.query("ip");

  if (!ip) {
    return c.json({
      success: false,
      message: "Parameter ip diperlukan",
    }, 400);
  }

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
});
