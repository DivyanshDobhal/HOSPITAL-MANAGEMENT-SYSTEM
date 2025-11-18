import { useState, useEffect, useRef } from 'react'
import { useSocket } from '../contexts/SocketContext'
import { motion, AnimatePresence } from 'framer-motion'
import { FaBell, FaTimes } from 'react-icons/fa'
import './NotificationBell.css'

const NotificationBell = () => {
  const { notifications, removeNotification, clearNotifications } = useSocket()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const unreadCount = notifications.filter(n => !n.read).length

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="notification-bell" ref={dropdownRef}>
      <button
        className="notification-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        <FaBell />
        {unreadCount > 0 && (
          <motion.span
            className="notification-badge"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="notification-dropdown"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="notification-header">
              <h3>Notifications</h3>
              {notifications.length > 0 && (
                <button onClick={clearNotifications} className="clear-btn">
                  Clear All
                </button>
              )}
            </div>

            <div className="notification-list">
              {notifications.length === 0 ? (
                <div className="notification-empty">No notifications</div>
              ) : (
                notifications.map((notification, index) => (
                  <motion.div
                    key={index}
                    className={`notification-item ${!notification.read ? 'unread' : ''}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <div className="notification-content">
                      <p className="notification-message">{notification.message}</p>
                      <span className="notification-time">
                        {new Date(notification.timestamp || Date.now()).toLocaleTimeString()}
                      </span>
                    </div>
                    <button
                      className="notification-close"
                      onClick={() => removeNotification(index)}
                      aria-label="Close notification"
                    >
                      <FaTimes />
                    </button>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default NotificationBell

