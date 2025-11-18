import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import DoctorForm from '../components/DoctorForm'

const DoctorDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [doctor, setDoctor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)

  useEffect(() => {
    fetchDoctor()
  }, [id])

  const fetchDoctor = async () => {
    try {
      const response = await api.get(`/doctors/${id}`)
      setDoctor(response.data.data)
    } catch (error) {
      console.error('Error fetching doctor:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFormSuccess = () => {
    setEditMode(false)
    fetchDoctor()
  }

  if (loading) return <div className="container">Loading...</div>
  if (!doctor) return <div className="container">Doctor not found</div>

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Doctor Details</h1>
        <div>
          <button className="btn btn-secondary" onClick={() => navigate('/doctors')} style={{ marginRight: '10px' }}>
            Back
          </button>
          <button className="btn btn-primary" onClick={() => setEditMode(!editMode)}>
            {editMode ? 'Cancel Edit' : 'Edit'}
          </button>
        </div>
      </div>

      {editMode ? (
        <DoctorForm initialData={doctor} onSuccess={handleFormSuccess} onCancel={() => setEditMode(false)} />
      ) : (
        <div className="card">
          <h2>{doctor.name}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
            <div>
              <strong>Specialty:</strong> {doctor.specialty}
            </div>
            <div>
              <strong>Phone:</strong> {doctor.contactInfo?.phone || 'N/A'}
            </div>
            <div>
              <strong>Email:</strong> {doctor.contactInfo?.email || 'N/A'}
            </div>
            <div>
              <strong>Status:</strong> <span className={`badge badge-${doctor.status === 'Active' ? 'success' : 'warning'}`}>{doctor.status}</span>
            </div>
            {doctor.experience && (
              <div>
                <strong>Experience:</strong> {doctor.experience} years
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default DoctorDetail

