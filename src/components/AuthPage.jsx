import { useState, useRef, useEffect } from 'react';
import '../styles/auth.css';

const KEY = 'pa_account';

export function loadAccount() {
    try { const s = localStorage.getItem(KEY); return s ? JSON.parse(s) : null; }
    catch { return null; }
}
function saveAccount(acc) { localStorage.setItem(KEY, JSON.stringify(acc)); }
export function deleteAccount() { localStorage.removeItem(KEY); }


const EyeIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const EyeOffIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
        <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
        <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
);


function pinStrength(pin) {
    if (pin.length < 4)  return { level: 0, label: '', color: '' };
    if (pin.length < 6)  return { level: 1, label: 'Слабый',   color: '#ff3b30' };
    if (pin.length < 8)  return { level: 2, label: 'Средний', color: '#ff9500' };
    const hasLetter = /[a-zA-Z]/.test(pin);
    const hasNum    = /\d/.test(pin);
    const hasSpec   = /[^a-zA-Z0-9]/.test(pin);
    const score = [hasLetter, hasNum, hasSpec].filter(Boolean).length;
    if (score === 3)     return { level: 4, label: 'Надежный',  color: '#34c759' };
    if (score === 2)     return { level: 3, label: 'Хороший',    color: '#30d158' };
    return { level: 2, label: 'Средний',  color: '#ff9500' };
}

function PinInput({ value, onChange, placeholder, onKeyDown, autoFocus }) {
    const [show, setShow] = useState(false);
    return (
        <div className="auth-pin-wrap">
            <input
                className="auth-input"
                type={show ? 'text' : 'password'}
                placeholder={placeholder}
                value={value}
                onChange={e => onChange(e.target.value)}
                onKeyDown={onKeyDown}
                autoFocus={autoFocus}
                maxLength={32}
            />
            <button type="button" className="auth-pin-toggle" onClick={() => setShow(v => !v)}>
                {show ? <EyeOffIcon /> : <EyeIcon />}
            </button>
        </div>
    );
}

function DeleteModal({ account, onConfirm, onCancel }) {
    const [pin, setPin] = useState('');
    const [err, setErr] = useState('');

    function confirm() {
        if (pin !== account.pin) { setErr('Неверный PIN-код'); return; }
        onConfirm();
    }

    return (
        <div className="auth-modal-backdrop" onClick={onCancel}>
            <div className="auth-modal" onClick={e => e.stopPropagation()}>
                <h3>Удалить аккаунт?</h3>
                <p>Введите PIN-код для подтверждения удаления <strong>"{account.name}"</strong>.</p>
                <PinInput value={pin} onChange={setPin} placeholder="Введите PIN" autoFocus
                          onKeyDown={e => e.key === 'Enter' && confirm()} />
                {err && <p className="auth-error" style={{marginTop:8}}>{err}</p>}
                <div className="auth-modal-actions" style={{marginTop:16}}>
                    <button className="auth-modal-btn cancel" onClick={onCancel}>Отмена</button>
                    <button className="auth-modal-btn delete" onClick={confirm}>Удалить</button>
                </div>
            </div>
        </div>
    );
}

export default function AuthPage({ onLogin }) {
    const [mode, setMode]           = useState('login');
    const [name, setName]           = useState('');
    const [pin, setPin]             = useState('');
    const [pinConfirm, setPinConfirm] = useState('');
    const [loginPin, setLoginPin]   = useState('');
    const [avatarId, setAvatarId]   = useState(0);
    const [error, setError]         = useState('');
    const [showDelete, setShowDelete] = useState(false);
    const [shake, setShake]         = useState(false);

    const account  = loadAccount();
    const strength = pinStrength(pin);

    function triggerShake() {
        setShake(true);
        setTimeout(() => setShake(false), 500);
    }

    function handleLogin() {
        setError('');
        if (loginPin !== account.pin) {
            setError('Неверный PIN-код');
            triggerShake();
            setLoginPin('');
            return;
        }
        onLogin(account);
    }

    function handleCreate() {
        setError('');
        if (!name.trim())        { setError('Пожалуйста, введите имя'); return; }
        if (name.trim().length < 2) { setError('Имя должно быть не менее 2 символов'); return; }
        if (pin.length < 4)      { setError('PIN-код должен быть не менее 4 символов'); return; }
        if (pin !== pinConfirm)  { setError('PIN-коды не совпадают'); return; }

        const newAcc = { name: name.trim(), avatarId, pin, createdAt: new Date().toISOString() };
        saveAccount(newAcc);
        onLogin(newAcc);
    }

    function handleDelete() { deleteAccount(); setShowDelete(false); setMode('create'); setName(''); setPin(''); setPinConfirm(''); }

    function handleKey(e) {
        if (e.key !== 'Enter') return;
        mode === 'create' ? handleCreate() : handleLogin();
    }

    return (
        <div className="auth-bg">
            <div className="auth-blob auth-blob--1" />
            <div className="auth-blob auth-blob--2" />
            <div className="auth-blob auth-blob--3" />

            <div className={`auth-card ${shake ? 'shake' : ''}`}>
                {account && mode === 'login' && (
                    <>
                        <p className="auth-section-label">С возвращением</p>

                        <div className="auth-profile-card">
                            <div className="auth-profile-info">
                                <p className="auth-profile-name">{account.name}</p>
                                <p className="auth-profile-date">
                                    С нами с {new Date(account.createdAt).toLocaleDateString('ru-RU', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </p>
                            </div>
                        </div>

                        <label className="auth-label">PIN-код</label>
                        <PinInput value={loginPin} onChange={v => { setLoginPin(v); setError(''); }}
                                  placeholder="Введите ваш PIN" onKeyDown={handleKey} autoFocus />

                        {error && <p className="auth-error">{error}</p>}

                        <button className="auth-btn primary" style={{marginTop:16}} onClick={handleLogin}>
                            Войти в кабинет →
                        </button>

                        <div className="auth-divider"><span>или</span></div>

                        <div className="auth-bottom-actions">
                            <button className="auth-link" onClick={() => { setMode('create'); setError(''); }}>
                                Новый аккаунт
                            </button>
                            <button className="auth-link danger" onClick={() => setShowDelete(true)}>
                                Удалить аккаунт
                            </button>
                        </div>
                    </>
                )}

                {(!account || mode === 'create') && (
                    <>
                        <p className="auth-section-label">
                            {!account ? 'Создание аккаунта' : 'Новый аккаунт'}
                        </p>

                        <label className="auth-label">Ваше имя</label>
                        <input className="auth-input" placeholder="Напр. Admin, Иван..."
                               value={name} maxLength={24} autoFocus
                               onChange={e => { setName(e.target.value); setError(''); }}
                               onKeyDown={handleKey} />

                        {name && (
                            <div className="auth-preview">
                                <span className="auth-preview-name">{name}</span>
                            </div>
                        )}

                        <label className="auth-label" style={{marginTop:14}}>PIN-код</label>
                        <PinInput value={pin} onChange={v => { setPin(v); setError(''); }}
                                  placeholder="Мин. 4 символа (буквы, цифры, знаки)"
                                  onKeyDown={handleKey} />

                        {/* Индикатор надежности PIN-кода */}
                        {pin.length > 0 && (
                            <div className="auth-strength">
                                <div className="auth-strength-bars">
                                    {[1,2,3,4].map(i => (
                                        <div key={i} className="auth-strength-bar"
                                             style={{ background: strength.level >= i ? strength.color : 'var(--border-strong)' }} />
                                    ))}
                                </div>
                                <span style={{ color: strength.color, fontSize: 11, fontWeight: 600 }}>
                  {strength.label}
                </span>
                            </div>
                        )}

                        <label className="auth-label" style={{marginTop:12}}>Подтвердите PIN</label>
                        <PinInput value={pinConfirm} onChange={v => { setPinConfirm(v); setError(''); }}
                                  placeholder="Повторите PIN-код" onKeyDown={handleKey} />

                        {pinConfirm.length > 0 && (
                            <p style={{ fontSize:12, marginTop:5, fontWeight:600,
                                color: pin === pinConfirm ? '#34c759' : '#ff3b30' }}>
                                {pin === pinConfirm ? '✓ PIN-коды совпадают' : '✗ PIN-коды не совпадают'}
                            </p>
                        )}

                        {error && <p className="auth-error" style={{marginTop:8}}>{error}</p>}

                        <button className="auth-btn primary" onClick={handleCreate}>
                            Создать аккаунт →
                        </button>

                        {account && (
                            <button className="auth-btn ghost" onClick={() => { setMode('login'); setError(''); }}>
                                ← Назад к входу
                            </button>
                        )}
                    </>
                )}
            </div>

            {showDelete && account && (
                <DeleteModal account={account} onConfirm={handleDelete} onCancel={() => setShowDelete(false)} />
            )}
        </div>
    );
}