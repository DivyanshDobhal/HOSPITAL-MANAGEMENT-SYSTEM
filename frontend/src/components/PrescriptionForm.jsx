import { useState, useEffect } from 'react'
import api from '../services/api'

const PrescriptionForm = ({ onSuccess, onCancel, initialData }) => {
  const [formData, setFormData] = useState(initialData || {
    patient: '',
    doctor: '',
    appointment: '',
    medications: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }],
    diagnosis: '',
    notes: '',
    status: 'Active',
  })
  const [patients, setPatients] = useState([])
  const [doctors, setDoctors] = useState([])
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchPatients()
    fetchDoctors()
  }, [])

  useEffect(() => {
    if (formData.patient) {
      fetchAppointments()
    }
  }, [formData.patient])

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

  const fetchAppointments = async () => {
    try {
      const response = await api.get(`/appointments?patient=${formData.patient}&limit=1000`)
      setAppointments(response.data.data || [])
    } catch (error) {
      console.error('Error fetching appointments:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleMedicationChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      medications: prev.medications.map((med, i) =>
        i === index ? { ...med, [field]: value } : med
      ),
    }))
  }

  const addMedication = () => {
    setFormData(prev => ({
      ...prev,
      medications: [...prev.medications, { name: '', dosage: '', frequency: '', duration: '', instructions: '' }],
    }))
  }

  const removeMedication = (index) => {
    setFormData(prev => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (initialData) {
        await api.put(`/prescriptions/${initialData._id}`, formData)
      } else {
        await api.post('/prescriptions', formData)
      }
      onSuccess()
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving prescription')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2>{initialData ? 'Edit Prescription' : 'Add New Prescription'}</h2>
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
        <div className="form-group">
          <label>Appointment (Optional)</label>
          <select name="appointment" value={formData.appointment} onChange={handleChange}>
            <option value="">Select Appointment</option>
            {appointments.map(apt => (
              <option key={apt._id} value={apt._id}>
                {new Date(apt.appointmentDate).toLocaleDateString()} - {apt.appointmentTime}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Diagnosis</label>
          <input
            type="text"
            name="diagnosis"
            value={formData.diagnosis}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Medications *</label>
          {formData.medications.map((med, index) => (
            <div key={index} style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '10px', borderRadius: '5px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                <input
                  type="text"
                  placeholder="Medication Name *"
                  value={med.name}
                  onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Dosage * (e.g., 500mg)"
                  value={med.dosage}
                  onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                  required
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                <input
                  type="text"
                  placeholder="Frequency * (e.g., Twice daily)"
                  value={med.frequency}
                  onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Duration * (e.g., 7 days)"
                  value={med.duration}
                  onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
                  required
                />
              </div>
              <input
                type="text"
                placeholder="Instructions (e.g., Take with food)"
                value={med.instructions}
                onChange={(e) => handleMedicationChange(index, 'instructions', e.target.value)}
                style={{ width: '100%', marginBottom: '10px' }}
              />
              {formData.medications.length > 1 && (
                <button type="button" className="btn btn-danger" onClick={() => removeMedication(index)}>
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" className="btn btn-secondary" onClick={addMedication}>
            + Add Medication
          </button>
        </div>
        <div className="form-group">
          <label>Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
          />
        </div>
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : initialData ? 'Update' : 'Create'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default PrescriptionForm

