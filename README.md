# AddPackage API - IP Management

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/NdraDev/addpackage-api-ip)

API untuk mengelola IP addresses dan server data menggunakan Cloudflare Workers + Hono + D1.

## API Endpoints

### IP Management

#### `GET /api/add/ip`

Tambah IP address ke database.

**Parameters:**

- `ip` (query) - IP address yang akan ditambahkan

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

---

#### `GET /api/check/ip`

Cek apakah IP address terdaftar.

**Parameters:**

- `ip` (query) - IP address yang akan dicek

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

### Server Data (Requires API Key)

**Header Required:**

- `X-API-Key: 087767867841NdraDev`

---

#### `POST /api/simpan/data`

Simpan atau update data server (IP, username, password).

**Parameters:**

- `ip` (query) - IP address
- `username` (query) - Username
- `password` (query) - Password (disimpan plain text)

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

---

## Getting Started

### Prerequisites

- Node.js
- pnpm / npm
- Cloudflare account

### Setup

1. Install dependencies:

```bash
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

4. Deploy:

```bash
pnpm deploy
```

5. Development mode:

```bash
pnpm dev
```

---

## Testing

```bash
pnpm test
```

---

## Example Usage

### Add IP

```bash
curl "https://your-worker.workers.dev/api/add/ip?ip=1.1.1.1"
```

### List IPs

```bash
curl "https://your-worker.workers.dev/api/list/ip"
```

### Check IP

```bash
curl "https://your-worker.workers.dev/api/check/ip?ip=1.1.1.1"
```

### Save Server Data (with API Key)

```bash
curl -X POST "https://your-worker.workers.dev/api/simpan/data?ip=1.1.1.1&username=admin&password=secret123" \
  -H "X-API-Key: 087767867841NdraDev"
```

### List Server Data (with API Key)

```bash
curl -X POST "https://your-worker.workers.dev/api/list/data" \
  -H "X-API-Key: 087767867841NdraDev"
```

---

## License

MIT
