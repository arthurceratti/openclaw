/**
 * Indexes for Students Model
 * @author arthurceratti
 * @date 2026-03-27
 */

const studentsModel = require('../models/students');

// Index by studentName
studentsModel.index('studentName', { text: 'studentName' });

// Index by email
studentsModel.index('email', { unique: true, text: 'email' });

// Index by course
studentsModel.index('course', { text: 'course' });

module.exports = studentsModel;
