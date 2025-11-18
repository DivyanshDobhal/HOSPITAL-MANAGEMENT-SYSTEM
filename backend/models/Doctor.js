const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Doctor name is required'],
    trim: true,
  },
  specialty: {
    type: String,
    required: [true, 'Specialty is required'],
    trim: true,
    enum: [
      'Cardiology',
      'Neurology',
      'Orthopedics',
      'Pediatrics',
      'Dermatology',
      'Oncology',
      'Psychiatry',
      'General Medicine',
      'Surgery',
      'Emergency Medicine',
      'Radiology',
      'Anesthesiology',
      'Other',
    ],
  },
  contactInfo: {
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
    },
  },
  qualifications: [String],
  licenseNumber: {
    type: String,
    unique: true,
    sparse: true,
  },
  experience: {
    type: Number,
    min: 0,
  },
  availability: {
    days: [{
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    }],
    startTime: String, // Format: "09:00"
    endTime: String,   // Format: "17:00"
  },
  status: {
    type: String,
    enum: ['Active', 'On Leave', 'Inactive'],
    default: 'Active',
  },
}, {
  timestamps: true,
});

// Index for faster searches
doctorSchema.index({ name: 'text', specialty: 'text' });

module.exports = mongoose.model('Doctor', doctorSchema);

