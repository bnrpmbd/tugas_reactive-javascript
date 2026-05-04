# 📋 Aplikasi To‑Do Reaktif — Tugas Reactive Programming

Deskripsi singkat
-----------------
Ini adalah aplikasi To‑Do sederhana berbasis HTML, CSS, dan JavaScript (vanilla). Aplikasi mendemonstrasikan pola reactive: UI selalu direkonsiliasi dari state saat terjadi perubahan.

Fitur utama
-----------
- Menambah tugas lewat modal (judul, mata kuliah, deadline, deskripsi).
- Menambah mata kuliah baru dari modal.
- Prioritas tugas dihitung otomatis berdasarkan sisa hari sampai deadline.
- Tandai tugas selesai / batalkan, dan hapus tugas.
- Filter menurut mata kuliah, prioritas, dan status.
- Pagination dengan pilihan jumlah item per halaman.
- Tema visual disesuaikan dengan background `bg-wayang.jpg`.

Struktur proyek
---------------
```
Tugas Reactive JavaScript/
├── index.html    # Markup dan template UI
├── styles.css    # Styling dan tema (warna, background)
├── app.js        # Logika state, render, event handlers
├── bg-wayang.jpg  # Background image untuk tema
└── README.md     # Dokumentasi (file ini)
```

Menjalankan aplikasi
---------------------
1. Buka folder proyek di file explorer dan klik dua kali `index.html` (bisa langsung dijalankan di browser).
2. Atau jalankan server lokal sederhana dari terminal (Python):

```powershell
python -m http.server 8000
# lalu buka http://localhost:8000
```
3. Di VS Code, Anda juga bisa gunakan extension Live Server dan pilih `Open with Live Server` pada `index.html`.

Catatan desain & theming
-----------------------
- Background memakai `bg-wayang.jpg`; palet warna elemen diganti ke nuansa amber / cokelat agar kontras dan konsisten.
- Warna tombol utama, badge, dan teks telah disesuaikan agar tetap terbaca terhadap latar kolom tugas.

Konsep teknis singkat
---------------------
- State: aplikasi menyimpan `tasks` dan `subjects` dalam objek state; setiap perubahan memicu `renderApp()`.
- Event-driven: input pengguna (form submit, klik tombol, filter change) memodifikasi state.
- Rendering: fungsi `renderTasks()` dan helper terkait membangun DOM dari state pada setiap update.

File penting di `app.js`
-----------------------
- `addTask()` — validasi dan penambahan tugas baru.
- `getPriorityFromDeadline()` — menghitung prioritas berdasarkan sisa hari.
- `toggleTask()` / `deleteTask()` — aksi pada tugas.
- `renderSubjectOptions()` / `renderTasks()` / `updateStats()` — fungsi render utama.

Testing singkat (manual)
------------------------
- Tambah tugas baru → tampil di daftar.
- Klik `Selesai` → tugas tercoret dan pindah ke status selesai.
- Klik `Hapus` → tugas hilang dan statistik berubah.
- Ubah filter / page size → daftar berubah sesuai filter dan pagination.

Kontribusi dan catatan
----------------------
- File yang diubah untuk tema dan tampilan: `styles.css`.
- Jika ingin konsistensi warna lain (mis. semua badge prioritas ke palet amber), beri tahu saya dan saya akan terapkan.

Lisensi
-------
Proyek ini untuk tugas kuliah — gunakan dan modifikasi untuk keperluan pembelajaran.

---

Jika Anda mau, saya bisa: menambahkan instruksi singkat untuk build/serve otomatis, atau membuat screenshot dokumentasi untuk laporan tugas.
