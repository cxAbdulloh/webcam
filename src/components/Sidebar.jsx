import { useState, useRef, useEffect } from 'react';
import '../styles/sidebar.css';

const icons = {
    dashboard: (
        <svg className="nav-icon" viewBox="0 0 20 20" fill="none">
            <rect x="2" y="2" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.9"/>
            <rect x="11" y="2" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.5"/>
            <rect x="2" y="11" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.5"/>
            <rect x="11" y="11" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.5"/>
        </svg>
    ),
    camera: (
        <svg className="nav-icon" viewBox="0 0 20 20" fill="none">
            <rect x="1" y="5" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
            <circle cx="10" cy="11" r="3" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M7 5l1.5-2h3L13 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
    ),
    reports: (
        <svg className="nav-icon" viewBox="0 0 20 20" fill="none">
            <rect x="3" y="2" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M7 7h6M7 10h6M7 13h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
    ),
    settings: (
        <svg className="nav-icon" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.22 4.22l1.42 1.42M14.36 14.36l1.42 1.42M4.22 15.78l1.42-1.42M14.36 5.64l1.42-1.42"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
    ),
};

const AVATARS = [
    {
        id: 0, bg: 'linear-gradient(135deg, #1a1d23, #3a3f4b)',
        svg: <svg viewBox="0 0 40 40" fill="none">
            <polygon points="20,6 34,30 6,30" stroke="white" strokeWidth="1.8" fill="none" opacity="0.9"/>
            <polygon points="20,12 28,26 12,26" fill="white" opacity="0.15"/>
            <circle cx="20" cy="6"  r="2" fill="white"/>
            <circle cx="34" cy="30" r="2" fill="white"/>
            <circle cx="6"  cy="30" r="2" fill="white"/>
        </svg>,
    },
    {
        id: 1, bg: 'linear-gradient(135deg, #4a90d9, #2563a8)',
        svg: <svg viewBox="0 0 40 40" fill="none">
            <polygon points="20,4 33,11.5 33,26.5 20,34 7,26.5 7,11.5" stroke="white" strokeWidth="1.8" fill="none" opacity="0.9"/>
            <polygon points="20,11 27,15 27,23 20,27 13,23 13,15" fill="white" opacity="0.2"/>
            <circle cx="20" cy="20" r="3" fill="white" opacity="0.9"/>
        </svg>,
    },
    {
        id: 2, bg: 'linear-gradient(135deg, #7ec87e, #3a9a3a)',
        svg: <svg viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="14" stroke="white" strokeWidth="1.5" fill="none" opacity="0.4"/>
            <circle cx="20" cy="20" r="9"  stroke="white" strokeWidth="1.5" fill="none" opacity="0.6"/>
            <circle cx="20" cy="20" r="4"  fill="white" opacity="0.9"/>
            <line x1="20" y1="6"  x2="20" y2="14" stroke="white" strokeWidth="1.5" opacity="0.7"/>
            <line x1="34" y1="20" x2="26" y2="20" stroke="white" strokeWidth="1.5" opacity="0.7"/>
        </svg>,
    },
    {
        id: 3, bg: 'linear-gradient(135deg, #9b59b6, #6c3483)',
        svg: <svg viewBox="0 0 40 40" fill="none">
            <polygon points="20,4 36,20 20,36 4,20" stroke="white" strokeWidth="1.8" fill="none" opacity="0.9"/>
            <polygon points="20,10 30,20 20,30 10,20" fill="white" opacity="0.15"/>
            <polygon points="20,16 24,20 20,24 16,20" fill="white" opacity="0.8"/>
        </svg>,
    },
    {
        id: 4, bg: 'linear-gradient(135deg, #e67e22, #c0392b)',
        svg: <svg viewBox="0 0 40 40" fill="none">
            <line x1="20" y1="4"  x2="20" y2="36" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
            <line x1="4"  y1="20" x2="36" y2="20" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
            <line x1="8"  y1="8"  x2="32" y2="32" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
            <line x1="32" y1="8"  x2="8"  y2="32" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
            <circle cx="20" cy="20" r="4" fill="white"/>
        </svg>,
    },
    {
        id: 5, bg: 'linear-gradient(135deg, #1abc9c, #0e6655)',
        svg: <svg viewBox="0 0 40 40" fill="none">
            <path d="M8,20 A12,12 0 0,1 32,20" stroke="white" strokeWidth="2" fill="none" opacity="0.4"/>
            <path d="M11,20 A9,9 0 0,1 29,20"  stroke="white" strokeWidth="2" fill="none" opacity="0.65"/>
            <path d="M14,20 A6,6 0 0,1 26,20"  stroke="white" strokeWidth="2" fill="none" opacity="0.9"/>
            <circle cx="20" cy="20" r="3" fill="white"/>
        </svg>,
    },
    {
        id: 6, bg: 'linear-gradient(135deg, #34495e, #1a252f)',
        svg: <svg viewBox="0 0 40 40" fill="none">
            <rect x="17" y="6"  width="6" height="28" rx="3" fill="white" opacity="0.9"/>
            <rect x="6"  y="17" width="28" height="6"  rx="3" fill="white" opacity="0.9"/>
            <circle cx="20" cy="20" r="4" fill="#34495e"/>
            <circle cx="20" cy="20" r="2" fill="white" opacity="0.6"/>
        </svg>,
    },
    {
        id: 7, bg: 'linear-gradient(135deg, #e91e8c, #9b1060)',
        svg: <svg viewBox="0 0 40 40" fill="none">
            <polygon points="20,5 37,33 3,33"  stroke="white" strokeWidth="1.5" fill="none" opacity="0.5"/>
            <polygon points="20,12 29,27 11,27" stroke="white" strokeWidth="1.5" fill="none" opacity="0.75"/>
            <polygon points="20,18 24,24 16,24" fill="white" opacity="0.9"/>
        </svg>,
    },
];

const NAV_ITEMS = [
    { id: 'dashboard', label: 'Панель', icon: 'dashboard', live: true },
    { id: 'cameras',   label: 'Камеры',   icon: 'camera' },
    { id: 'settings',  label: 'Настройки',  icon: 'settings' },
];

function loadProfile() {
    try {
        const saved = localStorage.getItem('pa_profile');
        return saved ? JSON.parse(saved) : { name: 'ByeWind', avatarId: 0 };
    } catch {
        return { name: 'ByeWind', avatarId: 0 };
    }
}
function saveProfile(profile) {
    localStorage.setItem('pa_profile', JSON.stringify(profile));
}

function AvatarPicker({ current, onSelect, onClose }) {
    const ref = useRef(null);

    useEffect(() => {
        function handleOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) onClose();
        }
        document.addEventListener('mousedown', handleOutside);
        return () => document.removeEventListener('mousedown', handleOutside);
    }, [onClose]);

    return (
        <div className="avatar-picker" ref={ref}>
            <p className="avatar-picker__title">Выберите аватар</p>
            <div className="avatar-picker__grid">
                {AVATARS.map((av) => (
                    <button
                        key={av.id}
                        className={`avatar-picker__item ${current === av.id ? 'selected' : ''}`}
                        style={{ background: av.bg }}
                        onClick={() => { onSelect(av.id); onClose(); }}
                    >
                        {av.svg}
                        {current === av.id && <span className="avatar-picker__check">✓</span>}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default function Sidebar({ activeNav, onNavChange, account, onLogout }) {
    const [profile, setProfile]       = useState(() => ({
        name: account?.name || 'Admin',
        avatarId: account?.avatarId ?? 0,
    }));
    const [isEditing, setIsEditing]   = useState(false);
    const [editName, setEditName]     = useState('');
    const [showPicker, setShowPicker] = useState(false);
    const inputRef = useRef(null);

    const avatar = AVATARS[profile.avatarId] ?? AVATARS[0];

    function updateProfile(patch) {
        const next = { ...profile, ...patch };
        setProfile(next);
        const saved = localStorage.getItem('pa_account');
        if (saved) {
            const acc = JSON.parse(saved);
            localStorage.setItem('pa_account', JSON.stringify({ ...acc, ...patch }));
        }
    }

    function startEdit() {
        setEditName(profile.name);
        setIsEditing(true);
        setTimeout(() => inputRef.current?.focus(), 50);
    }

    function confirmEdit() {
        const trimmed = editName.trim();
        if (trimmed) updateProfile({ name: trimmed });
        setIsEditing(false);
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter')  confirmEdit();
        if (e.key === 'Escape') setIsEditing(false);
    }

    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <button
                    className="sidebar-avatar-btn"
                    style={{ background: avatar.bg }}
                    onClick={() => setShowPicker((v) => !v)}
                    title="Change avatar"
                >
                    {avatar.svg}
                    <span className="sidebar-avatar-hint">✎</span>
                </button>

                {isEditing ? (
                    <input
                        ref={inputRef}
                        className="sidebar-name-input"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onBlur={confirmEdit}
                        onKeyDown={handleKeyDown}
                        maxLength={22}
                    />
                ) : (
                    <button className="sidebar-name-btn" onClick={startEdit} title="Edit name">
                        <span>{profile.name}</span>
                        <span className="sidebar-name-icon">✎</span>
                    </button>
                )}

                {showPicker && (
                    <AvatarPicker
                        current={profile.avatarId}
                        onSelect={(id) => updateProfile({ avatarId: id })}
                        onClose={() => setShowPicker(false)}
                    />
                )}
            </div>

            <nav className="sidebar-nav">
                {NAV_ITEMS.map((item) => (
                    <button
                        key={item.id}
                        className={`sidebar-nav-item ${activeNav === item.id ? 'active' : ''}`}
                        onClick={() => onNavChange(item.id)}
                    >
                        {icons[item.icon]}
                        {item.label}
                        {item.live && activeNav !== item.id && (
                            <span className="sidebar-live-badge">Эфир</span>
                        )}
                    </button>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="sidebar-footer-info">
                    Сделано с душой:
                    <strong><a href="https://rzbtech.uz/">RZB - Tech</a></strong>
                </div>
                <button className="sidebar-logout-btn" onClick={onLogout} title="Sign out">
                    <svg viewBox="0 0 20 20" fill="none" width="15" height="15">
                        <path d="M7 3H4a1 1 0 00-1 1v12a1 1 0 001 1h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        <path d="M13 14l3-4-3-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <line x1="16" y1="10" x2="7" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    Выйти
                </button>
            </div>
        </aside>
    );
}
