# UAS Pemrograman Mobile - Manajemen Mahasiswa

Implementasi tugas [`UAS_H635C.md`](UAS_H635C.md) dalam bentuk:
- aplikasi mobile Expo React Native di [`mobile-app`](mobile-app)
- REST API Express + MySQL di [`backend`](backend)

## Stack
- Mobile: Expo + React Native + Expo Router
- API: Express
- Database: MySQL

## Struktur
- [`mobile-app`](mobile-app): aplikasi mobile
- [`backend`](backend): REST API
- [`backend/sql/schema.sql`](backend/sql/schema.sql): schema database + seed awal
- [`progress-task.md`](progress-task.md): roadmap, status, keputusan, dan log progres

## Fitur
- CRUD data mahasiswa
- Pencarian berdasarkan NIM atau nama
- Validasi NIM unik
- Validasi semester 1-14
- Validasi IPK 0.00-4.00
- Proteksi hapus jika mahasiswa sudah punya nilai akademik
- Refresh data setelah create/update/delete tanpa restart app
- Error handling informatif

## Setup Backend
1. Masuk ke [`backend`](backend)
2. Install dependency:
   `npm install`
3. Copy env:
   `cp .env.example .env`
4. Import database dari [`schema.sql`](backend/sql/schema.sql)
5. Jalankan API:
   `npm run dev`

Default database pada [`.env.example`](backend/.env.example):
- host: `192.168.1.2`
- port: `3307`
- user: `root`
- password: `0202`
- database: `uas_mobile_students`

## Setup Mobile App
1. Masuk ke [`mobile-app`](mobile-app)
2. Install dependency:
   `npm install`
3. Jalankan Expo:
   `npm run start`

Base URL API ada di [`API_BASE_URL`](mobile-app/constants/api.js:1).

## Verifikasi yang Sudah Dilakukan
- Import schema MySQL sukses dari [`backend/sql/schema.sql`](backend/sql/schema.sql)
- Check backend sukses via [`node --check src/server.js`](backend/src/server.js:1)
- Uji endpoint health/list/create/update/delete protection/delete sukses
- Check Expo sukses via `npx expo-doctor` dengan hasil 17/17

## Catatan Jaringan
Aplikasi mobile memakai URL `http://192.168.1.2:3000/api` pada [`API_BASE_URL`](mobile-app/constants/api.js:1).
Device atau emulator harus bisa mengakses host itu.

## Git Workflow
Remote target:
`https://github.com/bayufrd/mobile-app-expo.git`

Urutan kerja:
1. `git init`
2. `git remote add origin https://github.com/bayufrd/mobile-app-expo.git`
3. `git add .`
4. `git commit -m "feat: build Expo mobile app and MySQL REST API"`
5. `git branch -M main`
6. `git push -u origin main`

## Dokumentasi Progres
Semua progres utama wajib diperbarui di [`progress-task.md`](progress-task.md), termasuk status, keputusan, blocker, next step, dan log progres.