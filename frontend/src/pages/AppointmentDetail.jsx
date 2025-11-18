import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import AppointmentForm from '../components/AppointmentForm'

const AppointmentDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [appointment, setAppointment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)

  useEffect(() => {
    fetchAppointment()
  }, [id])

  const fetchAppointment = async () => {
    try {
      const response = await api.get(`/appointments/${id}`)
      setAppointment(response.data.data)
    } catch (error) {
      console.error('Error fetching appointment:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFormSuccess = () => {
    setEditMode(false)
    fetchAppointment()
  }

  if (loading) return <div className="container">Loading...</div>
  if (!appointment) return <div className="container">Appointment not found</div>

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Appointment Details</h1>
        <div>
          <button className="btn btn-secondary" onClick={() => navigate('/appointments')} style={{ marginRight: '10px' }}>
            Back
          </button>
          <button className="btn btn-primary" onClick={() => setEditMode(!editMode)}>
            {editMode ? 'Cancel Edit' : 'Edit'}
          </button>
        </div>
      </div>

      {editMode ? (
        <AppointmentForm initialData={appointment} onSuccess={handleFormSuccess} onCancel={() => setEditMode(false)} />
      ) : (
        <div className="card">
          <h2>Appointment Information</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
            <div>
              <strong>Patient:</strong> {appointment.patient?.name || 'N/A'}
            </div>
            <div>
              <strong>Doctor:</strong> {appointment.doctor?.name || 'N/A'} ({appointment.doctor?.specialty || 'N/A'})
            </div>
            <div>
              <strong>Date:</strong> {new Date(appointment.appointmentDate).toLocaleDateString()}
            </div>
            <div>
              <strong>Time:</strong> {appointment.appointmentTime}
            </div>
            <div>
              <strong>Duration:</strong> {appointment.duration} minutes
            </div>
            <div>
              <strong>Status:</strong> <span className={`badge badge-${getStatusColor(appointment.status)}`}>{appointment.status}</span>
            </div>
            {appointment.reason && (
              <div style={{ gridColumn: '1 / -1' }}>
                <strong>Reason:</strong> {appointment.reason}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

const getStatusColor = (status) => {
  const statusMap = {
    Scheduled: 'info',
    Confirmed: 'success',
    'In Progress': 'warning',
    Completed: 'success',
    Cancelled: 'danger',
    'No Show': 'danger',
  }
  return statusMap[status] || 'info'
}

export default AppointmentDetail

