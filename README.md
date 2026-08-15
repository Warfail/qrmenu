# Linktree Landing

Landing page bergaya Linktree dengan Next.js 14 App Router, Tailwind CSS, MongoDB, dan QR Code.

## Prasyarat

- Node.js 18.17+ (disarankan Node.js 18.18 atau lebih baru)
- MongoDB berjalan di `localhost:27017` (atau gunakan MongoDB Atlas)

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Konfigurasi environment (`.env.local`):

   ```
   MONGODB_URI=mongodb://localhost:27017/linktree
   AUTH_SECRET=ganti-dengan-secret-acak-panjang
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

3. Jalankan seed untuk membuat akun admin dan data awal:

   ```bash
   npm run seed
   ```

   Akun admin default:
   - Username: (tidak diperlukan)
   - Password: `admin123` (ganti di `scripts/seed.js` sebelum produksi)

4. Jalankan development server:

   ```bash
   npm run dev
   ```

## Halaman

| Route | Deskripsi |
|-------|-----------|
| `/` | Redirect ke `/landing` |
| `/landing` | Landing page publik |
| `/login` | Halaman login admin |
| `/dashboard` | Dashboard admin (protected) |

## API Routes

| Method | Route | Deskripsi |
|--------|-------|-----------|
| GET | `/api/landing` | Ambil data landing page (public) |
| POST | `/api/admin/login` | Login admin |
| DELETE | `/api/admin/login` | Logout admin |
| GET | `/api/admin/dashboard` | Cek auth + ambil data (protected) |
| POST | `/api/admin/update` | Update menu & settings (protected) |
| GET | `/api/qr` | Download QR code (PNG/SVG) |
| GET | `/api/qr/preview` | Preview QR code (base64) |

## Struktur Database

### Collection: `landing`

```js
{
  _id: "main",
  menu: [{ title, link, type, icon, order }],
  settings: { title, description, whatsappNumber, googlePlaceId, avatar }
}
```

### Collection: `admins`

```js
{
  _id: "main",
  password: "hashed_password"
}
```

## Fitur

- **Landing page** menampilkan menu items dengan tipe `link` (redirect) atau `popup` (modal)
- **Google Review** button redirect ke Google Maps
- **WhatsApp form** dengan textarea dan tombol kirim
- **Admin dashboard** dengan login password
- **QR code** preview + download PNG/SVG
- **CRUD menu items** (tambah, edit, hapus, reorder)
- **Edit settings** (title, description, nomor WhatsApp, Google Place ID, avatar)