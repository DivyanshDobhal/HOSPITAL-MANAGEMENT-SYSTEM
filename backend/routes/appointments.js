const express = require('express');
const router = express.Router();
const {
  getAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAvailableSlots,
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

router.get('/available-slots', getAvailableSlots);

router.route('/')
  .get(getAppointments)
  .post(createAppointment);

router.route('/:id')
  .get(getAppointment)
  .put(updateAppointment)
  .delete(deleteAppointment);

module.exports = router;

