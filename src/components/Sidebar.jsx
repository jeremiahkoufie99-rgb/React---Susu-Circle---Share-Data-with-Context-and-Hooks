import { Link } from 'react-router-dom'

function Sidebar() {
  return (
    <aside className="sidebar">
      <h3>MENU</h3>

      <ul>
        <li><Link to="/">Dashboard</Link></li>
        <li><Link to="/groups">Groups</Link></li>
        <li><Link to="/members">Members</Link></li>
        <li><Link to="/contributions">Contributions</Link></li>
        <li><Link to="/payments">Payments</Link></li>
      </ul>
    </aside>
  )
}

export default Sidebar

