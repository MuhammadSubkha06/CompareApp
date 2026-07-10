# Setup Backend (Next.js + SQL Server)

## 1. Install dependency
```bash
npm install
```

## 2. Siapkan database
1. Buat database baru di SQL Server (misal: `CompareAppDb`).
2. Jalankan script `sql/schema.sql` di database tersebut (lewat SSMS / Azure Data Studio / sqlcmd) untuk membuat tabel `CompareSession`.

## 3. Konfigurasi koneksi database
Copy `.env.example` menjadi `.env` lalu sesuaikan:
```
DB_USER=sa
DB_PASSWORD=YourPassword123
DB_SERVER=localhost
DB_PORT=1433
DB_DATABASE=CompareAppDb
```

## 4. Jalankan server
```bash
npm run dev
```
Backend berjalan di `http://localhost:3000`.

## Struktur endpoint
| Method | Endpoint                          | Fungsi                                   |
|--------|------------------------------------|-------------------------------------------|
| POST   | /api/compare/upload                | Upload & preview 1 file (CSV/Excel)       |
| POST   | /api/compare                       | Jalankan compare penuh + simpan History   |
| GET    | /api/history                       | Daftar riwayat compare                    |
| GET    | /api/history/:id                   | Detail 1 riwayat compare                  |
| GET    | /api/history/:id/export?format=csv | Export hasil compare (csv/xlsx)           |
| GET    | /api/dashboard                     | Ringkasan statistik untuk Dashboard       |
