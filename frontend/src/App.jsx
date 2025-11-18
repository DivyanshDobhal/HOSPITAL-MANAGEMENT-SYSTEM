import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { SocketProvider } from './contexts/SocketContext'
import Landing from './pages/Landing'
import Login from './pages/Login'
import DashboardModern from './pages/DashboardModern'
import Patients from './pages/Patients'
import Doctors from './pages/Doctors'
import Appointments from './pages/Appointments'
import Prescriptions from './pages/Prescriptions'
import PatientDetail from './pages/PatientDetail'
import DoctorDetail from './pages/DoctorDetail'
import AppointmentDetail from './pages/AppointmentDetail'
import PrescriptionDetail from './pages/PrescriptionDetail'
import Messages from './pages/Messages'
import Analytics from './pages/Analytics'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import './App.css'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SocketProvider>
          <Router>
            <div className="App">
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: 'var(--card-bg)',
                    color: 'var(--text-color)',
                    border: '1px solid var(--border-color)',
                  },
                }}
              />
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Login />} />
                <Route
                  path="/*"
                  element={
                    <ProtectedRoute>
                      <Navbar />
                      <Routes>
                        <Route path="/dashboard" element={<DashboardModern />} />
                        <Route path="/patients" element={<Patients />} />
                        <Route path="/patients/:id" element={<PatientDetail />} />
                        <Route path="/doctors" element={<Doctors />} />
                        <Route path="/doctors/:id" element={<DoctorDetail />} />
                        <Route path="/appointments" element={<Appointments />} />
                        <Route path="/appointments/:id" element={<AppointmentDetail />} />
                        <Route path="/prescriptions" element={<Prescriptions />} />
                        <Route path="/prescriptions/:id" element={<PrescriptionDetail />} />
                        <Route path="/messages" element={<Messages />} />
                        <Route path="/analytics" element={<Analytics />} />
                      </Routes>
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </div>
          </Router>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App

