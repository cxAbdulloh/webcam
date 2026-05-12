import { useState } from 'react';
import './styles/global.css';

import Sidebar from './components/Sidebar';
import StatCard from './components/StatCard';
import VisitorActivityChart from './components/VisitorActivityChart';
import PeakLoadChart from './components/PeakLoadChart';
import TrafficGenderChart from './components/TrafficGenderChart';
import CamerasPage from './components/CamerasPage';
import AuthPage, { loadAccount } from './components/AuthPage';
import { useTabData } from './hooks/useAnalyticsData';
import SecondCalendarPanel from './components/SecondCalendarPanel.jsx';

function Spinner() {
    return (
        <div className="loading-overlay">
            <div className="spinner" />
            Loading...
        </div>
    );
}

export default function App() {
    const [account, setAccount] = useState(() => loadAccount());
    const [activeNav, setActiveNav] = useState('dashboard');
    const [activeTab, setActiveTab] = useState('Today');

    const { data, loading, error, refetch } = useTabData(activeTab);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        refetch();
    };

    if (!account) {
        return <AuthPage onLogin={(acc) => setAccount(acc)} />;
    }

    return (
        <div className="app-layout">

            <Sidebar
                activeNav={activeNav}
                onNavChange={setActiveNav}
                account={account}
                onLogout={() => setAccount(null)}
            />

            <main className="main-content">

                {activeNav === 'dashboard' && (
                    <>
                        <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                                <h1>Park Analytics</h1>
                                <p>Real-time visitor activity overview</p>
                            </div>
                        </div>

                        <div className="tab-section">
                            <SecondCalendarPanel />
                        </div>

                        {error && <div className="error-msg">⚠ {error}</div>}

                        <p className="block-label">Overview</p>

                        {loading || !data.stats ? (
                            <div className="stat-cards-grid">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="stat-card" style={{ minHeight: 90 }}>
                                        <Spinner />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="stat-cards-grid">
                                <StatCard label="Now in the park"  value={data.stats.nowInPark.value}    change={data.stats.nowInPark.change} />
                                <StatCard label="Logins today"     value={data.stats.loginsToday.value}  change={data.stats.loginsToday.change} />
                                <StatCard label="Outputs today"    value={data.stats.outputsToday.value} change={data.stats.outputsToday.change} />
                                <StatCard label="Average / week"   value={data.stats.avgPerWeek.value}   change={data.stats.avgPerWeek.change} />
                            </div>
                        )}

                        <p className="block-label" style={{ marginTop: 16 }}>
                            Visitor Activity
                        </p>

                        {loading || !data.visitorActivity
                            ? <div className="card"><Spinner /></div>
                            : <VisitorActivityChart data={data.visitorActivity} />
                        }

                        <div className="bottom-grid">

                            <div>
                                <p className="block-label" style={{ marginTop: 16 }}>
                                    Peak Load
                                </p>

                                {loading || !data.peakLoad
                                    ? <div className="card" style={{ minHeight: 260 }}><Spinner /></div>
                                    : <PeakLoadChart data={data.peakLoad} />
                                }
                            </div>

                            <div>
                                <p className="block-label" style={{ marginTop: 16 }}>
                                    Traffic by Category
                                </p>

                                {loading || !data.genderTraffic
                                    ? <div className="card" style={{ minHeight: 260 }}><Spinner /></div>
                                    : <TrafficGenderChart data={data.genderTraffic} />
                                }
                            </div>

                        </div>
                    </>
                )}

                {activeNav === 'cameras' && (
                    <>
                        <div className="dashboard-header">
                            <h1>Cameras</h1>
                            <p>Live camera monitoring</p>
                        </div>
                        <CamerasPage />
                    </>
                )}

                {activeNav === 'settings' && (
                    <div className="dashboard-header">
                        <h1>Settings</h1>
                        <p>Coming soon</p>
                    </div>
                )}
            </main>
        </div>
    );
}
