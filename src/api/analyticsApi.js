
// Backend manzili .env fayldan olinadi
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

/**
 * Umumiy Fetch funksiyasi - xatolarni tekshirish va sarlavhalarni sozlash uchun
 */

async function apiFetch(endpoint, options = {}) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      // Agar backendda JWT login tizimi bo'lsa, pastdagi qatorni yoqing:
      // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `API xatosi: ${res.status}`);
  }

  return res.json();
}

// ── REAL API ENDPOINTLARI ─────────────────────────────────────

// 1. Asosiy 4 ta karta statistikasi (StatCards)
export const getStats = async (period = 'Today') => {
  return apiFetch(`/stats/overview?period=${period}`);
};

// 2. Kirish-chiqish grafigi (VisitorActivityChart)
export const getVisitorActivity = async (period = 'Today') => {
  return apiFetch(`/stats/visitor-activity?period=${period}`);
};

// 3. Peak Load (BarChart)
export const getPeakLoad = async (period = 'Today') => {
  return apiFetch(`/stats/peak-load?period=${period}`);
};

// 4. Doiraviy grafik (TrafficGenderChart)
export const getTrafficByGender = async (period = 'Today') => {
  return apiFetch(`/stats/gender-traffic?period=${period}`);
};

// 5. Kameralar ro'yxati
export const getCameras = async () => {
  return apiFetch('/cameras');
};

/**
 * Jonli statistika uchun WebSocket ulanishi
 */
/**
 * Kamera stream URL hosil qilish
 */

// Agar kerak bolsa
export function getCameraStreamUrl(cameraId) {
  return `${BASE_URL}/cameras/${cameraId}/stream`;
}
export function connectStatsSocket(onMessage) {
  const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws/stats';
  const socket = new WebSocket(wsUrl);

  socket.onmessage = (e) => onMessage(JSON.parse(e.data));
  socket.onerror = (e) => console.error('[WS] Error:', e);

  return socket;
}