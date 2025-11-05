# NUVE Fashion Recommendation - React Version

## 📁 Struktur Folder

```
nuve-fe/
├── src/
│   ├── components/
│   │   ├── Recommendation.jsx  (Komponen utama untuk man & woman)
│   │   ├── Man.jsx            (Komponen Man)
│   │   ├── Woman.jsx          (Komponen Woman)
│   │   ├── Recommendation.css
│   │   └── index.js           (Export semua komponen)
│   ├── App.jsx                (Router aplikasi)
│   ├── main.jsx               (Entry point)
│   └── style.css              (CSS utama)
├── asset/
│   ├── asset-man/
│   │   ├── hat/
│   │   ├── shirt/
│   │   └── pants/
│   └── asset-womam/
│       ├── hat/
│       ├── shirt/
│       └── pants/
├── index.html
├── package.json
└── vite.config.js
```

## 🚀 Cara Menjalankan

### 1. Install Dependencies
```bash
cd nuve-fe
npm install
```

### 2. Jalankan Development Server
```bash
npm run dev
```

### 3. Build untuk Production
```bash
npm run build
```

## 📝 Perubahan dari HTML ke JSX

### Sebelum (HTML):
- `man.html` - File terpisah untuk man
- `woman.html` - File terpisah untuk woman
- JavaScript vanilla di dalam `<script>` tag

### Sesudah (React JSX):
- `components/Recommendation.jsx` - Komponen utama yang digunakan bersama
- `components/Man.jsx` - Wrapper untuk gender="man"
- `components/Woman.jsx` - Wrapper untuk gender="woman"
- State management menggunakan React hooks
- Routing menggunakan react-router-dom

## ✨ Fitur

- ✅ Single komponen untuk Man dan Woman
- ✅ State management dengan React hooks
- ✅ React Router untuk navigasi
- ✅ Vite untuk fast development
- ✅ CSS yang sama seperti versi HTML

## 🔧 Penggunaan Komponen

```jsx
import { Man, Woman } from './components';

// Untuk Man
<Man />

// Untuk Woman
<Woman />

// Atau langsung gunakan Recommendation
import Recommendation from './components/Recommendation';
<Recommendation gender="man" />
<Recommendation gender="woman" />
```

## 🌐 Routes

- `/` - Default (Man)
- `/man` - Halaman Man
- `/woman` - Halaman Woman

## 📦 Dependencies

- **react**: ^18.2.0
- **react-dom**: ^18.2.0
- **react-router-dom**: ^6.20.0
- **vite**: ^5.0.8
- **@vitejs/plugin-react**: ^4.2.1
