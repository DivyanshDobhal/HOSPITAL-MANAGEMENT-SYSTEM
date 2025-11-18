import { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { AuthContext } from './AuthContext'

const SocketContext = createContext()

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const [notifications, setNotifications] = useState([])
  const { token } = useContext(AuthContext)

  useEffect(() => {
    if (token) {
      const newSocket = io('http://localhost:5000', {
        auth: {
          token: token,
        },
      })

      newSocket.on('connect', () => {
        console.log('✅ Connected to Socket.io server')
      })

      newSocket.on('notification', (data) => {
        setNotifications(prev => [data, ...prev])
        // Show browser notification if permission granted
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(data.message, {
            icon: '/vite.svg',
          })
        }
      })

      newSocket.on('disconnect', () => {
        console.log('❌ Disconnected from Socket.io server')
      })

      setSocket(newSocket)

      // Request notification permission
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission()
      }

      return () => {
        newSocket.close()
      }
    }
  }, [token])

  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev])
  }

  const removeNotification = (index) => {
    setNotifications(prev => prev.filter((_, i) => i !== index))
  }

  const clearNotifications = () => {
    setNotifications([])
  }

  return (
    <SocketContext.Provider value={{ socket, notifications, addNotification, removeNotification, clearNotifications }}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider')
  }
  return context
}

