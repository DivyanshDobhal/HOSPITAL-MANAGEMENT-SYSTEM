const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  mimetype: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  relatedTo: {
    type: String,
    enum: ['patient', 'doctor', 'appointment', 'prescription', 'general'],
    default: 'general',
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  description: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

// Index for faster queries
fileSchema.index({ uploadedBy: 1, createdAt: -1 });
fileSchema.index({ relatedTo: 1, relatedId: 1 });

module.exports = mongoose.model('File', fileSchema);

