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

---

#### `GET /api/list/ip`
Tampilkan semua IP addresses yang terdaftar.

**Response:**
```json
{
  "success": true,
  "total": 3,
  "message": "berhasil list keseluruhan ip",
  "data": [
    "1.1.1.1",
    "2.2.2.2",
    "3.3.3.3"
  ]
}
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

---

### 🖥️ Server Data (Requires API Key)

**Header Required:**
```
X-API-Key: 087767867841NdraDev
```

---

#### `POST /api/simpan/data`
Simpan atau update data server (IP, username, password).

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `ip` | string | ✅ Yes | IP address |
| `username` | string | ✅ Yes | Username |
| `password` | string | ✅ Yes | Password (plain text) |

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
    }
  ]
}
```

---

## Quick Start

```bash
# Add IP
curl "https://api.ip.cindra.dev/api/add/ip?ip=1.1.1.1"

# List IPs
curl "https://api.ip.cindra.dev/api/list/ip"

# Check IP
curl "https://api.ip.cindra.dev/api/check/ip?ip=1.1.1.1"

# Save Server Data
curl -X POST "https://api.ip.cindra.dev/api/simpan/data?ip=1.1.1.1&username=admin&password=secret" \
  -H "X-API-Key: 087767867841NdraDev"

# List Server Data
curl -X POST "https://api.ip.cindra.dev/api/list/data" \
  -H "X-API-Key: 087767867841NdraDev"
```

---

## Development

```bash
# Install dependencies
pnpm install

# Create D1 database
npx wrangler d1 create addpackage-api-ip-db

# Run migrations
npx wrangler d1 migrations apply DB --remote

# Development
pnpm dev

# Deploy
pnpm deploy
```

---

## License

MIT

---

## Support

- Website: [https://addpackage.dev](https://addpackage.dev)
- Register: [https://register.addpackage.dev](https://register.addpackage.dev)
