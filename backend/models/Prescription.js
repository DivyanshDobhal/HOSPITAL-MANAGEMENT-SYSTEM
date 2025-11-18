const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: [true, 'Patient is required'],
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: [true, 'Doctor is required'],
  },
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
  },
  medications: [{
    name: {
      type: String,
      required: true,
      trim: true,
    },
    dosage: {
      type: String,
      required: true,
      trim: true,
      // e.g., "500mg", "10ml"
    },
    frequency: {
      type: String,
      required: true,
      trim: true,
      // e.g., "Twice daily", "Once a day", "Every 6 hours"
    },
    duration: {
      type: String,
      required: true,
      trim: true,
      // e.g., "7 days", "2 weeks", "Until finished"
    },
    instructions: {
      type: String,
      trim: true,
      // e.g., "Take with food", "Before meals"
    },
  }],
  diagnosis: {
    type: String,
    trim: true,
  },
  notes: {
    type: String,
    trim: true,
  },
  followUpDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['Active', 'Completed', 'Cancelled'],
    default: 'Active',
  },
}, {
  timestamps: true,
});

// Index for faster queries
prescriptionSchema.index({ patient: 1, createdAt: -1 });
prescriptionSchema.index({ doctor: 1, createdAt: -1 });

module.exports = mongoose.model('Prescription', prescriptionSchema);

