import { useState } from 'react'
import api from '../services/api'

const DoctorForm = ({ onSuccess, onCancel, initialData }) => {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    specialty: '',
    contactInfo: {
      phone: '',
      email: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
      },
    },
    qualifications: [],
    licenseNumber: '',
    experience: 0,
    availability: {
      days: [],
      startTime: '09:00',
      endTime: '17:00',
    },
    status: 'Active',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const specialties = [
    'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Dermatology',
    'Oncology', 'Psychiatry', 'General Medicine', 'Surgery', 'Emergency Medicine',
    'Radiology', 'Anesthesiology', 'Other'
  ]

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name.includes('.')) {
      const [parent, child, grandchild] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: grandchild ? {
            ...prev[parent][child],
            [grandchild]: value,
          } : value,
        },
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleDayToggle = (day) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        days: prev.availability.days.includes(day)
          ? prev.availability.days.filter(d => d !== day)
          : [...prev.availability.days, day],
      },
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (initialData) {
        await api.put(`/doctors/${initialData._id}`, formData)
      } else {
        await api.post('/doctors', formData)
      }
      onSuccess()
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving doctor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2>{initialData ? 'Edit Doctor' : 'Add New Doctor'}</h2>
      {error && <div className="alert alert-error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Specialty *</label>
          <select name="specialty" value={formData.specialty} onChange={handleChange} required>
            <option value="">Select Specialty</option>
            {specialties.map(spec => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div className="form-group">
            <label>Phone *</label>
            <input
              type="tel"
              name="contactInfo.phone"
              value={formData.contactInfo.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="contactInfo.email"
              value={formData.contactInfo.email}
              onChange={handleChange}
              required
            />
          </div>
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

export default DoctorForm

