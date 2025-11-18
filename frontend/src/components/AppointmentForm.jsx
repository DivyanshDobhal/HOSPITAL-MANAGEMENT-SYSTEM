import { useState, useEffect } from 'react'
import api from '../services/api'

const AppointmentForm = ({ onSuccess, onCancel, initialData }) => {
  const [formData, setFormData] = useState(initialData || {
    patient: '',
    doctor: '',
    appointmentDate: '',
    appointmentTime: '',
    duration: 30,
    reason: '',
    status: 'Scheduled',
  })
  const [patients, setPatients] = useState([])
  const [doctors, setDoctors] = useState([])
  const [availableSlots, setAvailableSlots] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchPatients()
    fetchDoctors()
  }, [])

  useEffect(() => {
    if (formData.doctor && formData.appointmentDate) {
      fetchAvailableSlots()
    }
  }, [formData.doctor, formData.appointmentDate])

  const fetchPatients = async () => {
    try {
      const response = await api.get('/patients?limit=1000')
      setPatients(response.data.data || [])
    } catch (error) {
      console.error('Error fetching patients:', error)
    }
  }

  const fetchDoctors = async () => {
    try {
      const response = await api.get('/doctors?limit=1000')
      setDoctors(response.data.data || [])
    } catch (error) {
      console.error('Error fetching doctors:', error)
    }
  }

  const fetchAvailableSlots = async () => {
    try {
      const response = await api.get('/appointments/available-slots', {
        params: {
          doctor: formData.doctor,
          date: formData.appointmentDate,
          duration: formData.duration,
        },
      })
      setAvailableSlots(response.data.data || [])
    } catch (error) {
      console.error('Error fetching available slots:', error)
      setAvailableSlots([])
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (initialData) {
        await api.put(`/appointments/${initialData._id}`, formData)
      } else {
        await api.post('/appointments', formData)
      }
      onSuccess()
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving appointment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2>{initialData ? 'Edit Appointment' : 'Schedule New Appointment'}</h2>
      {error && <div className="alert alert-error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div className="form-group">
            <label>Patient *</label>
            <select name="patient" value={formData.patient} onChange={handleChange} required>
              <option value="">Select Patient</option>
              {patients.map(patient => (
                <option key={patient._id} value={patient._id}>{patient.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Doctor *</label>
            <select name="doctor" value={formData.doctor} onChange={handleChange} required>
              <option value="">Select Doctor</option>
              {doctors.map(doctor => (
                <option key={doctor._id} value={doctor._id}>{doctor.name} - {doctor.specialty}</option>
              ))}
            </select>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
          <div className="form-group">
            <label>Date *</label>
            <input
              type="date"
              name="appointmentDate"
              value={formData.appointmentDate}
              onChange={handleChange}
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div className="form-group">
            <label>Time *</label>
            {availableSlots.length > 0 ? (
              <select name="appointmentTime" value={formData.appointmentTime} onChange={handleChange} required>
                <option value="">Select Time</option>
                {availableSlots.map(slot => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            ) : (
              <input
                type="time"
                name="appointmentTime"
                value={formData.appointmentTime}
                onChange={handleChange}
                required
              />
            )}
          </div>
          <div className="form-group">
            <label>Duration (minutes) *</label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              required
              min="15"
              max="240"
            />
          </div>
        </div>
        <div className="form-group">
          <label>Reason</label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
          />
        </div>
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : initialData ? 'Update' : 'Schedule'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default AppointmentForm

