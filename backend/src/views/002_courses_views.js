const mongoose = require('mongoose');

// Course View Model
const CourseView = mongoose.model('CourseView', {
  id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  courseId: { type: String, required: true, unique: true },
  courseName: { type: String, required: true },
  courseDescription: { type: String },
  courseCode: { type: String },
  credits: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = CourseView;
