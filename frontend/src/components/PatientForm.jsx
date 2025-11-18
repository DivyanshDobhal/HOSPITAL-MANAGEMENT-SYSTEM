import { useState } from 'react'
import api from '../services/api'

const PatientForm = ({ onSuccess, onCancel, initialData }) => {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    age: '',
    gender: '',
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
    medicalHistory: {
      allergies: [],
      chronicConditions: [],
      previousSurgeries: [],
      medications: [],
      bloodGroup: '',
    },
    emergencyContact: {
      name: '',
      relationship: '',
      phone: '',
    },
    status: 'Active',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (initialData) {
        await api.put(`/patients/${initialData._id}`, formData)
      } else {
        await api.post('/patients', formData)
      }
      onSuccess()
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving patient')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2>{initialData ? 'Edit Patient' : 'Add New Patient'}</h2>
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div className="form-group">
            <label>Age *</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
              min="0"
              max="150"
            />
          </div>
          <div className="form-group">
            <label>Gender *</label>
            <select name="gender" value={formData.gender} onChange={handleChange} required>
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
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
          <label>Email</label>
          <input
            type="email"
            name="contactInfo.email"
            value={formData.contactInfo.email}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Blood Group</label>
          <select name="medicalHistory.bloodGroup" value={formData.medicalHistory.bloodGroup} onChange={handleChange}>
            <option value="">Select</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="Unknown">Unknown</option>
          </select>
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

export default PatientForm

