const Patient = require('../models/Patient');

// @desc    Get all patients with advanced filtering, sorting, and aggregation
// @route   GET /api/patients
// @access  Private
exports.getPatients = async (req, res, next) => {
  try {
    const {
      search,
      status,
      gender,
      minAge,
      maxAge,
      bloodGroup,
      city,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
      groupBy,
      aggregate,
    } = req.query;

    const query = {};

    // Text search (uses MongoDB text index if available)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { 'contactInfo.phone': { $regex: search, $options: 'i' } },
        { 'contactInfo.email': { $regex: search, $options: 'i' } },
        { $text: { $search: search } }, // Full-text search if index exists
      ];
    }

    // Status filter
    if (status) {
      query.status = status;
    }

    // Gender filter
    if (gender) {
      query.gender = gender;
    }

    // Age range filter
    if (minAge || maxAge) {
      query.age = {};
      if (minAge) query.age.$gte = parseInt(minAge);
      if (maxAge) query.age.$lte = parseInt(maxAge);
    }

    // Blood group filter
    if (bloodGroup) {
      query['medicalHistory.bloodGroup'] = bloodGroup;
    }

    // City filter
    if (city) {
      query['contactInfo.address.city'] = { $regex: city, $options: 'i' };
    }

    // Aggregation pipeline for grouped data
    if (groupBy) {
      const groupField = groupBy === 'status' ? '$status' :
                        groupBy === 'gender' ? '$gender' :
                        groupBy === 'city' ? '$contactInfo.address.city' :
                        groupBy === 'bloodGroup' ? '$medicalHistory.bloodGroup' : null;

      if (groupField) {
        const aggregation = await Patient.aggregate([
          { $match: query },
          {
            $group: {
              _id: groupField,
              count: { $sum: 1 },
              patients: { $push: '$$ROOT' },
            },
          },
          {
            $sort: { count: -1 },
          },
        ]);

        return res.status(200).json({
          success: true,
          data: aggregation,
        });
      }
    }

    // Advanced aggregation queries
    if (aggregate) {
      let aggregationPipeline = [{ $match: query }];

      switch (aggregate) {
        case 'stats':
          aggregationPipeline.push({
            $group: {
              _id: null,
              total: { $sum: 1 },
              avgAge: { $avg: '$age' },
              minAge: { $min: '$age' },
              maxAge: { $max: '$age' },
              byGender: {
                $push: {
                  gender: '$gender',
                  age: '$age',
                },
              },
            },
          });
          break;

        case 'ageDistribution':
          aggregationPipeline.push({
            $bucket: {
              groupBy: '$age',
              boundaries: [0, 18, 30, 45, 60, 75, 100],
              default: '100+',
              output: {
                count: { $sum: 1 },
                patients: { $push: { name: '$name', age: '$age' } },
              },
            },
          });
          break;

        case 'chronicConditions':
          aggregationPipeline.push(
            { $unwind: { path: '$medicalHistory.chronicConditions', preserveNullAndEmptyArrays: true } },
            {
              $group: {
                _id: '$medicalHistory.chronicConditions',
                count: { $sum: 1 },
                patients: { $push: '$name' },
              },
            },
            { $match: { _id: { $ne: null } } },
            { $sort: { count: -1 } }
          );
          break;
      }

      const result = await Patient.aggregate(aggregationPipeline);
      return res.status(200).json({
        success: true,
        data: result,
      });
    }

    // Sorting
    const sortOptions = {};
    const validSortFields = ['name', 'age', 'createdAt', 'status', 'gender'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    sortOptions[sortField] = sortOrder === 'asc' ? 1 : -1;

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query with sorting and pagination
    const patients = await Patient.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .lean(); // Use lean() for better performance

    const total = await Patient.countDocuments(query);

    // Get additional statistics
    const stats = await Patient.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          avgAge: { $avg: '$age' },
          minAge: { $min: '$age' },
          maxAge: { $max: '$age' },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      count: patients.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      stats: stats[0] || {},
      data: patients,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single patient
// @route   GET /api/patients/:id
// @access  Private
exports.getPatient = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
      });
    }

    res.status(200).json({
      success: true,
      data: patient,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create patient
// @route   POST /api/patients
// @access  Private
exports.createPatient = async (req, res, next) => {
  try {
    const patient = await Patient.create(req.body);

    res.status(201).json({
      success: true,
      data: patient,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update patient
// @route   PUT /api/patients/:id
// @access  Private
exports.updatePatient = async (req, res, next) => {
  try {
    let patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
      });
    }

    patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: patient,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete patient
// @route   DELETE /api/patients/:id
// @access  Private (Admin only)
exports.deletePatient = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
      });
    }

    await patient.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Patient deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

