
const [lightboxOpen, setLightboxOpen] = useState(false);
const [lbTick, setLbTick] = useState(Date.now());
useEffect(() => {
  if (!lightboxOpen) return;
  const id = setInterval(() => setLbTick(Date.now()), 300);
  return () => clearInterval(id);
}, [lightboxOpen]);

////////////////////// CAMERA QISMI ////////////////////
<>
  <div className="camera-card">
    <div className="camera-card__topbar">
      <div>
        <span className="camera-card__label">{cam.name}</span>
        <span className="camera-card__ip-small">
              {cam.ip}:{cam.port}
            </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div className={`live-badge ${status}`}>
          <span className="live-badge__dot" />
          {status === "online" ? "В эфире" : status === "offline" ? "Оффлайн" : "..."}
        </div>
        <button className="edit-btn" title="Изменить">
          <LuPencil />
        </button>
        <button className="remove-btn" onClick={() => onRemove(cam.id)} title="Удалить">
          ×
        </button>
      </div>
    </div>

    <div className="camera-preview">
      <img
          src={streamUrl}
          alt={cam.name}
          className="camera-stream"
          onLoad={() => setStatus("online")}
          onError={() => setStatus("offline")}
      />

      {/* Zoom button — hover da ko'rinadi */}
      <button
          className="camera-zoom-btn"
          onClick={() => setLightboxOpen(true)}
          title="Katta ko'rish"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 3 21 3 21 9" />
          <polyline points="9 21 3 21 3 15" />
          <line x1="21" y1="3" x2="14" y2="10" />
          <line x1="3" y1="21" x2="10" y2="14" />
        </svg>
      </button>

      {status === "offline" && (
          <div className="camera-offline-overlay">
            <p>Отключено</p>
            <span>{cam.ip}:{cam.port}</span>
          </div>
      )}
      {status === "loading" && (
          <div className="camera-loading-overlay">
            <div className="spinner" />
          </div>
      )}
    </div>

    <div className="camera-card__footer">
      {cam.role && (
          <span className={`role-badge ${cam.role}`}>
              {cam.role === "checkin" ? "Вход" : "Выход"}
            </span>
      )}
      <span className="camera-card__fps">обновление 300ms</span>
    </div>
  </div>

  {/* Lightbox Modal */}
  {lightboxOpen && (
      <div className="lightbox-backdrop" onClick={() => setLightboxOpen(false)}>
        <div className="lightbox" onClick={(e) => e.stopPropagation()}>
          <div className="lightbox__header">
            <div className="lightbox__title">
              <span className="lightbox__name">{cam.name}</span>
              <span className="lightbox__ip">{cam.ip}:{cam.port}</span>
            </div>
            <button className="lightbox__close" onClick={() => setLightboxOpen(false)}>
              ×
            </button>
          </div>

          <img
              src={`http://${cam.ip}:${cam.port}/shot.jpg?t=${lbTick}`}
              alt={cam.name}
              className="lightbox__img"
          />

          <div className="lightbox__footer">
            {status === "online" && (
                <div className="lightbox__badge">
                  <span className="lightbox__dot" />
                  В эфире
                </div>
            )}
            {cam.role && (
                <span className={`lightbox__role ${cam.role}`}>
                  {cam.role === "checkin" ? "Вход" : "Выход"}
                </span>
            )}
          </div>
        </div>
      </div>
  )}
</>