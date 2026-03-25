import { applyMigrations } from "./apply-migrations";
import { describe, it, expect, beforeAll } from "vitest";

describe("IP API", () => {
  beforeAll(async () => {
    await applyMigrations(env.DB);
  });

  it("adds IP to database", async () => {
    const response = await env.FETCH(new Request("http://localhost/api/add/ip?ip=1.1.1.1"));
    const data = await response.json();
    expect(data.success).toBe(true);
  });

  it("lists all IPs", async () => {
    const response = await env.FETCH(new Request("http://localhost/api/list/ip"));
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
  });

  it("checks if IP is registered", async () => {
    const response = await env.FETCH(new Request("http://localhost/api/check/ip?ip=1.1.1.1"));
    const data = await response.json();
    expect(data.success).toBe(true);
  });
});

describe("Server Data API", () => {
  const apiKey = "087767867841NdraDev";

  it("saves server data with JSON body", async () => {
    const response = await env.FETCH(
      new Request("http://localhost/api/simpan/data", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "X-API-Key": apiKey 
        },
        body: JSON.stringify({
          ip: "1.1.1.1",
          username: "admin",
          password: "secret"
        }),
      })
    );
    const data = await response.json();
    expect(data.success).toBe(true);
  });

  it("rejects request without API key", async () => {
    const response = await env.FETCH(
      new Request("http://localhost/api/simpan/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ip: "1.1.1.1", username: "admin", password: "secret" }),
      })
    );
    expect(response.status).toBe(401);
  });

  it("lists server data", async () => {
    const response = await env.FETCH(
      new Request("http://localhost/api/list/data", {
        method: "POST",
        headers: { "X-API-Key": apiKey },
      })
    );
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
  });
});
