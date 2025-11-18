const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');

// @desc    Get dashboard statistics with aggregation
// @route   GET /api/analytics/dashboard
// @access  Private
exports.getDashboardStats = async (req, res, next) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    // Patient statistics with aggregation
    const patientStats = await Patient.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Patient age distribution
    const ageDistribution = await Patient.aggregate([
      {
        $bucket: {
          groupBy: '$age',
          boundaries: [0, 18, 30, 45, 60, 100],
          default: '100+',
          output: {
            count: { $sum: 1 },
            avgAge: { $avg: '$age' },
          },
        },
      },
    ]);

    // Gender distribution
    const genderDistribution = await Patient.aggregate([
      {
        $group: {
          _id: '$gender',
          count: { $sum: 1 },
        },
      },
    ]);

    // Doctor statistics
    const doctorStats = await Doctor.aggregate([
      {
        $group: {
          _id: '$specialty',
          count: { $sum: 1 },
          avgExperience: { $avg: '$experience' },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    // Appointment statistics
    const appointmentStats = await Appointment.aggregate([
      {
        $match: {
          appointmentDate: { $gte: startOfMonth },
        },
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Appointments by day of week
    const appointmentsByDay = await Appointment.aggregate([
      {
        $match: {
          appointmentDate: { $gte: startOfMonth },
        },
      },
      {
        $group: {
          _id: { $dayOfWeek: '$appointmentDate' },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Monthly appointment trends
    const monthlyTrends = await Appointment.aggregate([
      {
        $match: {
          appointmentDate: { $gte: startOfYear },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$appointmentDate' },
            month: { $month: '$appointmentDate' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
    ]);

    // Prescription statistics
    const prescriptionStats = await Prescription.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth },
        },
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Most prescribed medications
    const topMedications = await Prescription.aggregate([
      {
        $unwind: '$medications',
      },
      {
        $group: {
          _id: '$medications.name',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    // Patient with most appointments
    const topPatients = await Appointment.aggregate([
      {
        $group: {
          _id: '$patient',
          appointmentCount: { $sum: 1 },
        },
      },
      {
        $sort: { appointmentCount: -1 },
      },
      {
        $limit: 10,
      },
      {
        $lookup: {
          from: 'patients',
          localField: '_id',
          foreignField: '_id',
          as: 'patientInfo',
        },
      },
      {
        $unwind: '$patientInfo',
      },
      {
        $project: {
          patientName: '$patientInfo.name',
          appointmentCount: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        patientStats,
        ageDistribution,
        genderDistribution,
        doctorStats,
        appointmentStats,
        appointmentsByDay,
        monthlyTrends,
        prescriptionStats,
        topMedications,
        topPatients,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get advanced patient analytics
// @route   GET /api/analytics/patients
// @access  Private
exports.getPatientAnalytics = async (req, res, next) => {
  try {
    const { startDate, endDate, groupBy } = req.query;

    const matchStage = {};
    if (startDate || endDate) {
      matchStage.createdAt = {};
      if (startDate) matchStage.createdAt.$gte = new Date(startDate);
      if (endDate) matchStage.createdAt.$lte = new Date(endDate);
    }

    // Patient registration trends
    const registrationTrends = await Patient.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: groupBy === 'day' ? { $dayOfMonth: '$createdAt' } : null,
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 },
      },
    ]);

    // Patients by blood group
    const bloodGroupStats = await Patient.aggregate([
      {
        $group: {
          _id: '$medicalHistory.bloodGroup',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    // Patients with chronic conditions
    const chronicConditions = await Patient.aggregate([
      {
        $unwind: {
          path: '$medicalHistory.chronicConditions',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: '$medicalHistory.chronicConditions',
          count: { $sum: 1 },
        },
      },
      {
        $match: { _id: { $ne: null } },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    // Patients by city
    const patientsByCity = await Patient.aggregate([
      {
        $group: {
          _id: '$contactInfo.address.city',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        registrationTrends,
        bloodGroupStats,
        chronicConditions,
        patientsByCity,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get appointment analytics
// @route   GET /api/analytics/appointments
// @access  Private
exports.getAppointmentAnalytics = async (req, res, next) => {
  try {
    const { startDate, endDate, doctorId, status } = req.query;

    const matchStage = {};
    if (startDate || endDate) {
      matchStage.appointmentDate = {};
      if (startDate) matchStage.appointmentDate.$gte = new Date(startDate);
      if (endDate) matchStage.appointmentDate.$lte = new Date(endDate);
    }
    if (doctorId) matchStage.doctor = doctorId;
    if (status) matchStage.status = status;

    // Appointments by doctor
    const appointmentsByDoctor = await Appointment.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$doctor',
          count: { $sum: 1 },
          totalDuration: { $sum: '$duration' },
        },
      },
      {
        $lookup: {
          from: 'doctors',
          localField: '_id',
          foreignField: '_id',
          as: 'doctorInfo',
        },
      },
      {
        $unwind: '$doctorInfo',
      },
      {
        $project: {
          doctorName: '$doctorInfo.name',
          specialty: '$doctorInfo.specialty',
          count: 1,
          totalDuration: 1,
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    // Average appointment duration by specialty
    const avgDurationBySpecialty = await Appointment.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: 'doctors',
          localField: 'doctor',
          foreignField: '_id',
          as: 'doctorInfo',
        },
      },
      {
        $unwind: '$doctorInfo',
      },
      {
        $group: {
          _id: '$doctorInfo.specialty',
          avgDuration: { $avg: '$duration' },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { avgDuration: -1 },
      },
    ]);

    // Appointment completion rate
    const completionRate = await Appointment.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: {
            $sum: {
              $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0],
            },
          },
          cancelled: {
            $sum: {
              $cond: [{ $eq: ['$status', 'Cancelled'] }, 1, 0],
            },
          },
          noShow: {
            $sum: {
              $cond: [{ $eq: ['$status', 'No Show'] }, 1, 0],
            },
          },
        },
      },
    ]);

    // Busiest time slots
    const busiestTimeSlots = await Appointment.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            $substr: ['$appointmentTime', 0, 2], // Extract hour
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        appointmentsByDoctor,
        avgDurationBySpecialty,
        completionRate: completionRate[0] || {},
        busiestTimeSlots,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get revenue/performance metrics (if applicable)
// @route   GET /api/analytics/performance
// @access  Private
exports.getPerformanceMetrics = async (req, res, next) => {
  try {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // New patients this month vs last month
    const patientGrowth = await Patient.aggregate([
      {
        $facet: {
          thisMonth: [
            {
              $match: {
                createdAt: { $gte: thisMonth },
              },
            },
            {
              $count: 'count',
            },
          ],
          lastMonth: [
            {
              $match: {
                createdAt: { $gte: lastMonth, $lt: thisMonth },
              },
            },
            {
              $count: 'count',
            },
          ],
        },
      },
    ]);

    // Appointment trends
    const appointmentTrends = await Appointment.aggregate([
      {
        $facet: {
          thisMonth: [
            {
              $match: {
                appointmentDate: { $gte: thisMonth },
              },
            },
            {
              $count: 'count',
            },
          ],
          lastMonth: [
            {
              $match: {
                appointmentDate: { $gte: lastMonth, $lt: thisMonth },
              },
            },
            {
              $count: 'count',
            },
          ],
        },
      },
    ]);

    // Doctor utilization (appointments per doctor)
    const doctorUtilization = await Doctor.aggregate([
      {
        $lookup: {
          from: 'appointments',
          localField: '_id',
          foreignField: 'doctor',
          as: 'appointments',
        },
      },
      {
        $project: {
          name: 1,
          specialty: 1,
          appointmentCount: { $size: '$appointments' },
          activeAppointments: {
            $size: {
              $filter: {
                input: '$appointments',
                as: 'apt',
                cond: { $ne: ['$$apt.status', 'Cancelled'] },
              },
            },
          },
        },
      },
      {
        $sort: { appointmentCount: -1 },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        patientGrowth,
        appointmentTrends,
        doctorUtilization,
      },
    });
  } catch (error) {
    next(error);
  }
};

