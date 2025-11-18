import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import DoctorForm from '../components/DoctorForm'

const Doctors = () => {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')
  const [specialtyFilter, setSpecialtyFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchDoctors()
  }, [page, search, specialtyFilter])

  const fetchDoctors = async () => {
    try {
      setLoading(true)
      const params = {
        page,
        limit: 10,
        ...(search && { search }),
        ...(specialtyFilter && { specialty: specialtyFilter }),
      }
      const response = await api.get('/doctors', { params })
      setDoctors(response.data.data || [])
      setTotalPages(response.data.pages || 1)
    } catch (error) {
      console.error('Error fetching doctors:', error)
      setMessage('Error loading doctors')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this doctor?')) return

    try {
      await api.delete(`/doctors/${id}`)
      setMessage('Doctor deleted successfully')
      fetchDoctors()
    } catch (error) {
      setMessage('Error deleting doctor')
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setMessage('Doctor created successfully')
    fetchDoctors()
  }

  const specialties = [
    'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Dermatology',
    'Oncology', 'Psychiatry', 'General Medicine', 'Surgery', 'Emergency Medicine',
    'Radiology', 'Anesthesiology', 'Other'
  ]

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Doctors</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Doctor'}
        </button>
      </div>

      {message && (
        <div className={`alert ${message.includes('Error') ? 'alert-error' : 'alert-success'}`}>
          {message}
        </div>
      )}

      {showForm && <DoctorForm onSuccess={handleFormSuccess} onCancel={() => setShowForm(false)} />}

      <div className="search-filter">
        <input
          type="text"
          placeholder="Search by name or specialty..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          style={{ flex: 1, minWidth: '200px' }}
        />
        <select
          value={specialtyFilter}
          onChange={(e) => {
            setSpecialtyFilter(e.target.value)
            setPage(1)
          }}
        >
          <option value="">All Specialties</option>
          {specialties.map(spec => (
            <option key={spec} value={spec}>{spec}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : doctors.length === 0 ? (
        <div className="card">No doctors found</div>
      ) : (
        <>
          <div className="card">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Specialty</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((doctor) => (
                  <tr key={doctor._id}>
                    <td>
                      <Link to={`/doctors/${doctor._id}`} style={{ color: '#007bff', textDecoration: 'none' }}>
                        {doctor.name}
                      </Link>
                    </td>
                    <td>{doctor.specialty}</td>
                    <td>{doctor.contactInfo?.phone || 'N/A'}</td>
                    <td>{doctor.contactInfo?.email || 'N/A'}</td>
                    <td>
                      <span className={`badge badge-${doctor.status === 'Active' ? 'success' : 'warning'}`}>
                        {doctor.status}
                      </span>
                    </td>
                    <td>
                      <Link to={`/doctors/${doctor._id}`} className="btn btn-secondary" style={{ marginRight: '5px', padding: '5px 10px', fontSize: '12px' }}>
                        View
                      </Link>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(doctor._id)}
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

export default Doctors

