# AddPackage API - IP Management

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/NdraDev/addpackage-api-ip)

API untuk mengelola IP addresses dan server data menggunakan Cloudflare Workers + Hono + D1.

## 🚀 Quick Start

```bash
# Add IP
curl "https://api.ip.cindra.dev/api/add/ip?ip=1.1.1.1"

# List IPs
curl "https://api.ip.cindra.dev/api/list/ip"

# Check IP
curl "https://api.ip.cindra.dev/api/check/ip?ip=1.1.1.1"

# Save Server Data (JSON Body)
curl -X POST "https://api.ip.cindra.dev/api/simpan/data" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: 087767867841NdraDev" \
  -d '{"ip":"1.1.1.1","username":"admin","password":"secret123"}'

# List Server Data
curl -X POST "https://api.ip.cindra.dev/api/list/data" \
  -H "X-API-Key: 087767867841NdraDev"
```

---

## 📍 API Endpoints

### IP Management (No Auth)

#### `GET /api/add/ip`

Tambah IP address ke database.

| Parameter | Type   | Required | Description |
| --------- | ------ | -------- | ----------- |
| `ip`      | string | ✅ Yes   | IP address  |

**Response:**

```json
{
  "success": true,
  "message": "IP berhasil ditambahkan",
  "ip": "1.1.1.1"
}
```

---

#### `GET /api/list/ip`

List semua IP addresses.

**Response:**

```json
{
  "success": true,
  "total": 3,
  "message": "berhasil list keseluruhan ip",
  "data": ["1.1.1.1", "2.2.2.2", "3.3.3.3"]
}
```

---

#### `GET /api/check/ip`

Cek apakah IP terdaftar.

| Parameter | Type   | Required | Description |
| --------- | ------ | -------- | ----------- |
| `ip`      | string | ✅ Yes   | IP address  |

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

---

### 🖥️ Server Data (API Key Required)

**Header:** `X-API-Key: 087767867841NdraDev`

---

#### `POST /api/simpan/data`

Simpan atau update data server.

**Content-Type:** `application/json`

**Body:**

```json
{
  "ip": "1.1.1.1",
  "username": "admin",
  "password": "secret123"
}
```

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

---

#### `POST /api/list/data`

List semua data server.

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
      "password": "secret123"
    },
    {
      "ip": "2.2.2.2",
      "username": "user",
      "password": "password456"
    }
  ]
}
```

---

## 🛠️ Development

```bash
# Install
pnpm install

# Create D1 database
npx wrangler d1 create addpackage-api-ip-db

# Run migrations
npx wrangler d1 migrations apply DB --remote

# Dev mode
pnpm dev

# Deploy
pnpm deploy
```

---

## 📊 Database Schema

### `ip_addresses`

| Column     | Type     | Description         |
| ---------- | -------- | ------------------- |
| id         | INTEGER  | Primary key         |
| ip         | TEXT     | IP address (unique) |
| created_at | DATETIME | Timestamp           |

### `server_data`

| Column     | Type     | Description           |
| ---------- | -------- | --------------------- |
| id         | INTEGER  | Primary key           |
| ip         | TEXT     | IP address            |
| username   | TEXT     | Username              |
| password   | TEXT     | Password (plain text) |
| created_at | DATETIME | Timestamp             |
| updated_at | DATETIME | Timestamp             |

---

## 🔒 Security

- Server Data endpoints memerlukan API Key di header
- Password disimpan plain text (tidak di-hash)
- Gunakan HTTPS untuk production

---

## 📄 License

MIT

---

## 🔗 Links

- Website: https://addpackage.dev
- Register: https://register.addpackage.dev
