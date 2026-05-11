
const USE_MOCK = true;
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://your-api.com/api';


async function apiFetch(endpoint, options = {}) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      // Authorization: `Bearer ${localStorage.getItem('token')}`,
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `API error: ${res.status}`);
  }

  return res.json();
}

// ── Mock data generators ─────────────────────────────────────────
function generateVisitorActivity() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
  return months.map((month, i) => ({
    month,
    entrance: Math.round(8000000 + Math.sin(i * 0.9) * 4000000 + Math.random() * 500000),
    exit:     Math.round(6000000 + Math.cos(i * 0.7) * 5000000 + Math.random() * 500000),
  }));
}

function generatePeakLoad() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return {
    weekly: days.map((day, i) => ({
      day,
      max: Math.round(18000 + Math.sin(i * 0.8) * 6000 + Math.random() * 4000),
      min: Math.round(4000  + Math.cos(i * 0.6) * 2000 + Math.random() * 2000),
      avg: Math.round(10000 + Math.sin(i * 0.5) * 3000 + Math.random() * 2000),
    })),
    monthly: Array.from({ length: 30 }, (_, i) => ({
      day: i + 1,
      max: Math.round(20000 + Math.sin(i * 0.4) * 7000 + Math.random() * 5000),
      min: Math.round(3000  + Math.cos(i * 0.3) * 1500 + Math.random() * 2000),
      avg: Math.round(11000 + Math.sin(i * 0.3) * 4000 + Math.random() * 3000),
    })),
  };
}

// ── MOCK implementations ─────────────────────────────────────────
const MOCK = {
  async getStats() {
    await delay(400);
    return {
      nowInPark:    { value: 721000,  change: +11.01 },
      loginsToday:  { value: 527000,  change: -0.03  },
      outputsToday: { value: 1156,    change: +15.03 },
      avgPerWeek:   { value: 239000,  change: +6.08  },
    };
  },

  async getVisitorActivity() {
    await delay(600);
    return generateVisitorActivity();
  },

  async getPeakLoad() {
    await delay(500);
    return generatePeakLoad();
  },

  async getTrafficByGender() {
    await delay(450);
    return {
      weekly: [
        { name: 'Мужчины', value: 34.2, color: '#1a1d23' },
        { name: 'Женщины', value: 28.5, color: '#7ec87e' },
        { name: 'Дети', value: 18.7, color: '#4a90d9' },
        { name: 'Пожилые', value: 11.6, color: '#e67e22' },
      ],
      monthly: [
        { name: 'Мужчины',    value: 36.1, color: '#1a1d23' },
        { name: 'Женщины',  value: 27.3, color: '#7ec87e' },
        { name: 'Дети',    value: 20.4, color: '#4a90d9' },
        { name: 'Пожилые', value: 10.2, color: '#e67e22' },
      ],
    };
  },

  async getCameras() {
    await delay(300);
    return [
      { id: 'cam-01', name: 'North Gate',    status: 'online', visitors: 1240 },
      { id: 'cam-02', name: 'South Gate',    status: 'online', visitors: 890  },
      { id: 'cam-03', name: 'Main Plaza',    status: 'online', visitors: 3410 },
      { id: 'cam-04', name: 'Parking Area',  status: 'offline', visitors: 0   },
      { id: 'cam-05', name: 'East Entrance', status: 'online', visitors: 560  },
    ];
  },
};

// ── REAL API implementations ─────────────────────────────────────
// Siz mana shu qismlarga o'z endpointlaringizni yozasiz.
const REAL = {
  async getStats() {
    return apiFetch('/stats/overview');
    // Javob shakli:
    // { nowInPark: { value, change }, loginsToday: { value, change }, ... }
  },

  async getVisitorActivity() {
    return apiFetch('/stats/visitor-activity');
    // Javob: [{ month: 'Jan', entrance: 8000000, exit: 6000000 }, ...]
  },

  async getPeakLoad() {
    return apiFetch('/stats/peak-load');
    // Javob: { weekly: [{day, max, min, avg}], monthly: [{day, max, min, avg}] }
  },

  async getTrafficByGender() {
    return apiFetch('/stats/gender-traffic');
    // Javob: [{ name: 'Male', value: 38.6, color: '#1a1d23' }, ...]
  },

  async getCameras() {
    return apiFetch('/cameras');
    // Javob: [{ id, name, status, visitors }, ...]
  },
};

// ── Camera stream URL builder ────────────────────────────────────
/**
 * Kamera stream URL hosil qilish.
 * WebRTC, RTSP-over-WebSocket, HLS (m3u8) kabi protokollar uchun moslashtiring.
 *
 * Misol: RTSP → HLS proxy orqali
 *   return `${BASE_URL}/cameras/${cameraId}/stream.m3u8`;
 */
export function getCameraStreamUrl(cameraId) {
  return `${BASE_URL}/cameras/${cameraId}/stream`;
}

// ── Real-time WebSocket connection ───────────────────────────────
/**
 * Jonli statistika uchun WebSocket.
 * Ishlatish:
 *   const ws = connectStatsSocket((data) => setStats(data));
 *   // komponent unmount bo'lganda:
 *   ws.close();
 */
export function connectStatsSocket(onMessage) {
  const wsUrl = import.meta.env.VITE_WS_URL || 'wss://your-api.com/ws/stats';
  const socket = new WebSocket(wsUrl);

  socket.onopen    = () => console.log('[WS] Connected');
  socket.onmessage = (e) => onMessage(JSON.parse(e.data));
  socket.onerror   = (e) => console.error('[WS] Error', e);
  socket.onclose   = () => console.log('[WS] Disconnected');

  return socket;
}

// ── Public API (auto-switches mock / real) ───────────────────────
const api = USE_MOCK ? MOCK : REAL;

export const {
  getStats,
  getVisitorActivity,
  getPeakLoad,
  getTrafficByGender,
  getCameras,
} = api;

// ── Helper ───────────────────────────────────────────────────────
function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
