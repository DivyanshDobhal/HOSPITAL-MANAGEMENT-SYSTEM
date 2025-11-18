import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import PatientForm from '../components/PatientForm'

const Patients = () => {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchPatients()
  }, [page, search, statusFilter])

  const fetchPatients = async () => {
    try {
      setLoading(true)
      const params = {
        page,
        limit: 10,
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter }),
      }
      const response = await api.get('/patients', { params })
      setPatients(response.data.data || [])
      setTotalPages(response.data.pages || 1)
    } catch (error) {
      console.error('Error fetching patients:', error)
      setMessage('Error loading patients')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this patient?')) return

    try {
      await api.delete(`/patients/${id}`)
      setMessage('Patient deleted successfully')
      fetchPatients()
    } catch (error) {
      setMessage('Error deleting patient')
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setMessage('Patient created successfully')
    fetchPatients()
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Patients</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Patient'}
        </button>
      </div>

      {message && (
        <div className={`alert ${message.includes('Error') ? 'alert-error' : 'alert-success'}`}>
          {message}
        </div>
      )}

      {showForm && <PatientForm onSuccess={handleFormSuccess} onCancel={() => setShowForm(false)} />}

      <div className="search-filter">
        <input
          type="text"
          placeholder="Search by name or phone..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          style={{ flex: 1, minWidth: '200px' }}
        />
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value)
            setPage(1)
          }}
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Discharged">Discharged</option>
          <option value="Deceased">Deceased</option>
        </select>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : patients.length === 0 ? (
        <div className="card">No patients found</div>
      ) : (
        <>
          <div className="card">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr key={patient._id}>
                    <td>
                      <Link to={`/patients/${patient._id}`} style={{ color: '#007bff', textDecoration: 'none' }}>
                        {patient.name}
                      </Link>
                    </td>
                    <td>{patient.age}</td>
                    <td>{patient.gender}</td>
                    <td>{patient.contactInfo?.phone || 'N/A'}</td>
                    <td>
                      <span className={`badge badge-${patient.status === 'Active' ? 'success' : 'warning'}`}>
                        {patient.status}
                      </span>
                    </td>
                    <td>
                      <Link to={`/patients/${patient._id}`} className="btn btn-secondary" style={{ marginRight: '5px', padding: '5px 10px', fontSize: '12px' }}>
                        View
                      </Link>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(patient._id)}
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

export default Patients

