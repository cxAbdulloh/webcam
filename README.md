# 🌿 Park Analytics Dashboard

React + CSS dashboard

---

## 🚀 Ishga tushirish

```bash
npm install
npm run dev
# → http://localhost:3000
```

---

## 📁 Fayl strukturasi

```
park-analytics/
├── public/
│   └── index.html             # HTML template, Google Fonts
│
├── src/
│   ├── api/
│   │   └── analyticsApi.js    # ⭐ API layer (mock + real rejim)
│   │
│   ├── hooks/
│   │   └── useAnalyticsData.js # Data fetching + auto-refresh hook
│   │
│   ├── components/
│   │   ├── Sidebar.jsx         # Navigatsiya
│   │   ├── StatCard.jsx        # KPI karta
│   │   ├── VisitorActivityChart.jsx  # Chiziqli grafik
│   │   ├── PeakLoadChart.jsx   # Ustunli grafik
│   │   ├── TrafficGenderChart.jsx    # Donut chart
│   │   └── CamerasPage.jsx     # Kameralar sahifasi
│   │
│   ├── styles/
│   │   ├── global.css          # CSS variables, layout, utility
│   │   ├── sidebar.css
│   │   ├── statcard.css
│   │   ├── charts.css
│   │   └── cameras.css
│   │
│   ├── App.jsx                 # Asosiy sahifa va routing
│   └── main.jsx                # React entry point
│
├── .env.example               # Environment variables namunasi
├── package.json
└── vite.config.js
```

---

## 🔌 Real API ga ulash

### 1. `analyticsApi.js` ni oching:

```js
const USE_MOCK = false;  // ← shu qatorni o'zgartiring
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
```

### 2. `.env` fayl yarating:
```bash
cp .env.example .env
```

## 📦 Build (production)

```bash
npm run build
# dist/ papkasi tayyor
```
