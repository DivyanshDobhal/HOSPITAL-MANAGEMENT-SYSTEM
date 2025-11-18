const express = require('express');
const router = express.Router();
const {
  getDoctors,
  getDoctor,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

router.route('/')
  .get(getDoctors)
  .post(createDoctor);

router.route('/:id')
  .get(getDoctor)
  .put(updateDoctor)
  .delete(authorize('admin'), deleteDoctor);

module.exports = router;

