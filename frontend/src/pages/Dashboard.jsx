import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import './Dashboard.css'

const Dashboard = () => {
  const [stats, setStats] = useState({
    patients: 0,
    doctors: 0,
    appointments: 0,
    prescriptions: 0,
  })
  const [loading, setLoading] = useState(true)
  const [recentAppointments, setRecentAppointments] = useState([])

  useEffect(() => {
    fetchStats()
    fetchRecentAppointments()
  }, [])

  const fetchStats = async () => {
    try {
      const [patientsRes, doctorsRes, appointmentsRes, prescriptionsRes] = await Promise.all([
        api.get('/patients?limit=1'),
        api.get('/doctors?limit=1'),
        api.get('/appointments?limit=1'),
        api.get('/prescriptions?limit=1'),
      ])

      setStats({
        patients: patientsRes.data.total,
        doctors: doctorsRes.data.total,
        appointments: appointmentsRes.data.total,
        prescriptions: prescriptionsRes.data.total,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRecentAppointments = async () => {
    try {
      const response = await api.get('/appointments?limit=5&sort=appointmentDate')
      setRecentAppointments(response.data.data || [])
    } catch (error) {
      console.error('Error fetching appointments:', error)
    }
  }

  if (loading) {
    return <div className="container">Loading...</div>
  }

  return (
    <div className="container">
      <h1>Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Patients</h3>
          <p className="stat-number">{stats.patients}</p>
          <Link to="/patients" className="stat-link">View All →</Link>
        </div>
        <div className="stat-card">
          <h3>Doctors</h3>
          <p className="stat-number">{stats.doctors}</p>
          <Link to="/doctors" className="stat-link">View All →</Link>
        </div>
        <div className="stat-card">
          <h3>Appointments</h3>
          <p className="stat-number">{stats.appointments}</p>
          <Link to="/appointments" className="stat-link">View All →</Link>
        </div>
        <div className="stat-card">
          <h3>Prescriptions</h3>
          <p className="stat-number">{stats.prescriptions}</p>
          <Link to="/prescriptions" className="stat-link">View All →</Link>
        </div>
      </div>

      <div className="card">
        <h2>Recent Appointments</h2>
        {recentAppointments.length === 0 ? (
          <p>No appointments found</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentAppointments.map((apt) => (
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
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
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

export default Dashboard

