import { NavLink } from 'react-router-dom'
import Icon from './Icon'

const navigation = [
  { label: 'Dashboard', to: '/', icon: 'dashboard', end: true },
  { label: 'Groups', to: '/groups', icon: 'groups' },
  { label: 'Members', to: '/members', icon: 'members' },
  { label: 'Contributions', to: '/contributions', icon: 'contributions' },
  { label: 'Payments', to: '/payments', icon: 'payments' },
]

function Sidebar({ isOpen, onNavigate }) {
  return (
    <>
      {isOpen && <button className="sidebar-scrim" type="button" aria-label="Close navigation" onClick={onNavigate} />}
      <aside className={`sidebar${isOpen ? ' sidebar-open' : ''}`}>
        <NavLink to="/" className="brand" onClick={onNavigate}>
          <span className="brand-mark"><span /><span /><span /></span>
          <span className="brand-name">susu<span>circle</span></span>
        </NavLink>
        <div className="sidebar-section-label">Workspace</div>
        <nav className="sidebar-nav" aria-label="Main navigation">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onNavigate}
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
            >
              <Icon name={item.icon} size={19} />
              <span>{item.label}</span>
              {item.label === 'Payments' && <span className="nav-count">2</span>}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-spacer" />
        <div className="sidebar-help">
          <div className="help-mark"><Icon name="activity" size={18} /></div>
          <strong>Here to help</strong>
          <p>Need a hand managing your circle?</p>
          <a href="mailto:support@susucircle.com">Contact support <span>↗</span></a>
        </div>
        <div className="sidebar-footer">
          <span className="online-indicator" />
          <span>All systems operational</span>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
