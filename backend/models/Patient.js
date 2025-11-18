const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Patient name is required'],
    trim: true,
  },
  age: {
    type: Number,
    required: [true, 'Patient age is required'],
    min: [0, 'Age cannot be negative'],
    max: [150, 'Please enter a valid age'],
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: ['Male', 'Female', 'Other'],
  },
  contactInfo: {
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    email: {
      type: String,
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
  medicalHistory: {
    allergies: [String],
    chronicConditions: [String],
    previousSurgeries: [String],
    medications: [String],
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'],
    },
  },
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String,
  },
  status: {
    type: String,
    enum: ['Active', 'Discharged', 'Deceased'],
    default: 'Active',
  },
}, {
  timestamps: true,
});

// Indexes for faster searches and queries
patientSchema.index({ name: 'text', 'contactInfo.phone': 'text', 'contactInfo.email': 'text' }); // Text search
patientSchema.index({ status: 1, createdAt: -1 }); // Status and date sorting
patientSchema.index({ age: 1 }); // Age filtering
patientSchema.index({ gender: 1 }); // Gender filtering
patientSchema.index({ 'contactInfo.address.city': 1 }); // City filtering
patientSchema.index({ 'medicalHistory.bloodGroup': 1 }); // Blood group filtering
patientSchema.index({ createdAt: -1 }); // Default sorting

module.exports = mongoose.model('Patient', patientSchema);

