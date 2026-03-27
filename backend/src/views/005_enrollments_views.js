const mongoose = require('mongoose');

// Enrollment View Model
const EnrollmentView = mongoose.model('EnrollmentView', {
  id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  enrollmentId: { type: String, required: true, unique: true },
  studentId: { type: String, required: true },
  courseId: { type: String, required: true },
  enrollmentDate: { type: Date, default: Date.now },
  grade: { type: String },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = EnrollmentView;
