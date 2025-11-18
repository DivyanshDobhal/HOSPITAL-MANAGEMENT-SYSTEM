const Appointment = require('../models/Appointment');

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private
exports.getAppointments = async (req, res, next) => {
  try {
    const { patient, doctor, status, date, page = 1, limit = 10 } = req.query;
    const query = {};

    // Filters
    if (patient) query.patient = patient;
    if (doctor) query.doctor = doctor;
    if (status) query.status = status;
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      query.appointmentDate = { $gte: startDate, $lt: endDate };
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const appointments = await Appointment.find(query)
      .populate('patient', 'name age gender contactInfo.phone')
      .populate('doctor', 'name specialty contactInfo.phone')
      .sort({ appointmentDate: 1, appointmentTime: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Appointment.countDocuments(query);

    res.status(200).json({
      success: true,
      count: appointments.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: appointments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single appointment
// @route   GET /api/appointments/:id
// @access  Private
exports.getAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient')
      .populate('doctor');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create appointment
// @route   POST /api/appointments
// @access  Private
exports.createAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.create({
      ...req.body,
      createdBy: req.user.id,
    });

    await appointment.populate('patient', 'name age gender');
    await appointment.populate('doctor', 'name specialty');

    res.status(201).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    // Handle overlapping appointment error
    if (error.message.includes('overlaps')) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Private
exports.updateAppointment = async (req, res, next) => {
  try {
    let appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('patient', 'name age gender')
      .populate('doctor', 'name specialty');

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    // Handle overlapping appointment error
    if (error.message.includes('overlaps')) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private
exports.deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    await appointment.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Appointment deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get available time slots for a doctor on a date
// @route   GET /api/appointments/available-slots
// @access  Private
exports.getAvailableSlots = async (req, res, next) => {
  try {
    const { doctor, date, duration = 30 } = req.query;

    if (!doctor || !date) {
      return res.status(400).json({
        success: false,
        message: 'Doctor ID and date are required',
      });
    }

    const Doctor = require('../models/Doctor');
    const doctorData = await Doctor.findById(doctor);

    if (!doctorData || !doctorData.availability) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found or availability not set',
      });
    }

    const appointmentDate = new Date(date);
    const dayName = appointmentDate.toLocaleDateString('en-US', { weekday: 'long' });

    if (!doctorData.availability.days.includes(dayName)) {
      return res.status(400).json({
        success: false,
        message: `Doctor is not available on ${dayName}`,
      });
    }

    // Get existing appointments for the date
    const startDate = new Date(appointmentDate);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);

    const existingAppointments = await Appointment.find({
      doctor,
      appointmentDate: { $gte: startDate, $lt: endDate },
      status: { $nin: ['Cancelled', 'No Show'] },
    });

    // Generate available slots
    const [startHour, startMin] = doctorData.availability.startTime.split(':').map(Number);
    const [endHour, endMin] = doctorData.availability.endTime.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    const slotDuration = parseInt(duration);

    const availableSlots = [];
    const bookedSlots = existingAppointments.map(apt => {
      const [aptHour, aptMin] = apt.appointmentTime.split(':').map(Number);
      return aptHour * 60 + aptMin;
    });

    for (let time = startMinutes; time + slotDuration <= endMinutes; time += slotDuration) {
      if (!bookedSlots.some(booked => {
        const bookedEnd = booked + (existingAppointments.find(a => {
          const [h, m] = a.appointmentTime.split(':').map(Number);
          return h * 60 + m === booked;
        })?.duration || 30);
        return (time < bookedEnd && time + slotDuration > booked);
      })) {
        const hours = Math.floor(time / 60);
        const minutes = time % 60;
        availableSlots.push(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
      }
    }

    res.status(200).json({
      success: true,
      data: availableSlots,
    });
  } catch (error) {
    next(error);
  }
};

