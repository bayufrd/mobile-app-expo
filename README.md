# Student Management Mobile App

Aplikasi ini adalah solusi mobile untuk pengelolaan data mahasiswa dan nilai akademik.

Terdiri dari 2 app:
- [`mobile-app`](mobile-app): aplikasi mobile berbasis Expo + React Native
- [`backend`](backend): REST API berbasis Express + MySQL

## Fungsi App
- CRUD data mahasiswa
- Pencarian mahasiswa berdasarkan NIM atau nama
- Validasi NIM unik
- Validasi semester `1-14`
- Validasi IPK `0.00-4.00`
- Proteksi hapus mahasiswa jika sudah punya nilai akademik
- Kelola nilai akademik per mahasiswa
- Riwayat nilai akademik per mahasiswa
- Refresh data tanpa restart aplikasi setelah create/update/delete/create score
- Error handling informatif pada mobile dan backend

## Stack
### Mobile
- [`Expo`](mobile-app/package.json:14)
- [`React Native`](mobile-app/package.json:21)
- [`React`](mobile-app/package.json:20)
- [`Expo Router`](mobile-app/package.json:18)
- [`expo-constants`](mobile-app/package.json:15)
- [`expo-font`](mobile-app/package.json:16)
- [`expo-linking`](mobile-app/package.json:17)
- [`react-native-safe-area-context`](mobile-app/package.json:22)
- [`react-native-screens`](mobile-app/package.json:23)

### Backend
- [`Express`](backend/package.json:14)
- [`mysql2`](backend/package.json:15)
- [`cors`](backend/package.json:12)
- [`dotenv`](backend/package.json:13)

### Database
- MySQL

## Struktur Folder
```text
.
├── README.md
├── backend
│   ├── .env.example
│   ├── package.json
│   ├── sql
│   │   └── schema.sql
│   └── src
│       ├── config
│       ├── controllers
│       ├── db
│       ├── middleware
│       ├── routes
│       ├── services
│       ├── utils
│       └── server.js
└── mobile-app
    ├── app
    │   ├── _layout.js
    │   ├── index.js
    │   └── students
    │       └── [id]
    │           └── scores.js
    ├── assets
    ├── components
    ├── constants
    ├── hooks
    ├── services
    ├── app.json
    ├── babel.config.js
    └── package.json
```

## Mapping Folder dan Tanggung Jawab
### Backend
- [`backend/src/server.js`](backend/src/server.js): bootstrap Express, routing utama, error response
- [`backend/src/db/mysql.js`](backend/src/db/mysql.js): koneksi pool MySQL
- [`backend/src/routes/studentRoutes.js`](backend/src/routes/studentRoutes.js): route mahasiswa dan nilai
- [`backend/src/controllers/studentController.js`](backend/src/controllers/studentController.js): handler request/response
- [`backend/src/services/studentService.js`](backend/src/services/studentService.js): business logic mahasiswa dan nilai
- [`backend/src/utils/httpError.js`](backend/src/utils/httpError.js): helper error HTTP
- [`backend/sql/schema.sql`](backend/sql/schema.sql): schema tabel + seed data awal

### Mobile
- [`mobile-app/app/_layout.js`](mobile-app/app/_layout.js): konfigurasi stack navigation
- [`mobile-app/app/index.js`](mobile-app/app/index.js): layar utama daftar mahasiswa, search, CRUD
- [`mobile-app/app/students/[id]/scores.js`](mobile-app/app/students/[id]/scores.js): layar kelola nilai akademik
- [`mobile-app/components/StudentCard.js`](mobile-app/components/StudentCard.js): kartu mahasiswa + aksi edit/hapus/kelola nilai
- [`mobile-app/components/StudentForm.js`](mobile-app/components/StudentForm.js): modal form tambah/edit mahasiswa
- [`mobile-app/services/studentApi.js`](mobile-app/services/studentApi.js): request API mobile
- [`mobile-app/constants/api.js`](mobile-app/constants/api.js): base URL API dan default form
- [`mobile-app/hooks/useDebouncedValue.js`](mobile-app/hooks/useDebouncedValue.js): debounce pencarian
- [`mobile-app/app.json`](mobile-app/app.json): konfigurasi Expo dan `apiBaseUrl`

## Fitur yang Sudah Diterapkan
### Manajemen Mahasiswa
- Tambah mahasiswa
- Lihat daftar mahasiswa
- Edit mahasiswa
- Hapus mahasiswa
- Search nama/NIM
- Refresh otomatis setelah mutasi data

### Manajemen Nilai Akademik
- Akses dari tombol [`Kelola Nilai`](mobile-app/components/StudentCard.js:19)
- Navigasi ke layar [`students/[id]/scores`](mobile-app/app/_layout.js:22)
- Lihat riwayat nilai per mahasiswa
- Tambah nilai akademik per mahasiswa
- Validasi mata kuliah dan skor `0-100`

### Validasi dan Business Rules
- NIM wajib unik
- Semester hanya `1-14`
- IPK hanya `0.00-4.00`
- Mahasiswa dengan nilai akademik tidak bisa dihapus
- Score hanya bisa memakai mata kuliah valid

## Kebutuhan Sistem
### Minimum
- Node.js 18+ atau 20+
- npm
- MySQL Server
- Expo Go atau Android Emulator/iOS Simulator

### Environment Backend
Salin [`backend/.env.example`](backend/.env.example) menjadi [`.env`](backend/.env.example), lalu isi sesuai server MySQL.

Isi default contoh:
```env
PORT=3000
DB_HOST=192.168.1.2
DB_PORT=3307
DB_USER=root
DB_PASSWORD=0202
DB_NAME=uas_mobile_students
```

Arti variabel:
- `PORT`: port REST API
- `DB_HOST`: host MySQL
- `DB_PORT`: port MySQL
- `DB_USER`: username MySQL
- `DB_PASSWORD`: password MySQL
- `DB_NAME`: nama database

## Instalasi Backend
1. Masuk ke folder [`backend`](backend).
2. Install dependency.
3. Copy file env.
4. Import schema database.
5. Jalankan API.

Command:
```bash
cd backend
npm install
cp .env.example .env
```

Import database dari [`backend/sql/schema.sql`](backend/sql/schema.sql):
```bash
mysql -h 192.168.1.2 -P 3307 -u root -p uas_mobile_students < ./backend/sql/schema.sql
```

Jalankan backend mode development:
```bash
cd backend
npm run dev
```

Jalankan backend mode biasa:
```bash
cd backend
npm run start
```

Check syntax backend:
```bash
cd backend
npm run check
```

## Instalasi Mobile App
1. Masuk ke folder [`mobile-app`](mobile-app).
2. Install dependency.
3. Jalankan Expo.
4. Buka dari Expo Go atau emulator.

Command:
```bash
cd mobile-app
npm install --legacy-peer-deps
npm run start
```

Shortcut run:
```bash
cd mobile-app
npm run android
npm run ios
npm run web
```

## Konfigurasi Endpoint Mobile
Base URL mobile dibaca dari:
- [`mobile-app/app.json`](mobile-app/app.json:28)
- fallback di [`mobile-app/constants/api.js`](mobile-app/constants/api.js:3)

Default sekarang:
- [`apiBaseUrl`](mobile-app/app.json:29) = `https://l5x6nfnr-3000.asse.devtunnels.ms/api`
- [`API_BASE_URL`](mobile-app/constants/api.js:8) akan memangkas trailing slash otomatis

### Cara ganti endpoint mobile
Ubah nilai [`apiBaseUrl`](mobile-app/app.json:29).

Contoh lokal LAN:
```json
"extra": {
  "apiBaseUrl": "http://192.168.1.2:3000/api"
}
```

Contoh dev tunnel:
```json
"extra": {
  "apiBaseUrl": "https://your-tunnel-url/api"
}
```

Setelah ubah endpoint:
1. Stop Metro/Expo.
2. Jalankan ulang [`npm run start`](mobile-app/package.json:7).
3. Reload app di device.

## Menjalankan via Device dalam Jaringan Lokal
Pakai jika HP dan server ada di Wi-Fi sama.

Syarat:
- MySQL bisa diakses backend
- Backend jalan di port [`3000`](backend/.env.example:1)
- HP bisa akses IP host backend
- [`apiBaseUrl`](mobile-app/app.json:29) diarahkan ke `http://IP_HOST:3000/api`

Contoh:
```json
"apiBaseUrl": "http://192.168.1.2:3000/api"
```

## Menjalankan via Dev Tunnel
Pakai jika device tidak bisa akses IP lokal.

Langkah:
1. Jalankan backend lokal di [`backend`](backend).
2. Expose port `3000` memakai dev tunnel/tool tunneling pilihan.
3. Ambil URL HTTPS tunnel.
4. Set URL itu ke [`apiBaseUrl`](mobile-app/app.json:29).
5. Jalankan ulang Expo di [`mobile-app`](mobile-app).

Contoh aktif saat ini:
```text
https://l5x6nfnr-3000.asse.devtunnels.ms/api
```

## Alur API
### Endpoint Mahasiswa
- `GET /health`
- `GET /api/students`
- `GET /api/students/:id`
- `POST /api/students`
- `PUT /api/students/:id`
- `DELETE /api/students/:id`

### Endpoint Nilai Akademik
- `GET /api/students/:id/scores`
- `POST /api/students/:id/scores`

## Contoh Payload
### Tambah Mahasiswa
```json
{
  "nim": "H635C001",
  "name": "Bayu Ferdian",
  "studyProgram": "Teknik Informatika",
  "semester": 6,
  "gpa": 3.52
}
```

### Tambah Nilai Akademik
```json
{
  "courseName": "Kecerdasan Buatan",
  "score": 89.5
}
```

## Pengujian yang Sudah Dilakukan
### Backend
- Syntax check lulus via [`npm run check`](backend/package.json:9)
- Health check lulus
- CRUD mahasiswa lulus
- Validasi duplicate NIM lulus
- Validasi semester lulus
- Validasi IPK lulus
- Delete protection lulus
- List nilai akademik lulus
- Tambah nilai akademik lulus

### Mobile/Expo
- Dependency sudah disesuaikan ke [`Expo SDK 54`](mobile-app/package.json:14)
- Validasi dependency lulus via `npx expo-doctor`
- Routing nilai sudah ditambahkan pada [`mobile-app/app/_layout.js`](mobile-app/app/_layout.js)
- Integrasi API mobile untuk mahasiswa dan nilai sudah terpasang di [`studentApi`](mobile-app/services/studentApi.js)

## Langkah Uji Manual yang Disarankan
1. Jalankan backend.
2. Jalankan Expo.
3. Buka app di device/emulator.
4. Pastikan daftar mahasiswa muncul.
5. Tambah mahasiswa baru.
6. Edit mahasiswa.
7. Hapus mahasiswa tanpa nilai.
8. Coba hapus mahasiswa yang punya nilai, pastikan ditolak.
9. Pakai search berdasarkan nama dan NIM.
10. Tekan [`Kelola Nilai`](mobile-app/components/StudentCard.js:19).
11. Pastikan riwayat nilai tampil.
12. Tambah nilai baru.
13. Pastikan list refresh tanpa restart.

## Troubleshooting
### Mobile tidak bisa connect ke API
Periksa:
- backend sudah jalan
- port backend benar
- host/IP benar
- device bisa akses host backend
- [`apiBaseUrl`](mobile-app/app.json:29) benar
- Expo sudah direstart setelah ganti endpoint

### Error MySQL connection
Periksa:
- MySQL server aktif
- host, port, user, password, database di [`.env`](backend/.env.example) sesuai
- database [`uas_mobile_students`](backend/.env.example:6) sudah ada atau terbuat saat import schema

### Error Metro/Babel preset
Dependency mobile sudah memakai [`babel-preset-expo`](mobile-app/package.json:26). Jika ada error dependency, jalankan ulang:
```bash
cd mobile-app
npm install --legacy-peer-deps
```

## Git Remote
Repository remote:
```text
https://github.com/bayufrd/mobile-app-expo.git
```

## Ringkasan Solusi
App ini membangun solusi mobile CRUD mahasiswa berbasis [`Expo`](mobile-app/package.json:14) yang terhubung ke REST API [`Express`](backend/package.json:14) dan database MySQL. Solusi sudah mencakup validasi data inti, pencarian, proteksi integritas data saat delete, serta manajemen nilai akademik per mahasiswa dari UI mobile.