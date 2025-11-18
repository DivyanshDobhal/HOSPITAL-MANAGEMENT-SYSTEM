import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaPaperPlane, FaEnvelope, FaEnvelopeOpen } from 'react-icons/fa'
import api from '../services/api'
import toast from 'react-hot-toast'
import Modal from '../components/Modal'
import './Messages.css'

const Messages = () => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCompose, setShowCompose] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [users, setUsers] = useState([])
  const [newMessage, setNewMessage] = useState({
    recipient: '',
    subject: '',
    content: '',
  })

  useEffect(() => {
    fetchMessages()
    fetchUsers()
  }, [])

  const fetchMessages = async () => {
    try {
      const response = await api.get('/messages?type=all')
      setMessages(response.data.data || [])
    } catch (error) {
      toast.error('Error loading messages')
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      // In a real app, you'd have a users endpoint
      // For now, we'll use doctors and patients
      const [doctorsRes, patientsRes] = await Promise.all([
        api.get('/doctors?limit=100'),
        api.get('/patients?limit=100'),
      ])
      // This is a simplified version - in production, you'd have a proper users list
      setUsers([])
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    try {
      await api.post('/messages', newMessage)
      toast.success('Message sent successfully')
      setShowCompose(false)
      setNewMessage({ recipient: '', subject: '', content: '' })
      fetchMessages()
    } catch (error) {
      toast.error('Error sending message')
    }
  }

  const markAsRead = async (messageId) => {
    try {
      await api.put(`/messages/${messageId}/read`)
      fetchMessages()
    } catch (error) {
      console.error('Error marking as read:', error)
    }
  }

  if (loading) {
    return <div className="container">Loading messages...</div>
  }

  return (
    <div className="container">
      <div className="messages-header">
        <h1>Messages</h1>
        <button className="btn btn-primary" onClick={() => setShowCompose(true)}>
          <FaPaperPlane /> Compose
        </button>
      </div>

      <div className="messages-grid">
        <div className="messages-list">
          {messages.length === 0 ? (
            <div className="empty-state">No messages yet</div>
          ) : (
            messages.map((message) => (
              <motion.div
                key={message._id}
                className={`message-item ${!message.read && message.recipient._id ? 'unread' : ''}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => {
                  setSelectedMessage(message)
                  if (!message.read && message.recipient._id) {
                    markAsRead(message._id)
                  }
                }}
              >
                <div className="message-icon">
                  {message.read || !message.recipient._id ? <FaEnvelopeOpen /> : <FaEnvelope />}
                </div>
                <div className="message-content">
                  <div className="message-header">
                    <span className="message-sender">
                      {message.sender?.name || 'System'}
                    </span>
                    <span className="message-time">
                      {new Date(message.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="message-subject">{message.subject || 'No subject'}</div>
                  <div className="message-preview">{message.content.substring(0, 100)}...</div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {selectedMessage && (
          <motion.div
            className="message-detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="message-detail-header">
              <h2>{selectedMessage.subject || 'No Subject'}</h2>
              <button
                className="btn btn-secondary"
                onClick={() => setSelectedMessage(null)}
              >
                Close
              </button>
            </div>
            <div className="message-detail-content">
              <div className="message-meta">
                <p><strong>From:</strong> {selectedMessage.sender?.name || 'System'}</p>
                <p><strong>To:</strong> {selectedMessage.recipient?.name || 'You'}</p>
                <p><strong>Date:</strong> {new Date(selectedMessage.createdAt).toLocaleString()}</p>
              </div>
              <div className="message-body">{selectedMessage.content}</div>
            </div>
          </motion.div>
        )}
      </div>

      <Modal
        isOpen={showCompose}
        onClose={() => setShowCompose(false)}
        title="Compose Message"
        size="medium"
      >
        <form onSubmit={handleSendMessage}>
          <div className="form-group">
            <label>To (User ID)</label>
            <input
              type="text"
              value={newMessage.recipient}
              onChange={(e) => setNewMessage({ ...newMessage, recipient: e.target.value })}
              placeholder="Enter recipient user ID"
              required
            />
          </div>
          <div className="form-group">
            <label>Subject</label>
            <input
              type="text"
              value={newMessage.subject}
              onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
              placeholder="Message subject"
            />
          </div>
          <div className="form-group">
            <label>Message</label>
            <textarea
              value={newMessage.content}
              onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
              placeholder="Type your message here..."
              rows={6}
              required
            />
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowCompose(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <FaPaperPlane /> Send
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Messages

