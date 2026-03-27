const mongoose = require('mongoose');

// Assignment View Model
const AssignmentView = mongoose.model('AssignmentView', {
  id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  assignmentId: { type: String, required: true, unique: true },
  assignmentTitle: { type: String, required: true },
  assignmentDescription: { type: String },
  assignmentDueDate: { type: Date },
  maxPoints: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = AssignmentView;
