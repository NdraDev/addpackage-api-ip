# AddPackage API - IP Management

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/NdraDev/addpackage-api-ip)

API untuk mengelola IP addresses dan server data menggunakan Cloudflare Workers + Hono + D1.

## API Endpoints

### 📍 IP Management

#### `GET /api/add/ip`

Tambah IP address ke database.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `ip` | string | ✅ Yes | IP address yang akan ditambahkan |

**Response:**

```json
{
  "success": true,
  "message": "IP berhasil ditambahkan",
  "ip": "1.1.1.1"
}
```

**Try it:**

```bash
curl "https://api.ip.cindra.dev/api/add/ip?ip=1.1.1.1"
```

---

#### `GET /api/list/ip`

Tampilkan semua IP addresses yang terdaftar.

**Response:**

```json
{
  "success": true,
  "total": 3,
  "message": "berhasil list keseluruhan ip",
  "data": ["1.1.1.1", "2.2.2.2", "3.3.3.3"]
}
```

**Try it:**

```bash
curl "https://api.ip.cindra.dev/api/list/ip"
```

---

#### `GET /api/check/ip`

Cek apakah IP address terdaftar.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `ip` | string | ✅ Yes | IP address yang akan dicek |

**Response (IP terdaftar):**

```json
{
  "success": true,
  "ip": "1.1.1.1",
  "message": "ip valid terdaftar",
  "tools": "https://addpackage.dev"
}
```

**Response (IP tidak terdaftar):**

```json
{
  "success": false,
  "ip": "4.4.4.4",
  "message": "ip tidak terdaftar",
  "register": "https://register.addpackage.dev"
}
```

**Try it:**

```bash
curl "https://api.ip.cindra.dev/api/check/ip?ip=1.1.1.1"
```

---

### 🖥️ Server Data (Requires API Key)

**Header Required:**

```
X-API-Key: 087767867841NdraDev
```

---

#### `POST /api/simpan/data`

Simpan atau update data server (IP, username, password).

Jika data dengan IP dan username yang sama sudah ada, maka password akan diupdate.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `ip` | string | ✅ Yes | IP address |
| `username` | string | ✅ Yes | Username |
| `password` | string | ✅ Yes | Password (disimpan plain text) |

**Response (Data baru):**

```json
{
  "success": true,
  "message": "Data server berhasil disimpan",
  "action": "inserted"
}
```

**Response (Update password):**

```json
{
  "success": true,
  "message": "Password berhasil diupdate",
  "action": "updated"
}
```

**Try it:**

```bash
curl -X POST "https://api.ip.cindra.dev/api/simpan/data?ip=1.1.1.1&username=admin&password=secret123" \
  -H "X-API-Key: 087767867841NdraDev"
```

---

#### `POST /api/list/data`

Tampilkan semua data server yang tersimpan.

**Response:**

```json
{
  "success": true,
  "total_server": 2,
  "message": "berhasil list semua server tersimpan",
  "data": [
    {
      "ip": "1.1.1.1",
      "username": "admin",
      "password": "password123"
    },
    {
      "ip": "2.2.2.2",
      "username": "user",
      "password": "secret456"
    }
  ]
}
```

**Try it:**

```bash
curl -X POST "https://api.ip.cindra.dev/api/list/data" \
  -H "X-API-Key: 087767867841NdraDev"
```

---

## Quick Start

### 1. Add IP

```bash
curl "https://api.ip.cindra.dev/api/add/ip?ip=1.1.1.1"
```

### 2. List IPs

```bash
curl "https://api.ip.cindra.dev/api/list/ip"
```

### 3. Check IP

```bash
curl "https://api.ip.cindra.dev/api/check/ip?ip=1.1.1.1"
```

### 4. Save Server Data (with API Key)

```bash
curl -X POST "https://api.ip.cindra.dev/api/simpan/data?ip=1.1.1.1&username=admin&password=secret123" \
  -H "X-API-Key: 087767867841NdraDev"
```

### 5. List Server Data (with API Key)

```bash
curl -X POST "https://api.ip.cindra.dev/api/list/data" \
  -H "X-API-Key: 087767867841NdraDev"
```

---

## Development

### Prerequisites

- Node.js 18+
- pnpm / npm
- Cloudflare account

### Setup

1. Clone dan install dependencies:

```bash
git clone https://github.com/NdraDev/addpackage-api-ip.git
cd addpackage-api-ip
pnpm install
```

2. Create D1 database:

```bash
npx wrangler d1 create addpackage-api-ip-db
```

Update `wrangler.jsonc` dengan `database_id` yang baru.

3. Run migrations:

```bash
npx wrangler d1 migrations apply DB --remote
```

4. Development mode:

```bash
pnpm dev
```

5. Deploy:

```bash
pnpm deploy
```

---

## Database Schema

### `ip_addresses`

| Column     | Type     | Description         |
| ---------- | -------- | ------------------- |
| id         | INTEGER  | Primary key         |
| ip         | TEXT     | IP address (unique) |
| created_at | DATETIME | Timestamp           |

### `server_data`

| Column               | Type     | Description           |
| -------------------- | -------- | --------------------- |
| id                   | INTEGER  | Primary key           |
| ip                   | TEXT     | IP address            |
| username             | TEXT     | Username              |
| password             | TEXT     | Password (plain text) |
| created_at           | DATETIME | Timestamp             |
| updated_at           | DATETIME | Timestamp             |
| UNIQUE(ip, username) |          |                       |

---

## API Documentation

OpenAPI documentation tersedia di:

- `/` - Swagger UI
- `/openapi.json` - OpenAPI JSON schema

---

## License

MIT

---

## Support

- Website: [https://addpackage.dev](https://addpackage.dev)
- Register: [https://register.addpackage.dev](https://register.addpackage.dev)
