const Prescription = require('../models/Prescription');

// @desc    Get all prescriptions
// @route   GET /api/prescriptions
// @access  Private
exports.getPrescriptions = async (req, res, next) => {
  try {
    const { patient, doctor, status, page = 1, limit = 10 } = req.query;
    const query = {};

    // Filters
    if (patient) query.patient = patient;
    if (doctor) query.doctor = doctor;
    if (status) query.status = status;

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const prescriptions = await Prescription.find(query)
      .populate('patient', 'name age gender')
      .populate('doctor', 'name specialty')
      .populate('appointment', 'appointmentDate appointmentTime')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Prescription.countDocuments(query);

    res.status(200).json({
      success: true,
      count: prescriptions.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: prescriptions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single prescription
// @route   GET /api/prescriptions/:id
// @access  Private
exports.getPrescription = async (req, res, next) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate('patient')
      .populate('doctor')
      .populate('appointment');

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found',
      });
    }

    res.status(200).json({
      success: true,
      data: prescription,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create prescription
// @route   POST /api/prescriptions
// @access  Private
exports.createPrescription = async (req, res, next) => {
  try {
    const prescription = await Prescription.create(req.body);

    await prescription.populate('patient', 'name age gender');
    await prescription.populate('doctor', 'name specialty');

    res.status(201).json({
      success: true,
      data: prescription,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update prescription
// @route   PUT /api/prescriptions/:id
// @access  Private
exports.updatePrescription = async (req, res, next) => {
  try {
    let prescription = await Prescription.findById(req.params.id);

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found',
      });
    }

    prescription = await Prescription.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('patient', 'name age gender')
      .populate('doctor', 'name specialty');

    res.status(200).json({
      success: true,
      data: prescription,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete prescription
// @route   DELETE /api/prescriptions/:id
// @access  Private
exports.deletePrescription = async (req, res, next) => {
  try {
    const prescription = await Prescription.findById(req.params.id);

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found',
      });
    }

    await prescription.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Prescription deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

