# Progress Task - UAS H635C

## 1. Ringkasan Sumber Tugas
Sumber utama: [`UAS_H635C.md`](UAS_H635C.md)

Dokumen soal menjelaskan studi kasus pengembangan ulang aplikasi mobile berbasis React Native untuk pengelolaan data mahasiswa dengan integrasi REST API dan MySQL. Fokus utama bukan sekadar CRUD, tetapi perbaikan integritas data, validasi, performa pencarian, penghapusan aman, sinkronisasi tampilan real-time setelah mutasi data, dan penjelasan alasan teknis solusi.

## 2. Tujuan Utama
Menyusun dan mengeksekusi solusi aplikasi mobile yang:
- mendukung CRUD data mahasiswa,
- mematuhi aturan bisnis,
- menampilkan perubahan data tanpa restart aplikasi,
- menyediakan pencarian cepat berdasarkan NIM atau nama,
- memiliki validasi dan error handling informatif,
- menjaga kualitas kode dan mudah dilanjutkan agent berikutnya.

## 3. Ruang Lingkup Pekerjaan
### Dalam cakupan
- Analisis masalah pada aplikasi saat ini.
- Perancangan solusi arsitektur React Native + REST API + MySQL.
- Implementasi fitur Create, Read, Update, Delete.
- Validasi input pada form dan sisi backend.
- Pencegahan NIM duplikat.
- Batas semester 1-14.
- Batas IPK 0.00-4.00.
- Pencegahan hapus mahasiswa yang punya data nilai akademik.
- Refresh/sinkronisasi data pasca tambah/ubah/hapus tanpa restart.
- Pencarian mahasiswa berdasarkan NIM atau nama.
- Error handling informatif.
- Dokumentasi alasan teknis, keputusan, asumsi, blocker, progres.

### Di luar cakupan eksplisit soal namun relevan bila workspace mendukung
- Optimisasi query/index pencarian.
- Sanitasi request dan defensive programming.
- Struktur modul reusable.
- Testing dasar/manual checklist.

## 4. Entitas Data Inti
Data mahasiswa wajib memuat:
- NIM
- Nama Mahasiswa
- Program Studi
- Semester
- IPK

Entitas tambahan implisit:
- Nilai akademik / relasi nilai mahasiswa, dipakai untuk rule delete protection.

## 5. Permasalahan yang Harus Diselesaikan
Berdasarkan [`UAS_H635C.md`](UAS_H635C.md):
1. NIM tercatat lebih dari satu kali.
2. Data mahasiswa tidak lengkap.
3. Mahasiswa yang sudah memiliki nilai akademik masih bisa dihapus.
4. Pencarian melambat saat data bertambah.
5. Aplikasi perlu lebih andal, aman, efisien.
6. Perubahan data harus langsung tampil tanpa restart aplikasi.
7. Sistem perlu validasi input dan error handling jelas.

## 6. Kebutuhan Fungsional
### F1. Create mahasiswa
- Tambah data mahasiswa baru.
- Validasi semua field wajib.
- Validasi NIM unik.
- Validasi semester integer 1-14.
- Validasi IPK numerik 0.00-4.00.
- Tampilkan pesan sukses/gagal.
- Setelah sukses, list langsung terbarui.

### F2. Read mahasiswa
- Ambil data mahasiswa dari API/database.
- Tampilkan daftar dengan informasi lengkap.
- Gunakan list yang cocok untuk banyak data, mis. FlatList.
- Tampilkan state loading, empty, error.

### F3. Update mahasiswa
- Ubah data mahasiswa.
- Validasi tetap berjalan saat edit.
- Jika NIM diubah, tetap harus unik.
- Setelah sukses, data pada daftar/detail langsung terbarui tanpa restart.

### F4. Delete mahasiswa
- Hapus mahasiswa hanya jika belum memiliki data nilai akademik.
- Jika memiliki nilai, tolak penghapusan dan tampilkan pesan informatif.
- Setelah sukses, daftar langsung terbarui.

### F5. Search mahasiswa
- Cari berdasarkan nama atau NIM.
- Responsif untuk data banyak.
- Ideal: debounce di client, filtering/query di server, index di database.

## 7. Kebutuhan Non-Fungsional
- Integritas data tinggi.
- Kode rapi, konsisten, minim duplikasi.
- UX jelas dan mudah dipahami.
- Error handling informatif.
- Aman dari input invalid.
- Performa pencarian baik saat data tumbuh.
- Mudah dilanjutkan agent berikutnya.

## 8. Aturan Bisnis Kritis
1. NIM unik global.
2. Semester hanya 1-14.
3. IPK hanya 0.00-4.00.
4. Mahasiswa dengan data nilai akademik tidak boleh dihapus.
5. Setiap mutasi data harus langsung tercermin di UI tanpa restart.
6. Pencarian wajib tersedia via nama atau NIM.

## 9. Rancangan Solusi Teknis yang Harus Diwujudkan
### Frontend React Native
- Screen daftar mahasiswa.
- Screen/form tambah-edit mahasiswa.
- Komponen pencarian.
- State management lokal atau global sesuai skala project.
- Sinkronisasi ulang data setelah mutasi via refetch/update state optimistis/invalidasi cache.
- Validasi form sebelum submit.
- Tampilan error/sukses/loading.

### Backend REST API
Endpoint minimal:
- `GET /students` untuk list + search.
- `POST /students` untuk create.
- `PUT /students/:id` atau `PATCH /students/:id` untuk update.
- `DELETE /students/:id` untuk delete dengan pengecekan nilai akademik.

Kemampuan backend:
- Validasi server-side.
- Cek NIM unik.
- Cek rule delete protection.
- Return status code dan pesan error jelas.
- Dukungan query pencarian nama/NIM.

### Database MySQL
Tabel minimal yang diharapkan:
- `students`
- `academic_scores` atau padanan untuk rule delete

Constraint/struktur yang disarankan:
- Unique index pada kolom `nim`.
- Index pada `nim` dan `nama`/`name` untuk pencarian.
- Foreign key relasi nilai ke mahasiswa.

## 10. Prioritas Eksekusi
### Prioritas 1 - Fondasi analisis dan roadmap
- Selesaikan analisis kebutuhan.
- Buat dokumen progres operasional ini.
- Catat ruang lingkup, batch, dependensi, asumsi, blocker.

### Prioritas 2 - Audit workspace
- Identifikasi struktur project yang tersedia.
- Temukan frontend, backend, database schema, config, dependency file.
- Verifikasi apakah sudah ada codebase atau hanya file soal.

### Prioritas 3 - Implementasi backend/data layer
- Skema data/constraint.
- Endpoint CRUD.
- Search.
- Validasi.
- Rule delete protection.

### Prioritas 4 - Implementasi frontend
- List + search.
- Form create/edit.
- Delete action.
- Refresh data pasca mutasi.
- Error/loading states.

### Prioritas 5 - Verifikasi dan polishing
- Uji alur CRUD.
- Uji validation and business rules.
- Rapikan kode.
- Dokumentasikan alasan teknis.

## 11. Batch Kerja Operasional
### Batch A - Analisis soal dan roadmap
Status: selesai
Output:
- analisis kebutuhan
- pemetaan task
- dokumen progres awal

### Batch B - Audit workspace dan penentuan titik implementasi
Status: selesai
Tujuan:
- cek apakah repo berisi project React Native/API/MySQL atau belum
- identifikasi file manifest, source, schema, env
Deliverable:
- daftar file relevan
- keputusan area implementasi berikutnya
Hasil audit:
- workspace hanya berisi [`UAS_H635C.md`](UAS_H635C.md) dan [`progress-task.md`](progress-task.md)
- tidak ditemukan source React Native, backend REST API, schema MySQL, file manifest, atau file konfigurasi project
- implementasi teknis riil tidak dapat dilanjutkan pada workspace saat ini tanpa codebase atau instruksi membuat project baru

### Batch C - Desain implementasi detail sesuai codebase aktual
Status: selesai
Dependensi:
- Batch B selesai
Deliverable:
- mapping file yang akan diubah
- strategy minimal diff
Hasil desain:
- dipilih arsitektur baru karena workspace awal kosong
- [`mobile-app`](mobile-app) dibuat sebagai aplikasi Expo React Native
- [`backend`](backend) dibuat sebagai REST API Express + MySQL
- [`backend/sql/schema.sql`](backend/sql/schema.sql) menjadi sumber schema database dan seed awal

### Batch D - Implementasi prioritas tertinggi
Status: in progress
Dependensi:
- Batch C
Kemungkinan isi:
- backend validation + endpoint
- frontend list/form/search
- live refresh after mutation
Progres saat ini:
- backend dasar selesai dibuat: package, server, db pool, routes, controller, service, error helper, env example, schema, README
- frontend Expo dasar selesai dibuat: package, app router layout, screen utama, komponen form, komponen card, hook debounce, API service, konstanta, app config, README
- fitur yang sudah tercakup di kode: create, read, update, delete, search, validasi client/server, proteksi hapus via backend, refresh data pasca mutasi
- verifikasi install dependency dan run app belum dijalankan

### Batch E - Validasi hasil dan finalisasi
Status: in progress
Dependensi:
- Batch D
Deliverable:
- hasil uji
- status akhir tiap fitur
- catatan lanjutan
Hasil validasi saat ini:
- dependency [`backend/package.json`](backend/package.json) sudah di-install
- schema [`backend/sql/schema.sql`](backend/sql/schema.sql) berhasil di-import ke MySQL
- cek syntax backend via [`node --check src/server.js`](backend/src/server.js:1) lulus
- uji endpoint health, list, create, update, delete protection, dan delete sukses via API lokal
- dependency [`mobile-app/package.json`](mobile-app/package.json) sudah di-install
- [`npx expo-doctor`](mobile-app/package.json) lulus 17/17 checks setelah peer dependency dilengkapi
- uji runtime UI Expo di device/emulator belum dijalankan dari sesi ini

## 12. Dependensi Antartugas
- Analisis soal -> wajib sebelum desain solusi.
- Audit workspace -> wajib sebelum edit code karena struktur repo belum diketahui.
- Struktur backend/database -> mempengaruhi frontend form, search, delete rule.
- API contract -> harus stabil sebelum final wiring frontend.
- Refresh strategy UI -> tergantung arsitektur state/data fetching yang ada.

## 13. Asumsi Kerja Saat Ini
1. Workspace kini memuat codebase baru pada [`mobile-app`](mobile-app) dan [`backend`](backend) selain [`UAS_H635C.md`](UAS_H635C.md) dan [`progress-task.md`](progress-task.md).
2. Implementasi mengikuti requirement eksplisit soal: React Native, REST API, dan MySQL.
3. Expo dipilih untuk mobile app agar setup dan debugging lebih mudah.
4. Dokumen ini menjadi sumber konteks utama lintas agent.

## 14. Kendala / Blocker Saat Ini
- Runtime UI Expo pada device/emulator belum diuji langsung dari sesi ini.
- Aplikasi mobile masih mengarah ke `http://192.168.1.2:3000/api`, jadi device pengujian harus dapat mengakses host itu.
- Dependency mobile masih memiliki advisory vulnerability dari upstream package, namun [`npx expo-doctor`](mobile-app/package.json) lulus.
- Proses push ke remote git bergantung pada autentikasi git/GitHub yang tersedia pada environment pengguna.
- Percobaan push pertama gagal karena branch aktif masih `master` saat perintah push diarahkan ke `main`.

## 15. Keputusan Penting
- Dokumen [`progress-task.md`](progress-task.md) ditetapkan sebagai source of truth progres.
- Karena soal eksplisit meminta React Native, REST API, dan MySQL, implementasi mengikuti stack itu secara penuh.
- Expo dipilih untuk frontend agar mudah dijalankan dan di-debug.
- Backend dipilih memakai Express + mysql2 untuk REST API ringan dan langsung kompatibel dengan MySQL.
- Validasi ditempatkan di frontend dan backend.
- Schema database menyertakan unique constraint NIM, check semester/IPK, relasi nilai akademik, dan index pencarian.
- Pemeriksaan git status tidak dapat dijalankan karena workspace ini bukan repository git.
- Setiap pekerjaan yang selesai wajib langsung diperbarui statusnya di [`progress-task.md`](progress-task.md) dan ditambahkan entry baru pada bagian log progres.

## 16. Checklist Progres Global
- [x] Baca menyeluruh [`UAS_H635C.md`](UAS_H635C.md)
- [x] Ekstrak kebutuhan fungsional dan non-fungsional
- [x] Susun roadmap kerja utama di [`progress-task.md`](progress-task.md)
- [x] Audit isi workspace selain [`UAS_H635C.md`](UAS_H635C.md)
- [x] Identifikasi file implementasi frontend
- [x] Identifikasi file implementasi backend
- [x] Identifikasi schema/database layer
- [x] Implementasi CRUD sesuai aturan bisnis
- [x] Implementasi search nama/NIM
- [x] Implementasi refresh UI tanpa restart
- [x] Implementasi error handling informatif
- [x] Uji alur create/read/update/delete
- [x] Uji aturan bisnis delete protection
- [ ] Uji validasi NIM/semester/IPK
- [x] Dokumentasikan alasan teknis final

## 17. Status Detail per Bagian
| Bagian | Status | Catatan |
|---|---|---|
| Analisis kebutuhan | Selesai | Kebutuhan sudah diekstrak dari soal |
| Roadmap progres | Selesai | Dokumen ini dibuat sebagai acuan utama |
| Audit workspace | Selesai | Hanya ditemukan [`UAS_H635C.md`](UAS_H635C.md) dan [`progress-task.md`](progress-task.md) |
| Desain implementasi detail | Selesai | Arsitektur Expo + Express + MySQL sudah dipilih dan dipetakan |
| Implementasi backend | Selesai | API utama, validasi, rule delete, schema, seed, dan env sudah berjalan |
| Implementasi frontend | Selesai | Struktur Expo dan UI CRUD utama sudah dibuat dan dependency tervalidasi |
| Pengujian | In progress | API sudah diuji, runtime UI Expo di device/emulator belum diuji |
| Dokumentasi teknis final | In progress | Roadmap memuat alasan teknis, status implementasi, hasil validasi, dan log tambahan |

## 18. Konteks yang Harus Dipertahankan untuk Agent Berikutnya
- Soal menuntut hasil berbasis React Native + REST API + MySQL, bukan sekadar analisis teoritis.
- Business rules inti: NIM unik, semester 1-14, IPK 0.00-4.00, mahasiswa bernilai tidak boleh dihapus.
- Pencarian harus berbasis nama atau NIM.
- Perubahan CRUD harus langsung terlihat tanpa restart aplikasi.
- Rubrik menilai analisis, desain solusi, implementasi create, read, update, dan kualitas kode.
- Codebase baru sudah dibuat langsung di workspace sesuai requirement soal.
- Fokus berikutnya: install dependency, verifikasi koneksi DB, lalu uji alur end-to-end.

## 19. Langkah Berikutnya Paling Dekat
1. Perbaiki branch git lokal ke `main`, lalu ulangi push ke remote `https://github.com/bayufrd/mobile-app-expo.git`.
2. Jalankan backend via `npm run dev` di [`backend`](backend).
3. Jalankan Expo via `npm run start` di [`mobile-app`](mobile-app).
4. Uji aplikasi mobile dari device/emulator pada jaringan yang bisa akses `192.168.1.2:3000`.
5. Tambahkan uji eksplisit untuk validasi NIM duplikat, semester invalid, dan IPK invalid dari UI/API.

## 20. Log Progres
### 2026-07-15
- Membaca [`UAS_H635C.md`](UAS_H635C.md).
- Mengidentifikasi studi kasus, aturan bisnis, kebutuhan fitur, dan rubrik penilaian.
- Menyusun [`progress-task.md`](progress-task.md) sebagai roadmap utama dan sumber konteks berkelanjutan.
- Mengaudit workspace dan memastikan kondisi awal hanya memuat [`UAS_H635C.md`](UAS_H635C.md) dan [`progress-task.md`](progress-task.md).
- Menjalankan `git status --short` dan terkonfirmasi workspace bukan repository git.
- Membuat codebase baru: [`backend`](backend) dan [`mobile-app`](mobile-app).
- Menambahkan REST API Express + MySQL, schema database, seed data, dan dokumentasi backend.
- Menambahkan aplikasi Expo React Native dengan layar utama CRUD, pencarian debounce, form validasi, dan refresh data pasca mutasi.
- Install dependency backend berhasil via `npm install`.
- Import schema MySQL berhasil ke host `192.168.1.2:3307`.
- Validasi backend berhasil via `npm run check`.
- Uji endpoint API berhasil untuk health, read, create, update, delete protection, dan delete valid.
- Install dependency mobile berhasil via `npm install` dan tambahan peer dependency via `npx expo install expo-font expo-constants expo-linking react-native-screens`.
- Validasi project Expo berhasil via `npx expo-doctor` dengan hasil 17/17 checks passed.
- Menambahkan [`README.md`](README.md) root untuk setup proyek, struktur, verifikasi, dan workflow git.
- Memperbarui [`.gitignore`](backend/.gitignore) dan [`.gitignore`](mobile-app/.gitignore) sesuai kebutuhan masing-masing app.
- Menetapkan aturan dokumentasi bahwa setiap pekerjaan selesai wajib diikuti update status dan log pada [`progress-task.md`](progress-task.md).
- Inisialisasi git lokal berhasil dan commit awal berhasil dibuat dengan pesan `feat: build Expo mobile app and MySQL REST API`.
- Push pertama ke remote gagal karena branch `main` belum terbentuk saat perintah push dijalankan.
