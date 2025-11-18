const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
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
  appointmentDate: {
    type: Date,
    required: [true, 'Appointment date is required'],
  },
  appointmentTime: {
    type: String,
    required: [true, 'Appointment time is required'],
    // Format: "HH:MM" (e.g., "14:30")
  },
  duration: {
    type: Number,
    default: 30, // Duration in minutes
    min: 15,
    max: 240,
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Confirmed', 'In Progress', 'Completed', 'Cancelled', 'No Show'],
    default: 'Scheduled',
  },
  reason: {
    type: String,
    trim: true,
  },
  notes: {
    type: String,
    trim: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

// Compound index to prevent overlapping appointments
appointmentSchema.index({ doctor: 1, appointmentDate: 1, appointmentTime: 1 });

// Indexes for faster queries and analytics
appointmentSchema.index({ patient: 1, appointmentDate: -1 });
appointmentSchema.index({ status: 1, appointmentDate: 1 });
appointmentSchema.index({ appointmentDate: 1, status: 1 }); // Date range queries
appointmentSchema.index({ doctor: 1, status: 1, appointmentDate: 1 }); // Doctor analytics
appointmentSchema.index({ createdAt: -1 }); // Default sorting

// Pre-save middleware to check for overlapping appointments
appointmentSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('appointmentDate') || this.isModified('appointmentTime') || this.isModified('doctor')) {
    const Appointment = this.constructor;
    const startTime = this.appointmentTime;
    const duration = this.duration || 30;
    
    // Calculate end time
    const [hours, minutes] = startTime.split(':').map(Number);
    const startMinutes = hours * 60 + minutes;
    const endMinutes = startMinutes + duration;
    const endHours = Math.floor(endMinutes / 60);
    const endMins = endMinutes % 60;
    const endTime = `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
    
    // Check for overlapping appointments on the same date
    const sameDate = new Date(this.appointmentDate);
    sameDate.setHours(0, 0, 0, 0);
    const nextDate = new Date(sameDate);
    nextDate.setDate(nextDate.getDate() + 1);
    
    const overlapping = await Appointment.find({
      doctor: this.doctor,
      appointmentDate: {
        $gte: sameDate,
        $lt: nextDate,
      },
      status: { $nin: ['Cancelled', 'No Show'] },
      _id: { $ne: this._id },
    });
    
    for (const apt of overlapping) {
      const [aptHours, aptMinutes] = apt.appointmentTime.split(':').map(Number);
      const aptStartMinutes = aptHours * 60 + aptMinutes;
      const aptDuration = apt.duration || 30;
      const aptEndMinutes = aptStartMinutes + aptDuration;
      
      // Check if time ranges overlap
      if (
        (startMinutes < aptEndMinutes && endMinutes > aptStartMinutes)
      ) {
        return next(new Error(`Appointment overlaps with existing appointment (${apt.appointmentTime})`));
      }
    }
  }
  next();
});

module.exports = mongoose.model('Appointment', appointmentSchema);

