import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import AppointmentForm from '../components/AppointmentForm'

const Appointments = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [statusFilter, setStatusFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchAppointments()
  }, [page, statusFilter, dateFilter])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const params = {
        page,
        limit: 10,
        ...(statusFilter && { status: statusFilter }),
        ...(dateFilter && { date: dateFilter }),
      }
      const response = await api.get('/appointments', { params })
      setAppointments(response.data.data || [])
      setTotalPages(response.data.pages || 1)
    } catch (error) {
      console.error('Error fetching appointments:', error)
      setMessage('Error loading appointments')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) return

    try {
      await api.delete(`/appointments/${id}`)
      setMessage('Appointment deleted successfully')
      fetchAppointments()
    } catch (error) {
      setMessage('Error deleting appointment')
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setMessage('Appointment created successfully')
    fetchAppointments()
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Appointments</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Schedule Appointment'}
        </button>
      </div>

      {message && (
        <div className={`alert ${message.includes('Error') ? 'alert-error' : 'alert-success'}`}>
          {message}
        </div>
      )}

      {showForm && <AppointmentForm onSuccess={handleFormSuccess} onCancel={() => setShowForm(false)} />}

      <div className="search-filter">
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => {
            setDateFilter(e.target.value)
            setPage(1)
          }}
        />
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value)
            setPage(1)
          }}
        >
          <option value="">All Status</option>
          <option value="Scheduled">Scheduled</option>
          <option value="Confirmed">Confirmed</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
          <option value="No Show">No Show</option>
        </select>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : appointments.length === 0 ? (
        <div className="card">No appointments found</div>
      ) : (
        <>
          <div className="card">
            <table className="table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((apt) => (
                  <tr key={apt._id}>
                    <td>{apt.patient?.name || 'N/A'}</td>
                    <td>{apt.doctor?.name || 'N/A'}</td>
                    <td>{new Date(apt.appointmentDate).toLocaleDateString()}</td>
                    <td>{apt.appointmentTime}</td>
                    <td>
                      <span className={`badge badge-${getStatusColor(apt.status)}`}>
                        {apt.status}
                      </span>
                    </td>
                    <td>
                      <Link to={`/appointments/${apt._id}`} className="btn btn-secondary" style={{ marginRight: '5px', padding: '5px 10px', fontSize: '12px' }}>
                        View
                      </Link>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(apt._id)}
                        style={{ padding: '5px 10px', fontSize: '12px' }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                Previous
              </button>
              <span>Page {page} of {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                Next
              </button>
            </div>
          )}
        </>
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

export default Appointments

