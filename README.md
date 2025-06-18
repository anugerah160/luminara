# Luminara - Platform Berita dan Artikel

![Luminara](https://placehold.co/1200x628/000000/FFFFFF/png?text=LUMINARA)

Luminara adalah sebuah platform publikasi berita dan artikel modern yang dibangun menggunakan Laravel untuk backend dan React untuk frontend. Proyek ini menyediakan RESTful API yang andal dan antarmuka pengguna yang dinamis dan interaktif. Dilengkapi juga dengan panel admin yang *powerful* berbasis Filament untuk manajemen konten dan pengguna.

## Daftar Isi

- [Fitur Utama](#fitur-utama)
- [Teknologi yang Digunakan](#teknologi-yang-digunakan)
- [Arsitektur Sistem](#arsitektur-sistem)
- [Skema Database](#skema-database)
- [API Endpoints](#api-endpoints)
- [Prasyarat](#prasyarat)
- [Panduan Instalasi](#panduan-instalasi)
- [Akses Panel Admin](#akses-panel-admin)
- [Struktur Direktori](#struktur-direktori)

## Fitur Utama

-   **Panel Admin (Filament):**
    -   Dashboard interaktif dengan statistik total artikel, kategori, pengguna, dan komentar.
    -   Grafik visualisasi jumlah artikel yang dibuat dalam satu tahun terakhir.
    -   Manajemen CRUD (Create, Read, Update, Delete) penuh untuk Pengguna, Artikel, Kategori, dan Komentar.
    -   Manajemen role pengguna (Admin, Author, User).

-   **Fitur untuk Author:**
    -   Halaman *dashboard* khusus untuk penulis.
    -   Kemampuan untuk membuat, mengedit, dan menghapus artikel milik sendiri.
    -   Manajemen profil penulis.
    -   *Rich Text Editor* untuk penulisan konten yang mudah.

-   **Fitur untuk Pengguna/Publik:**
    -   *Homepage* dinamis dengan *hero slider*, berita unggulan, dan artikel terbaru.
    -   Pencarian artikel berdasarkan judul atau konten.
    -   Melihat artikel berdasarkan kategori.
    -   Halaman detail artikel yang informatif.
    -   Sistem registrasi dan login untuk pengguna.
    -   Kemampuan untuk memberikan komentar pada artikel (memerlukan login).

## Teknologi yang Digunakan

Proyek ini dibangun menggunakan teknologi modern untuk memastikan performa, skalabilitas, dan kemudahan pengembangan.

-   **Backend:**
    -   [Laravel 12](https://laravel.com/): Framework PHP untuk membangun API yang elegan.
    -   [Filament 3](https://filamentphp.com/): Admin panel builder untuk Laravel.
    -   [Laravel Sanctum](https://laravel.com/docs/11.x/sanctum): Untuk otentikasi API berbasis token.

-   **Frontend:**
    -   [React 19](https://react.dev/): Library JavaScript untuk membangun antarmuka pengguna.
    -   [Vite](https://vitejs.dev/): *Build tool* modern untuk pengembangan frontend.
    -   [React Router DOM](https://reactrouter.com/): Untuk *routing* di sisi klien (SPA).
    -   [Tailwind CSS](https://tailwindcss.com/): Framework CSS *utility-first* untuk desain yang cepat.
    -   [Axios](https://axios-http.com/): *HTTP client* berbasis *Promise* untuk berkomunikasi dengan API.

-   **Database:**
    -   MySQL (default), namun dapat dikonfigurasi untuk PostgreSQL atau SQLite.

## Arsitektur Sistem

Aplikasi ini dirancang dengan arsitektur *decoupled* di mana backend dan frontend terpisah, memberikan fleksibilitas dan skalabilitas.

-   **Backend (Laravel API):**
    -   Bertanggung jawab untuk logika bisnis, interaksi database, dan otentikasi.
    -   Menyediakan serangkaian *endpoint* RESTful API yang dikonsumsi oleh frontend.
    -   Menggunakan Laravel Eloquent ORM untuk interaksi dengan database.
    -   Berlokasi di dalam direktori `app`, `routes`, dan `database`.

-   **Frontend (React SPA):**
    -   Merupakan *Single Page Application* (SPA) yang menyediakan UI yang dinamis dan responsif.
    -   Semua *request* data dilakukan secara asinkron ke backend API.
    -   Manajemen *state* dan *routing* ditangani di sisi klien.
    -   Berlokasi di dalam direktori `resources/js`.

-   **Admin Panel (Filament):**
    -   Terintegrasi langsung dengan backend Laravel.
    -   Secara otomatis membuat antarmuka admin untuk mengelola *resources* (Models) yang ada.
    -   Dapat diakses melalui *route* `/admin`.

## Skema Database

Struktur database dirancang untuk menampung data artikel, kategori, pengguna, dan interaksi antar mereka.

-   **`users`**: Menyimpan data pengguna, termasuk `name`, `email`, `password`, dan `role` (`admin`, `author`, `user`).
-   **`categories`**: Menyimpan kategori artikel (`name`, `slug`).
-   **`article_news`**: Tabel utama untuk artikel, berelasi dengan `users` (sebagai penulis) dan `categories`. Menyimpan `title`, `slug`, `content`, `image_url`, dan `published_at`.
-   **`comments`**: Menyimpan komentar dari pengguna pada sebuah artikel. Berelasi dengan `users` dan `article_news`.

![Skema Database](https://placehold.co/800x400/FFFFFF/000000/png?text=Diagram+Relasi+Tabel)

## API Endpoints

Berikut adalah daftar *endpoint* utama yang disediakan oleh API Luminara.

| Metode  | Endpoint                                | Deskripsi                                | Otentikasi  |
| :------- | :-------------------------------------- | :--------------------------------------- | :---------- |
| **Auth** |                                         |                                          |             |
| `POST`   | `/api/register`                         | Mendaftarkan pengguna baru.              | Tidak       |
| `POST`   | `/api/login`                            | Login pengguna & mendapatkan token.      | Tidak       |
| `POST`   | `/api/logout`                           | Logout pengguna & menghapus token.       | **Ya** |
| `GET`    | `/api/user`                             | Mendapatkan data pengguna yang login.    | **Ya** |
| `POST`   | `/api/user`                             | Memperbarui data profil pengguna.        | **Ya** |
| **Articles & Categories** |                        |                                          |             |
| `GET`    | `/api/articles`                         | Mendapatkan daftar semua artikel.        | Tidak       |
| `GET`    | `/api/articles/{id}`                    | Mendapatkan detail satu artikel.         | Tidak       |
| `GET`    | `/api/search/articles?q={query}`        | Mencari artikel.                         | Tidak       |
| `GET`    | `/api/categories`                       | Mendapatkan semua kategori.              | Tidak       |
| `GET`    | `/api/categories/{slug}/articles`       | Mendapatkan artikel per kategori.        | Tidak       |
| **Author Actions** |                              |                                          |             |
| `GET`    | `/api/user/articles`                    | Mendapatkan artikel milik penulis.       | **Ya** |
| `POST`   | `/api/user/articles`                    | Membuat artikel baru.                    | **Ya** |
| `POST`   | `/api/user/articles/{id}`               | Memperbarui artikel milik penulis.       | **Ya** |
| `DELETE` | `/api/user/articles/{id}`               | Menghapus artikel milik penulis.         | **Ya** |
| **Comments** |                                     |                                          |             |
| `POST`   | `/api/articles/{id}/comments`           | Menambahkan komentar baru pada artikel.  | **Ya** |

## Prasyarat

Sebelum memulai, pastikan sistem Anda telah terinstal:
-   PHP >= 8.2
-   Composer 2.x
-   Node.js >= 18.x & NPM
-   Server Database (contoh: MySQL, MariaDB)

## Panduan Instalasi

Ikuti langkah-langkah berikut untuk menjalankan proyek ini di lingkungan lokal Anda:

1.  **Clone Repository**
    ```bash
    git clone [https://github.com/anugerah160/luminara.git](https://github.com/anugerah160/luminara.git)
    cd luminara
    ```

2.  **Instal Dependensi Backend**
    ```bash
    composer install
    ```

3.  **Instal Dependensi Frontend**
    ```bash
    npm install
    ```

4.  **Konfigurasi Environment**
    -   Salin file `.env.example` menjadi `.env`.
        ```bash
        cp .env.example .env
        ```
    -   Buat kunci aplikasi.
        ```bash
        php artisan key:generate
        ```
    -   Konfigurasikan koneksi database Anda di dalam file `.env`.
        ```
        DB_CONNECTION=mysql
        DB_HOST=127.0.0.1
        DB_PORT=3306
        DB_DATABASE=luminara
        DB_USERNAME=root
        DB_PASSWORD=
        ```

5.  **Migrasi dan Seeding Database**
    -   Jalankan migrasi untuk membuat tabel-tabel di database.
        ```bash
        php artisan migrate
        ```
    -   Jalankan *seeder* untuk mengisi data awal, termasuk akun admin dan kategori.
        ```bash
        php artisan db:seed
        ```

6.  **Jalankan Aplikasi**
    -   Jalankan *Vite development server* untuk *hot-reloading* aset frontend.
        ```bash
        npm run dev
        ```
    -   Buka terminal baru dan jalankan server pengembangan Laravel.
        ```bash
        php artisan serve
        ```

7.  **Akses Aplikasi**
    -   Aplikasi frontend dapat diakses di: `http://localhost:8000`
    -   Panel admin dapat diakses di: `http://localhost:8000/admin`

## Akses Panel Admin

Anda dapat masuk ke panel admin menggunakan kredensial default yang dibuat oleh `AdminUserSeeder`.

-   **URL:** `/admin`
-   **Email:** `admin@luminara.com`
-   **Password:** `password`

## Struktur Direktori

Berikut adalah gambaran umum struktur direktori penting dalam proyek ini.

```
.
├── app/
│   ├── Enums/            # PHP Enums (contoh: UserRole)
│   ├── Filament/         # Konfigurasi Admin Panel Filament (Resources, Widgets)
│   ├── Http/
│   │   ├── Controllers/  # Controller untuk handle request API
│   │   └── Middleware/   # Middleware untuk request
│   └── Models/           # Model Eloquent (User, ArticleNews, etc.)
│   └── Providers/        # Service Providers (termasuk Filament)
├── database/
│   ├── factories/        # Factory untuk membuat data dummy
│   ├── migrations/       # Skema struktur database
│   └── seeders/          # Seeder untuk mengisi data awal
├── resources/
│   ├── css/              # File CSS utama
│   ├── js/               # Root untuk aplikasi React
│   │   ├── components/   # Komponen React yang dapat digunakan kembali
│   │   ├── pages/        # Komponen halaman utama (Home, DetailArticle, etc.)
│   │   ├── services/     # Logika untuk berinteraksi dengan API
│   │   └── App.jsx       # Komponen utama dan routing React
│   └── views/
│       └── app.blade.php # Blade view utama untuk me-render aplikasi React
└── routes/
    ├── api.php           # Definisi endpoint API
    └── web.php           # Definisi route web (termasuk route untuk SPA)
```
