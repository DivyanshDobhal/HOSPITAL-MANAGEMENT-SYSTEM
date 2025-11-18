import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import PatientForm from '../components/PatientForm'

const PatientDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [patient, setPatient] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)

  useEffect(() => {
    fetchPatient()
  }, [id])

  const fetchPatient = async () => {
    try {
      const response = await api.get(`/patients/${id}`)
      setPatient(response.data.data)
    } catch (error) {
      console.error('Error fetching patient:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFormSuccess = () => {
    setEditMode(false)
    fetchPatient()
  }

  if (loading) return <div className="container">Loading...</div>
  if (!patient) return <div className="container">Patient not found</div>

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Patient Details</h1>
        <div>
          <button className="btn btn-secondary" onClick={() => navigate('/patients')} style={{ marginRight: '10px' }}>
            Back
          </button>
          <button className="btn btn-primary" onClick={() => setEditMode(!editMode)}>
            {editMode ? 'Cancel Edit' : 'Edit'}
          </button>
        </div>
      </div>

      {editMode ? (
        <PatientForm initialData={patient} onSuccess={handleFormSuccess} onCancel={() => setEditMode(false)} />
      ) : (
        <div className="card">
          <h2>{patient.name}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
            <div>
              <strong>Age:</strong> {patient.age}
            </div>
            <div>
              <strong>Gender:</strong> {patient.gender}
            </div>
            <div>
              <strong>Status:</strong> <span className={`badge badge-${patient.status === 'Active' ? 'success' : 'warning'}`}>{patient.status}</span>
            </div>
            <div>
              <strong>Phone:</strong> {patient.contactInfo?.phone || 'N/A'}
            </div>
            <div>
              <strong>Email:</strong> {patient.contactInfo?.email || 'N/A'}
            </div>
            <div>
              <strong>Blood Group:</strong> {patient.medicalHistory?.bloodGroup || 'N/A'}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PatientDetail

