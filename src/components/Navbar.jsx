import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <h2>Susu Circle</h2>
      </div>

      <div className="nav-links">
        <Link to="/">Dashboard</Link>
        <Link to="/groups">Groups</Link>
        <Link to="/members">Members</Link>
        <Link to="/contributions">Contributions</Link>
        <Link to="/payments">Payments</Link>
      </div>

      <div className="nav-profile">
        <span>Admin</span>
      </div>
    </nav>
  )
}

export default Navbar
