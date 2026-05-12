/**
 * PARK ANALYTICS - Интеграция с реальным API
 */

// Адрес бэкенда берется из файла .env
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

/**
 * Общая функция Fetch - для проверки ошибок и настройки заголовков
 */
async function apiFetch(endpoint, options = {}) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      // Если на бэкенде используется система логина JWT, включите строку ниже:
      // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Ошибка API: ${res.status}`);
  }

  return res.json();
}

// ── ЭНДПОИНТЫ РЕАЛЬНОГО API ─────────────────────────────────────

// 1. Статистика основных 4-х карточек (StatCards)
export const getStats = async (period = 'Today') => {
  return apiFetch(`/stats/overview?period=${period}`);
};

// 2. График входов и выходов (VisitorActivityChart)
export const getVisitorActivity = async (period = 'Today') => {
  return apiFetch(`/stats/visitor-activity?period=${period}`);
};

// 3. Пиковая нагрузка (BarChart)
export const getPeakLoad = async (period = 'Today') => {
  return apiFetch(`/stats/peak-load?period=${period}`);
};

// 4. Круговой график (TrafficGenderChart)
export const getTrafficByGender = async (period = 'Today') => {
  return apiFetch(`/stats/gender-traffic?period=${period}`);
};

// 5. Список камер
export const getCameras = async () => {
  return apiFetch('/cameras');
};

/**
 * Формирование URL-адреса стрима камеры
 */
export function getCameraStreamUrl(cameraId) {
  return `${BASE_URL}/cameras/${cameraId}/stream`;
}

/**
 * WebSocket соединение для статистики в реальном времени
 */
export function connectStatsSocket(onMessage) {
  const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws/stats';
  const socket = new WebSocket(wsUrl);

  socket.onmessage = (e) => onMessage(JSON.parse(e.data));
  socket.onerror = (e) => console.error('[WS] Ошибка:', e);

  return socket;
}