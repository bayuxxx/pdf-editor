# 📄 Visual PDF Editor & Merger

Sebuah aplikasi web modern berbasis React dan TypeScript untuk mengelola file PDF secara visual langsung dari peramban Anda. Didesain dengan antarmuka yang bersih, responsif, dan interaktif menggunakan Tailwind CSS.

Semua pemrosesan data PDF dilakukan 100% secara lokal di dalam browser Anda, memastikan keamanan dokumen Anda tanpa perlu diunggah ke server pihak ketiga.

## ✨ Fitur Utama

- **Multi-File Upload**: Unggah beberapa file PDF sekaligus.
- **Visual Page Grid**: Setiap halaman PDF diekstrak dan ditampilkan sebagai gambar thumbnail interaktif.
- **Drag & Drop Reordering**: Ubah urutan halaman dengan menyeretnya (drag & drop) ke posisi yang diinginkan.
- **Accessible Controls**: Disediakan tombol navigasi cepat (panah kiri/kanan) untuk pengguna mobile atau aksesibilitas.
- **Page Rotation**: Putar halaman yang dipilih searah jarum jam sebesar 90°, 180°, atau 270°.
- **Page Deletion**: Hapus halaman tertentu yang tidak ingin dimasukkan dalam dokumen final.
- **Detail Preview Modal**: Periksa halaman secara lebih detail menggunakan jendela modal preview yang jernih.
- **Fast Export & Merge**: Gabungkan halaman yang telah diatur ulang menjadi satu dokumen PDF baru hanya dengan satu klik.

## 🛠️ Teknologi yang Digunakan

- **Frontend**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Build Tool**: [Vite](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **PDF Processing**: [pdf-lib](https://pdf-lib.js.org/) (untuk manipulasi & penggabungan PDF)
- **PDF Rendering**: [pdfjs-dist](https://mozilla.github.io/pdf.js/) (untuk mengekstrak & merender thumbnail halaman PDF)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Memulai (Local Development)

### Prasyarat
Pastikan Anda sudah menginstal [Node.js](https://nodejs.org/) di komputer Anda.

### Langkah-langkah
1. **Clone repositori ini**:
   ```bash
   git clone <link-repositori-anda>
   cd pdf-editor
   ```

2. **Instal dependensi**:
   ```bash
   npm install
   ```

3. **Jalankan server pengembangan**:
   ```bash
   npm run dev
   ```

4. **Buka aplikasi**:
   Buka peramban Anda dan akses alamat `http://localhost:5173`.

## 📦 Build untuk Production

Untuk melakukan kompilasi proyek agar siap dideploy ke server production atau hosting static (seperti Vercel, Netlify, atau GitHub Pages):

```bash
npm run build
```

Hasil build akan berada di dalam direktori `dist/` dan siap dipublikasikan.

## ☁️ Cara Deploy ke Vercel

Proyek ini sepenuhnya kompatibel dan sangat mudah di-deploy ke Vercel:

1. Push kode Anda ke repositori GitHub.
2. Masuk ke [Vercel Dashboard](https://vercel.com/) dan import repositori Anda.
3. Vercel akan otomatis mendeteksi proyek **Vite** dan menyesuaikan konfigurasinya.
4. Klik **Deploy** dan proyek Anda akan online dalam hitungan detik!

---

Dibuat oleh **Urbays 2026**
