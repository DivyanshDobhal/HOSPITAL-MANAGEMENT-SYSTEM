import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useContext } from 'react'
import { motion } from 'framer-motion'
import { FaMoon, FaSun, FaSignOutAlt, FaComments, FaChartLine } from 'react-icons/fa'
import { AuthContext } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import NotificationBell from './NotificationBell'
import './Navbar.css'

const Navbar = () => {
  const { user, logout } = useContext(AuthContext)
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          🏥 Hospital Management
        </Link>
        <div className="navbar-menu">
          <Link 
            to="/dashboard" 
            className={`navbar-link ${isActive('/dashboard') ? 'active' : ''}`}
          >
            Dashboard
          </Link>
          <Link 
            to="/patients" 
            className={`navbar-link ${isActive('/patients') ? 'active' : ''}`}
          >
            Patients
          </Link>
          <Link 
            to="/doctors" 
            className={`navbar-link ${isActive('/doctors') ? 'active' : ''}`}
          >
            Doctors
          </Link>
          <Link 
            to="/appointments" 
            className={`navbar-link ${isActive('/appointments') ? 'active' : ''}`}
          >
            Appointments
          </Link>
          <Link 
            to="/prescriptions" 
            className={`navbar-link ${isActive('/prescriptions') ? 'active' : ''}`}
          >
            Prescriptions
          </Link>
          <Link 
            to="/messages" 
            className={`navbar-link ${isActive('/messages') ? 'active' : ''}`}
          >
            <FaComments /> Messages
          </Link>
          <Link 
            to="/analytics" 
            className={`navbar-link ${isActive('/analytics') ? 'active' : ''}`}
          >
            <FaChartLine /> Analytics
          </Link>
          <div className="navbar-actions">
            <NotificationBell />
            <button
              onClick={toggleTheme}
              className="theme-toggle"
              aria-label="Toggle theme"
              title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? <FaMoon /> : <FaSun />}
            </button>
            <div className="navbar-user">
              <span>{user?.name}</span>
              <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                <FaSignOutAlt /> Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

