import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import PrescriptionForm from '../components/PrescriptionForm'

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchPrescriptions()
  }, [page, statusFilter])

  const fetchPrescriptions = async () => {
    try {
      setLoading(true)
      const params = {
        page,
        limit: 10,
        ...(statusFilter && { status: statusFilter }),
      }
      const response = await api.get('/prescriptions', { params })
      setPrescriptions(response.data.data || [])
      setTotalPages(response.data.pages || 1)
    } catch (error) {
      console.error('Error fetching prescriptions:', error)
      setMessage('Error loading prescriptions')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this prescription?')) return

    try {
      await api.delete(`/prescriptions/${id}`)
      setMessage('Prescription deleted successfully')
      fetchPrescriptions()
    } catch (error) {
      setMessage('Error deleting prescription')
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setMessage('Prescription created successfully')
    fetchPrescriptions()
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Prescriptions</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Prescription'}
        </button>
      </div>

      {message && (
        <div className={`alert ${message.includes('Error') ? 'alert-error' : 'alert-success'}`}>
          {message}
        </div>
      )}

      {showForm && <PrescriptionForm onSuccess={handleFormSuccess} onCancel={() => setShowForm(false)} />}

      <div className="search-filter">
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value)
            setPage(1)
          }}
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : prescriptions.length === 0 ? (
        <div className="card">No prescriptions found</div>
      ) : (
        <>
          <div className="card">
            <table className="table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Diagnosis</th>
                  <th>Medications</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {prescriptions.map((prescription) => (
                  <tr key={prescription._id}>
                    <td>{prescription.patient?.name || 'N/A'}</td>
                    <td>{prescription.doctor?.name || 'N/A'}</td>
                    <td>{prescription.diagnosis || 'N/A'}</td>
                    <td>{prescription.medications?.length || 0} medication(s)</td>
                    <td>
                      <span className={`badge badge-${prescription.status === 'Active' ? 'success' : 'warning'}`}>
                        {prescription.status}
                      </span>
                    </td>
                    <td>
                      <Link to={`/prescriptions/${prescription._id}`} className="btn btn-secondary" style={{ marginRight: '5px', padding: '5px 10px', fontSize: '12px' }}>
                        View
                      </Link>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(prescription._id)}
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

export default Prescriptions

