# Requirements Document

## Introduction

Fitur ini bertujuan untuk mengganti semua data hardcoded (mock data) di halaman public dan admin dengan data real dari database PostgreSQL melalui Prisma ORM dan API endpoints yang sudah ada. Selain itu, fitur ini mengaktifkan proteksi middleware authentication untuk route admin dan company, menghapus fallback mock auth, serta menambahkan loading states dan error handling yang proper di seluruh halaman yang terpengaruh.

## Glossary

- **Sistem**: Aplikasi web Transport Rinjani berbasis Next.js 16 App Router
- **Halaman_Public**: Halaman-halaman yang dapat diakses tanpa autentikasi (routes, homepage sections)
- **Halaman_Admin**: Halaman-halaman dashboard admin yang memerlukan autentikasi (admin/*)
- **Prisma_Client**: Instance Prisma ORM yang terhubung ke database PostgreSQL
- **API_Admin**: Endpoint REST API di /api/admin/* yang sudah tersedia
- **Server_Component**: React Server Component yang dapat melakukan data fetching langsung di server
- **Client_Component**: React Client Component yang melakukan data fetching via API calls
- **Middleware_Auth**: Middleware Next.js yang memproteksi route berdasarkan session/JWT
- **Loading_State**: Komponen UI yang ditampilkan selama proses pengambilan data
- **Error_State**: Komponen UI yang ditampilkan ketika pengambilan data gagal

## Requirements

### Requirement 1: Halaman Public Routes Mengambil Data dari Database

**User Story:** Sebagai pengunjung website, saya ingin melihat daftar rute transfer yang tersedia dari database, sehingga saya mendapatkan informasi rute yang selalu up-to-date.

#### Acceptance Criteria

1. WHEN halaman /routes dimuat, THE Sistem SHALL mengambil data rute aktif dari database menggunakan Prisma_Client di Server_Component
2. WHEN data rute berhasil diambil, THE Sistem SHALL menampilkan setiap rute dengan informasi title, from, to, duration, priceFrom, currency, dan transferType
3. IF pengambilan data rute gagal, THEN THE Sistem SHALL menampilkan Error_State dengan pesan error yang informatif dan opsi untuk retry
4. WHILE data rute sedang dimuat, THE Sistem SHALL menampilkan Loading_State berupa skeleton placeholder

### Requirement 2: Komponen Popular Routes Mengambil Data dari Database

**User Story:** Sebagai pengunjung homepage, saya ingin melihat rute-rute populer yang berasal dari database, sehingga informasi harga dan ketersediaan selalu akurat.

#### Acceptance Criteria

1. WHEN komponen PopularRoutes dirender, THE Sistem SHALL mengambil data rute populer dari database melalui Server_Component atau API endpoint /api/routes
2. WHEN data populer routes berhasil diambil, THE Sistem SHALL menampilkan maksimum 5 rute dengan informasi from, to, duration, harga, dan ikon tipe transfer
3. IF pengambilan data populer routes gagal, THEN THE Sistem SHALL menampilkan Error_State tanpa merusak rendering halaman lainnya

### Requirement 3: Komponen Popular Destinations Mengambil Data dari Database

**User Story:** Sebagai pengunjung homepage, saya ingin melihat destinasi populer yang berasal dari database, sehingga destinasi yang ditampilkan sesuai dengan yang tersedia di sistem.

#### Acceptance Criteria

1. WHEN komponen PopularDestinations dirender, THE Sistem SHALL mengambil data lokasi aktif dari database menggunakan Prisma_Client
2. WHEN data lokasi berhasil diambil, THE Sistem SHALL menampilkan lokasi dengan informasi nama, slug, dan tipe lokasi
3. IF pengambilan data lokasi gagal, THEN THE Sistem SHALL menampilkan Error_State tanpa merusak rendering halaman lainnya

### Requirement 4: Komponen Company Showcase Mengambil Data dari Database

**User Story:** Sebagai pengunjung homepage, saya ingin melihat daftar operator transport yang berasal dari database, sehingga informasi perusahaan selalu terkini.

#### Acceptance Criteria

1. WHEN komponen CompanyShowcase dirender, THE Sistem SHALL mengambil data perusahaan aktif dari database menggunakan Prisma_Client
2. WHEN data perusahaan berhasil diambil, THE Sistem SHALL menampilkan setiap perusahaan dengan informasi nama, deskripsi, rating, jumlah review, dan status verifikasi
3. IF pengambilan data perusahaan gagal, THEN THE Sistem SHALL menampilkan Error_State tanpa merusak rendering halaman lainnya

### Requirement 5: Komponen FAQ Preview Mengambil Data dari Database

**User Story:** Sebagai pengunjung homepage, saya ingin melihat FAQ yang berasal dari database, sehingga konten FAQ selalu sesuai dengan yang dikelola admin.

#### Acceptance Criteria

1. WHEN komponen FAQPreview dirender, THE Sistem SHALL mengambil data FAQ aktif dari database melalui Prisma_Client atau API endpoint /api/faqs
2. WHEN data FAQ berhasil diambil, THE Sistem SHALL menampilkan maksimum 4 FAQ dengan question dan answer yang sesuai locale pengguna
3. IF pengambilan data FAQ gagal, THEN THE Sistem SHALL menampilkan Error_State tanpa merusak rendering halaman lainnya

### Requirement 6: Halaman Admin Dashboard Mengambil Data dari API

**User Story:** Sebagai admin, saya ingin melihat statistik dan booking terbaru dari database, sehingga saya dapat memantau performa platform secara real-time.

#### Acceptance Criteria

1. WHEN halaman admin dashboard dimuat, THE Sistem SHALL mengambil data statistik dan booking terbaru dari API_Admin endpoint /api/admin/dashboard
2. WHEN data dashboard berhasil diambil, THE Sistem SHALL menampilkan statistik total bookings, pending bookings, today departures, dan total revenue
3. WHEN data dashboard berhasil diambil, THE Sistem SHALL menampilkan tabel recent bookings dengan data dari database
4. IF pengambilan data dashboard gagal, THEN THE Sistem SHALL menampilkan Error_State dengan pesan error
5. WHILE data dashboard sedang dimuat, THE Sistem SHALL menampilkan Loading_State berupa skeleton cards dan skeleton table

### Requirement 7: Halaman Admin Bookings Mengambil Data dari API

**User Story:** Sebagai admin, saya ingin melihat dan mengelola semua booking dari database, sehingga saya dapat memproses dan memantau booking secara akurat.

#### Acceptance Criteria

1. WHEN halaman admin bookings dimuat, THE Sistem SHALL mengambil data bookings dari API_Admin endpoint /api/admin/bookings
2. WHEN data bookings berhasil diambil, THE Sistem SHALL menampilkan tabel bookings dengan data code, customer, route, date, pax, total, status, dan payment
3. WHEN admin menggunakan filter status atau payment, THE Sistem SHALL mengambil data bookings yang sudah terfilter dari API_Admin
4. WHEN admin menggunakan search, THE Sistem SHALL mengambil data bookings berdasarkan booking code atau nama customer dari API_Admin
5. IF pengambilan data bookings gagal, THEN THE Sistem SHALL menampilkan Error_State dengan pesan error
6. WHILE data bookings sedang dimuat, THE Sistem SHALL menampilkan Loading_State berupa skeleton table

### Requirement 8: Halaman Admin Routes Mengambil Data dari API

**User Story:** Sebagai admin, saya ingin melihat dan mengelola semua rute transfer dari database, sehingga saya dapat mengupdate informasi rute yang tersedia.

#### Acceptance Criteria

1. WHEN halaman admin routes dimuat, THE Sistem SHALL mengambil data routes dari API_Admin endpoint /api/admin/routes
2. WHEN data routes berhasil diambil, THE Sistem SHALL menampilkan tabel routes dengan data title, slug, type, duration, dan status
3. IF pengambilan data routes gagal, THEN THE Sistem SHALL menampilkan Error_State dengan pesan error
4. WHILE data routes sedang dimuat, THE Sistem SHALL menampilkan Loading_State berupa skeleton table

### Requirement 9: Halaman Admin Locations Mengambil Data dari API

**User Story:** Sebagai admin, saya ingin melihat dan mengelola semua lokasi dari database, sehingga saya dapat mengupdate informasi lokasi yang tersedia.

#### Acceptance Criteria

1. WHEN halaman admin locations dimuat, THE Sistem SHALL mengambil data locations dari API_Admin endpoint /api/admin/locations
2. WHEN data locations berhasil diambil, THE Sistem SHALL menampilkan tabel locations dengan data name, slug, type, region, dan status
3. IF pengambilan data locations gagal, THEN THE Sistem SHALL menampilkan Error_State dengan pesan error
4. WHILE data locations sedang dimuat, THE Sistem SHALL menampilkan Loading_State berupa skeleton table

### Requirement 10: Halaman Admin Companies Mengambil Data dari API

**User Story:** Sebagai admin, saya ingin melihat dan mengelola semua operator transport dari database, sehingga saya dapat memverifikasi dan mengupdate informasi perusahaan.

#### Acceptance Criteria

1. WHEN halaman admin companies dimuat, THE Sistem SHALL mengambil data companies dari API_Admin endpoint /api/admin/companies
2. WHEN data companies berhasil diambil, THE Sistem SHALL menampilkan card companies dengan data name, email, rating, reviews, verified status, dan active status
3. IF pengambilan data companies gagal, THEN THE Sistem SHALL menampilkan Error_State dengan pesan error
4. WHILE data companies sedang dimuat, THE Sistem SHALL menampilkan Loading_State berupa skeleton cards

### Requirement 11: Halaman Admin Schedules Mengambil Data dari API

**User Story:** Sebagai admin, saya ingin melihat dan mengelola jadwal keberangkatan dari database, sehingga saya dapat mengupdate ketersediaan jadwal.

#### Acceptance Criteria

1. WHEN halaman admin schedules dimuat, THE Sistem SHALL mengambil data schedules dari API_Admin endpoint /api/admin/schedules
2. WHEN data schedules berhasil diambil, THE Sistem SHALL menampilkan tabel schedules dengan data operator, route, departure, arrival, days, dan status
3. IF pengambilan data schedules gagal, THEN THE Sistem SHALL menampilkan Error_State dengan pesan error
4. WHILE data schedules sedang dimuat, THE Sistem SHALL menampilkan Loading_State berupa skeleton table

### Requirement 12: Middleware Authentication Aktif untuk Route Admin

**User Story:** Sebagai pemilik platform, saya ingin route admin terproteksi oleh autentikasi, sehingga hanya pengguna yang terautentikasi yang dapat mengakses halaman admin.

#### Acceptance Criteria

1. WHEN pengguna tanpa session mengakses route /admin/* (kecuali /admin/login), THE Middleware_Auth SHALL melakukan redirect ke halaman /admin/login
2. WHEN pengguna tanpa session mengakses route /company/* (kecuali /company/login), THE Middleware_Auth SHALL melakukan redirect ke halaman /company/login
3. WHEN pengguna tanpa session mengakses route /api/admin/*, THE Middleware_Auth SHALL mengembalikan response JSON dengan status 401 Unauthorized
4. WHEN pengguna dengan session valid mengakses route yang diproteksi, THE Middleware_Auth SHALL mengizinkan akses dan meneruskan request

### Requirement 13: Autentikasi Menggunakan Database Tanpa Mock Fallback

**User Story:** Sebagai pemilik platform, saya ingin sistem autentikasi hanya menggunakan database asli, sehingga keamanan tidak terkompromi oleh kredensial mock.

#### Acceptance Criteria

1. THE Sistem SHALL menghapus semua fallback mock credentials dari konfigurasi autentikasi
2. WHEN pengguna melakukan login, THE Sistem SHALL memvalidasi kredensial hanya terhadap data user di database PostgreSQL
3. IF database tidak tersedia saat login, THEN THE Sistem SHALL mengembalikan error yang informatif tanpa fallback ke mock auth
4. WHEN kredensial valid ditemukan di database, THE Sistem SHALL membuat session JWT dengan informasi id, name, email, role, dan companyId

### Requirement 14: Database Seed dengan Data Admin dan Contoh

**User Story:** Sebagai developer, saya ingin database di-seed dengan user admin dan data contoh, sehingga saya dapat login ke admin panel dan melihat data di halaman public.

#### Acceptance Criteria

1. THE Sistem SHALL menyediakan script seed (prisma/seed.ts) yang membuat minimal satu user admin dengan email dan password yang diketahui
2. THE Sistem SHALL menyediakan seed data untuk locations, routes, companies, services, schedules, dan FAQs
3. WHEN script seed dijalankan, THE Sistem SHALL memasukkan data ke database PostgreSQL tanpa error duplikasi (upsert)
4. THE Sistem SHALL mendokumentasikan kredensial admin default di file .env.example atau README

### Requirement 15: Loading States untuk Semua Halaman dengan Data Fetching

**User Story:** Sebagai pengguna, saya ingin melihat indikator loading saat data sedang dimuat, sehingga saya tahu bahwa halaman sedang memproses permintaan.

#### Acceptance Criteria

1. WHILE Server_Component sedang mengambil data, THE Sistem SHALL menampilkan loading.tsx dengan skeleton UI yang sesuai layout halaman
2. WHILE Client_Component sedang mengambil data dari API, THE Sistem SHALL menampilkan skeleton placeholder di area konten
3. THE Sistem SHALL memastikan skeleton UI memiliki dimensi yang mendekati konten final untuk menghindari layout shift

### Requirement 16: Error Handling untuk Semua Halaman dengan Data Fetching

**User Story:** Sebagai pengguna, saya ingin melihat pesan error yang jelas ketika data gagal dimuat, sehingga saya tahu apa yang terjadi dan apa yang bisa dilakukan.

#### Acceptance Criteria

1. IF Server_Component gagal mengambil data, THEN THE Sistem SHALL menampilkan error.tsx dengan pesan error yang ramah pengguna
2. IF Client_Component gagal mengambil data dari API, THEN THE Sistem SHALL menampilkan inline error message dengan tombol retry
3. THE Sistem SHALL memastikan error di satu komponen tidak menyebabkan seluruh halaman gagal render (error boundary isolation)
