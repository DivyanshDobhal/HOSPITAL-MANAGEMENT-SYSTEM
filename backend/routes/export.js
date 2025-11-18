const express = require('express');
const router = express.Router();
const {
  exportPatients,
  exportAppointments,
  exportReport,
} = require('../controllers/exportController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/patients', exportPatients);
router.get('/appointments', exportAppointments);
router.get('/report', exportReport);

module.exports = router;

