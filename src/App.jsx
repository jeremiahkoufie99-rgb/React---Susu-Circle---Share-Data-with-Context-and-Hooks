import { Routes, Route } from 'react-router-dom'

import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Footer from './components/Footer'

import Dashboard from './pages/Dasboard.jsx'
import Groups from './pages/Groups'
import Members from './pages/Member'
import Contributions from './pages/Contributions'
import Payments from './pages/Payments'
import NotFound from './pages/Notfound'

import './App.css'

function App() {
  return (
    <div className="app">
      <Navbar />

      <div className="main-layout">
        <Sidebar />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/members" element={<Members />} />
            <Route path="/contributions" element={<Contributions />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="*" element={<NotFound />} />
          </Routes>

          <Footer />
        </main>
      </div>
    </div>
  )
}

export default App
