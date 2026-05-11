import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import '../styles/charts.css';
import { useTabData } from "../hooks/useAnalyticsData.js";
import { useState } from "react";
import CalendarPanel from "./CalendarPanel.jsx";

function formatY(val) {
  if (val >= 1_000_000) return `${val / 1_000_000}M`;
  if (val >= 1_000) return `${val / 1_000}K`;
  return val;
}

function formatTooltip(val) {
  return new Intl.NumberFormat('ru-RU').format(val);
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;

  return (
      <div className="custom-tooltip">
        {formatTooltip(payload[0]?.value)}
      </div>
  );
}

const TABS = ['Сегодня', 'День', 'Месяц'];

export default function VisitorActivityChart({ data = [] }) {
  const [activeTab, setActiveTab] = useState('Сегодня');
  const { refetch } = useTabData(activeTab);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    refetch();
  };

  return (
      <div className="chart-card">

        <div className="chart-card__header">
          <div>
            <h3 className="chart-card__title">Активность посетителей</h3>
          </div>

          <div className="tab-section">
            <div className="tab-bar">

              <CalendarPanel />

              {TABS.map((t) => (
                  <button
                      key={t}
                      className={`tab-btn ${activeTab === t ? 'active' : ''}`}
                      onClick={() => handleTabChange(t)}
                  >
                    {t}
                  </button>
              ))}

            </div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>

            <CartesianGrid vertical={false} strokeDasharray="0" stroke="#e8eaf0" />

            <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#9ca3af' }}
            />

            <YAxis
                tickFormatter={formatY}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#9ca3af' }}
            />

            <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: '#e8eaf0', strokeWidth: 1 }}
            />

            <Line
                type="monotone"
                dataKey="entrance"
                stroke="#1a1d23"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: '#1a1d23', strokeWidth: 0 }}
            />

            <Line
                type="monotone"
                dataKey="exit"
                stroke="#a8c8ee"
                strokeWidth={2}
                strokeDasharray="6 4"
                dot={false}
                activeDot={{ r: 5, fill: '#4a90d9', strokeWidth: 0 }}
            />

          </LineChart>
        </ResponsiveContainer>

      </div>
  );
}