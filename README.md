🌿 Панель аналитики парка (Park Analytics Dashboard)

React + Recharts + чистый CSS (без Tailwind)

🚀 Запуск проекта
npm install
npm run dev

# → http://localhost:3000

📁 Структура проекта

park-analytics/
├── public/
│   └── index.html
│
├── src/
│   ├── api/
│   │   └── analyticsApi.js
│   │
│   ├── hooks/
│   │   └── useAnalyticsData.js
│   │
│   ├── components/
│   │   ├── Sidebar.jsx
│   │   ├── StatCard.jsx
│   │   ├── VisitorActivityChart.jsx
│   │   ├── PeakLoadChart.jsx
│   │   ├── TrafficGenderChart.jsx
│   │   └── CamerasPage.jsx
│   │
│   ├── styles/
│   │   ├── global.css
│   │   ├── sidebar.css
│   │   ├── statcard.css
│   │   ├── charts.css
│   │   └── cameras.css
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── .env.example
├── package.json
└── vite.config.js

🔌 Подключение к API

analyticsApi.js
const USE_MOCK = false;
const BASE_URL = import.meta.env.VITE_API_BASE_URL;


📊 API форматы
GET /stats/overview
{
  "nowInPark": { "value": 721000, "change": 11.01 },
  "loginsToday": { "value": 527000, "change": -0.03 },
  "outputsToday": { "value": 1156, "change": 15.03 },
  "avgPerWeek": { "value": 239000, "change": 6.08 }
}
