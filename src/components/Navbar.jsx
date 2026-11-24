function Navbar({ onMenuClick }) {
  return (
    <header className="topbar">
      <button className="menu-toggle" type="button" onClick={onMenuClick} aria-label="Open navigation">
        <span />
        <span />
        <span />
      </button>
      <div className="topbar-heading">
        <span className="topbar-eyebrow">Susu Circle workspace</span>
        <span className="topbar-title">Financial overview</span>
      </div>
      <div className="topbar-actions">
        <button className="icon-button notification-button" type="button" aria-label="Notifications">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></svg>
          <span className="notification-dot" />
        </button>
        <span className="topbar-divider" />
        <div className="admin-profile">
          <div className="avatar avatar-admin">SC</div>
          <div className="admin-copy">
            <strong>Sarah Coleman</strong>
            <span>Administrator</span>
          </div>
          <svg className="chevron-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m7 10 5 5 5-5" /></svg>
        </div>
      </div>
    </header>
  )
}

export default Navbar
