import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import PrescriptionForm from '../components/PrescriptionForm'

const PrescriptionDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [prescription, setPrescription] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)

  useEffect(() => {
    fetchPrescription()
  }, [id])

  const fetchPrescription = async () => {
    try {
      const response = await api.get(`/prescriptions/${id}`)
      setPrescription(response.data.data)
    } catch (error) {
      console.error('Error fetching prescription:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFormSuccess = () => {
    setEditMode(false)
    fetchPrescription()
  }

  if (loading) return <div className="container">Loading...</div>
  if (!prescription) return <div className="container">Prescription not found</div>

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Prescription Details</h1>
        <div>
          <button className="btn btn-secondary" onClick={() => navigate('/prescriptions')} style={{ marginRight: '10px' }}>
            Back
          </button>
          <button className="btn btn-primary" onClick={() => setEditMode(!editMode)}>
            {editMode ? 'Cancel Edit' : 'Edit'}
          </button>
        </div>
      </div>

      {editMode ? (
        <PrescriptionForm initialData={prescription} onSuccess={handleFormSuccess} onCancel={() => setEditMode(false)} />
      ) : (
        <div className="card">
          <h2>Prescription Information</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
            <div>
              <strong>Patient:</strong> {prescription.patient?.name || 'N/A'}
            </div>
            <div>
              <strong>Doctor:</strong> {prescription.doctor?.name || 'N/A'} ({prescription.doctor?.specialty || 'N/A'})
            </div>
            <div>
              <strong>Status:</strong> <span className={`badge badge-${prescription.status === 'Active' ? 'success' : 'warning'}`}>{prescription.status}</span>
            </div>
            {prescription.diagnosis && (
              <div style={{ gridColumn: '1 / -1' }}>
                <strong>Diagnosis:</strong> {prescription.diagnosis}
              </div>
            )}
          </div>
          {prescription.medications && prescription.medications.length > 0 && (
            <div style={{ marginTop: '30px' }}>
              <h3>Medications</h3>
              <table className="table">
                <thead>
                  <tr>
                    <th>Medication</th>
                    <th>Dosage</th>
                    <th>Frequency</th>
                    <th>Duration</th>
                    <th>Instructions</th>
                  </tr>
                </thead>
                <tbody>
                  {prescription.medications.map((med, index) => (
                    <tr key={index}>
                      <td>{med.name}</td>
                      <td>{med.dosage}</td>
                      <td>{med.frequency}</td>
                      <td>{med.duration}</td>
                      <td>{med.instructions || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {prescription.notes && (
            <div style={{ marginTop: '20px' }}>
              <strong>Notes:</strong> {prescription.notes}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default PrescriptionDetail

