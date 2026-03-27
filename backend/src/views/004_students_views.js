const mongoose = require('mongoose');

// Student View Model
const StudentView = mongoose.model('StudentView', {
  id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  studentId: { type: String, required: true, unique: true },
  studentName: { type: String, required: true },
  studentEmail: { type: String, required: true, unique: true },
  studentPassword: { type: String, required: true },
  enrollmentDate: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = StudentView;
