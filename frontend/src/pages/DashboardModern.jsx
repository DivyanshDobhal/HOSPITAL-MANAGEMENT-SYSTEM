import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
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
import { FaUsers, FaUserMd, FaCalendarCheck, FaFilePrescription, FaArrowUp, FaArrowDown } from 'react-icons/fa'
import api from '../services/api'
import './DashboardModern.css'

const DashboardModern = () => {
  const [stats, setStats] = useState({
    patients: { total: 0, change: 0 },
    doctors: { total: 0, change: 0 },
    appointments: { total: 0, change: 0 },
    prescriptions: { total: 0, change: 0 },
  })
  const [loading, setLoading] = useState(true)
  const [appointmentData, setAppointmentData] = useState([])
  const [patientAgeData, setPatientAgeData] = useState([])
  const [specialtyData, setSpecialtyData] = useState([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [patientsRes, doctorsRes, appointmentsRes, prescriptionsRes] = await Promise.all([
        api.get('/patients?limit=1'),
        api.get('/doctors?limit=1'),
        api.get('/appointments?limit=100'),
        api.get('/prescriptions?limit=1'),
      ])

      setStats({
        patients: { total: patientsRes.data.total || 0, change: 5.2 },
        doctors: { total: doctorsRes.data.total || 0, change: 2.1 },
        appointments: { total: appointmentsRes.data.total || 0, change: -3.4 },
        prescriptions: { total: prescriptionsRes.data.total || 0, change: 8.7 },
      })

      // Process appointment data for charts
      const appointments = appointmentsRes.data.data || []
      const statusCounts = {}
      appointments.forEach(apt => {
        statusCounts[apt.status] = (statusCounts[apt.status] || 0) + 1
      })
      setAppointmentData(Object.entries(statusCounts).map(([name, value]) => ({ name, value })))

      // Process patient age data
      const patients = await api.get('/patients?limit=100')
      const ageGroups = { '0-18': 0, '19-35': 0, '36-50': 0, '51-65': 0, '65+': 0 }
      patients.data.data?.forEach(patient => {
        const age = patient.age
        if (age <= 18) ageGroups['0-18']++
        else if (age <= 35) ageGroups['19-35']++
        else if (age <= 50) ageGroups['36-50']++
        else if (age <= 65) ageGroups['51-65']++
        else ageGroups['65+']++
      })
      setPatientAgeData(Object.entries(ageGroups).map(([name, value]) => ({ name, value })))

      // Process specialty data
      const doctors = await api.get('/doctors?limit=100')
      const specialties = {}
      doctors.data.data?.forEach(doctor => {
        specialties[doctor.specialty] = (specialties[doctor.specialty] || 0) + 1
      })
      setSpecialtyData(Object.entries(specialties).map(([name, value]) => ({ name, value })))
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe']

  const StatCard = ({ icon: Icon, title, value, change, link }) => (
    <motion.div
      className="stat-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={link} className="stat-link">
        <div className="stat-icon">
          <Icon />
        </div>
        <div className="stat-content">
          <h3>{title}</h3>
          <div className="stat-value">{value}</div>
          <div className={`stat-change ${change >= 0 ? 'positive' : 'negative'}`}>
            {change >= 0 ? <FaArrowUp /> : <FaArrowDown />}
            {Math.abs(change)}% from last month
          </div>
        </div>
      </Link>
    </motion.div>
  )

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="dashboard-modern">
      <div className="container">
        <h1>Dashboard</h1>

        {/* Stats Grid */}
        <div className="stats-grid">
          <StatCard
            icon={FaUsers}
            title="Patients"
            value={stats.patients.total}
            change={stats.patients.change}
            link="/patients"
          />
          <StatCard
            icon={FaUserMd}
            title="Doctors"
            value={stats.doctors.total}
            change={stats.doctors.change}
            link="/doctors"
          />
          <StatCard
            icon={FaCalendarCheck}
            title="Appointments"
            value={stats.appointments.total}
            change={stats.appointments.change}
            link="/appointments"
          />
          <StatCard
            icon={FaFilePrescription}
            title="Prescriptions"
            value={stats.prescriptions.total}
            change={stats.prescriptions.change}
            link="/prescriptions"
          />
        </div>

        {/* Charts Grid */}
        <div className="charts-grid">
          <motion.div
            className="chart-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2>Appointments by Status</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={appointmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {appointmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            className="chart-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2>Patient Age Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={patientAgeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#667eea" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            className="chart-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2>Doctors by Specialty</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={specialtyData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#764ba2" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default DashboardModern

