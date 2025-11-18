import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { FaDownload, FaChartLine, FaUsers, FaCalendarCheck } from 'react-icons/fa'
import api from '../services/api'
import toast from 'react-hot-toast'
import './Analytics.css'

const Analytics = () => {
  const [dashboardStats, setDashboardStats] = useState(null)
  const [patientAnalytics, setPatientAnalytics] = useState(null)
  const [appointmentAnalytics, setAppointmentAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  })

  useEffect(() => {
    fetchAllAnalytics()
  }, [dateRange])

  const fetchAllAnalytics = async () => {
    setLoading(true)
    try {
      const [dashboardRes, patientsRes, appointmentsRes] = await Promise.all([
        api.get('/analytics/dashboard'),
        api.get(`/analytics/patients?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`),
        api.get(`/analytics/appointments?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`),
      ])

      setDashboardStats(dashboardRes.data.data)
      setPatientAnalytics(patientsRes.data.data)
      setAppointmentAnalytics(appointmentsRes.data.data)
    } catch (error) {
      toast.error('Error loading analytics')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async (type, format = 'csv') => {
    try {
      toast.loading(`Exporting ${type}...`, { id: 'export' })
      
      const response = await api.get(`/export/${type}?format=${format}&startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`, {
        responseType: 'blob',
      })

      // Get filename from Content-Disposition header or use default
      const contentDisposition = response.headers['content-disposition']
      let filename = `${type}_${new Date().toISOString().split('T')[0]}.${format}`
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i)
        if (filenameMatch) {
          filename = filenameMatch[1]
        }
      }

      // Create blob and download
      const blob = new Blob([response.data], { 
        type: format === 'csv' ? 'text/csv;charset=utf-8;' : 'application/json;charset=utf-8;' 
      })
      
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      toast.success(`Successfully exported ${type}`, { id: 'export' })
    } catch (error) {
      console.error('Export error:', error)
      toast.error(`Error exporting ${type}: ${error.response?.data?.message || error.message}`, { id: 'export' })
    }
  }

  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe', '#43e97b']

  if (loading) {
    return (
      <div className="container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container analytics-page">
      <div className="analytics-header">
        <h1>
          <FaChartLine /> Analytics Dashboard
        </h1>
        <div className="analytics-controls">
          <div className="date-range">
            <label>Start Date:</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
            />
            <label>End Date:</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
            />
          </div>
          <div className="export-buttons">
            <button className="btn btn-secondary" onClick={() => handleExport('patients')}>
              <FaDownload /> Export Patients
            </button>
            <button className="btn btn-secondary" onClick={() => handleExport('appointments')}>
              <FaDownload /> Export Appointments
            </button>
            <button className="btn btn-primary" onClick={() => handleExport('report', 'json')}>
              <FaDownload /> Full Report (JSON)
            </button>
            <button className="btn btn-secondary" onClick={() => handleExport('report', 'csv')}>
              <FaDownload /> Full Report (CSV)
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Statistics */}
      {dashboardStats && (
        <div className="analytics-section">
          <h2>Overview Statistics</h2>
          <div className="stats-grid">
            <motion.div className="stat-card" whileHover={{ scale: 1.02 }}>
              <FaUsers />
              <h3>Patient Status</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={dashboardStats.patientStats}
                    dataKey="count"
                    nameKey="_id"
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    label
                  >
                    {dashboardStats.patientStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div className="stat-card" whileHover={{ scale: 1.02 }}>
              <FaCalendarCheck />
              <h3>Appointment Status</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={dashboardStats.appointmentStats}
                    dataKey="count"
                    nameKey="_id"
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    label
                  >
                    {dashboardStats.appointmentStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        </div>
      )}

      {/* Patient Analytics */}
      {patientAnalytics && (
        <div className="analytics-section">
          <h2>Patient Analytics</h2>
          <div className="charts-grid">
            <motion.div className="chart-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h3>Age Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dashboardStats?.ageDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="_id" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#667eea" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div className="chart-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h3>Gender Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dashboardStats?.genderDistribution}
                    dataKey="count"
                    nameKey="_id"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {dashboardStats?.genderDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>

            {patientAnalytics.bloodGroupStats && (
              <motion.div className="chart-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h3>Blood Group Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={patientAnalytics.bloodGroupStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="_id" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#764ba2" />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* Appointment Analytics */}
      {appointmentAnalytics && (
        <div className="analytics-section">
          <h2>Appointment Analytics</h2>
          <div className="charts-grid">
            {appointmentAnalytics.appointmentsByDoctor && (
              <motion.div className="chart-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h3>Appointments by Doctor</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={appointmentAnalytics.appointmentsByDoctor} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="doctorName" type="category" width={150} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#4facfe" />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            )}

            {appointmentAnalytics.avgDurationBySpecialty && (
              <motion.div className="chart-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h3>Average Duration by Specialty</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={appointmentAnalytics.avgDurationBySpecialty}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="_id" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="avgDuration" fill="#43e97b" />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* Monthly Trends */}
      {dashboardStats?.monthlyTrends && (
        <div className="analytics-section">
          <h2>Monthly Trends</h2>
          <motion.div className="chart-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dashboardStats.monthlyTrends.map(item => ({
                month: `${item._id.month}/${item._id.year}`,
                appointments: item.count,
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="appointments" stroke="#667eea" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default Analytics

