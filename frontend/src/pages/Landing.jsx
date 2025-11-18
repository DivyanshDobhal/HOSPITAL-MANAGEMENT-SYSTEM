import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaHospital, FaUserMd, FaCalendarCheck, FaFilePrescription, FaShieldAlt, FaChartLine } from 'react-icons/fa'
import './Landing.css'

const Landing = () => {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="hero-icon">
            <FaHospital />
          </div>
          <h1 className="hero-title">Hospital Management System</h1>
          <p className="hero-subtitle">
            Streamline your hospital operations with our comprehensive management solution.
            Manage patients, doctors, appointments, and prescriptions all in one place.
          </p>
          <div className="hero-cta">
            <Link to="/login" className="btn btn-primary btn-large">
              Get Started
            </Link>
            <Link to="/register" className="btn btn-secondary btn-large">
              Register Now
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Key Features</h2>
          <div className="features-grid">
            <motion.div
              className="feature-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="feature-icon">
                <FaUserMd />
              </div>
              <h3>Patient Management</h3>
              <p>Comprehensive patient records with medical history, allergies, and emergency contacts.</p>
            </motion.div>

            <motion.div
              className="feature-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="feature-icon">
                <FaCalendarCheck />
              </div>
              <h3>Appointment Scheduling</h3>
              <p>Smart scheduling system with automatic conflict detection and availability management.</p>
            </motion.div>

            <motion.div
              className="feature-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="feature-icon">
                <FaFilePrescription />
              </div>
              <h3>Prescription Management</h3>
              <p>Digital prescriptions with medication tracking and dosage management.</p>
            </motion.div>

            <motion.div
              className="feature-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <div className="feature-icon">
                <FaChartLine />
              </div>
              <h3>Analytics Dashboard</h3>
              <p>Real-time insights and statistics to help you make informed decisions.</p>
            </motion.div>

            <motion.div
              className="feature-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <div className="feature-icon">
                <FaShieldAlt />
              </div>
              <h3>Secure & Private</h3>
              <p>HIPAA-compliant security with role-based access control and data encryption.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <motion.div
          className="cta-content"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2>Ready to Get Started?</h2>
          <p>Join thousands of healthcare professionals using our system</p>
          <div className="cta-buttons">
            <Link to="/register" className="btn btn-primary btn-large">
              Create Free Account
            </Link>
            <Link to="/login" className="btn btn-outline btn-large">
              Sign In
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  )
}

export default Landing

