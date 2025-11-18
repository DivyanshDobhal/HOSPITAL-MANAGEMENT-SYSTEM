const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getPatientAnalytics,
  getAppointmentAnalytics,
  getPerformanceMetrics,
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/dashboard', getDashboardStats);
router.get('/patients', getPatientAnalytics);
router.get('/appointments', getAppointmentAnalytics);
router.get('/performance', getPerformanceMetrics);

module.exports = router;

