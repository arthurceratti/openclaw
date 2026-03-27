const mongoose = require('mongoose');

// User View Model
const UserView = mongoose.model('UserView', {
  id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  userId: { type: String, required: true, unique: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true, unique: true },
  userPassword: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = UserView;
