const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');

// @desc    Export patients to CSV/JSON
// @route   GET /api/export/patients
// @access  Private
exports.exportPatients = async (req, res, next) => {
  try {
    const { format = 'json', ...filters } = req.query;

    // Build query from filters
    const query = {};
    if (filters.status) query.status = filters.status;
    if (filters.gender) query.gender = filters.gender;
    if (filters.minAge) query.age = { ...query.age, $gte: parseInt(filters.minAge) };
    if (filters.maxAge) query.age = { ...query.age, $lte: parseInt(filters.maxAge) };

    const patients = await Patient.find(query)
      .select('name age gender contactInfo medicalHistory.bloodGroup status createdAt')
      .lean();

    if (format === 'csv') {
      // Convert to CSV
      const csvHeader = 'Name,Age,Gender,Phone,Email,Blood Group,Status,Created At\n';
      const csvRows = patients.map(patient => {
        return [
          `"${patient.name || ''}"`,
          patient.age || '',
          patient.gender || '',
          patient.contactInfo?.phone || '',
          patient.contactInfo?.email || '',
          patient.medicalHistory?.bloodGroup || '',
          patient.status || '',
          patient.createdAt ? new Date(patient.createdAt).toLocaleDateString() : '',
        ].join(',');
      }).join('\n');

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename=patients_${new Date().toISOString().split('T')[0]}.csv`);
      res.send('\ufeff' + csvHeader + csvRows); // BOM for Excel compatibility
    } else {
      // JSON format - send as downloadable file
      const jsonData = JSON.stringify({
        success: true,
        count: patients.length,
        exportedAt: new Date(),
        data: patients,
      }, null, 2);

      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename=patients_${new Date().toISOString().split('T')[0]}.json`);
      res.send(jsonData);
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Export appointments to CSV/JSON
// @route   GET /api/export/appointments
// @access  Private
exports.exportAppointments = async (req, res, next) => {
  try {
    const { format = 'json', startDate, endDate, status } = req.query;

    const query = {};
    if (startDate || endDate) {
      query.appointmentDate = {};
      if (startDate) query.appointmentDate.$gte = new Date(startDate);
      if (endDate) query.appointmentDate.$lte = new Date(endDate);
    }
    if (status) query.status = status;

    const appointments = await Appointment.find(query)
      .populate('patient', 'name age')
      .populate('doctor', 'name specialty')
      .lean();

    if (format === 'csv') {
      const csvHeader = 'Date,Time,Patient,Doctor,Specialty,Status,Duration,Reason\n';
      const csvRows = appointments.map(apt => {
        return [
          apt.appointmentDate ? new Date(apt.appointmentDate).toLocaleDateString() : '',
          apt.appointmentTime || '',
          `"${apt.patient?.name || ''}"`,
          `"${apt.doctor?.name || ''}"`,
          apt.doctor?.specialty || '',
          apt.status || '',
          apt.duration || '',
          `"${apt.reason || ''}"`,
        ].join(',');
      }).join('\n');

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename=appointments_${new Date().toISOString().split('T')[0]}.csv`);
      res.send('\ufeff' + csvHeader + csvRows); // BOM for Excel compatibility
    } else {
      // JSON format - send as downloadable file
      const jsonData = JSON.stringify({
        success: true,
        count: appointments.length,
        exportedAt: new Date(),
        dateRange: {
          startDate: startDate || 'All time',
          endDate: endDate || 'All time',
        },
        data: appointments,
      }, null, 2);

      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename=appointments_${new Date().toISOString().split('T')[0]}.json`);
      res.send(jsonData);
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Export comprehensive report
// @route   GET /api/export/report
// @access  Private
exports.exportReport = async (req, res, next) => {
  try {
    const { startDate, endDate, format = 'json' } = req.query;

    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    }

    // Aggregate comprehensive data
    const report = await Patient.aggregate([
      { $match: dateFilter },
      {
        $lookup: {
          from: 'appointments',
          localField: '_id',
          foreignField: 'patient',
          as: 'appointments',
        },
      },
      {
        $lookup: {
          from: 'prescriptions',
          localField: '_id',
          foreignField: 'patient',
          as: 'prescriptions',
        },
      },
      {
        $lookup: {
          from: 'doctors',
          localField: 'appointments.doctor',
          foreignField: '_id',
          as: 'doctors',
        },
      },
      {
        $project: {
          name: 1,
          age: 1,
          gender: 1,
          status: 1,
          phone: '$contactInfo.phone',
          email: '$contactInfo.email',
          address: '$contactInfo.address',
          bloodGroup: '$medicalHistory.bloodGroup',
          allergies: '$medicalHistory.allergies',
          chronicConditions: '$medicalHistory.chronicConditions',
          appointmentCount: { $size: '$appointments' },
          prescriptionCount: { $size: '$prescriptions' },
          lastAppointment: { $max: '$appointments.appointmentDate' },
          createdAt: 1,
        },
      },
      {
        $sort: { appointmentCount: -1 },
      },
    ]);

    if (format === 'csv') {
      // Convert to CSV
      const csvHeader = 'Name,Age,Gender,Phone,Email,City,Blood Group,Status,Appointments,Prescriptions,Last Appointment,Created At\n';
      const csvRows = report.map(patient => {
        return [
          `"${patient.name || ''}"`,
          patient.age || '',
          patient.gender || '',
          patient.phone || '',
          patient.email || '',
          patient.address?.city || '',
          patient.bloodGroup || '',
          patient.status || '',
          patient.appointmentCount || 0,
          patient.prescriptionCount || 0,
          patient.lastAppointment ? new Date(patient.lastAppointment).toLocaleDateString() : '',
          patient.createdAt ? new Date(patient.createdAt).toLocaleDateString() : '',
        ].join(',');
      }).join('\n');

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename=hospital_report_${new Date().toISOString().split('T')[0]}.csv`);
      res.send('\ufeff' + csvHeader + csvRows); // BOM for Excel compatibility
    } else {
      // JSON format - send as downloadable file
      const jsonData = JSON.stringify({
        success: true,
        count: report.length,
        generatedAt: new Date(),
        dateRange: {
          startDate: startDate || 'All time',
          endDate: endDate || 'All time',
        },
        data: report,
      }, null, 2);

      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename=hospital_report_${new Date().toISOString().split('T')[0]}.json`);
      res.send(jsonData);
    }
  } catch (error) {
    next(error);
  }
};

